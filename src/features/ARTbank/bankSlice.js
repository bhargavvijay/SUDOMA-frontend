import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addARTBank, fetchAllARTBanks, deleteARTBankById, editARTBankById } from './bankApi'; // Import the API functions

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // Stores error messages
  banks: [], // List of ART banks
  selectedBank: null, // Bank currently being edited
};

// Async thunk for adding an ART Bank
export const addARTBankAsync = createAsyncThunk(
  'artBank/addARTBank',
  async (artBankData, { rejectWithValue }) => {
    try {
      const response = await addARTBank(artBankData); // Call API to add ART bank
      return response.data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add ART bank'); // Pass error message to the reducer
    }
  }
);

// Async thunk for fetching all ART Banks
export const fetchAllARTBanksAsync = createAsyncThunk(
  'artBank/fetchARTBanks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllARTBanks(); // Call API to fetch ART banks
      return response.data; // Return the response data
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch ART banks');
    }
  }
);

// Async thunk for deleting an ART Bank
export const deleteARTBankAsync = createAsyncThunk(
  'artBank/deleteARTBank',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteARTBankById(id); // Call API to delete ART bank
      return id; // Return the deleted bank's ID to update the state
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete ART bank');
    }
  }
);

// Async thunk for editing an ART Bank
export const editARTBankAsync = createAsyncThunk(
  'artBank/editARTBank',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      console.log(`Making API request to edit ART Bank with ID: ${id}`);
      const response = await editARTBankById(id, updatedData);
      console.log('API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to edit ART bank'
      );
    }
  }
);

// Slice for managing ART Bank actions
const bankSlice = createSlice({
  name: 'artBank',
  initialState,
  reducers: {
    resetARTBankState: (state) => {
      state.status = 'idle'; // Reset status
      state.error = null; // Clear error messages
      state.selectedBank = null; // Clear selected bank
    },
    selectBankForEdit: (state, action) => {
      state.selectedBank = action.payload; // Set the selected bank for editing
    },
  },
  extraReducers: (builder) => {
    builder
      // Add ART Bank
      .addCase(addARTBankAsync.pending, (state) => {
        state.status = 'loading'; // Set status to loading
        state.error = null; // Clear previous errors
      })
      .addCase(addARTBankAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to succeeded
        state.banks.push(action.payload); // Add the new bank to the list
      })
      .addCase(addARTBankAsync.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.payload; // Store the error message
      })
      // Fetch All ART Banks
      .addCase(fetchAllARTBanksAsync.pending, (state) => {
        state.status = 'loading'; // Set status to loading
        state.error = null; // Clear previous errors
      })
      .addCase(fetchAllARTBanksAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to succeeded
        state.banks = action.payload; // Populate the list of ART banks
      })
      .addCase(fetchAllARTBanksAsync.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.payload; // Store the error message
      })
      // Delete ART Bank
      .addCase(deleteARTBankAsync.pending, (state) => {
        state.status = 'loading'; // Set status to loading
        state.error = null; // Clear previous errors
      })
      .addCase(deleteARTBankAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to succeeded
        state.banks = state.banks.filter((bank) => bank.registrationId !== action.payload);
      })
      .addCase(deleteARTBankAsync.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.payload; // Store the error message
      })
      // Edit ART Bank
      .addCase(editARTBankAsync.pending, (state) => {
        state.status = 'loading'; // Set status to loading
        state.error = null; // Clear previous errors
      })
      .addCase(editARTBankAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Set status to succeeded
        state.banks = state.banks.map((bank) =>
          bank.registrationId === action.payload.registrationId ? action.payload : bank
        ); // Update the edited bank in the list
        state.selectedBank = action.payload; // Update the selected bank details
      })
      .addCase(editARTBankAsync.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed
        state.error = action.payload; // Store the error message
      });
  },
});

export const { resetARTBankState, selectBankForEdit } = bankSlice.actions;

export default bankSlice.reducer;

// Selectors
export const selectStatus = (state) => state.artBank.status;
export const selectError = (state) => state.artBank.error;
export const selectARTBanks = (state) => state.artBank.banks;
export const selectSelectedBank = (state) => state.artBank.selectedBank;
