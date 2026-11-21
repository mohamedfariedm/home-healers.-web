"use client";

import { useEffect } from "react";

/** After the blog page loads, send the browser to `redirect_url`. */
export default function BlogRedirect({ to }: { to: string }) {
  useEffect(() => {
    if (!to) return;
    window.location.assign(to);
  }, [to]);

  return null;
}
