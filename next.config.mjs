/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      appDir: true,
    },
  },
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["raw.githubusercontent.com", "play.pokemonshowdown.com"],
  },
};

export default nextConfig;
