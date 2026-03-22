import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

async function getProducts() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);
  return products || [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32 bg-background">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Deal Discovery</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                The Best Deals. <br /> Handpicked by AI.
              </h1>
              <p className="text-xl text-foreground/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                We've automated the discovery of premium products. Paste a link, and let our AI do the work of finding the best value.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="btn-primary flex items-center group">
                  Explore Products
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center space-x-4 ml-0 sm:ml-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-foreground/40 italic">Trusted by 10k+ users</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none opacity-50">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>
        </section>

        {/* Latest Products Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="flex items-center space-x-2 text-accent font-bold mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="uppercase tracking-widest text-xs italic">Trending Now</span>
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Today's Best Discoveries</h2>
              </div>
              <Link href="/products" className="hidden md:flex items-center font-bold text-accent hover:opacity-80 transition-opacity">
                View all products <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="glass p-20 rounded-[40px] text-center border border-border/50">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-foreground/20" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-foreground/40 italic">Start importing products from the admin panel.</p>
              </div>
            )}
          </div>
        </section>

        {/* Features / Why Us */}
        <section className="py-24 bg-secondary/30 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold italic">AI Curated Content</h3>
                <p className="text-foreground/60 leading-relaxed italic">Every product description and feature list is generated by our custom AI to guarantee quality.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold italic">Instant Publishing</h3>
                <p className="text-foreground/60 leading-relaxed italic">No more manual data entry. Paste a link and see the product live in seconds.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold italic">SEO Optimized</h3>
                <p className="text-foreground/60 leading-relaxed italic">Our platform is built for speed and search visibility, helping your affiliate links rank higher.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground/40 text-sm italic font-bold">© 2026 AffForMe. All rights reserved.</p>
          <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-foreground/40 font-bold uppercase tracking-widest italic">
            <Link href="/" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
