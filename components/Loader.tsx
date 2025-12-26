'use client';

import { useThemeStore } from "@/stores/themeStore";

export function Loader() {
  const theme = useThemeStore((s) => s.theme);
  
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12">
          <div 
            className="absolute inset-0 border-4 rounded-full animate-spin"
            style={{
              borderColor: theme === 'light' ? '#8b5cf6' : '#ffffff',
              borderTopColor: 'transparent',
            }}
          />
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
          Loading...
        </p>
      </div>
    </div>
  );
}

