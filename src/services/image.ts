import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(imageUrl: string) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "aff-for-me",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return imageUrl; // Fallback to original URL
  }
}

export async function uploadMultipleToCloudinary(imageUrls: string[]) {
  const uploadPromises = imageUrls.map(url => uploadImageToCloudinary(url));
  return Promise.all(uploadPromises);
}
