import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import ButtonLoading from "@/components/Loaders/ButtonLoading";
import {
  getBlogs,
  getBlogsBySlug,
  getFeaturedBlogs,
} from "../../api/Public/publicApi";
import { Skeleton } from "../../components/ui/skeleton";

const BlogDetail = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const blogResponse = await getBlogsBySlug(slug);
        if (blogResponse.data?.success) {
          setBlog(blogResponse.data.data);

          const res = await getFeaturedBlogs();
          if (res.status === 200) {
            setFeatured(res.data?.data?.featuredBlogs || []);
          }
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        console.log("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white max-w-[1500px] mx-auto">
        <div className="pt-6 pb-6 md:px-10 px-4 w-full mx-auto">
          <div className="mb-4 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full md:h-10 xl:h-12" />
          </div>

          <div className="mb-8 space-y-4">
            <Skeleton className="w-full h-64 sm:h-80 md:h-[500px]" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
            <div className="lg:w-[70%] space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-[30%]">
              <div className="lg:sticky top-1 lg:h-[calc(100vh-1rem)]">
                <Skeleton className="h-6 w-1/3 mb-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="relative overflow-hidden">
                      <Skeleton className="w-full h-40" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                        <Skeleton className="h-3 w-full bg-white/80" />
                        <Skeleton className="h-3 w-1/2 bg-white/80" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`pt-[90px] bg-white`}>
        <div className="flex justify-center items-center h-screen text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={`pt-[90px] bg-white`}>
        <div className="flex justify-center items-center h-screen">
          Blog not found
        </div>
      </div>
    );
  }

  return (
    <div className={` bg-white max-w-[1500px] mx-auto`}>
      <div className="pt-6 pb-6 md:px-10 px-4 w-full  mx-auto">
        <div className="mb-4">
          <h3 className=" text-sm font-medium border-b border-black pb-2">
            <Link to="/blogs">Blogs</Link> / {blog.category?.name}
          </h3>
          <h1 className="text-lg md:text-2xl xl:text-3xl  font-medium pt-2 ">
            {blog.title}
          </h1>
        </div>

        <div className="mb-8 space-y-4">
          <div>
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto max-h-[500px] object-contain "
            />
          </div>
          <div className="flex barlow justify-between text-xs sm:text-sm font-medium items-center text-black">
            <div>
              <span>By {blog.author?.name || "Unknown Author"}</span>
            </div>
            <div className="barlow">
              <span>{format(new Date(blog.publishedAt), "MMMM dd, yyyy")}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-24">
          <div className="lg:w-[70%]">
            <div
              className="prose jodit-wysiwyg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {blog.author && (
              <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex items-start gap-4">
                  {blog.author.avatar && (
                    <img
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div></div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-[30%]">
            <div className="lg:sticky bg-white top-1 lg:h-[calc(100vh-1rem)] overflow-y-auto scrollbarWidthNone">
              <h2 className="text-xl font-semibold mb-4">Featured Post</h2>
              <div className="mb-6 bg-white px-0 space-y-2 text-sm xl:text-base">
                {featured.map((featured) => (
                  <Link
                    key={featured.id}
                    to={`/blogs/${featured.slug}`}
                    className=" overflow-hidden my-4 group block transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
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

export default BlogDetail;
