import LineGraph from "../template/line.graph.js";
import Choropleth from "../template/choropleth.js";

import { toISO } from "../utility.js";

window.onload = async () => {
    await uslinegraph();
};

let uslinegraph = async () => {
    let data = await d3.csv("/data/dashboard/us");

    let minDate = new Date(`${data[0]["date"]}T00:00:00`);
    let maxDate = new Date(`${data[data.length - 1]["date"]}T00:00:00`);

    let cases = {
        name: "cases",
        values: [],
    };

    let deaths = {
        name: "deaths",
        values: [],
    };

    for (let i = 0; i < data.length; i++) {
        cases["values"].push(+data[i]["cases"]);
        deaths["values"].push(+data[i]["deaths"]);
    }

    let colorMap = {
        cases: "#2315ba",
        deaths: "#911111",
    };

    let svg = d3
        .select("#us-line-container")
        .append("svg")
        .attr("id", "us-line-graph")
        .attr("width", "100%")
        .attr("height", "60vh");

    let margin = { top: 20, right: 50, bottom: 50, left: 100 };

    let usline = new LineGraph(
        svg,
        [cases, deaths],
        "date",
        "people",
        "",
        margin,
        "us-line",
        "date-x",
        "people-y"
    );

    await usline.renderMultiLine([minDate, maxDate], {
        cases: "#2315ba",
        deaths: "#911111",
	});
	
    usline.yLabel('# of people');
};
