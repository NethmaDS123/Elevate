import NextAuth, { AuthOptions, SessionStrategy } from "next-auth"; // Import NextAuth and its types
import GoogleProvider from "next-auth/providers/google"; // Import Google provider for authentication
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; // Import MongoDB adapter for session management
import clientPromise from "@/lib/mongodb"; // Import MongoDB client promise

// Define authentication options
const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent", // Prompt user for consent
          access_type: "offline", // Request offline access
          response_type: "code", // Response type for authorization
        },
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise), // Use MongoDB adapter for session management
  session: {
    strategy: "jwt" as SessionStrategy, // Use JWT strategy for sessions
    maxAge: 30 * 24 * 60 * 60, // Session max age: 30 days
  },
  callbacks: {
    async jwt({ token, account }) {
      // Add account's id_token to token if account is present
      if (account) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token's id_token to session user if it's a string
      if (session.user && typeof token.id_token === "string") {
        (session.user as { id_token?: string }).id_token = token.id_token;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Create NextAuth handler with the defined options
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // Export handler for both GET and POST requests
