import asyncHandler from "express-async-handler";

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const uploadFiles = asyncHandler(async (req, res) => {
    const { user } = req;
    console.log(req.body);
});

export { uploadFiles };
