import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function BucketListItemCard({ item, onDelete, onEdit, onToggleStatus }) {
  // Defensive check: If item or its _id is missing, do not render the card.
  // This helps prevent errors if data from the backend is incomplete.
  if (!item || !item._id) {
    console.warn("BucketListItemCard received an item without a valid _id:", item);
    return null; // Render nothing if essential data is missing
  }

  // Format the travel date for display
  const formattedDate = item.travelDate
    ? new Date(item.travelDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'No date specified';

  // Determine if the item is complete based on its 'completed' boolean property from the backend
  const isComplete = item.completed;

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${
        isComplete ? 'opacity-80' : '' // Reduce opacity if the item is complete/visited
      }`}
    >
      {/* Clickable area for navigating to the detail view of the bucket list item */}
      {/* The 'to' prop uses item._id, which is guaranteed to be valid by the check above. */}
      <Link to={`/bucketlist/${item._id}`} className="block p-5">
        <h3
          className={`text-xl font-semibold mb-2 ${
            isComplete ? 'text-gray-500 line-through' : 'text-gray-800' // Strikethrough and grey out if complete
          }`}
        >
          {/* Display placeName, fallback to title if placeName is not available */}
          {item.placeName || item.title}
        </h3>
        <p className="text-pink-600 text-sm font-medium mb-3">{formattedDate}</p>
        <p className="text-gray-600 text-sm line-clamp-2">
          {item.description || 'No description provided.'}
        </p>

        {/* Display tags if they exist and are not empty */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <span
                key={index} // Using index as key is acceptable here as tags are likely static within an item
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Status Toggle Button and Edit/Delete Actions */}
      <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-3">
        {/* Button to toggle the completion status of the item (Visited/Not Visited) */}
        {/* Calls onToggleStatus with the item's ID and its current 'completed' status */}
        <button
          onClick={() => onToggleStatus(item._id, item.completed)}
          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
            isComplete
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' // Style for marking incomplete/not visited
              : 'bg-green-100 text-green-800 hover:bg-green-200' // Style for marking complete/visited
          }`}
        >
          Mark as {isComplete ? 'Not Visited' : 'Visited'}
        </button>

        {/* Container for Edit and Delete buttons */}
        <div className="flex space-x-3">
          {/* Edit Button */}
          <button
            onClick={() => onEdit(item._id)} // Calls onEdit with the item's ID
            className="text-gray-500 hover:text-pink-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={`Edit ${item.placeName}`} // Accessibility label for screen readers
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          {/* Delete Button */}
          <button
            onClick={() => onDelete(item._id)} // Calls onDelete with the item's ID
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
            aria-label={`Delete ${item.placeName}`} // Accessibility label for screen readers
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
