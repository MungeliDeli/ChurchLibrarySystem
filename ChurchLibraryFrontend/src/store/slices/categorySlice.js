import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoriesAPI } from "../../services/api";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

// Async thunk to create a new category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.createCategory(categoryData);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create category");
    }
  }
);

// Async thunk to update a category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await categoriesAPI.updateCategory(id, data);
      return response.data.category;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update category");
    }
  }
);

// Async thunk to delete a category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await categoriesAPI.deleteCategory(categoryId);
      return categoryId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete category");
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.categoryId === action.payload.categoryId);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.categoryId !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError: clearCategoryError } = categorySlice.actions;

// Selectors
export const selectAllCategories = (state) => state.categories.items;
export const selectCategoriesLoading = (state) => state.categories.isLoading;
export const selectCategoriesError = (state) => state.categories.error;

export default categorySlice.reducer;
