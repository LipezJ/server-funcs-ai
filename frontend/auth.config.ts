import GitHub from '@auth/core/providers/github';
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from '@db/db';
import { users, accounts, sessions, verificationTokens } from '@db/schemas';
import { defineConfig } from 'auth-astro';

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    })
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    async session({ session }) {
      return session
    }
  }
});
