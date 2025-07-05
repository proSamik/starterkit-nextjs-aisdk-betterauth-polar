"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-2 pb-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="relative mx-auto my-4 flex max-w-7xl flex-col items-center justify-center">
        <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80">
          <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80">
          <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80">
          <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="px-4 py-10 md:py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-12 mx-auto"
          >
            <Zap className="h-4 w-4 mr-2" />
            Powered by Polar.sh, Better Auth & Drizzle ORM
          </motion.div>

          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl">
            {"Build Modern Web Apps Faster".split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 0.8,
            }}
            className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600"
          >
            The complete Next.js starter kit with Polar.sh payments, Better Auth authentication, 
            and Postgres database. Everything you need to launch your SaaS quickly.
          </motion.p>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.3,
              delay: 1,
            }}
            className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/app"
              className="w-60 transform rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="#demo"
              className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100"
            >
              View Features
            </a>
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
              delay: 1.2,
            }}
            className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md"
          >
            <div className="w-full overflow-hidden rounded-xl border border-gray-300">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-500">Next.js Starter Kit</div>
                </div>

                {/* Feature Preview */}
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white text-lg">💳</span>
                      </div>
                      <h3 className="font-semibold text-sm text-gray-800">Polar.sh</h3>
                      <p className="text-xs text-gray-600 mt-1">Payments & Billing</p>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white text-lg">🔐</span>
                      </div>
                      <h3 className="font-semibold text-sm text-gray-800">Better Auth</h3>
                      <p className="text-xs text-gray-600 mt-1">Authentication</p>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white text-lg">🗄️</span>
                      </div>
                      <h3 className="font-semibold text-sm text-gray-800">Postgres</h3>
                      <p className="text-xs text-gray-600 mt-1">Drizzle ORM</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Everything you need to build and deploy modern web applications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
