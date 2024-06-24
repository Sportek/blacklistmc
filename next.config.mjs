/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }],
  },
  rewrites: [
    {
      source: "/api/users/:userId/blacklist/:blacklistId/proofs",
      destination: "/api/users/:userId/blacklist/:blacklistId/proofs",
      has: [
        {
          type: "header",
          key: "content-type",
          value: "(multipart/form-data|application/octet-stream)",
        },
      ],
      api: {
        body: {
          bodyParser: false,
        },
      },
    },
  ],
};

export default nextConfig;
