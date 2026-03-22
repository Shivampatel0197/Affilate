"use client";

import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertCircle, Link as LinkIcon, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, adminPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to import product");

      setStatus({
        type: "success",
        message: `Successfully imported: ${data.product.title}`,
      });
      setUrl("");
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-accent/10 mb-6 text-accent">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Admin Dashboard</h1>
          <p className="text-foreground/60">Paste an affiliate link to automatically generate a product page.</p>
        </div>

        <div className="glass p-8 md:p-12 rounded-[40px] border border-border shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center">
                <Lock className="w-3.5 h-3.5 mr-2" /> Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-3xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1 flex items-center">
                <LinkIcon className="w-3.5 h-3.5 mr-2" /> Product Link
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://amazon.com/product/..."
                  className="w-full px-6 py-4 rounded-3xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-lg pr-16"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-accent">
                  <LinkIcon className="w-6 h-6 opacity-30" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full btn-primary h-16 flex items-center justify-center text-lg font-bold transition-all",
                isLoading ? "opacity-70 scale-95" : "hover:scale-[1.02]"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-6 w-6" />
                  Import Product
                </>
              )}
            </button>
          </form>

          {status && (
            <div
              className={cn(
                "mt-8 p-6 rounded-3xl border animate-slide-up flex items-start space-x-4",
                status.type === "success" 
                  ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400" 
                  : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
              )}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="w-6 h-6 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
              )}
              <div className="font-medium">{status.message}</div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-sm text-foreground/40">
          Powered by GPT-4o & Puppeteer
        </div>
      </div>
    </div>
  );
}
