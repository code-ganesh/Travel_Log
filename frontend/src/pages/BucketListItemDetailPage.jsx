import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming you have react-toastify installed for notifications
import {
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  DocumentTextIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import AddBucketListItemModal from '../components/AddBucketListItemModal'; // Re-use the modal for editing

export default function BucketListItemDetailPage() {
  const { id } = useParams(); // Get the item ID from the URL (e.g., from /bucketlist/:id)
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [item, setItem] = useState(null); // State to hold the fetched bucket list item
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to hold any fetch errors
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the edit modal
  const [editingItem, setEditingItem] = useState(null); // State to pass item data to the edit modal

  // States for the new diary entry and image features
  const [diaryEntry, setDiaryEntry] = useState(''); // State for the text content of the diary
  const [images, setImages] = useState([]); // State for an array of image URLs (or base64 for local display)

  // Function to fetch a single bucket list item's details from the backend API
  const fetchItemDetails = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear any previous errors

    const token = localStorage.getItem('token'); // Retrieve authentication token
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    // Crucial check: Ensure the ID from the URL is valid before making the API call
    if (!id) {
      setError("No item ID provided in the URL. Please navigate from the bucket list.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bucket/item/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // Include authorization header
      });

      if (!res.ok) {
        // Handle HTTP errors (e.g., 404 Not Found, 403 Forbidden, 500 Internal Server Error)
        if (res.status === 404) {
          throw new Error("Bucket list item not found.");
        }
        const errorData = await res.json(); // Attempt to parse error message from backend
        throw new Error(errorData.error || `Failed to fetch item: ${res.statusText}`);
      }

      const data = await res.json(); // Parse the JSON response
      setItem(data); // Set the fetched item data to state
      setDiaryEntry(data.notes || ''); // Initialize diary entry from fetched item (default to empty string)
      setImages(data.images || []); // Initialize images array from fetched item (default to empty array)
    } catch (err) {
      console.error('Error fetching item details:', err);
      setError(err.message || "An unexpected error occurred.");
      toast.error(err.message || "Failed to load item details."); // Display user-friendly error notification
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
    }
  };

  // useEffect hook to call fetchItemDetails when the component mounts or the 'id' parameter changes
  useEffect(() => {
    fetchItemDetails();
  }, [id]); // Dependency array ensures effect runs when 'id' changes

  // Handler for saving (updating) the item, typically called from the AddBucketListItemModal
  const handleSaveItem = async (updatedItemData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    try {
      // Combine updated data from the modal with the current diary and images state
      const itemToSave = { ...updatedItemData, notes: diaryEntry, images: images };

      const res = await fetch(`http://localhost:5000/api/bucket/item/${itemToSave._id}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemToSave), // Send the entire updated item object
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update item.");
      }
      const savedItem = await res.json(); // Get the updated item from the server response
      setItem(savedItem); // Update the local item state
      setDiaryEntry(savedItem.notes || ''); // Sync diary entry from saved data
      setImages(savedItem.images || []); // Sync images from saved data
      setIsModalOpen(false); // Close the modal
      setEditingItem(null); // Clear the editing item state
      toast.success("Item updated successfully!"); // Show success notification
    } catch (err) {
      console.error('Update failed:', err);
      toast.error(err.message || "Could not update item."); // Show error notification
    }
  };

  // Handler for deleting the item
  const handleDeleteItem = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    // Use window.confirm for a simple confirmation, but a custom modal is better for UX
    if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/bucket/item/${id}`, {
        method: 'DELETE', // Use DELETE method
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete item.");
      }

      toast.success("Item deleted successfully!"); // Show success notification
      navigate('/bucketlist'); // Navigate back to the main bucket list page
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.message || "Could not delete item."); // Show error notification
    }
  };

  // Handler for toggling the 'completed' status (Visited/Not Visited)
  const handleToggleComplete = async () => {
    if (!item) return; // Ensure item data is available
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    // Determine the new 'completed' boolean status (true if currently false, false if currently true)
    const newCompletedStatus = !item.completed;

    try {
      // Send the boolean 'completed' status to the backend's /item/:id/complete endpoint
      const res = await fetch(`http://localhost:5000/api/bucket/item/${item._id}/complete`, {
        method: 'PUT', // Use PUT method as per your backend route
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: newCompletedStatus }), // Send the boolean status in the request body
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to toggle completion status.");
      }
      const data = await res.json(); // Get the updated item from the server response
      setItem(data); // Update the local item state with the new status
      toast.success(`Item marked as ${data.completed ? 'completed' : 'incomplete'}!`); // Show success notification
    } catch (err) {
      console.error('Toggle complete failed:', err);
      toast.error(err.message || "Could not update completion status."); // Show error notification
    }
  };

  // Handler for image file selection from the input
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      // In a real application, you would upload this file to a backend storage service
      // (e.g., Firebase Storage, AWS S3, Cloudinary) and receive a public URL.
      // For this demo, we convert the file to a Data URL (base64) for local display.
      // IMPORTANT: These base64 URLs are NOT saved permanently unless you call handleSaveDiary/handleSaveItem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result]); // Add the new image to the state
        toast.info("Image added locally. Remember to click 'Save Diary Entry' or 'Edit' to persist!");
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

  // Handler for saving the diary entry and images. Triggered on textarea blur or button click.
  const handleSaveDiary = async () => {
    if (!item) return; // Ensure item data is loaded
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    try {
      // Send the current item data, including updated notes and images, to the backend
      const res = await fetch(`http://localhost:5000/api/bucket/item/${item._id}`, {
        method: 'PUT', // Use PUT to update the entire item
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...item, notes: diaryEntry, images: images }), // Send all item data including updated notes and images
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save diary/images.");
      }
      const data = await res.json(); // Get the updated item from the server response
      setItem(data); // Update local item state with the latest from backend
      setDiaryEntry(data.notes || ''); // Sync diary entry from saved data
      setImages(data.images || []); // Sync images from saved data
      toast.success("Diary entry and images saved!"); // Show success notification
    } catch (err) {
      console.error('Saving diary/images failed:', err);
      toast.error(err.message || "Could not save diary entry/images."); // Show error notification
    }
  };

  // Render loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-700 text-lg">Loading dream details...</p>
        </div>
      </div>
    );
  }

  // Render error state if fetching fails
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center justify-center text-red-600">
        <XCircleIcon className="h-12 w-12 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error: {error}</h1>
        <p className="text-lg text-gray-700">Please try again or check your internet connection.</p>
        <button
          onClick={() => navigate('/bucketlist')}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-colors duration-200 flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Bucket List
        </button>
      </div>
    );
  }

  // Render "Item not found" state if item is null after loading (e.g., invalid ID in URL)
  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Item not found.</h1>
        <p className="text-lg text-gray-600">The dream you are looking for does not exist or has been deleted.</p>
        <button
          onClick={() => navigate('/bucketlist')}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-colors duration-200 flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Bucket List
        </button>
      </div>
    );
  }

  // Main render for the detail page
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 md:p-10 border border-gray-100">
        {/* Back Button */}
        <button
          onClick={() => navigate('/bucketlist')}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to All Dreams
        </button>

        {/* Item Header (Place Name, Toggle, Edit, Delete Buttons) */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            {item.placeName}
          </h1>
          <div className="flex items-center space-x-3">
            {/* Toggle Complete Button (Mark as Visited/Not Visited) */}
            <button
              onClick={handleToggleComplete}
              className={`p-2 rounded-full transition-colors duration-200 ${
                item.completed // Use item.completed (boolean) directly from backend
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' // Green if completed
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' // Yellow if not completed
              }`}
              title={item.completed ? "Mark as Not Visited" : "Mark as Visited"}
            >
              {item.completed ? (
                <CheckCircleIcon className="h-6 w-6" /> // Checkmark for completed
              ) : (
                <XCircleIcon className="h-6 w-6" /> // X for not completed
              )}
            </button>
            {/* Edit Button - Opens AddBucketListItemModal for editing */}
            <button
              onClick={() => { setIsModalOpen(true); setEditingItem(item); }} // Pass current item to modal for editing
              className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
              title="Edit Dream"
            >
              <PencilIcon className="h-6 w-6" />
            </button>
            {/* Delete Button */}
            <button
              onClick={handleDeleteItem}
              className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors duration-200"
              title="Delete Dream"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Item Details (Date, Description, Tags, Status) */}
        <div className="space-y-6">
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase mb-1">Travel Date</p>
            <p className="text-lg text-gray-800 font-medium">
              {item.travelDate ? new Date(item.travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase mb-1">Description</p>
            <p className="text-gray-700 leading-relaxed">{item.description || "No description provided for this dream."}</p>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div>
              <p className="text-gray-500 text-sm font-semibold uppercase mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center">
            <p className="text-gray-500 text-sm font-semibold uppercase mr-3">Status:</p>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              item.completed ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white' // Use item.completed here too
            }`}>
              {item.completed ? 'Completed' : 'Upcoming'}
            </span>
          </div>
        </div>

        {/* Travel Diary Section - Conditionally rendered based on 'item.completed' status */}
        {item.completed && (
          <div className="mt-10 pt-6 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="h-7 w-7 text-blue-500 mr-2" /> Travel Diary
            </h2>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 min-h-[150px] text-gray-700"
              placeholder="Write about your experiences, memories, and thoughts from this trip..."
              value={diaryEntry}
              onChange={(e) => setDiaryEntry(e.target.value)}
              onBlur={handleSaveDiary} // Save when textarea loses focus
            ></textarea>
            <button
              onClick={handleSaveDiary}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-full shadow-md transition-colors duration-200"
            >
              Save Diary Entry
            </button>
          </div>
        )}

        {/* Travel Photos Section - Conditionally rendered based on 'item.completed' status */}
        {item.completed && (
          <div className="mt-10 pt-6 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <PhotoIcon className="h-7 w-7 text-pink-500 mr-2" /> Travel Photos
            </h2>
            <div className="mb-4">
              <label htmlFor="image-upload" className="cursor-pointer bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-5 rounded-full shadow-md transition-colors duration-200 inline-flex items-center">
                <PlusCircleIcon className="h-5 w-5 mr-2" /> Upload Photo
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((imgSrc, index) => (
                  <div key={index} className="relative group overflow-hidden rounded-lg shadow-sm border border-gray-200">
                    <img
                      src={imgSrc}
                      alt={`Travel Photo ${index + 1}`}
                      className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/E0E7FF/6366F1?text=Image+Error'; }} // Fallback image
                    />
                    {/* Optional: Add a delete button for images (requires backend logic) */}
                    {/* <button
                      onClick={() => {
                        // Implement image deletion logic here (requires backend)
                        setImages(images.filter((_, i) => i !== index));
                        toast.info("Image removed locally. (Requires backend for permanent deletion)");
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <XCircleIcon className="h-4 w-4" />
                    </button> */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No photos uploaded yet. Share your memories!</p>
            )}
          </div>
        )}

        {/* Additional details like creation date, last updated, etc. */}
        <div className="text-gray-500 text-sm pt-4 border-t border-gray-100 mt-10">
          <p>Created: {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}</p>
          <p>Last Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A'}</p>
        </div>
      </div>

      {/* Edit Modal (re-used for general item editing) */}
      <AddBucketListItemModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSave={handleSaveItem}
        initialData={editingItem} // Pass the current item's data for editing
      />
    </div>
  );
}
