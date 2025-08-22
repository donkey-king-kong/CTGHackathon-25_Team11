import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaAction?: () => void;
  secondaryCtaText?: string;
  secondaryCtaAction?: () => void;
  overlay?: boolean;
}

export function Hero({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  ctaAction,
  secondaryCtaText,
  secondaryCtaAction,
  overlay = true,
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        >
          {overlay && <div className="absolute inset-0 bg-black/20"></div>}
        </div>
      )}
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-white text-xl md:text-2xl mb-12 opacity-90">
            {subtitle}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {ctaText && (
            <Button 
              size="lg" 
              onClick={ctaAction}
              className="bg-brand-primary hover:bg-brand-primary-dark text-white px-8 py-3 rounded-full font-semibold text-lg"
            >
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          
          {secondaryCtaText && (
            <Button 
              size="lg" 
              onClick={secondaryCtaAction}
              className="bg-brand-secondary hover:bg-brand-secondary-dark text-white px-8 py-3 rounded-full font-semibold text-lg"
            >
              {secondaryCtaText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}