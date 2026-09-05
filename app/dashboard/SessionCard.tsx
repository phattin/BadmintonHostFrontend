import WhiteCard from "@/app/components/WhiteCard";

interface SessionCardProps {
  image: string;
  status: "OPEN" | "FULL";
  title: string;
  time: string;
  courts: string;
  players: number;
  maxPlayers: number;
}

export default function SessionCard({
  image,
  status,
  title,
  time,
  courts,
  players,
  maxPlayers,
}: SessionCardProps) {

  const progress = (players / maxPlayers) * 100;
  let span_status, bg_progress;
  if(status === "OPEN"){
    span_status = "bg-white text-primary"
    bg_progress = "bg-primary"
  }
  else{
    span_status = "bg-colorWrong text-surface"
    bg_progress = "bg-gray-500"
  }

  return (
    <WhiteCard className="flex-col overflow-hidden items-start" padding="md:p-0">
      <div className="relative w-full">
        <img
          src={image}
          alt={title}
          className="
            h-28
            w-full
            object-cover
            rounded-t-2xl
          "
        />

        <span
          className={`
            absolute
            left-3
            top-3
            rounded
            px-3
            py-1
            text-sm
            font-bold
            ${
              span_status
            }
          `}
        >
          {status}
        </span>
      </div>


      {/* Content */}
      <div className="p-5 w-full">
        <h3 className="
          text-xl
          font-bold
        ">
          {title}
        </h3>


        <p className="mt-2 text-l font-semibold text-gray-600">
          {time}
        </p>


        <p className="mt-2 text-l font-semibold text-gray-600">
          {courts}
        </p>


        {/* Progress */}
        <div className="mt-5">

          <div className="
            flex
            justify-between
            text-l
          ">
            <span>
              Confirmed Players
            </span>

            <span className="font-semibold text-primary">
              {players} / {maxPlayers}
            </span>
          </div>


          <div className="
            mt-2
            h-2
            overflow-hidden
            rounded-full
            bg-gray-200
          ">
            <div
              className={`
                h-full
                rounded-full
                ${
                    bg_progress
                }   
              `}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>

      </div>

    </WhiteCard>
  );
}