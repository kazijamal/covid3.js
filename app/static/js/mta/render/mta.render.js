import LineGraph from '../../template/line.graph.js'
import Choropleth from '../../template/choropleth.js';

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

import {
    borodata,
    zipdata
} from '../data/nyc.corona.js';

let view = 'daily';
let svg, margin;
let ridership, gextent, tool;
let projection = d3.geoMercator()
    .scale(50000)
    .center([-73.94, 40.70]);
let path = d3.geoPath(projection);

window.onload = async () => {
    await ridership20192020();
    await ridership2020();
    await ridershipborough();
    await boroughchorolpeth();
    await zipchoropleth();
}

let ridership20192020 = async () => {
    tool = (x, y) => `${y} riders \n${x.toLocaleString(undefined, tooldate)}`;

    ridership = await d3.csv('/data/transportation/mta');

    let { daily, weekly, monthly, extent } = getData(ridership, 7, 1, 'riders', 'enter');

    gextent = extent;

    document.getElementById('ridership-line-container').innerHTML += `
    <p class="article-content">New York City is synonymous with a lot: Times Square, Central Park, the Empire
				State Building. But the thing that holds the city together is the MTA Subway system. In the midst of the
				COVID-19 pandemic, the iconic image of crowded trains is not to be found.
				<br>
				<div id="avg"></div>
			</p>
			<p class="article-content">
				The following line chart shows the number of times people enter an MTA Subway turnstile since 2019. Note
				that on the daily view, there are drops on the weekends, regardless of the pandemic. Use the buttons to
				switch time intervals and hover over the line to view a more specific tooltip.</p>
			<div class="toggle-view-btns">
				<div class="btn-group" role="group">
					<button type="button" class="btn btn-primary" id="daily" disabled>Daily</button>
					<button type="button" class="btn btn-primary" id="weekly" disabled>Weekly</button>
					<button type="button" class="btn btn-primary" id="monthly" disabled>Monthly</button>
				</div>
            </div>`;

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
        by comparing ridership from March 1st - May 2nd 2020 to the same timeframe from the previous year.<br><br>
        <b><span style="color: #CF5C36">Manhattan</span></b> has seen a <b>${manhattan}%</b> decrease, the largest out of all boroughs.
        <b><span style="color: #C2CFB2">Staten Island</span></b> has the second largest decrease with <b>${staten}%</b>
        though it should be noted that the Subway system is not used as much in Staten Island regardless of COVID.
        <b><span style="color: #A09EBB">Brooklyn</span></b> comes in third with a <b>${brooklyn}%</b> decrease, followed by
        <b><span style="color: #7C7C7C">Queens</span></b> with a <b>${queens}%</b> decrease.
        <b><span style="color: #EFC88B">The Bronx</span></b> has experienced the least percentage decrease with <b>${bronx}%.</b><br>
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
    await graph.renderMultiLine(
        ex, {
        'Kings County': '#A09EBB',
        'New York County': '#CF5C36',
        'Richmond County': '#C2CFB2',
        'Queens County': '#7C7C7C',
        'Bronx County': '#EFC88B'
    });
    graph.yLabel('# of swipes');
}

let mapScaffold = (container, id, legendid, colorid, tickcontainerid) => {
    let map = d3.select(`#${container}`)
        .append('svg')
        .attr('id', id)
        .attr('width', '100%')
        .attr('viewBox', [73.94, -40.70, 975, 610])
        .append('g')
        .attr('transform', 'translate(100)');

    let legend = map.append('g')
        .attr('id', legendid)
        .attr("width", 320)
        .attr("height", 50)
        .attr('transform', 'translate(120,20)')
        .attr("viewBox", [0, 0, 320, 50]);

    legend.append('g').attr('id', colorid);
    legend.append('g').attr('id', tickcontainerid);

    return { map, colorid, tickcontainerid };
}

let boroughchorolpeth = async () => {
    let { casemap, colormap } = await borodata();

    let geoboro = await d3.json('/static/json/boroughs.json');
    let area = topojson.feature(geoboro, geoboro.objects.boroughs).features;
    let border = topojson.mesh(geoboro, geoboro.objects.boroughs);

    let getprop = (d) => d.properties.bname;

    let { map, colorid, tickcontainerid } = mapScaffold(
        'borough-container', 'borough-map',
        'borough-legend', 'borough-color', 'borough-tick-container'
    );

    let tickid = 'borough-tick';
    let legendlabel = 'Number of COVID-19 cases';

    let choropleth = new Choropleth(
        map, 'borough-area', 'borough-border',
        area, border, path,
        casemap, colormap,
        getprop, legendlabel,
        colorid, tickid, tickcontainerid);

    choropleth.render();
}

let zipchoropleth = async () => {
    let { casemap, colormap } = await zipdata();

    let geozip = await d3.json('/static/json/zip_codes.json');
    let area = topojson.feature(geozip, geozip.objects.zip_codes).features;
    let border = topojson.mesh(geozip, geozip.objects.zip_codes);

    let { map, colorid, tickcontainerid } = mapScaffold(
        'zip-container', 'zip-map',
        'zip-legend', 'zip-color', 'zip-tick-container');

    let getprop = (d) => d.properties.zcta;
    let legendlabel = 'Number of COVID-19 cases';
    let tickid = 'zip-tick';

    let choropleth = new Choropleth(
        map, 'zip-area', 'zip-border',
        area, border, path,
        casemap, colormap,
        getprop, legendlabel,
        colorid, tickid, tickcontainerid);

    choropleth.render();
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