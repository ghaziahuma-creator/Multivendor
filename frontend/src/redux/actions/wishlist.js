
//add to cart
export const addToWishlist = (data)=> async(dispatch, getState)=>{
    dispatch({
        type: "addToWishlist",
        payload: data,
    });

    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
}

//remove from cart 
export const removeFromWishlist = (data)=>(dispatch, getState) =>{
    dispatch({
        type: "removeFromWishlist" ,
        payload: data._id,
    })

    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
    return data;
}