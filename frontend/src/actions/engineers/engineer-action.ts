// Example using fetch
export async function getAllEngineers(token: string) {
  const baseURL = import.meta.env.VITE_SERVER_URL!;
  const response = await fetch(`${baseURL}/engineers`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch engineers");
  const result = await response.json();
  console.log(result);
  return result;
}
