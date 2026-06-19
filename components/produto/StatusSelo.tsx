interface Props {
  status: "DISPONIVEL" | "ESGOTADO";
  tamanho?: "sm" | "md";
}

export function StatusSelo({ status, tamanho = "sm" }: Props) {
  const base = tamanho === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  if (status === "DISPONIVEL") {
    return (
      <span className={`${base} rounded-full bg-green-100 text-green-700 font-medium border border-green-200`}>
        Disponível
      </span>
    );
  }

  return (
    <span className={`${base} rounded-full bg-red-50 text-red-500 font-medium border border-red-100`}>
      Esgotado
    </span>
  );
}
