import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const senhaHash = await bcrypt.hash("admin123", 12);

  await prisma.admin.upsert({
    where: { email: "admin@cantinho.com" },
    update: {},
    create: {
      email: "admin@cantinho.com",
      senha: senhaHash,
    },
  });

  const categorias = [
    { nome: "Terços e Rosários", slug: "tercos-e-rosarios" },
    { nome: "Bíblias", slug: "biblias" },
    { nome: "Imagens e Estátuas", slug: "imagens-e-estatuas" },
    { nome: "Decoração", slug: "decoracao" },
    { nome: "Acessórios", slug: "acessorios" },
  ];

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Seed concluído!");
  console.log("📧 Email: admin@cantinho.com");
  console.log("🔑 Senha: admin123");
  console.log("⚠️  Lembre-se de alterar a senha após o primeiro acesso.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
