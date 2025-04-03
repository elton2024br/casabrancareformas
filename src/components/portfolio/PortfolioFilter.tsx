
import { Button } from "@/components/ui/button";

interface PortfolioFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function PortfolioFilter({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: PortfolioFilterProps) {
  return (
    <section className="py-8 border-b">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => onSelectCategory(category)}
              className="transition-all duration-200"
              aria-pressed={selectedCategory === category}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
