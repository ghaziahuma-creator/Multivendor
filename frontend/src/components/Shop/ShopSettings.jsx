import React, { useState } from "react";
import { backend_url, server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";
import axios from "axios";

const ShopSettings = () => {
     const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(seller && seller.description ? seller.description : "");
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();

    formData.append("image", e.target.files[0]);

    await axios
      .put(`${server}/shop/update-shop-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((res) => {
        dispatch(loadSeller());
        toast.success("Avatar updated successfully!");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    await axios.put(`${server}/shop/update-seller-info`,{
        name,
        description,
        address,
        phoneNumber,
        zipCode,
    },{withCredentials: true}).then((res)=>{
      toast.success("Shop info updated successfully!")
      dispatch(loadSeller());
    }).catch((error)=>{
        toast.error(error.response.data.message)
    });
  };
 
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
        <div className="w-full flex items-center justify-center relative ">
          <div className="relative">
            <img
              src={
                avatar
                  ? URL.createObjectURL(avatar)
                  : `${seller.avatar.url}`
              }
              alt=""
              className="w-[200px] h-[200px] object-cover rounded-full cursor-pointer "
            />
            <div className="w-[30px] h-[30px] bg-[#8f8f8f41] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px] ">
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>

        {/* shop info */}
        <form
          aria-required={true}
          className="flex flex-col items-center"
          onSubmit={updateHandler}
        >
          <div className="w-[90%] items-center 800px:w-[50%] mt-5">
            <div className="w-full pl-[1%]">
              <label className="block pb-2">Shop Name</label>
            </div>
            <input
              type="name"
              placeholder={`${seller?.name}`}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-[90%] items-center 800px:w-[50%] mt-5">
            <div className="w-full pl-[1%]">
              <label className="block pb-2">Shop Description</label>
            </div>
            <input
              type="name"
              placeholder={
                seller?.description
                  ? seller.description
                  : "Enter your shop description"
              }
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="w-[90%] items-center 800px:w-[50%] mt-5">
            <div className="w-full pl-[1%]">
              <label className="block pb-2">Shop Address</label>
            </div>
            <input
              type="name"
              placeholder={`${seller?.address}`}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="w-[90%] items-center 800px:w-[50%] mt-5">
            <div className="w-full pl-[1%]">
              <label className="block pb-2">Shop PhoneNumber</label>
            </div>
            <input
              type="name"
              placeholder={`${seller?.phoneNumber}`}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="w-[90%] items-center 800px:w-[50%] mt-5">
            <div className="w-full pl-[1%]">
              <label className="block pb-2">Shop ZipCode</label>
            </div>
            <input
              type="name"
              placeholder={`${seller?.zipCode}`}
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
            />
          </div>

          <div className="w-[90%] items-center 800px:w-[50%] mt-7">
            <input
              type="submit"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              readOnly
              value="Update Shop"
              //onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
