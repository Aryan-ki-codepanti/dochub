export const getTotalMessages = (me, transformedMessages) => {
    let sum = 0;
    for (let chat in transformedMessages)
        sum += transformedMessages[chat].filter(
            x => x?.sender?._id === me
        ).length;
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

export const getPlotMessagesData = (me, messages) => {
    let ans = [];
    for (let mesgs of Object.values(messages)) {
        mesgs.forEach(m => {
            if (m?.sender?._id === me) ans.push(m);
        });
    }
    let counter = {};
    const dateForm = new Intl.DateTimeFormat("en-CA");

    let dt;
    ans.forEach(m => {
        dt = dateForm.format(new Date(m.createdAt));
        if (!counter[dt]) counter[dt] = 0;
        counter[dt]++;
    });
    return counter;
};
export const getPlotFileData = files => {
    let counter = {};
    const dateForm = new Intl.DateTimeFormat("en-CA");

    let dt;
    files.forEach(f => {
        dt = dateForm.format(new Date(f.createdAt));
        if (!counter[dt]) counter[dt] = 0;
        counter[dt]++;
    });
    return counter;
};

// Input datasets

export const mergePlotData = (data1, data2) => {
    /*
    const data1 = {
        labels: ["2024-12-23", "2025-01-07", "2025-01-06"],
        datasets: [
            {
                label: "Messages",
                data: [5, 10, 7], // Corresponding to the dates in data1.labels
                borderColor: "blue"
            }
        ]
    };

    const data2 = {
        labels: ["2025-01-05", "2024-12-28", "2024-12-27"],
        datasets: [
            {
                label: "Files",
                data: [3, 6, 8], // Corresponding to the dates in data2.labels
                borderColor: "red"
            }
        ]
    };*/

    // Merge the labels and sort them
    const unifiedLabels = Array.from(
        new Set([...data1.labels, ...data2.labels])
    ).sort((a, b) => new Date(a) - new Date(b));

    // Helper function to map data to unified labels
    const mapDataToUnifiedLabels = (labels, data, unifiedLabels) =>
        unifiedLabels.map(label => {
            const index = labels.indexOf(label);
            return index !== -1 ? data[index] : 0; // Insert null for missing values
        });

    // Create the merged datasets
    const mergedDatasets = [
        {
            label: data1.datasets[0].label,
            data: mapDataToUnifiedLabels(
                data1.labels,
                data1.datasets[0].data,
                unifiedLabels
            ),
            backgroundColor: data1.datasets[0].backgroundColor,
            borderColor: data1.datasets[0].borderColor,
            fill: false
        },
        {
            label: data2.datasets[0].label,
            data: mapDataToUnifiedLabels(
                data2.labels,
                data2.datasets[0].data,
                unifiedLabels
            ),
            backgroundColor: data2.datasets[0].backgroundColor,
            borderColor: data2.datasets[0].borderColor,
            fill: false
        }
    ];

    // Merged data for the chart
    const mergedData = {
        labels: unifiedLabels,
        datasets: mergedDatasets
    };

    console.log(mergedData);
    return mergedData;
};

const getType = mimeT => {
    if (mimeT.startsWith("image")) return "Image";
    else if (mimeT.endsWith("pdf")) return "PDF";
    else if (mimeT.endsWith("json")) return "JSON";
    return "Others";
};

export const getPiePlotFileData = files => {
    let counter = {};
    let dt;
    files.forEach(f => {
        dt = getType(f.mimetype);
        if (!counter[dt]) counter[dt] = 0;
        counter[dt]++;
    });
    return counter;
};
