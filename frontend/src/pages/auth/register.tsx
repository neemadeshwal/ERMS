import { useState } from "react";
import RegisterEngineer from "./registerEngineer";
import InitialRegister from "./initialRegister";
import registerImage from "../../assets/registerb.png";
import emrsLogo from "../../assets/erms.png";

const Register = () => {
  const [isEngineer, setIsEngineer] = useState(false);
  return (
    <div className="h-screen max-width">
      <div className="flex justify-between items-center h-full w-full">
        {/* Left side */}
        <div className="w-full lg:w-[50%] px-4 sm:px-8 md:px-14 lg:pl-32 xl:pl-44">
          <div className="flex justify-center lg:justify-start">
            <img
              src={emrsLogo}
              alt="EMRS Logo"
              className="w-[120px] h-[120px]"
            />
          </div>
          <div className="mt-4">
            {isEngineer ? (
              <RegisterEngineer />
            ) : (
              <InitialRegister setIsEngineer={setIsEngineer} />
            )}
          </div>
          <a href="/login" className="text-blue-600 mt-4  pt-4 hover:underline">
            Already have an account? Click to login.
          </a>
        </div>

        <div className="hidden lg:ml-20 xl:ml-32 lg:flex w-[60%] justify-center pt-20 pr-[-20rem]">
          <img
            src={registerImage}
            alt="Registration Illustration"
            className="max-w-full h-auto rounded-l-[20px] shadow-md border border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
