import { allBlogs } from "@/constants/temp";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const tag = searchParams.get("tag");
  const sort = searchParams.get("sort");

  let filteredBlogs = [...allBlogs];

  // Filter by tag if provided
  if (tag) {
    filteredBlogs =
      tag === "View all"
        ? allBlogs
        : filteredBlogs.filter((blog) => blog.tags.includes(tag));
  }

  // Sort the blogs if sort parameter is provided
  if (sort) {
    filteredBlogs.sort((a, b) => {
      if (sort === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sort === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  // Paginate the blogs
  const startIndex = (page - 1) * limit;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + limit);

  // Create the response
  const response = {
    page,
    limit,
    totalBlogs: filteredBlogs.length,
    totalPages: Math.ceil(filteredBlogs.length / limit),
    blogs: paginatedBlogs,
  };

  return NextResponse.json(response);
}
