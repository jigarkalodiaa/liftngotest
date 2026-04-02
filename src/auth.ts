import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { verifyOtpWithBackend } from '@/lib/auth/otpBackend';

const otpCredentials = z.object({
  mobile: z.string().min(12), // +91 + 10 digits
  otp: z.string().min(4).max(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      id: 'credentials',
      name: 'OTP',
      credentials: {
        mobile: { label: 'Mobile', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = otpCredentials.safeParse(credentials);
        if (!parsed.success) return null;

        const { mobile, otp } = parsed.data;
        const result = await verifyOtpWithBackend(mobile, otp);
        if (!result) return null;

        return {
          id: result.user?.id ?? mobile,
          name: result.user?.name ?? undefined,
          email: result.user?.email ?? undefined,
          mobile,
          role: result.user?.role,
          status: result.user?.status,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.mobile = user.mobile;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? '';
        session.user.mobile = typeof token.mobile === 'string' ? token.mobile : undefined;
        session.user.role = typeof token.role === 'string' ? token.role : undefined;
        session.user.status = typeof token.status === 'string' ? token.status : undefined;
      }
      session.accessToken = typeof token.accessToken === 'string' ? token.accessToken : undefined;
      session.refreshToken = typeof token.refreshToken === 'string' ? token.refreshToken : undefined;
      return session;
    },
  },
});
