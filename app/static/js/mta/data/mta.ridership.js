import { toISO, createScaffold } from "../../utility.js";

let dayaverage = (data, day) => {
    let select = data.filter(d => d.date.getDay() == day);

    let total = select.reduce((acc, cur) => {
        return acc + cur.riders;
    }, 0)

    return Math.round(total / select.length);
}

let boroughParse = (data, extent) => {
    let scaffold = {
        'Kings County': createScaffold(extent, 1, 'riders'),
        'New York County': createScaffold(extent, 1, 'riders'),
        'Richmond County': createScaffold(extent, 1, 'riders'),
        'Queens County': createScaffold(extent, 1, 'riders'),
        'Bronx County': createScaffold(extent, 1, 'riders')
    }

    data.forEach(d => {
        if (d.date in scaffold[d.borough]) {
            scaffold[d.borough][d.date]['riders'] += +d['enter'];
        }
    })

    let arr = new Array();

    for (const borough in scaffold) {
        arr.push(scaffold[borough]);
    }

    return arr;
}

export { dayaverage, boroughParse };