export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <p>{ id } product_card works</p>
    </div>
  )
}
