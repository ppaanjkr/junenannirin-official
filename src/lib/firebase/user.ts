import { adminDb } from "@/lib/firebase/admin";
import { randomUUID } from "crypto";

export type UserData = {
  lineUserId: string;
  username?: string;
  phone?: string;
  team?: string;
  email?: string;
  twitter?: string;
  address?: string;
  name?: string;
};

export async function checkUser(lineUserId: string) {
  const snap = await adminDb
    .collection("users")
    .where("lineUserId", "==", lineUserId)
    .limit(1)
    .get();

  if (snap.empty) {
    return { status: "NEW" };
  }

  const data = snap.docs[0].data();

  return {
    status: "EXIST",
    user: {
      uuid: data.uuid,
      username: data.username || "",
      phone: data.phone || "",
      team: data.team || "",
      active: Number(data.active ?? 1),
      name: data.name || "",
      address: data.address || "",
      lineUserId: data.lineUserId || "",
    },
  };
}

export async function createUser(data: UserData) {
  const usersRef = adminDb.collection("users");

  const lineSnap = await usersRef
    .where("lineUserId", "==", data.lineUserId)
    .limit(1)
    .get();

  if (!lineSnap.empty) {
    return {
      status: "EXIST",
      message: "User already exists",
    };
  }

  if (data.phone) {
    const phoneSnap = await usersRef
      .where("phone", "==", data.phone)
      .limit(1)
      .get();

    if (!phoneSnap.empty) {
      return {
        status: "PHONENUMBER_DUPLICATE",
        message: "Phonenumber already taken",
      };
    }
  }

  if (data.username) {
    const usernameSnap = await usersRef
      .where("username", "==", data.username)
      .limit(1)
      .get();

    if (!usernameSnap.empty) {
      return {
        status: "USERNAME_DUPLICATE",
        message: "Username already taken",
      };
    }
  }

  const uuid = randomUUID();
  const now = new Date().toISOString();

  const user = {
    uuid,
    name: data.name || "",
    phone: data.phone || "",
    team: data.team || "",
    email: data.email || "",
    twitter: data.twitter || "",
    address: data.address || "",
    created_at: now,
    updated_at: now,
    lineUserId: data.lineUserId || "",
    active: 1,
    username: data.username || "",
  };

  await usersRef.doc(uuid).set(user);

  return {
    status: "CREATED",
    user: {
      uuid,
      lineUserId: user.lineUserId,
      team: user.team,
      username: user.username,
      phone: user.phone,
      name: user.name,
      address: user.address,
      active: 1,
    },
  };
}