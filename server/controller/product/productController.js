import productService from "../../services/product/productService.js";
import fs from "fs";
import { parseExcelToProductPayload } from "../../utils/excelParser.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";

const productController = {
  async createProduct(request, response) {
    const {
      name,
      description,
      jewelryTypeId,
      collectionId,
      productStyleId,
      occasionId,
      productVariantData,
      metaTitle,
      metaDescription,
      metaKeywords,
      tags,
    } = request.body;
    try {
      // const parsedVariants = JSON.parse(productVariantData);
      const parsedVariants =
        typeof productVariantData === "string"
          ? JSON.parse(productVariantData)
          : productVariantData;

      const rawFiles = request.files || [];
      // Step 2: Group files by fieldname: 'variant_0', 'variant_1', etc.
      const filesGroupedByField = rawFiles.reduce((acc, file) => {
        if (!acc[file.fieldname]) acc[file.fieldname] = [];
        acc[file.fieldname].push(file);
        return acc;
      }, {});

      // Step 3: Attach image URLs to each variant
      const enrichedVariants = await Promise.all(
        parsedVariants.map(async (variant, index) => {
          const fieldName = `variant_${index}`;
          const variantFiles = filesGroupedByField[fieldName] || [];

          const uploaded = variantFiles.length
            ? await uploadFilesToS3(variantFiles)
            : [];

          const imageUrls = uploaded.map((f) => f.url);

          return {
            ...variant,
            images: imageUrls,
          };
        })
      );

      console.log("enrichedVariants=", enrichedVariants);

      const result = await productService.createProduct({
        name,
        description,
        jewelryTypeId,
        collectionId,
        productStyleId,
        occasionId,
        productVariantData: enrichedVariants,
        metaTitle,
        metaDescription,
        metaKeywords,
        tags,
      });
      return response.status(201).json({
        message: "Product created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Create Product Error: ${error.message}}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        code: error.code,
      });
    }
  },

  async getProduct(request, response) {
    try {
      const result = await productService.getProduct(request.query);
      return response.status(201).json({
        message: "Product fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting Product: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async getProductById(request, response) {
    const { id } = request.params;
    try {
      const result = await productService.getProductById(id);
      return response.status(201).json({
        message: "Product fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting Product: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  //Fetch product by slug...............................................
  async getProductBySlug(request, response) {
    const { productVariantSlug } = request.params;
    try {
      const result = await productService.getProductBySlug(productVariantSlug);
      return response.status(201).json({
        message: "Product fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting Product: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateProduct(request, response) {
    const { id } = request.params;
    const {
      name,
      productSlug,
      description,
      jewelryTypeId,
      collectionId,
      occasionId,
      productStyleId,
      productVariantData,
      metaTitle,
      metaDescription,
      metaKeywords,
      tags,
    } = request.body;

    try {
      const result = await productService.updateProduct({
        id,
        name,
        productSlug,
        description,
        jewelryTypeId,
        collectionId,
        occasionId,
        productStyleId,
        productVariantData,
        metaTitle,
        metaDescription,
        metaKeywords,
        tags,
      });
      return response.status(201).json({
        message: "Product updated successfully",
        data: result,
      });
    } catch (error) {
      // console.error(`Error in Updating Product: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async deleteProduct(request, response) {
    const { id } = request.params;
    try {
      const result = await productService.deleteProduct(id);
      return response.status(201).json({
        message: "Product deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting Product: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async addProductVariant(request, response) {
    const { productId } = request.params;
    const variantData = request.body;

    if (!productId || !variantData || Object.keys(variantData).length === 0) {
      return response.status(400).json({
        message: "Provide a valid product ID and product variant data",
      });
    }

    try {
      const result = await productService.addProductVariant(
        productId,
        variantData
      );
      return response.status(201).json({
        message: "Product Variant added successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in addingProductVariant in Product: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async bulkUploadProductsFromExcel(req, res) {
    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    try {
      const productPayload = parseExcelToProductPayload(filePath);
      const result =
        await productService.bulkCreateProductAndProductVariant(productPayload);

      console.log("result", result);
      console.log("productPayload", productPayload);

      // Delete file after processing
      fs.unlinkSync(filePath);

      res.status(201).json({
        success: true,
        message: "Products uploaded successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in BulkUpload Product: ${error}`);
      
      const prismaError = handlePrismaError(error);
      return res.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //fetch karigar................
  async getKarigar(request, response) {
    try {
      const result = await productService.fetchKarigar();
      return response.status(201).json({
        message: "Karigar fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting Karigar: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
};

export default productController;
