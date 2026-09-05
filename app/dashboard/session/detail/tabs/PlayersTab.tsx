"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { Search, Trash2, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import WhiteCard from "@/app/components/WhiteCard";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";

import { Gender, PlayerLevel, SessionPlayer } from "../types";

interface PlayersTabProps {
  players: SessionPlayer[];
  setPlayers: Dispatch<SetStateAction<SessionPlayer[]>>;
  maxSlot: number;
}

const existingPlayers: SessionPlayer[] = [
  {
    id: 101,
    name: "Phạm Minh Quân",
    phone: "0912345678",
    gender: "MALE",
    level: "TB",
    checkedIn: false,
    paymentMethod: "UNPAID",
  },
  {
    id: 102,
    name: "Nguyễn Thảo Vy",
    phone: "0934567890",
    gender: "FEMALE",
    level: "TBY+",
    checkedIn: false,
    paymentMethod: "UNPAID",
  },
];

const levels: PlayerLevel[] = [
  "NEWBIE",
  "Y-",
  "Y",
  "Y+",
  "TBY-",
  "TBY",
  "TBY+",
  "TB-",
  "TB",
  "TB+",
  "TBK",
];

export default function PlayersTab({
  players,
  setPlayers,
  maxSlot,
}: PlayersTabProps) {
  const t = useTranslations("sessionDetail");
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<Gender>("MALE");
  const [level, setLevel] = useState<PlayerLevel>("NEWBIE");

  const searchResults = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return [];

    return existingPlayers.filter(
      (player) =>
        player.name.toLowerCase().includes(keyword) &&
        !players.some((sessionPlayer) => sessionPlayer.id === player.id),
    );
  }, [search, players]);

  const addExistingPlayer = (player: SessionPlayer) => {
    if (players.length >= maxSlot) return;

    setPlayers((prev) => [...prev, player]);
    setSearch("");
  };

  const addNewPlayer = () => {
    if (!name.trim() || players.length >= maxSlot) {
      return;
    }

    const newPlayer: SessionPlayer = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim() || null,
      gender,
      level,
      checkedIn: false,
      paymentMethod: "UNPAID",
    };

    setPlayers((prev) => [...prev, newPlayer]);

    setName("");
    setPhone("");
    setGender("MALE");
    setLevel("NEWBIE");
  };

  return (
    <div className="flex flex-col gap-5">
      <WhiteCard className="flex-col items-stretch">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{t("players")}</h3>

            <p className="mt-1 text-sm text-forground/50">
              {t("playersCount", { count: players.length, max: maxSlot })}
            </p>
          </div>
        </div>

        {/* SEARCH EXISTING */}
        <div className="mt-5">
          <p className="text-sm font-semibold">{t("addExistingPlayer")}</p>

          <div className="relative mt-2">
            <Search
              size={16}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-foreground/60"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("searchPlayer")}
              className="w-full rounded-lg border border-placeholder bg-surface py-3 pr-3 pl-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 rounded-xl border border-foreground/30 bg-surface">
              {searchResults.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => addExistingPlayer(player)}
                  className="flex w-full cursor-pointer items-center justify-between border-b border-gray-100 p-3 text-left last:border-b-0 hover:bg-background"
                >
                  <div>
                    <p className="font-semibold">{player.name}</p>

                    <p className="text-xs text-foreground/60">
                      {player.level} • {player.phone ?? t("noPhone")}
                    </p>
                  </div>

                  <UserPlus size={17} className="text-text" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ADD NEW */}
        <div className="mt-7 border-t border-gray-100 pt-5">
          <p className="font-semibold">{t("orAddNew")}</p>

          <div className="grid gap-0 md:grid-cols-2 md:gap-4">
            <Input
              id="new-player-name"
              label={t("name")}
              value={name}
              placeholder={t("enterPlayerName")}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <Input
              id="new-player-phone"
              label={t("phone")}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={t("optional")}
            />

            <Select
              id="new-player-gender"
              label={t("gender")}
              value={gender}
              onChange={(event) => setGender(event.target.value as Gender)}
            >
              <option value="MALE">{t("male")}</option>
              <option value="FEMALE">{t("female")}</option>
              <option value="OTHER">{t("other")}</option>
            </Select>

            <Select
              id="new-player-level"
              label={t("level")}
              value={level}
              onChange={(event) => setLevel(event.target.value as PlayerLevel)}
            >
              {levels.map((item) => (
                <option key={item} value={item}>
                  {item === "NEWBIE" ? t("newbie") : item}
                </option>
              ))}
            </Select>
          </div>

          <Button
            type="button"
            onClick={addNewPlayer}
            className="mt-5 md:w-fit md:px-6"
          >
            <UserPlus size={16} />
            {t("addPlayer")}
          </Button>
        </div>
      </WhiteCard>

      {/* PLAYER LIST */}
      <WhiteCard className="flex-col items-stretch p-0!">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between border-b border-foreground/20 p-4 last:border-b-0"
          >
            <div>
              <p className="font-semibold">{player.name}</p>

              <p className="mt-1 text-sm">
                {player.phone ?? t("noPhone")} • {player.level}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setPlayers((prev) =>
                  prev.filter((item) => item.id !== player.id),
                )
              }
              className="cursor-pointer text-colorWrong"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </WhiteCard>
    </div>
  );
}
