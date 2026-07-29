import API_URL from "../config/api";

export const getImageUrl = (image) => {
  if (!image) return "";

  // If it's already a Cloudinary or other full URL, return it unchanged
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Otherwise it's a local upload path
  return `${API_URL}${image.replace("/public", "")}`;
};