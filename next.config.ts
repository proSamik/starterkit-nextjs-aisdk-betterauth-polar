import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

export default () => {
  const nextConfig: NextConfig = {
    cleanDistDir: true,
    devIndicators: {
      position: "bottom-right",
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "img.youtube.com", // YouTube images
          pathname: "**",
        },
        {
          protocol: "https",
          hostname: "lh3.googleusercontent.com", // Google profile images
          pathname: "**",
        },
        {
          protocol: "https",
          hostname: "avatars.githubusercontent.com", // GitHub profile images
          pathname: "**",
        },
        {
          protocol: "https",
          hostname: "bucket.prosamik.com", // Cloudflare R2 bucket images
          pathname: "**",
        },
      ],
    },
  };
  const withNextIntl = createNextIntlPlugin();
  return withNextIntl(nextConfig);
};
