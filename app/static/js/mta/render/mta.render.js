import { getDailyRidership, getWeeklyRidership } from '../data/mta.ridership.js';
import { getNYCBoroughs, getNYCNeighborhoods, getNYCZipcodes, getSubwayStops } from '../data/mta.map.js';
import { requestCaseData, getZipCases, getZipMap } from '../data/nyc.corona.js';

import { createLineSVG, renderLineSVG, updateLineSVG } from './mta.line.js';
import { createMapSVG, renderMapSVG } from './mta.map.js';

let lineSVG, ridership;
let currentView = 'daily'

document.getElementById('daily').addEventListener('click', async () => {
    buttonCheck('daily', getDailyRidership);
})

document.getElementById('weekly').addEventListener('click', async () => {
    buttonCheck('weekly', getWeeklyRidership);
})

let buttonCheck = async (type, ridershipFunction) => {
    if (currentView !== type) {
        ridership = await ridershipFunction();
        updateLineSVG(lineSVG, ridership);
        currentView = type;
    }
}

window.onload = async () => {
    /*
        ridership contains the following:
        [
            { date: Date object, riders: int },
            { },
            { },
            ...
        ]
    */
    ridership = await getDailyRidership();

    lineSVG = createLineSVG();
    renderLineSVG(lineSVG, ridership);
    await zipChoropleth();
}

let zipChoropleth = async () => {
    /*
        zipCases contains the following:
        [
            { MODZCTA: "10002", Positive: "848", Total: "1910", zcta_cum.perc_pos: "44.4"},
            { },
            { },
            ...
            MODZCTA is a zipcode
            Positive represents the total number of positive cases in the zipcode
            Total represents the total number of tests administered in the zipcode
            zcta_cum.perc_pos represents the percentage of positive cases out of the total tests
        ]
    */
    let zipCases = await getZipCases();

    let colorMapper = d3.scaleQuantize()
        .domain([0, d3.max(zipCases, d => +d.Positive)])
        .range(["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);

    /*
        zipMap contains the following:
        {
            '10001': 304,
            '10002': 848,

            zipcode: number-of-positive-cases
            ...
        }
    */
    let zipMap = getZipMap(zipCases);

    /*
        zipcodes contains an array of topojson features that allows us to map to a choropleth
    */
    let zipcodes = await getNYCZipcodes();

    let mapSVG = createMapSVG();
    renderMapSVG(mapSVG, ridership, zipcodes, colorMapper, zipMap);
}