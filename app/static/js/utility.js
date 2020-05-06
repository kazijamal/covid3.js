const setDate = (date, diff) => {
    if (diff == 'month') {
        date.setMonth(date.getMonth() + 1);
    } else {
        date.setDate(date.getDate() + diff);
    }
}

const delay = (time) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
};

const toISO = (date) => {
    let iso = date.toISOString();
    return iso.substring(0, iso.indexOf('T'));
}

const parseData = (data, extent, step, property, subprop) => {

    let copy = extent.map(d => new Date(`${toISO(d)}T00:00:00`));

    let scaffold = createScaffold(copy, step, property);

    fillScaffold(scaffold, data, step, property, subprop);

    let arr = new Array();

    for (const date in scaffold) {
        arr.push(scaffold[date]);
    }

    return arr;
}

const createScaffold = (extent, step, property) => {
    let scaffold = new Object();

    if (step == 'month') {
        extent.forEach(d => { d.setDate(1) });
    }
    for (let i = extent[0]; i <= extent[1]; setDate(i, step)) {
        let iso = i.toISOString();
        let subiso = iso.substring(0, iso.indexOf('T'));

        scaffold[subiso] = { date: new Date(iso), [property]: 0 };
    }

    return scaffold;
}

const fillScaffold = (scaffold, data, step, property, subprop) => {
    if (step == 1) {
        data.forEach(d => {
            scaffold[d.date][property] += +d[subprop];
        });
    } else if (step == 7) {
        data.forEach(d => {
            let current = new Date(`${d.date}T00:00:00`);
            let day = current.getDay();

            setDate(current, (day < 6) ? 6 - day : 7);

            scaffold[toISO(current)][property] += +d[subprop];
        })
    } else if (step == 'month') {
        data.forEach(d => {
            let current = new Date(`${d.date}T00:00:00`);
            current.setDate(1);

            if (current.getFullYear() !== 2018) {
                scaffold[toISO(current)][property] += +d[subprop];
            }
        })
    }
}

let tooldate = { month: "short", day: "numeric", year: "numeric" };

export { setDate, delay, parseData, tooldate };