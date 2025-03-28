import { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Axios for making API requests
import { debounce } from 'lodash'; // Debounce function to limit API calls
import Loader from '../common/Loader';

interface SearchBarProps {
  scrolled: boolean;
  isSearchMenuOpen: boolean; // Pass this prop to control when to focus the input
}

const SearchBar: React.FC<SearchBarProps> = ({
  scrolled,
  isSearchMenuOpen,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]); // Store search suggestions
  const [selectedIndex, setSelectedIndex] = useState<number>(-1); // Track selected suggestion
  const [loading, setLoading] = useState<boolean>(false); // Track loading state
  const [noResults, setNoResults] = useState<boolean>(false); // Track if no results are found
  const inputRef = useRef<HTMLInputElement>(null); // Create a reference for the input field

  // Default suggestions (mock data) to display when the input is empty
  const defaultSuggestions = ['jewel', 'pant', 'shirt'];

  // API call function for fetching search suggestions
  const fetchSuggestions = async (query: string) => {
    try {
      if (query.trim()) {
        setLoading(true); // Set loading to true before starting the API request
        // Replace with your API URL and query parameter (e.g., `q` for search query)
        const response = await axios.get('/api/search-suggestions', {
          params: { query },
        });

        // Set the suggestions state to the response data
        if (response.data.suggestions.length === 0) {
          setNoResults(true); // Set noResults to true if no suggestions are returned
        } else {
          setNoResults(false); // Reset noResults if there are suggestions
        }
        setSuggestions(response.data.suggestions);
      } else {
        setSuggestions([]); // Clear suggestions if query is empty
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]); // Clear suggestions in case of an error
    } finally {
      setLoading(false); // Set loading to false once the request finishes
    }
  };

  // Debounced version of the API call function
  const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

  // Handle search input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Call the debounced fetchSuggestions function
    debouncedFetchSuggestions(value);

    setSelectedIndex(-1); // Reset selected index when typing
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirect to the search results page or trigger an API search
      window.location.href = `/search?q=${query}`;
    }
  };

  // Clear the input
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setNoResults(false); // Reset noResults state when clearing input
  };

  // Handle selection of suggestion
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]); // Clear suggestions when a suggestion is selected
    // Manually redirect to the search page with the selected suggestion
    window.location.href = `/search?q=${suggestion}`;
  };

  // Handle key navigation through suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) =>
        Math.min(suggestions.length - 1, prevIndex + 1)
      );
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      }
    }
  };

  // Focus input when search menu opens
  useEffect(() => {
    if (isSearchMenuOpen && inputRef.current) {
      inputRef.current.focus(); // Automatically focus the input when the search menu opens
    }
  }, [isSearchMenuOpen]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearchSubmit} className="flex flex-col w-full">
        <h1
          className={`text-sm font-semibold mb-2 ${scrolled ? 'text-black' : 'text-black'}`}
        >
          what are you looking for?
        </h1>
        <div className="relative flex items-center w-full bg-white shadow-md">
          <input
            ref={inputRef}
            type="text"
            placeholder=""
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown} // Listen for key events
            className="w-full p-4 text-gray-800 border-b-2 border-white focus:border-white focus:outline-none transition-all duration-300 pr-10 text-base"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Loader */}
      {loading && <Loader />}

      {/* Display No Results Message */}
      {noResults && !loading && (
        <div className="uppercase text-xs font-semibold mb-2 mt-4 ${scrolled ? 'text-black' : 'text-black '">
          sorry, we couldn&lsquo;t find any matching results for your query.
        </div>
      )}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 || query.trim() === '' ? (
        <ul className="absolute w-full mt-4 z-20 max-h-60 overflow-auto">
          <h1
            className={`text-xs font-semibold mb-2 mt-4 ${scrolled ? 'text-black' : 'text-black'}`}
          >
            trending searches
          </h1>
          {/* Display the default suggestions if query is empty */}
          {(query.trim() === '' ? defaultSuggestions : suggestions).map(
            (suggestion, index) => (
              <li
                key={suggestion}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={`cursor-pointer px-2 py-2 text-xs text-gray-700 hover:none ${
                  selectedIndex === index ? 'bg-gray-200' : ''
                }`}
                style={{
                  textDecoration: 'underline', // Apply underline style
                }}
              >
                {suggestion}
              </li>
            )
          )}
        </ul>
      ) : null}
    </div>
  );
};

export default SearchBar;
