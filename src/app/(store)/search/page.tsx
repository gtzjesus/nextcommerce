// app/(store)/search/page.tsx

import Header from '@/components/header';
import ProductGrid from '@/components/ProductGrid';
import { searchProductsByName } from '@/sanity/lib/products/searchProductsByName';

// SearchPage Component that expects resolved searchParams
const SearchPage = async ({
  searchParams,
}: {
  searchParams: { q: string };
}) => {
  const { q } = searchParams;

  // Fetch products based on the query parameter
  const products = await searchProductsByName(q);
  const resultCount = products.length;

  if (resultCount === 0) {
    return (
      <div>
        <Header />
        <h1 className="text-xl font-bold mb-10 mt-20 text-center">
          No results were found for &ldquo;{q}&rdquo;
        </h1>
        <p className="text-gray-600 text-center">
          Please try a different search.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <h1 className="text-xl font-bold mb-10 mt-20 text-center">
        &ldquo;{q}&rdquo; ({resultCount} results)
      </h1>
      <ProductGrid products={products} />
    </div>
  );
};

// Wrapper Component to resolve searchParams (Promise) before passing to SearchPage
const SearchPageWrapper = async ({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>; // Accepting a Promise here
}) => {
  // Resolve the Promise before passing to SearchPage
  const resolvedSearchParams = await searchParams;

  // Pass resolvedParams to the SearchPage component
  return <SearchPage searchParams={resolvedSearchParams} />;
};

// Default export of the wrapper
export default SearchPageWrapper;
