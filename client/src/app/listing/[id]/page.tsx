import React, { Suspense } from "react";
import ProductDetailsContent from "./productDetailsContent";
import ProductDetailsSkeleton from "./productSkeleton";

type Props = {
  params: Promise<{ id: string }>;
};

const ProductDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent id={id} />
    </Suspense>
  );
};

export default ProductDetailsPage;
