const express = require("express");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");
const Product = require("../model/product");

//create shop
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
  try {
    const { email } = req.body;
    const sellerEmail = await Shop.findOne({ email });
  if (sellerEmail) {
  await cloudinary.uploader.destroy(req.file.filename);
  return next(new ErrorHandler("User already exists", 400));
}

const seller = {
  name: req.body.name,
  email: email,
  password: req.body.password,
  avatar: {
    public_id: req.file.filename,
    url: req.file.path,
  },
  address: req.body.address,
  phoneNumber: req.body.phoneNumber,
  zipCode: req.body.zipCode,
};
    const activationToken = createActivationToken(seller);

    const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

    try {
      await sendMail({
        email: seller.email,
        subject: "Activate your Shop",
        message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email:- ${seller.email} to activate your shop !`,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.messsage, 400));
  }
});

// create activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate shop
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET,
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar, zipCode, address, phoneNumber } =
        newSeller;
      let seller = await Shop.findOne({ email });
      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });
      sendShopToken(seller, 201, res);
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }),
);

// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all the fields", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist! ", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the ccorrect information.", 400),
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message));
    }
  }),
);

//load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller.id);

      if (!seller) {
        return next(new ErrorHandler(error.message, 500));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//log out from Shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
  secure: true,
      });

      res.status(201).json({
        success: true,
        message: "Log out Successful",
      });

      res.status(201).json({
        success: true,
        messGE: "Log out Successfull",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await Shop.findById(req.seller._id);

      if (existsUser.avatar && existsUser.avatar.public_id) {
        await cloudinary.uploader.destroy(existsUser.avatar.public_id);
      }

      const seller = await Shop.findByIdAndUpdate(
        req.seller._id,
        {
          avatar: {
            public_id: req.file.filename,
            url: req.file.path,
          },
        },
        { new: true },
      );

      // Update avatar inside all products
      await Product.updateMany(
        { shopId: seller._id.toString() },
        {
          $set: {
            "shop.avatar": seller.avatar,
          },
        },
      );

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//update seller info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Entered body");
      const { name, description, address, phoneNumber, zipCode } = req.body;

      const shop = await Shop.findOne(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("Shop not found!", 400));
      }

      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.zipCode = zipCode;

      await shop.save();

      // Update shop information inside all products
      await Product.updateMany(
        { shopId: shop._id.toString() },
        {
          $set: {
            "shop.name": shop.name,
            "shop.description": shop.description,
            "shop.address": shop.address,
            "shop.phoneNumber": shop.phoneNumber,
            "shop.zipCode": shop.zipCode,
          },
        },
      );

      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//get all sellers -- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// delete sellers---admin
router.delete("/delete-seller/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async(req,res,next)=>{
  try {
     const seller = await Shop.findById(req.params.id);

     if(!seller){
      return next(new ErrorHandler("Seller is not available with this id", 400));
     }

     await Shop.findByIdAndDelete(req.params.id);

     res.status(201).json({
      success: true,
      message:"Seller deleted successfully!",
     })
  } catch (error) {
      return next(new ErrorHandler(error.message, 500));
  }
}))

//update seller withdraw methods ----sellers
router.put("/update-payment-methods", isSeller, catchAsyncErrors(async(req, res, next)=>{
   try {
     const {withdrawMethod} = req.body;

     const seller = await Shop.findByIdAndUpdate(req.seller._id, {
       withdrawMethod,
     })

     res.status(201).json({
      success: true,
      seller,
      message:"Withdraw method added successfully!"
     })
   } catch (error) {
      return next(new ErrorHandler(error.message, 500));
   }
}))

//delete seller withdraw methods --- only seller
router.delete("/delete-withdraw-method", isSeller, catchAsyncErrors(async(req,res,next)=>{
  try {
     const seller = await Shop.findById(req.seller._id);

     if(!seller){
      return next(new ErrorHandler("Seller not found with this id", 400))
     }

     seller.withdrawMethod = null;

     await seller.save();

     res.status(201).json({
      success: true,
      seller,
      message: "Seller withdraw method deleted successfully!",
     })
  } catch (error) {
     return next(new ErrorHandler(error.message, 500));
  }
}))

module.exports = router;
