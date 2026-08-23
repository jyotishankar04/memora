import LandingSlideButton from "@/components/custom/button/landing-slide-button"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

const HeroSection = () => {
  return (
    <div className="bg-[url('/marketing/hero-landing.png')] bg-cover bg-center h-screen  object-cover object-center flex items-center justify-center">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-12 text-center">
        <h2 className="text-balance font-medium text-5xl leading-[1.4] tracking-tighter sm:text-5xl md:text-6xl lg:text-8xl text-white">
          Save Anything.
          <br />
          Find It Instantly.
        </h2>
        <p className="mt-6 text-balance text-center text-zinc-200 text-md tracking-[-0.01em] sm:text-md sm:leading-normal md:text-lg">
          Save websites, videos, screenshots, notes, ideas, and anything else you discover. Memora organizes it automatically so you can find it whenever you need it.
        </p>
        <div className="mx-auto mt-10 flex w-full max-w-xs flex-col items-center justify-center gap-4 sm:flex-row">
          <LandingSlideButton />
        </div>
      </div>
    </div>
  )
}

export default HeroSection