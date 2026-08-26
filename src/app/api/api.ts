import { ClientApiError } from "@/lib/client-api-error";
import { compactQuery, one } from "@/lib/offers";
import type { OffersListQuery } from "@/types/offers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SERVER_API_BASE_URL = process.env.API_URL;
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://home-healers.com";
const DEFAULT_ROBOTS_TXT = `User-agent: *\nAllow: /\n\nSitemap: ${WEBSITE_URL}/sitemap.xml`;
const ROBOTS_LOG_PREFIX = "[ROBOTS]";

const fetchData = async (endpoint: string, locale: string, params: Record<string, any> = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);

    // Append query parameters for GET requests
    if (params.params) {
      Object.entries(params.params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        url.searchParams.append(key, String(value));
      });
    }

    const headers: HeadersInit = {
      "Accept-Language": locale,
      language: locale,
      Accept: "application/json",
    };

    // Only set Content-Type for JSON payloads
    if (!params.isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (params.requiresAuth || params.authToken) {
      headers["Accept"] = "application/json";
      if (params.authToken) {
        headers["Authorization"] = `Bearer ${params.authToken}`;
      }
    }

    const method = params.method || "GET";
    const isMutation = method === "POST" || method === "PUT" || method === "DELETE";

    const fetchOptions: RequestInit = {
      method,
      headers,
      ...(isMutation || params.noCache
        ? { cache: "no-store" }
        : { next: { revalidate: params.revalidate ?? 60 } }),
    };

    if (params.signal) {
      fetchOptions.signal = params.signal;
    }

    if (isMutation) {
      fetchOptions.body = params.isFormData ? params.body : JSON.stringify(params.body);
    }

    const response = await fetch(url.toString(), fetchOptions);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof data?.message === "string"
          ? data.message
          : data?.errors
            ? Object.values(data.errors as Record<string, string[]>)
                .flat()
                .join(", ")
            : `HTTP error! Status: ${response.status}`;

      if (params.throwOnError) {
        throw new ClientApiError(
          message,
          response.status,
          data?.errors,
          data,
        );
      }
    }

    if (data && typeof data === "object") {
      data._httpStatus = response.status;
    }

    return data;
    } catch (error) {
    if (error instanceof ClientApiError) {
      throw error;
    }
    if ((error as { name?: string })?.name === "AbortError") {
      if (params.throwOnError) throw error;
      return;
    }
    console.error("API Fetch Error:", error);
    if (params.throwOnError) {
      throw error;
    }
  }
};

const ClientAPI = {
  // Categories & Services
  getCategories: (locale: string) =>
    fetchData("client/categories", locale),

  getCategory: (key: string, locale: string) =>
    fetchData(`client/categories/${encodeURIComponent(key)}`, locale),

  // Coupons
  getCoupons: (
    locale: string,
    query?: { name?: string; code?: string; limit?: number; page?: number },
    authToken?: string
  ) =>
    fetchData("client/coupons", locale, {
      params: {
        is_active: 1,
        limit: query?.limit ?? 20,
        page: query?.page ?? 1,
        ...(query?.name ? { name: query.name } : {}),
        ...(query?.code ? { code: query.code } : {}),
      },
      requiresAuth: true,
      authToken,
    }),

  // Packages / Offers (offers are packages with type=offer)
  getPackages: (
    locale: string,
    query: OffersListQuery = {},
    options?: { signal?: AbortSignal; revalidate?: number; noCache?: boolean },
  ) => {
    const params = compactQuery(query as Record<string, unknown>);
    if (params.limit != null && Number(params.limit) > 100) {
      params.limit = 100;
    }
    return fetchData("client/packages", locale, {
      params,
      signal: options?.signal,
      revalidate:
        options?.revalidate ?? (query.type === "offer" ? 300 : 60),
      noCache: options?.noCache,
    });
  },

  getPackageById: (id: string | number, locale: string) =>
    fetchData(`client/packages/${id}`, locale, { revalidate: 300 }),

  getOfferBySlug: (slug: string, locale: string) =>
    fetchData(`client/offers/${encodeURIComponent(slug)}`, locale, {
      revalidate: 300,
    }),

  getFeaturedPackage: (locale: string) =>
    fetchData("client/packages-featured", locale, { revalidate: 300 }),

  getRelatedPackages: (id: string | number, locale: string) =>
    fetchData(`client/packages/${id}/related`, locale, { revalidate: 300 }),

  toggleFavorite: (
    packageId: number,
    locale: string,
    authToken?: string,
  ) =>
    fetchData("client/favorites-toggle", locale, {
      method: "POST",
      body: { package_id: packageId },
      requiresAuth: true,
      authToken,
      throwOnError: true,
    }),

  one,

  // Countries & Cities
  getCountries: (locale: string) =>
    fetchData('client/countries', locale),

  getCities: (locale: string, countryId?: number | string) =>
    fetchData('client/cities', locale, countryId ? { params: { country_id: countryId } } : {}),

  getStates: (locale: string, countryId?: number | string) =>
    fetchData('client/states', locale, countryId ? { params: { country_id: countryId } } : {}),

  // Nationalities
  getNationalities: (locale: string) =>
    fetchData('client/nationalities', locale),

  // Doctors
  getDoctors: (
    locale: string,
    params?: { city_id?: number; gender?: "male" | "female" }
  ) =>
    fetchData("client/doctors", locale, {
      params: params ?? {},
    }),


  // Client Reviews
  getClientReviews: (locale: string, params?: { active?: boolean; futures?: boolean }) =>
    fetchData('client/client-reviews', locale, { params }),

  getClientReview: (id: string | number, locale: string) =>
    fetchData(`client/ClientReview/${id}`, locale),
  getInvoices: (id: string | number, locale: string) =>
    fetchData(`client/invoice/${id}`, locale),

  // Reservations
  createReservation: (payload: any, locale: string) =>
    fetchData('client/reservations', locale, {
      method: 'POST',
      body: payload,
      requiresAuth: true,
    }),
  createQueiqReservation: (payload: any, locale: string) =>
    fetchData('client/quick-booking', locale, {
      method: 'POST',
      body: payload,
      requiresAuth: true,
    }),

  createReservationWithPackage: (payload: any, locale: string) =>
    fetchData('client/booking-with-packages', locale, {
      method: 'POST',
      body: payload,
      throwOnError: true,
    }),

  applyCouponOnReservation: (
    payload: { reservationId: number; coupon_id: string },
    locale: string,
    authToken?: string
  ) =>
    fetchData("client/reservations/apply-coupon", locale, {
      method: "POST",
      body: payload,
      requiresAuth: true,
      authToken,
      throwOnError: true,
    }),

  removeCouponFromReservation: (
    payload: { reservationId: number; coupon_id: string },
    locale: string,
    authToken?: string
  ) =>
    fetchData("client/reservations/remove-coupon", locale, {
      method: "POST",
      body: payload,
      requiresAuth: true,
      authToken,
      throwOnError: true,
    }),

  getPaymentSummary: (
    reservationId: number,
    locale: string,
    authToken?: string
  ) =>
    fetchData(`client/payment/summary/${reservationId}`, locale, {
      authToken,
      noCache: true,
    }),

  getReservation: (reservationId: number | string, locale: string) =>
    fetchData(`client/reservations/${reservationId}`, locale, {
      noCache: true,
    }),

  payReservationWithWallet: (reservationId: number, locale: string) =>
    fetchData("client/payment/wallet/pay", locale, {
      method: "POST",
      body: { reservation_id: reservationId },
      throwOnError: true,
    }),

  payReservationWithCash: (reservationId: number, locale: string) =>
    fetchData("client/payment/cash/pay", locale, {
      method: "POST",
      body: { reservation_id: reservationId },
      throwOnError: true,
    }),

  // Payment - Telr (website checkout)
  payReservationWithTelr: (reservationId: number, locale: string) =>
    fetchData("client/payment/telr/pay", locale, {
      method: "POST",
      body: { reservation_id: reservationId, method: "web" },
      throwOnError: true,
    }),

  // Reservation Review
  submitReservationReview: (reservationId: number | string, payload: {
    doctor_rate: number;
    doctor_comment: string;
    reservation_rate: number;
    reservation_comment: string;
  }, locale: string) =>
    fetchData(`client/reservations/review/${reservationId}`, locale, {
      method: 'POST',
      body: payload,
      requiresAuth: true,
    }),

  // Get Active Reservation Reviews
  getActiveReservationReviews: (locale: string, params?: { limit?: number; page?: number; with_doctor_rating?: number; with_reservation_rating?: number }) =>
    fetchData('client/reviews', locale, { params }),

  // Attachments
  getAttachments: (locale: string) =>
    fetchData('attachments', locale),

  getAttachment: (id: string | number, locale: string) =>
    fetchData(`attachments/${id}`, locale),

  uploadAttachment: (formData: FormData, locale: string) =>
    fetchData('client/attachments', locale, {
      method: 'POST',
      body: formData,
      isFormData: true,
    }),

  doctorApplayment: (formData: any, locale: string) => {
    
    fetchData('client/doctors-apply-registration', locale, {
      method: 'POST',
      body: formData,
      requiresAuth: true,
    })
  },

  // Doctor Invitation
  validateInviteToken: (token: string, locale: string) =>
    fetchData(`client/invite-doctor/${token}`, locale, {
      method: 'GET',
    }),

  acceptInviteToken: (token: string, formData: any, locale: string) =>
    fetchData(`client/invite-doctor/${token}/accept`, locale, {
      method: 'POST',
      body: formData,
    }),

  // Accept Reservation Invitation (Doctor)
  acceptReservationInvite: async (token: string, locale: string) => {
    try {
      const url = new URL(`${API_BASE_URL}/${token}`);

      const headers: HeadersInit = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Accept-Language": locale,
      };

      const response = await fetch(url.toString(), {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
              }

      return await response.json();
    } catch (error) {
      console.error("API Fetch Error:", error);
      throw error;
    }
  },

  deleteAttachment: (id: string | number, locale: string) =>
    fetchData(`attachments/${id}`, locale, {
      method: 'DELETE',
    }),

  // News
  getNews: (locale: string, params?: { show_in_homepage?: boolean }) =>
    fetchData('client/news', locale, { params }),

  getNewsItem: (id: string | number, locale: string) =>
    fetchData(`client/news/${id}`, locale),

  // FAQs
  getFAQs: (locale: string, params?: { show_in_home_page?: boolean }) =>
    fetchData('client/faqs', locale, { params }),

  // Home
  getHomeData: (locale: string) =>
    fetchData('client/pages/home', locale),

  // About Us
  getAboutUs: (locale: string) =>
    fetchData('client/pages/about-us', locale),

  // Existing Endpoints (Integrated)
  getContactMessage: (payload: any, locale: string) =>
    fetchData('client/contact-messages/send', locale, {
      method: 'POST',
      body: payload,
    }),

  submitCustomerSupport: (
    payload: {
      name: string;
      mobile_phone: string;
      notes: string;
      type?: string;
    },
    locale: string,
  ) =>
    fetchData("client/customer-supports", locale, {
      method: "POST",
      body: {
        name: payload.name,
        mobile_phone: payload.mobile_phone,
        notes: payload.notes,
        type: payload.type || "seo",
      },
      throwOnError: true,
      noCache: true,
    }),

  getAllBlogs: (locale: string, params?: { page?: number; limit?: number; type?: string; show_home?: boolean }) =>
    fetchData('client/news', locale, { params }),

  getAllServices: (locale: string, params?: { page?: number; limit?: number; type?: string; show_home?: boolean }) =>
    fetchData("client/services", locale),
  getAllServicesSlug: (locale: string, slug: string) =>
    fetchData(`client/services-slug/${encodeURIComponent(slug)}`, locale),
  // GET /services/{id} currently 500s on the backend — do not call it.
  getSingleService: (id: string | number, locale: string) =>
    fetchData(`client/services/${id}`, locale),

  getSingleBlog: (slug: string, locale: string) =>
    fetchData(`client/news-slug/${encodeURIComponent(slug)}`, locale),

  getSettings: (locale: string) =>
    fetchData('client/settings', locale),

  // Landing Pages
  getLandingPageBySlug: (slug: string, locale: string) =>
    fetchData(`client/landing-pages/${slug}`, locale),

  getSiteMap: async (endpoint: string, locale: string = "en") => {
    try {
      const url = new URL(`${API_BASE_URL}/${endpoint}`);

      const headers: HeadersInit = {
        "Accept-Language": locale,
        "Accept": "application/xml",
      };

      const response = await fetch(url.toString(), {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Sitemap Fetch Error:", response.status, response.statusText);
        throw new Error(`Failed to fetch sitemap: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error("Error fetching sitemap:", error);
      return "<error>Failed to fetch sitemap</error>";
    }
  },
  getRobots: async () => {
    const candidateBaseUrls = [
      API_BASE_URL,
      SERVER_API_BASE_URL,
      "https://backend.home-healers.com/api",
      "https://development.home-healers.com/api",
    ].filter(Boolean) as string[];

    try {
      
      for (const baseUrl of candidateBaseUrls) {
        const url = new URL(`${baseUrl}/sitemaps/robots.txt`);
        try {
                    const response = await fetch(url.toString(), {
            method: "GET",
            headers: { Accept: "text/plain" },
            cache: "no-store",
          });

          if (!response.ok) {
            const errorBody = await response.text();
            console.error(`${ROBOTS_LOG_PREFIX} non-200 response`, {
              url: url.toString(),
              status: response.status,
              statusText: response.statusText,
              bodyPreview: errorBody.slice(0, 500),
            });
            continue;
          }

          const robotsTxt = await response.text();
          if (robotsTxt && robotsTxt.trim().length > 0) {
                        return robotsTxt;
          }

          console.error(`${ROBOTS_LOG_PREFIX} empty body`, {
            url: url.toString(),
          });
        } catch (candidateError) {
          const err = candidateError as Error & { cause?: unknown };
          console.error(`${ROBOTS_LOG_PREFIX} candidate error`, {
            url: url.toString(),
            message: err?.message || String(candidateError),
            stack: err?.stack,
            cause: err?.cause,
          });
        }
      }

      console.error(`${ROBOTS_LOG_PREFIX} all candidates failed`, {
        candidates: candidateBaseUrls,
        fallback: DEFAULT_ROBOTS_TXT,
      });
      return DEFAULT_ROBOTS_TXT;
    } catch (e) {
      const err = e as Error & { cause?: unknown };
      console.error(`${ROBOTS_LOG_PREFIX} unexpected error`, {
        message: err?.message || String(e),
        stack: err?.stack,
        cause: err?.cause,
      });
      return DEFAULT_ROBOTS_TXT;
    }
  }

};



export default ClientAPI;