import "next-auth";

declare global {
  interface User {
    aaa: string;
  }

  module "next-auth" {
    interface Session {
      user: User;
    }
  }
}
