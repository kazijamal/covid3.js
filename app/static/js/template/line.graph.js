import { delay } from '../utility.js';

let x, y, xAxis, yAxis, width, height, line, margin;
let xaxisid, yaxisid, lineid;
let gdata;
let tooltip;

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
    toolformat,
    {
        color = 'steelblue',
        timedelay = 7000,
        ease = d3.easeCubicInOut,
        strokewidth = 1.5,
        xid = 'line-x-axis',
        yid = 'line-y-axis',
        id = 'line-graph'
    } = {}) => {

    x = xScale(data, xprop);
    y = yScale(data, yprop);

    gdata = data;

    xaxisid = xid; yaxisid = yid; lineid = id;

    xAxis = g => g
        .attr('id', xid)
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    yAxis = g => g
        .attr('id', yid)
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
        .attr('id', id)
        .attr('stroke', color)
        .attr('stroke-width', strokewidth)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

    let length = path.node().getTotalLength();

    path.attr('stroke-dasharray', `${length} ${length}`)
        .attr('stroke-dashoffset', length)
        .transition()
        .ease(ease)
        .duration(timedelay)
        .attr('stroke-dashoffset', 0);

    tooltip = svg.append("g");

    bisectListener(svg, xprop, yprop, toolformat);

    return delay(timedelay);
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

    gdata = data;

    svg.select(`#${lineid}`)
        .duration(time)
        .attrTween('d', function () {
            let prev = d3.select(this).attr('d')
            let current = line(data);
            return d3.interpolatePath(prev, current);
        });

    svg.select(`#${xaxisid}`)
        .duration(time)
        .call(xAxis);

    svg.select(`#${yaxisid}`)
        .duration(time)
        .call(yAxis);

    bisectListener(svg, xprop, yprop);
}

let callout = (g, value) => {
    if (!value) return g.style("display", "none");

    g
        .style("display", null)
        .style("pointer-events", "none")
        .style("font", "10px sans-serif");

    const path = g.selectAll("path")
        .data([null])
        .join("path")
        .attr("fill", "white")
        .attr("stroke", "black");

    const text = g.selectAll("text")
        .data([null])
        .join("text")
        .call(text => text
            .selectAll("tspan")
            .data((value + "").split(/\n/))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i) => `${i * 1.1}em`)
            .style("font-weight", (_, i) => i ? null : "bold")
            .text(d => d));

    const { x, y, width: w, height: h } = text.node().getBBox();

    text.attr("transform", `translate(${-w / 2},${15 - y})`);
    path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
}

let bisect = () => {
    const bisect = d3.bisector(d => d.date).left;
    return mx => {
        const date = x.invert(mx);
        const index = bisect(gdata, date, 1);
        const a = gdata[index - 1];
        const b = gdata[index];
        return date - a.date > b.date - date ? b : a;
    }
}

let bisectListener = (svg, xprop, yprop, toolformat) => {
    let b = bisect();
    svg.on("touchmove mousemove", function() {
        const { [xprop]: xval, [yprop]: yval } = b(d3.mouse(this)[0]);
        tooltip
            .attr("transform", `translate(${x(xval)},${y(yval)})`)
            .call(callout, toolformat(xval, yval));
    });

    svg.on("touchend mouseleave", () => tooltip.call(callout, null));
}

export { setSVGBounds, renderLineGraph, updateLineGraph };