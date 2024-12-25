import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);

        if (user._doc && user._doc._id) user = user._doc;
        delete user.password;

        res.json({
            ...user
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, dob, gender } = req.body;
    console.log("REGISTER");

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    let user = await User.create({
        name,
        email,
        password,
        dob,
        gender
    });

    if (user) {
        generateToken(res, user._id);

        if (user._doc && user._doc._id) user = user._doc;
        delete user.password;
        res.status(201).json({
            // _id: user._id,
            // name: user.name,
            // email: user.email,
            // dob: user.dob,
            // gender: user.gender
            ...user
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    let user = await User.findById(req.user._id).select("-password");

    if (user) {
        if (user._doc && user._doc._id) user = user._doc;
        res.json({
            ...user
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    let user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.dob = req.body.dob || user.dob;
        user.gender = req.body.gender || user.gender;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        let again = await User.findById(req.user._id).select("-password");

        if (again._doc && again._doc._id) user = again._doc;
        res.json({
            ...user
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// GOOGLE AUTHENTICATION of USER
// @desc    From google's sign in create user and return or return  user if already exist with same email
// @route   POST /api/users/auth/google
// @access  Public
const googleAuthUser = asyncHandler(async (req, res) => {
    const { name, email, pic } = req.body;

    let user = null;
    user = await User.findOne({ email }).select("-password");

    // create if not present
    if (!user) {
        user = await User.create({
            name,
            email,
            pic,
            dob: new Date("2000-01-01"), // default
            gender: "M" //default
        });
    }

    if (user) {
        generateToken(res, user._id);
        res.status(200).json(user);
    } else {
        res.status(400);
        throw new Error("Invalid user data for google sign in");
    }
});

// @desc    get all friends and other people
// @route   GET /api/users?search=
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search, $options: "i" } },
                  { email: { $regex: req.query.search, $options: "i" } }
              ]
          }
        : {};

    const users = await User.find(keyword)
        .find({ _id: { $ne: req.user._id } })
        .select("-password");
    res.status(200).json(users);
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    googleAuthUser,
    searchUsers
};
