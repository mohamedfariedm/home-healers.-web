import { allBlogs } from "@/constants/temp";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params: { blogID } }: { params: { blogID: string } }
) {
  //await new Promise((resolve, reject) => setTimeout(reject, 10000));
  try {
    // Find the blog post with the matching ID
    const blog = allBlogs.find((blog) => blog.id === Number(blogID));

    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
