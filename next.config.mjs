/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
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
      {
        protocol: "https",
        hostname: "apis.home-healers.com",
      },
      {
        protocol: "http",
        hostname: "backend.home-healers.com",
      },
      {
        protocol: "http",
        hostname: "development.home-healers.com",
      },
    ],
    domains: [
      "placehold.co",
      "backend.home-healers.com",
      "development.home-healers.com",
      "codia-f2c.s3.us-west-1.amazonaws.com",
      "apis.home-healers.com",
    ],
  },
  async redirects() {
    return [
      {
        source: '/booking-session',
        destination: '/booking',
        permanent: true,
      },
      {
        source: '/backges',
        destination: '/offers',
        permanent: true,
      },
      {
        source: '/backges/:path*',
        destination: '/offers/:path*',
        permanent: true,
      },
      {
        source: '/en/backges',
        destination: '/en/offers',
        permanent: true,
      },
      {
        source: '/en/backges/:path*',
        destination: '/en/offers/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/.well-known/apple-app-site-association",
          destination: "/.well-known/apple-app-site-association.json",
        },
      ],
      afterFiles: [
        {
          source: "/sitemap.xml",
          destination: "/api/sitemap",
        },
        {
          source: "/google8cb9aef7afb925eb.html",
          destination: "/api/google8cb9aef7afb925eb",
        },
        {
          source: "/robots.txt",
          destination: "/api/robots",
        },
        {
          source: "/llms.txt",
          destination: "/api/llms",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), payment=(self)",
          },
        ],
      },
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
      {
        source: "/.well-known/apple-app-site-association.json",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
