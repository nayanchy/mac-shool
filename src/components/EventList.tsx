import prisma from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();
  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });
  if (data.length > 0) {
    return (
      <>
        {data.map((event) => (
          <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 even:border-t-macPurple odd:border-t-macSky"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-xs text-gray-300">
                {event.startTime.toLocaleTimeString("en-UK", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
          </div>
        ))}
      </>
    );
  }
  return <h1 className="text-center text-gray-400">No events found</h1>;
};

export default EventList;
