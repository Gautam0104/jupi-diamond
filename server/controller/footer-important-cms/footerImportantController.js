import footerImportantService from "../../services/footer-important-cms/footerImportantService.js";
import { successResponse } from "../../utils/responseHandler.js";
const cmsController = {
  async getPageBySlug(req, res) {
    try {
      const { slug } = req.params;
      const page = await footerImportantService.getPageBySlug(slug);
      if (!page) return res.status(404).json({ message: "Page not found" });
      return successResponse(res, 200, "page fetched successfully", page);
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async getAllPages(req, res) {
    try {
      const pages = await footerImportantService.getAllPages();
      console.log("pages=", pages);
      if (!pages) return res.status(404).json({ message: "Pages not found" });
      return successResponse(res, 200, "pages fetched successfully", pages);
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async createPage(req, res) {
    try {
      const { slug, content } = req.body;
      const trimSlug = slug.trim().toLowerCase();
      if (!slug || !content) {
        return res
          .status(400)
          .json({ message: "Slug and content are required." });
      }

      const existing = await footerImportantService.getPageBySlug(trimSlug);
      if (existing) {
        return res.status(409).json({ message: "This Page already exists." });
      }

      const page = await footerImportantService.createPage({
        slug: trimSlug,
        content,
      });
      return successResponse(res, 201, "page created successfully", page);
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async getPageById(req, res) {
  try {
    const { id } = req.params;
    const page = await footerImportantService.getPageById(id);
    if (!page) return res.status(404).json({ message: "Page not found" });
    return successResponse(res, 200, "page fetched successfully", page);
  } catch (error) {
    return res.json({
      statusCode: error.statusCode,
      message: error.message,
      success: false,
      code: error.code,
    });
  }
},

  async updatePage(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Content is required." });
      }

      const page = await footerImportantService.updatePage(id, { content });
      if (!page) return res.status(404).json({ message: "Page not found" });
      return successResponse(res, 200, "page updated successfully", page);
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async deletePage(req, res) {
    try {
      const { id } = req.params;
      const page = await footerImportantService.deletePage(id);
      if (!page) return res.status(404).json({ message: "Page not found" });
      return successResponse(res, 200, "page deleted successfully", page);
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },
};
export default cmsController;
