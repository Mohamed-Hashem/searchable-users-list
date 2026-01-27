export const generateKey = (id, prefix = "") => {
    const prefixPart = prefix ? `-${prefix}` : "";
    return `key-${id}${prefixPart}`;
};

export const truncateString = (str, maxLength, suffix = "...") => {
    if (!str || str.length <= maxLength) return str;
    return `${str.substring(0, maxLength)}${suffix}`;
};

export const getFullName = (user) => {
    if (user.name) return user.name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    return user.firstName || user.lastName || "";
};
