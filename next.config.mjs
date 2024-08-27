/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/:path((?!api).*)',  
        destination: '/api/not-found',  
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
