import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  createAssignment,
  getSingleAssignment,
  updateAssignment,
} from "@/actions/assignments/assignment-action";
import { getAllEngineers } from "@/actions/engineers/engineer-action";
import { getAllProjects } from "@/actions/project/project-actions";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

export const assignmentSchema = z.object({
  engineerId: z.string({ required_error: "Engineer is required" }),
  projectId: z.string({ required_error: "Project is required" }),
  allocation: z
    .number({ required_error: "Allocation is required" })
    .min(1)
    .max(100),
  role: z.enum([
    "developer",
    "senior-developer",
    "tech-lead",
    "architect",
    "designer",
    "tester",
    "devops",
    "project-manager",
  ]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["active", "completed", "on-hold"]),
  priority: z.enum(["high", "medium", "low"]),
  description: z.string().min(5, "Description is required"),
});

type Engineer = { id: string; name: string };
type Project = { id: string; name: string };

export default function AssignmentForm({
  editId,
  onSuccess,
  setOpen,
}: {
  editId?: string;
  onSuccess?: () => void;
  setOpen: any;
}) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Fetch engineers and projects from API
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [engData, projData] = await Promise.all([
          getAllEngineers(token),
          getAllProjects(token),
        ]);
        // Ensure the id and name are used for value and display
        setEngineers(
          (engData.engineer || []).map((e: any) => ({
            id: e.id || e._id,
            name: e.name,
          }))
        );
        setProjects(
          (projData.projects || []).map((p: any) => ({
            id: p.id || p._id,
            name: p.name,
          }))
        );
      } catch (err) {
        toast.error("Failed to fetch engineers or projects.");
      }
    })();
  }, [token]);

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      engineerId: "",
      projectId: "",
      allocation: 100,
      role: "developer",
      startDate: "",
      endDate: "",
      status: "active",
      priority: "medium",
      description: "",
    },
  });

  // Fetch assignment details if editing
  useEffect(() => {
    const fetchAssignment = async () => {
      if (editId && token) {
        setLoading(true);
        try {
          const data = await getSingleAssignment(editId, token);
          if (data.assignment) {
            form.reset({
              engineerId: data.assignment.engineerId,
              projectId: data.assignment.projectId,
              allocation: data.assignment.allocationPercentage,
              role: data.assignment.role,
              startDate: data.assignment.startDate?.slice(0, 10) || "",
              endDate: data.assignment.endDate?.slice(0, 10) || "",
              status: data.assignment.status,
              priority: data.assignment.priority,
              description: data.assignment.description,
            });
          }
        } catch (err) {
          toast.error("Failed to fetch assignment details.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAssignment();
    // eslint-disable-next-line
  }, [editId, token]);

  const onSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    try {
      if (!token) return;
      setLoading(true);

      let result;
      if (editId) {
        result = await updateAssignment(editId, values, token);
        if (result.success) {
          setOpen(false);
          toast("edit successfully");
        }
      } else {
        result = await createAssignment(values, token);
      }

      if (result.success) {
        form.reset();
        setOpen(false);
        toast.success(
          editId
            ? "Assignment updated successfully"
            : "New assignment created successfully"
        );
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error(
        editId ? "Error updating assignment." : "Error creating new assignment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 mx-auto overflow-auto max-h-[70vh]"
      >
        {/* Engineer & Project */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <FormField
            control={form.control}
            name="engineerId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Engineer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full py-5 rounded-[5px]">
                      <SelectValue placeholder="Select engineer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full bg-white">
                    {engineers.map((eng) => (
                      <SelectItem key={eng.id} value={eng.id}>
                        {eng.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem className="w-full bg-white">
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full py-5 rounded-[5px]">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full bg-white">
                    {projects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Allocation Percentage & Role */}
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="allocation"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Allocation (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    {...field}
                    value={field.value ?? ""}
                    placeholder="e.g. 60"
                    disabled={loading}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
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
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full bg-white">
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="senior-developer">
                      Senior Developer
                    </SelectItem>
                    <SelectItem value="tech-lead">Tech Lead</SelectItem>
                    <SelectItem value="architect">Architect</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="tester">Tester</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="project-manager">
                      Project Manager
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Start Date & End Date */}
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
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
                  <Input type="date" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status & Priority */}
        <div className="flex flex-col md:flex-row gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full bg-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full bg-white">
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Assignment description"
                  rows={4}
                  {...field}
                  className="border rounded-[10px] p-4"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-[#5c66a7] hover:bg-[#525b95] rounded-[8px] py-5 cursor-pointer w-full text-white"
          type="submit"
          disabled={loading}
        >
          {editId ? "Save Changes" : "Create Assignment"}
        </Button>
      </form>
    </Form>
  );
}
