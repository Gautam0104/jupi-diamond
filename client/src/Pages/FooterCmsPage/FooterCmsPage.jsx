import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchFooterCmsPage } from "../../api/Public/publicApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

const FooterCmsPage = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPageData = async () => {
    try {
      setLoading(true);
       setError(null);
      setPageData(null);
      const response = await fetchFooterCmsPage(slug);

      if (response.status === 200) {
        setPageData(response.data.data);
      } else {
        setError("Page not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch page");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      fetchPageData(slug);
    }

    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div>
        <div className="container mx-auto py-8 text-center max-w-7xl">
          <Card className={"shadow-none border-none"}>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                <Skeleton className="h-9 w-[300px]" />
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8">
              <section className="space-y-4">
                <Skeleton className="h-6 w-full max-w-[500px]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full max-w-[400px]" />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  <Skeleton className="h-7 w-[200px]" />
                </h2>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-[600px]" />
                  <Skeleton className="h-4 w-full max-w-[550px]" />
                </div>
              </section>

              {/* Use Of This Site Section */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  <Skeleton className="h-7 w-[200px]" />
                </h2>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full max-w-[650px]" />
                  <div className="pl-4 space-y-2">
                    <Skeleton className="h-4 w-full max-w-[500px]" />
                    <Skeleton className="h-4 w-full max-w-[550px]" />
                    <Skeleton className="h-4 w-full max-w-[450px]" />
                    <Skeleton className="h-4 w-full max-w-[600px]" />
                    <Skeleton className="h-4 w-full max-w-[400px]" />
                    <Skeleton className="h-4 w-full max-w-[500px]" />
                  </div>
                  <Skeleton className="h-4 w-full max-w-[600px]" />
                  <Skeleton className="h-4 w-full max-w-[550px]" />
                </div>
              </section>

              {/* Account Section */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  <Skeleton className="h-7 w-[120px]" />
                </h2>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full max-w-[700px]" />
                  <Skeleton className="h-4 w-full max-w-[650px]" />
                  <Skeleton className="h-4 w-full max-w-[600px]" />
                  <Skeleton className="h-4 w-full max-w-[550px]" />
                  <Skeleton className="h-4 w-full max-w-[500px]" />
                </div>
              </section>

              {/* User Content Section */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  <Skeleton className="h-7 w-[150px]" />
                </h2>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div
        className="min-h-screen px-6 flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/not-found-bg.jpg)" }}
      >
        <div className="bg-brown bg-opacity-50 p-6 sm:p-12 rounded-lg backdrop-blur-sm">
          <h1 className="text-2xl sm:text-4xl lg:text-3xl xl:text-4xl font-bold text-white mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-sm sm:text-lg lg:text-md xl:text-lg text-white mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            className="px-6 py-3 bg-white text-xs sm:text-sm md:text-sm xl:text-base  text-brown font-medium rounded-lg transition duration-300"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container  max-w-7xl mx-auto px-6 sm:px-4 lg:px-12 py-6 sm:py-12 bg-white  text-[#27282C] tracking-wide leading-relaxed">
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
    </div>
  );
};

export default FooterCmsPage;
