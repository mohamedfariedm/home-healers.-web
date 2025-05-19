import { IBlog } from "@/types";
import axios from "axios";

interface BlogsResponse {
  blogs: IBlog[];
  page: number;
  limit: number;
  totalBlogs: number;
  totalPages: number;
}



export async function getBlogs(
  page: number,
  limit: number,
  tag?: string,
  sort?: string
): Promise<BlogsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (tag) params.append("tag", tag);
  if (sort) params.append("sort", sort);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const response = await axios.get(`${baseUrl}/api/blogs?${params}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
      throw new Error(`Failed to fetch blogs: ${error.message}`);
    } else {
      console.error("unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function getBlogById(blogID: string): Promise<IBlog> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const response = await axios.get(`${baseUrl}/api/blogs/${blogID}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data);
      throw new Error(`Failed to fetch blog: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}