import { supabaseAdmin } from "@/lib/supabase";
import { scrapeProduct } from "./scraper";
import { enrichProductWithAI } from "./ai";
import { slugify } from "@/lib/utils";
export async function importProductByUrl(url: string) {
  try {
    // 1. Scrape data
    console.log("[Import Pipeline] Scraping product from:", url);
    const scrapedData = await scrapeProduct(url);
    
    // 2. Enrich with AI
    console.log("[Import Pipeline] Enriching with AI...");
    const enrichedData = await enrichProductWithAI(scrapedData);
    
    // 3. Generate Slug
    const slug = slugify(enrichedData.seoTitle);
    console.log("[Import Pipeline] Generated Slug:", slug);
    
    // 4. Save to Database
    console.log("[Import Pipeline] Saving to Supabase...");
    const { data, error } = await supabaseAdmin.from("products").insert({
      title: enrichedData.seoTitle,
      slug: slug,
      affiliate_link: url,
      images: enrichedData.images,
      price: enrichedData.price,
      currency: enrichedData.currency,
      discount: 0,
      rating: enrichedData.rating,
      description: enrichedData.summary,
      features: enrichedData.buyingReasons,
      pros: enrichedData.pros,
      cons: enrichedData.cons,
      tags: enrichedData.tags,
      category: enrichedData.category,
      platform: enrichedData.platform,
    }).select().single();

    if (error) {
      console.error("[Import Pipeline] Supabase Error:", error);
      throw error;
    }
    
    console.log("[Import Pipeline] Successfully saved product:", data.id);
    return data;
  } catch (error) {
    console.error("[Import Pipeline] Error details:", error);
    throw error;
  }
}
