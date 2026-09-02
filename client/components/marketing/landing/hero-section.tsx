import LandingSlideButton from "@/components/custom/button/landing-slide-button"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon as ArrowUpRight, StarIcon as Star } from "@hugeicons/core-free-icons";

const HeroSection = () => {
  return (
    <div className="bg-[url('/marketing/hero-landing.png')] bg-cover bg-center h-screen  object-cover object-center flex items-center justify-center">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-12 text-center">
        {/* Social proof pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white/90">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <HugeiconsIcon icon={Star} strokeWidth={2.25} key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-white/40">·</span>
          <span>Loved by early users saving their digital brain</span>
        </div>
        <h2 className="text-balance font-medium text-5xl leading-[1.4] tracking-tighter sm:text-5xl md:text-6xl lg:text-8xl text-white">
          Save Anything.
          <br />
          Find It Instantly.
        </h2>
        <p className="mt-6 text-balance text-center text-zinc-200 text-md tracking-[-0.01em] sm:text-md sm:leading-normal md:text-lg">
          Save websites, videos, screenshots, notes, ideas, and anything else you discover. SaveForLatter organizes it automatically so you can find it whenever you need it.
        </p>
        <div className="mx-auto mt-10 flex w-full max-w-xs flex-col items-center justify-center gap-4 sm:flex-row">
          <LandingSlideButton />
        </div>
      </div>
    </div>
  )
}

export default HeroSection