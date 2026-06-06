import ClientAPI from "@/app/api/api";
import { cache } from "react";

export const getCachedSettings = cache((locale: string) =>
  ClientAPI.getSettings(locale),
);

export const getCachedServiceBySlug = cache((locale: string, slug: string) =>
  ClientAPI.getAllServicesSlug(locale, slug),
);

export const getCachedSingleBlog = cache((blogID: string, locale: string) =>
  ClientAPI.getSingleBlog(blogID, locale),
);
