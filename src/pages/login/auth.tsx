// import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import { z } from 'zod';
// import { sql } from '@vercel/postgres';
// import type { User } from '../lib/definitions';
// import bcrypt from 'bcrypt';

// import GoogleProvider from "next-auth/providers/google";
// import GithubProvider from "next-auth/providers/github";
// import FacebookProvider from "next-auth/providers/facebook";
// import TwitterProvider from "next-auth/providers/twitter";

// async function getUser(email: string): Promise<User | undefined> {
//     try {
//       const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
//       return user.rows[0];
//     } catch (error) {
//       console.error('Failed to fetch user:', error);
//       throw new Error('Failed to fetch user.');
//     }
//   }

// export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth({
//   pages: {
//     signIn: '/login',
//   },
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         const parsedCredentials = z
//           .object({ email: z.string().email(), password: z.string().min(6) })
//           .safeParse(credentials);

//           if (parsedCredentials.success) {
//             const { email, password } = parsedCredentials.data;
//             const user = await getUser(email);
//             if (!user) return null;

//             const passwordsMatch = await bcrypt.compare(password, user.password);
//             if (passwordsMatch) return user;
//           }

//           console.log('Invalid credentials');
//           return null;
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET
//     }),
//     GithubProvider({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET
//     }),
//     FacebookProvider({
//       clientId: process.env.FACEBOOK_ID,
//       clientSecret: process.env.FACEBOOK_SECRET
//     }),
//     TwitterProvider({
//       clientId: process.env.TWITTER_ID,
//       clientSecret: process.env.TWITTER_SECRET
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     // async session({ session, token }) {
//     //   return session;
//     // },
//     authorized({ auth, request: { nextUrl } }) {
//       // const isLoggedIn = !!auth?.user;
//       // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
//       // if (!isLoggedIn) {
//       //   // Redirect unauthenticated users to the login page
//       //   return Response.redirect(new URL('/login', nextUrl));
//       // } else if (!isOnDashboard) {
//       //   // Redirect authenticated users to the dashboard if they're not already there
//       //   return Response.redirect(new URL('/dashboard', nextUrl));
//       // }
//       return Response.redirect(new URL('/dashboard', nextUrl));
//     },
//   },


// });
export{}