"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterStore } from "@/zustand/registerStore";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CreateNewUser } from "@/actions/auth/auth-action";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

const formSchema = z.object({
  name: z
    .string({ required_error: "Full name is required." })
    .min(5, "Full name must be at least 5 characters."),

  email: z
    .string({ required_error: "Email is required." })
    .min(5, "Email must be at least 5 characters.")
    .max(50, "Email must be at most 50 characters.")
    .email("Invalid email format."),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters.")
    .max(20, "Password must be at most 20 characters.")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/,
      "Password must include at least one uppercase letter, one number, and one special character."
    ),

  role: z.string({ required_error: "Role is required." }),
});

const InitialRegister = ({ setIsEngineer }: { setIsEngineer: any }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting values:", values);

      if (values.role === "engineer") {
        // Store basic info and continue to engineer registration
        useRegisterStore.getState().setBasicInfo(values);
        setIsEngineer(true);
        setIsLoading(false);
      } else {
        // Create manager account directly
        const createdUser = await CreateNewUser(values);

        console.log("CreateNewUser response:", createdUser);

        if (createdUser?.success && createdUser?.token) {
          // Use consistent role format - get role from user object
          const userRole =
            createdUser.user?.role || createdUser.user?.roles || values.role;

          login(createdUser.token, userRole);
          navigate("/manager");
        } else {
          // Handle API error
          const errorMessage =
            createdUser?.message ||
            createdUser?.error ||
            "Failed to create account. Please try again.";
          setError(errorMessage);
          console.error("Account creation failed:", createdUser);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] text-sm">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    className="rounded-[8px] py-5 placeholder:text-gray-500"
                    placeholder="Enter your fullname"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="rounded-[8px] py-5 placeholder:text-gray-500"
                    placeholder="Enter your email address"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="rounded-[8px] py-5 placeholder:text-gray-500"
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    if (val === "engineer") {
                      setIsManager(false);
                    } else {
                      setIsManager(true);
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full rounded-[8px] py-5">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full bg-white rounded-[8px] flex flex-col gap-5">
                    <SelectItem value="manager" className="text-[15px]">
                      Manager
                    </SelectItem>
                    <SelectItem
                      value="engineer"
                      className="text-[15px] hover:bg-gray-50 cursor-pointer"
                    >
                      Engineer
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />
          <Button
            className="bg-[#5c66a7] hover:bg-[#525b95] rounded-[8px] py-5 cursor-pointer w-full text-white disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isManager ? "Submit" : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InitialRegister;
