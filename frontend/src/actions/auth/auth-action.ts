import type { loginDataProps, NewUserProps, User } from "@/types/types";
const baseURL = import.meta.env.VITE_SERVER_URL!;
console.log(baseURL, "basurl");
export async function CreateNewUser(userData: NewUserProps) {
  console.log(userData, "userData");
  try {
    const response = await fetch(`${baseURL}/auth/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const result = await response.json();
    console.log(result, "User created successfully");
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: true };
  }
}
export async function LoginUser(loginData: loginDataProps) {
  try {
    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
      credentials: "include",
    });

    const result = await response.json();
    console.log(result, "User LoggedIn successfully");
    return result;
  } catch (error) {
    console.error("Error logging in:", error);
    return { error: true };
  }
}

export async function getUser(token: string) {
  try {
    const response = await fetch(`${baseURL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const user = await response.json();
    console.log(user, "User fetched successfully");
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: true };
  }
}
