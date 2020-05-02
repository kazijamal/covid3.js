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

export { createLineSVG, renderLineSVG };