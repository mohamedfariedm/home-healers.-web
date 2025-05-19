"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useCustomSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const setSearchParams = useCallback(
    (
      name: string,
      value: string,
      type: "push" | "replace" = "push",
      scroll: boolean = true
    ) => {
      const queryString = createQueryString(name, value);
      router[type](`?${queryString}`, { scroll });
    },
    [router, createQueryString]
  );

  return { searchParams, setSearchParams, createQueryString };
}
