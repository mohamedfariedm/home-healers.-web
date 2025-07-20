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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
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

  // Nationalities
  getNationalities: (locale: string) =>
    fetchData('client/nationalities', locale),

  // Doctors
  getDoctors: (locale: string) =>
    fetchData('client/doctors', locale),

  // States
  getStates: (locale: string) =>
    fetchData('client/states', locale),

  // Client Reviews
  getClientReviews: (locale: string, params?: { active?: boolean; futures?: boolean }) =>
    fetchData('client/ClientReview', locale, { params }),

  getClientReview: (id: string | number, locale: string) =>
    fetchData(`client/ClientReview/${id}`, locale),

  // Reservations
  createReservation: (payload: any, locale: string) =>
    fetchData('client/reservations', locale, {
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

  // Payment - Apple Pay or default payment
payReservation: (reservationId: number, locale: string) =>
  fetchData('payment/pay', locale, {
    method: 'POST',
    body: { reservation_id: reservationId,method:"web" },
    requiresAuth: true,
  }),

// Payment - Telr Payment
payReservationWithTelr: (reservationId: number, locale: string) =>
  fetchData('payment/telr/pay', locale, {
    method: 'POST',
    body: { reservation_id: reservationId,method:"web" },
    requiresAuth: true,
  }),

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

  getSingleService: (id: string | number, locale: string) =>
    fetchData(`client/services/${id}`, locale),

  getSingleBlog: (id: string | number, locale: string) =>
    fetchData(`client/news-slug/${id}`, locale),

  getSettings: (locale: string) =>
    fetchData('client/settings', locale),
};

export default ClientAPI;