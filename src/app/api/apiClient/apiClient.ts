import axios from 'axios';

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Backend URL
const key = process.env.NEXT_PUBLIC_API_KEY||"U61Q2KeCj3QAWhujBPiqu7Qx95HT62VVskZqJiZoqtAkFksJ4FSuP2VJ9KAzu8nSx6ghce6oh8xUDhhf7GC0bnZsbuIQVMLrEMk0SkFwBwCEnukiYFrnXnM891OrPHWf"; // Backend KEY
const BASE_URL = "https://backend.advix.ai"; // Backend URL

// Function to send the contact message
export const sendContactMessage = async (payload: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/contact-messages/send`, payload, {
      headers: {
        "Content-Type": "application/json",
        "X-Access-Api": key,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error sending contact message:", error);
    throw error;
  }
};

export const getAllBlogs = async ({
  page ,
  limit,
  lang,
  type,
  showInHome,
}: {
  page?: number;
  limit?: number;
  lang?: string;
  type?: string|undefined;
  showInHome?: boolean;
}) => {
  try {
    const params: Record<string, any> = {
      page,
      limit,
      lang,
    };

    if (type) {
      params.type = type; // Add type if provided
    }

    if (showInHome !== undefined) {
      params.show_home = showInHome; // Add showInHome if provided
    }

    const response = await axios.get(`${BASE_URL}/v1/user/blogs`, {
      params,
      headers: {
        "X-Access-Api":key,
          lang
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export const getSingleBlog = async ({id, lang}:{id:number|string,lang:string}) => {
  try {
    const response = await axios.get(`${BASE_URL}/v1/user/blogs/${id}/details`, {
      headers: {
        "X-Access-Api":key,
        lang,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    throw error;
  }
};