"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const userPreference = localStorage.getItem("theme-preference"); // "manual" or "system"

    if (savedTheme && userPreference === "manual") {
      // Use manually set preference
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Follow system theme
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(systemPrefersDark);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const userPreference = localStorage.getItem("theme-preference");
      // Only auto-update if following system preference
      if (userPreference !== "manual") {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      localStorage.setItem("theme-preference", "manual"); // Mark as manually set
      return newValue;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
