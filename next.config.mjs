/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }, { hostname: "blacklistmc.blob.core.windows.net" }],
  },
};

export default nextConfig;
