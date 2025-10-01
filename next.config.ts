
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async headers() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value:
                "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://picsum.photos https://firebasestorage.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com https://firestore.googleapis.com https://generativelanguage.googleapis.com;",
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
          ],
        },
      ];
    }
    return [];
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
