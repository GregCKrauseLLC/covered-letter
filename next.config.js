/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
  // https://nextjs.org/docs/app/api-reference/next-config-js/output#automatically-copying-traced-files
  output: "standalone",
};

module.exports = nextConfig;
