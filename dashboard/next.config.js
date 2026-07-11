const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app is deployed on its own, independent of the sibling webhook backend's lockfile.
  outputFileTracingRoot: path.join(__dirname),
};

module.exports = nextConfig;
