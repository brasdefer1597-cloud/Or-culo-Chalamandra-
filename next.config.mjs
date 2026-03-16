/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.minimizer = [];
    }
    return config;
  }
};

export default nextConfig;
