/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com", "play.pokemonshowdown.com"],
  },
};

export default nextConfig;
