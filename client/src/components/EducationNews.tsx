import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import FeaturedNewsItem from "./FeaturedNewsItem";
import NewsCard from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { useInView } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

interface NewsItem {
  id: string | number;
  title: string;
  summary: string;
  slug: string;
  publishDate: string;
  image: string;
  category: string;
  isFeatured: boolean;
}

const EducationNews = () => {
  const { data: newsItems = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
  });
  
  const [api, setApi] = useState<CarouselApi>();
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const intervalRef = useRef<number | null>(null);
  
  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 1023px)");
  
  const featuredNews = newsItems.filter((news) => news.isFeatured);
  const regularNews = newsItems.filter((news) => !news.isFeatured).slice(0, 2);

  // Setup auto-scrolling when carousel is in view (only for mobile)
  useEffect(() => {
    if (!isMobile || !api || featuredNews.length <= 1) {
      // Clear interval if conditions aren't met
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    // Start auto-scrolling when in view on mobile
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    // Cleanup interval
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [api, featuredNews.length, isMobile]);

  return (
    <section className="py-12 bg-background" ref={sectionRef}>
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Education News</h2>
            <Link href="/news">
              <motion.div 
                className="text-primary hover:text-primary/90 font-medium flex items-center cursor-pointer"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                View all
                <ChevronRight className="h-5 w-5 ml-1" />
              </motion.div>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Loading skeletons */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
                <Skeleton className="h-64 md:h-80 w-full" />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-4 w-32 ml-2" />
                  </div>
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
                  <div className="flex flex-col sm:flex-row lg:flex-col">
                    <Skeleton className="h-48 sm:w-1/3 lg:w-full lg:h-40" />
                    <div className="p-4 sm:w-2/3 lg:w-full">
                      <div className="flex items-center mb-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-4 w-28 ml-2" />
                      </div>
                      <Skeleton className="h-6 w-full mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Mobile View - Carousel */}
            <div className="lg:hidden" ref={carouselRef}>
              {featuredNews.length > 0 && (
                <motion.div 
                  className="w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Carousel
                    opts={{
                      align: "start",
                      loop: true,
                      skipSnaps: false,
                    }}
                    setApi={setApi}
                    className="w-full"
                  >
                    <CarouselContent>
                      {featuredNews.map((news) => (
                        <CarouselItem key={news.id} className="basis-full">
                          <FeaturedNewsItem
                            title={news.title}
                            summary={news.summary}
                            slug={news.slug}
                            publishDate={news.publishDate}
                            image={news.image}
                            category={news.category}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    
                    {featuredNews.length > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        <CarouselPrevious className="static transform-none h-9 w-9 mr-2" />
                        <CarouselNext className="static transform-none h-9 w-9" />
                      </div>
                    )}
                  </Carousel>
                </motion.div>
              )}
              <motion.div 
                className="space-y-6 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {regularNews.map((news) => (
                  <NewsCard
                    key={news.id}
                    title={news.title}
                    summary={news.summary}
                    slug={news.slug}
                    publishDate={news.publishDate}
                    image={news.image}
                    category={news.category}
                    layout="horizontal"
                  />
                ))}
              </motion.div>
            </div>
            
            {/* Desktop View - Grid Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {featuredNews.length > 0 && (
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <FeaturedNewsItem
                    title={featuredNews[0].title}
                    summary={featuredNews[0].summary}
                    slug={featuredNews[0].slug}
                    publishDate={featuredNews[0].publishDate}
                    image={featuredNews[0].image}
                    category={featuredNews[0].category}
                  />
                </motion.div>
              )}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {regularNews.map((news) => (
                  <NewsCard
                    key={news.id}
                    title={news.title}
                    summary={news.summary}
                    slug={news.slug}
                    publishDate={news.publishDate}
                    image={news.image}
                    category={news.category}
                    layout="horizontal"
                  />
                ))}
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
};

export default EducationNews;



