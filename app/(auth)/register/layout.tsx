import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create account · DiaMate",
  description: "Register for DiaMate diabetes management",
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
