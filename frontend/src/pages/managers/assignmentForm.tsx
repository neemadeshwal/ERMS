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
  allocation: z.coerce.number(),
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
  description: z.string().min(5, "Description is required"),
});

type Engineer = { id: string; name: string };
type Project = { id: string; name: string; requiredSkills: string[] };

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
  const [assignedEngineerId, setAssignedEngineerId] = useState<string | null>(
    null
  );

  // React Hook Form setup
  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      engineerId: "",
      projectId: "",
      allocation: 0,
      role: "developer",
      startDate: "",
      endDate: "",
      status: "active",
      description: "",
    },
  });

  // Fetch engineers and projects, and filter engineers
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [engData, projData] = await Promise.all([
          getAllEngineers(token),
          getAllProjects(token),
        ]);
        setProjects(
          (projData.projects || []).map((p: any) => ({
            id: p.id || p._id,
            name: p.name,
            requiredSkills: p.requiredSkills,
          }))
        );

        // Get selected project and allocation
        const selectedProjectId = form.watch("projectId");
        const selectedAllocation = Number(form.watch("allocation")) || 0;
        const selectedProject = (projData.projects || []).find(
          (p: any) => (p.id || p._id) === selectedProjectId
        );

        setEngineers(
          (engData.engineer || [])
            // Filter by required skills if a project is selected
            .filter((e: any) =>
              selectedProject
                ? selectedProject.requiredSkills?.some((skill: string) =>
                    e.skills?.includes(skill)
                  )
                : true
            )
            // Filter by available capacity, but always include the assigned engineer
            .filter((e: any) => {
              const remaining = (e.maxCapacity || 0) - (e.currentCapacity || 0);
              return (
                remaining >= selectedAllocation ||
                (assignedEngineerId && (e.id || e._id) === assignedEngineerId)
              );
            })
            .map((e: any) => ({
              id: e.id || e._id,
              name: e.name,
            }))
        );
      } catch (err) {
        toast.error("Failed to fetch engineers or projects.");
      }
    })();
    // Watch for allocation, projectId, and assignedEngineerId changes
  }, [
    token,
    form.watch("projectId"),
    form.watch("allocation"),
    assignedEngineerId,
  ]);

  // Fetch assignment details if editing
  useEffect(() => {
    const fetchAssignment = async () => {
      if (editId && token) {
        setLoading(true);
        try {
          const data = await getSingleAssignment(editId, token);
          if (data.assignment) {
            // Extract assigned engineer ID (handle array or object)
            let assignedId = "";
            if (Array.isArray(data.assignment.engineerId)) {
              assignedId = data.assignment.engineerId[0]?._id || "";
            } else if (typeof data.assignment.engineerId === "object") {
              assignedId = data.assignment.engineerId?._id || "";
            } else if (typeof data.assignment.engineerId === "string") {
              assignedId = data.assignment.engineerId;
            }
            setAssignedEngineerId(assignedId);

            form.reset({
              engineerId: assignedId,
              projectId: data.assignment.projectId?._id || "",
              allocation: data.assignment.allocationPercentage,
              role: data.assignment.role,
              startDate: data.assignment.startDate?.slice(0, 10) || "",
              endDate: data.assignment.endDate?.slice(0, 10) || "",
              status: data.assignment.status,
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
        {/* Engineer & Allocation */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
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
          <FormField
            control={form.control}
            name="allocation"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Allocation (%)</FormLabel>
                <FormControl>
                  <Input
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
        </div>

        <div className="flex flex-col md:flex-row gap-6">
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
                    <SelectTrigger
                      disabled={
                        loading ||
                        !form.watch("projectId") ||
                        !form.watch("allocation")
                      }
                      className="w-full py-5 rounded-[5px]"
                    >
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
