const User = require("../models/user");
const ErroHandler = require("../utils/errorHandler");
const catchAsynErrors = require("../middlewares/catchAsyncErrors");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { request } = require("express");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendMail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
///---------------------------------------------------------------------------
//register a user => /api/v1/register
exports.registerUser = catchAsynErrors(async (req, res, next) => {
     const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
     });

     const { name, email, password } = req.body;
     const user = await User.create({
          name,
          email,
          password,
          avatar: {
               public_id: result.public_id,
               url: result.secure_url,
          },
     });
     sendToken(user, 200, res);
});

// login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
     const { email, password } = req.body;
     //check
     if (!email || !password) {
          return next(new ErrorHandler("nhap email va password", 400));
     }
     //finding user in database
     const user = await User.findOne({ email }).select("+password");
     if (!user) {
          return next(new ErroHandler("email || password khong dung"), 401);
     }
     //check pass
     const isPassWordMatched = await user.comparePassword(password);
     if (!isPassWordMatched) {
          return next(new ErroHandler("email || password khong dung", 401));
     }
     sendToken(user, 200, res);
});

//forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
     const user = await User.findOne({ email: req.body.email });
     if (!user) {
          return next(new ErroHandler("không tồn tại tài khoản với địa chỉ email này.", 404));
     }
     //get reset token
     const resetToken = user.getResetPasswordToken();
     await user.save({ validateBeforeSave: false });
     //create reset password url
     const resestUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
     const message = `Mật khẩu của bạn đã được đặt lại\nVui lòng truy cập đường dẫn để tạo mới mật khẩu\n${resestUrl}`;
     try {
          await sendEmail({
               email: user.email,
               subject: "CỬA HANG THỰC PHẨM CẤP LẠI MẬT KHẨU",
               message,
          });
          res.status(200).json({
               success: true,
               message: `Đã gửi vào email: ${user.email}`,
          });
     } catch (error) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save({ validateBeforeSave: false });
          return next(new ErrorHandler(error.message, 500));
     }
});

//logout user => /api/v1/logout
exports.logout = catchAsynErrors(async (req, res, next) => {
     res.cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
     });
     res.status(200).json({
          success: true,
          message: "logout",
     });
});

//reset password => /api/v1/password/reset/:token
exports.resetPasswordToken = catchAsynErrors(async (req, res, next) => {
     //hash url token
     const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
     const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() },
     });
     if (!user) {
          return next(new ErrorHandler("password reset token is invalid or has been expired", 400));
     }
     if (req.body.password !== req.body.confirmPassword) {
          return next(new ErrorHandler("password does not match", 400));
     }
     //setup new password
     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpire = undefined;
     await user.save();
     sendToken(user, 200, res);
});

//get ccurrently logged in user details => /api/v1/me
exports.getUserProfile = catchAsynErrors(async (req, res, next) => {
     const user = await User.findById(req.user.id);
     res.status(200).json({
          success: true,
          user,
     });
});

//update / change password => /api/v1/password/update
exports.updatePassword = catchAsynErrors(async (req, res, next) => {
     const user = await User.findById(req.user.id).select("+password");
     //check previous user password
     const isMatched = await user.comparePassword(req.body.oldPassword);
     if (!isMatched) {
          return next(new ErroHandler("Mật khẩu củ không chính xác", 400));
     }
     user.password = req.body.password;
     await user.save();
     sendToken(user, 200, res);
});

//update user profile => api/v1/me/update
exports.updateProfile = catchAsynErrors(async (req, res, next) => {
     const newUserData = {
          name: req.body.name,
          email: req.body.email,
     };
     //uodate avater
     if (req.body.avatar !== "") {
          const user = await User.findById(req.user.id);
          const image_id = user.avatar.public_id;
          const res = await cloudinary.v2.uploader.destroy(image_id);
          const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
               folder: "avatars",
               width: 150,
               crop: "scale",
          });
          newUserData.avatar = {
               public_id: result.public_id,
               url: result.secure_url,
          };
     }
     const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
          new: true,
          runValidators: true,
          userFindAndModify: false,
     });
     res.status(200).json({
          success: true,
     });
});

//----------------------------------------------------------------------
//admin router
//get all user => /api/v1/admin/users
exports.allUsers = catchAsynErrors(async (req, res, next) => {
     const users = await User.find();
     res.status(200).json({
          success: true,
          users,
     });
});

// get user dateils => /api/v1/admin/user/:id
exports.getUserDetails = catchAsynErrors(async (req, res, next) => {
     const user = await User.findById(req.params.id);
     if (!user) {
          return next(new ErroHandler(`user not found with id: ${req.params.id}`, 400));
     }
     res.status(200).json({
          success: true,
          user,
     });
});

//update user profile => api/v1/admin/user/:id
exports.updateUser = catchAsynErrors(async (req, res, next) => {
     const newUserData = {
          name: req.body.name,
          email: req.body.email,
          role: req.body.role,
     };
     const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
          new: true,
          runValidators: true,
          userFindAndModify: false,
     });
     res.status(200).json({
          success: true,
     });
});

// delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsynErrors(async (req, res, next) => {
     const user = await User.findById(req.params.id);
     if (!user) {
          return next(new ErroHandler(`user not found with id: ${req.params.id}`, 400));
     }
     //remove avatar from cloudinary -TODO
     const image_id = user.avatar.public_id;
     await cloudinary.v2.uploader.destroy(image_id);
     await user.remove();
     res.status(200).json({
          success: true,
     });
});
