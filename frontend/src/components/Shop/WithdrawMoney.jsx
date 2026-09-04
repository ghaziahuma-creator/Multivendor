import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { loadSeller, loadUser } from "../../redux/actions/user";
import { AiOutlineDelete } from "react-icons/ai";

const WithdrawMoney = () => {
  const { seller } = useSelector((state) => state.seller);
                 const availableBalance = seller?.availableBalance ||0;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: null,
    bankAccountNumber: null,
    bankHolderName: "",
    bankAddress: "",
  });
      

      
    

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawMethod = {
      bankName: bankInfo.bankName,
      bankCountry: bankInfo.bankCountry,
      bankSwiftCode: bankInfo.bankSwiftCode,
      bankAccountNumber: bankInfo.bankAccountNumber,
      bankHolderName: bankInfo.bankHolderName,
      bankAddress: bankInfo.bankAddress,
    };

    try {
      await axios
        .put(
          `${server}/shop/update-payment-methods`,
          {
            withdrawMethod,
          },
          {
            withCredentials: true,
          },
        )
        .then((res) => {
          toast.success(res.data.message);
          setPaymentMethod(res.seller.withdrawMethod)
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }

    setBankInfo({
      bankName: "",
      bankCountry: "",
      bankSwiftCode: null,
      bankAccountNumber: null,
      bankHolderName: "",
      bankAddress: "",
    });
    setPaymentMethod(false);
    dispatch(loadSeller());
  };

  const deleteHandler = async () => {
    await axios.delete(`${server}/shop/delete-withdraw-method`,{
    withCredentials: true}).then((res)=>{
      toast.success(res.data.message);
      dispatch(loadSeller());
    }).catch((error)=>{
      toast.error(error);
    });
  };

  const error= ()=>{
    toast.error("You dont have enough balance to withdraw!")
  }


    
  const withdrawHandler = async()=>{
    if(withdrawAmount < 50 || withdrawAmount > availableBalance){
      toast.error("You can't withdraw this amount!")
    }else{
     const amount = withdrawAmount;
     await axios.post(`${server}/withdraw/create-withdraw-request`,{amount},{withCredentials: true}).then((res)=>{
      setWithdrawAmount(null);
       dispatch(loadSeller());
      toast.success(res.data.message);
       
     }).catch((error)=>{
        toast.error(error.response.data.message)
      })
    }
  }


  return (
    <div className="w-full h-[90vh] p-8 rounded">
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
        <h5 className="text-[20px] pb-4">
          Available Balance: ${availableBalance.toFixed(2)}
        </h5>
        <div
          className={`${styles.button} text-white h-[42px] !rounded`}
          onClick={() => availableBalance < 50 ? error() : setOpen(true)}
        >
          Withdraw
        </div>
      </div>
      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
          <div
            className={`w-[95%] 800px:w-[50%] bg-white shadow rounded ${paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"} min-h-[40vh] p-3`}
          >
            <div className="w-full flex justify-end pb-4">
              <RxCross1
                size={25}
                onClick={() => setOpen(false) || setPaymentMethod(false)}
                className="cursor-pointer"
              />
            </div>
            {paymentMethod ? (
              <div>
                <h3 className="tet-[22px] font-Poppins text-center font-[700]">
                  Add new Withdraw Methods:
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="pt-4">
                    <label>
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      required
                      value={bankInfo.bankName}
                      onChange={(e) =>
                        setBankInfo({ ...bankInfo, bankName: e.target.value })
                      }
                      id=""
                      placeholder="Enter your bank name!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-4">
                    <label>
                      Bank Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      required
                      value={bankInfo.bankCountry}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankCountry: e.target.value,
                        })
                      }
                      id=""
                      placeholder="Enter your Bank Country!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-4">
                    <label>
                      Bank swift code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name=""
                      required
                      value={bankInfo.bankSwiftCode}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankSwiftCode: e.target.value,
                        })
                      }
                      id=""
                      placeholder="Enter your bank swift code!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-4">
                    <label>
                      Bank account number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name=""
                      required
                      value={bankInfo.bankAccountNumber}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAccountNumber: e.target.value,
                        })
                      }
                      id=""
                      placeholder="Enter your bank account number!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-4">
                    <label>
                      Bank Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      required
                      value={bankInfo.bankHolderName}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankHolderName: e.target.value,
                        })
                      }
                      id=""
                      placeholder="Enter your holder name!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-4">
                    <label>
                      Bank Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name=""
                      required
                      value={bankInfo.bankAddress}
                      onChange={(e) =>
                        setBankInfo({
                          ...bankInfo,
                          bankAddress: e.target.value,
                        })
                      }
                      id=""
                      placeholder="Enter your Bank Address!"
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="pt-8">
                    <input
                      type="submit"
                      value="Add"
                      className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            ) : (
              <>
                <h3 className="text-[22px] font-Poppins">
                  {" "}
                  Available Withdraw Methods
                </h3>
                {seller && seller?.withdrawMethod ? (
                  <div>
                    <div className="800px:flex w-full justify-between items-center">
                      <div className="800px:w-[50%]">
                        <h5>
                          Account Number:{" "}
                          {"*".repeat(
                            seller?.withdrawMethod.bankAccountNumber.length - 3,
                          ) +
                            seller?.withdrawMethod.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>Bank Name: {seller?.withdrawMethod.bankName}</h5>
                      </div>
                      <div className="800px:w-[50%]">
                        <AiOutlineDelete
                          size={25}
                          className="cursor-pointer"
                          onClick={() => deleteHandler()}
                        />
                      </div>
                    </div>
                    <br />
                    <h4>Available Balance: {availableBalance.toFixed(2)}$</h4>
                    <br />
                    <div className="800px:flex w-full items-center">
                      <input
                        type="number"
                        placeholder="Amount..."
                        value={withdrawAmount}
                        onChange={(e)=> setWithdrawAmount(Number(e.target.value))}
                        className="800px:w-[100%] w-[full] border 800px:mr-3 p-1 rounded "
                      />
                      <div className={`${styles.button} !h-[42px] text-white`} onClick={withdrawHandler || setOpen(false)}>
                        Withdraw
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4">
                    <p className="text-[18px] pt-2">
                      No Payment methods Available!
                    </p>
                    <div className="w-full flex items-center pt-4">
                      <div
                        className={`${styles.button} text-[#fff] text-[18px] mt-4`}
                        onClick={() => setPaymentMethod(true)}
                      >
                        Add new
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
