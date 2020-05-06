import { updateLineGraph } from './template/line.graph.js';

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

const parseData = (data, extent, step, property, subprop) => {

    let copy = extent.map(d => {
        let iso = d.toISOString();
        let subiso = iso.substring(0, iso.indexOf('T'));

        return new Date(`${subiso}T00:00:00`);
    })

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
            // console.log(d.date);
            let current = new Date(`${d.date}T00:00:00`);
            let day = current.getDay();

            // console.log(current);

            setDate(current, (day < 6) ? 6 - day : 7);

            // console.log(current);
            let iso = current.toISOString();
            let subiso = iso.substring(0, iso.indexOf('T'));

            console.log(subiso)
            console.log(scaffold);
            scaffold[subiso][property] += +d[subprop];
        })
    }
}

// const getMonthlyRidership = (ridership) => {

// }

export { setDate, delay, parseData };