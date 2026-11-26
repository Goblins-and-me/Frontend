import "next-auth";
import { DefaultSession } from "next-auth";
import "@auth/core/types";
import "@auth/core/jwt";

declare module "next-auth" {
  interface User {
    is_admin?: boolean;
  }

  interface Session {
    user: {
      id: string;
      is_admin: boolean;
      email: string;
      phone?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/types" {
  interface User {
    is_admin?: boolean;
  }

  interface AdapterUser {
    is_admin?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    is_admin?: boolean;
  }
}
