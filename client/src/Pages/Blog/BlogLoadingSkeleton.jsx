import { Skeleton } from "../../components/ui/skeleton";

const BlogLoadingSkeleton = () => {
  return (
    <div className={`bg-white max-w-[1500px] mx-auto`}>
      <div className="pt-6 pb-6 md:px-10 px-4 w-full">
        <div className="border-b-2 border-gray-700 pb-4">
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="flex lg:gap-5 flex-col lg:flex-row">
          <div className="flex-1">
            {/* Mobile View Skeleton */}
            <div className="lg:hidden">
              <div className="pt-6">
                <div className="relative mb-6 overflow-hidden">
                  <Skeleton className="w-full h-96 rounded-none" />
                  <div className="absolute bottom-4 left-4 right-0 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-white" />
                    <Skeleton className="h-3 w-1/4 bg-white" />
                  </div>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <div className="flex gap-3">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-[45%] h-[150px] overflow-hidden"
                    >
                      <Skeleton className="w-full h-full rounded-none" />
                      <div className="absolute bottom-3 left-3 right-3 space-y-1">
                        <Skeleton className="h-3 w-full bg-white" />
                        <Skeleton className="h-2 w-1/2 bg-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop View Skeleton */}
            <div className="hidden lg:block py-6">
              <div className="flex gap-3 h-[500px] lg:h-[350px] xl:h-[550px] 2xl:h-[600px]">
                <div className="flex-1 h-full">
                  <div className="relative h-full overflow-hidden">
                    <Skeleton className="w-full h-full rounded-none" />
                    <div className="absolute bottom-4 left-4 right-0 space-y-2">
                      <Skeleton className="h-5 w-3/4 bg-white" />
                      <Skeleton className="h-4 w-1/4 bg-white" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-3 h-full">
                  <div className="flex-1 h-1/2">
                    <div className="relative h-full overflow-hidden">
                      <Skeleton className="w-full h-full rounded-none" />
                      <div className="absolute bottom-4 left-4 right-0 space-y-2">
                        <Skeleton className="h-5 w-3/4 bg-white" />
                        <Skeleton className="h-4 w-1/4 bg-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 h-1/2 flex gap-3">
                    {[...Array(2)].map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 relative overflow-hidden"
                      >
                        <Skeleton className="w-full h-full rounded-none" />
                        <div className="absolute bottom-4 left-4 right-0 space-y-2">
                          <Skeleton className="h-5 w-3/4 bg-white" />
                          <Skeleton className="h-4 w-1/4 bg-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Blogs Skeleton */}
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white overflow-hidden">
                    <Skeleton className="w-full h-[150px] md:h-[190px]" />
                    <div className="p-2 sm:p-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-[300px] lg:pl-0 xl:w-[350px] xl:pl-0">
            <div className="pt-6 hidden lg:block">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="mb-6 bg-white space-y-2 text-sm xl:text-base">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="max-w-sm bg-white mx-auto overflow-hidden my-4"
                  >
                    <Skeleton className="w-full h-40 lg:h-40 xl:h-52 rounded-none" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
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
};

export default BlogLoadingSkeleton;
