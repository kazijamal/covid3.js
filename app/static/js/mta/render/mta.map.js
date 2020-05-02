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
            return 'lightgrey';
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

export { createMapSVG, renderMapSVG };