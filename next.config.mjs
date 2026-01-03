/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }, { hostname: "blacklistmc.blob.core.windows.net" }],
  },
};

export default nextConfig;
