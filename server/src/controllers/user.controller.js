import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { uploadFiles } from '../utils/cloudinary.js'
import { v2 } from 'cloudinary'
import User from "../models/user.model.js";


const generateAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(400, 'User does not exists')
        }

        const accessToken = await user.generateAccessToken()

        await user.save({ validateBeforeSave: false })
        return { accessToken }
    } catch (error) {
        throw new ApiError(500, error.message)
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    const { userName, fullName, email, password } = req.body

    if (!userName || !fullName || !email || !password) {
        throw new ApiError(400, "All feilds are required")
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { userName }]
    })

    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists")
    }

    const user = new User({
        userName,
        fullName,
        email,
        password
    })

    try {
        await user.validate()
    } catch (error) {
        const validationErrors = [];
        for (const key in error.errors) {
            validationErrors.push(error.errors[key].message);
        }
        throw new ApiError(400, validationErrors.join(', '));
    }

    if (!req.file) {
        throw new ApiError(400, "avatar is required")
    }
    const avatarLocalPath = req.file.path;
    const avatarImage = await uploadFiles(avatarLocalPath)

    user.avatar.public_id = avatarImage?.public_id
    user.avatar.secure_url = avatarImage?.secure_url

    await user.save()
    user.password = undefined

    res.status(201).json(
        new ApiResponse(200, user, "User created successfully")
    )
})

export const loginUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body

    if (!userName && !email) {
        throw new ApiError(400, "username or email is required")
    }

    if (!password) {
        throw new ApiError(400, 'password is required')
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    }).select("+password")

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }

    const isCorrectPassword = await user.isPasswordCorrect(password)

    if (!isCorrectPassword) {
        throw new ApiError(401, 'Invalid user credentials')
    }

    user.password = undefined

    const { accessToken } = await generateAccessToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(201, user, 'user login successfully'))
})

export const logoutUser = asyncHandler(async (req, res) => {

    const options = {
        httpOnly: true,
        secure: true,
    }

    res
        .status(200)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(200, "user logout successfully")
        )
})

export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    res.status(200).json(
        new ApiResponse(200, user, 'User fetched successfully')
    )
})

export const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.user?._id)

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    await v2.uploader.destroy(user.avatar?.public_id, {
        resource_type: 'image'
    })

    res.status(200).json(
        new ApiResponse(200, '', "Profile deleted successfully")
    )
})