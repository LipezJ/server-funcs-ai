import { Lucia } from "lucia";
import { adapter } from "@db/adapter";
import { GitHub } from "arctic";

export const github = new GitHub(
	import.meta.env.GITHUB_CLIENT_ID,
	import.meta.env.GITHUB_CLIENT_SECRET
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD
    }
  },
  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.github_id,
      username: attributes.username
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  github_id: number;
  username: string;
}