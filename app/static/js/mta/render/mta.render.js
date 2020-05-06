import {
    getMTARidership,
    parseRidership,
    // getMonthlyRidership,
} from '../data/mta.ridership.js';

import {
    setSVGBounds,
    renderLineGraph,
    updateLineGraph
} from '../../template/line.graph.js'

import {
    setDate
} from '../../utility.js';

let view = 'daily';
let svg;

window.onload = async () => {
    const ridership = await getMTARidership();

    let extent = d3.extent(ridership, d => `${d.date}T00:00:00`).map(d => new Date(d));

    let daily = parseRidership(ridership, extent, 1);

    setDate(extent[0], 7); // set beginning date to 2019-01-05
    setDate(extent[1], 1); // set       end date to 2020-05-02

    let weekly = parseRidership(ridership, extent, 7);

    let monthly;

    svg = d3.select('#ridership-line-container')
        .append('svg')
        .attr('id', 'ridership-line')
        .attr('width', '100%')
        .attr('height', '50vh');

    let margin = { 'top': 20, 'right': 30, 'bottom': 30, 'left': 100 };

    setSVGBounds(svg, margin);
    await renderLineGraph(svg, daily, 'date', 'riders', 'steelblue', 7000);

    listen('daily', daily);
    listen('weekly', weekly);
    listen('monthly', monthly);
}

let listen = (id, data) => {
    document.getElementById(id).addEventListener('click', () => {
        update(id, svg, data);
    })
}

let update = (id, data) => {
    if (view !== id) {
        updateLineGraph(svg, data, 1000, 'date', 'riders');
        view = id;
    }
}