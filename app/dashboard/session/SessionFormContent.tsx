"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  CalendarClock,
  CircleDollarSign,
  MapPin,
  Package,
  Users,
} from "lucide-react";

import WhiteCard from "@/app/components/WhiteCard";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";

interface Venue {
  id: number;
  name: string;
}

interface Court {
  id: number;
  venueId: number;
  name: string;
  status: "AVAILABLE" | "MAINTENANCE" | "INACTIVE";
}

interface ShuttleCock {
  id: number;
  name: string;
  pricePerShuttleCock: number;
}

export interface SessionFormData {
  venueId: string;
  courtIds: number[];

  totalPriceCourt: string;
  maxSlot: string;
  genderPriceDifference: string;

  shuttleCockId: string;
  pricePerShuttleCock: string;
  shuttleCockExpected: string;

  priceMale: string;
  priceFemale: string;

  startTime: string;
  endTime: string;
}

interface SessionFormContentProps {
  mode?: "add" | "edit";
  initialData?: SessionFormData;
}

interface SuggestedPrice {
  male: number;
  female: number;
  average: number;
  totalCost: number;
  shuttleCockCost: number;
  valid: boolean;
}

const venues: Venue[] = [
  {
    id: 1,
    name: "Downtown Arena",
  },
  {
    id: 2,
    name: "Westside Park",
  },
];

const courts: Court[] = [
  {
    id: 1,
    venueId: 1,
    name: "Court 1",
    status: "AVAILABLE",
  },
  {
    id: 2,
    venueId: 1,
    name: "Court 2",
    status: "AVAILABLE",
  },
  {
    id: 3,
    venueId: 1,
    name: "Court 3",
    status: "AVAILABLE",
  },
  {
    id: 4,
    venueId: 2,
    name: "Court A",
    status: "AVAILABLE",
  },
  {
    id: 5,
    venueId: 2,
    name: "Court B",
    status: "MAINTENANCE",
  },
];

const shuttleCocks: ShuttleCock[] = [
  {
    id: 1,
    name: "Yonex Aerosensa 30",
    pricePerShuttleCock: 35000,
  },
  {
    id: 2,
    name: "Victor Master No. 3",
    pricePerShuttleCock: 30000,
  },
];

const emptyForm: SessionFormData = {
  venueId: "",
  courtIds: [],

  totalPriceCourt: "",
  maxSlot: "",
  genderPriceDifference: "",

  shuttleCockId: "",
  pricePerShuttleCock: "",
  shuttleCockExpected: "",

  priceMale: "",
  priceFemale: "",

  startTime: "",
  endTime: "",
};

export default function SessionFormContent({
  mode = "add",
  initialData,
}: SessionFormContentProps) {
  const router = useRouter();
  const t = useTranslations("sessionForm");

  const [formData, setFormData] = useState<SessionFormData>(
    () => initialData ?? emptyForm,
  );

  const [formError, setFormError] = useState("");

  const availableCourts = useMemo(() => {
    if (!formData.venueId) {
      return [];
    }

    return courts.filter((court) => court.venueId === Number(formData.venueId));
  }, [formData.venueId]);

  const suggestedPrice = useMemo<SuggestedPrice | null>(() => {
    const totalPriceCourt = Number(formData.totalPriceCourt);
    const maxSlot = Number(formData.maxSlot);

    const shuttleCockExpected = Number(formData.shuttleCockExpected) || 0;

    const pricePerShuttleCock = Number(formData.pricePerShuttleCock) || 0;

    const genderPriceDifference = Number(formData.genderPriceDifference) || 0;

    if (
      !formData.totalPriceCourt ||
      !formData.maxSlot ||
      totalPriceCourt < 0 ||
      maxSlot <= 0
    ) {
      return null;
    }

    const shuttleCockCost = shuttleCockExpected * pricePerShuttleCock;

    const totalCost = totalPriceCourt + shuttleCockCost;

    const average = totalCost / maxSlot;

    const male = average + genderPriceDifference / 2;

    const female = average - genderPriceDifference / 2;

    return {
      male,
      female,
      average,
      totalCost,
      shuttleCockCost,
      valid: male >= 0 && female >= 0,
    };
  }, [
    formData.totalPriceCourt,
    formData.maxSlot,
    formData.shuttleCockExpected,
    formData.pricePerShuttleCock,
    formData.genderPriceDifference,
  ]);

  const handleChange = (field: keyof SessionFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const handleVenueChange = (venueId: string) => {
    setFormData((prev) => ({
      ...prev,
      venueId,
      courtIds: [],
    }));
  };

  const handleToggleCourt = (court: Court) => {
    if (court.status !== "AVAILABLE") {
      return;
    }

    setFormData((prev) => {
      const selected = prev.courtIds.includes(court.id);

      return {
        ...prev,
        courtIds: selected
          ? prev.courtIds.filter((id) => id !== court.id)
          : [...prev.courtIds, court.id],
      };
    });
  };

  const handleShuttleCockChange = (id: string) => {
    const shuttleCock = shuttleCocks.find((item) => item.id === Number(id));

    setFormData((prev) => ({
      ...prev,
      shuttleCockId: id,
      pricePerShuttleCock: shuttleCock
        ? String(shuttleCock.pricePerShuttleCock)
        : "",
    }));
  };

  const handleBack = () => {
    router.push("/dashboard/session");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.venueId) {
      setFormError(t("selectVenueError"));
      return;
    }

    if (formData.courtIds.length === 0) {
      setFormError(t("selectCourtError"));
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setFormError(t("selectTimesError"));
      return;
    }

    if (
      new Date(formData.endTime).getTime() <=
      new Date(formData.startTime).getTime()
    ) {
      setFormError(t("endTimeError"));
      return;
    }

    if (Number(formData.maxSlot) <= 0) {
      setFormError(t("maxSlotError"));
      return;
    }

    if (!formData.priceMale || !formData.priceFemale) {
      setFormError(t("pricesError"));
      return;
    }

    if (mode === "add") {
      console.log("Create session:", formData);
    } else {
      console.log("Update session:", formData);
    }

    router.push("/dashboard/session");
  };

  return (
    <div className="min-h-full w-full bg-background p-5 pb-24 md:p-8 lg:pb-8">
      {/* BACK */}
      <button
        type="button"
        onClick={handleBack}
        className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary transition hover:opacity-70"
      >
        <ArrowLeft size={16} />
        {t("back")}
      </button>

      {/* TITLE */}
      <div className="mt-4">
        <h1>{mode === "add" ? t("planTitle") : t("editTitle")}</h1>

        <p className="mt-1 text-sm text-foreground/60">{t("description")}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <WhiteCard className="flex-col items-stretch gap-8">
          {/* VENUE & TIMING */}
          <section>
            <SectionTitle
              icon={<MapPin size={19} />}
              title={t("venueTiming")}
            />

            <Select
              id="session-venue"
              label={t("venue")}
              value={formData.venueId}
              onChange={(event) => handleVenueChange(event.target.value)}
              required
            >
              <option value="">{t("selectVenue")}</option>

              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </Select>

            <div className="grid gap-0 md:grid-cols-2 md:gap-4">
              <Input
                id="start-time"
                label={t("startTime")}
                type="datetime-local"
                icon={<CalendarClock size={16} />}
                value={formData.startTime}
                onChange={(event) =>
                  handleChange("startTime", event.target.value)
                }
                required
              />

              <Input
                id="end-time"
                label={t("endTime")}
                type="datetime-local"
                icon={<CalendarClock size={16} />}
                value={formData.endTime}
                onChange={(event) =>
                  handleChange("endTime", event.target.value)
                }
                required
              />
            </div>

            {/* COURT MULTI SELECT */}
            <div className="mt-5">
              <p className="text-sm font-semibold text-foreground">
                {t("allocateCourts")}
              </p>

              <div className="mt-2 flex min-h-16 flex-wrap items-center gap-2 rounded-lg border border-foreground/30 bg-background p-3">
                {!formData.venueId ? (
                  <p className="text-sm text-foreground/60">
                    {t("selectVenueFirst")}
                  </p>
                ) : availableCourts.length === 0 ? (
                  <p className="text-sm text-foreground/60">{t("noCourts")}</p>
                ) : (
                  availableCourts.map((court) => {
                    const selected = formData.courtIds.includes(court.id);

                    const disabled = court.status !== "AVAILABLE";

                    return (
                      <button
                        key={court.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleToggleCourt(court)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          disabled
                            ? "cursor-not-allowed border-foreground/10 bg-foreground/5 text-foreground/30"
                            : selected
                              ? "cursor-pointer border-primary bg-primary text-surface"
                              : "cursor-pointer border-foreground/30 bg-surface text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {court.name}

                        {court.status === "MAINTENANCE" &&
                          ` ${t("maintenance")}`}

                        {court.status === "INACTIVE" && ` ${t("inactive")}`}
                      </button>
                    );
                  })
                )}
              </div>

              {formData.courtIds.length > 0 && (
                <p className="mt-2 text-xs text-foreground/60">
                  {t("selected", { count: formData.courtIds.length })}
                </p>
              )}
            </div>
          </section>

          {/* PRICING & CAPACITY */}
          <section>
            <SectionTitle
              icon={<Users size={19} />}
              title={t("pricingCapacity")}
            />

            <div className="grid gap-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              <Input
                id="max-slot"
                label={t("maxSlot")}
                type="number"
                min={1}
                placeholder="16"
                value={formData.maxSlot}
                onChange={(event) =>
                  handleChange("maxSlot", event.target.value)
                }
                required
              />

              <Input
                id="total-price-court"
                label={t("totalPriceCourt")}
                type="number"
                min={0}
                placeholder="600000"
                value={formData.totalPriceCourt}
                onChange={(event) =>
                  handleChange("totalPriceCourt", event.target.value)
                }
                required
              />

              <Input
                id="gender-price-difference"
                label={t("maleFemaleDifference")}
                type="number"
                min={0}
                placeholder={t("differencePlaceholder")}
                value={formData.genderPriceDifference}
                onChange={(event) =>
                  handleChange("genderPriceDifference", event.target.value)
                }
              />
            </div>

            <p className="mt-2 text-xs text-foreground/60">
              {t("differenceHelp")}
            </p>
          </section>

          {/* SHUTTLECOCK */}
          <section>
            <SectionTitle
              icon={<Package size={19} />}
              title={t("shuttlecock")}
            />

            <div className="grid gap-0 md:grid-cols-3 md:gap-4">
              <Select
                id="shuttlecock"
                label={t("shuttlecock")}
                value={formData.shuttleCockId}
                onChange={(event) =>
                  handleShuttleCockChange(event.target.value)
                }
              >
                <option value="">{t("selectShuttlecock")}</option>

                {shuttleCocks.map((shuttleCock) => (
                  <option key={shuttleCock.id} value={shuttleCock.id}>
                    {shuttleCock.name}
                  </option>
                ))}
              </Select>

              <Input
                id="price-per-shuttlecock"
                label={t("pricePerShuttlecock")}
                type="number"
                value={formData.pricePerShuttleCock}
                readOnly
                placeholder={t("auto")}
                className="cursor-not-allowed bg-tag/40 text-foreground/60"
              />

              <Input
                id="shuttlecock-expected"
                label={t("expected")}
                type="number"
                min={0}
                placeholder={t("expectedPlaceholder")}
                value={formData.shuttleCockExpected}
                onChange={(event) =>
                  handleChange("shuttleCockExpected", event.target.value)
                }
              />
            </div>

            <p className="mt-2 text-xs text-foreground/60">
              {t("expectedHelp")}
            </p>
          </section>

          {/* PLAYER PRICING */}
          <section>
            <SectionTitle
              icon={<CircleDollarSign size={19} />}
              title={t("playerPricing")}
            />

            {/* CALCULATION SUMMARY */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CalculationCard
                label={t("courtCost")}
                value={Number(formData.totalPriceCourt || 0)}
              />

              <CalculationCard
                label={t("expectedShuttleCost")}
                value={suggestedPrice?.shuttleCockCost ?? 0}
              />

              <CalculationCard
                label={t("estimatedTotalCost")}
                value={suggestedPrice?.totalCost ?? 0}
                highlight
              />

              <CalculationCard
                label={t("averageSlot")}
                value={suggestedPrice?.average ?? 0}
              />
            </div>

            <div className="mt-1 grid gap-0 md:grid-cols-2 md:gap-4">
              {/* PRICE MALE */}
              <div>
                <Input
                  id="price-male"
                  label={t("priceMale")}
                  type="number"
                  min={0}
                  placeholder={t("enterMalePrice")}
                  value={formData.priceMale}
                  onChange={(event) =>
                    handleChange("priceMale", event.target.value)
                  }
                  required
                />

                <PriceSuggestion
                  price={suggestedPrice?.male}
                  valid={suggestedPrice?.valid}
                />
              </div>

              {/* PRICE FEMALE */}
              <div>
                <Input
                  id="price-female"
                  label={t("priceFemale")}
                  type="number"
                  min={0}
                  placeholder={t("enterFemalePrice")}
                  value={formData.priceFemale}
                  onChange={(event) =>
                    handleChange("priceFemale", event.target.value)
                  }
                  required
                />

                <PriceSuggestion
                  price={suggestedPrice?.female}
                  valid={suggestedPrice?.valid}
                />
              </div>
            </div>

            {/* FORMULA */}
            {suggestedPrice && suggestedPrice.valid && (
              <div className="mt-5 rounded-lg border border-primary/20 bg-tag/40 p-4">
                <p className="text-sm font-semibold text-primary">
                  {t("formulaTitle")}
                </p>

                <div className="mt-2 space-y-1 text-sm text-foreground/70">
                  <p>{t("formulaTotal")}</p>

                  <p>{t("formulaAverage")}</p>

                  <p>{t("formulaMale")}</p>

                  <p>{t("formulaFemale")}</p>
                </div>

                <p className="mt-3 text-xs text-foreground/60">
                  {t("formulaDescription")}
                </p>
              </div>
            )}

            {suggestedPrice && !suggestedPrice.valid && (
              <div className="mt-5 rounded-lg border border-colorWrong/30 bg-bgWrong p-4">
                <p className="text-sm font-semibold text-colorWrong">
                  {t("invalidDifference")}
                </p>

                <p className="mt-1 text-xs text-colorWrong/80">
                  {t("reviewCosts")}
                </p>
              </div>
            )}
          </section>

          {/* ERROR */}
          {formError && (
            <div className="rounded-lg border border-colorWrong/30 bg-bgWrong px-4 py-3">
              <p className="text-sm font-medium text-colorWrong">{formError}</p>
            </div>
          )}

          {/* ACTION */}
          <div className="flex flex-col-reverse gap-3 border-t border-foreground/20 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={handleBack}
              background="bg-surface"
              color="text-foreground"
              className="border border-foreground/30 sm:w-fit sm:px-8"
            >
              {t("cancel")}
            </Button>

            <Button
              type="submit"
              background="bg-primary"
              color="text-surface"
              className="sm:w-fit sm:px-8"
            >
              {mode === "add" ? t("create") : t("save")}
            </Button>
          </div>
        </WhiteCard>
      </form>
    </div>
  );
}

interface SectionTitleProps {
  icon: ReactNode;
  title: string;
}

function SectionTitle({ icon, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 border-b border-foreground/20 pb-3 text-primary">
      {icon}

      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}

interface CalculationCardProps {
  label: string;
  value: number;
  highlight?: boolean;
}

function CalculationCard({
  label,
  value,
  highlight = false,
}: CalculationCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight
          ? "border-primary/30 bg-tag/40"
          : "border-foreground/10 bg-background"
      }`}
    >
      <p className="text-xs text-foreground/60">{label}</p>

      <p
        className={`mt-1 font-bold ${
          highlight ? "text-lg text-primary" : "text-foreground"
        }`}
      >
        {Math.round(value).toLocaleString("vi-VN")} VNĐ
      </p>
    </div>
  );
}

interface PriceSuggestionProps {
  price?: number;
  valid?: boolean;
}

function PriceSuggestion({ price, valid }: PriceSuggestionProps) {
  const t = useTranslations("sessionForm");

  if (price === undefined) {
    return (
      <p className="mt-2 text-xs text-foreground/40">{t("enterInputs")}</p>
    );
  }

  if (!valid) {
    return (
      <p className="mt-2 text-xs text-colorWrong">{t("invalidSuggestion")}</p>
    );
  }

  return (
    <p className="mt-2 text-xs text-foreground/60">
      {t("suggested")}{" "}
      <span className="font-semibold text-primary">
        {Math.round(price).toLocaleString("vi-VN")} VNĐ
      </span>
    </p>
  );
}
