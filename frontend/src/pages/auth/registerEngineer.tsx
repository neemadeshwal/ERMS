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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateNewUser } from "@/actions/auth/auth-action";
import { useRegisterStore } from "@/zustand/registerStore";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";

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
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerEngineerSchema>>({
    resolver: zodResolver(registerEngineerSchema),
    defaultValues: {
      skills: [],
      seniority: "junior",
      employmentType: "fullTime",
      department: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerEngineerSchema>) => {
    try {
      console.log("Extended Profile:", data);
      const basicInfo = useRegisterStore.getState().basicInfo;

      if (!basicInfo) {
        // Handle error: basic info not found (user skipped step 1)
        alert("Basic info missing. Please complete step 1.");
        return;
      }

      // Combine the basic info and extended profile
      const payload = {
        ...basicInfo,
        ...data,
      };
      const createdUser = await CreateNewUser(payload);
      if (createdUser.success && createdUser.token) {
        login(createdUser.token, createdUser.user.role); // set token and role in context and cookie
        navigate("/engineer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="bg-[#5c66a7] hover:bg-[#525b95] rounded-[8px] py-5  cursor-pointer w-full text-white"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterEngineer;
