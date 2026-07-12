const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app is deployed on its own, independent of the sibling webhook backend's lockfile.
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    serverActions: {
      // Quote attachments (up to 4 files × 5MB) travel through a Server Action.
      bodySizeLimit: "25mb",
    },
  },
};

module.exports = nextConfig;
