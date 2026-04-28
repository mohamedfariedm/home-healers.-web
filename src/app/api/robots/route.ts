import ClientAPI from "../api"; // adjust if needed

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await ClientAPI.getRobots();
    const robotsTxt = typeof response === "string" ? response : JSON.stringify(response);

    // Debug log for upstream robots payload.
    console.log("robots.txt response:", {
      length: robotsTxt.length,
      preview: robotsTxt.slice(0, 500),
    });

    return new Response(robotsTxt, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating robots.txt:", error);
    return new Response("User-agent: *\nDisallow:", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
