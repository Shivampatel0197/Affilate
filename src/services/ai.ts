import OpenAI from "openai";
import { ScrapedProduct } from "./scraper";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIEnrichedProduct extends ScrapedProduct {
  seoTitle: string;
  seoDescription: string;
  summary: string;
  pros: string[];
  cons: string[];
  buyingReasons: string[];
  tags: string[];
  category: string;
}

export async function enrichProductWithAI(product: ScrapedProduct): Promise<AIEnrichedProduct> {
  const prompt = `
    Analyze the following product data and generate SEO-optimized content.
    Return the response in valid JSON format ONLY.
    
    Product Data:
    Title: ${product.title}
    Original Description: ${product.description}
    Platform: ${product.platform}
    
    JSON Template:
    {
      "seoTitle": "Engaging, SEO-friendly title",
      "seoDescription": "Meta description (150-160 chars)",
      "summary": "Compelling short summary for the product page",
      "pros": ["Pro 1", "Pro 2", "Pro 3"],
      "cons": ["Con 1", "Con 2"],
      "buyingReasons": ["Reason 1", "Reason 2"],
      "tags": ["tag1", "tag2", "tag3"],
      "category": "Electronics | Fashion | Home | etc."
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const aiContent = JSON.parse(response.choices[0].message.content || "{}");

  return {
    ...product,
    ...aiContent,
  };
}
