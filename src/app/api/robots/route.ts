import ClientAPI from "../api"; // adjust if needed

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const response = await ClientAPI.getRobots(); // or dynamic locale
    const xml = typeof response === "string" ? response : JSON.stringify(response);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating txt:", error);
    return new Response("<error>Failed to generate sitemap</error>", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}
