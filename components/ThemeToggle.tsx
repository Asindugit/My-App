"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setDark(false);
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      document.documentElement.classList.toggle("dark", systemDark);
      setDark(systemDark);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;

    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");

    setDark(newDark);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        flex h-10 w-10 items-center justify-center
        rounded-full border
        border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        text-gray-700 dark:text-gray-200
        transition
        hover:scale-105
      "
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}