import type { ReactNode } from "react";
import { FaClipboardCheck } from "react-icons/fa";
import Header from "@/app/components/Header";

export default function EvaluatorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F9F4] text-[#0A2540]">
      <Header showNavigation={false} />
      <main>
        <div className="border-b-4 border-[#76B947] bg-linear-to-r from-[#103454] to-[#061F39] text-white">
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-7 sm:px-8">
            <div className="flex w-[clamp(2.5rem,3vw,3.75rem)] shrink-0 justify-center">
              <FaClipboardCheck aria-hidden="true" className="text-3xl text-[#F0C674]" />
            </div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">Abstract Evaluation</h1>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
