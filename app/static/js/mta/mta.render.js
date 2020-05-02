import { getDailyRidership } from './mta.data.js';

window.onload = async () => {

    let ridership = await getDailyRidership();

    let svg = createSVG();

    // console.log(ridership)

    renderSVG(svg, ridership);
}

let renderSVG = (svg, ridership) => {
    let pseudoSVG = svg._groups[0][0];
    let width = pseudoSVG.clientWidth;
    let height = pseudoSVG.clientHeight;

    let margin = {
        'top': 20,
        'right': 30,
        'bottom': 30,
        'left': 100,
    };

    console.log(ridership);
    // console.log(d3.extent(ridership, d => d.date));

    let x = d3.scaleTime()
        .domain(d3.extent(ridership, d => d.date))
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain([0, d3.max(ridership, d => d.riders)]).nice()
        .range([height - margin.bottom, margin.top]);

    let xAxis = g => g
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    let yAxis = g => g
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select('.domain').remove())

    let line = d3.line()
        .curve(d3.curveStep)
        .defined(d => !isNaN(d.riders))
        .x(d => x(d.date))
        .y(d => y(d.riders))

    svg.append('g')
        .call(xAxis);

    svg.append('g')
        .call(yAxis);

    svg.append('path')
        .datum(ridership)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', '1.5')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);
}

let createSVG = () => {
    return d3.select('#line-graph-container')
        .append('svg')
        .attr('id', 'line-graph')
        .attr('width', '100%')
        .attr('height', '50vh');
}

// let createSVG = () => {
//     return d3.select('body').append('svg')
//         .attr('id', 'map')
//         .attr('width', '75%')
//         .attr('viewBox', [73.94, -40.70, 975, 610])
//         .append('g');
// }

let choropleth = () => {
    // let boroughs = await getNYCBoroughs();
    // let neighborhoods = await getNYCNeighborhoods();
    // let stops = await getSubwayStops();

    // let projection = d3.geoMercator()
    //     .scale(50000)
    //     .center([-73.94, 40.70])
    // let path = d3.geoPath(projection)

    // let station_names = Array()
    // for (const station in stops) {
    //     let name = stops[station]['properties']['stop_name']
    //     if(!station_names.includes(name)) {
    //         station_names.push(name)
    //     } else {
    //         console.log(stops[station], station_names[station_names.indexOf(name)])
    //     }
    // }
    // svg.selectAll('.subway-stop')
    //     .data(stops)
    //     .join(
    //         enter => {
    //             return enter.append('path')
    //                 .attr('d', path)
    //                 .attr('class', 'subway-stop')
    //                 .attr('fill', d => {
    //                     // console.log(d.properties.stop_name, d.properties.trains)
    //                     return 'red'
    //                 })
    //         }
    //     );
}