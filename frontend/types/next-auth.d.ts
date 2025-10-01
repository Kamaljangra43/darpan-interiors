import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
    email?: string;
  }
}
