import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    images: string[];
    price: number;
    currency: string;
    discount?: number;
    rating?: number;
    category?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group h-full">
      <div className="glass rounded-[32px] overflow-hidden border border-border/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary/50">
          <Image
            src={product.images[0] || "/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.discount && product.discount > 0 && (
            <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">{product.category}</span>
            <div className="flex items-center text-yellow-500 space-x-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-foreground/70">{product.rating || "4.5"}</span>
            </div>
          </div>
          
          <h3 className="font-bold text-lg mb-4 line-clamp-2 leading-tight group-hover:text-accent transition-colors">
            {product.title}
          </h3>

          <div className="mt-auto flex items-center justify-between">
            <div className="text-xl font-bold">
              {formatPrice(product.price, product.currency)}
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
