import { productService } from "@/services";
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product";
import { priceFormatterWithCurrency } from "@/utils";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Stripe from "stripe";
import Image from 'next/image'

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: string;
  }
}

export default function Product({ product }: ProductProps) {
  const { isFallback } = useRouter()

  if(isFallback) {
    return <p>Loading...</p>
  }



  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>
      <ProductDetails>
        <h1>{ product.name}</h1>
        <span>{ product.price}</span>

        <span>
          { product.description}
        </span>

        <button>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true
  }
}

export  const getStaticProps: GetStaticProps<any, {id: string}> = async ( { params }) => {

  if(!params) return { props: {} }

  const productId = params.id

  const data = await productService.fetchProductById(productId)
  const price = data.default_price as Stripe.Price

  const product = {
    id: data.id,
    name: data.name,
    description: data.description,
    imageUrl: data.images[0],
    price: priceFormatterWithCurrency.format((price.unit_amount as number) / 100)
  }

  return {
    props: { product },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}