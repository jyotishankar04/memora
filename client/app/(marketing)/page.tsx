import HeroSection from "@/components/marketing/landing/hero-section"
import ProblemSection from "@/components/marketing/landing/problem-section"
import SearchDemoSection from "@/components/marketing/landing/search-demo-section"
import UnderstandingSection from "@/components/marketing/landing/understanding-section"
import AskSection from "@/components/marketing/landing/ask-section"
import ConnectionsSection from "@/components/marketing/landing/connections-section"
import RediscoverSection from "@/components/marketing/landing/rediscover-section"
import CaptureSection from "@/components/marketing/landing/capture-section"
import ContentTypesSection from "@/components/marketing/landing/content-types-section"
import VisionSection from "@/components/marketing/landing/vision-section"
import FeaturesGridSection from "@/components/marketing/landing/features-grid-section"
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
        <SearchDemoSection />
        <UnderstandingSection />
        <AskSection />
        <ConnectionsSection />
        <RediscoverSection />
        <CaptureSection />
        <ContentTypesSection />
        <VisionSection />
        <FeaturesGridSection />
        <PrivacySection />
        <PricingTableSection />
        <FinalCtaSection />
      </main>
      <MainFooter />
    </div>
  )
}

export default page