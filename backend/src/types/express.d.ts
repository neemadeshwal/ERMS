// Create a new file: types/express.d.ts
import { Request } from "express";

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any; // or define a more specific type for your user
    }
  }
}

// Alternative: If you want to be more specific about the user type
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         _id: string;
//         name: string;
//         email: string;
//         role: string;
//         password: string;
//       };
//     }
//   }
// }

export {}; // This makes it a module
