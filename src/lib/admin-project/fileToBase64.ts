export type Base64File = {
  file_name: string;
  mime_type: string;
  base64: string;
};

export function fileToBase64(file: File): Promise<Base64File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.split(",")[1] || "";

      resolve({
        file_name: file.name,
        mime_type: file.type,
        base64,
      });
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}