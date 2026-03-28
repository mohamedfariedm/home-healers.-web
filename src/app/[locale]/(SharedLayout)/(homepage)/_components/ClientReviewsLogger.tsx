'use client';

import { useEffect } from "react";

type ClientReviewsLoggerProps = {
  data: any;
};

export default function ClientReviewsLogger({ data }: ClientReviewsLoggerProps) {
  useEffect(() => {
    // Inspect client reviews in browser console
    // eslint-disable-next-line no-console
    console.log("clientReviews (client):", data);
  }, [data]);

  return null;
}

