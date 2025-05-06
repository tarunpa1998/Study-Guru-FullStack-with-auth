import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener
    mediaQuery.addEventListener("change", listener);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}