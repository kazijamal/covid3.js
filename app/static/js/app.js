window.onload = async () => {
    let svg = createSVG();
    let boroughs = await getNYCBoroughs();

    console.log(boroughs);
    let projection = d3.geoMercator()
  					.center([-73.94, 40.70])
  					// .scale(50000)
  					// .translate([(width) / 2, (height)/2]);
    let path = d3.geoPath(projection)

    // console.log(svg);
    svg.selectAll('path')
        .data(boroughs.features)
        .join(
            enter => enter.append('path')
                .attr('d', path)
                .attr('fill', 'blue')
        );
    console.log(svg);
}

let createSVG = () => {
    return d3.select('body').append('svg')
        .attr('id', 'map')
        .attr('width', 975)
        .attr('height', 610)
        .attr('viewBox', [0, 0, 975, 610])
        // .attr('width', '60%')
        .append('g');
}

let getNYCBoroughs = async () => {
    let boroughs = await d3.json('static/json/borough_boundaries.json');

    return topojson.feature(boroughs, boroughs.objects.nyu_2451_34490);
}