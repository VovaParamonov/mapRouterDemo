import { request } from "./utils";

export const getCategories = async () => {
  const { data } = await request().get('/categories/get' );

  console.log(data);

  return data.data;
}