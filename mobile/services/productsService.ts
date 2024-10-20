import ecommerceApi from "./api";

const productsService = {
  getProducts: async () => {
    const { data } = await ecommerceApi.get("/products");
    return data;
  },
  getProduct: async (id: string) => {
    const { data } = await ecommerceApi.get(`/products/${id}`);
    return data;
  },
} as const;

export default productsService;
