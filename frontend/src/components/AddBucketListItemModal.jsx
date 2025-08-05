// src/components/AddBucketListItemModal.js
import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AddBucketListItemModal({ isOpen, onClose, onSave, initialData }) {
  const [placeName, setPlaceName] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    setPlaceName(initialData?.title || '');
    setTravelDate(initialData?.travelDate || '');
    setDescription(initialData?.description || '');
    setTags(initialData?.tags?.join(', ') || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!placeName || !travelDate) {
      alert("Please fill in Place Name and Travel Date.");
      return;
    }

    const item = {
      placeName,
      travelDate,
      description,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (initialData?._id) item._id = initialData._id;

    onSave(item); // delegate save logic to parent
    onClose();    // close modal
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900 flex justify-between items-center">
                  {initialData ? 'Edit DreamTrip Item' : 'Add New DreamTrip Item'}
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <label htmlFor="placeName" className="block text-sm font-medium text-gray-700">
                      Place Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="placeName"
                      value={placeName}
                      onChange={(e) => setPlaceName(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700">
                      Travel Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="travelDate"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g., Beach, Adventure, Food"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-pink-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-pink-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-pink-700 focus:ring-pink-500"
                    >
                      {initialData ? 'Update Item' : 'Save Item'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
