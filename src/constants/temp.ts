import { faker } from "@faker-js/faker";

export const testimonials = [
  {
    id: 1,
    name: "Fahad Al-Arfaj",
    position: "CEO",
    company: "GrowthTech Solutions",
    image: "/assets/images/user.png",
    rating: 5,
    text: "The product exceeded our expectations. It's been instrumental in our company's growth.",
  },
  {
    id: 2,
    name: "Sari Johnson",
    position: "CTO",
    company: "InnovateNow Inc.",
    image: "/assets/images/user.png",
    rating: 5,
    text: "Incredible user experience and top-notch customer support. Highly recommended!",
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Founder",
    company: "TechStart Solutions",
    image: "/assets/images/user.png",
    rating: 4,
    text: "A game-changer for our operations. The efficiency gains have been substantial.",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    position: "COO",
    company: "Global Innovations",
    image: "/assets/images/user.png",
    rating: 5,
    text: "The best decision we made this year. Our team's productivity has skyrocketed.",
  },
  {
    id: 5,
    name: "Ahmed Hassan",
    position: "Director of IT",
    company: "FutureTech Corp",
    image: "/assets/images/user.png",
    rating: 5,
    text: "Seamless integration and powerful features. It's transformed our workflow.",
  },
  {
    id: 1,
    name: "Fahad Al-Arfaj",
    position: "CEO",
    company: "GrowthTech Solutions",
    image: "/assets/images/user.png",
    rating: 5,
    text: "The product exceeded our expectations. It's been instrumental in our company's growth.",
  },
  {
    id: 2,
    name: "Sari Johnson",
    position: "CTO",
    company: "InnovateNow Inc.",
    image: "/assets/images/user.png",
    rating: 5,
    text: "Incredible user experience and top-notch customer support. Highly recommended!",
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Founder",
    company: "TechStart Solutions",
    image: "/assets/images/user.png",
    rating: 4,
    text: "A game-changer for our operations. The efficiency gains have been substantial.",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    position: "COO",
    company: "Global Innovations",
    image: "/assets/images/user.png",
    rating: 5,
    text: "The best decision we made this year. Our team's productivity has skyrocketed.",
  },
  {
    id: 5,
    name: "Ahmed Hassan",
    position: "Director of IT",
    company: "FutureTech Corp",
    image: "/assets/images/user.png",
    rating: 5,
    text: "Seamless integration and powerful features. It's transformed our workflow.",
  },
  {
    id: 1,
    name: "Fahad Al-Arfaj",
    position: "CEO",
    company: "GrowthTech Solutions",
    image: "/assets/images/user.png",
    rating: 5,
    text: "The product exceeded our expectations. It's been instrumental in our company's growth.",
  },
  {
    id: 2,
    name: "Sari Johnson",
    position: "CTO",
    company: "InnovateNow Inc.",
    image: "/assets/images/user.png",
    rating: 5,
    text: "Incredible user experience and top-notch customer support. Highly recommended!",
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Founder",
    company: "TechStart Solutions",
    image: "/assets/images/user.png",
    rating: 4,
    text: "A game-changer for our operations. The efficiency gains have been substantial.",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    position: "COO",
    company: "Global Innovations",
    image: "/assets/images/user.png",
    rating: 5,
    text: "The best decision we made this year. Our team's productivity has skyrocketed.",
  },
  {
    id: 5,
    name: "Ahmed Hassan",
    position: "Director of IT",
    company: "FutureTech Corp",
    image: "/assets/images/user.png",
    rating: 5,
    text: "Seamless integration and powerful features. It's transformed our workflow.",
  },
];

// utils/generateBlogs.js

export function generateBlogs(count = 10) {
  const categories = [
    "Forecasting",
    "Market Analysis",
    "Technology",
    "Finance",
    "AI Insights",
  ];
  const titles = [
    "How AI is Transforming Financial Decision-Making",
    "The Future of Stock Market Predictions with AI",
    "AI in Risk Management: Revolutionizing Finance",
    "The Role of AI in Market Volatility Forecasting",
    "AI-Driven Investment Strategies for the Next Decade",
  ];

  let blogs = [];

  for (let i = 0; i < count; i++) {
    const post = {
      id: i + 1,
      image: "/assets/images/temp/blog-img.jpg",
      tags: faker.helpers.arrayElement(categories),
      title: faker.helpers.arrayElement(titles),
      author: faker.person.fullName(),
      date: faker.date.recent().toISOString().split("T")[0], // Format date to YYYY-MM-DD
      description: faker.lorem.sentence(10), // A short sentence like in the description field
      avatar: "/assets/images/user.png",
    };
    blogs.push(post);
  }

  return blogs;
}

export const subjectOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "sales", label: "Sales" },
  { value: "billing", label: "Billing" },
  { value: "feedback", label: "Feedback" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
];
export const allBlogs = [
  {
    id: 1,
    image: "/assets/images/temp/blog-1.png",
    tags: ["Investments"],
    title: "What is Opportunity Cost and Why is it Important?",
    description:
      "Opportunity cost is the value of the best alternative forgone when making a decision, crucial for informed financial choices.",
    author: "Tamer Ragab",
    avatar: "/assets/images/temp/avatar-1.png",
    date: "20 Jan 2024",
  },
  {
    id: 2,
    image: "/assets/images/temp/blog-2.png",
    tags: ["Reporting"],
    title: "Warning Signs in Financial Statements",
    description:
      "This article highlights critical warning signs in financial statements that may indicate deeper issues within a company.",
    author: "Tamer Ragab",
    avatar: "/assets/images/temp/avatar-2.png",
    date: "19 Jan 2024",
  },
  {
    id: 3,
    image: "/assets/images/temp/blog-3.png",
    tags: ["Forecasting"],
    title: "How to Build a Strong Team Using Tuckman's Model",
    description:
      "This article explores how building a strong team is crucial for financial performance, using Tuckman’s model to guide teams through development stages.",
    author: "Tamer Ragab",
    avatar: "/assets/images/temp/avatar-1.png",
    date: "18 Jan 2024",
  },
  {
    id: 4,
    image: "/assets/images/temp/blog-4.png",
    tags: ["Forecasting"],
    title: "The Role of Financial Forecasting in Business Growth",
    description:
      "Understand how financial forecasting plays a crucial role in business growth, planning, and risk management.",
    author: "John Miller",
    avatar: "/assets/images/temp/avatar-2.png",
    date: "17 Jan 2024",
  },
  {
    id: 5,
    image: "/assets/images/temp/blog-5.png",
    tags: ["Forecasting"],
    title: "Supply and Demand: Key Factors Affecting Markets",
    description:
      "An in-depth look at supply and demand dynamics and how they influence the markets and pricing strategies.",
    author: "Michael Lee",
    avatar: "/assets/images/temp/avatar-1.png",
    date: "16 Jan 2024",
  },
  {
    id: 6,
    image: "/assets/images/temp/blog-6.png",
    tags: ["Budgeting"],
    title: "Tax Strategies for Maximizing Savings",
    description:
      "This article discusses effective tax strategies that can help individuals and businesses maximize their savings.",
    author: "Tamer Ragab",
    avatar: "/assets/images/temp/avatar-2.png",
    date: "15 Jan 2024",
  },
  {
    id: 7,
    image: "/assets/images/temp/blog-7.png",
    tags: ["Investments"],
    title: "Understanding Risk in Portfolio Management",
    description:
      "An exploration of different types of investment risk and how they impact portfolio management decisions.",
    author: "Alex Carter",
    avatar: "/assets/images/temp/avatar-1.png",
    date: "14 Jan 2024",
  },
  {
    id: 8,
    image: "/assets/images/temp/blog-8.png",
    tags: ["Budgeting"],
    title: "The Basics of Personal Budgeting",
    description:
      "Learn the essentials of creating a personal budget and how it can help achieve financial stability.",
    author: "David Williams",
    avatar: "/assets/images/temp/avatar-2.png",
    date: "13 Jan 2024",
  },
  {
    id: 9,
    image: "/assets/images/temp/blog-9.png",
    tags: ["Cashflow"],
    title: "How Inflation Impacts Everyday Spending",
    description:
      "An examination of inflation’s effect on purchasing power and strategies to mitigate its impact.",
    author: "Michael Lee",
    avatar: "/assets/images/temp/avatar-1.png",
    date: "12 Jan 2024",
  },
  {
    id: 10,
    image: "/assets/images/temp/blog-10.png",
    tags: ["Investments"],
    title: "Investing in Real Estate: Pros and Cons",
    description:
      "A comprehensive look at real estate investment, covering both its benefits and potential risks.",
    author: "John Miller",
    avatar: "/assets/images/temp/avatar-2.png",
    date: "11 Jan 2024",
  },
  {
    id: 11,
    image: "/assets/images/temp/blog-11.png",
    tags: ["Cashflow"],
    title: "Debt Management: Strategies for Success",
    description:
      "Key strategies to effectively manage and reduce personal and corporate debt.",
    author: "Alex Carter",
    avatar: "/assets/images/temp/avatar-1.png",
    date: "10 Jan 2024",
  },
  {
    id: 12,
    image: "/assets/images/temp/blog-12.png",
    tags: ["Reporting"],
    title: "The Importance of Cash Flow Analysis",
    description:
      "Learn why cash flow analysis is critical for financial health and effective business decision-making.",
    author: "David Williams",
    avatar: "/assets/images/temp/avatar-2.png",
    date: "09 Jan 2024",
  },
  {
    id: 13,
    image: "/assets/images/temp/blog-13.png",
    tags: ["Reporting", "Forecasting", "Cashflow"],
    title: "The Future of Financial Management: AI and Automation",
    description:
      "Learn how AI tools can empower business leaders to make data-driven decisions that enhance profitability and reduce financial risk.",
    author: "Tarek Suleiman",
    avatar: "/assets/images/temp/avatar-1.png",
    date: "10 April 2024",
  },
];
