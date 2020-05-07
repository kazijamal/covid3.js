import LineGraph from '../../template/line.graph.js'

import {
    dayaverage,
    boroughParse
} from '../data/mta.ridership.js';

import {
    parseData,
    setDate,
    tooldate,
    getData,
    average,
} from '../../utility.js';

let view = 'daily';
let svg, margin;
let ridership, gextent, tool;
let count = 0;

window.onload = async () => { await ridership20192020(); }

window.onscroll = async () => {

    if (percentscroll() == 1 && count == 0) {
        await ridership2020();
    }

    if (percentscroll() == 1 && count == 1) {
        await ridershipborough();
    }
}

let ridership20192020 = async () => {
    tool = (x, y) => `${y} riders \n${x.toLocaleString(undefined, tooldate)}`;

    ridership = await d3.csv('/data/transportation/mta');

    let { daily, weekly, monthly, extent } = getData(ridership, 7, 1, 'riders', 'enter');

    gextent = extent;

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

let ridership2020 = async () => {
    let extent2020 = [new Date('2020-01-01T00:00:00'), gextent[1]];
    setDate(gextent[1], -1);

    let data = parseData(ridership, extent2020, 1, 'riders', 'enter');

    let mextent = [new Date('2020-01-01T00:00:00'), new Date('2020-03-09T00:00:00')]

    let temp = parseData(ridership, mextent, 1, 'riders', 'enter');

    document.getElementById('ridership-2020').innerHTML = `
    <div class="article-content mb-2">
        Now let's take a look at data just from this year.
        We can see that the first major dip in ridership occurs on the week of March 8th.
        Schools officially closed on Sunday, March 15th. On Monday, March 16th, ridership dropped
        to 2180285 swipes. Previous Mondays in the year had an average of ${dayaverage(temp, 1)} swipes.
    </div>`

    let svg2020 = d3.select('#ridership-2020')
        .append('svg')
        .attr('id', 'ridership-2020-graph')
        .attr('width', '100%')
        .attr('height', '50vh');

    let graph = new LineGraph(
        svg2020, data, 'date', 'riders',
        tool, margin, '2020-line', '2020-x', '2020-y',
        {timedelay: 2000});

    count++;
    await graph.renderLineGraph();
}

let ridershipborough = async () => {
    let extent2020 = [new Date('2020-01-01T00:00:00'), gextent[1]];

    let data = boroughParse(ridership, extent2020);

    console.log(data);
    count++;
}

let choropleth = () => {
    console.log('here')
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

let percentscroll = () => {
    let docEl = document.documentElement;
    let numerator = document.body.scrollTop + docEl.scrollTop;
    let denominator = docEl.scrollHeight - docEl.clientHeight;
    let scrollpercent = (numerator) / (denominator);

    return scrollpercent;
}