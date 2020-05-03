let getNYCBoroughs = async () => await d3.json('/static/json/boroughs.json');

let getNYCNeighborhoods = async () => {
    let neighborhoods = await d3.json('/static/json/neighborhoods.json');

    return neighborhoods.features;
}

let getNYCZipcodes = async () => await d3.json('/static/json/zip_codes.json');

let getSubwayStops = async () => {
    let stops = await d3.json('/static/json/subway_stops.json')

    return topojson.feature(stops, stops.objects.subway_stops).features;
}

export { getNYCBoroughs, getNYCNeighborhoods, getNYCZipcodes, getSubwayStops }