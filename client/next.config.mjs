/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: "img.vietqr.io",
      },
    ],
  },
};

export default nextConfig;
