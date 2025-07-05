"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNewUser } from "@/actions/auth/auth-action";
import { useRegisterStore } from "@/zustand/registerStore";
import { getDashboardRoute, useAuth } from "@/context/authContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

// Sample skills
const skillsList = [
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "Docker",
  "AWS",
];

// Schema (ensure enum values match your select values)
const registerEngineerSchema = z.object({
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  seniority: z.enum(["junior", "mid", "senior"]),
  employmentType: z.enum(["fullTime", "partTime"]),
  department: z.string().min(1, "Department is required"),
  profilePicture: z.any().optional(),
});

const RegisterEngineer = () => {
  const { login, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { basicInfo, clear } = useRegisterStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof registerEngineerSchema>>({
    resolver: zodResolver(registerEngineerSchema),
    defaultValues: {
      skills: [],
      seniority: "junior",
      employmentType: "fullTime",
      department: "",
    },
  });

  useEffect(() => {
    // If no basic info, redirect back to initial registration
    if (!basicInfo) {
      console.error("No basic info found, redirecting to initial registration");
      toast.error("No basic info found");
      setTimeout(() => {
        navigate("/register");
      }, 2000);
    }
  }, [basicInfo, navigate]);

  const onSubmit = async (data: z.infer<typeof registerEngineerSchema>) => {
    setLoading(true);

    try {
      console.log("Extended Profile:", data);

      if (!basicInfo) {
        setLoading(false);
        return;
      }

      // Combine the basic info and extended profile
      const payload = {
        ...basicInfo,
        ...data,
      };

      console.log("Final payload:", payload);

      const createdUser = await CreateNewUser(payload);

      console.log("CreateNewUser response:", createdUser);

      if (createdUser?.success && createdUser?.token) {
        // Use consistent role format - get role from user object
        const userRole =
          createdUser.user?.role || createdUser.user?.roles || "engineer";

        try {
          login(createdUser.token, userRole);

          // Clear the registration store after successful registration
          clear();

          // Add a small delay before navigation to ensure login completes
          setTimeout(() => {
            navigate("/engineer");
          }, 100);
        } catch (loginError) {
          console.error("Login failed:", loginError);
          toast.error("an error occured");
        }
      } else {
        console.error("Full API response:", createdUser);
        const errorMessage =
          createdUser?.message ||
          createdUser?.error ||
          "Failed to create account. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
      // More detailed error logging
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading if basic info is being checked
  if (!basicInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration data...</p>
        </div>
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to={getDashboardRoute(role)} replace />;
  }
  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] text-sm">
              {error}
            </div>
          )}

          {/* Skills Multi-select (using checkboxes for simplicity) */}
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {skillsList.map((skill) => (
                    <label key={skill} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={skill}
                        checked={field.value.includes(skill)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...field.value, skill]);
                          } else {
                            field.onChange(
                              field.value.filter((s: string) => s !== skill)
                            );
                          }
                        }}
                      />
                      {skill}
                    </label>
                  ))}
                </div>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />

          {/* Seniority Level */}
          <FormField
            control={form.control}
            name="seniority"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Seniority Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full rounded-[8px] py-5">
                      <SelectValue
                        className="text-black"
                        placeholder="Select seniority"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full bg-white rounded-[8px] flex flex-col gap-5">
                    <SelectItem
                      className="text-[15px] hover:bg-gray-50 cursor-pointer"
                      value="junior"
                    >
                      Junior
                    </SelectItem>
                    <SelectItem
                      className="text-[15px] hover:bg-gray-50 cursor-pointer"
                      value="mid"
                    >
                      Mid
                    </SelectItem>
                    <SelectItem
                      className="text-[15px] hover:bg-gray-50 cursor-pointer"
                      value="senior"
                    >
                      Senior
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />

          {/* Employment Type */}
          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Employment Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full rounded-[8px] py-5">
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full bg-white rounded-[8px] flex flex-col gap-5">
                    <SelectItem
                      className="text-[15px] hover:bg-gray-50 cursor-pointer"
                      value="fullTime"
                    >
                      Full-time (100%)
                    </SelectItem>
                    <SelectItem
                      className="text-[15px] hover:bg-gray-50 cursor-pointer"
                      value="partTime"
                    >
                      Part-time (50%)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />

          {/* Department */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input
                    className="placeholder:text-gray-500 rounded-[8px] py-5"
                    placeholder="Enter department"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />
          <Button
            className="bg-[#5c66a7] hover:bg-[#525b95] rounded-[8px] py-5 cursor-pointer w-full text-white disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterEngineer;
