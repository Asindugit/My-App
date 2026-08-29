"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", href: "#home" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="
      fixed left-0 right-0 top-0 z-50
      border-b border-gray-200/70 dark:border-gray-800
      bg-white/80 dark:bg-black/80
      backdrop-blur-xl
    ">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">

        <a
          href="#home"
          className="text-xl font-bold tracking-tight"
        >
          Asindu<span className="text-blue-600">Himansha</span>
        </a>

        {/* Desktop */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="
                text-sm font-medium
                text-gray-600 dark:text-gray-300
                transition hover:text-blue-600
              "
            >
              {link.name}
            </a>
          ))}

          <ThemeToggle />
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2"
            aria-label="Open menu"
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="
          border-t border-gray-200
          bg-white dark:border-gray-800 dark:bg-black
          md:hidden
        ">
          <div className="flex flex-col px-5 py-4">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className="
                  border-b border-gray-100
                  py-4 text-sm font-medium
                  text-gray-700 dark:border-gray-800
                  dark:text-gray-300
                "
              >
                {link.name}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}