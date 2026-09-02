"use client";

import { createContext, useContext } from "react";

interface SidebarState {
  /** True once the collapse animation starts (through "collapsed") — mirrors the main aside's visible width. */
  collapsed: boolean;
  /** True only once fully collapsed, once the floating dock has replaced the aside — collapsing is a multi-stage animation (see AppShell's sidebarPhase), this is the settled end state. */
  fullyCollapsed: boolean;
}

const SidebarStateContext = createContext<SidebarState>({ collapsed: false, fullyCollapsed: false });

export const SidebarStateProvider = SidebarStateContext.Provider;

/** Lets a page react to the main nav sidebar's collapse state — e.g. Ask
 * hides its own on-page thread-history column once fully collapsed, since
 * that history becomes reachable from the floating dock instead and would
 * otherwise render with nowhere good to dock. */
export function useSidebarState() {
  return useContext(SidebarStateContext);
}
