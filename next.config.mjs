/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Wait for generateMetadata before sending HTML so title/canonical appear in view-source
  htmlLimitedBots: /.*/,
  images: {
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
