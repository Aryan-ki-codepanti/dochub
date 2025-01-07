export const getTotalMessages = transformedMessages => {
    let sum = 0;
    for (let chat in transformedMessages)
        sum += transformedMessages[chat].length;
    return sum;
};

export const getFavouriteGroup = (chats, messages) => {
    let groupChats = chats.filter(x => x.isGroupChat);
    if (!groupChats.length) return [0, "NONE"];

    let maxV = 0,
        maxGroup = "NONE";
    groupChats.forEach(x => {
        if (maxV < messages[x._id].length) {
            maxV = messages[x._id].length;
            maxGroup = x.chatName;
        }
    });
    return [maxV, maxGroup];
};

export const getFavouriteFriend = (chats, messages) => {
    let friendChats = chats.filter(x => !x.isGroupChat);
    if (!friendChats.length) return [0, "NONE"];

    let maxFV = 0,
        maxFriend = "NONE";
    friendChats.forEach(x => {
        if (maxFV < messages[x._id].length) {
            maxFV = messages[x._id].length;
            maxFriend = x;
        }
    });
    return [maxFV, maxFriend];
};
