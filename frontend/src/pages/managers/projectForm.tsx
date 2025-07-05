import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  createProject,
  getSingleProject,
  updateProject,
} from "@/actions/project/project-actions";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
// Example skills list (replace with your real skills data)
const skillsList = [
  "React",
  "Vue",
  "Angular",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "Go",
  "Rust",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Docker",
  "Kubernetes",
  "CI/CD",
  "Mobile Development",
  "DevOps",
  "Testing",
];
export const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  description: z.string().min(5, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
  teamSize: z.string().min(1, "Team size must be at least 1"),
  status: z.enum(["on-hold", "active", "completed"]),
  priority: z.enum(["high", "medium", "low"]),
});

export default function ProjectForm({
  editId,
  setOpen,
}: {
  editId?: string;
  setOpen: any;
}) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchProject = async () => {
      if (editId && token) {
        setLoading(true);
        try {
          const data = await getSingleProject(editId, token);
          if (data.project) {
            form.reset({
              name: data.project.name,
              description: data.project.description,
              startDate: data.project.startDate?.slice(0, 10) || "",
              endDate: data.project.endDate?.slice(0, 10) || "",
              requiredSkills: data.project.requiredSkills || [],
              teamSize: String(data.project.teamSize),
              status: data.project.status,
              priority: data.project.priority,
            });
            setSelectedSkills(data.project.requiredSkills || []);
          }
        } catch (err) {
          toast.error("Failed to fetch project details.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProject();
    // eslint-disable-next-line
  }, [editId, token]);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      requiredSkills: [],
      teamSize: String(1),
      status: "active",
      priority: "medium",
    },
  });

  // Keep requiredSkills in sync with checkboxes
  const handleSkillChange = (skill: string, checked: boolean) => {
    const newSkills = checked
      ? [...form.getValues("requiredSkills"), skill]
      : form.getValues("requiredSkills").filter((s) => s !== skill);
    form.setValue("requiredSkills", newSkills);
    setSelectedSkills(newSkills);
  };

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    // You can also do API call here
    console.log(values);
    try {
      if (!token) {
        return;
      }
      if (!user || !user._id) return;
      if (editId) {
        const editProject = await updateProject(
          editId,
          {
            ...values,
            managerId: user?._id,
            teamSize: Number(values.teamSize),
          },
          token
        );

        if (editProject.success) {
          setOpen(false);
          toast.success("New project created successfully");
        }
      } else {
        const projects = await createProject(
          {
            ...values,
            managerId: user?._id,
            teamSize: Number(values.teamSize),
          },
          token
        );

        console.log(projects);
        if (projects.success) {
          form.reset();
          setOpen(false);

          toast.success("New project created successfully");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating new project.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[1400px] overflow-auto max-h-[70vh]  z-[-10]"
      >
        {/* Project Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Project name" {...field} />
              </FormControl>
              <FormMessage className="text-[12px] mt-0 text-red-500" />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  className="border"
                  placeholder="Project description"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[12px] mt-0 text-red-500" />
            </FormItem>
          )}
        />

        {/* Dates */}
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Required Skills */}
        <FormField
          control={form.control}
          name="requiredSkills"
          render={() => (
            <FormItem>
              <FormLabel>Required Skills</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {skillsList.map((skill) => (
                  <label key={skill} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={form.getValues("requiredSkills").includes(skill)}
                      onChange={(e) =>
                        handleSkillChange(skill, e.target.checked)
                      }
                    />
                    {skill}
                  </label>
                ))}
              </div>
              <FormMessage className="text-[12px] mt-0 text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row gap-6">
          {/* Team Size */}
          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Team Size</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g. 4"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full ">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem value="on-hold">Onhold</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[12px] mt-0 text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full ">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
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
          {editId ? "Edit Project" : "Create Project"}
        </Button>
      </form>
    </Form>
  );
}
