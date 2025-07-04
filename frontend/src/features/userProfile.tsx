import type { User } from "@/types/types";
import UserLogo from "./userLogo";
const UserProfile = ({ user }: { user: User }) => {
  console.log(user);
  return (
    <div className="absolute bottom-0 w-full p-4 px-6 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <UserLogo color={user.color} code={user.code} />
        <div>
          <p className="font-medium text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
          {user.department && (
            <p className="text-xs text-gray-400">{user.department}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
