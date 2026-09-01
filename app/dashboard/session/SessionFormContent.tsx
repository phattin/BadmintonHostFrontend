"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";
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

  const [formData, setFormData] = useState<SessionFormData>(
    initialData ?? emptyForm,
  );

  const [formError, setFormError] = useState("");

  useEffect(() => {
    setFormData(initialData ?? emptyForm);
  }, [initialData]);

  const availableCourts = useMemo(() => {
    if (!formData.venueId) {
      return [];
    }

    return courts.filter(
      (court) => court.venueId === Number(formData.venueId),
    );
  }, [formData.venueId]);

  const suggestedPrice = useMemo<SuggestedPrice | null>(() => {
    const totalPriceCourt = Number(formData.totalPriceCourt);
    const maxSlot = Number(formData.maxSlot);

    const shuttleCockExpected =
      Number(formData.shuttleCockExpected) || 0;

    const pricePerShuttleCock =
      Number(formData.pricePerShuttleCock) || 0;

    const genderPriceDifference =
      Number(formData.genderPriceDifference) || 0;

    if (
      !formData.totalPriceCourt ||
      !formData.maxSlot ||
      totalPriceCourt < 0 ||
      maxSlot <= 0
    ) {
      return null;
    }

    const shuttleCockCost =
      shuttleCockExpected * pricePerShuttleCock;

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

  const handleChange = (
    field: keyof SessionFormData,
    value: string,
  ) => {
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
    const shuttleCock = shuttleCocks.find(
      (item) => item.id === Number(id),
    );

    setFormData((prev) => ({
      ...prev,
      shuttleCockId: id,
      pricePerShuttleCock: shuttleCock
        ? String(shuttleCock.pricePerShuttleCock)
        : "",
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.venueId) {
      setFormError("Please select a venue.");
      return;
    }

    if (formData.courtIds.length === 0) {
      setFormError("Please select at least one court.");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setFormError("Please select a start and end time.");
      return;
    }

    if (
      new Date(formData.endTime).getTime() <=
      new Date(formData.startTime).getTime()
    ) {
      setFormError(
        "End time must be later than start time.",
      );
      return;
    }

    if (Number(formData.maxSlot) <= 0) {
      setFormError("Max Slot must be greater than 0.");
      return;
    }

    if (!formData.priceMale || !formData.priceFemale) {
      setFormError(
        "Please enter the male and female prices. Suggested values are for reference only.",
      );
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
    <div className="min-h-full w-full bg-bg p-5 pb-24 md:p-8 lg:pb-8">
      {/* BACK */}
      <button
        type="button"
        onClick={() => router.push("/dashboard/session")}
        className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-text transition hover:opacity-70"
      >
        <ArrowLeft size={16} />
        Back to Sessions
      </button>

      {/* TITLE */}
      <div className="mt-4">
        <h1>
          {mode === "add" ? "Plan Session" : "Edit Session"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Configure courts, pricing, shuttlecocks and session
          schedule.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <WhiteCard className="flex-col items-stretch gap-8">
          {/* VENUE & TIMING */}
          <section>
            <SectionTitle
              icon={<MapPin size={19} />}
              title="Venue & Timing"
            />

            <Select
              id="session-venue"
              label="Venue"
              value={formData.venueId}
              onChange={(event) =>
                handleVenueChange(event.target.value)
              }
              required
            >
              <option value="">Select a venue...</option>

              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </Select>

            <div className="grid gap-0 md:grid-cols-2 md:gap-4">
              <Input
                id="start-time"
                label="Start Time"
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
                label="End Time"
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
              <p className="text-[14px] font-semibold text-text">
                Allocate Courts
              </p>

              <div className="mt-2 flex min-h-16 flex-wrap items-center gap-2 rounded-xl border border-placeholder bg-main0 p-3">
                {!formData.venueId ? (
                  <p className="text-sm text-gray-500">
                    Select a venue first.
                  </p>
                ) : availableCourts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    This venue does not have any courts.
                  </p>
                ) : (
                  availableCourts.map((court) => {
                    const selected =
                      formData.courtIds.includes(court.id);

                    const disabled =
                      court.status !== "AVAILABLE";

                    return (
                      <button
                        key={court.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleToggleCourt(court)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                          disabled
                            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                            : selected
                              ? "cursor-pointer border-main3 bg-main3 text-white"
                              : "cursor-pointer border-placeholder bg-white text-text hover:bg-bg"
                        }`}
                      >
                        {court.name}

                        {court.status === "MAINTENANCE" &&
                          " (Maintenance)"}

                        {court.status === "INACTIVE" &&
                          " (Inactive)"}
                      </button>
                    );
                  })
                )}
              </div>

              {formData.courtIds.length > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {formData.courtIds.length} court(s) selected.
                </p>
              )}
            </div>
          </section>

          {/* PRICING & CAPACITY */}
          <section>
            <SectionTitle
              icon={<Users size={19} />}
              title="Pricing & Capacity"
            />

            <div className="grid gap-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              <Input
                id="max-slot"
                label="Max Slot"
                type="number"
                min={1}
                placeholder="VD: 16"
                value={formData.maxSlot}
                onChange={(event) =>
                  handleChange("maxSlot", event.target.value)
                }
                required
              />

              <Input
                id="total-price-court"
                label="Total Price Court (VNĐ)"
                type="number"
                min={0}
                placeholder="VD: 600000"
                value={formData.totalPriceCourt}
                onChange={(event) =>
                  handleChange(
                    "totalPriceCourt",
                    event.target.value,
                  )
                }
                required
              />

              <Input
                id="gender-price-difference"
                label="Male - Female Difference"
                type="number"
                min={0}
                placeholder="Không nhập = 0"
                value={formData.genderPriceDifference}
                onChange={(event) =>
                  handleChange(
                    "genderPriceDifference",
                    event.target.value,
                  )
                }
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Male - Female Difference là số tiền Nam cao hơn Nữ.
              Nếu để trống, hệ thống xem như 0 VNĐ.
            </p>
          </section>

          {/* SHUTTLECOCK */}
          <section>
            <SectionTitle
              icon={<Package size={19} />}
              title="ShuttleCock"
            />

            <div className="grid gap-0 md:grid-cols-3 md:gap-4">
              <Select
                id="shuttlecock"
                label="ShuttleCock"
                value={formData.shuttleCockId}
                onChange={(event) =>
                  handleShuttleCockChange(event.target.value)
                }
              >
                <option value="">
                  Select shuttlecock...
                </option>

                {shuttleCocks.map((shuttleCock) => (
                  <option
                    key={shuttleCock.id}
                    value={shuttleCock.id}
                  >
                    {shuttleCock.name}
                  </option>
                ))}
              </Select>

              <Input
                id="price-per-shuttlecock"
                label="Price Per ShuttleCock"
                type="number"
                value={formData.pricePerShuttleCock}
                readOnly
                placeholder="Auto"
                className="cursor-not-allowed bg-gray-100"
              />

              <Input
                id="shuttlecock-expected"
                label="ShuttleCock Expected"
                type="number"
                min={0}
                placeholder="Optional"
                value={formData.shuttleCockExpected}
                onChange={(event) =>
                  handleChange(
                    "shuttleCockExpected",
                    event.target.value,
                  )
                }
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              ShuttleCock Expected có thể để trống. Khi để trống,
              chi phí cầu dự kiến được tính là 0 VNĐ.
            </p>
          </section>

          {/* PLAYER PRICE */}
          <section>
            <SectionTitle
              icon={<CircleDollarSign size={19} />}
              title="Player Pricing"
            />

            {/* CALCULATION SUMMARY */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CalculationCard
                label="Court Cost"
                value={Number(
                  formData.totalPriceCourt || 0,
                )}
              />

              <CalculationCard
                label="Expected Shuttle Cost"
                value={suggestedPrice?.shuttleCockCost ?? 0}
              />

              <CalculationCard
                label="Estimated Total Cost"
                value={suggestedPrice?.totalCost ?? 0}
                highlight
              />

              <CalculationCard
                label="Average / Slot"
                value={suggestedPrice?.average ?? 0}
              />
            </div>

            <div className="mt-1 grid gap-0 md:grid-cols-2 md:gap-4">
              {/* PRICE MALE */}
              <div>
                <Input
                  id="price-male"
                  label="Price Male"
                  type="number"
                  min={0}
                  placeholder="Enter male price"
                  value={formData.priceMale}
                  onChange={(event) =>
                    handleChange(
                      "priceMale",
                      event.target.value,
                    )
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
                  label="Price Female"
                  type="number"
                  min={0}
                  placeholder="Enter female price"
                  value={formData.priceFemale}
                  onChange={(event) =>
                    handleChange(
                      "priceFemale",
                      event.target.value,
                    )
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
              <div className="mt-5 rounded-xl border border-placeholder bg-main0 p-4">
                <p className="text-sm font-semibold text-text">
                  How is the suggested price calculated?
                </p>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    Total Cost = Court Cost + Expected Shuttle
                    Cost
                  </p>

                  <p>
                    Average / Slot = Total Cost ÷ Max Slot
                  </p>

                  <p>
                    Male = Average + Difference ÷ 2
                  </p>

                  <p>
                    Female = Average - Difference ÷ 2
                  </p>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Suggested prices assume an approximately equal
                  number of male and female players. You can enter
                  different prices manually.
                </p>
              </div>
            )}

            {suggestedPrice && !suggestedPrice.valid && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-600">
                  Male - Female Difference is too large for the
                  current estimated cost and slot count.
                </p>

                <p className="mt-1 text-xs text-red-500">
                  Reduce the difference or review Max Slot and
                  session costs.
                </p>
              </div>
            )}
          </section>

          {/* ERROR */}
          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-600">
                {formError}
              </p>
            </div>
          )}

          {/* ACTION */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              onClick={() =>
                router.push("/dashboard/session")
              }
              background="bg-white"
              color="text-text"
              className="border border-placeholder sm:w-fit sm:px-8"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="sm:w-fit sm:px-8"
            >
              {mode === "add"
                ? "Create Session"
                : "Save Changes"}
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

function SectionTitle({
  icon,
  title,
}: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-text">
      {icon}

      <h3 className="text-xl font-semibold">
        {title}
      </h3>
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
      className={`rounded-xl p-4 ${
        highlight
          ? "border border-placeholder bg-main0"
          : "bg-bg"
      }`}
    >
      <p className="text-xs text-gray-500">{label}</p>

      <p
        className={`mt-1 font-bold ${
          highlight ? "text-lg text-text" : "text-gray-800"
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

function PriceSuggestion({
  price,
  valid,
}: PriceSuggestionProps) {
  if (price === undefined) {
    return (
      <p className="mt-2 text-xs text-gray-400">
        Enter Total Price Court and Max Slot to get a suggested
        price.
      </p>
    );
  }

  if (!valid) {
    return (
      <p className="mt-2 text-xs text-red-500">
        Unable to calculate a valid suggested price.
      </p>
    );
  }

  return (
    <p className="mt-2 text-xs text-gray-500">
      Suggested:{" "}
      <span className="font-semibold text-text">
        {Math.round(price).toLocaleString("vi-VN")} VNĐ
      </span>
    </p>
  );
}