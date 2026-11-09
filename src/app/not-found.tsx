import type { Metadata } from "next";
import NaoEncontrada from "@/components/layout/NaoEncontrada";

export const metadata: Metadata = { title: "Página não encontrada | GV5 Assessoria", robots: { index: false } };

export default function PaginaNaoEncontrada() {
  return <NaoEncontrada />;
}
