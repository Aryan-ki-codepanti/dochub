import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// @desc    get all friends and other people
// @route   GET /api/friends or /api/friends?search=
// @access  Private
const getAllPeople = asyncHandler(async (req, res) => {
    if (req.query.search) {
        const keyword = {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        };

        const users = await User.find(keyword)
            .find({
                _id: { $ne: req.user._id }
            })
            .select("-password");
        const final = [];
        for (let f of users) {
            if (
                req.user?.friends?.find(
                    x =>
                        x.user.toString() === f._id.toString() &&
                        x?.status === 3
                )
            )
                final.push(f);
        }
        res.json(final);
        return;
    }

    try {
        let user = await User.findById(req.user._id);
        // friends
        let friends = user.friends;
        let ids = friends.map(x => x.user);
        let ans = [];

        if (friends?.length > 0) {
            const friendsDetails = await User.find(
                { _id: { $in: friends.map(x => x.user) } }, // Match friends by IDs
                { name: 1, gender: 1, pic: 1, email: 1 } // Select only the name and gender fields
            )
                .select("-password")
                .lean();

            const friendsMap = friendsDetails.reduce((map, friend) => {
                map[friend._id.toString()] = friend;
                return map;
            }, {});

            const combinedDetails = friends.map(friend => ({
                ...friendsMap[friend.user.toString()], // Get details from the map
                status: friend.status // Add the status from the input array
            }));
            ans.push(...combinedDetails);
        }

        // others
        const query = ids && ids.length > 0 ? { _id: { $nin: ids } } : {}; // Exclude IDs if provided
        let moreUsers = await User.find(query) // Fetch users
            .limit(10) // Limit results to 10
            .select("name gender pic email") // Select desired fields
            .lean();

        ans.push(...moreUsers);
        ans = ans.filter(x => x._id.toString() != req.user._id.toString());
        res.json({ people: ans, friends });
    } catch (error) {
        res.status(300);
        console.log("GETALL PEOPLE ERROR", error);
        throw new Error("Some error while friends get");
    }
});

// @desc    cancel(0) send(1) accept(2) reject(3) friend requests
// @route   GET /api/friends/action
// @access  Private
const updateFriendStatus = asyncHandler(async (req, res) => {
    try {
        let me = req.user._id;
        let they = req.body.id;
        let action = req.body.action;

        let userMe = await User.findById(me);
        let userThey = await User.findById(they);

        if (!userMe?.friends) userMe.friends = [];
        if (!userThey?.friends) userThey.friends = [];

        // console.log(userThey);

        // console.log("REQUEST RECEIVED");
        // console.log(me, they, action);

        // action 0 , 1, 2, 3,4
        // cancel(0) / send(1) /accept(2)/reject(3) / unfriend(4)

        switch (action) {
            case 0: // CANCEL REQUEST
                userMe.friends = userMe.friends.filter(
                    x => x.user.toString() != they.toString()
                );
                userThey.friends = userMe.friends.filter(
                    x => x.user.toString() !== me.toString()
                );
                break;

            case 1: // SEND REQUEST
                userMe.friends.push({ user: they, status: 1 });
                userThey.friends.push({ user: me, status: 2 });
                break;

            case 2: // ACCEPT REQUEST
                let doneA = false,
                    doneB = false;
                for (let f of userMe.friends) {
                    if (f.user.toString() === they.toString()) {
                        f.status = 3;
                        doneA = true;
                    }
                }
                for (let f of userThey.friends) {
                    if (f.user.toString() === me.toString()) {
                        f.status = 3;
                        doneB = true;
                    }
                }

                if (!doneA || !doneB) {
                    userMe.friends = userMe.friends.filter(
                        x => x.user.toString() != they.toString()
                    );
                    userThey.friends = userMe.friends.filter(
                        x => x.user.toString() !== me.toString()
                    );
                    userMe.friends.push({ user: they, status: 3 });
                    userThey.friends.push({ user: me, status: 3 });
                }
                break;
            case 3:
                userMe.friends = userMe.friends.filter(
                    x => x.user.toString() != they.toString()
                );
                userThey.friends = userMe.friends.filter(
                    x => x.user.toString() !== me.toString()
                );
                break;
            case 4:
                userMe.friends = userMe.friends.filter(
                    x => x.user.toString() != they.toString()
                );
                userThey.friends = userMe.friends.filter(
                    x => x.user.toString() !== me.toString()
                );
                break;
            default:
                console.log("INVALID ACTION FOR updateFriendStatus()");
                break;
        }
        // console.log(userMe);
        // console.log(userThey);
        await userMe.save();
        await userThey.save();

        res.json({ status: 200 });
    } catch (error) {
        res.status(300);
        console.log("UPDATE FRIEND ERROR", error);
        throw new Error("UPDATE FRIEND ERROR");
    }
});

// @desc    get my friends details
// @route   GET /api/friends/my
// @access  Private
const getMyFriends = asyncHandler(async (req, res) => {
    try {
        const me = await User.findById(req.user._id).populate({
            path: "friends.user",
            select: "-password"
        });
        me.friends = me.friends.filter(friend => friend.status === 3);

        return res.status(200).json(me.friends);
    } catch (error) {
        res.status(500).json({ message: "Unable to get friends", error });
        console.log("getMyFriends  ERROR", error);
        throw new Error("Some error while friends get");
    }
});

export { getAllPeople, updateFriendStatus, getMyFriends };
