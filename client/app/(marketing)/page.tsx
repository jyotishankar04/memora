import HeroSection from "@/components/marketing/landing/hero-section"
import ProblemSection from "@/components/marketing/landing/problem-section"
import FeaturesGridSection from "@/components/marketing/landing/features-grid-section"
import SearchDemoSection from "@/components/marketing/landing/search-demo-section"
import UnderstandingSection from "@/components/marketing/landing/understanding-section"
import ContentTypesSection from "@/components/marketing/landing/content-types-section"
import RediscoverSection from "@/components/marketing/landing/rediscover-section"
import PlatformAvailabilitySection from "@/components/marketing/landing/platform-availability-section"
import PrivacySection from "@/components/marketing/landing/privacy-section"
import PricingTableSection from "@/components/marketing/landing/pricing-table-section"
import FinalCtaSection from "@/components/marketing/landing/final-cta-section"
import MainFooter from "@/components/marketing/landing/main-footer"
import { Navbar } from "@/components/marketing/navbar"

const page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <FeaturesGridSection />
        <SearchDemoSection />
        <ContentTypesSection />
        <RediscoverSection />
        <PlatformAvailabilitySection />
        <PrivacySection />
        <PricingTableSection />
        <FinalCtaSection />
      </main>
      <MainFooter />
    </div>
  )
}

export default page
