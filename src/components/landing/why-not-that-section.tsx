import { X, Check } from "lucide-react";

export function WhyNotThatSection() {
  return (
    <section className="py-2 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Why choose our starter kit?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Building from scratch takes months. Our complete starter kit gets you 
            from idea to production-ready app in days, not weeks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Building from Scratch */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mr-3">
                <X className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Building from Scratch
              </h3>
            </div>

            <ul className="space-y-6">
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Weeks to set up authentication and user management
                </span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Complex payment integration and billing logic
                </span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Database schema design and migration headaches
                </span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Security vulnerabilities and best practices research
                </span>
              </li>
              <li className="flex items-start">
                <X className="h-5 w-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Deployment configuration and infrastructure setup
                </span>
              </li>
            </ul>
          </div>

          {/* Our Solution */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-blue-800">Our Starter Kit</h3>
            </div>

            <ul className="space-y-6">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Complete auth system with social login ready in minutes
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Polar.sh payments integrated with subscriptions and billing
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Type-safe database with Drizzle ORM and migrations
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  Production-ready security and best practices built-in
                </span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm">
                  One-click deployment to Vercel with full Docker support
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-lg text-gray-600 mb-8">
            Ready to build your next great web app?
          </p>
          <a
            href="/app"
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Get Started Now
          </a>
        </div>
      </div>
    </section>
  );
}
