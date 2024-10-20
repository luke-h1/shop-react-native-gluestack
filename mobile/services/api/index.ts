import axios from "axios";

const ecommerceApi = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});
export default ecommerceApi;
