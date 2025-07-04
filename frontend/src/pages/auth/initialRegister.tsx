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
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const [isManager, setIsManager] = useState(true);
  const { login } = useAuth();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (values.role === "engineer") {
      useRegisterStore.getState().setBasicInfo(values);
      setIsEngineer(true);
    } else {
      setIsEngineer(false);
      const createdUser = await CreateNewUser(values);
      if (createdUser.success && createdUser.token) {
        login(createdUser.token, createdUser.user.roles); // set token in context and cookie
        navigate("/manager");
      }
    }
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    if (val == "engineer") {
                      setIsManager(false);
                    } else {
                      setIsManager(true);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full rounded-[8px] py-5">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full bg-white rounded-[8px] flex flex-col gap-5">
                    <SelectItem value="manager" className=" text-[15px]">
                      manager
                    </SelectItem>
                    <SelectItem
                      value="engineer"
                      className="text-[15px] hover:bg-gray-50 cursor-pointer"
                    >
                      engineer
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />
          <Button
            className="bg-[#5c66a7] hover:bg-[#525b95] rounded-[8px] py-5  cursor-pointer w-full text-white"
            type="submit"
          >
            {isManager ? "Submit" : "Continue"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default InitialRegister;
