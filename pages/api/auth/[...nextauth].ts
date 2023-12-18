import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb'; 
import EmailProvider from 'next-auth/providers/email';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const emailHost = process.env.EMAIL_SERVER_HOST;
const emailPort = process.env.EMAIL_SERVER_PORT;
const emailServerUser = process.env.EMAIL_SERVER_USER;
const emailPassword = process.env.EMAIL_SERVER_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;

if (!googleClientId || !googleClientSecret) {
  throw new Error("One or more required environment variables are missing");
}

export const authOptions: NextAuthOptions = {
    providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
    EmailProvider({
        server: {
          host: emailHost,
          port: emailPort,
          auth: {
            user: emailServerUser,
            pass: emailPassword,
          },
        },
        from: emailFrom,
      }),
    
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async redirect({ url, baseUrl }) {
        return baseUrl;
    },
},
};

export default NextAuth(authOptions);
