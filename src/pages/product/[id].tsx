import { productService } from "@/services";
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product";
import { priceFormatterWithCurrency } from "@/utils";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Stripe from "stripe";
import Image from 'next/image'
import { useState } from "react";
import { checkoutService } from "@/services/stripe/checkout";
import Head from "next/head";

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: string;
    defaultPriceId: string;
  }
}

export default function Product({ product }: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)
  const { isFallback } = useRouter()

  if(isFallback) {
    return <p>Loading...</p>
  }

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true)

      const checkoutUrl = await checkoutService.fetchCheckoutURL(product.defaultPriceId)

      window.location.href = checkoutUrl
    } catch(err) {
      setIsCreatingCheckoutSession(false)
      alert('Falha ao redirecionar ao checkout!')
    }
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

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

        <button disabled={isCreatingCheckoutSession} onClick={handleBuyProduct}>
          Comprar agora
        </button>
      </ProductDetails>
    </ProductContainer>
    </>
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
    price: priceFormatterWithCurrency.format((price.unit_amount as number) / 100),
    defaultPriceId: price.id
  }

  return {
    props: { product },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}