import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
