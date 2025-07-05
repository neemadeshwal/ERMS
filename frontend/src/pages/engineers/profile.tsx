import React, { useState, useEffect } from "react";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  Award,
  Star,
  Edit3,
  Save,
  X,
  MapPin,
  Clock,
  Briefcase,
  Users,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/authContext";
import UserLogo from "@/features/userLogo";

// Zod Schema Definitions
const UserSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["engineer", "manager"], {
    required_error: "Role is required",
  }),
  department: z.string().optional(),
  team: z.string().optional(),
  seniority: z.enum(["senior", "mid", "junior", "intern", "staff"]).optional(),
  yearsOfExperience: z.number().min(0).max(50).optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  employmentType: z.enum(["fullTime", "partTime"]).optional(),
  workType: z.enum(["remote", "onsite", "hybrid"]).optional(),
  status: z.enum(["active", "inactive", "on-leave", "terminated"]).optional(),
  hireDate: z.string().optional(),
  availableFrom: z.string().optional(),
  maxCapacity: z.number().min(0).max(100).optional(),
  currentCapacity: z.number().min(0).max(100).optional(),
  skills: z.array(z.string()).optional(),
  preferredProjectTypes: z.array(z.string()).optional(),
  color: z.string().optional(),
  code: z.string().optional(),
});

// TypeScript Types
type ProfileUser = z.infer<typeof UserSchema>;
type ValidationErrors = Partial<Record<keyof ProfileUser, string>>;

// Constants
const SKILLS = [
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

const PROJECT_TYPES = [
  "web-app",
  "mobile-app",
  "api",
  "infrastructure",
  "data-pipeline",
  "ml",
];

const ROLE_OPTIONS = [
  { value: "engineer", label: "Engineer" },
  { value: "manager", label: "Manager" },
];

const SENIORITY_OPTIONS = [
  { value: "intern", label: "Intern" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid" },
  { value: "senior", label: "Senior" },
  { value: "staff", label: "Staff" },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "fullTime", label: "Full Time" },
  { value: "partTime", label: "Part Time" },
];

const WORK_TYPE_OPTIONS = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
  { value: "hybrid", label: "Hybrid" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on-leave", label: "On Leave" },
  { value: "terminated", label: "Terminated" },
];

// Enhanced Input Component
const FormInput: React.FC<{
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  readOnly?: boolean;
  error?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  min?: number;
  max?: number;
}> = ({
  label,
  value,
  onChange,
  type = "text",
  readOnly,
  error,
  icon,
  placeholder,
  min,
  max,
}) => (
  <div className="space-y-2 w-full">
    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <input
      type={type}
      className={`w-full p-3 border rounded-lg transition-colors text-base
        ${
          readOnly
            ? "bg-gray-50 border-gray-200 cursor-not-allowed"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        } ${error ? "border-red-500" : ""}`}
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      min={min}
      max={max}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && (
      <div className="flex items-center gap-1 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    )}
  </div>
);

// Enhanced Select Component
const FormSelect: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  error?: string;
  icon?: React.ReactNode;
  placeholder?: string;
}> = ({
  label,
  value,
  onChange,
  options,
  disabled,
  error,
  icon,
  placeholder,
}) => (
  <div className="space-y-2 w-full">
    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <select
      className={`w-full p-3 border rounded-lg transition-colors text-base
        ${
          disabled
            ? "bg-gray-50 border-gray-200 cursor-not-allowed"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        } ${error ? "border-red-500" : ""}`}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <div className="flex items-center gap-1 text-red-600 text-sm">
        <AlertCircle className="w-4 h-4" />
        {error}
      </div>
    )}
  </div>
);

// Enhanced Skill Tags Component
const SkillTags: React.FC<{
  label: string;
  selectedItems: string[];
  availableItems: string[];
  onChange: (item: string) => void;
  disabled?: boolean;
  color?: string;
}> = ({
  label,
  selectedItems,
  availableItems,
  onChange,
  disabled,
  color = "blue",
}) => (
  <div className="space-y-2 w-full">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex flex-wrap gap-2">
      {availableItems.map((item) => {
        const isSelected = selectedItems?.includes(item);
        return (
          <button
            key={item}
            type="button"
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-all
              ${
                isSelected
                  ? color === "blue"
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-green-600 text-white border-green-600 shadow-md"
                  : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
              }
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:scale-105"
              }`}
            disabled={disabled}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        );
      })}
    </div>
  </div>
);

// Status Badge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(
        status
      )}`}
    >
      {status.replace("-", " ").toUpperCase()}
    </span>
  );
};

// Capacity Bar Component
const CapacityBar: React.FC<{ current: number; max: number }> = ({
  current,
  max,
}) => {
  const percentage = max > 0 ? (current / max) * 100 : 0;
  const getColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-cyan-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          Capacity: {current}/{max}
        </span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Main Component
const EngineerProfile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [formData, setFormData] = useState<ProfileUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  useEffect(() => {
    if (authUser) {
      const parsed = UserSchema.safeParse(authUser);
      setFormData(parsed.success ? parsed.data : null);
    }
  }, [authUser]);

  const validateForm = (data: ProfileUser): ValidationErrors => {
    try {
      UserSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ProfileUser;
          errors[path] = err.message;
        });
        return errors;
      }
      return {};
    }
  };

  const handleChange = (field: keyof ProfileUser, value: string | number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
      return updated;
    });
  };

  const handleArrayChange = (field: keyof ProfileUser, value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const currentArray = (prev[field] as string[]) || [];
      const updated = {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter((v) => v !== value)
          : [...currentArray, value],
      };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!formData) return;
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setSaveStatus("saving");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus("success");
      setIsEditing(false);
      setValidationErrors({});
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleCancel = () => {
    if (authUser) {
      const parsed = UserSchema.safeParse(authUser);
      setFormData(parsed.success ? parsed.data : null);
    }
    setIsEditing(false);
    setValidationErrors({});
    setSaveStatus("idle");
  };

  if (!formData) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className=" sm:p-4 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Alerts */}
      {saveStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Profile updated successfully!
          </AlertDescription>
        </Alert>
      )}
      {saveStatus === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to update profile. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#3e456f] via-[#4a5280] to-[#525b95] rounded-2xl p-4 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="flex-shrink-0 self-center md:self-start">
            {formData.code && formData.color ? (
              <UserLogo color={formData.color} code={formData.code} />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-lg flex items-center justify-center text-3xl font-bold text-white">
                {formData.code || formData.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold break-all">
                {formData.name.toUpperCase()}
              </h1>
              <StatusBadge status={formData.status || "active"} />
            </div>
            <p className="text-white/90 text-base md:text-lg mb-2 md:mb-4 break-all">
              {formData.role?.charAt(0).toUpperCase() + formData.role?.slice(1)}{" "}
              • {formData.department}
              {formData.team && ` • ${formData.team}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs sm:text-sm text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{formData.location || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formData.timezone || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formData.hireDate
                    ? `Joined ${new Date(formData.hireDate).getFullYear()}`
                    : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{formData.yearsOfExperience || 0} years exp</span>
              </div>
            </div>
          </div>
        </div>
        {/* Capacity Bar */}
        <div className="mb-4 md:mb-6">
          <CapacityBar
            current={formData.currentCapacity || 0}
            max={formData.maxCapacity || 100}
          />
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium flex items-center gap-2 transition-all backdrop-blur-sm"
            >
              <Edit3 className="w-5 h-5" />
              Edit Profile
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleCancel}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium flex items-center gap-2 transition-all backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveStatus === "saving"}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg"
              >
                {saveStatus === "saving" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saveStatus === "saving" ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl shadow-lg p-2 sm:p-4 md:p-8 border border-gray-100 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* All field components as before */}
          <FormInput
            label="Full Name"
            value={formData.name || ""}
            onChange={(value) => handleChange("name", value)}
            readOnly={!isEditing}
            error={validationErrors.name}
            icon={<User className="w-4 h-4" />}
            placeholder="Enter full name"
          />
          <FormInput
            label="Email Address"
            value={formData.email || ""}
            onChange={(value) => handleChange("email", value)}
            type="email"
            readOnly={!isEditing}
            error={validationErrors.email}
            icon={<Mail className="w-4 h-4" />}
            placeholder="Enter email address"
          />
          <FormInput
            label="Phone Number"
            value={formData.phone || ""}
            onChange={(value) => handleChange("phone", value)}
            type="tel"
            readOnly={!isEditing}
            error={validationErrors.phone}
            icon={<Phone className="w-4 h-4" />}
            placeholder="Enter phone number"
          />
          <FormSelect
            label="Role"
            value={formData.role || ""}
            onChange={(value) => handleChange("role", value)}
            options={ROLE_OPTIONS}
            disabled={!isEditing}
            error={validationErrors.role}
            icon={<Briefcase className="w-4 h-4" />}
            placeholder="Select role"
          />
          <FormInput
            label="Department"
            value={formData.department || ""}
            onChange={(value) => handleChange("department", value)}
            readOnly={!isEditing}
            error={validationErrors.department}
            icon={<Building className="w-4 h-4" />}
            placeholder="Enter department"
          />
          <FormInput
            label="Team"
            value={formData.team || ""}
            onChange={(value) => handleChange("team", value)}
            readOnly={!isEditing}
            error={validationErrors.team}
            icon={<Users className="w-4 h-4" />}
            placeholder="Enter team"
          />
          <FormSelect
            label="Seniority Level"
            value={formData.seniority || ""}
            onChange={(value) => handleChange("seniority", value)}
            options={SENIORITY_OPTIONS}
            disabled={!isEditing}
            error={validationErrors.seniority}
            icon={<Award className="w-4 h-4" />}
            placeholder="Select seniority level"
          />
          <FormInput
            label="Years of Experience"
            value={formData.yearsOfExperience || 0}
            onChange={(value) =>
              handleChange("yearsOfExperience", parseInt(value) || 0)
            }
            type="number"
            readOnly={!isEditing}
            error={validationErrors.yearsOfExperience}
            icon={<TrendingUp className="w-4 h-4" />}
            min={0}
            max={50}
          />
          <FormInput
            label="Location"
            value={formData.location || ""}
            onChange={(value) => handleChange("location", value)}
            readOnly={!isEditing}
            error={validationErrors.location}
            icon={<MapPin className="w-4 h-4" />}
            placeholder="Enter location"
          />
          <FormInput
            label="Timezone"
            value={formData.timezone || ""}
            onChange={(value) => handleChange("timezone", value)}
            readOnly={!isEditing}
            error={validationErrors.timezone}
            icon={<Clock className="w-4 h-4" />}
            placeholder="Enter timezone"
          />
          <FormSelect
            label="Employment Type"
            value={formData.employmentType || ""}
            onChange={(value) => handleChange("employmentType", value)}
            options={EMPLOYMENT_TYPE_OPTIONS}
            disabled={!isEditing}
            error={validationErrors.employmentType}
            icon={<Briefcase className="w-4 h-4" />}
            placeholder="Select employment type"
          />
          <FormSelect
            label="Work Type"
            value={formData.workType || ""}
            onChange={(value) => handleChange("workType", value)}
            options={WORK_TYPE_OPTIONS}
            disabled={!isEditing}
            error={validationErrors.workType}
            icon={<Building className="w-4 h-4" />}
            placeholder="Select work type"
          />
          <FormSelect
            label="Status"
            value={formData.status || ""}
            onChange={(value) => handleChange("status", value)}
            options={STATUS_OPTIONS}
            disabled={!isEditing}
            error={validationErrors.status}
            icon={<Target className="w-4 h-4" />}
            placeholder="Select status"
          />
          <FormInput
            label="Hire Date"
            value={formData.hireDate ? formData.hireDate.slice(0, 10) : ""}
            onChange={(value) => handleChange("hireDate", value)}
            type="date"
            readOnly={!isEditing}
            error={validationErrors.hireDate}
            icon={<Calendar className="w-4 h-4" />}
          />
          <FormInput
            label="Available From"
            value={
              formData.availableFrom ? formData.availableFrom.slice(0, 10) : ""
            }
            onChange={(value) => handleChange("availableFrom", value)}
            type="date"
            readOnly={!isEditing}
            error={validationErrors.availableFrom}
            icon={<Calendar className="w-4 h-4" />}
          />
          <FormInput
            label="Maximum Capacity"
            value={formData.maxCapacity || 0}
            onChange={(value) =>
              handleChange("maxCapacity", parseInt(value) || 0)
            }
            type="number"
            readOnly={!isEditing}
            error={validationErrors.maxCapacity}
            icon={<Target className="w-4 h-4" />}
            min={0}
            max={100}
          />
          <FormInput
            label="Current Capacity"
            value={formData.currentCapacity || 0}
            onChange={(value) =>
              handleChange("currentCapacity", parseInt(value) || 0)
            }
            type="number"
            readOnly={!isEditing}
            error={validationErrors.currentCapacity}
            icon={<TrendingUp className="w-4 h-4" />}
            min={0}
            max={formData.maxCapacity || 100}
          />
        </div>

        {/* Skills Section */}
        <div className="space-y-4 md:space-y-6">
          <SkillTags
            label="Technical Skills"
            selectedItems={formData.skills || []}
            availableItems={SKILLS}
            onChange={(skill) => handleArrayChange("skills", skill)}
            disabled={!isEditing}
            color="blue"
          />
          <SkillTags
            label="Preferred Project Types"
            selectedItems={formData.preferredProjectTypes || []}
            availableItems={PROJECT_TYPES}
            onChange={(type) =>
              handleArrayChange("preferredProjectTypes", type)
            }
            disabled={!isEditing}
            color="green"
          />
        </div>
      </div>
    </div>
  );
};

export default EngineerProfile;
