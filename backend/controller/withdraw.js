const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();
const Shop = require("../model/shop");

// create withdraw request --- for Seller
router.post("/create-withdraw-request", isSeller, catchAsyncErrors(async(req,res,next)=>{
    try {
        const {amount} = req.body;
       const data = {
        seller: req.seller,
        amount,
       } 
      
           try {
             await sendMail({
        email: req.seller.email,
        subject: "Withdraw Request ",
        message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3 days to 7 days for processing!`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${req.seller.email} to activate your account !`,
      });
       } catch (error) {
          return next(new ErrorHandler(error.message), 500);
       }

        const withdraw = await Withdraw.create(data);

        const shop = await Shop.findById(req.seller._id);

        shop.availableBalance = shop.availableBalance - amount;

        await shop.save();


       res.status(201).json({
        success: true,
        withdraw,
        message: "Your withdraw request has been sent successfully!"
       })
    } catch (error) {
     return next(new ErrorHandler(error.message, 500));    
    }
}))

// get all withdraws ---admin

router.get("/get-all-withdraw-request", isAuthenticated, catchAsyncErrors(async(req,res,next)=>{
  try {
    const withdraws = await Withdraw.find().sort({ createdAt: -1});

    res.status(201).json({
      success: true,
      withdraws,
    })
  } catch (error) {
     return next(new ErrorHandler(error.message, 500));    
  }
}))

//update withdraw request ---admin
router.put("/update-withdraw-request/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async(req,res,next)=>{
  const {sellerId} = req.body;

  const withdraw = await Withdraw.findByIdAndUpdate(req.params.id,{status: "succeed", updatedAt: Date.now()}, {new: true});

  const seller = await Shop.findById(sellerId);

  const transection = {
    _id: withdraw._id,
    amount: withdraw.amount,
    updatedAt: withdraw.updatedAt,
    status: withdraw.status,
  };
  
   seller.transections = [...seller.transections, transection];

   await seller.save();

   try {
      await sendMail({
        email: seller.email,
        subject: "Payment confirmation",
        message: `Hello ${seller.name}, Your withdraw request for ${withdraw.amount}$ is on the way. Delivery time depends on your banks rules . It usually takes 3 to 7 days.`
      })
      res.status(201).json({
        success: true,
        withdraw,
        message: `Withdraw status updated qand confirmation email sent to ${seller.name}`
      })
   } catch (error) {
         return next(new ErrorHandler(error.message, 500));    

   }

}))

module.exports = router;



   