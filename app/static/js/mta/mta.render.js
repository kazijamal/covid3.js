import { getDailyRidership, getWeeklyRidership } from './mta.data.js';
import { getNYCBoroughs, getNYCNeighborhoods, getNYCZipcodes, getSubwayStops } from './mta.map.js';
import { requestCaseData } from './nyc.corona.js';

window.onload = async () => {
    let ridership = await getDailyRidership();

    // let dateCases = await requestCaseData('case-hosp-death');
    // let boroughCases = await requestCaseData('boro');

    // await getWeeklyRidership();
    // let stops = await getSubwayStops();
    // let boroughs = await getNYCBoroughs();
    // let neighborhoods = await getNYCNeighborhoods();

    let lineSVG = createLineSVG();

    renderLineSVG(lineSVG, ridership);

    let zipCases = await requestCaseData('tests-by-zcta');
    zipCases.shift();

    let colorMapper = d3.scaleQuantize()
        .domain([0, d3.max(zipCases, d => +d.Positive)])
        .range(["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);

    let zipCaseDictionary = new Object();

    zipCases.forEach(zip => {
        zipCaseDictionary[zip.MODZCTA] = zip.Positive;
    });

    let zipcodes = await getNYCZipcodes();
    let mapSVG = createMapSVG();
    renderMapSVG(mapSVG, ridership, zipcodes, colorMapper, zipCaseDictionary);
}

let renderLineSVG = (svg, ridership) => {

    // https://observablehq.com/@d3/line-chart-with-tooltip
    // https://observablehq.com/@d3/line-chart
    // https://github.com/d3/d3-scale/blob/master/README.md#scaleTime
    // https://bl.ocks.org/d3indepth/8948c9936c71e63ef2647bc4cc2ebf78
    // https://bl.ocks.org/scresawn/0e7e4cf9a0a459e59bacad492f73e139
    // https://stackoverflow.com/questions/3674539/incrementing-a-date-in-javascript
    // https://stackoverflow.com/questions/492994/compare-two-dates-with-javascript
    // https://www.d3-graph-gallery.com/line
    // https://bl.ocks.org/d3noob/7030f35b72de721622b8

    let pseudoSVG = svg._groups[0][0];
    let width = pseudoSVG.clientWidth;
    let height = pseudoSVG.clientHeight;

    let margin = {
        'top': 20,
        'right': 30,
        'bottom': 30,
        'left': 100,
    };

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
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text('Ridership'))

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

let createLineSVG = () => {
    return d3.select('#line-graph-container')
        .append('svg')
        .attr('id', 'line-graph')
        .attr('width', '100%')
        .attr('height', '50vh');
}

let createMapSVG = () => {
    return d3.select('#choropleth-container')
        .append('svg')
        .attr('id', 'map')
        .attr('width', '100%')
        .attr('viewBox', [73.94, -40.70, 975, 610])
        .append('g')
        .attr('transform', 'translate(100)')
}

let renderMapSVG = (svg, ridership, zipcodes, colorMapper, zipCases) => {

    let projection = d3.geoMercator()
        .scale(50000)
        .center([-73.94, 40.70])
    let path = d3.geoPath(projection)

    // TODO: delete stops with the same name and combine their stops
    console.log(zipCases);
    let color = (colorMapper, d) => {
        let c = colorMapper(zipCases[d]);
        if (c == undefined) {
            return 'grey';
        }
        return c;
    }

    svg.selectAll('.zipcode-area')
        .data(zipcodes)
        .join(
            enter => {
                return enter.append('path')
                    .attr('d', path)
                    .attr('class', 'zipcode-area')
                    .attr('fill', d => {
                        return color(colorMapper, d.properties.zcta)
                    })
            }
        );
}
