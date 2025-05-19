const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchData = async (endpoint: string, locale: string, params?: Record<string, any>) => {
  try {
    const Language = typeof window !== "undefined" ? localStorage.getItem("language") || "ar" : "ar";
    const i18nextLng = typeof window !== "undefined" ? localStorage.getItem("i18nextLng") || "ar" : "ar";

    const url = new URL(`${API_BASE_URL}${endpoint}`);
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

const HomeAPI = {
  getHomeData: (locale: string) => fetchData("front/pages/home-page",locale),
  getClientReview: (locale: string) => fetchData("front/ClientReview",locale),
  getNewsData: (locale: string) => fetchData("front/news?show_in_home_page=1",locale),
  getNewsBlogData: (locale: string) => fetchData("front/news?show_in_home_page=0",locale),
  getStatsData: (id: string, locale: string) => fetchData(`admin/news/${id}`, locale),




  getAboutUsData: (locale: string) => fetchData("front/pages/about-us",locale),
  getfaqs: (locale: string) => fetchData("front/faqs",locale),
  getServiceData: (locale: string) => fetchData("front/OurService",locale),
  getCondition: (locale: string) => fetchData("front/pages/condition",locale),
  getTerms: (locale: string) => fetchData("front/pages/terms",locale),
  getSetting: (locale: string) => fetchData("front/setting",locale),
  getFaqPgaesData: (locale: string) => fetchData("front/faqs?show_in_home_page=0",locale),

 
//   getPartners: () => fetchData("front/partenrs"),
//   getCredits: () => fetchData("front/Credits"),
//   getNewsData: () => fetchData("/admin/news", { show_in_home_page: "1" }),
//   getCondition: () => fetchData("/front/pages/condition"),
//   getSetting: () => fetchData("/front/setting"),
};

export default HomeAPI;
