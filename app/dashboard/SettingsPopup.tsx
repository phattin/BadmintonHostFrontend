"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

import { Check, Languages, Moon, Sun } from "lucide-react";

interface SettingsPopupProps {
  open: boolean;
}

type Language = "en" | "vi";

export default function SettingsPopup({ open }: SettingsPopupProps) {
  const t = useTranslations("settings");
  const pathname = usePathname();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(
    () =>
      typeof window !== "undefined" && localStorage.getItem("theme") === "dark",
  );
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "vi";

    const savedLanguage = localStorage.getItem("language");
    return savedLanguage === "en" || savedLanguage === "vi"
      ? savedLanguage
      : "vi";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    const nextDarkMode = !darkMode;

    setDarkMode(nextDarkMode);
    localStorage.setItem("theme", nextDarkMode ? "dark" : "light");
  };

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    localStorage.setItem("language", value);
    router.replace(pathname, { locale: value });
  };

  return (
    <div
      className={`absolute right-0 bottom-full left-0 mb-3 origin-bottom rounded-xl border border-tag bg-background p-2 shadow-xl transition-all duration-200 ${
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <h3 className="font-semibold">{t("title")}</h3>

      {/* DARK MODE */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-bg text-text">
            {darkMode ? <Moon size={17} /> : <Sun size={17} />}
          </div>

          <div>
            <p className="text-sm font-semibold">{t("darkMode")}</p>
            <p className="text-xs text-foreground/60">{t("changeTheme")}</p>
          </div>
        </div>

        <button
          type="button"
          role="checkbox"
          aria-checked={darkMode}
          aria-label={t("toggleDarkMode")}
          onClick={handleToggleDarkMode}
          className={`flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition ${
            darkMode
              ? "border-surface bg-primary text-surface"
              : "border-foreground/60 bg-background text-transparent hover:border-tag"
          }`}
        >
          <Check size={15} strokeWidth={3} />
        </button>
      </div>

      {/* LANGUAGE */}
      <div className="mt-5">
        <div className="mb-2 flex items-center gap-2">
          <Languages size={16} />

          <p className="text-sm font-semibold">{t("language")}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleLanguageChange("en")}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              language === "en"
                ? "border-primary bg-tag"
                : "border-foreground/30 bg-surface text-foreground/60 hover:bg-background"
            }`}
          >
            {t("english")}
          </button>

          <button
            type="button"
            onClick={() => handleLanguageChange("vi")}
            className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              language === "vi"
                ? "border-primary bg-tag"
                : "border-foreground/30 bg-surface text-foreground/60 hover:bg-background"
            }`}
          >
            {t("vietnamese")}
          </button>
        </div>
      </div>
    </div>
  );
}
