import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast for notifications
import {
  PlusCircleIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  SparklesIcon,
  CheckCircleIcon, // Keep if needed for local logic, though status is now from backend
  CalendarDaysIcon,
  BookmarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import BucketListItemCard from '../components/BucketListItemCard';
import AddBucketListItemModal from '../components/AddBucketListItemModal';

// Dummy data for Destination Spotlight (remains local as it's static UI content)
const DESTINATION_SPOTLIGHTS = [
  {
    id: 1,
    name: "Kyoto, Japan",
    image: "/assests/japan.jpg",
    description: "Immerse yourself in ancient temples, vibrant geisha districts, and serene bamboo forests.",
    color: "pink",
  },
  {
    id: 2,
    name: "Santorini, Greece",
    image: "/assests/greece.jpeg",
    description: "Iconic white-washed villages, breathtaking sunsets, and crystal-clear Aegean waters.",
    color: "blue",
  },
  {
    id: 3,
    name: "Machu Picchu, Peru",
    image: "/assests/peru.jpg",
    description: "Journey to the ancient Inca citadel nestled high in the Andes Mountains.",
    color: "green",
  },
  {
    id: 4,
    name: "Banff National Park, Canada",
    image: "/assests/wildlife.jpg",
    description: "Stunning turquoise lakes, towering peaks, and abundant wildlife in the Canadian Rockies.",
    color: "purple",
  },
];

export default function Home() {
  const { user } = useAuth(); // Get user from AuthContext
  const [bucketListItems, setBucketListItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [loadingItems, setLoadingItems] = useState(true);
  const [errorLoadingItems, setErrorLoadingItems] = useState(null);

  // Function to fetch user's bucket list items from the backend
  const fetchBucketListItems = async () => {
    setLoadingItems(true);
    setErrorLoadingItems(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingItems(false);
      // No token means user is not logged in, so no items to fetch
      setBucketListItems([]);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/bucket/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch items");
      }
      const data = await res.json();
      setBucketListItems(data);
    } catch (err) {
      console.error('Error fetching items:', err);
      setErrorLoadingItems(err.message || "Failed to load your dreams.");
      toast.error(err.message || "Failed to load your dreams.");
    } finally {
      setLoadingItems(false);
    }
  };

  // Effect to fetch items on component mount and handle spotlight cycling
  useEffect(() => {
    fetchBucketListItems(); // Initial fetch

    // Cycle through destination spotlights every few seconds
    const interval = setInterval(() => {
      setSpotlightIndex((prevIndex) =>
        (prevIndex + 1) % DESTINATION_SPOTLIGHTS.length
      );
    }, 3000); // Change every 8 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [user]); // Re-fetch if user changes (e.g., login/logout)

  // Save item (create or update) - now interacts with backend
  const handleSaveItem = async (itemData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to save items.");
      return;
    }

    const isEditing = Boolean(itemData._id); // Check for _id from backend
    const endpoint = isEditing
      ? `http://localhost:5000/api/bucket/item/${itemData._id}`
      : `http://localhost:5000/api/bucket/`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save item");
      }
      // After saving, re-fetch all items to ensure the list is up-to-date
      await fetchBucketListItems();
      setIsModalOpen(false);
      setEditingItem(null);
      toast.success(`Dream ${isEditing ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      console.error('Save failed:', err);
      toast.error(err.message || "Could not save dream.");
    }
  };

  // Delete item - now interacts with backend
  const handleDeleteItem = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to delete items.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this dream? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bucket/item/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete dream');
      }

      // After deleting, re-fetch all items
      await fetchBucketListItems();
      toast.success("Dream deleted successfully!");
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.message || "Could not delete dream.");
    }
  };

  // Edit item - prepares data for modal
  const handleEditItem = (id) => {
    const itemToEdit = bucketListItems.find(item => item._id === id); // Use _id
    setEditingItem(itemToEdit);
    setIsModalOpen(true);
  };

  // Toggle status (completed/not completed) - now interacts with backend
  const handleToggleStatus = async (id, currentCompletedStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You must be logged in to update status.");
      return;
    }

    const newCompletedStatus = !currentCompletedStatus; // Toggle boolean

    try {
      const res = await fetch(`http://localhost:5000/api/bucket/item/${id}/complete`, {
        method: 'PUT', // Use PUT as per your backend route
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: newCompletedStatus }), // Send boolean
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      // After updating status, re-fetch all items
      await fetchBucketListItems();
      toast.success(`Dream marked as ${newCompletedStatus ? 'visited' : 'not visited'}!`);
    } catch (err) {
      console.error('Status toggle failed:', err);
      toast.error(err.message || "Could not update status.");
    }
  };

  // Calculate stats based on fetched items
  const totalDreams = bucketListItems.length;
  const completedDreams = bucketListItems.filter(item => item.completed).length;
  const upcomingDreams = totalDreams - completedDreams;
  // Find the next upcoming dream, prioritizing by date if available, otherwise just the first incomplete
  const nextDream = bucketListItems
    .filter(item => !item.completed)
    .sort((a, b) => {
      if (a.travelDate && b.travelDate) {
        return new Date(a.travelDate) - new Date(b.travelDate);
      }
      if (a.travelDate) return -1; // Prioritize items with a date
      if (b.travelDate) return 1;
      return 0;
    })[0] || { placeName: "No Upcoming Dream", description: "Add a new dream to see it here!" };


  const currentSpotlight = DESTINATION_SPOTLIGHTS[spotlightIndex];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Welcome & Quick Actions Section */}
      <section className="relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-md overflow-hidden">
        {/* Subtle background pattern/texture */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>

        <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 leading-tight">
              Welcome back, <span className="text-pink-200">{user?.name || "Traveler"}</span>!
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Your next adventure awaits. Let's make your travel dreams a reality.
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => { setIsModalOpen(true); setEditingItem(null); }}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" /> Add New Dream
            </button>
            <Link
              to="/bucketlist"
              className="bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800 font-semibold py-3 px-8 rounded-full shadow-md flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
            >
              <BookmarkIcon className="h-5 w-5 mr-2" /> View All Dreams
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Stats & Next Dream Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Your Travel Stats Card */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 flex flex-col justify-between">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Travel Stats</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-blue-50">
                <p className="text-4xl font-extrabold text-blue-600">{totalDreams}</p>
                <p className="text-sm text-gray-600 mt-1">Total Dreams</p>
              </div>
              <div className="p-4 rounded-lg bg-pink-50">
                <p className="text-4xl font-extrabold text-pink-600">{completedDreams}</p>
                <p className="text-sm text-gray-600 mt-1">Completed</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50">
                <p className="text-4xl font-extrabold text-green-600">{upcomingDreams}</p>
                <p className="text-sm text-gray-600 mt-1">Upcoming</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6 text-center">
              Keep adding and exploring to achieve your travel goals!
            </p>
          </div>

          {/* Next Dream on Your List Card */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CalendarDaysIcon className="h-7 w-7 text-blue-500 mr-3" /> Your Next Dream
              </h2>
              {loadingItems ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading your next dream...</p>
                </div>
              ) : errorLoadingItems ? (
                <div className="text-center py-8 text-red-500">
                  <p>Error: {errorLoadingItems}</p>
                </div>
              ) : nextDream._id ? ( // Check if nextDream has a valid _id from backend
                <>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-blue-700 mb-2">{nextDream.placeName}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{nextDream.description || "No description provided."}</p>
                  </div>
                  <div className="mt-auto">
                    <Link
                      to={`/bucketlist/${nextDream._id}`} // Link to detail page using _id
                      className="inline-flex items-center text-pink-600 hover:text-pink-700 font-semibold group-hover:underline transition-colors duration-200"
                    >
                      View Details <ChevronRightIcon className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-lg mb-4">No upcoming dreams found!</p>
                  <button
                    onClick={() => { setIsModalOpen(true); setEditingItem(null); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Add your first dream to see it here!
                  </button>
                </div>
              )}
            </div>

            {/* Background effect for next dream card - Keep z-0 */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-0"></div>
            <MapPinIcon className="absolute top-4 right-4 h-12 w-12 text-pink-200 opacity-50 transform -rotate-12 group-hover:opacity-100 transition-all duration-300 z-0" />
          </div>
        </div>
      </section>

      {/* Destination Spotlight Section */}
      <section className="py-12 bg-white px-4 sm:px-6 lg:px-8">
        <div className="w-full mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Destination Spotlight</h2>
          <div className={`relative bg-gradient-to-br from-${currentSpotlight.color}-400 to-${currentSpotlight.color}-600 rounded-xl shadow-xl overflow-hidden text-white flex flex-col md:flex-row items-center justify-center p-8 md:p-12 transition-all duration-500 transform hover:scale-[1.01]`}>
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={currentSpotlight.image}
                alt={currentSpotlight.name}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-300"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1470x800/E0E7FF/6366F1?text=Image+Unavailable'; }}
              />
              <div className="absolute inset-0 bg-black opacity-40"></div> {/* Dark overlay */}
            </div>

            <div className="relative z-10 text-center md:text-left md:w-2/3 lg:w-1/2">
              <h3 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                {currentSpotlight.name}
              </h3>
              <p className="text-lg md:text-xl text-white opacity-90 mb-6">
                {currentSpotlight.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                <Link
                  to="/explore" // Link to a more detailed explore page or direct add
                  className="bg-white text-blue-700 hover:bg-blue-800 font-semibold py-3 px-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                >
                  <GlobeAltIcon className="h-5 w-5 mr-2" /> Explore More
                </Link>
                <button
                  onClick={() => { setIsModalOpen(true); setEditingItem({ placeName: currentSpotlight.name, description: currentSpotlight.description }); }}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" /> Add to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Recent Dreams (kept for deeper dive) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recently Added Dreams</h2>
            {totalDreams > 3 && (
              <Link to="/bucketlist" className="text-pink-600 hover:text-pink-700 font-semibold flex items-center group">
                View All Dreams <ChevronRightIcon className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            )}
          </div>

          {loadingItems ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading your recent dreams...</p>
            </div>
          ) : errorLoadingItems ? (
            <div className="text-center py-8 text-red-500">
              <p>Error: {errorLoadingItems}</p>
            </div>
          ) : totalDreams === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-100">
              <p className="text-gray-600 text-lg mb-4">No dreams added recently!</p>
              <button
                onClick={() => { setIsModalOpen(true); setEditingItem(null); }}
                className="text-blue-600 hover:underline font-medium"
              >
                Start adding your first dream now.
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Displaying only the first 3 recent items, ensuring they have an _id */}
              {bucketListItems
                .filter(item => item._id) // Filter out items without _id
                .slice(0, 3)
                .map(item => (
                  <BucketListItemCard
                    key={item._id} // Use _id for key
                    item={item}
                    onDelete={handleDeleteItem}
                    onEdit={handleEditItem}
                    onToggleStatus={handleToggleStatus} // Pass the toggle handler
                  />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Explore Other Features */}
      <section className="py-12 bg-blue-50 px-4 sm:px-6 lg:px-8">
        <div className="w-full mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Plan Smarter, Travel Further</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/explore"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4 group"
            >
              <GlobeAltIcon className="h-10 w-10 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Discover New Destinations</h3>
                <p className="text-gray-600">Find inspiration and hidden gems for your next adventure.</p>
              </div>
              <ChevronRightIcon className="h-6 w-6 text-gray-500 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/ai"
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4 group"
            >
              <SparklesIcon className="h-10 w-10 text-pink-500 group-hover:scale-110 transition-transform duration-200" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Plan with AI Itinerary</h3>
                <p className="text-gray-600">Let AI craft the perfect trip plan tailored just for you.</p>
              </div>
              <ChevronRightIcon className="h-6 w-6 text-gray-500 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Add/Edit Modal */}
      <AddBucketListItemModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSave={handleSaveItem} // handleSaveItem now handles both add and update
        initialData={editingItem}
      />
    </div>
  );
}
