import { auth as nextAuth } from "src/auth";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  image?: string;
  role: string;
  token?: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const session = await nextAuth();
    if (!session?.user) {
      return null;
    }
    
    // Auth.js maps 'image' to 'avatar' if we defined it, but just in case:
    return {
      ...session.user,
      avatar: session.user.image || (session.user as any).avatar
    } as CurrentUser;
  } catch {
    return null;
  }
}
