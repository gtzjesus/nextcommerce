import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';

export const getAllProducts = async () => {
  const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == 'product'] | order(name asc)
  `);
  try {
    // use sanityFetch to send the query
    const products = await sanityFetch({ query: ALL_PRODUCTS_QUERY });

    // return list of products (empty array if none)
    return products.data || [];
  } catch (error) {
    console.error('Error fetching all products', error);
    return [];
  }
};