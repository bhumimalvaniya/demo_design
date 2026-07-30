import API_URL from "../config/api";

export const getImageUrl = (image) => {
  if (!image) return "";

  // Remove extra spaces
  image = image.trim();

  // If it is already a complete URL (Cloudinary), return it directly
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // Fix old local upload paths
  if (image.startsWith("/public/uploads/")) {
    return `${API_URL}/uploads/${image.replace("/public/uploads/", "")}`;
  }

  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  return `${API_URL}/${image}`;
};