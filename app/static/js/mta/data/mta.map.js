let getNYCBoroughs = async () => {
    let boroughs = await d3.json('/static/json/boroughs.json');

    return topojson.feature(boroughs, boroughs.objects.boroughs).features;
}

let getNYCNeighborhoods = async () => {
    let neighborhoods = await d3.json('/static/json/neighborhoods.json');

    return neighborhoods.features;
}

let getNYCZipcodes = async () => {
    let zipcodes = await d3.json('/static/json/zip_codes.json')

    return topojson.feature(zipcodes, zipcodes.objects.zip_codes).features;
}

let getSubwayStops = async () => {
    let stops = await d3.json('/static/json/subway_stops.json')

    return topojson.feature(stops, stops.objects.subway_stops).features;
}

export { getNYCBoroughs, getNYCNeighborhoods, getNYCZipcodes, getSubwayStops }