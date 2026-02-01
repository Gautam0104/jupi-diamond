import slugify from "slugify";
import prisma from "../../config/prismaClient.js";

const categoryService = {
  async createCategory(data) {
    const { name, slug, description, image } = data;
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (existing) throw new Error("Category with similar name already exists");

    return await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl: image[0]?.url,
      },
    });
  },

  async getAllCategories() {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  },

  async getCategoryById(id) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error("Category not found");
    return category;
  },

  async updateCategory(id, data) {
    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.name
          ? slugify(data.name, { lower: true, strict: true })
          : undefined,
        description: data.description,
        imageUrl: data?.image[0]?.url,
      },
    });
    return updated;
  },

  async deleteCategory(id) {
    return await prisma.category.delete({ where: { id } });
  },
  async toggleCategoryStatus(id) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing)
      throw new Error(
        "Unable to locate the specified category. Please verify the category ID and try again."
      );
    return await prisma.category.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
  },
};

export default categoryService;
