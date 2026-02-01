import { axiosPrivate } from "../axios";


export const createBlogCategory = (data) => {
  return axiosPrivate.post(`/blogs/category/create`, data);
};
export const fetchBlogCategory = () => {
  return axiosPrivate.get(`/blogs/category/fetch/all`);
};

export const fetchBlogCategoryById = (id) => {
  return axiosPrivate.get(`/blogs/category/fetch/${id}`);
};
export const updateBlogCategory = (id, data) => {
  return axiosPrivate.patch(`/blogs/category/update/${id}`, data);
};
export const deleteBlogCategory = (id) => {
  return axiosPrivate.delete(`/blogs/category/delete/${id}`);
};
export const toggleBlogCategoryStatus = (id) => {
  return axiosPrivate.patch(`/blogs/category/status/${id}`);
}


export const createBlog = (data) => {
  return axiosPrivate.post(`/blogs/create`, data);
};

export const fetchAllBlogs = (params={}) => {
  return axiosPrivate.get(`/blogs/fetch/all`,{params});
}
export const fetchBlogById = (id) => {
  return axiosPrivate.get(`/blogs/fetch/${id}`);
}
export const fetchBlogsByCategory = (categorySlug) => {
  return axiosPrivate.get(`/blogs/category/${categorySlug}`);
}
export const updateBlog = (id, data) => {
  return axiosPrivate.patch(`/blogs/update/${id}`, data);
};
export const deleteBlog = (id) => {
  return axiosPrivate.delete(`/blogs/delete/${id}`);
}
export const toggleBlogStatus = (id) => {
  return axiosPrivate.patch(`/blogs/status/blog/${id}`);
}



export const toggleBlogFeaturedStatus = (id) => {
  return axiosPrivate.patch(`/blogs/featured/blog/${id}`);
}
