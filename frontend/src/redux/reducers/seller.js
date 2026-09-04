import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading: true,
};

export const sellerReducer = createReducer(initialState, (builder) => {
    builder.
    addCase("LoadSellerRequest", (state)=>{
        state.isLoading = true;
    })
    .addCase("LoadSellerSuccess", (state, action)=>{
        state.isSeller = true;
        state.isLoading = false;
        state.seller = action.payload;
    })
    .addCase("LoadSellerFail", (state, action)=>{
        state.isLoading = false;
        state.error = action.payload;
        state.isSeller = false;
    })
    .    addCase("loadAdminSellerRequest", (state)=>{
        state.isSellersLoading = true;
    })
    //get all sellers
    .addCase("loadAdminSellerSuccess", (state, action)=>{
        state.isSellersLoading = false;
        state.sellers = action.payload;
    })
    .addCase("loadAdminSellerFail", (state, action)=>{
        state.isSellersLoading = false;
        state.error = action.payload;
    })
    .addCase("clearErrors",(state)=>{
       state.error= null;
    })
});