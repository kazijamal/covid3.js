import { toISO, createScaffold } from "../../utility.js";

let dayaverage = (data, day) => {
    let select = data.filter(d => d.date.getDay() == day);

    let total = select.reduce((acc, cur) => {
        return acc + cur.riders;
    }, 0)

    return Math.round(total / select.length);
}

let percentChange = (data, extent) => {
    console.log(data);

    let prev = extent.map(d => new Date(`${toISO(d)}T00:00:00`));
    prev[0].setFullYear(prev[0].getFullYear() - 1);
    prev[1].setFullYear(prev[1].getFullYear() - 1);

    console.log(extent, prev);
    return {
        'New York County': 0,
        'Kings County': 0,
        'Queens County': 0,
        'Bronx County': 0,
        'Richmond County': 0
    }
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
            delete scaffold[d.borough][d.date]['date'];
        }
    })

    let master = new Array();

    for (const borough in scaffold) {
        let arr = new Array();
        for (const date in scaffold[borough]) {
            arr.push(scaffold[borough][date]['riders'])
        }
        scaffold[borough] = arr;
        master.push({
            'name': borough,
            'values': scaffold[borough]
        })
    }

    return master;
}

export { dayaverage, boroughParse, percentChange };