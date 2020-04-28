// Credits to https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89 for showing how to create a line chart in d3.js v5

// Set the dimensions and margins of the graph
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = window.innerWidth - margin.left - margin.right; // Use window's width
const height = window.innerHeight - margin.top - margin.bottom; // Use window's height

// TODO: extract numDatapoints dynamically
const numDatapoints = 104;

// X scale maps the index of our data to the width of the graph
const xScale = d3
  .scaleLinear()
  .domain([0, numDatapoints - 1])
  .range([0, width]);

// Y scale maps the upper bound of the number of articles (2000) to the height of the graph
// TODO: extract upper bound dynamically
const yScale = d3.scaleLinear().domain([0, 2000]).range([height, 0]);

// d3's line generator
const line = d3
  .line()
  .x((_, i) => xScale(i)) // Set x values for the line generator
  .y((d) => yScale(d.y)) // Set y values for the line generator
  .curve(d3.curveMonotoneX); // Apply smoothing to the curve

// Append the SVG object to the body of the page
const svg = d3
  .select('#line-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const numArticlesPerDay = {};

// Read the data
// TODO: Split this chunk into smaller, intentional pieces
d3.csv('/data/sentiment/publicmedia')
  .then((numArticles) => {
    for (const day in numArticles) {
      numArticlesPerDay[day] = numArticles[day];
    }
    const numArticlesPerDayData = d3
      .range(numDatapoints)
      .map((d) => ({ y: +numArticlesPerDay[d].numArticles }));

    // Call the x-axis in a group tag
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale)); // Create an x-axis component with d3.axisBottom

    // Call the y-axis in a group tag
    svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale)); // Create a y-axis component with d3.axisLeft

    // Append the path, bind the data, and call the line generator
    svg
      .append('path')
      .datum(numArticlesPerDayData) // Bind the data to the line
      .attr('class', 'line') // TODO: Create custom CSS to style line
      .attr('d', line); // Call the line generator

    // Append a circle for each datapoint
    svg
      .selectAll('.dot')
      .data(numArticlesPerDayData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (_, i) => xScale(i))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 5);
    // TODO: Add on mouseover events on these datapoint circles
  })
  .catch((err) => console.log(err));
