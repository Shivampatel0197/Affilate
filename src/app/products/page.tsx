import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { SlidersHorizontal } from "lucide-react";

export const revalidate = 60;

async function getProducts(query?: string, category?: string) {
  let request = supabase.from("products").select("*");

  if (query) {
    request = request.ilike("title", `%${query}%`);
  }

  if (category) {
    request = request.ilike("category", category);
  }

  const { data } = await request.order("created_at", { ascending: false });
  return data || [];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const products = await getProducts(q, category);

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 pb-20 bg-background font-bold italic uppercase tracking-widest">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 uppercase tracking-widest italic">
            <div>
              <h1 className="text-3xl font-bold mb-2 italic">
                {q ? `Results for "${q}"` : "All Discoveries"}
              </h1>
              <p className="text-foreground/40 text-sm font-bold uppercase tracking-widest italic">Showing {products.length} premium products</p>
            </div>
            <div className="flex items-center space-x-4 uppercase tracking-widest italic">
              <SearchBar />
              <button className="flex items-center space-x-2 px-6 py-4 bg-secondary rounded-full hover:bg-border transition-all uppercase tracking-widest italic">
                <SlidersHorizontal className="w-5 h-5 italic" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 uppercase tracking-widest italic">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="py-32 text-center uppercase tracking-widest italic">
              <h3 className="text-2xl font-bold mb-4 italic">No products matched your search</h3>
              <p className="text-foreground/40 italic">Try searching for something else or browse our categories.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
