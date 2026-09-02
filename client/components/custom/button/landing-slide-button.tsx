import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon as ArrowUpRight } from "@hugeicons/core-free-icons";

const LandingSlideButton = ({ href = "/auth/signup" }: { href?: string }) => {
  return (
    <Button
      render={<Link href={href} />}
      nativeButton={false}
      className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer"
    >
      <span className="relative z-10 transition-all duration-500">
        Start for free
      </span>
      <div className="absolute right-1 w-10 h-10 bg-white text-zinc-950 rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
        <HugeiconsIcon icon={ArrowUpRight} strokeWidth={2.25} size={16} />
      </div>
    </Button>
  );
};

export default LandingSlideButton;
