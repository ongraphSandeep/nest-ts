import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import axios from '@/configs/axios';
// ----------------------------------------------------------------------
const dammyData = [{
    id: 11,
    title: "perfume Oil",
    description: "Mega Discount, Impression of A...",
    price: 13,
    discountPercentage: 8.4,
    rating: 4.26,
    stock: 65,
    brand: "Impression of Acqua Di Gio",
    category: "fragrances",
    thumbnail: "https://i.dummyjson.com/data/products/11/thumbnail.jpg",
    images: [
      "https://i.dummyjson.com/data/products/11/1.jpg",
      "https://i.dummyjson.com/data/products/11/2.jpg",
      "https://i.dummyjson.com/data/products/11/3.jpg",
      "https://i.dummyjson.com/data/products/11/thumbnail.jpg"
    ]
  }]

const initialState: any = {
    isLoading: false,
    error: null,
    currentPage: null,
    offset: null,
    total: null,
    totalPage: null,
    currentStep: 1,
    data: dammyData
};

const slice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.isLoading = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // SET CURRENT STEP
        setData(state, action) {
            state.isLoading = false;
            state.data = action.payload;
        },
    },
});

// Reducer
export default slice.reducer;

// Actions
export const {
    setData,
} = slice.actions;

// ----------------------------------------------------------------------

// export function getData() {
//     return async (dispatch: Dispatch) => {
//         dispatch(slice.actions.startLoading());
//         try {
//             const response = await axios.get('/v1/data', { params: {} });
//             dispatch(slice.actions.setData(response.data?.data));
//         } catch (error) {
//             dispatch(slice.actions.hasError(error));
//         }
//     };
// }

// // ----------------------------------------------------------------------
