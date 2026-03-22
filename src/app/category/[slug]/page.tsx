import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

export const revalidate = 60;

async function getProductsByCategory(category: string) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .ilike("category", category)
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 pb-20 bg-background font-bold italic uppercase tracking-widest">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 uppercase tracking-widest italic">
            <div>
              <h1 className="text-4xl font-black mb-2 italic capitalize">
                {slug}
              </h1>
              <p className="text-foreground/40 text-sm font-bold uppercase tracking-widest italic tracking-tighter">Premium selection in {slug}</p>
            </div>
            <SearchBar />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 uppercase tracking-widest italic">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="py-32 text-center uppercase tracking-widest italic">
              <h3 className="text-2xl font-bold mb-4 italic">No products available in this category yet.</h3>
              <p className="text-foreground/40 italic italic">Check back soon for curated deals.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
