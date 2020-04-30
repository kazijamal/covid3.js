// Credits to https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89 for showing how to create a line chart in d3.js v5

// Set the dimensions and margins of the graph
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 1000 - margin.left - margin.right; // Use window's width
const height = 600 - margin.top - margin.bottom; // Use window's height

// TODO: extract numDatapoints dynamically
const numDatapoints = 104;

// X scale maps the index of our data to the width of the graph
const xScale = d3
  .scaleLinear()
  // .domain([0, numDatapoints - 1])
  .range([0, width]);

// Y scale maps the upper bound of the number of articles (2000) to the height of the graph
// TODO: extract upper bound dynamically
const yScale = d3.scaleLinear().domain([0, 2000]).range([height, 0]);

// Append the SVG object to the body of the page
const svg = d3
  .select('#line-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const numArticlesPerDay = {};

const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

// Read the data
// TODO: Split this chunk into smaller, intentional pieces
d3.csv('/data/sentiment/publicmedia')
  .then((numArticles) => {
    xScale.domain(d3.extent(numArticles, (d) => new Date(d.date)));

    // d3's line generator
    const line = d3
      .line()
      .x((d) => xScale(new Date(d.date))) // Set x values for the line generator
      .y((d) => yScale(d.y)) // Set y values for the line generator
      .curve(d3.curveMonotoneX); // Apply smoothing to the curve

    // yScale.domain(d3.extent([0, d3.max(numArticles, (d) => +d.numArticles)]));

    for (const day in numArticles) {
      dayData = numArticles[day];
      numArticlesPerDay[day] = { ...dayData, date: new Date(dayData.date) };
    }

    const numArticlesPerDayData = d3
      .range(numDatapoints)
      .map((d) => ({ y: +numArticlesPerDay[d].numArticles }));

    for (const key in numArticles) {
      numArticlesPerDayData[new Date(numArticles[key].date)] =
        numArticlesPerDayData[key];
    }

    console.log(numArticlesPerDayData);

    // Call the x-axis in a group tag
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3.axisBottom(xScale).tickFormat((date) => {
          const dateObj = new Date(date);
          return `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;
        })
      ); // Create an x-axis component with d3.axisBottom

    // Call the y-axis in a group tag
    svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale)); // Create a y-axis component with d3.axisLeft

    console.log(numArticlesPerDayData);

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
      .attr('cx', (_, i) => {
        const { date } = numArticlesPerDay[i];
        // console.log(`${date.getMonth() + 1}/${date.getDate()}`);
        // console.log(xScale(new Date(date)));
        return xScale(new Date(date));
      })
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 5);
    // TODO: Add on mouseover events on these datapoint circles
  })
  .catch((err) => console.log(err));
