import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: 10485760, // 10MB
        },
    },
};

export default withNextIntl(nextConfig);
