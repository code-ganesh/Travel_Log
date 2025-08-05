// src/pages/BucketListPage.js
import { useState, useEffect } from 'react';
import AddBucketListItemButton from '../components/AddBucketListItemButton';
import AddBucketListItemModal from '../components/AddBucketListItemModal';
import BucketListItemCard from '../components/BucketListItemCard';

export default function BucketListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bucketListItems, setBucketListItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch user's bucket list items on page load
  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/api/bucket/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setBucketListItems(data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };

    fetchItems();
  }, []);

  // Save item (create or update)
  const handleSaveItem = async (item) => {
    const token = localStorage.getItem('token');
    const isEditing = Boolean(item._id);

    const endpoint = isEditing
      ? `http://localhost:5000/api/bucket/item/${item._id}`
      : `http://localhost:5000/api/bucket/`;

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (!res.ok) throw new Error("Failed to save item");
      const savedItem = await res.json();

      const updatedItems = isEditing
        ? bucketListItems.map(i => i._id === savedItem._id ? savedItem : i)
        : [...bucketListItems, savedItem];

      setBucketListItems(updatedItems);
      setEditingItem(null);
    } catch (err) {
      console.error('Save failed:', err);
      alert("Could not save item.");
    }
  };

  const handleDeleteItem = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("User not logged in.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bucket/item/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete');
      }

      setBucketListItems(prevItems => prevItems.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert(err.message || "Could not delete item.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem('token');
    if (!token) return alert("User not logged in.");

    const newStatus = currentStatus === 'complete' ? 'incomplete' : 'complete';

    try {
      const res = await fetch(`http://localhost:5000/api/bucket/item/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      const updatedItem = await res.json();

      setBucketListItems((prev) =>
        prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
    } catch (err) {
      console.error('Status toggle failed:', err);
      alert("Could not update status.");
    }
  };

  const handleEditItem = (id) => {
    const itemToEdit = bucketListItems.find(item => item._id === id);
    setEditingItem(itemToEdit);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      <div className="w-full px-8 sm:px-10 lg:px-12 mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your DreamTrip Bucket List</h2>

        {bucketListItems.length === 0 ? (
          <p className="text-gray-600 text-lg text-center py-10">
            Your bucket list is empty! Click the '+' button to add your first dream trip.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bucketListItems.map(item => (
              <BucketListItemCard
                key={item._id}
                item={item}
                onDelete={() => handleDeleteItem(item._id)}
                onEdit={() => handleEditItem(item._id)}
                onToggleStatus={handleToggleStatus} // ✅ Connected here
              />
            ))}
          </div>
        )}
      </div>

      <AddBucketListItemButton onClick={() => {
        setIsModalOpen(true);
        setEditingItem(null);
      }} />

      <AddBucketListItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        initialData={editingItem}
      />
    </div>
  );
}
