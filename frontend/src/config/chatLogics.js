export const getSender = (me, users) => {
    if (me === users[0]._id) return users[1];
    return users[0];
};
