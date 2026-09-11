import { useTranslations } from "next-intl";

export default function AuthCard() {
  const t = useTranslations("auth");

  return (
    <div className="relative w-[40%] self-stretch">
      <img
        className="absolute rounded-s-2xl inset-0 w-full h-full object-cover"
        src="/img_login.webp"
        alt="Badminton"
      />
      <div className="absolute inset-0 bg-black/35"></div>
      <div className="relative z-10 flex h-full flex-col justify-between p-7 text-white">
        <div>
          <h2 className="text-xl font-bold">🏸 CauLongVL</h2>

          <p className="mt-2 text-sm">{t("brandTagline")}</p>

          <p className="mt-1 text-sm">{t("brandDescription")}</p>
        </div>
        <div className="rounded-xl bg-white/20 border-white/50 border backdrop-blur-md shadow-md p-4 text-black">
          <p className="italic">&quot;{t("testimonial")}&quot;</p>
          <p className="mt-3">{t("testimonialAuthor")}</p>
        </div>
      </div>
    </div>
  );
}
