import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  selectAllCategories,
} from "../../store/slices/categorySlice";
import { createBook, selectBooksLoading, selectBooksError } from "../../store/slices/bookSlice";
import Modal from "../common/Modal";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  authors: yup.string(),
  format: yup.string().required("Format is required"),
  categoryId: yup.string().required("Category is required"),
  description: yup.string(),
  bookFile: yup.mixed().test("file", "A file is required for non-physical formats", (value, context) => {
    if (context.parent.format !== 'Physical' && (!value || value.length === 0)) {
      return false;
    }
    return true;
  }),
}).required();

const CreateBookModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const isLoading = useSelector(selectBooksLoading);
  const error = useSelector(selectBooksError);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
    }
  }, [isOpen, dispatch]);

  const handleFormSubmit = async (data) => {
    const formData = new FormData();

    // Append all form fields to formData
    Object.keys(data).forEach(key => {
      if (key === 'bookFile') {
        if (data.bookFile && data.bookFile.length > 0) {
          formData.append(key, data.bookFile[0]);
        }
      } else if (key === 'authors') {
        // The authors field is a string, convert it to an array before sending
        const authorsArray = data.authors ? data.authors.split(",").map(s => s.trim()) : [];
        // FormData can't send arrays directly, so we might need to stringify or send multiple keys
        // For this backend, let's assume it can handle a comma-separated string.
        formData.append(key, data.authors);
      } else {
        formData.append(key, data[key]);
      }
    });
    
    try {
      await dispatch(createBook(formData)).unwrap();
      // If successful, close modal and reset form
      onClose();
      reset();
    } catch (e) {
      // Error is already handled by the slice, just log it for debugging
      console.error("Failed to create book:", e);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Book">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md">
            <p>Error: {error}</p>
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            {...register("title")}
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="authors" className="block text-sm font-medium text-gray-700">Authors (comma-separated)</label>
          <input
            {...register("authors")}
            type="text"
            id="authors"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700">Format</label>
          <select
            {...register("format")}
            id="format"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a format</option>
            <option value="Physical">Physical</option>
            <option value="PDF">PDF</option>
            <option value="EPUB">EPUB</option>
            <option value="Audiobook">Audiobook</option>
            <option value="Video">Video</option>
          </select>
          {errors.format && <p className="mt-1 text-sm text-red-600">{errors.format.message}</p>}
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register("categoryId")}
            id="categoryId"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories && categories.map((cat) => (
              cat && (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              )
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register("description")}
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="bookFile" className="block text-sm font-medium text-gray-700">Book File</label>
          <input
            {...register("bookFile")}
            type="file"
            id="bookFile"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          {errors.bookFile && <p className="mt-1 text-sm text-red-600">{errors.bookFile.message}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="small" /> : "Create Book"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateBookModal;
