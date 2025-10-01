/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "placehold.co",
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
};

export default nextConfig;
