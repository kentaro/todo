import { execSync } from 'child_process';

const getGitRef = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    console.error('Failed to get Git ref:', e);
    return 'unknown';
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/todo',
  assetPrefix: '/todo/',
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        '__GIT_REF__': JSON.stringify(getGitRef()),
      })
    );
    return config;
  },
};

export default nextConfig;
