"use client";

import { Container } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const { t } = useTranslation("common");

  return (
    <Container className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">{t("Error")}</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </Container>
  );
}
