import React from 'react';
import {
  GlobeAltIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const FEATURED_DESTINATIONS = [
  {
    id: 1,
    name: "Paris, France",
    image: "/assests/eiffel-tower-paris-france.jpg",
    description: "The City of Love, renowned for its iconic Eiffel Tower, charming cafes, and world-class museums.",
    category: "Culture",
  },
  {
    id: 2,
    name: "Bali, Indonesia",
    image: "/assests/bali.h",
    description: "A tropical paradise with lush rice paddies, volcanic mountains, and vibrant coral reefs.",
    category: "Beach & Nature",
  },
  {
    id: 3,
    name: "New York City, USA",
    image: "/assests/new-york.jpeg",
    description: "The city that never sleeps, offering Broadway shows, diverse culinary experiences, and towering skyscrapers.",
    category: "City Break",
  },
  {
    id: 4,
    name: "Kyoto, Japan",
    image: "/assests/japan.jpg",
    description: "Immerse yourself in ancient temples, vibrant geisha districts, and serene bamboo forests.",
    category: "Culture",
  },
  {
    id: 5,
    name: "Santorini, Greece",
    image: "/assests/greece.jpeg",
    description: "Iconic white-washed villages, breathtaking sunsets, and crystal-clear Aegean waters.",
    category: "Beach & Nature",
  },
  {
    id: 6,
    name: "Machu Picchu, Peru",
    image: "/assests/peru.jpg",
    description: "Journey to the ancient Inca citadel nestled high in the Andes Mountains.",
    category: "Adventure",
  },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-inter">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-indigo-700 flex items-center justify-center text-white overflow-hidden shadow-lg">
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Explore a world of possibilities and find the perfect destination for your dream trip.
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations, activities, or themes..."
                className="w-full py-3 pl-12 pr-4 rounded-full bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg transition-all duration-300"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Featured Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_DESTINATIONS.map((destination) => (
              <div key={destination.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/E0E7FF/6366F1?text=Image+Error'; }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
                  <span className="absolute top-3 right-3 bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    {destination.category}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 text-base mb-4 line-clamp-3">{destination.description}</p>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(destination.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold transition-colors duration-200 group-hover:underline"
                  >
                    Learn More <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-500 to-teal-600 text-white text-center shadow-inner">
        <div className="max-w-4xl mx-auto">
          <GlobeAltIcon className="h-20 w-20 mx-auto text-blue-200 mb-6 animate-pulse" />
          <h2 className="text-4xl font-bold mb-4 leading-tight">Ready to Plan Your Dream Trip?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start adding destinations to your bucket list and turn your travel aspirations into reality.
          </p>
          <a
            href="/bucketlist"
            className="inline-flex items-center bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-semibold py-3 px-8 rounded-full shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <HeartIcon className="h-5 w-5 mr-2" /> Start Your Bucket List
          </a>
        </div>
      </section>
    </div>
  );
}
