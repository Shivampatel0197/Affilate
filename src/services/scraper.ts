import puppeteer from "puppeteer";

export interface ScrapedProduct {
  title: string;
  price: number;
  currency: string;
  images: string[];
  description: string;
  features: string[];
  rating: number;
  platform: string;
  affiliateLink: string;
}

export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    page.setDefaultNavigationTimeout(60000);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    // Small delay to let basic scripts run
    await new Promise(resolve => setTimeout(resolve, 2000));

    let productData: Partial<ScrapedProduct> = {
      affiliateLink: url,
    };

    if (url.includes("amazon")) {
      productData = await scrapeAmazon(page);
    } else if (url.includes("flipkart")) {
      productData = await scrapeFlipkart(page);
    } else {
      productData = await scrapeGeneric(page);
    }

    return {
      title: productData.title || "Unknown Product",
      price: productData.price || 0,
      currency: productData.currency || "USD",
      images: productData.images || [],
      description: productData.description || "",
      features: productData.features || [],
      rating: productData.rating || 0,
      platform: productData.platform || "Generic",
      affiliateLink: url,
    };
    } catch (error: any) {
    if (error.name === "TimeoutError") {
      throw new Error("Scraping timed out. The product page took too long to load.");
    }
    throw error;
  } finally {
    await browser.close();
  }
}

async function scrapeAmazon(page: any): Promise<Partial<ScrapedProduct>> {
  return await page.evaluate(() => {
    const title = document.querySelector("#productTitle")?.textContent?.trim();
    const priceText = document.querySelector(".a-price-whole")?.textContent?.trim();
    const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, "")) : 0;
    
    const description = document.querySelector("#productDescription")?.textContent?.trim() || 
                       document.querySelector("#feature-bullets")?.textContent?.trim();
    
    // Extract images
    const imageElements = document.querySelectorAll("#altImages img, #landingImage");
    const images = Array.from(imageElements)
      .map((img: any) => img.src || img.getAttribute("data-old-hires") || img.getAttribute("data-a-dynamic-image"))
      .filter(src => src && !src.includes("base64"))
      .slice(0, 5);

    const ratingText = document.querySelector(".a-icon-alt")?.textContent;
    const rating = ratingText ? parseFloat(ratingText.split(" ")[0]) : 0;

    return {
      title,
      price,
      currency: "USD",
      images,
      description,
      platform: "Amazon",
    };
  });
}

async function scrapeFlipkart(page: any): Promise<Partial<ScrapedProduct>> {
  return await page.evaluate(() => {
    const title = document.querySelector(".B_NuCI")?.textContent?.trim();
    const priceText = document.querySelector("._30jeq3._16Jk6d")?.textContent?.trim();
    const price = priceText ? parseFloat(priceText.replace(/[^0-9.]/g, "")) : 0;
    
    const description = document.querySelector("._1mXcCf")?.textContent?.trim();
    
    const images = Array.from(document.querySelectorAll("._2AmZ67 img"))
      .map((img: any) => img.src)
      .slice(0, 5);

    const ratingText = document.querySelector("._3LWZlK")?.textContent;
    const rating = ratingText ? parseFloat(ratingText) : 0;

    return {
      title,
      price,
      currency: "INR",
      images,
      description,
      platform: "Flipkart",
    };
  });
}

async function scrapeGeneric(page: any): Promise<Partial<ScrapedProduct>> {
  return await page.evaluate(() => {
    return {
      title: document.title,
      platform: "Generic",
    };
  });
}
