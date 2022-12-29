import axios from "axios";

class CheckoutService {
  async fetchCheckoutURL(priceId: string): Promise<string> {
    const { data } = await axios.post<{ checkoutUrl: string}>('/api/checkout', {
      priceId
    })

    const { checkoutUrl } = data

    return checkoutUrl
  }
}

export const checkoutService = new CheckoutService();
