import slugify from "slugify";
import blogService from "../../services/blog/blogService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";

const blogController = {
  async createBlogPost(req, res) {
    const authorId = req.session?.admin?.id;
    const { title,description, content, categoryId } = req.body;
    const coverImage = req.files && (await uploadFilesToS3(req.files));
    const coverImageUrl = coverImage?.[0]?.url || null;

    try {
      if (!title ||!description || !content || !categoryId || !authorId) {
        return res
          .status(400)
          .json({ success: false, message: "Missing fields" });
      }

      const slug = slugify(title, { lower: true, strict: true });

      const result = await blogService.createBlogPost({
        title,
        description,
        slug,
        content,
        coverImage: coverImageUrl,
        categoryId,
        authorId,
      });

      return successResponse(res, 201, "Blog created successfully", result);
    } catch (error) {
      return res.json({
        statusCode: error.statusCode || 500,
        message: error.message || "Failed to create blog",
        success: false,
      });
    }
  },



  async getAllBlogs(req, res) {
    try {
      const blogs = await blogService.getAllBlogs(req.query);
      return successResponse(res, 200, "All blogs fetched", blogs);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },



  async getPublicFetchBlogs(req, res) {
    try {
      const blogs = await blogService.getPublicFetchBlogs(req.query);
      return successResponse(res, 200, "All blogs fetched", blogs);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  async getPublicFetchFeaturedBlogs(req, res) {
    try {
      const blogs = await blogService.getPublicFetchFeaturedBlogs(req.query);
      return successResponse(res, 200, "All featured blogs fetched", blogs);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  async getBlogBySlug(req, res) {
    try {
      const blog = await blogService.getBlogBySlug(req.params.slug);
      return successResponse(res, 200, "Blog fetched", blog);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  async getBlogById(req, res) {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      return successResponse(res, 200, "Blog fetched", blog);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  async getBlogsByCategory(req, res) {
    try {
      const blogs = await blogService.getBlogsByCategorySlug(
        req.params.categorySlug
      );
      return successResponse(res, 200, "Blogs by category fetched", blogs);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  // async updateBlogPost(req, res) {
  //   try {
  //     const updated = await blogService.updateBlogPost(req.params.id, req.body);
  //     return successResponse(res, 200, "Blog updated successfully", updated);
  //   } catch (error) {
  //     return res.json({
  //       statusCode: 500,
  //       message: error.message,
  //       success: false,
  //     });
  //   }
  // },

  async updateBlogPost(req, res) {
    try {
      const { id } = req.params;
      const { title,description, content, categoryId } = req.body;

      const coverImages = req.files && (await uploadFilesToS3(req.files));
      const coverImageUrl = coverImages?.[0]?.url || req.body.coverImage;

      const updated = await blogService.updateBlogPost(id, {
        title,
        description,
        content,
        categoryId,
        coverImage: coverImageUrl, 
      });

      return successResponse(res, 200, "Blog updated successfully", updated);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  async deleteBlogPost(req, res) {
    try {
      const deleted = await blogService.deleteBlogPost(req.params.id);
      return successResponse(res, 200, "Blog deleted successfully", deleted);
    } catch (error) {
      return res.json({
        statusCode: 500,
        message: error.message,
        success: false,
      });
    }
  },

  
  async toggleBlogStatus(req, res) {
    const id = req.params.id;
    try {
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Blog ID is required to perform this operation",
        });
      }
      const blog = await blogService.toggleBlogStatus(req.params.id);
      return successResponse(res, 200, "Blog status updated", blog);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

   async toggleBlogFeaturedStatus(req, res) {
    const id = req.params.id;
    try {
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Blog ID is required to perform this operation",
        });
      }
      const blog = await blogService.toggleBlogFeaturedStatus(req.params.id);
      return successResponse(res, 200, "Blog featured status updated", blog);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default blogController;
