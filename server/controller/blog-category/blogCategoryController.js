import slugify from "slugify";
import categoryService from "../../services/blog-category/blogCategoryService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";

const categoryController = {
  async createCategory(req, res) {
    const { name, description } = req.body;

    const image = req.files && (await uploadFilesToS3(req.files));

    try {
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required. Please provide a valid name.",
        });
      }

      const slug = slugify(name, { lower: true, strict: true });

      const result = await categoryService.createCategory({
        name,
        slug,
        description,
        image,
      });

      return successResponse(res, 201, "Category created successfully", result);
    } catch (error) {
      return res.json({
        statusCode: error.statusCode || 500,
        message: error.message || "Failed to create category",
        success: false,
      });
    }
  },

  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      return successResponse(
        res,
        200,
        "Categories fetched successfully",
        categories
      );
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  async getCategoryById(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      return successResponse(res, 200, "Category fetched", category);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  async updateCategory(req, res) {
    try {
      const image = req.files && (await uploadFilesToS3(req.files));

      const updated = await categoryService.updateCategory(req.params.id, {
        ...req.body,
        image,
      });
      return successResponse(res, 200, "Category updated", updated);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  async deleteCategory(req, res) {
    try {
      const deleted = await categoryService.deleteCategory(req.params.id);
      return successResponse(res, 200, "Category deleted", deleted);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },
  async toggleCategoryStatus(req, res) {
    const id = req.params.id;
    try {
      if (!id) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid category to proceed with the operation.",
        });
      }
      const category = await categoryService.toggleCategoryStatus(id);
      return successResponse(res, 200, "Category status updated", category);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default categoryController;
