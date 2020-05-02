let getNYCBoroughs = async () => {
    let boroughs = await d3.json('/static/json/boroughs.json');

    return topojson.feature(boroughs, boroughs.objects.boroughs).features;
}

let getNYCNeighborhoods = async () => {
    let neighborhoods = await d3.json('/static/json/neighborhoods.json');

    return neighborhoods.features;
}

let getSubwayStops = async () => {
    let stops = await d3.json('/static/json/subway_stops.json')

    return topojson.feature(stops, stops.objects.subway_stops).features;

}


let getMTARidership = async () => {
    let ridership = await d3.csv('/data/transportation/mta');

    return ridership;
}

let getDailyRidership = async () => {
    let ridership = await getMTARidership();

    let extent = d3.extent(ridership, d => new Date(`${d.date}T00:00:00`));

    // Map each date in the data to 0 ridership
    let dailyRidership = new Object();
    for (let i = extent[0]; i <= extent[1]; i.setDate(i.getDate() + 1)) {
        let iso = i.toISOString();
        let current = dailyRidership[`${iso.substring(0, iso.indexOf('T'))}`] = new Object();

        current['date'] = new Date(iso);
        current['riders'] = 0;
    }

    // Fill in ridership data for each day
    ridership.forEach(d => {
        dailyRidership[d.date]['riders'] += +d.enter;
    });

    // Insert data into an array
    let ridershipArray = new Array();

    for (const date in dailyRidership) {
        ridershipArray.push(dailyRidership[date]);
    }

    return ridershipArray;
}

export { getNYCBoroughs, getNYCNeighborhoods, getSubwayStops, getDailyRidership };