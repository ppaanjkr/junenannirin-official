import { google } from "googleapis";
import { Readable } from "stream";

type UploadImageParams = {
  base64: string;
  fileName: string;
};

function getMimeType(base64: string, fileName: string) {
  const lowerName = fileName.toLowerCase();

  if (base64.includes("data:image/webp") || lowerName.endsWith(".webp")) {
    return "image/webp";
  }

  if (base64.includes("data:image/png") || lowerName.endsWith(".png")) {
    return "image/png";
  }

  return "image/jpeg";
}

function cleanBase64(base64: string) {
  if (base64.includes("base64,")) {
    return base64.split("base64,")[1];
  }

  return base64;
}

export async function uploadImageToDrive({
  base64,
  fileName,
}: UploadImageParams) {
  if (!base64) {
    throw new Error("base64 is required");
  }

  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

   if (!folderId) {
    throw new Error("Missing GOOGLE_DRIVE_FOLDER_ID");
  }

  if (!clientId || !clientSecret || !refreshToken || !folderId) {
    throw new Error("Missing Google Drive environment variables");
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);

  auth.setCredentials({
    refresh_token: refreshToken,
  });

  const drive = google.drive({ version: "v3", auth });

  const mimeType = getMimeType(base64, fileName);
  const buffer = Buffer.from(cleanBase64(base64).replace(/\s/g, ""), "base64");

  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id",
  });

  const fileId = created.data.id;

  if (!fileId) {
    throw new Error("Upload image failed");
  }

  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    fileId,
    url: `https://drive.google.com/file/d/${fileId}/view`,
  };
}

function getDriveClient() {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Google Drive OAuth environment variables");
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);

  auth.setCredentials({
    refresh_token: refreshToken,
  });

  return google.drive({ version: "v3", auth });
}

export function getDriveFileIdFromUrl(url?: string) {
  if (!url) return "";

  const patterns = [
    /\/file\/d\/([^/]+)/,
    /\/d\/([^/]+)/,
    /id=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return "";
}

export async function deleteFileFromDriveByUrl(url?: string) {
  const fileId = getDriveFileIdFromUrl(url);

  if (!fileId) {
    return {
      success: false,
      message: "Drive file id not found",
    };
  }

  const drive = getDriveClient();

  await drive.files.delete({
    fileId,
    supportsAllDrives: true,
  });

  return {
    success: true,
    fileId,
  };
}

export async function testDriveFolder() {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

   if (!folderId) {
    throw new Error("Missing GOOGLE_DRIVE_FOLDER_ID");
  }

  if (!clientId || !clientSecret || !refreshToken || !folderId) {
    throw new Error("Missing Google Drive environment variables");
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret);

  auth.setCredentials({
    refresh_token: refreshToken,
  });

  const drive = google.drive({ version: "v3", auth });

  const folder = await drive.files.get({
    fileId: folderId.trim(),
    fields: "id,name,mimeType",
    supportsAllDrives: true,
  });

  return folder.data;
}