# Especificação de Projeto — Catálogo Online de Artigos Religiosos

> Documento de referência para uso com Claude Code. Objetivo: servir como briefing único para guiar o desenvolvimento do início ao fim, mantendo consistência de design, dados e funcionalidades.

---

## 1. Visão Geral

Site de **catálogo digital** para uma loja de artigos religiosos. Não é e-commerce com checkout/pagamento — a venda é finalizada via **WhatsApp**. O site existe para:

- Apresentar os produtos de forma bonita, clara e confiável;
- Deixar o cliente saber **na hora** o que está disponível e o que está esgotado;
- Permitir que o **dono da loja** cadastre/edite produtos sem ajuda técnica;
- Gerar contato direto e fácil via WhatsApp para fechar a venda.

**Não-objetivos (fora do escopo):** carrinho de compras, pagamento online, frete, contas de cliente, avaliações/reviews.

---

## 2. Stack Tecnológica Sugerida

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15+ (App Router, fullstack — páginas + API routes/Server Actions no mesmo projeto) |
| Linguagem | TypeScript |
| Banco de dados | PostgreSQL |
| ORM | Prisma |
| Estilização | Tailwind CSS |
| Upload/armazenamento de imagens | Cloudinary |
| Autenticação do admin | NextAuth.js (credentials) ou solução simples com JWT + cookie httpOnly |
| Hospedagem | Vercel (frontend/app) + banco em Neon ou Render Postgres |

> Essa stack é deliberadamente próxima dos seus outros projetos (SiteSaude, ToDone), só que num único projeto Next.js em vez de front+back separados — reduz a complexidade de deploy para um site desse tamanho.

---

## 3. Estrutura de Páginas (Área Pública)

### 3.1 Home (`/`)
A página de maior impacto visual e emocional. Seções sugeridas, em ordem:

1. **Hero** — frase de acolhimento + imagem/elemento temático (vela, terço, vitral, luz suave) + CTA "Ver Catálogo".
2. **Categorias em destaque** — cards clicáveis (ex.: Terços e Rosários, Imagens e Estátuas, Bíblias, Decoração, Acessórios).
3. **Produtos em destaque / Mais procurados** — carrossel ou grid com 4-8 produtos selecionados pelo dono.
4. **Bloco de confiança/conforto** — texto curto sobre a loja, tempo de existência, missão, atendimento humano via WhatsApp.
5. **Como funciona** — 3 passos simples: "Veja o catálogo → Escolha o produto → Fale com a gente no WhatsApp". Isso resolve diretamente seu pedido de clareza/instrução.
6. **Botão flutuante de WhatsApp** — fixo no canto inferior direito, em todas as páginas.
7. **Footer** — endereço (se físico), horário de atendimento, redes sociais, WhatsApp, links rápidos.

### 3.2 Catálogo (`/produtos`)
- Grid de produtos com **filtros**: categoria, disponibilidade (em estoque / esgotado), faixa de preço.
- **Busca por nome**.
- Cada card mostra: imagem, nome, preço, selo de status ("Disponível" / "Esgotado").
- Produtos esgotados aparecem (não desaparecem) mas com selo visual diferenciado e desabilitados para "comprar" — isso é exatamente o que você pediu: cliente sempre sabe o catálogo completo.
- Paginação ou scroll infinito (defina com o Claude Code; para poucos produtos, paginação simples já resolve).

### 3.3 Página de Produto (`/produtos/[slug]`)
- Galeria de imagens (principal + miniaturas).
- Nome, categoria, preço, descrição completa.
- Selo de estoque bem visível.
- Botão grande **"Comprar pelo WhatsApp"** → abre WhatsApp com mensagem pré-preenchida (ex.: *"Olá! Gostaria de saber mais sobre o produto: [Nome do Produto] - R$ [Preço]"*).
- Produtos relacionados (mesma categoria) no final.

### 3.4 Sobre / Contato (`/sobre` ou seção no footer)
- História da loja, horário de funcionamento, endereço (se houver loja física), mapa (opcional), redes sociais, WhatsApp.

### 3.5 Navegação
- Header fixo (sticky) com logo, menu (Home, Catálogo, Categorias, Sobre/Contato) e botão WhatsApp.
- No mobile: menu hambúrguer com transição suave; botão de WhatsApp sempre visível e fácil de tocar (mínimo 44x44px de área de toque).

---

## 4. Painel Administrativo (`/admin`)

Acesso restrito (login). Funcionalidades:

### 4.1 Login
- Tela simples de e-mail + senha.
- Sessão persistente (cookie), proteção de todas as rotas `/admin/*`.

### 4.2 Dashboard inicial
- Total de produtos, quantos em estoque, quantos esgotados — visão rápida.

### 4.3 CRUD de Produtos
Formulário de cadastro/edição com:

| Campo | Tipo | Observação |
|---|---|---|
| Código | gerado automaticamente | sequencial, ex: `0001`, `0002` — usado nas mensagens de WhatsApp em vez do id interno |
| Nome | texto | obrigatório |
| Slug | texto | gerado automaticamente a partir do nome |
| Descrição | textarea (rich text opcional) | obrigatório |
| Preço | número (decimal) | obrigatório, formatado em R$ |
| Categoria | select (relacionada a tabela Categoria) | obrigatório |
| Imagens | upload múltiplo (Cloudinary) | mínimo 1, suporte a várias |
| Status de estoque | toggle/select: "Disponível" / "Esgotado" | obrigatório, fácil de alternar rapidamente |
| Destaque na home | checkbox | opcional |
| Ativo/Inativo | toggle | permite "esconder" produto sem deletar |

- Listagem de produtos em tabela com busca, filtro por categoria/status, e ação rápida de alternar "Disponível/Esgotado" direto na lista (sem precisar abrir o produto) — pensando na praticidade do dono.
- Exclusão com confirmação.

### 4.4 CRUD de Categorias
- Nome, slug, imagem de capa (opcional) — usadas nos cards da home.

---

## 5. Modelo de Dados (rascunho Prisma)

```prisma
model Categoria {
  id        String    @id @default(cuid())
  nome      String
  slug      String    @unique
  imagemUrl String?
  produtos  Produto[]
  createdAt DateTime  @default(now())
}

model Produto {
  id           String      @id @default(cuid())
  codigo       String      @unique // código curto e legível, ex: "0001", "0002" — exibido ao cliente em vez do id
  nome         String
  slug         String      @unique
  descricao    String
  preco        Decimal     @db.Decimal(10, 2)
  status       StatusEstoque @default(DISPONIVEL)
  destaque     Boolean     @default(false)
  ativo        Boolean     @default(true)
  categoriaId  String
  categoria    Categoria   @relation(fields: [categoriaId], references: [id])
  imagens      Imagem[]
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

model Imagem {
  id        String   @id @default(cuid())
  url       String
  produtoId String
  produto   Produto  @relation(fields: [produtoId], references: [id], onDelete: Cascade)
  ordem     Int      @default(0)
}

enum StatusEstoque {
  DISPONIVEL
  ESGOTADO
}

model Admin {
  id       String @id @default(cuid())
  email    String @unique
  senha    String // hash (bcrypt)
}
```

---

## 6. Integração WhatsApp e Lista de Orçamento

A compra é sempre finalizada no WhatsApp, mas o cliente pode escolher **um ou vários produtos** antes de enviar a mensagem. Para isso, existe uma "Lista de Orçamento" temporária (não é um carrinho de compras real — não tem checkout nem pagamento, serve só para montar a mensagem final).

### 6.1 Adicionando itens

- Na **página do produto**: seletor de quantidade (botões `-` / `+`, mínimo 1, desabilitado se "Esgotado") + botão **"Adicionar à lista"**.
- Opcional (recomendado para agilizar): também permitir adicionar direto pelo **card do produto no catálogo**, com quantidade padrão 1 (o cliente ajusta depois, se quiser).
- Um ícone fixo (ex: "📋" ou sacola, ao lado do botão de WhatsApp) mostra a **quantidade de itens na lista** e abre um drawer/modal lateral com o resumo.

### 6.2 Drawer/Modal da Lista
Mostra cada item: nome, código, quantidade (editável), botão de remover. No final, botão **"Enviar orçamento via WhatsApp"**.

- Estado guardado com **Zustand + persist (localStorage)** — sobrevive a navegação e a recarregar a página, mas não precisa de banco de dados.
- Lista esvazia automaticamente depois de enviar (ou manualmente pelo cliente).

### 6.3 Compra direta de 1 item (sem passar pela lista)
Se o cliente está na página do produto e quer só aquele item, pode clicar direto em **"Comprar via WhatsApp"** — isso ignora a lista e abre o WhatsApp imediatamente com a mensagem de item único.

### 6.4 Templates de mensagem

**Um item:**
```
Bom dia! Gostaria de realizar a compra do seguinte produto:

#0001 - Terço de Madeira: 2 unidades

Poderia me fazer o orçamento desta compra?
```

**Múltiplos itens (vindo da lista):**
```
Bom dia! Gostaria de realizar a compra dos seguintes itens:

• #0001 - Terço de Madeira: 2 unidades
• #0014 - Bíblia Sagrada Capa Dura: 1 unidade

Poderia me fazer o orçamento desta compra?
```

### 6.5 Implementação técnica

```ts
function montarLinkWhatsapp(itens: { codigo: string; nome: string; quantidade: number }[]) {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO; // ex: 5599999999999

  const corpo =
    itens.length === 1
      ? `Bom dia! Gostaria de realizar a compra do seguinte produto:\n\n#${itens[0].codigo} - ${itens[0].nome}: ${itens[0].quantidade} unidades\n\nPoderia me fazer o orçamento desta compra?`
      : `Bom dia! Gostaria de realizar a compra dos seguintes itens:\n\n${itens
          .map((i) => `• #${i.codigo} - ${i.nome}: ${i.quantidade} unidades`)
          .join("\n")}\n\nPoderia me fazer o orçamento desta compra?`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(corpo)}`;
}
```

- O número da loja fica em variável de ambiente — fácil trocar sem alterar código.
- O botão flutuante global (presente em todas as páginas) usa mensagem genérica de saudação, sem itens.
- `encodeURIComponent` já cuida da codificação de quebras de linha, acentos e espaços — não precisa montar isso manualmente.

---

## 7. Diretrizes de Design e UX

**Tema:** religiosidade transmitida com acolhimento, não com peso. Evitar visual "datado"/genérico de loja de artigos religiosos antiga — buscar algo moderno, clean, com toques de elegância espiritual.

- **Paleta sugerida:** tons terrosos/dourados (dourado suave, marfim, bege) combinados com uma cor de destaque (azul profundo, vinho ou verde oliva) — transmite tradição sem parecer pesado. Evitar excesso de cores saturadas.
- **Tipografia:** uma serifada elegante para títulos (transmite tradição/conforto) + uma sans-serif limpa para corpo de texto (legibilidade).
- **Elementos visuais temáticos:** texturas suaves (papel, luz, vitral), ícones de linha fina (vela, terço, pomba, folhas), sem exagero — o produto é o protagonista visual.
- **Microinterações:** transições suaves ao passar o mouse/tocar nos cards, fade-in sutil ao rolar a página, sem efeitos exagerados que distraiam.
- **Clareza acima de tudo:** hierarquia visual óbvia, CTAs (botões de ação) sempre destacados, nunca mais de uma ação principal por seção.

### Responsividade (prioridade mobile)
- Mobile-first: desenhar primeiro para tela pequena, depois expandir.
- Grid de produtos: 1 coluna no mobile, 2 em tablet, 3-4 em desktop.
- Botão de WhatsApp sempre acessível com o polegar (canto inferior, tamanho de toque generoso).
- Menu hambúrguer com animação suave, fácil de fechar.
- Imagens otimizadas (Next.js `Image`) para carregamento rápido em conexões mais lentas.

---

## 8. Fluxos de Usuário (resumo)

**Cliente:**
Home → vê destaques/categorias → entra no Catálogo → filtra/busca → abre produto → confere se está disponível → clica em "Comprar pelo WhatsApp" → conversa finalizada fora do site.

**Dono da loja:**
Login no `/admin` → vê dashboard → cadastra/edita produto (nome, preço, imagens, descrição) → marca como disponível/esgotado → produto aparece/atualiza automaticamente no catálogo público.

---

## 9. Requisitos Não Funcionais

- **Performance:** imagens otimizadas, carregamento rápido mesmo em 3G/4G.
- **SEO básico:** meta tags por página, dados estruturados de produto (schema.org/Product) para aparecer melhor no Google.
- **Acessibilidade:** contraste adequado, textos alternativos em imagens, navegação por teclado no admin.
- **Segurança:** rotas `/admin` protegidas por autenticação; sanitização de inputs; senha com hash (bcrypt).

---

## 10. Fases de Desenvolvimento Sugeridas

1. **Setup do projeto** — Next.js + TypeScript + Tailwind + Prisma + conexão com PostgreSQL.
2. **Modelagem de dados** — schema Prisma, migrations.
3. **Painel admin** — autenticação + CRUD de categorias e produtos + upload Cloudinary.
4. **Área pública** — Home, Catálogo (com filtros/busca), Página de Produto.
5. **Integração WhatsApp** — botão flutuante global + lista de orçamento (Zustand/persist) + botões de compra direta e múltipla nos produtos.
6. **Polimento visual e responsividade** — ajustes finos de design, animações, mobile.
7. **SEO + performance + deploy** (Vercel).

---

## 11. Prompt Inicial Sugerido para o Claude Code

> Use isso como primeira instrução ao abrir o projeto no Claude Code, ajustando o que quiser:

```
Quero criar um site de catálogo online para uma loja de artigos religiosos.
Stack: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Prisma + PostgreSQL.
Imagens armazenadas no Cloudinary. Sem checkout — a compra é finalizada via WhatsApp.

Comece criando a estrutura do projeto e o schema do Prisma com os models
Categoria, Produto (com campo de código curto sequencial, ex: 0001), Imagem
e Admin (estrutura completa em anexo/abaixo).
Depois crie o painel administrativo com autenticação simples e CRUD de produtos
(incluindo upload de múltiplas imagens e alternância rápida de status
disponível/esgotado).

A compra é finalizada via WhatsApp. O cliente pode comprar 1 item direto da
página do produto, ou adicionar vários produtos a uma "lista de orçamento"
temporária (Zustand + persist em localStorage, sem checkout/pagamento) e
enviar tudo numa única mensagem formatada para o WhatsApp.

Design: tema religioso moderno e acolhedor, paleta dourado/terroso com uma cor
de destaque, tipografia serifada nos títulos e sans-serif no corpo, mobile-first,
com botão flutuante de WhatsApp em todas as páginas.
```

---

**Observação final:** este documento cobre o "o quê" e o "porquê". Ao trabalhar com o Claude Code, vale ir módulo por módulo (como você já faz no projeto da dashboard de estatística) — peça primeiro o schema + setup, depois o admin, depois o público, depois o visual. Isso evita que o Claude Code tente fazer tudo de uma vez e perca consistência.