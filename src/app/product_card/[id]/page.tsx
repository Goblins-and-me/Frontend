export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { first, second } = {
    first: "hi",
    second: "by"
  }

  return (
    <div>
      <p>{ id } product_card works</p>
    </div>
  )
}
