import { test, expect, Page } from "@playwright/test";

const PEDIDO_MOCK = {
  id: "mock-id",
  codigo: "PED-9999",
  clienteNome: "Maria Teste",
  clienteWhatsapp: "61999999999",
  total: "89.90",
  status: "PENDENTE",
  createdAt: new Date().toISOString(),
  itens: [
    {
      id: "mock-item-id",
      produtoId: "mock-produto-id",
      codigo: "PROD-001",
      nome: "Produto Teste",
      quantidade: 1,
      precoUnitario: "89.90",
    },
  ],
};

async function mockPedidosApi(page: Page) {
  await page.route("**/api/pedidos", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(PEDIDO_MOCK) });
    } else {
      await route.continue();
    }
  });
}

test.describe("Fluxo de checkout", () => {
  test("deve exibir validação quando formulário vazio for enviado", async ({ page }) => {
    await mockPedidosApi(page);
    await page.goto("/produtos");

    const productLink = page.locator('a[href^="/produtos/"]').first();
    const productVisible = await productLink.isVisible().catch(() => false);
    if (!productVisible) {
      test.skip(true, "Nenhum produto encontrado — execute `npm run db:seed` e adicione produtos no admin");
    }

    await productLink.click();
    await page.waitForURL(/\/produtos\/.+/);

    await page.getByRole("button", { name: "Comprar pelo WhatsApp" }).click();
    await expect(page.getByText("Finalizar Pedido")).toBeVisible();
    await expect(page.getByText("Preencha seus dados")).toBeVisible();

    await page.getByRole("button", { name: "Confirmar Pedido" }).click();
    await expect(page.getByText("Informe seu nome.")).toBeVisible();

    await page.getByPlaceholder("Seu nome").fill("Maria Teste");
    await page.getByRole("button", { name: "Confirmar Pedido" }).click();
    await expect(page.getByText("Informe um WhatsApp válido")).toBeVisible();
  });

  test("fluxo completo de compra: produto → checkout → confirmação", async ({ page }) => {
    await mockPedidosApi(page);
    await page.goto("/produtos");

    const productLink = page.locator('a[href^="/produtos/"]').first();
    const productVisible = await productLink.isVisible().catch(() => false);
    if (!productVisible) {
      test.skip(true, "Nenhum produto encontrado — execute `npm run db:seed` e adicione produtos no admin");
    }

    await productLink.click();
    await page.waitForURL(/\/produtos\/.+/);

    await page.getByRole("button", { name: "Comprar pelo WhatsApp" }).click();
    await expect(page.getByText("Finalizar Pedido")).toBeVisible();
    await expect(page.getByPlaceholder("Seu nome")).toBeVisible();

    await page.getByPlaceholder("Seu nome").fill("Maria Teste");
    await page.getByPlaceholder("61999999999").fill("61999999999");

    await page.getByRole("button", { name: "Confirmar Pedido" }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByText("Pedido Confirmado!")).toBeVisible();
    await expect(page.getByText("PED-9999")).toBeVisible();
    await expect(page.getByText("R$ 89,90")).toBeVisible();
    await expect(page.getByText("Aguardando pagamento")).toBeVisible();
    await expect(page.getByText("jgabrielcastro04@gmail.com")).toBeVisible();
    await expect(page.getByRole("button", { name: "Falar no WhatsApp" })).toBeVisible();

    const whatsappButton = page.getByRole("button", { name: "Falar no WhatsApp" });
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      whatsappButton.click(),
    ]);
    expect(newPage.url()).toContain("wa.me/");
    expect(newPage.url()).toContain("PED-9999");
    expect(newPage.url()).toContain("89,90");
  });
});
