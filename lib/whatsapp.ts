export interface ItemOrcamento {
  codigo: string;
  nome: string;
  quantidade: number;
}

export function montarLinkWhatsapp(itens: ItemOrcamento[]): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;

  const corpo =
    itens.length === 1
      ? `Bom dia! Gostaria de realizar a compra do seguinte produto:\n\n#${itens[0].codigo} - ${itens[0].nome}: ${itens[0].quantidade} ${itens[0].quantidade === 1 ? "unidade" : "unidades"}\n\nPoderia me fazer o orçamento desta compra?`
      : `Bom dia! Gostaria de realizar a compra dos seguintes itens:\n\n${itens
          .map(
            (i) =>
              `• #${i.codigo} - ${i.nome}: ${i.quantidade} ${i.quantidade === 1 ? "unidade" : "unidades"}`
          )
          .join("\n")}\n\nPoderia me fazer o orçamento desta compra?`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(corpo)}`;
}

export function montarLinkWhatsappGenerico(): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;
  const corpo = "Bom dia! Gostaria de saber mais sobre os produtos da loja.";
  return `https://wa.me/${numero}?text=${encodeURIComponent(corpo)}`;
}
