/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: '^app\\.(.*)$', // regex to match app.ideas-hunt.com exactly
                    },
                ],
                destination: '/app/:path*'
            },
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: '^(?!app\\.).+', // regex to match ideas-hunt.com
                    },
                ],
                destination: '/www/:path*', // redirect to the www folder
            },
        ]
    }
};

export default nextConfig;