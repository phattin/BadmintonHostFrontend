export type SessionStatus =
  | "DRAFT"
  | "OPEN"
  | "IN_PROGRESS"
  | "FINISHED"
  | "SETTLED"
  | "CLOSED";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type PlayerLevel =
  | "NEWBIE"
  | "Y-"
  | "Y"
  | "Y+"
  | "TBY-"
  | "TBY"
  | "TBY+"
  | "TB-"
  | "TB"
  | "TB+"
  | "TBK";

export type PaymentMethod =
  | "UNPAID"
  | "CASH"
  | "TRANSFER";

export interface SessionPlayer {
  id: number;
  name: string;
  phone: string | null;
  gender: Gender;
  level: PlayerLevel;
  checkedIn: boolean;
  paymentMethod: PaymentMethod;
}

export interface Match {
  id: number;
  courtName: string;
  teamA: string[];
  teamB: string[];
  scoreA: number;
  scoreB: number;
  status: "PLAYING" | "FINISHED";
}

export interface SessionDetail {
  id: number;
  title: string;
  venueName: string;
  address: string;

  courts: string[];

  startTime: string;
  endTime: string;

  status: SessionStatus;

  maxSlot: number;

  totalCourtPrice: number;

  shuttleCockName: string;
  pricePerShuttleCock: number;
  expectedShuttleCock: number;

  priceMale: number;
  priceFemale: number;
}