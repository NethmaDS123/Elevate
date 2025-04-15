import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken: {};
      id?: string;
      email?: string;
      name?: string;
      id_token?: string;
    };
    id_token?: string;
  }
}
