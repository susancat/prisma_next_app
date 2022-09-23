import { Product } from '@prisma/client';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import prisma from './../db';

export default function Home(props: HomeProps) {
  // console.log(props.products);//will fetch product data from DB
  return (
    <div>
      <Head>
        <title>Threadz</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {props.products.map((product, i: number) => (
          <ProductCard product={product} key={i} />
        ))}
      </div>
    </div>
  );
}
//import type Product from node_module which created with models, and create a new type which represent a 1:M relation between product and reviews
export type ProductWithReviewCount = Product & { _count: { reviews: number } };

//if you don't include relation between product and review, you can just use products:product[] below; and in the getSSP,product = await prisma.products.findMany()
interface HomeProps {
  products: ProductWithReviewCount[];
}
//here you can choose to use Apllo or graghQL but it's tricky to understand which is best to use
//here it skip to use an endpoint from /api, it interact with DB directly, that's an Next magic
export async function getServerSideProps() { 
  try {
    const products = await prisma.product.findMany({
      include: {
        _count: {
          select: { reviews: true }
        }
      }
    });

    return {
      props: { products }
    };
  } catch (err) {
    console.log(err);
  }
}
