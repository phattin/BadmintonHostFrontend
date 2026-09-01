import SessionFormContent, {
  SessionFormData,
} from "../../SessionFormContent";

const mockSession: SessionFormData = {
  venueId: "1",
  courtIds: [1, 2],
  totalPriceCourt: "600000",
  maxSlot: "16",
  shuttleCockId: "1",
  pricePerShuttleCock: "35000",
  shuttleCockExpected: "24",
  priceMale: "150000",
  priceFemale: "120000",
  genderPriceDifference: "5000",
  startTime: "2026-08-31T18:00",
  endTime: "2026-08-31T20:00",
};

export default function EditSessionPage() {
  return (
    <SessionFormContent
      mode="edit"
      initialData={mockSession}
    />
  );
}