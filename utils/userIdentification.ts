export function getLastRoastDate(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  return localStorage.getItem("last_roast_date")
}

export function setLastRoastDate(date: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("last_roast_date", date)
  }
}

