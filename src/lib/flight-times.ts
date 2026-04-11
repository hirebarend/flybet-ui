export interface FlightLegTimeDisplay {
  timeLabel: string;
  deltaLabel: string | null;
  deltaClassName: string | null;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function getFlightLegTimeDisplay(
  scheduled: string,
  actual: string | null
): FlightLegTimeDisplay {
  if (!actual) {
    return {
      timeLabel: formatTime(scheduled),
      deltaLabel: null,
      deltaClassName: null,
    };
  }

  const scheduledTime = new Date(scheduled).getTime();
  const actualTime = new Date(actual).getTime();
  const deltaMinutes = Math.round((actualTime - scheduledTime) / 60000);

  if (!Number.isFinite(deltaMinutes)) {
    return {
      timeLabel: formatTime(scheduled),
      deltaLabel: null,
      deltaClassName: null,
    };
  }

  return {
    timeLabel: formatTime(actual),
    deltaLabel:
      deltaMinutes === 0
        ? 'On time'
        : `${deltaMinutes > 0 ? '+' : ''}${deltaMinutes}`,
    deltaClassName:
      deltaMinutes === 0
        ? 'text-[#3CA2C8]'
        : deltaMinutes > 0
        ? 'text-[#F59E0B]'
        : 'text-[#22C55E]',
  };
}
