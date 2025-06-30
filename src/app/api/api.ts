const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (endpoint: string, locale: string, params?: Record<string, any>) => {
  try {
    const url = new URL(`${API_BASE_URL}/${endpoint}`);
    url.searchParams.append("cacheBuster", Date.now().toString());

    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": locale,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });

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

  createClientReview: (payload: any, locale: string) =>
    fetchData('client/ClientReview', locale, {
      method: 'POST',
      body: payload,
      requiresAuth: true,
    }),

  updateClientReview: (id: string | number, payload: any, locale: string) =>
    fetchData(`client/ClientReview/${id}`, locale, {
      method: 'PUT',
      body: payload,
      requiresAuth: true,
    }),

  deleteClientReview: (id: string | number, locale: string) =>
    fetchData(`client/ClientReview/${id}`, locale, {
      method: 'DELETE',
      requiresAuth: true,
    }),

  // Reservations
  createReservation: (payload: any, locale: string) =>
    fetchData('client/reservations', locale, {
      method: 'POST',
      body: payload,
    }),

  createReservationWithPackage: (payload: any, locale: string) =>
    fetchData('client/booking-with-packages', locale, {
      method: 'POST',
      body: payload,
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
      requiresAuth: true,
    }),

  deleteAttachment: (id: string | number, locale: string) =>
    fetchData(`attachments/${id}`, locale, {
      method: 'DELETE',
      requiresAuth: true,
    }),

  // News
  getNews: (locale: string, params?: { show_in_homepage?: boolean }) =>
    fetchData('client/news', locale, { params }),

  getNewsItem: (id: string | number, locale: string) =>
    fetchData(`client/news/${id}`, locale),

  createNews: (payload: any, locale: string) =>
    fetchData('client/news', locale, {
      method: 'POST',
      body: payload,
      requiresAuth: true,
    }),

  deleteNews: (id: string | number, locale: string) =>
    fetchData(`client/news/${id}`, locale, {
      method: 'DELETE',
      requiresAuth: true,
    }),

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
    fetchData('client/services', locale, { params }),

  getSingleService: (id: string | number, locale: string) =>
    fetchData(`client/services/${id}`, locale),
  getSingleBlog: (id: string | number, locale: string) =>
    fetchData(`client/news/${id}`, locale),
};

export default ClientAPI;