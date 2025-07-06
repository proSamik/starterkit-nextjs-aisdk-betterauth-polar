import Link from "next/link";
import { FaXTwitter, FaGithub, FaLinkedin } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";

export function FooterSection() {
  return (
    <footer className="relative bg-white text-gray-600 overflow-hidden">
      {/* Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={5}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <div className="text-white font-bold text-lg">N</div>
              </div>
              <div className="text-xl font-bold text-gray-500">
                Next.js Starter
              </div>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
              The complete Next.js starter kit with Polar.sh payments, Better
              Auth authentication, and Postgres database. Build modern web
              applications faster.
            </p>
            <div className="text-gray-500 text-sm mb-4">
              Copyright © 2025 - All rights reserved
            </div>
            <div className="flex space-x-4">
              <a
                href="https://x.com/prosamik"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FaXTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/prosamik"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/prosamik"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:dev.samikc@gmail.com"
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                <MdMail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-gray-500 font-semibold mb-6 text-sm uppercase tracking-wider">
              Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-gray-500 font-semibold mb-6 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  Terms of services
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h3 className="text-gray-500 font-semibold mb-6 text-sm uppercase tracking-wider">
              More
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://prosamik.com"
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  Solopreneur Toolkit
                </a>
              </li>
              <li>
                <a
                  href="https://mapyourideas.com"
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  AI idea organizer
                </a>
              </li>
              <li>
                <a
                  href="https://githubme.com"
                  className="text-gray-500 hover:text-white transition-colors text-sm"
                >
                  Convert Markdown to Landing Page
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Author Section */}
        <div className="flex items-center text-gray-500 text-sm">
          <div className="w-8 h-8 bg-orange-500 rounded-full mr-3 flex items-center justify-center">
            <span className="text-white text-xs">👋</span>
          </div>
          Hey Curious 👋 I&apos;m{" "}
          <a
            href="https://prosamik.com"
            className="text-gray-500 underline mx-1 hover:text-gray-900"
          >
            Samik
          </a>
          , the creator of this Next.js starter kit. You can follow my work on
          <a
            href="https://youtube.com/@prosamik"
            className="text-gray-500 underline ml-1 hover:text-gray-900"
          >
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}
