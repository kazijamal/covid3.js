import { setDate } from '../../utility.js';

const getMTARidership = async () => await d3.csv('/data/transportation/mta');

const parseRidership = (ridership, extent, step) => {

    let copy = extent.map(d => {
        let iso = d.toISOString();
        let subiso = iso.substring(0, iso.indexOf('T'));

        return new Date(`${subiso}T00:00:00`);
    })

    let scaffold = createScaffold(copy, step);

    fillScaffold(scaffold, ridership, step);

    let data = new Array();

    for (const date in scaffold) {
        data.push(scaffold[date]);
    }

    return data;
}

const getMonthlyRidership = (ridership) => {

}

const createScaffold = (extent, step) => {
    let scaffold = new Object();

    for (let i = extent[0]; i <= extent[1]; setDate(i, step)) {
        let iso = i.toISOString();
        let subiso = iso.substring(0, iso.indexOf('T'));

        scaffold[subiso] = { date: new Date(iso), riders: 0 };
    }

    return scaffold;
}

const fillScaffold = (scaffold, ridership, step) => {
    if (step == 1) {
        ridership.forEach(d => {
            scaffold[d.date].riders += +d.enter;
        });
    } else if (step == 7) {
        ridership.forEach(d => {
            let current = new Date(`${d.date}T00:00:00`);
            let day = current.getDay();

            setDate(current, (day < 6) ? 6 - day : 7);

            let iso = current.toISOString();
            let subiso = iso.substring(0, iso.indexOf('T'));

            scaffold[subiso].riders += +d.enter;
        })
    }
}

export { getMTARidership, parseRidership };