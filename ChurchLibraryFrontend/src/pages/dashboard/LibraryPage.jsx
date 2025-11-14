import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBooks,
  deleteBook,
  selectAllBooks,
  selectBooksLoading,
  selectBooksError,
} from "../../store/slices/bookSlice";
import {
  deleteCategory,
  selectCategoriesError,
  clearCategoryError,
} from "../../store/slices/categorySlice";
import { addToast } from "../../store/slices/uiSlice";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/common/Button";
import CreateBookModal from "../../components/library/CreateBookModal";
import EditBookModal from "../../components/library/EditBookModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import CategoryManager from "../../components/library/CategoryManager";
import { clsx } from "clsx";

const LibraryPage = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("books"); // 'books' or 'categories'

  // Book state
  const books = useSelector(selectAllBooks);
  const isBooksLoading = useSelector(selectBooksLoading);
  const booksError = useSelector(selectBooksError);
  const [isCreateBookModalOpen, setCreateBookModalOpen] = useState(false);
  const [isEditBookModalOpen, setEditBookModalOpen] = useState(false);
  const [isDeleteBookDialog, setDeleteBookDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Category state
  const categoryError = useSelector(selectCategoriesError);
  const [isDeleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (activeTab === "books") {
      dispatch(fetchBooks());
    }
    // Categories are fetched within the CategoryManager component
  }, [dispatch, activeTab]);

  // Effect to watch for category deletion errors and show a toast
  useEffect(() => {
    if (categoryError) {
      dispatch(addToast({
        title: "Deletion Failed",
        message: "This category cannot be deleted because it is used in current library books.",
        variant: "error",
      }));
      // Clear the error from the store to prevent the toast from re-appearing
      dispatch(clearCategoryError());
    }
  }, [categoryError, dispatch]);

  // Book handlers
  const handleEditBookClick = (book) => {
    setSelectedBook(book);
    setEditBookModalOpen(true);
  };

  const handleDeleteBookClick = (book) => {
    setSelectedBook(book);
    setDeleteBookDialog(true);
  };

  const confirmDeleteBook = () => {
    if (selectedBook) {
      dispatch(deleteBook(selectedBook.itemId));
      setDeleteBookDialog(false);
      setSelectedBook(null);
    }
  };

  // Category handlers
  const handleDeleteCategoryClick = (category) => {
    setSelectedCategory(category);
    setDeleteCategoryDialog(true);
  };

  const confirmDeleteCategory = () => {
    if (selectedCategory) {
      dispatch(deleteCategory(selectedCategory.categoryId));
      setDeleteCategoryDialog(false);
      setSelectedCategory(null);
    }
  };

  const bookColumns = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors", render: (authors) => (authors && Array.isArray(authors) ? authors.join(", ") : "N/A") },
    { key: "Category", label: "Category", render: (_, row) => row.Category?.name || "Uncategorized" },
    { key: "format", label: "Format" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button variant="secondary" size="small" onClick={() => handleEditBookClick(row)}>Edit</Button>
          <Button variant="danger" size="small" onClick={() => handleDeleteBookClick(row)}>Delete</Button>
        </div>
      ),
    },
  ];

  const renderBooksContent = () => {
    if (isBooksLoading && books.length === 0) return <div className="flex justify-center items-center h-64"><LoadingSpinner size="large" /></div>;
    if (booksError) return <div className="text-center text-red-500 p-4 bg-red-100 rounded-md"><p>Error fetching library data: {booksError}</p></div>;
    return <DataTable columns={bookColumns} data={books} loading={isBooksLoading} />;
  };

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={clsx(
        "px-4 py-2 text-sm font-medium rounded-md",
        activeTab === tabName
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-gray-200"
      )}
    >
      {label}
    </button>
  );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-primary-text)]">
            Library Management
          </h1>
          {activeTab === 'books' && (
            <Button variant="primary" onClick={() => setCreateBookModalOpen(true)}>
              Create New Book
            </Button>
          )}
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-2" aria-label="Tabs">
            <TabButton tabName="books" label="Books" />
            <TabButton tabName="categories" label="Categories" />
          </nav>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-lg shadow-md">
          {activeTab === 'books' ? renderBooksContent() : <CategoryManager onDeleteClick={handleDeleteCategoryClick} />}
        </div>
      </div>

      {/* Modals and Dialogs */}
      <CreateBookModal isOpen={isCreateBookModalOpen} onClose={() => setCreateBookModalOpen(false)} />
      <EditBookModal isOpen={isEditBookModalOpen} onClose={() => setEditBookModalOpen(false)} book={selectedBook} />
      <ConfirmDialog
        isOpen={isDeleteBookDialog}
        onClose={() => setDeleteBookDialog(false)}
        onConfirm={confirmDeleteBook}
        title="Delete Book"
        message={`Are you sure you want to delete "${selectedBook?.title}"? This action cannot be undone.`}
      />
      <ConfirmDialog
        isOpen={isDeleteCategoryDialog}
        onClose={() => setDeleteCategoryDialog(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? Deleting a category will also delete all books within it.`}
      />
    </DashboardLayout>
  );
};

export default LibraryPage;
