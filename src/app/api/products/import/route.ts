import { NextRequest, NextResponse } from "next/server";
import { importProductByUrl } from "@/services/product";

export async function POST(req: NextRequest) {
  try {
    console.log("Import request received...");
    const { url, adminPassword } = await req.json();

    console.log("Verifying admin password...");
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      console.error("Unauthorized attempt with password:", adminPassword);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!url) {
      console.error("No URL provided");
      return NextResponse.json({ error: "Link is required" }, { status: 400 });
    }

    console.log("Starting product import for:", url);
    const product = await importProductByUrl(url);

    console.log("Product imported successfully:", product.id);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("API Error - Stack Trace:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
