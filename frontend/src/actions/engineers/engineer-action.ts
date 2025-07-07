import type { EditUser, User } from "@/types/types";
const baseURL = import.meta.env.VITE_SERVER_URL!;

// Example using fetch
export async function getAllEngineers(token: string) {
  const response = await fetch(`${baseURL}/engineers`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch engineers");
  const result = await response.json();
  console.log(result);
  return result;
}
export async function updateProfile(UserData: EditUser, token: string) {
  const response = await fetch(`${baseURL}/engineers/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(UserData),
  });
  if (!response.ok) throw new Error("Failed to update profile detail");
  const result = await response.json();
  return result;
}
