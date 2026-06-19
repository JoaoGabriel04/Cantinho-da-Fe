import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImagem(
  file: Buffer,
  pasta: string = "cantinho-religioso"
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: pasta,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        }
      )
      .end(file);
  });
}

export async function deletarImagem(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function extrairPublicId(url: string): string {
  const partes = url.split("/");
  const pasta = partes[partes.length - 2];
  const arquivo = partes[partes.length - 1].split(".")[0];
  return `${pasta}/${arquivo}`;
}

export { cloudinary };
