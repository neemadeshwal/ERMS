import emrsLogo from "../../assets/erms.png";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginUser } from "@/actions/auth/auth-action";
import { getDashboardRoute, useAuth } from "@/context/authContext";
import { Navigate, useNavigate } from "react-router-dom";
import Loader from "@/features/loader";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeClosed, EyeOff } from "lucide-react";

const formSchema = z.object({
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

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { login, isLoading, role, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setLoading(true);
    try {
      const loginUser = await LoginUser(values);
      if (!loginUser.success) {
        toast.error("An error occured .Please try again.");
      }
      if (loginUser.token) {
        login(loginUser.token, loginUser.role);

        if (loginUser.role === "manager") {
          navigate("/manager");
        } else {
          navigate("/engineer");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occured .Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to={getDashboardRoute(role)} replace />;
  }
  return (
    <div className="h-full max-width">
      <div className="flex justify-center items-center h-full">
        <div className="w-[100%] px-4 sm:px-8px md:w-[50%] xl:w-[30%] flex justify-between h-[60%] flex-col ">
          <div className="flex justify-center ">
            <img
              src={emrsLogo}
              alt="EMRS Logo"
              className="w-[120px] h-[120px]"
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <div className="relative">
                        <Input
                          className="rounded-[8px] py-5 placeholder:text-gray-500"
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <div
                          className="absolute right-4 top-[10px]"
                          onClick={() => setShowPassword((prevVal) => !prevVal)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} strokeWidth={1} />
                          ) : (
                            <Eye size={20} strokeWidth={1} />
                          )}
                        </div>
                      </div>
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
                disabled={loading}
                className="bg-[#5c66a7] hover:bg-[#525b95] rounded-[8px] py-5  cursor-pointer w-full text-white"
                type="submit"
              >
                {loading ? <Loader /> : "Submit"}
              </Button>
            </form>
          </Form>
          <a href="/register" className="text-blue-600 mt-4 hover:underline">
            Don't have an account? Click to create.
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
