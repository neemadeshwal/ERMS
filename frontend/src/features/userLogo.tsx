const UserLogo = ({
  color,
  code,
  isSmall,
}: {
  color: string;
  code: string;
  isSmall?: boolean;
}) => {
  return (
    <div>
      <div
        style={{ backgroundColor: color }}
        className={`${
          isSmall ? "w-8 h-8" : "h-12 w-12"
        }   rounded-full flex items-center justify-center`}
      >
        <span
          className={`text-white ${
            isSmall ? "text-[12px]" : "text-[14px]"
          } font-semibold`}
        >
          {code.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default UserLogo;
