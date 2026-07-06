import { auth } from "@/lib/auth";

// The NextAuth framework forces this file; one re-export wires every auth route.
export const { GET, POST } = auth.handlers as {
  GET: (req: Request) => Promise<Response>;
  POST: (req: Request) => Promise<Response>;
};
