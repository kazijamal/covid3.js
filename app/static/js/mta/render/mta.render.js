import { getDailyRidership, getWeeklyRidership } from '../data/mta.ridership.js';
import { getNYCBoroughs, getNYCNeighborhoods, getNYCZipcodes, getSubwayStops } from '../data/mta.map.js';
import { requestCaseData, getZipCases, getZipMap  } from '../nyc.corona.js';

import { createLineSVG, renderLineSVG } from './mta.line.js';
import { createMapSVG, renderMapSVG } from './mta.map.js';

window.onload = async () => {
    let ridership = await getDailyRidership();

    let lineSVG = createLineSVG();
    renderLineSVG(lineSVG, ridership);

    let zipCases = await getZipCases();

    let colorMapper = d3.scaleQuantize()
        .domain([0, d3.max(zipCases, d => +d.Positive)])
        .range(["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);

    let zipMap = getZipMap(zipCases);

    let zipcodes = await getNYCZipcodes();
    let mapSVG = createMapSVG();
    renderMapSVG(mapSVG, ridership, zipcodes, colorMapper, zipCaseDictionary);
}