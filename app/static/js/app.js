window.onload = async () => {
    let svg = createSVG();
    // let boroughs = await getNYCBoroughs();
    let neighborhoods = await getNYCNeighborhoods();

    let projection = d3.geoMercator()
                    .scale(50000)
  					.center([-73.94, 40.70])
    let path = d3.geoPath(projection)

    svg.selectAll('path')
        .data(neighborhoods)
        .join(
            enter => enter.append('path')
                .attr('d', path)
                .attr('fill', 'blue')
        );
}

let createSVG = () => {
    return d3.select('body').append('svg')
        .attr('id', 'map')
        .attr('width', '75%')
        .attr('viewBox', [73.94, -40.70, 975, 610])
        .append('g');
}

let getNYCBoroughs = async () => {
    let boroughs = await d3.json('static/json/boroughs.json');

    return topojson.feature(boroughs, boroughs.objects.boroughs).features;
}

let getNYCNeighborhoods = async () => {
    let neighborhoods = await d3.json('static/json/neighborhoods.json');

    return neighborhoods.features;
}