import type { ReactNode } from "react";

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] antialiased">
      {children}
    </div>
  );
}
