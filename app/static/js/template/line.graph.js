import { delay } from '../utility.js';

let x, y, xAxis, yAxis, width, height, line, margin;

let setSVGBounds = (svg, m) => {
    let pseudo = svg._groups[0][0];
    width = pseudo.clientWidth;
    height = pseudo.clientHeight;

    margin = m;
}

let renderLineGraph = (
    svg,
    data,
    xprop,
    yprop,
    color,
    time,
) => {

    x = xScale(data, xprop);
    y = yScale(data, yprop);

    xAxis = g => g
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    yAxis = g => g
        .attr('id', 'y-axis')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    line = d3.line()
        .curve(d3.curveMonotoneX)
        .defined(d => !isNaN(d[yprop]))
        .x(d => x(d[xprop]))
        .y(d => y(d[yprop]))

    let path = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('id', 'line-graph')
        .attr('stroke', color)
        .attr('stroke-width', '1.5')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

    let length = path.node().getTotalLength();

    path.attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .ease(d3.easeCubicInOut)
        .duration(time)
        .attr('stroke-dashoffset', 0);

    return delay(time);
}

let xScale = (data, prop) => {

    return d3.scaleTime()
        .domain(d3.extent(data, d => d[prop]))
        .range([margin.left, width - margin.right]);
}

let yScale = (data, prop) => {
    return d3.scaleLinear()
        .domain([0, d3.max(data, d => d[prop])]).nice()
        .range([height - margin.bottom, margin.top]);
}

let updateLineGraph = (svg, data, time, xprop, yprop) => {
    x = xScale(data, xprop);
    y = yScale(data, yprop);

    svg = svg.transition();

    svg.select('#line-graph')
        .duration(time)
        .attrTween('d', function () {
            let prev = d3.select(this).attr('d')
            let current = line(data);
            return d3.interpolatePath(prev, current);
        });

    svg.select('#x-axis')
        .duration(time)
        .call(xAxis);

    svg.select('#y-axis')
        .duration(time)
        .call(yAxis);
}

export { setSVGBounds, renderLineGraph, updateLineGraph };