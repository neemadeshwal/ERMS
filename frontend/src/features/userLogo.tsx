const UserLogo = ({ color, code }: { color: string; code: string }) => {
  return (
    <div>
      <div
        style={{ backgroundColor: color }}
        className={`w-12 h-12   rounded-full flex items-center justify-center`}
      >
        <span className="text-white font-semibold">{code.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default UserLogo;
