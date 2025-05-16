import { Link } from "wouter";
import logoLightSrc from "../assets/sg light mode logo.png";
import logoTextLightSrc from "../assets/logo black 1200.png";
import logoDarkSrc from "../assets/white SG full.png";
import logoTextDarkSrc from "../assets/Logo white 1200.png";
import { useTheme } from "../contexts/ThemeContext";

interface LogoProps {
  width?: number;
  height?: number;
  withText?: boolean;
  className?: string;
}

const Logo = ({ width = 50, height = 50, withText = true, className = "" }: LogoProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <Link href="/">
      <div className={`flex items-center cursor-pointer ${className}`}>
        <img 
          src={isDark ? logoDarkSrc : logoLightSrc} 
          alt="Study Guru Logo" 
          width={width} 
          height={height}
          className="object-contain"
        />
        {withText && (
          <img 
            src={isDark ? logoTextDarkSrc : logoTextLightSrc} 
            alt="Study Guru" 
            className="ml-1 h-12 object-contain" 
          />
        )}
      </div>
    </Link>
  );
};

export default Logo;
