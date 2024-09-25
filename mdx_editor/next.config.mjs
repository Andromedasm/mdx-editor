// next.config.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const nextConfig = {
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.mdx$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ['next/babel'],
                    },
                },
                '@mdx-js/loader',
            ],
        });

        if (!isServer) {
            config.resolve.fallback.fs = false;
        }

        return config;
    },
};

export default nextConfig;
