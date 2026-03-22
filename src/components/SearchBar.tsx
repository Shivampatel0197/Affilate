"use client";

import { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products, brands, or categories..."
        className="w-full px-6 py-4 rounded-full bg-secondary border border-border/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all pl-14 pr-12 font-bold italic"
      />
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30">
        <SearchIcon className="w-5 h-5" />
      </div>
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </form>
  );
}
