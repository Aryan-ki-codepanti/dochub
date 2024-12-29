export const groupByGroupId = objects => {
    const grouped = {};

    objects.forEach(obj => {
        let { groupId } = obj;
        groupId = groupId._id;
        if (!grouped[groupId]) {
            grouped[groupId] = [];
        }
        grouped[groupId].push(obj);
    });

    // Transform into the desired format
    return Object.entries(grouped).map(([groupId, groupedList]) => ({
        groupId,
        chatName: groupedList[0].groupId.chatName,
        groupedList
    }));
};
