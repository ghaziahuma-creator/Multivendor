import axios from "axios";
import {server} from "../../server"

// get all sellers ----admin
export const getAllSellers = ()=> async(dispatch)=>{
    try {
         dispatch({
        type: "loadAdminSellerRequest",
       });

       const {data} = await axios.get(`${server}/shop/admin-all-sellers`, {withCredentials: true});

       dispatch({
        type:"loadAdminSellerSuccess",
        payload: data.sellers,
       })
    } catch (error) {
         dispatch({
        type: "loadAdminSellerFail",
           payload: error.response?.data?.message || error.message,
       });
    }
}