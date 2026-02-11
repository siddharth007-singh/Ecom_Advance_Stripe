import React, { Suspense } from 'react';
import ProductDetailsContent from './productDetailsContent';
import ProductDetailsSkeleton from './productSkeleton';

type Props = {
  params: { id: string };
};

const ProductDetailsPage = ({ params }: Props) => {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent id={params.id} />
    </Suspense>
  );
};

export default ProductDetailsPage;
