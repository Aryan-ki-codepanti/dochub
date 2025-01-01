export const deleteMapEntryByValue = (mp, val) => {
    const newM = new Map();
    for (let [key, value] of mp) if (value !== val) newM.set(key, value);
    return newM;
};
