const express = require("express");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { JsonWebTokenError } = require("jsonwebtoken");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const User = require("../model/user");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

if (userEmail) {
  await cloudinary.uploader.destroy(req.file.filename);
  return next(new ErrorHandler("User already exists", 400));
}

const user = {
  name: name,
  email: email,
  password: password,
  avatar: {
    public_id: req.file.filename,
    url: req.file.path,
  },
};

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your Account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account !`,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 400));
    }
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET,
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar } = newUser;
      console.log("Email from token:", email);
      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const createdUser = await User.create({
        name,
        email,
        avatar,
        password,
      });
      sendToken(createdUser, 201, res);
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }),
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide all the fields", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exist! ", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the ccorrect information.", 400),
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message));
    }
  }),
);

//load user

router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler(error.message, 500));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//log out user
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
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

//update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { name, email, phoneNumber, password } = req.body;

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(newErrorHandler("User not found!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          newErrorHandler("Please provide correct information!", 400),
        );
      }

      ((user.name = name),
        (user.email = email),
        (user.phoneNumber = phoneNumber),
        await user.save());

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.user.id);

      if (existsUser.avatar && existsUser.avatar.public_id) {
        await cloudinary.uploader.destroy(existsUser.avatar.public_id);
      }

      const user = await User.findByIdAndUpdate(req.user.id, {
        avatar: {
          public_id: req.file.filename,
          url: req.file.path,
        },
      });

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      

      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType,
      );

      if (sameTypeAddress) {
        return next(
          new ErrorHandler(
            `${req.body.addressType} address already exists`,
            500,
          ),
        );
      }

      const existAddress = user.addresses.find(
        (address) => address._id === req.body._id,
      );

      if (existAddress) {
        Object.assign(existAddress, req.body);
      } else {
        //addnew address to the array
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

//delete user address
router.delete("/delete-user-address/:id",isAuthenticated, catchAsyncErrors(async(req, res, next)=>{
   try {
    console.log("entered try")
       const userId = req.user._id;
       
       const addressId = req.params.id;
       
       
       await User.updateOne({
        _id: userId
       }, {
        $pull: {addresses :{_id: addressId}}
       })

       

       const user = await User.findById(userId);
         
       res.status(201).json({
        success: true,
        user,
       })

   } catch (error) {
      return next(new ErrorHandler(error.message, 500));
   }
}))

// update user password
router.put("/update-user-password", isAuthenticated, catchAsyncErrors(async(req, res, next)=>{
  try {
    console.log(req.user);
     const user = await User.findOne(req.user._id).select("+password");

     const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

     if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect!", 400));
     }

     if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match with each other!", 400));
     }

     user.password = req.body.newPassword;
     await user.save();

     res.status(201).json(
      {success: true,
      message: "Password updated sucessfully!",}
     )

  } catch (error) {
     return next(new ErrorHandler(error.message, 500));
  }
}))
 
//get user info with userId
router.get("/user-info/:id", catchAsyncErrors(async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);

    res.status(201).json({
      success: true,
      user,
    })
  } catch (error) {
   return next(new ErrorHandler(error.message, 500)); 
  }
}))

//get all users -- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// delete users---admin
router.delete("/delete-user/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async(req,res,next)=>{
  try {
     const user = await User.findById(req.params.id);

     if(!user){
      return next(new ErrorHandler("User is not available with this id", 400));
     }

     await User.findByIdAndDelete(req.params.id);

     res.status(201).json({
      success: true,
      message:"User deleted successfully!",
     })
  } catch (error) {
      return next(new ErrorHandler(error.message, 500));
  }
}))


module.exports = router;
