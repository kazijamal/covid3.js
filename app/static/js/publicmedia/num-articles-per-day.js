let view = 'daily';

import {
  setSVGBounds,
  renderLineGraph,
  updateLineGraph,
} from '../template/line.graph.js';

import {
  parseData,
  setDate
} from '../utility.js'

let svg;

window.onload = async () => {
  let data = await d3.csv('/data/sentiment/publicmedia');

  let extent = d3.extent(data, d => `${d.date}T00:00:00`).map(d => new Date(d));

  let daily = parseData(data, extent, 1, 'numArticles', 'numArticles');

  setDate(extent[0], 5); // set beginning date to 2020-01-11
  setDate(extent[1], 4); // set beginning date to 2020-04-25

  let weekly = parseData(data, extent, 7, 'numArticles', 'numArticles');
  let monthly = parseData(data, extent, 'month', 'numArticles', 'numArticles');

  svg = d3.select('#line-chart')
    .append('svg')
    .attr('id', 'line')
    .attr('width', '100%')
    .attr('height', '50vh');

  let margin = { top: 50, right: 50, bottom: 50, left: 50 };

  setSVGBounds(svg, margin);
  await renderLineGraph(svg, daily, 'date', 'numArticles', 'steelblue', 7000);

  listen('toggle-daily-view', daily, 'date', 'numArticles');
  listen('toggle-weekly-view', weekly, 'date', 'numArticles');
  listen('toggle-monthly-view', monthly, 'date', 'numArticles');
}

let listen = (id, data, xprop, yprop) => {
  document.getElementById(id).addEventListener('click', () => {
    update(id, data, xprop, yprop);
  })
}

let update = (id, data, xprop, yprop) => {
  if (view !== id) {
    updateLineGraph(svg, data, 1000, xprop, yprop);
    view = id;
  }
}
