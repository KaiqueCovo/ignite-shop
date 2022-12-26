import Stripe from "stripe";
import { stripe } from "./stripe";

class ProductService {
  async fetchAll(): Promise<Stripe.Product[]> {
    const { data } = await stripe.products.list({
      expand: ["data.default_price"],
    });

    return data;
  }

  async fetchProductById(productId: string): Promise<Stripe.Product> {
    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price']
    })

    return product
  }
}

export const productService = new ProductService();
