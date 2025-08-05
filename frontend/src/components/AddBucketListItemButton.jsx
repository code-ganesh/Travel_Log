import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddBucketListItemButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all duration-300 ease-in-out z-50"
      aria-label="Add new bucket list item"
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  );
}