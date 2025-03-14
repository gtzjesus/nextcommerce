// components/Header.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import useBasketStore from '../../store/store'; // Import custom store for basket items
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import AuthButtons from './AuthButtons'; // Import the AuthButtons component
import CartButton from './CartButton'; // Import CartButton
import SearchButton from './SearchButton';

const Header = () => {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  // States for managing various UI features
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  const pathname = usePathname();

  // Client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll and resize event handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => setScrolled(window.scrollY > 50);
      const handleResize = () => setWindowWidth(window.innerWidth);

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // Close menu on desktop or when pathname changes
  useEffect(() => {
    if (windowWidth >= 648) setIsMenuOpen(false);
  }, [windowWidth]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Disable body scrolling when the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  if (!isMounted) return null; // Prevent rendering on server-side

  return (
    <header
      className={`${scrolled ? 'bg-pearl shadow-lg' : 'bg-transparent'} fixed top-0 z-20 flex items-center px-3 py-3 w-full`}
    >
      <div className="flex w-full items-center justify-between">
        {/* Left side: Logo and Company Name */}
        <div className="flex items-center space-x-4 flex-1">
          <Link href="/" className="font-bold cursor-pointer sm:mx-0 sm:hidden">
            <Image
              src={scrolled ? '/icons/logo.webp' : '/icons/logo-white.webp'}
              alt="nextcommerce"
              width={30}
              height={30}
              className="w-8 h-8"
            />
          </Link>
          <div className="hidden sm:flex items-center space-x-2">
            <Image
              src={scrolled ? '/icons/logo.webp' : '/icons/logo-white.webp'}
              alt="nextcommerce"
              width={30}
              height={30}
              className=""
            />
            <span
              className={`barlow-condensed-regular text-md ${scrolled ? 'text-black' : 'text-white'}`}
            >
              Nextcommerce
            </span>
          </div>
        </div>

        {/* Right side: Search , Cart and Auth Buttons */}
        <div className="flex items-center">
          <SearchButton scrolled={scrolled} />
          <CartButton itemCount={itemCount} scrolled={scrolled} />
          <div
            className={`hidden sm:flex items-center ${scrolled ? 'text-black' : 'text-white'}`}
          >
            <AuthButtons user={user} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="sm:hidden flex flex-col justify-center items-center space-y-1 z-30 relative group"
        >
          {/* Top Bar (first line) */}
          <div
            className={`w-7 h-0.5 ${scrolled ? 'bg-black' : 'bg-white'} transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}
          />

          {/* Bottom Bar (third line) */}
          <div
            className={`w-7 h-0.5 ${scrolled ? 'bg-black' : 'bg-white'} transition-all duration-300 ease-in-out transform ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-90 z-10 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />
      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-0 h-full w-full shadow-xl z-20 transform transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-3.5 right-8 text-lg text-white"
        >
          {isMenuOpen ? '' : <span className="text-white"></span>}
        </button>
        <div className="flex flex-col items-center justify-center h-full p-16 space-y-6">
          <div className="flex flex-col items-center space-y-4 text-white text-2xl">
            <AuthButtons user={user} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
