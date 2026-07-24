
import API_URL from "../config/api";

export const getImageUrl = (img) => {
  if (!img) return "/placeholder.jpg";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  if (img.startsWith("/public")) return `${API_URL}/${img.replace("/public", "")}`;
  return `${API_URL}/${img.replace(/^\/+/, "")}`;
};