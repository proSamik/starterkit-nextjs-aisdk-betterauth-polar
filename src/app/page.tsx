import { HeroSection } from "@/components/landing/hero-section";
import { WhyNotThatSection } from "@/components/landing/why-not-that-section";
import { InteractiveDemoSection } from "@/components/landing/interactive-demo-section";
import { DemoVideoSection } from "@/components/landing/demo-video-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { FAQSection } from "@/components/landing/faq-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <WhyNotThatSection />
      <InteractiveDemoSection />
      <DemoVideoSection />
      <PricingSection />
      <CTASection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
