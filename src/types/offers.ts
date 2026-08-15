import type { Category } from "@/types/booking";

export type OfferImageAttachment = {
  original?: string;
  thumbnail?: string;
  converted?: string;
  url?: string;
  alt?: string;
};

export type OfferImage =
  | string
  | OfferImageAttachment
  | OfferImageAttachment[]
  | null;

export type OfferBadgeFlags = {
  is_featured?: boolean | number | null;
  is_best_seller?: boolean | number | null;
  is_most_popular?: boolean | number | null;
  is_new?: boolean | number | null;
  is_active?: boolean | number | null;
};

export type OfferFaq = {
  id: number;
  package_id?: number;
  question: string;
  answer: string;
  sort_order?: number;
  is_active?: boolean | number;
};

export type OfferReview = {
  id: number;
  patient_name?: string | null;
  rating?: number | null;
  date?: string | null;
  body?: string | null;
  is_verified?: boolean | number | null;
};

export type OfferDoctor = {
  id: number;
  name: string;
};

export type OfferCategory = Pick<Category, "id" | "name"> & {
  slug?: string | null;
};

export type OfferCard = OfferBadgeFlags & {
  id: number;
  slug?: string | null;
  name: string;
  short_description?: string | null;
  image?: OfferImage;
  cover_image?: OfferImage;
  price: string | number;
  old_price?: string | number | null;
  discount_percentage?: string | number | null;
  savings_amount?: string | number | null;
  currency?: string | null;
  sessions_count?: number | null;
  ends_at?: string | null;
  starts_at?: string | null;
  display_rating?: number | null;
  display_reviews_count?: number | null;
  booked_count?: number | null;
  categories?: OfferCategory[] | null;
  category_ids?: number[] | null;
  type?: string | null;
  is_favorite?: boolean | number | null;
};

export type OfferDetails = OfferCard & {
  description?: string | null;
  visit_duration?: string | null;
  location_type?: string | null;
  why_choose_home_healers?: string | null;
  benefits?: string | null;
  before_treatment?: string | null;
  after_treatment?: string | null;
  terms_conditions?: string | null;
  cancellation_policy?: string | null;
  patient_journey?: string[] | null;
  highlights?: string[] | null;
  package_includes?: string[] | null;
  suitable_conditions?: string[] | null;
  tags?: string[] | null;
  validity_days?: number | null;
  gallery_images?: OfferImage[] | null;
  city_ids?: number[] | null;
  service_ids?: number[] | null;
  doctors?: OfferDoctor[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: OfferImage;
  canonical_url?: string | null;
  faqs?: OfferFaq[] | null;
  reviews?: OfferReview[] | null;
  related_offers?: OfferCard[] | null;
  structured_data?: Record<string, unknown> | null;
};

export type OffersListQuery = {
  type?: "offer" | "package" | "market" | string;
  name?: string;
  category_id?: string | number;
  category_ids?: string;
  city_id?: string | number;
  city_ids?: string;
  sessions_count?: string | number;
  validity_days?: string | number;
  doctor_id?: string | number;
  slug?: string;
  currency?: string;
  is_featured?: string | number | boolean;
  is_best_seller?: string | number | boolean;
  is_most_popular?: string | number | boolean;
  is_new?: string | number | boolean;
  is_active?: string | number | boolean;
  price_min?: string | number;
  price_max?: string | number;
  has_discount?: string | number | boolean;
  created_at?: string;
  sort?:
    | "featured"
    | "best_seller"
    | "highest_discount"
    | "newest"
    | "price_asc"
    | "price_desc"
    | string;
  limit?: string | number;
  page?: string | number;
};

export type OffersPaginator = {
  current_page: number;
  last_page: number;
  per_page?: number;
  total?: number;
};

export type OffersEnvelope<T> = {
  data?: T[] | null;
  message?: string;
  server_time?: string;
  meta?: OffersPaginator & Record<string, unknown>;
  links?: Record<string, unknown>;
  _httpStatus?: number;
};
