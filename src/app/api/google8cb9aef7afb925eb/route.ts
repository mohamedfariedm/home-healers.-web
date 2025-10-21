import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("google-site-verification: google8cb9aef7afb925eb.html", {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
