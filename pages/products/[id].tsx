import { Product, Review, User } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import prisma from '../../db';
import { ProductWithReviewCount } from './../';
import Reviews from './../../components/Reviews';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
//find the first record match the condition in "where" cause id is already unique: WHERE id = id, but context.query.id would be a string[] | string | undefined 
//so we clarify by WHERE id = id as string
  const product = await prisma.product.findFirst({
    where: {
      id: {
        equals: id as string
      }
    },
    include: {
      reviews: {  //when get a product, get(include) reviews under it
        include: {
          user: true //get review together with its creator
        }
      }
    }
  });

  return {
    props: { 
        product, 
        reviews: product ? product.reviews : [] 
    }
  };
};

interface ProductsProps {
  product: Product & ProductWithReviewCount;
  reviews: (Review & { user: User })[];
}

const Products = (props: ProductsProps) => {
  const [reviews, setReviews] = useState(props.reviews);
  return (
    <div>
      <Head>
        <title>{props.product.name} | Threadz</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="grid grid-cols-3 gap-10">
        <section className="col-span-2">
          <ProductCard product={props.product} usePurchaseButton />
        </section>
        <section className="w-3/4">
          <Reviews
            reviews={reviews}
            productId={props.product.id}
            onAddReview={(review: Review & { user: User }) => {
              setReviews([...reviews, review]);
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default Products; 