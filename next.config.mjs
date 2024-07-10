/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/todo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/todo' : '',
};

export default nextConfig;
