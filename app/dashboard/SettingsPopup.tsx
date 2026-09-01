"use client";

import { useEffect, useState } from "react";

import { Check, Languages, Moon, Sun } from "lucide-react";

interface SettingsPopupProps {
  open: boolean;
}

type Language = "en" | "vi";

export default function SettingsPopup({
  open,
}: SettingsPopupProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLanguage = localStorage.getItem(
      "language",
    ) as Language | null;

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleToggleDarkMode = () => {
    const nextDarkMode = !darkMode;

    setDarkMode(nextDarkMode);

    if (nextDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLanguageChange = (
    value: Language,
  ) => {
    setLanguage(value);
    localStorage.setItem("language", value);
  };

  return (
    <div
      className={`absolute right-0 bottom-full left-0 mb-3 origin-bottom rounded-xl border border-placeholder bg-white p-2 shadow-xl transition-all duration-200 ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <h3 className="font-semibold text-text">
        Settings
      </h3>

      {/* DARK MODE */}
        <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-bg text-text">
            {darkMode ? <Moon size={17} /> : <Sun size={17} />}
            </div>

            <div>
            <p className="text-sm font-semibold">Dark Mode</p>
            <p className="text-xs text-gray-500">Change interface theme</p>
            </div>
        </div>

        <button
            type="button"
            role="checkbox"
            aria-checked={darkMode}
            aria-label="Toggle dark mode"
            onClick={handleToggleDarkMode}
            className={`flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition ${
            darkMode
                ? "border-text bg-text text-white"
                : "border-gray-300 bg-white text-transparent hover:border-placeholder"
            }`}
        >
            <Check size={15} strokeWidth={3} />
        </button>
        </div>

      {/* LANGUAGE */}
      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <Languages
            size={16}
            className="text-text"
          />

          <p className="text-sm font-semibold">
            Language
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              handleLanguageChange("en")
            }
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              language === "en"
                ? "border-main3 bg-placeholder text-text"
                : "border-gray-200 bg-white text-gray-600 hover:bg-bg"
            }`}
          >
            English
          </button>

          <button
            type="button"
            onClick={() =>
              handleLanguageChange("vi")
            }
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              language === "vi"
                ? "border-main3 bg-placeholder text-text"
                : "border-gray-200 bg-white text-gray-600 hover:bg-bg"
            }`}
          >
            Tiếng Việt
          </button>
        </div>
      </div>
    </div>
  );
}