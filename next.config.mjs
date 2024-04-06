/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        LOCATION_KEY: process.env.LOCATION_KEY,
    }
};

export default nextConfig;
