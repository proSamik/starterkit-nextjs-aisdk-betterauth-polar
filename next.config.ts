import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

export default () => {
  const nextConfig: NextConfig = {
    cleanDistDir: true,
    devIndicators: {
      position: "bottom-right",
    },
    env: {
      NO_HTTPS: process.env.NO_HTTPS,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      NEXT_PUBLIC_POLAR_MONTHLY_PRODUCT_ID:
        process.env.POLAR_MONTHLY_PRODUCT_ID,
      NEXT_PUBLIC_POLAR_YEARLY_PRODUCT_ID: process.env.POLAR_YEARLY_PRODUCT_ID,
      NEXT_PUBLIC_POLAR_LIFETIME_PRODUCT_ID:
        process.env.POLAR_LIFETIME_PRODUCT_ID,
    },
    images: {
      domains: [
        "img.youtube.com", // YouTube images
        "lh3.googleusercontent.com", // Google profile images
        "avatars.githubusercontent.com", // GitHub profile images
      ],
    },
  };
  const withNextIntl = createNextIntlPlugin();
  return withNextIntl(nextConfig);
};
