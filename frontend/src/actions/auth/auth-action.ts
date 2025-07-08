import type { loginDataProps, NewUserProps, User } from "@/types/types";
const baseURL = import.meta.env.VITE_SERVER_URL!;
console.log(baseURL, "basurl");

const wakeUpBackend = async () => {
  try {
    await fetch(`${baseURL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.log(error);
  }
};
export async function CreateNewUser(userData: NewUserProps) {
  console.log(userData, "userData");
  try {
    await wakeUpBackend();
    const response = await fetch(`${baseURL}/auth/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
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
    await wakeUpBackend();

    const response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
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
