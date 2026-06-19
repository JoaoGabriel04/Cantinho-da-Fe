import crypto from "crypto";

function getConfig() {
  return {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  };
}

function assinar(params: Record<string, string | number>, apiSecret: string) {
  const str = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(str + apiSecret).digest("hex");
}

export async function uploadImagem(
  buffer: Buffer,
  mimeType = "image/jpeg",
  pasta = "cantinho-religioso"
): Promise<string> {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = assinar({ folder: pasta, timestamp }, apiSecret);

  const form = new FormData();
  form.append("file", `data:${mimeType};base64,${buffer.toString("base64")}`);
  form.append("folder", pasta);
  form.append("timestamp", String(timestamp));
  form.append("api_key", apiKey);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(`Cloudinary ${res.status}: ${JSON.stringify(detail)}`);
  }

  const data = await res.json();
  return data.secure_url as string;
}

export async function deletarImagem(publicId: string): Promise<void> {
  const { cloudName, apiKey, apiSecret } = getConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = assinar({ public_id: publicId, timestamp }, apiSecret);

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("timestamp", String(timestamp));
  form.append("api_key", apiKey);
  form.append("signature", signature);

  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: form,
  });
}

export function extrairPublicId(url: string): string {
  const partes = url.split("/");
  const pasta = partes[partes.length - 2];
  const arquivo = partes[partes.length - 1].split(".")[0];
  return `${pasta}/${arquivo}`;
}
