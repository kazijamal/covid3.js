import {
    getData,
    average
} from '../data/mta.ridership.js';

import LineGraph from '../../template/line.graph.js'

import {
    tooldate,
} from '../../utility.js';

let view = 'daily';
let svg, margin;
let ridership, extent, tool;

window.onload = async () => {
    tool = (x, y) => `${y} riders \n${x.toLocaleString(undefined, tooldate)}`;

    ridership = await d3.csv('/data/transportation/mta');

    const { daily, weekly, monthly } = getData(ridership);

    document.getElementById('avg').innerHTML = `
    In 2019, there was an average of ${average(daily, 2019)} swipes per day.
    This year, it's down to ${average(daily, 2020)}.`;

    svg = d3.select('#ridership-line-container')
        .append('svg')
        .attr('id', 'ridership-graph')
        .attr('width', '100%')
        .attr('height', '50vh');

    margin = { 'top': 20, 'right': 50, 'bottom': 50, 'left': 100 };

    let riderline = new LineGraph(
        svg, daily,
        'date', 'riders',
        tool, margin,
        'ride-line',
        'ride-x', 'ride-y');
    await riderline.renderLineGraph();

    listen(riderline, 'daily', daily);
    listen(riderline, 'weekly', weekly);
    listen(riderline, 'monthly', monthly);
}

let count = 0;

window.onscroll = async () => {
    // let docEl = document.documentElement;
    // let numerator = document.body.scrollTop + docEl.scrollTop;
    // let denominator = docEl.scrollHeight - docEl.clientHeight;
    // let scrollpercent = (numerator) / (denominator);

    // if (scrollpercent == 1 && count == 0) {
    //     let extent2020 = [new Date('2020-01-01T00:00:00'), extent[1]];
    //     setDate(extent[1], -1);
    //     count++;

    //     let data = parseData(ridership, extent2020, 1, 'riders', 'enter');

    //     let svg2020 = d3.select('#ridership-2020')
    //         .append('svg')
    //         .attr('id', 'ridership-2020-line')
    //         .attr('width', '100%')
    //         .attr('height', '50vh');

    //     setSVGBounds(svg2020, margin);

    //     await renderLineGraph(svg2020, data, 'date', 'riders', tool,
    //         {
    //             xid: 'ridership-2020-x',
    //             yid: 'ridership-2020-y',
    //             id: '2020-line-graph'
    //         });
    // }
}

let listen = (graph, id, data) => {
    let button = document.getElementById(id);
    button.disabled = false;
    button.addEventListener('click', () => {
        update(graph, id, data);
    })
}

let update = (graph, id, data) => {
    if (view !== id) {
        view = id;
        graph.updateLineGraph(data, 1000);
    }
}