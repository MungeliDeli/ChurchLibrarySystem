import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  selectAllCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../../store/slices/categorySlice";
import Button from "../common/Button";
import LoadingSpinner from "../common/LoadingSpinner";

const CategoryManager = ({ onDeleteClick }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const isLoading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEditClick = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setName(category.name);
    setDescription(category.description || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setName("");
    setDescription("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      dispatch(updateCategory({ id: currentCategory.categoryId, data: { name, description } }));
    } else {
      dispatch(createCategory({ name, description }));
    }
    handleCancelEdit(); // Reset form after submission
  };

  return (
    <div className="space-y-6">
      {/* Form for Create/Edit */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">{isEditing ? "Edit Category" : "Create New Category"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="category-description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            {isEditing && (
              <Button type="button" variant="secondary" onClick={handleCancelEdit}>Cancel</Button>
            )}
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="small" /> : (isEditing ? "Save Changes" : "Create")}
            </Button>
          </div>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* List of Categories */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Existing Categories</h3>
        {isLoading && categories.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories && categories.map((cat) => (
              cat && (
                <li key={cat.categoryId} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-sm text-gray-500">{cat.description}</p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="secondary" size="small" onClick={() => handleEditClick(cat)}>Edit</Button>
                    <Button variant="danger" size="small" onClick={() => onDeleteClick(cat)}>Delete</Button>
                  </div>
                </li>
              )
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
