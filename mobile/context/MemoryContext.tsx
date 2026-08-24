import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Memory {
  id: string;
  type: "web" | "video" | "note" | "image" | "voice";
  title: string;
  source: string;
  desc: string;
  content?: string;
  tags: string[];
  timeAgo: string;
  createdAt: number;
  isFavorite?: boolean;
}

interface MemoryContextType {
  memories: Memory[];
  addMemory: (memory: Omit<Memory, "id" | "timeAgo" | "createdAt">) => void;
  deleteMemory: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

const initialMemories: Memory[] = [
  {
    id: "mem-1",
    type: "web",
    title: "Beautiful SaaS Landing",
    source: "linear.app",
    desc: "SaaS Dashboard inspiration. Clean side navigation, metrics grids, shortcuts.",
    tags: ["Design", "SaaS"],
    timeAgo: "2 min ago",
    createdAt: Date.now() - 120000
  },
  {
    id: "mem-2",
    type: "video",
    title: "Building Better SaaS Products",
    source: "youtube.com",
    desc: "A great video guide covering monorepo setups, package configurations, and deploy structures.",
    tags: ["Dev", "SaaS"],
    timeAgo: "1 hour ago",
    createdAt: Date.now() - 3600000
  },
  {
    id: "mem-3",
    type: "note",
    title: "Indie SaaS Analytics Idea",
    source: "Personal Note",
    desc: "I should build a SaaS analytics tool for indie hackers...",
    tags: ["Ideas", "Startup"],
    timeAgo: "Yesterday",
    createdAt: Date.now() - 86400000
  },
  {
    id: "mem-4",
    type: "web",
    title: "PostgreSQL index tuning guides",
    source: "postgresql.org",
    desc: "Tuning queries, B-Tree index adjustments, and indexing jsonb fields for SaaS schemas.",
    tags: ["Database", "Dev"],
    timeAgo: "3 months ago",
    createdAt: Date.now() - 90 * 24 * 3600000
  }
];

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);

  const addMemory = (newMem: Omit<Memory, "id" | "timeAgo" | "createdAt">) => {
    const memory: Memory = {
      ...newMem,
      id: `mem-${Math.random().toString(36).substr(2, 9)}`,
      timeAgo: "Just now",
      createdAt: Date.now()
    };
    setMemories(prev => [memory, ...prev]);
  };

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  return (
    <MemoryContext.Provider value={{ memories, addMemory, deleteMemory, toggleFavorite }}>
      {children}
    </MemoryContext.Provider>
  );
}

export function useMemories() {
  const context = useContext(MemoryContext);
  if (!context) {
    throw new Error("useMemories must be used within a MemoryProvider");
  }
  return context;
}
