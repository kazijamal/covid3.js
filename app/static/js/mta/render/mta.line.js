let xAxis, yAxis, width, height, margin, line, x, y;

let renderLineSVG = (svg, ridership) => {

    // https://observablehq.com/@d3/line-chart-with-tooltip
    // https://observablehq.com/@d3/line-chart
    // https://github.com/d3/d3-scale/blob/master/README.md#scaleTime
    // https://bl.ocks.org/d3indepth/8948c9936c71e63ef2647bc4cc2ebf78
    // https://bl.ocks.org/scresawn/0e7e4cf9a0a459e59bacad492f73e139
    // https://www.d3-graph-gallery.com/line

    // https://bl.ocks.org/d3noob/7030f35b72de721622b8 Update graph on button press

    let pseudoSVG = svg._groups[0][0];
    width = pseudoSVG.clientWidth;
    height = pseudoSVG.clientHeight;

    margin = { 'top': 20, 'right': 30, 'bottom': 30, 'left': 100 };

    // create scales based on time and ridership
    x = getXScale(ridership);
    y = getYScale(ridership);

    // create axes
    xAxis = g => g
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .attr('id', 'line-x-axis')
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    yAxis = g => g
        .attr('transform', `translate(${margin.left}, 0)`)
        .attr('id', 'line-y-axis')
        .call(d3.axisLeft(y))
        // .call(g => g.select('.domain').remove())

    svg.append('g').call(xAxis);

    svg.append('g').call(yAxis);

    // line function which creates a path based on data
    line = d3.line()
        .curve(d3.curveMonotoneX)
        .defined(d => !isNaN(d.riders))
        .x(d => x(d.date))
        .y(d => y(d.riders));

    let path = svg.append('path')
        .datum(ridership)
        .attr('id', 'ridership-line')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', '1.5')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

    // https://medium.com/@sahilaug/line-graphs-using-d3-animating-the-line-f82a1dfc3c91
    // https://github.com/d3/d3-ease

    let length = path.node().getTotalLength();

    path.attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .ease(d3.easeCubicInOut)
        .duration(10000)
        .attr('stroke-dashoffset', 0);
}

let updateLineSVG = (svg, ridership) => {
    x = getXScale(ridership);
    y = getYScale(ridership);

    svg = svg.transition();

    svg.select('#ridership-line')
        .duration(1000)
        .attrTween('d', function () {
            let prev = d3.select(this).attr('d')
            let current = line(ridership)
            return d3.interpolatePath(prev, current);
        })

    svg.select('#line-x-axis')
        .duration(1000)
        .call(xAxis);

    svg.select('#line-y-axis')
        .duration(1000)
        .call(yAxis);
}

let getXScale = (ridership) => {
    return d3.scaleTime()
        .domain(d3.extent(ridership, d => d.date))
        .range([margin.left, width - margin.right]);
}

let getYScale = (ridership) => {
    return d3.scaleLinear()
        .domain([0, d3.max(ridership, d => d.riders)]).nice()
        .range([height - margin.bottom, margin.top]);
}

/**
 * @returns A D3 selection of an SVG
 */
let createLineSVG = () => {
    return d3.select('#line-graph-container')
        .append('svg')
        .attr('id', 'line-graph')
        .attr('width', '100%')
        .attr('height', '50vh')
}

export { createLineSVG, renderLineSVG, updateLineSVG };