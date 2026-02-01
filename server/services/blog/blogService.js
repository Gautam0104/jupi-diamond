import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import { paginate } from "../../utils/pagination.js";

const prisma = new PrismaClient();

const blogService = {
  async createBlogPost(data) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });
    if (existing) throw new Error("Blog with this title already exists");

    return await prisma.blogPost.create({
      data: { ...data, publishedAt: new Date() },
    });
  },

  async getAllBlogs(query) {
    const { search, categorySlug } = query;
    try {
      let whereFilter = {};
      if (search !== undefined && search !== "") {
        whereFilter = {
          OR: [{ title: { contains: search, mode: "insensitive" } }],
        };
      }

      if (categorySlug !== "" && categorySlug !== undefined) {
        whereFilter = {
          ...whereFilter,
          category: { slug: categorySlug },
        };
      }

      const totalCount = await prisma.blogPost.count({ where: whereFilter });
      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const blogs = await prisma.blogPost.findMany({
        where: whereFilter,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      });
      if (blogs.length === 0) throw new Error("No blogs found!");
      return {
        blogs,
        pagination: { page, limit, skip, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },
  async getPublicFetchBlogs(query) {
    try {
      const { search, categorySlug } = query;
      let whereFilter = {
        AND: [{ isActive: true }, { category: { isActive: true } }],
      };

      if (search !== undefined && search !== "") {
        whereFilter = {
          OR: [{ title: { contains: search, mode: "insensitive" } }],
        };
      }

      if (categorySlug !== "" && categorySlug !== undefined) {
        whereFilter = {
          ...whereFilter,
          category: { slug: categorySlug },
        };
      }
      const totalCount = await prisma.blogPost.count({ where: whereFilter });
      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const blogs = await prisma.blogPost.findMany({
        where: whereFilter,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      });

      if (blogs.length === 0) throw new Error("No blogs found!");
      return {
        blogs,
        pagination: { page, limit, skip, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async getPublicFetchFeaturedBlogs(query) {
    try {
      let whereFilter = {
        AND: [{ isActive: true }, { isFeatured: true }],
      };

      const blogs = await prisma.blogPost.findMany({
        where: whereFilter,
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      });

      if (blogs.length === 0) throw new Error("No featured blogs found!");
      return {
        featuredBlogs: blogs,
      };
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async getBlogBySlug(slug) {
    const blog = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        category: true,
      },
    });
    if (!blog) throw new Error("Blog not found");
    return blog;
  },

  async getBlogById(id) {
    const blog = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        category: true,
      },
    });
    if (!blog) throw new Error("Blog not found");
    return blog;
  },

  async getBlogsByCategorySlug(categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        blogs: {
          orderBy: { publishedAt: "desc" },
          include: { author: true },
        },
      },
    });
    if (!category) throw new Error("Category not found");
    return category.blogs;
  },

  async updateBlogPost(id, data) {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new Error("Blog not found");

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        coverImage: data.coverImage,
        categoryId: data.categoryId,
        updatedAt: new Date(),
        slug: data.title
          ? slugify(data.title, { lower: true, strict: true })
          : existing.slug,
      },
    });

    return updated;
  },

  async deleteBlogPost(id) {
    const deleted = await prisma.blogPost.delete({ where: { id } });
    return deleted;
  },
  async toggleBlogStatus(id) {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing)
      throw new Error(
        "Unable to locate the requested blog post. Please verify the ID and try again."
      );
    return await prisma.blogPost.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });
  },

  async toggleBlogFeaturedStatus(id) {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing)
      throw new Error(
        "Unable to locate the requested blog post. Please verify the ID and try again."
      );
    return await prisma.blogPost.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured },
    });
  },
};

export default blogService;
