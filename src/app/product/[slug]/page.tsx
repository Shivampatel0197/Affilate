import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Star, Check, X, ShoppingCart, ShieldCheck, Zap } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

async function getProduct(slug: string) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} | AffForMe`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.substring(0, 160),
      images: [{ url: product.images[0] }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description.substring(0, 160),
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.platform
    },
    "offers": {
      "@type": "Offer",
      "url": product.affiliate_link,
      "priceCurrency": product.currency,
      "price": product.price,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.5,
      "reviewCount": 100
    }
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-grow pt-24 pb-20 bg-background font-bold uppercase tracking-widest italic">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Gallery Section */}
            <div className="space-y-6 animate-fade-in uppercase tracking-widest italic">
              <div className="relative aspect-square glass rounded-[40px] overflow-hidden border border-border/50 group uppercase tracking-widest italic">
                <Image
                  src={product.images[0] || "/placeholder.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-4 uppercase tracking-widest italic">
                {product.images.slice(1, 5).map((img: string, i: number) => (
                  <div key={i} className="relative aspect-square glass rounded-2xl overflow-hidden border border-border/50 uppercase tracking-widest italic">
                    <Image src={img} alt={`${product.title} view ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col animate-slide-up uppercase tracking-widest italic">
              <div className="mb-8 uppercase tracking-widest italic">
                <div className="flex items-center space-x-2 text-accent mb-4 uppercase tracking-widest italic">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-sm font-bold">{product.rating || "4.8"} Out of 5</span>
                  <span className="text-foreground/20 text-xs px-2">•</span>
                  <span className="text-xs">{product.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight uppercase tracking-widest italic text-accent italic">
                  {product.title}
                </h1>
                <div className="flex items-end space-x-4 mb-8 uppercase tracking-widest italic">
                  <span className="text-4xl font-black italic">{formatPrice(product.price, product.currency)}</span>
                  {product.discount > 0 && (
                    <span className="text-xl text-foreground/30 line-through mb-1 italic">
                      {formatPrice(product.price * (1 + product.discount / 100), product.currency)}
                    </span>
                  )}
                  <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold mb-1 italic">
                    IN STOCK
                  </span>
                </div>
              </div>

              <div className="p-8 glass rounded-[32px] border border-border/50 mb-10 uppercase tracking-widest italic">
                <p className="text-lg text-foreground/70 leading-relaxed italic mb-8 uppercase tracking-widest italic">
                  {product.description}
                </p>
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-primary h-16 flex items-center justify-center text-xl font-black uppercase tracking-widest italic group uppercase tracking-widest italic italic"
                >
                  <ShoppingCart className="w-6 h-6 mr-3 uppercase tracking-widest italic" />
                  Buy Now on {product.platform}
                  <Zap className="ml-3 w-5 h-5 text-accent-foreground/50 group-hover:text-accent-foreground transition-colors" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 uppercase tracking-widest italic italic">
                <div className="space-y-4 uppercase tracking-widest italic italic">
                  <h3 className="font-bold uppercase tracking-widest text-xs text-green-500 flex items-center italic">
                    <Check className="w-4 h-4 mr-2 italic" /> The Pros
                  </h3>
                  <ul className="space-y-3 italic">
                    {product.pros?.map((pro: string, i: number) => (
                      <li key={i} className="text-sm text-foreground/60 flex items-start italic">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/30 mt-1.5 mr-3 flex-shrink-0 italic" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4 uppercase tracking-widest italic italic">
                  <h3 className="font-bold uppercase tracking-widest text-xs text-red-500 flex items-center italic">
                    <X className="w-4 h-4 mr-2 italic" /> The Cons
                  </h3>
                  <ul className="space-y-3 italic">
                    {product.cons?.map((con: string, i: number) => (
                      <li key={i} className="text-sm text-foreground/60 flex items-start italic">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/30 mt-1.5 mr-3 flex-shrink-0 italic" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Features */}
          <div className="mt-32 uppercase tracking-widest italic">
            <h2 className="text-3xl font-bold mb-12 italic">Why Choose This Product?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 uppercase tracking-widest italic">
              {product.features?.map((feature: string, i: number) => (
                <div key={i} className="glass p-8 rounded-3xl border border-border/50 uppercase tracking-widest italic">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent uppercase tracking-widest italic">
                    <ShieldCheck className="w-6 h-6 uppercase tracking-widest italic" />
                  </div>
                  <p className="text-foreground/70 leading-relaxed uppercase tracking-widest italic">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
