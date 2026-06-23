/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Wait for generateMetadata before sending HTML so title/canonical appear in view-source
  htmlLimitedBots: /.*/,
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Dev-mode optimization is on-demand and very slow; skip locally.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "backend.home-healers.com",
      },
      {
        protocol: "https",
        hostname: "development.home-healers.com",
      },
      {
        protocol: "https",
        hostname: "codia-f2c.s3.us-west-1.amazonaws.com",
      },
    ],
    domains: [
      "placehold.co",
      "backend.home-healers.com",
      "development.home-healers.com",
      "codia-f2c.s3.us-west-1.amazonaws.com",
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
