import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder.
    addCase("LoadUserRequest", (state)=>{
        state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action)=>{
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
    })
    .addCase("LoadUserFail", (state, action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    })
    //update user info
    .addCase("updateUserInfoRequest",(state)=>{
       state.loading= true;
    })
    .addCase("updateUserInfoSuccess",(state, action)=>{
       state.loading = false;
        state.user = action.payload;
    })
    .addCase("updateUserInfoFailed",(state, action)=>{
       state.error = action.payload;
    })
    //update user address
     .addCase("updateUserAddressRequest",(state)=>{
       state.addressLoading = true;
    })
    .addCase("updateUserAddressSuccess",(state, action)=>{
       state.addressLoading =false;
       state.successMessage = action.payload.successMessage;
       state.user=action.payload.user;
    })
    .addCase("updateUserAddressFailed",(state, action)=>{
        state.addressLoading = false;
        state.error = action.payload;
    })
    //delete user address
    .addCase("deleteUserAddressRequest",(state)=>{
        state.addressDeleteLoading = true;
    })
    .addCase("deleteUserAddressSuccess",(state, action)=>{
        state.addressDeleteLoading = false;
        state.successMessage = action.payload.successMessage;
       state.user=action.payload.user;
    })
    .addCase("deleteUserAddressFailed",(state, action)=>{
        state.addressDeleteLoading = false;
        state.error = action.payload;
    })

    //get all users for admin
        .addCase("getAllUsersAdminRequest",(state)=>{
        state.adminUserLoading = true;
    })
    .addCase("getAllUsersAdminSuccess",(state, action)=>{
        state.adminUserLoading = false;
       state.users = action.payload;
    })
    .addCase("getAllUsersAdminFailed",(state, action)=>{
        state.adminUserLoading = false;
        state.error = action.payload;
    })

     .addCase("clearErrors",(state)=>{
       state.error= null;
    })
    .addCase("clearMessages",(state)=>{
       state.successMessage= null;
    })
});