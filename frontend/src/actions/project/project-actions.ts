import type { NewProjectBody, Project } from "@/types/types";

const baseURL = import.meta.env.VITE_SERVER_URL!;

export async function createProject(
  projectData: NewProjectBody,
  token: string
) {
  console.log(projectData, "pd");
  const response = await fetch(`${baseURL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return response.json();
}

// READ all projects
export async function getAllProjects(token: string) {
  const response = await fetch(`${baseURL}/projects`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
}
export async function getSingleProject(id: string, token: string) {
  const response = await fetch(`${baseURL}/projects/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch projects");
  const result = await response.json();
  console.log(result);
  return result;
}

// UPDATE a project by ID
export async function updateProject(
  id: string,
  projectData: NewProjectBody,
  token: string
) {
  const response = await fetch(`${baseURL}/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error("Failed to update project");
  const result = await response.json();
  return result;
}

// DELETE a project by ID
export async function deleteProject(id: string, token: string) {
  const response = await fetch(`${baseURL}/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete project");
  return response.json();
}
