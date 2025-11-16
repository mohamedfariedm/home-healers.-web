/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "placehold.co",
      "backend.home-healers.com",
      "development.home-healers.com",
    ],
  },
  async redirects() {
    return [
      {
        source: '/booking-session',
        destination: '/booking',
        permanent: true,
      },
    ];
  },
    async rewrites() {
return [
    {
      source: '/sitemap.xml',
      destination: '/api/sitemap', // not /api/:slug
    },
    {
      source: '/google8cb9aef7afb925eb.html',
      destination: '/api/google8cb9aef7afb925eb', // not /api/:slug
    },
    {
      source: '/robots.txt',
      destination: '/api/robots',
    },
  ];
    },
};

export default nextConfig;
