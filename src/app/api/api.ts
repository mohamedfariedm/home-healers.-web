const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (endpoint: string, locale: string, params: Record<string, any> = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);

    // Append query parameters for GET requests
    if (params.params) {
      Object.keys(params.params).forEach((key) =>
        url.searchParams.append(key, params.params[key])
      );
    }

    const headers: HeadersInit = {
      "Accept-Language": locale,
    };

    // Only set Content-Type for JSON payloads
    if (!params.isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Add authorization header if required (optional, as requiresAuth is removed)
    if (params.requiresAuth) {
      headers["Content-Type"] = "application/json";
      headers["Accept"] = "application/json";
    }

    const fetchOptions: RequestInit = {
      method: params.method || "GET",
      headers,
      cache: "no-store",
    };

    // Add body for POST requests
    if (params.method === "POST" || params.method === "PUT") {
      fetchOptions.body = params.isFormData ? params.body : JSON.stringify(params.body);
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      console.log("API Fetch Error:", response);
      // throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    // throw error;
  }
};

const ClientAPI = {
  // Categories & Services
  getCategories: (locale: string) =>
    fetchData('client/categories', locale),

  // Coupons
  getCoupons: (locale: string) =>
    fetchData('client/coupons', locale),

  // Packages
  getPackages: (locale: string) =>
    fetchData('client/packages', locale),

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
  getDoctors: (locale: string) =>
    fetchData('client/doctors', locale),


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

  createReservationWithPackage: (payload: any, locale: string) => {
    console.log("createReservationWithPackage", payload);
    return fetchData('client/booking-with-packages', locale, {
      method: 'POST',
      body: payload,
      requiresAuth: true,
    });
  },

  applyCouponOnReservation: (
    payload: { reservationId: number; coupon_id: number },
    locale: string
  ) =>
    fetchData("client/reservations/apply-coupon", locale, {
      method: "POST",
      body: payload,
      requiresAuth: true,
    }),

  removeCouponFromReservation: (
    payload: { reservationId: number; coupon_id: number },
    locale: string
  ) =>
    fetchData("client/reservations/remove-coupon", locale, {
      method: "POST",
      body: payload,
      requiresAuth: true,
    }),

  // Payment - Apple Pay or default payment
  payReservation: (reservationId: number, locale: string) =>
    fetchData('payment/pay', locale, {
      method: 'POST',
      body: { reservation_id: reservationId, method: "web" },
      requiresAuth: true,
    }),

  // Payment - Telr Payment
  payReservationWithTelr: (reservationId: number, locale: string) =>
    fetchData('payment/telr/pay', locale, {
      method: 'POST',
      body: { reservation_id: reservationId, method: "web" },
      requiresAuth: true,
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
    console.log("Submitting doctor application with data:", formData);

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
        console.log("API Fetch Error:", response);
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

  getAllBlogs: (locale: string, params?: { page?: number; limit?: number; type?: string; show_home?: boolean }) =>
    fetchData('client/news', locale, { params }),

  getAllServices: (locale: string, params?: { page?: number; limit?: number; type?: string; show_home?: boolean }) =>
    fetchData('client/services', locale),
  getAllServicesSlug: (locale: string, slug: string, params?: { page?: number; limit?: number; type?: string; show_home?: boolean }) =>
    fetchData(`client/services-slug/${slug}`, locale),
  getSingleService: (id: string | number, locale: string) =>
    fetchData(`client/services/${id}`, locale),

  getSingleBlog: (id: string | number, locale: string) =>
    fetchData(`client/news-slug/${id}`, locale),

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
    try {
      const url = new URL(`${API_BASE_URL}/sitemaps/robots.txt`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "text/plain" },
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch robots.txt");

      return await response.text();
    } catch (e) {
      console.error("robots fetch error:", e);
      return "User-agent: *\nDisallow:";
    }
  }

};



export default ClientAPI;