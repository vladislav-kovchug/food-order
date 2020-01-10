exports.createMenu = function createMenu(values = []) {
    if (values.length === 0) {
        console.warn("Failed to create a menu - no data provided");
        return;
    }

    const firstMenuItemIndex = findFirstMenuItemIndex(values);
    if (firstMenuItemIndex === -1) {
        console.warn("Failed to create a menu - no menu positions found");
        return;
    }

    const menu = {};

    let category;
    let id = 1;
    for (let i = firstMenuItemIndex - 1; i < values.length; i++) {
        const row = values[i];

        if (!isPositionRow(row)) {
            category = row[0] || `Random category #${i}`;
            continue;
        }

        menu[category] = menu[category] || [];
        menu[category].push({
            id: id++,
            name: cleanString(row[0]),
            weight: cleanString(row[1]),
            price: cleanString(row[2]),
        });
    }

    return Object.keys(menu).map(name => ({
        name,
        items: menu[name]
    }));
};

function findFirstMenuItemIndex(values) {
    for (let i = 0; i < values.length; i++) {
        if (isPositionRow(values[i])) {
            return i;
        }
    }

    return -1;
}

function isPositionRow(row) {
    if (row.length < 3) {
        return false;
    }

    const [name, weight, price] = row;

    return name !== "" && isWeightString(weight) && isPriceString(price);
}

function isWeightString(value) {
    if (!value) {
        return false;
    }

    const weightRegExp = /\d[,.]\d+/;

    return weightRegExp.test(value) || Number.parseInt(value) > 0;
}

function isPriceString(value) {
    if (!value) {
        return false;
    }

    const priceRegExp = /^\d{1-4}/;

    return priceRegExp.test(value) || Number.parseInt(value) > 0;
}

function cleanString(value) {
    if (!value) {
        return "";
    }

    return value.replace("\n", " ").trim();
}
