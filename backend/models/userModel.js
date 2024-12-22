import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        gender: {
            type: String,
            enums: ["M", "F"],
            required: true,
            default: "M"
        },
        friends: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                status: {
                    type: Number,
                    enums: [
                        0, // none
                        1, // sent
                        2, // received
                        3 //  friends
                    ]
                }
            }
        ]
    },
    {
        timestamps: true,
        strict: false
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// const User = mongoose.models.User || mongoose.model("User", userSchema);
const User = mongoose.model("User", userSchema);

export default User;
