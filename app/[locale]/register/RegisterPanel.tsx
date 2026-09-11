"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import Button from "@/app/components/ui/Button";
import { User, Phone, Lock, Mail, Eye, EyeOff, Gauge } from "lucide-react";

export default function RegisterPanel() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const t = useTranslations("auth");

  return (
    <div className="w-[60%] h-full p-12">
      <h2 className="font-extrabold text-5xl text-button">
        {t("registerTitle")}
      </h2>
      <Input
        id="name"
        label={t("fullName")}
        type="text"
        className="w-[60%]"
        placeholder={t("enterName")}
        icon={<User size={18} />}
      />
      <Input
        id="phone"
        label={t("phone")}
        type="tel"
        inputMode="numeric"
        placeholder={t("enterPhone")}
        icon={<Phone size={18} />}
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
        }}
      />
      <Input
        id="email"
        label={t("email")}
        type="email"
        placeholder={t("enterEmail")}
        icon={<Mail size={18} />}
      />
      <Input
        id="password"
        label={t("password")}
        type={showPassword ? "text" : "password"}
        placeholder={t("enterPassword")}
        icon={<Lock size={18} />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cursor-pointer text-placeholder"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />
      <Input
        id="repassword"
        label={t("confirmPassword")}
        type={showRePassword ? "text" : "password"}
        placeholder={t("reenterPassword")}
        icon={<Lock size={18} />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowRePassword(!showRePassword)}
            className="cursor-pointer text-placeholder"
          >
            {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      <Button className="mt-3">{t("signUp")}</Button>

      <p className="mt-8 text-center text-sm text-gray-700">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-semibold text-text hover:underline">
          {t("loginNow")}
        </Link>
      </p>
    </div>
  );
}
