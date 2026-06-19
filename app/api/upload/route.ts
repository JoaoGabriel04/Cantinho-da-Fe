import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImagem } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  const urls: string[] = [];
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    urls.push(await uploadImagem(buffer, file.type));
  }

  return NextResponse.json({ urls });
}
