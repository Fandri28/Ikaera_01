'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Image from 'next/image';
import Footer from './footer';
import { Rating } from '@mui/material';
import { Comment, Etoile, Formation, Utilisateur } from './details/[id]/Interface';
import { Card, CardContent, Typography, Grid, Dialog, DialogContent, Avatar, TextField } from '@mui/material';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Services: React.FC = () => {
  const [products, setProducts] = useState<Formation[]>([]);
  const [stars, setStars] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // State to handle loading


  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [comment, setComments] = useState<Comment[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const urlapi = "http://localhost:5000";
  const router = useRouter(); // Using useRouter for navigation
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;


  // Function to fetch data from the API
  const fetchFormations = async () => {
    try {
      const ap = urlapi;
      const response = await fetch(`${ap}/api/formations`); // Fetch from the API
      const data = await response.json();
      setProducts(data); // Update products state
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
    }
  };

  // Function to fetch data from the API etoile
  const fetchEtoile = async () => {
    try {
      const ap = urlapi;
      const response = await fetch(`${ap}/api/stars`); // Fetch from the API
      const data = await response.json();
      console.log(data)
      setStars(data); // Update products state
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
    }
  };
  // Function to fetch data from the API etoile
  const fetchComments = async () => {
    try {
      const ap = urlapi;
      const response = await fetch(`${ap}/api/comments`); // Fetch from the API
      const data = await response.json();
      setComments(data); // Update products state
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
    }
  };
  // Function to fetch data from the API etoile
  const fetchUsers = async () => {
    try {
      const ap = urlapi;
      const response = await fetch(`${ap}/api/utilisateurs`); // Fetch from the API
      const data = await response.json();
      setUsers(data); // Update products state
      console.log(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des formations:', error);
    }
  };


  useEffect(() => {
    fetchFormations(); // Fetch data on mount
    fetchEtoile(); // Fetch data on mount
    fetchComments(); // Fetch data on mount
    fetchUsers();
    setLoading(false)
  }, []);

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
    router.push(`/services/details/${product.id}`); // Navigate to details page
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (carousel) {
      const scrollAmount = carousel.clientWidth / 2;
      const newScrollLeft = direction === 'left' ? carousel.scrollLeft - scrollAmount : carousel.scrollLeft + scrollAmount;

      carousel.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScrollVisibility = () => {
      const carousel = carouselRef.current;
      if (carousel) {
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        setShowLeftArrow(carousel.scrollLeft > 0);
        setShowRightArrow(carousel.scrollLeft < maxScrollLeft);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScrollVisibility);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScrollVisibility);
      }
    };
  }, []);


  const [visibleComments, setVisibleComments] = useState<number>(2);

  // Show more comments by increasing the number of visible comments
  const showMoreComments = () => {
    setVisibleComments((prev) => prev + 2); // Increase by 2 on each click
  };


  if (loading) {
    return (
      <div className="h-screen px-5 md:px-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Quelle formation vous intéresse-t-elle ?
        </h2>
        <div className="relative flex items-center h-auto p-9 m-2 bg-white rounded shadow-[0_0_2px_4px_rgba(0,0,0,0.25)]">
          {showLeftArrow && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
            >
              &#8249;
            </button>
          )}

          <div ref={carouselRef} className="flex space-x-4 w-full h-full overflow-x-auto scrollbar-hide">
            {/* Skeleton loader for carousel items */}
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 h-auto w-72 flex flex-col items-center justify-between cursor-pointer shadow-lg transition duration-300 ease-in-out transform border border-gray-300"
              >
                <Skeleton
                  width={240}
                  height={300}
                  className="object-cover w-full h-72 rounded-lg shadow-lg"
                />
                <div className="relative w-full p-4 bg-gray-300 flex items-end justify-center rounded-lg shadow-md">
                  <Skeleton width="80%" height={20} className="rounded" />
                </div>
              </div>
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
            >
              &#8250;
            </button>
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="h-screen px-5 md:px-10 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Quelle formation vous intéresse-t-elle ?
      </h2>

      <div className="relative flex items-center h-auto p-9 m-2 bg-white rounded  shadow-[0_0_2px_4px_rgba(0,0,0,0.25)]">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
          >
            &#8249;
          </button>
        )}

        <div ref={carouselRef} className="flex space-x-4 w-full h-full overflow-x-auto scrollbar-hide">
          {products.map((product) => {
            const image = `${urlapi}/${product.image}`;

            return (
              <div
                key={product.id}
                className="flex-shrink-0 h-auto w-72 flex flex-col items-center justify-between cursor-pointer shadow-lg transition duration-300 ease-in-out transform border border-gray-300" // Added border
                onClick={() => handleSelectProduct(product)} // Trigger navigation on click
              >
                {/* Image with border, shadow, and increased length */}
                <img
                  src={image}
                  alt={product.titre}
                  width={240}
                  height={300} // Increased height for a longer image
                  className="object-cover w-full h-72 rounded-lg shadow-lg" // Border-radius and box-shadow
                />

                {/* Description with gray background, larger text, and no border radius */}
                <div className="relative w-full p-4 bg-gray-300 flex items-end justify-center rounded-lg shadow-md">
                  <p className="text-gray-800 text-lg px-2 text-center line-clamp-2 leading-snug tracking-wide hover:scale-105">
                    {product.description.split(" ").slice(0, 8).join(" ")}...
                    <span
                      onClick={() => router.push(`/services/details/${product.id}`)} // Navigate to details page
                      className="text-blue-600 font-semibold ml-2 cursor-pointer"
                    >
                      voir+
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>


        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
          >
            &#8250;
          </button>
        )}
      </div>

      {/* Additional details layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-4 mt-8 p-2  place-items-center">
        <h2>Plus de details</h2>
        {products.map((product) => {
          const image1 = `${urlapi}/${product.image}`;

          // Find the user's star rating for the current product
          const productStars = stars.filter((s) => s.idformation === product.id);

          return (
            <div
              key={product.id}
              className="p-2 bg-gray-800 text-white rounded flex flex-col shadow-[3px_3px_4px_rgba(0,0,0,0.25)]"
              style={{ width: '500px' }} // Set the content width to 500px
            >
              {/* Title and description above the image */}
              <div className="w-full text-left mb-2">
                <div className="text-lg font-bold">{product.titre}</div>
                <div className="text-sm truncate">
                  {product.description.split(" ").slice(0, 10).join(" ")}...
                  <span
                    onClick={() => router.push(`/services/details/${product.id}`)} // Navigate to details page
                    className="text-blue-500 cursor-pointer ml-2"
                  >
                    suite
                  </span>
                </div>
              </div>

              {/* Image with same width as text */}
              <div className="w-full">
                <img
                  src={image1}
                  alt={product.titre}
                  width={500} // Set image width to match the text width
                  height={300}
                  className="object-cover rounded-md"
                />
              </div>

              {/* Star rating */}
              <div className="flex items-center mt-2">
                {/* Create 5 stars */}
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => {
                    // Ensure first 4 stars are yellow, the rest depend on the rate
                    const isFilled = i < 4;
                    return (
                      <i
                        key={i}
                        className={`bi ${isFilled ? 'bi-star-fill text-yellow-400' : 'bi-star text-gray-400'}`}
                        style={{ fontSize: '24px' }} // Set star size
                      ></i>
                    );
                  })}
                </div>
                {/* Display total number of ratings */}
                <div className="mt-1 flex items-center">
                  {productStars && (
                    <span className="ml-2 text-yellow-400 font-semibold">
                      {productStars.length} {productStars.length === 1 ? 'Réaction' : 'Réactions'}
                    </span>
                  )}
                </div>
              </div>


              {/* Comments section below the image */}
              <div className="w-full mt-4 flex flex-col flex-grow">
                <p className="font-semibold text-lg">Commentaires :</p>
                {comment
                  .filter((c) => c.idproduit === product.id) // Filter comments by product ID
                  .slice(0, visibleComments) // Only show the number of visible comments
                  .map((c, index) => {
                    // Find the user who posted the comment
                    const commentUser = users.find((user) => user.id === c.iduser);

                    return (
                      <div key={index} className="mt-2 text-sm bg-gray-700 p-4 rounded-md">
                        {/* Display email in bold and smaller size */}
                        {commentUser && (
                          <>
                            <p className="font-bold text-xs">{commentUser.email}</p>
                            <p className="text-gray-300 text-sm">{new Date(c.date).toLocaleDateString('fr-FR')}</p>
                            <p className="text-sm">{c.commentaire}</p>
                          </>
                        )}
                      </div>
                    );
                  })}

                {/* Show the "Next" button only if there are more comments to show */}
                <button
                  onClick={() => handleSelectProduct(product)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Evaluer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
};

export default Services;
