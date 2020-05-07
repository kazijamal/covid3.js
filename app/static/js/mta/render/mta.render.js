import LineGraph from '../../template/line.graph.js'

import {
    dayaverage,
    boroughParse,
    percentChange
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
let count;

window.onload = async () => { count = 0; await ridership20192020(); }

window.onscroll = async () => {

    let docEl = document.documentElement;
    let numerator = document.body.scrollTop + docEl.scrollTop;
    let denominator = docEl.scrollHeight - docEl.clientHeight;
    let percentscroll = (numerator) / (denominator);

    if (percentscroll == 1 && count == 0) {
        count++;
        await ridership2020();
    }

    if (percentscroll == 1 && count == 1) {
        count++;
        await ridershipborough();
    }
}

let ridership20192020 = async () => {
    tool = (x, y) => `${y} riders \n${x.toLocaleString(undefined, tooldate)}`;

    ridership = await d3.csv('/data/transportation/mta');

    let { daily, weekly, monthly, extent } = getData(ridership, 7, 1, 'riders', 'enter');

    gextent = extent;

    document.getElementById('avg').innerHTML = `
    In 2019, there was an average of <b>${average(daily, 2019)}</b> swipes per day.
    This year, it's down to <b>${average(daily, 2020)}</b>.`;

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

    return;
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
        to <b>2180285</b> swipes. Previous Mondays in the year had an average of <b>${dayaverage(temp, 1)}</b> swipes.
    </div>`

    let svg2020 = d3.select('#ridership-2020')
        .append('svg')
        .attr('id', 'ridership-2020-graph')
        .attr('width', '100%')
        .attr('height', '50vh');

    let graph = new LineGraph(
        svg2020, data, 'date', 'riders',
        tool, margin, 'line-2020', 'x-2020', 'y-2020',
        { timedelay: 2000 });

    await graph.renderLineGraph();
    graph.yLabel('# of swipes');
    return;
}

let ridershipborough = async () => {
    let extent2020 = [new Date('2020-03-01T00:00:00'), gextent[1]];

    let data = boroughParse(ridership, extent2020);

    let {
        'New York County': manhattan,
        "Kings County": brooklyn,
        "Queens County": queens,
        "Bronx County": bronx,
        "Richmond County": staten
    } = percentChange(ridership, extent2020);

    document.getElementById('ridership-borough').innerHTML = `
    <div class="article-content mb-2">
        The following graph breaks down MTA ridership by borough since the beginning of March.
        Though ridership in all boroughs have fallen to relatively similar numbers,
        the percentage decrease for each borough is clearly different. Lets calculate ther percentage difference
        by comparing ridership from March 1st - May 2nd 2020 to the same timeframe from the previous year.<br>
        <b><span style="color: #CF5C36">Manhattan</span></b> ${manhattan}<br>
        <b><span style="color: #A09EBB">Brooklyn</span></b> ${brooklyn}<br>
        <b><span style="color: #7C7C7C">Queens</span></b> ${queens}<br>
        <b><span style="color: #EFC88B">The Bronx</span></b> ${bronx}<br>
        <b><span style="color: #C2CFB2">Staten Island</span></b> ${staten}<br>
    </div>`

    let svgborough = d3.select('#ridership-borough')
        .append('svg')
        .attr('id', 'ridership-borough-graph')
        .attr('width', '100%')
        .attr('height', '50vh');

    let graph = new LineGraph(
        svgborough, data, 'date', 'riders',
        tool, margin, 'borough-line', 'borough-x', 'borough-y',
        {
            timedelay: 1000,
            color: 'red',
            strokewidth: 2,
        });

    let ex = [new Date('2020-03-01T00:00:00'), gextent[1]]
    await graph.renderMultiLine(ex);
    graph.yLabel('# of swipes');
}

let choropleth = () => {
    // console.log('here')
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