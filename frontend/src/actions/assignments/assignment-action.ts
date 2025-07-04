// src/actions/assignment/assignment-actions.ts

import type { NewAssignmentBody, Assignment } from "@/types/types";

const baseURL = import.meta.env.VITE_SERVER_URL!;

// CREATE a new assignment
export async function createAssignment(
  assignmentData: NewAssignmentBody,
  token: string
) {
  const data = {
    ...assignmentData,
    allocation: Number(assignmentData.allocation),
  };

  console.log(data);
  const response = await fetch(`${baseURL}/assignments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create assignment");
  return response.json();
}

// READ all assignments
export async function getAllAssignments(token: string) {
  const response = await fetch(`${baseURL}/assignments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch assignments");
  return response.json();
}

// READ a single assignment by ID
export async function getSingleAssignment(id: string, token: string) {
  const response = await fetch(`${baseURL}/assignments/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch assignment");
  const result = await response.json();
  console.log(result);
  return result;
}

// UPDATE an assignment by ID
export async function updateAssignment(
  id: string,
  assignmentData: NewAssignmentBody,
  token: string
) {
  const response = await fetch(`${baseURL}/assignments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(assignmentData),
  });
  if (!response.ok) throw new Error("Failed to update assignment");
  const result = await response.json();
  return result;
}

// DELETE an assignment by ID
export async function deleteAssignment(id: string, token: string) {
  const response = await fetch(`${baseURL}/assignments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete assignment");
  return response.json();
}
