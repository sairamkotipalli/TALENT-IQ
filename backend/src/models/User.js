import mongoose from "mongoose";

const userSchenma = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        profileImage: {
            type: String,
            default: "",
        },
        clerkID:{
            type: String,
            required: true,
            unique: true,
        },
    },{timestamps: true} //createdAt, updatedAt (like member Since 2022)
);


const User = mongoose.model("User", userSchenma)

export default User;