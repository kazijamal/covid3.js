const setDate = (date, diff) => {
    date.setDate(date.getDate() + diff);
}

const delay = (time) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

export { setDate, delay };