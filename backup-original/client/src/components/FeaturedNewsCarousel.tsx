import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import FeaturedNewsItem from "./FeaturedNewsItem";

// Define the NewsItem type
interface NewsItem {
  id: string | number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string;
  image?: string;
  category: string;
  isFeatured: boolean;
}

const FeaturedNewsCarousel = () => {
  const { data, isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news']
  });
  
  const allNews: NewsItem[] = data || [];
  const featuredNews = allNews.filter(news => news.isFeatured);
  
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef(null);
  const isInView = useInView(carouselRef, { once: false, amount: 0.3 });
  const intervalRef = useRef<number | null>(null);
  
  // Setup auto-scrolling when carousel is in view
  useEffect(() => {
    if (!api || !isInView || featuredNews.length <= 1) {
      // Clear interval if carousel is not in view
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    // Start auto-scrolling when in view
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [api, isInView, featuredNews.length]);

  const handleViewAll = () => {
    window.location.href = '/news';
  };

  // Skip rendering if there are no featured news
  if (!isLoading && featuredNews.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-foreground">Featured News</h2>
            <motion.div 
              className="text-primary hover:text-primary/90 font-medium flex items-center cursor-pointer"
              onClick={handleViewAll}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              View all
              <ChevronRight className="h-5 w-5 ml-1" />
            </motion.div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-72 w-full rounded-lg md:block hidden" />
          </div>
        ) : (
          <div ref={carouselRef}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.5 }}
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
                    <CarouselItem key={news.id} className="md:basis-1/2 pl-4">
                      <FeaturedNewsItem
                        title={news.title}
                        summary={news.summary}
                        slug={news.slug}
                        publishDate={news.publishDate}
                        image={news.image || ''}
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
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedNewsCarousel;