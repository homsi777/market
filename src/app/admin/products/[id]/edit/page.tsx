import AdminProductCurrencyForm from "../../../../AdminProductCurrencyForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminProductCurrencyForm editId={id} />;
}
