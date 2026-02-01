import Footer from "@/components/Footer/Footer";
import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getBlogs, getFeaturedBlogs } from "../../api/Public/publicApi";
import { CiCalendar } from "react-icons/ci";
import useFiltration from "../../Hooks/useFilteration";
import PaginationPublic from "../../components/PaginationComponent/PaginationPublic";
import { fetchBlogCategory } from "../../api/Admin/BlogApi";
import { Skeleton } from "../../components/ui/skeleton";
import ButtonLoading from "../../components/Loaders/ButtonLoading";
import BlogLoadingSkeleton from "./BlogLoadingSkeleton";

const Blog = () => {
  const [open, setOpen] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [expand, setExpand] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allBlogsLoaded, setAllBlogsLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const fetchBlogs = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await getBlogs({
        page: 1,
        limit: filters.limit || 7,
      });

      const blogsFromAPI = response?.data?.data?.blogs;

      if (!blogsFromAPI) {
        throw new Error("Invalid API response structure");
      }

      setBlogs(blogsFromAPI);
      setPagination(response.data.data.pagination || {});

      if (blogsFromAPI.length < (filters.limit || 7)) {
        setAllBlogsLoaded(true);
      } else {
        setAllBlogsLoaded(false);
      }

      if (!loadMore) {
        const res = await getFeaturedBlogs();
        setFeatured(res.data.data?.featuredBlogs || []);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message || "Failed to load blogs");
      setBlogs([]);
      setFeatured([]);
    } finally {
      if (loadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  const fetchFeatured = async () => {
    try {
      const res = await getFeaturedBlogs();
      setFeatured(res.data?.data?.featuredBlogs || []);
    } catch (err) {
      console.log("Error fetching categories:", err);
      setFeatured([]);
    }
  };

  const handleLoadMore = () => {
    // Increase limit by 4 when load more is clicked
    handleFilterChangeHook({
      target: {
        name: "limit",
        value: (parseInt(filters.limit) || 7) + 3,
      },
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFeatured();
    fetchBlogs();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [filters.limit]);

  const handleCategoryClick = (category) => {
   
    handleFilterChangeHook({
      target: {
        name: "limit",
        value: 7,
      },
    });
  };

  const handleClearFilter = () => {
    
    handleFilterChangeHook({
      target: {
        name: "limit",
        value: 4,
      },
    });
  };

  if (loading) {
    return <BlogLoadingSkeleton />;
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <div className={` bg-white max-w-[1500px] mx-auto`}>
      <div className="pt-6 pb-6 md:px-10 px-4 w-full">
        <div className="border-b-2 border-gray-700 pb-4">
          <h1 className="text-xl font-semibold">Blogs</h1>
        </div>

        <div className="flex lg:gap-5 flex-col lg:flex-row">
          <div className="flex-1">
            <div className="lg:hidden">
              <div className="py-4">
                {blogs.slice(0, 1).map((blog, index) => (
                  <Link
                    to={`/blogs/${blog.slug}`}
                    key={index}
                    className="relative mb-6 overflow-hidden"
                  >
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-96 object-cover "
                    />
                    <div className="absolute bottom-4 left-4 right-0">
                      <h2 className="text-lg lg:text-sm xl:text-lg text-white font-semibold">
                        {blog.title}
                      </h2>
                      <p className="text-sm text-white">
                        {format(new Date(blog.publishedAt), "dd MMM, yyyy")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div
                className="w-full overflow-x-auto"
                style={{
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div className="flex gap-3">
                  {blogs.slice(1, 4).map((blog, index) => (
                    <Link
                      to={`/blogs/${blog.slug}`}
                      key={index}
                      className="relative flex-shrink-0 w-[45%] h-[150px]  overflow-hidden scroll-snap-align-start"
                    >
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-96 object-fill "
                      />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h2 className="text-xs text-white font-medium sm:font-semibold">
                          {blog.title}
                        </h2>
                        <p className="text-[10px] text-white">
                          {format(new Date(blog.publishedAt), "dd MMM, yyyy")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden lg:block py-4">
              <div className="flex gap-3 h-[500px] lg:h-[350px] xl:h-[550px] 2xl:h-[600px]">
                <div className="flex-1 h-full relative overflow-hidden">
                  {blogs.slice(0, 1).map((blog, index) => (
                    <Link
                      to={`/blogs/${blog.slug}`}
                      key={index}
                      className="relative h-full overflow-hidden group"
                    >
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent via-black/20" />
                      <div className="absolute bottom-4 left-4 right-0 space-y-2">
                        <h2 className="text-lg lg:text-sm xl:text-lg text-white font-medium">
                          {blog.title}
                        </h2>
                        <p className="text-base lg:text-xs xl:text-base text-white/90 font-medium">
                          {format(new Date(blog.publishedAt), "dd MMM, yyyy")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="flex-1 flex flex-col gap-3 h-full">
                  <div className="flex-1 lg:h-[46%] xl:h-[48%] relative overflow-hidden">
                    {blogs.slice(1, 2).map((blog, index) => (
                      <Link
                        to={`/blogs/${blog.slug}`}
                        key={index}
                        className="relative h-full overflow-hidden group"
                      >
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent via-black/20" />
                        <div className="absolute bottom-4 left-4 right-0 space-y-2">
                          <h2 className="text-lg lg:text-sm xl:text-lg text-white font-medium max-w-sm">
                            {blog.title}
                          </h2>
                          <p className="text-base lg:text-xs xl:text-base text-white/90">
                            {format(new Date(blog.publishedAt), "dd MMM, yyyy")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Bottom two blogs - each takes half height */}
                  <div className="flex-1 h-1/2 flex gap-3">
                    {blogs.slice(2, 4).map((blog, index) => (
                      <Link
                        to={`/blogs/${blog.slug}`}
                        key={index}
                        className="flex-1 relative overflow-hidden group"
                      >
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent via-black/20" />
                        <div className="absolute bottom-4 left-4 right-0 space-y-2">
                          <h2 className="text-lg lg:text-xs xl:text-[16px]  text-white font-medium">
                            {blog.title}
                          </h2>
                          <p className="text-sm lg:text-xs xl:text-sm text-white/90">
                            {format(new Date(blog.publishedAt), "dd MMM, yyyy")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Blogs - Only this section will be filtered */}
            <div className="py-4">
              <div className="flex justify-between items-center pb-3 sm:pb-6">
                <h2 className="text-lg sm:text-lg font-semibold text-black">Regular Blogs</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {blogs.length > 0 ? (
                  blogs.slice(4).map((blog, index) => (
                    <Link to={`/blogs/${blog.slug}`} key={index}>
                      <div className="bg-white overflow-hidden group hover:scale-105 hover:shadow-sm transition-all duration-300 ease-in-out">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-[170px] md:h-[190px] object-fill"
                        />
                        <div className="p-2 sm:p-4">
                          <h2 className="text-sm sm:text-sm lg:text-xs xl:text-sm text-black font-medium sm:font-semibold mb-2 line-clamp-3">
                            {blog.title}
                          </h2>
                          <p className="text-[10px] sm:text-sm lg:text-xs xl:text-sm flex items-center gap-1 barlow tracking-wider text-[#6A6A6A] mb-2">
                            <CiCalendar className="size-4" />
                            {format(new Date(blog.publishedAt), "dd MMM, yyyy")}
                          </p>
                          <div
                            className={`text-[12px] sm:text-sm lg:text-[10px] xl:text-sm text-[#6A6A6A] mt-1`}
                          >
                            {blog.description || ""}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10 text-gray-500">
                    No blogs found in this category
                  </div>
                )}
              </div>

              {!allBlogsLoaded && blogs.length > 0 && (
                <div className="col-span-3 text-center py-4">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-4 py-2 bg-brown text-white text-sm cp rounded hover:bg-brown-dark transition-colors"
                  >
                    {loadingMore ? <ButtonLoading /> : "Load More"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-[300px] lg:pl-0 xl:w-[350px] xl:pl-0">
            <div className="sm:pt-6 ">
              <h2 className="text-xl font-semibold mb-4">Featured Post</h2>
              <div className="mb-6 bg-white space-y-2 text-sm xl:text-base">
                {featured.map((featured) => (
                  <Link
                    key={featured.id}
                    to={`/blogs/${featured.slug}`}
                    className="max-w-sm mx-auto overflow-hidden my-4 group block transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={featured.coverImage}
                        alt="Card Image"
                        className="w-full h-40 lg:h-40 xl:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2 sm:p-4 transition-colors duration-300 group-hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-sm max-w-[240px] font-medium sm:font-semibold text-gray-800 group-hover:text-[#C68B73] transition-colors duration-300">
                          {featured.title}
                        </h2>
                        <p className="text-xs text-gray-800 group-hover:text-[#C68B73] transition-colors duration-300">
                          {format(
                            new Date(featured.publishedAt),
                            "dd MMM, yyyy"
                          )}
                        </p>
                      </div>
                      <p className="text-gray-700 text-xs lg:text-xs xl:text-[13px] mt-1">
                        {featured.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
