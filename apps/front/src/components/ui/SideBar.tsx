"use client";

import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode, useRef, useState, useEffect } from "react";
import { useOnClickOutside } from "usehooks-ts";

type Props = PropsWithChildren<{
  triggerIcon: ReactNode;
  triggerClassName?: string;
}>;

const SideBar = ({ triggerIcon, triggerClassName, children }: Props) => {
  const [show, setShow] = useState(false);

  // Ref dengan tipe HTMLDivElement, aman untuk div
  const ref = useRef<HTMLDivElement>(null!)


  useOnClickOutside(ref, () => setShow(false));

  // Optional: tutup sidebar saat tekan ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShow(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        className={triggerClassName}
        onClick={() => setShow((prev) => !prev)}
        aria-label="Toggle Sidebar"
      >
        {triggerIcon}
      </button>

      <div
        ref={ref}
        className={cn(
          "w-60 absolute top-0 z-50 duration-300 transition-all bg-white rounded-r-md min-h-screen shadow-md",
          {
            "-left-full": !show,
            "left-0": show,
          }
        )}
      >
        {children}
      </div>
    </>
  );
};

export default SideBar;
