"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ChevronRight, Menu, Moon, Sun } from "lucide-react";

const features = [
  {
    title: "Quick Capture",
    description: "Save anything instantly.",
    href: "/features/quick-capture",
  },
  {
    title: "Bookmarks",
    description: "Keep your important links organized.",
    href: "/features/bookmarks",
  },
  {
    title: "Notes",
    description: "Capture ideas before they disappear.",
    href: "/features/notes",
  },
  {
    title: "Collections",
    description: "Group related things together.",
    href: "/features/collections",
  },
];

const resources = [
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Help Center",
    href: "/help",
  },
  {
    title: "Changelog",
    href: "/changelog",
  },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const useWhiteText = isHomePage && !isScrolled;

  React.useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed left-0 top-4 z-50 w-full px-4 sm:px-8">
      <nav
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center px-3 rounded-full border transition-all duration-300",
          isScrolled
            ? "border-border/50 bg-background/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.24)]"
            : "border-transparent bg-transparent shadow-none"
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 hover:opacity-90 transition-opacity shrink-0"
        >
          {/* Logo mark */}
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl font-semibold transition-colors duration-300",
              useWhiteText ? "bg-white text-zinc-950" : "bg-foreground text-background"
            )}
          >
            <span className="text-sm font-semibold">M</span>
          </div>

          <span
            className={cn(
              "text-[17px] font-semibold tracking-[-0.03em] transition-colors duration-300",
              useWhiteText ? "text-white" : "text-foreground"
            )}
          >
            memora
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="mx-auto hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {/* Features */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "h-9 rounded-full bg-transparent px-4 text-sm font-medium transition-all duration-300 data-[popup-open]:bg-muted data-[popup-open]:text-foreground",
                    useWhiteText 
                      ? "text-zinc-300 hover:text-white hover:bg-white/10 focus:bg-white/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted focus:bg-muted"
                  )}
                >
                  Features
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="w-[450px] p-3">
                    <div className="mb-2 px-3 py-2">
                      <p className="text-sm font-semibold text-foreground">
                        Everything you want to remember
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Capture, organize and find anything in one place.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      {features.map((feature) => (
                        <Link
                          key={feature.title}
                          href={feature.href}
                          className="
                            group rounded-xl p-3
                            transition-colors
                            hover:bg-muted
                          "
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {feature.title}
                            </span>

                            <ChevronRight
                              className="
                                h-4 w-4
                                text-muted-foreground/40
                                transition-transform
                                group-hover:translate-x-0.5
                                group-hover:text-foreground
                              "
                            />
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {feature.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* How it works */}
              <NavigationMenuItem>
                <Link
                  href="/how-it-works"
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-all duration-300",
                    useWhiteText 
                      ? "text-zinc-300 hover:text-white hover:bg-white/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  How it works
                </Link>
              </NavigationMenuItem>

              {/* Resources */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "h-9 rounded-full bg-transparent px-4 text-sm font-medium transition-all duration-300 data-[popup-open]:bg-muted data-[popup-open]:text-foreground",
                    useWhiteText 
                      ? "text-zinc-300 hover:text-white hover:bg-white/10 focus:bg-white/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted focus:bg-muted"
                  )}
                >
                  Resources
                </NavigationMenuTrigger>

                <NavigationMenuContent>
                  <div className="w-[200px] p-1">
                    {resources.map((resource) => (
                      <Link
                        key={resource.title}
                        href={resource.href}
                        className="
                          block rounded-lg px-3 py-2
                          text-sm text-muted-foreground hover:text-foreground
                          hover:bg-muted
                          transition-colors
                        "
                      >
                        {resource.title}
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pricing */}
              <NavigationMenuItem>
                <Link
                  href="/pricing"
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-4 text-sm font-medium transition-all duration-300",
                    useWhiteText 
                      ? "text-zinc-300 hover:text-white hover:bg-white/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  Pricing
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Right Actions */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-300",
              useWhiteText 
                ? "text-zinc-300 hover:text-white hover:bg-white/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-[18px] w-[18px] transition-all" />
            ) : (
              <Moon className="h-[18px] w-[18px] transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link
            href="/auth/login"
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
              useWhiteText 
                ? "text-zinc-300 hover:text-white hover:bg-white/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Sign in
          </Link>

          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "h-9 rounded-full px-4 text-sm font-medium shadow-sm transition-all duration-200 flex items-center",
              useWhiteText 
                ? "bg-white text-zinc-950 hover:bg-zinc-100" 
                : "bg-primary text-primary-foreground hover:bg-primary/95"
            )}
          >
            Get started
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="ml-auto flex md:hidden items-center gap-1.5">
          {/* Theme Toggle (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all duration-300",
              useWhiteText 
                ? "text-zinc-300 hover:text-white hover:bg-white/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-[18px] w-[18px] transition-all" />
            ) : (
              <Moon className="h-[18px] w-[18px] transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Get Started (Mobile sm+) */}
          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "hidden sm:inline-flex h-9 rounded-full px-4 text-xs font-medium shadow-sm transition-all duration-200 flex items-center",
              useWhiteText 
                ? "bg-white text-zinc-950 hover:bg-zinc-100" 
                : "bg-primary text-primary-foreground hover:bg-primary/95"
            )}
          >
            Get started
          </Link>

          {/* Hamburger Sheet */}
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-full transition-all duration-300",
                    useWhiteText 
                      ? "text-zinc-300 hover:text-white hover:bg-white/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                />
              }
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:max-w-sm p-6 bg-background border-l border-border flex flex-col justify-between"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Mobile navigation menu for Memora.
              </SheetDescription>
              <div>
                <div className="flex items-center gap-2 mb-8 pr-10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background font-semibold">
                    M
                  </div>
                  <span className="text-[17px] font-semibold tracking-[-0.03em] text-foreground">
                    memora
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Product
                    </h4>
                    <div className="space-y-2">
                      <Link
                        href="/how-it-works"
                        className="block px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        How it works
                      </Link>
                      <Link
                        href="/pricing"
                        className="block px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        Pricing
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Features
                    </h4>
                    <div className="grid grid-cols-1 gap-1">
                      {features.map((feature) => (
                        <Link
                          key={feature.title}
                          href={feature.href}
                          className="group block px-2 py-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {feature.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {feature.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Resources
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {resources.map((resource) => (
                        <Link
                          key={resource.title}
                          href={resource.href}
                          className="block px-2 py-1.5 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                        >
                          {resource.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-border mt-auto">
                <Link
                  href="/auth/login"
                  className="
                    flex h-10 items-center justify-center rounded-full
                    text-sm font-medium text-foreground border border-border
                    hover:bg-muted transition-colors
                  "
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className={cn(
                    buttonVariants({ variant: "default", size: "default" }),
                    "w-full h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center font-medium"
                  )}
                >
                  Get started
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}