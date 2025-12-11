import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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


const User = mongoose.model("User", userSchema)

export default User;