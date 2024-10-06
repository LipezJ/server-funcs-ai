import { github, lucia } from "@lib/auth";
import { OAuth2RequestError } from "arctic";

import type { APIContext } from "astro";
import { db } from "@db/db";
import { userTable } from "@db/schemas";
import { eq } from "drizzle-orm";

export async function GET(context: APIContext): Promise<Response> {
  const code = context.url.searchParams.get("code");
  const state = context.url.searchParams.get("state");
  const storedState = context.cookies.get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    // Replace this with your own DB client.
    const [existingUser] = await db.select({ id: userTable.id }).from(userTable).where(eq(userTable.id, githubUser.id));

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return context.redirect("/");
    }

    // Replace this with your own DB client.
    await db.insert(userTable)
      .values({
        id: githubUser.id,
        name: githubUser.login,
        image: githubUser.avatar_url
      });

    const session = await lucia.createSession(githubUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return context.redirect("/");
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
}

interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
}