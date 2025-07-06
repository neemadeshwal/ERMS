// src/types.ts

// User roles
export type UserRole = "engineer" | "manager";

// Engineer seniority levels
export type Seniority = "junior" | "mid" | "senior";

// Project status
export type ProjectStatus = "on-hold" | "active" | "completed" | "planning";

export type Priority = "high" | "low" | "medium";
// Assignment status (frontend convenience)
export type AssignmentStatus = "active" | "completed" | "on-hold";

// User (base type)
export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  color: string;
  code: string;
  maxCapacity: string;
  skills?: string[];
  currentCapacity: string;
  totalCapacity: string;
  projects: string[];
  assignments: string[];
  seniority: string;
  status: string;
  hoursPerWeek?: string;
  efficiency?: string;
}

export interface EditUser {
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  color: string;
  code: string;
  skills?: string[];
  currentCapacity: number;

  seniority?: string;
  status?: string;
  hoursPerWeek?: string;
  efficiency?: string;
}

export interface NewUserProps {
  name: string;
  email: string;
  role: string;
  password: string;
  skills?: string[];
  seniority?: string;
  employmentType?: string;
  department?: string;
}

export interface loginDataProps {
  email: string;
  password: string;
  role: string;
}

// Engineer (extends User)
export interface Engineer extends User {
  skills: string[];
  seniority: Seniority;
}
export interface NewProjectBody {
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  requiredSkills: string[];
  teamSize: number;
  status: ProjectStatus;
  managerId: string;
  priority: Priority;
}

// Project
export interface Project {
  _id: string;
  teamMembers: string[];
  progress: string;
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  requiredSkills: string[];
  teamSize: number;
  status: ProjectStatus;
  managerId: {
    name: string;
  };
  priority: Priority;
}

export interface NewAssignmentBody {
  engineerId: string;
  projectId: string;
  projectName?: string; // For UI convenience
  allocation: number; // 0-100 (%)
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  role: string; // e.g., "Developer", "Tech Lead"
  status?: AssignmentStatus; // For UI display
}

// Assignment
export interface Assignment {
  _id?: string;
  engineerId: Engineer[];
  description: string;
  projectId: Project;
  allocationPercentage: string;
  projectProgress: string;
  priority: string;
  projectName?: string; // For UI convenience
  allocation: number; // 0-100 (%)
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  role: string; // e.g., "Developer", "Tech Lead"
  status?: AssignmentStatus; // For UI display
}

// API Auth Response
export interface AuthResponse {
  token: string;
  user: User;
}
