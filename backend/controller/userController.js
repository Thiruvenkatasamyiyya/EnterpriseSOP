import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import User from "../models/User.js";

// -------------------- Helper middleware for admin --------------------
// Removed broken requireAdmin

// -------------------- Register User --------------------
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  try {
    await User.create({ name, email, password });
    res.status(201).json({ message: "wait for permit an access" });
  } catch (error) {
    return next(error);
  }
});

// -------------------- Login User --------------------
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (user.access !== "approved") {
    return res.status(401).json({ message: `Your Status is ${user.access}` });
  }

  // Order matters: check existence first
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 201, res);
});

// -------------------- Logout --------------------
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "null", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ message: "Logged out" });
});

// -------------------- Forgot Password --------------------
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 401));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = getResetPasswordTemplate(user, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecom password recovery",
      message,
    });
    res.status(200).json({ message: `Email sent to:${user.email}` });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }
});

// -------------------- Reset Password --------------------
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Password reset token is invalid or has been expires", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

// -------------------- Get Current User Profile --------------------
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  res.status(200).json({ user });
});

// -------------------- Update Password --------------------
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user?._id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  user.password = req.body.password;
  await user.save();
  res.status(200).json({ success: true });
});

// -------------------- Admin: Get All Users --------------------
export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({ users });
});

// -------------------- Admin: Get User Details --------------------
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found with id ${req.params.id}`, 400));
  }
  res.status(200).json({ user });
});

// -------------------- Admin: Update User --------------------
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, { new: true });
  res.status(200).json({ user });
});

// -------------------- Admin: Delete User --------------------
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found with id ${req.params.id}`, 400));
  }
  await user.deleteOne();
  res.status(200).json({ success: true });
});

// -------------------- Get own profile (alias) --------------------
export const me = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user?._id);
  res.status(200).json({ user });
});

// -------------------- Admin: Permit User (change access) --------------------
export const adminPermit = catchAsyncErrors(async (req, res, next) => {
  const { id, action } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler(`User not found with id ${id}`, 400));
  }
  const response = await User.findByIdAndUpdate(
    id,
    { $set: { access: action } },
    { new: true }
  );
  if (!response) {
    return next(new ErrorHandler("Error occurs in change permission", 400));
  }
  res.status(200).json({ response });
});