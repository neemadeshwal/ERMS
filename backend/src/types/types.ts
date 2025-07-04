import { NextFunction, Response, Request } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  role: string;
  password: string;
  skills?: string;
  seniority?: string;
  employmentType?: string;
  department?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
  role: string;
}

export interface jwtToken {
  token: any;
}

export interface JWTUSER {
  id: string;
  email: string;
}
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;
