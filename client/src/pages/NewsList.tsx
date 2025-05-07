import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Filter, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import NewsCard from "@/components/NewsCard";
import FeaturedNewsItem from "@/components/FeaturedNewsItem";
import { useTheme } from "@/contexts/ThemeContext";
import { useMediaQuery } from "@/hooks/use-media-query";

// Define NewsItem interface
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

const NewsList = () => {
  const { theme } = useTheme();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
  // Extract tag from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tagParam = params.get('tag');
    if (tagParam) {
      setFilterCategory(tagParam);
    }
  }, [location]);

  const { data: newsItems = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news']
  });

  // Apply filters
  const filteredNews = newsItems.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "all" ? true : news.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filters
  const uniqueCategories = Array.from(new Set(newsItems.map((n) => n.category)));

  // Get featured news items and regular news
  const allFeaturedNews = newsItems.filter((news) => news.isFeatured === true);
  
  // If we don't have any featured news, use the first news item as featured
  const featuredNews = allFeaturedNews.length > 0 ? allFeaturedNews : (newsItems.length > 0 ? [newsItems[0]] : []);
  
  // Filter regular news based on search and category criteria
  const regularNews = filteredNews.filter((news) => 
    !allFeaturedNews.some(featured => featured.id === news.id));
  
  console.log("Featured news:", featuredNews);
  
  // Carousel setup
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef(null);
  const isInView = useInView(carouselRef, { once: false, amount: 0.3 });
  const intervalRef = useRef<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Set up auto-scrolling
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

  return (
    <>
      <Helmet>
        <title>News | Study Guru</title>
        <meta 
          name="description" 
          content="Stay updated with the latest education news, scholarship announcements, and updates for international students."
        />
      </Helmet>

      <div className="bg-primary-600 py-16 pb-0 pt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-4">Education News</h1>
          <p className="text-primary-100 max-w-2xl">
            Stay updated with the latest education news, scholarship announcements, visa changes, and other important updates for international students.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card shadow-sm rounded-lg p-6 mb-8 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filter News</h2>
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="search" className="mb-2 block">Search</Label>
              <div className="relative">
                <Input 
                  id="search"
                  placeholder="Search by keyword..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="category" className="mb-2 block">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <>
            <Skeleton className="h-80 w-full rounded-lg mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl shadow-sm overflow-hidden border">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-4 w-24 ml-2" />
                    </div>
                    <Skeleton className="h-7 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {featuredNews.length > 0 && (
              <div className="mb-8" ref={carouselRef}>
                <h2 className="text-2xl font-bold mb-4">Featured News</h2>
                
                {/* Desktop view: single featured news */}
                {!isMobile && featuredNews.length > 0 && (
                  <FeaturedNewsItem 
                    title={featuredNews[0].title}
                    summary={featuredNews[0].summary}
                    slug={featuredNews[0].slug}
                    publishDate={featuredNews[0].publishDate}
                    image={featuredNews[0].image}
                    category={featuredNews[0].category}
                  />
                )}
                
                {/* Mobile view: carousel */}
                {isMobile && featuredNews.length > 0 && (
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
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Latest News</h2>
              <p className="text-muted-foreground">{regularNews.length} articles found</p>
            </div>
            
            {regularNews.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No news articles found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to find more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularNews.map((news) => (
                  <NewsCard
                    key={news.id}
                    title={news.title}
                    summary={news.summary}
                    slug={news.slug}
                    publishDate={news.publishDate}
                    image={news.image}
                    category={news.category}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NewsList;




