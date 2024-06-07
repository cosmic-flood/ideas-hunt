/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '^app\\.(.*)$' // regex to match app.redditsale.com exactly
          }
        ],
        destination: '/app/:path*'
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '^(?!app\\.).+' // regex to match redditsale.com
          }
        ],
        destination: '/www/:path*', // redirect to the www folder
      }
    ];
  }
};

export default nextConfig;