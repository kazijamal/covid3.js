import { parseData, setDate } from '../../utility.js'

let getData = (ridership) => {
    let extent = d3.extent(ridership, d => `${d.date}T00:00:00`).map(d => new Date(d));

    let daily = parseData(ridership, extent, 1, 'riders', 'enter');

    setDate(extent[0], 7); // set beginning date to 2019-01-05
    setDate(extent[1], 1); // set       end date to 2020-05-02

    let weekly = parseData(ridership, extent, 7, 'riders', 'enter');

    let monthly = parseData(ridership, extent, 'month', 'riders', 'enter');

    return { daily, weekly, monthly };
}

let average = (data, year) => {
    const select = data.filter(d => d.date.getFullYear() == year);

    let total = select.reduce((acc, cur) => {
        return acc + cur.riders;
    }, 0)

    return Math.round(total / select.length);
}

export { average, getData }