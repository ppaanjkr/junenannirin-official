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

function safePhone(phone?: string) {
  return String(phone || "")
    .replace(/\D/g, "")
    .slice(0, 10);
}

function safeText(value?: string) {
  return String(value || "").trim();
}

export async function checkUser(lineUserId: string) {
  const safeLineUserId = safeText(lineUserId);

  if (!safeLineUserId) {
    return { status: "NEW" };
  }

  const snap = await adminDb
    .collection("users")
    .where("lineUserId", "==", safeLineUserId)
    .limit(1)
    .get();

  if (snap.empty) {
    return { status: "NEW" };
  }

  const data = snap.docs[0].data();

  return {
    status: "EXIST",
    user: {
      uuid: data.uuid || snap.docs[0].id,
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

  const lineUserId = safeText(data.lineUserId);
  const username = safeText(data.username);
  const phone = safePhone(data.phone);
  const name = safeText(data.name);
  const address = safeText(data.address);
  const email = safeText(data.email);
  const twitter = safeText(data.twitter);

  // กันไม่ให้สมัคร admin จากหน้า register
  const team = safeText(data.team) === "admin" ? "" : safeText(data.team);

  if (!lineUserId) {
    return {
      status: "ERROR",
      message: "lineUserId is required",
    };
  }

  if (!username) {
    return {
      status: "ERROR",
      message: "username is required",
    };
  }

  if (!phone || phone[0] !== "0" || phone.length !== 10) {
    return {
      status: "ERROR",
      message: "Invalid phone number",
    };
  }

  if (!team) {
    return {
      status: "ERROR",
      message: "team is required",
    };
  }

  if (!name) {
    return {
      status: "ERROR",
      message: "name is required",
    };
  }

  if (!address) {
    return {
      status: "ERROR",
      message: "address is required",
    };
  }

  const lineSnap = await usersRef
    .where("lineUserId", "==", lineUserId)
    .limit(1)
    .get();

  if (!lineSnap.empty) {
    return {
      status: "EXIST",
      message: "User already exists",
    };
  }

  const phoneSnap = await usersRef
    .where("phone", "==", phone)
    .limit(1)
    .get();

  if (!phoneSnap.empty) {
    return {
      status: "PHONENUMBER_DUPLICATE",
      message: "Phonenumber already taken",
    };
  }

  const usernameSnap = await usersRef
    .where("username", "==", username)
    .limit(1)
    .get();

  if (!usernameSnap.empty) {
    return {
      status: "USERNAME_DUPLICATE",
      message: "Username already taken",
    };
  }

  const uuid = randomUUID();
  const now = new Date().toISOString();

  const user = {
    uuid,
    name,
    phone,
    team,
    email,
    twitter,
    address,
    created_at: now,
    updated_at: now,
    lineUserId,
    active: 1,
    username,
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