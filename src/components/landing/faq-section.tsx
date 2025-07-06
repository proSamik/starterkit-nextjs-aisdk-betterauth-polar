"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What's included in this Next.js starter kit?",
    answer:
      "Our starter kit includes complete authentication with Better Auth (email/password + social login), Polar.sh payment integration, PostgreSQL database with Drizzle ORM, responsive UI with Tailwind CSS, internationalization support, Docker deployment, and production-ready configuration.",
  },
  {
    question: "Do I need experience with these technologies to use it?",
    answer:
      "Basic Next.js knowledge is helpful, but the starter kit is designed to be developer-friendly with clear documentation. Each component is well-documented, and we provide setup guides for authentication, payments, and database configuration.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "You can have a fully functional application running in under 5 minutes. Clone the repo, install dependencies, set environment variables, and run the development server. Database migrations and initial setup are automated.",
  },
  {
    question: "Is this production-ready?",
    answer:
      "Absolutely! The starter kit follows Next.js best practices, includes security measures, environment configuration, Docker support, and is optimized for deployment on Vercel, Railway, or any hosting platform that supports Node.js.",
  },
  {
    question: "What payment features are included with Polar.sh?",
    answer:
      "The Polar.sh integration includes subscription billing, one-time payments, customer portal, webhook handling, payment success/failure flows, and support for multiple pricing tiers. Everything needed for a SaaS billing system.",
  },
  {
    question: "Can I customize the authentication system?",
    answer:
      "Yes! Better Auth is highly configurable. You can add more OAuth providers, customize the sign-up flow, add custom fields, implement role-based access, and modify the authentication UI to match your brand.",
  },
  {
    question: "What database and ORM features are included?",
    answer:
      "We use PostgreSQL with Drizzle ORM for type-safe database operations. The kit includes pre-built schemas for users, sessions, and payments, automatic migrations, connection pooling, and easy query building with full TypeScript support.",
  },
  {
    question: "How is the code organized and what's the license?",
    answer:
      "The code follows Next.js App Router conventions with clean separation of concerns. It's MIT licensed, so you can use it for commercial projects, modify it freely, and there are no ongoing licensing fees or restrictions.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-2 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="text-sm font-medium text-blue-600 mb-6">FAQ</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Everything you need to know about our Next.js starter kit.
            Can&apos;t find what you&apos;re looking for?
            <a href="/app" className="text-blue-600 hover:text-blue-700 ml-1">
              Contact our support team.
            </a>
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <p className="text-gray-700 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Need help getting started?
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Can&apos;t find the answer you&apos;re looking for? Check our
              documentation or reach out for technical support.
            </p>
            <a
              href="/app"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
