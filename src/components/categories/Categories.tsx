import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImage, Category } from '@/types'; // Make sure to import SanityImage and Category from the correct path

// Initialize the image URL builder for Sanity
const builder = imageUrlBuilder(client);

// Function to generate image URL from Sanity
function urlFor(source: SanityImage) {
  return builder.image(source);
}

// Helper function to capitalize the first word of a string
function capitalizeFirstWord(text: string) {
  const words = text.split(' ');
  if (words.length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1); // Capitalize first word
  }
  return words.join(' ');
}

// Define the props for the Categories component, which expects an array of Category objects
interface CategoriesProps {
  categories: Category[];
}

const Categories = ({ categories }: CategoriesProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h2 className="barlow-condensed-regular text-2xl tracking-very-wide font-semibold text-center text-black pb-4">
        Our Collection
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.slug.current}`}
          >
            <div className="flex flex-col items-center bg-transparent shadow-md p-4 bg-white">
              <Image
                src={
                  category.image
                    ? urlFor(category.image).width(200).height(200).url() // Generate image URL with Sanity image URL builder
                    : '/default-image.jpg' // Fallback image if no category image
                }
                alt={category.title}
                width={200}
                height={200}
                className="object-cover mb-4"
                priority={true}
              />
              <h3 className="barlow-condensed-regular  text-md tracking-very-wide font-light text-center text-black py-2">
                {capitalizeFirstWord(category.title)}{' '}
                {/* Capitalize the first word of the title */}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
