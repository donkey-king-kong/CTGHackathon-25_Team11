import { cn } from "@/shared/utils/utils";

interface TwoColumnProps {
  title: string;
  content: string | React.ReactNode;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  titleColor?: string;
  backgroundColor?: string;
  className?: string;
}

export function TwoColumn({
  title,
  content,
  image,
  imageAlt,
  reverse = false,
  titleColor = "text-brand-primary",
  backgroundColor = "bg-surface",
  className,
}: TwoColumnProps) {
  return (
    <section className={cn("py-20", backgroundColor, className)}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={reverse ? "order-2 lg:order-1" : "order-1 lg:order-2"}>
            <div className="relative">
              <img 
                src={image} 
                alt={imageAlt}
                className="rounded-2xl shadow-elevated w-full h-96 object-cover"
              />
            </div>
          </div>
          <div className={reverse ? "order-1 lg:order-2" : "order-2 lg:order-1"}>
            <h2 className={cn("text-4xl font-bold mb-6", titleColor)}>{title}</h2>
            <div className="space-y-4 text-lg leading-relaxed text-text">
              {typeof content === 'string' ? (
                <p>{content}</p>
              ) : (
                content
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}