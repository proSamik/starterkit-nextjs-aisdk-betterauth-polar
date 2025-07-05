import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-2 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-yellow-100 bg-opacity-20 text-gray-900 rounded-full text-sm font-medium mb-12">
            <Sparkles className="h-4 w-4 mr-2 text-gray-900" />
            Built by developers, for developers
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Ready to Build Your
            <span className="block">Next Project?</span>
          </h2>

          <p className="text-lg md:text-xl text-blue-100 mb-16 max-w-2xl mx-auto leading-relaxed">
            Start building modern web applications today with our complete Next.js 
            starter kit featuring payments, authentication, and database.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/app"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Pricing
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-2">⚡</div>
              <div className="text-blue-100">
                <div className="font-semibold">Quick Setup</div>
                <div className="text-sm">Production-ready in 3 minutes</div>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">🔒</div>
              <div className="text-blue-100">
                <div className="font-semibold">Security Built-in</div>
                <div className="text-sm">Best practices & secure defaults</div>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-2">🚀</div>
              <div className="text-blue-100">
                <div className="font-semibold">Deploy Anywhere</div>
                <div className="text-sm">Vercel, Docker, or your infrastructure</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
