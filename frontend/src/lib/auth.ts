import { Lucia } from "lucia";
import { adapter } from "@db/adapter";
import { GitHub } from "arctic";

const githubClientId =
	process.env.GITHUB_CLIENT_ID ??
	(() => {
		throw new Error("GITHUB_CLIENT_ID is not set");
	})();

const githubClientSecret =
	process.env.GITHUB_CLIENT_SECRET ??
	(() => {
		throw new Error("GITHUB_CLIENT_SECRET is not set");
	})();

export const github = new GitHub(githubClientId, githubClientSecret);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: import.meta.env.PROD
    }
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      name: attributes.name,
      avatar: attributes.image
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
  id: string;
  name: string;
  image: string;
}
