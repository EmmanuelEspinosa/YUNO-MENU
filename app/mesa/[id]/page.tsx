import MesaClient from "@/components/MesaClient";

export default async function MesaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MesaClient mesaId={id} />;
}
