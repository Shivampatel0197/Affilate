import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-accent-foreground">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span>AffForMe</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/category/electronics" className="hover:text-accent transition-colors">Electronics</Link>
          <Link href="/category/fashion" className="hover:text-accent transition-colors">Fashion</Link>
          <Link href="/category/home" className="hover:text-accent transition-colors">Home</Link>
          <Link href="/category/gadgets" className="hover:text-accent transition-colors">Gadgets</Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-secondary rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/admin" className="text-xs font-semibold px-3 py-1 bg-secondary rounded-full hover:bg-border transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
