import mongoose from "mongoose";
import { getSessionUserId } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export type SessionUserProfile = {
  name: string;
  email: string;
};

export async function getSessionUserProfile(): Promise<SessionUserProfile | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(userId)) return null;
    const u = await User.findById(userId).select("name email").lean();
    if (!u || !u.name || !u.email) return null;
    return { name: u.name, email: u.email };
  } catch {
    return null;
  }
}
