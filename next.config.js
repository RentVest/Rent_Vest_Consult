/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: ['./app/styles'],
    prependData: `@import "variables";`,
  },
};

module.exports = nextConfig;
