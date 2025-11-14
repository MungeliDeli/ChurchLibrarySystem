import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { booksAPI } from "../../services/api";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch books
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await booksAPI.getBooks();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch books");
    }
  }
);

// Async thunk to create a new book
export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await booksAPI.createBook(bookData);
      return response.data.item; // The backend returns { message, item }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create book");
    }
  }
);

// Async thunk to update a book
export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await booksAPI.updateBook(id, data);
      return response.data.item;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update book");
    }
  }
);

// Async thunk to delete a book
export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      await booksAPI.deleteBook(bookId);
      return bookId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete book");
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Book
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Book
      .addCase(updateBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.itemId === action.payload.itemId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Book
      .addCase(deleteBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.itemId !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bookSlice.actions;

// Selectors
export const selectAllBooks = (state) => state.books.items;
export const selectBooksLoading = (state) => state.books.isLoading;
export const selectBooksError = (state) => state.books.error;

export default bookSlice.reducer;
