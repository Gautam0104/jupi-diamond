import prisma from "../../config/prismaClient.js";

const footerImportantService = {
  async getPageBySlug(slug) {
    return await prisma.footerImportantLinkCMS.findUnique({ where: { slug } });
  },

  async getAllPages() {
    const pages = await prisma.footerImportantLinkCMS.findMany();
    console.log("pages=", pages);
    return pages;
  },

  async createPage(data) {
    return await prisma.footerImportantLinkCMS.create({ data });
  },

  async getPageById(id) {
    return await prisma.footerImportantLinkCMS.findUnique({ where: { id } });
  },

  async updatePage(id, data) {
    try {
      const page = await prisma.footerImportantLinkCMS.findUnique({
        where: { id },
      });
      if (!page) throw new Error("This page not found!");

      return await prisma.footerImportantLinkCMS.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async deletePage(id) {
    try {
      const page = await prisma.footerImportantLinkCMS.findUnique({
        where: { id },
      });
      if (!page) throw new Error("This page not found!");
      return await prisma.footerImportantLinkCMS.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },
};

export default footerImportantService;
