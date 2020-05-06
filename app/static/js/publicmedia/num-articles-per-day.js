// // Credits to https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89 for showing how to create a line chart in d3.js v5

// // Set the dimensions and margins of the graph
// const width = 1000 - margin.left - margin.right; // Use window's width
// const height = 600 - margin.top - margin.bottom; // Use window's height

// // Append the SVG object to the body of the page
// const svg = d3
//   .select('#line-chart')
//   .append('svg')
//   .attr('width', width + margin.left + margin.right)
//   .attr('height', height + margin.top + margin.bottom)
//   .append('g')
//   .attr('transform', `translate(${margin.left}, ${margin.top})`);

// // Zero-based object constant for month retrieval
// const months = {
//   0: 'January',
//   1: 'February',
//   2: 'March',
//   3: 'April',
//   4: 'May',
//   5: 'June',
//   6: 'July',
//   7: 'August',
//   8: 'September',
//   9: 'October',
//   10: 'November',
//   11: 'December',
// };

// const VIEW_TRANSITION_DURATION = 1000;

// const DATA_STATE = 'DAILY';

let view = 'daily';

import {
  setSVGBounds,
  renderLineGraph,
  updateLineGraph,
} from '../template/line.graph.js';

let svg;

window.onload = async () => {
  let data = await d3.csv('/data/sentiment/publicmedia');

  data.forEach(d => {
    d.date = new Date(`${d.date}T00:00:00`)
    d.numArticles = +d.numArticles;
  })

  svg = d3.select('#line-chart')
    .append('svg')
    .attr('id', 'line')
    .attr('width', '100%')
    .attr('height', '50vh');

  let margin = { top: 50, right: 50, bottom: 50, left: 50 };

  console.log(data);
  setSVGBounds(svg, margin);
  await renderLineGraph(svg, data, 'date', 'numArticles', 'steelblue', 7000);
}
// // Read the data
// // TODO: Split this chunk into smaller, intentional pieces
// d3.csv('/data/sentiment/publicmedia')
//   .then((numArticles) => {
//     const numArticlesPerDay = {};

//     // Store the length of the dataset, or number of datapoints
//     const numDatapoints = numArticles.length;

//     // Set xScale and yScale domains
//     xScale.domain(d3.extent(numArticles, (d) => new Date(d.date)));
//     yScale.domain(
//       d3.extent([0, d3.max(numArticles, (d) => +d.numArticles) + 300])
//     );

//     // Create an object, numArticlesPerDay, based on numArticles, to store Date objects instead of strings
//     for (const day in numArticles) {
//       dayData = numArticles[day];
//       numArticlesPerDay[day] = { ...dayData, date: new Date(dayData.date) };
//     }

//     // Create an object, numArticlesPerDay, to map a zero-based index (up to numDatapoints) to the number of articles its position corresponds with
//     const numArticlesPerDayData = d3.range(numDatapoints).map((d) => ({
//       y: +numArticlesPerDay[d].numArticles,
//       date: numArticlesPerDay[d].date,
//     }));

//     // Call the x-axis in a group tag
//     svg
//       .append('g')
//       .attr('class', 'x-axis')
//       .attr('transform', `translate(0, ${height})`)
//       .call(
//         d3.axisBottom(xScale).tickFormat((date) => {
//           const dateObj = new Date(date);
//           return `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;
//         })
//       ); // Create an x-axis component with d3.axisBottom

//     // Call the y-axis in a group tag
//     svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale)); // Create a y-axis component with d3.axisLeft

//     // d3's line generator
//     const line = d3
//       .line()
//       .x((d) => xScale(new Date(d.date))) // Set x values for the line generator
//       .y((d) => yScale(d.y)) // Set y values for the line generator
//       .curve(d3.curveMonotoneX); // Apply smoothing to the curve

//     // Append the path, bind the data, and call the line generator
//     svg
//       .append('path')
//       .datum(numArticlesPerDayData) // Bind the data to the line
//       .attr('class', 'line') // TODO: Create custom CSS to style line
//       .attr('d', line); // Call the line generator

//     // Append a circle for each datapoint
//     // svg
//     //   .selectAll('.dot')
//     //   .data(numArticlesPerDayData)
//     //   .enter()
//     //   .append('circle')
//     //   .attr('class', 'dot')
//     //   .attr('cx', (_, i) => {
//     //     const { date } = numArticlesPerDay[i];
//     //     return xScale(new Date(date));
//     //   })
//     //   .attr('cy', (d) => yScale(d.y))
//     //   .attr('r', 5);
//     // TODO: Add on mouseover events on these datapoint circles

//     const formatDate = d3.timeFormat('%Y-%m-%d');
//     const bisectDate = d3.bisector(function (d) {
//       return formatDate(new Date(d['date']));
//     }).left;

//     // fix those integers
//     numArticles.forEach((d, i) => {
//       d.y = parseInt(d.numArticles);
//     });

//     ///////////////////////
//     // helper functions
//     const create_time_unit_data = (parse_date) => {
//       const new_data = JSON.parse(JSON.stringify(numArticles));
//       new_data.forEach(function (d, i) {
//         const offset = parse_date(d.date);
//         if (offset == 0 || i == 0 || i == numArticles.length - 1) {
//           // it's a new date_unit, or this is the first or last date in the array
//           d['start'] = true;
//         } else {
//           d['start'] = false;

//           // add this value to the start of the week
//           let tar_idx = i - offset;
//           if (tar_idx < 0) {
//             tar_idx = 0;
//           }
//           console.log(new_data);
//           new_data[tar_idx].y += d.y;

//           // then nil out
//           d.y = -1;
//         }
//       });

//       return new_data;
//     };

//     ///////////////////////
//     // generate weekly data
//     const parse_for_week = (date) => {
//       const dateObj = new Date(date);
//       return dateObj.getDay();
//     };
//     const week_data = create_time_unit_data(parse_for_week);

//     ///////////////////////
//     // generate monthly data
//     const parse_for_month = (date) => {
//       const dateObj = new Date(date);
//       return dateObj.getDate() - 1;
//     };
//     const month_data = create_time_unit_data(parse_for_month);

//     // d3's line generator
//     const weeklyLine = d3
//       .line()
//       .x((d) => xScale(new Date(d.date))) // Set x values for the line generator
//       .y((d) => yScale(d.y)) // Set y values for the line generator
//       .curve(d3.curveMonotoneX); // Apply smoothing to the curve

//     const monthlyLine = d3
//       .line()
//       .x((d) => xScale(new Date(d.date))) // Set x values for the line generator
//       .y((d) => yScale(d.y)) // Set y values for the line generator
//       .curve(d3.curveMonotoneX); // Apply smoothing to the curve

//     dailyViewHandler = () => {
//       d3.select('.line')
//         .transition()
//         .duration(VIEW_TRANSITION_DURATION)
//         .attrTween('d', function (d) {
//           const previous = d3.select(this).attr('d');
//           const current = line(numArticlesPerDayData);
//           return d3.interpolatePath(previous, current);
//         });
//     };

//     weeklyViewHandler = () => {
//       d3.select('.line')
//         .transition()
//         .duration(VIEW_TRANSITION_DURATION)
//         .attrTween('d', function (d) {
//           const previous = d3.select(this).attr('d');
//           const current = weeklyLine(week_data);
//           return d3.interpolatePath(previous, current);
//         });
//     };

//     monthlyViewHandler = () => {
//       d3.select('.line')
//         .transition()
//         .duration(VIEW_TRANSITION_DURATION)
//         .attrTween('d', function (d) {
//           console.log(month_data);
//           const previous = d3.select(this).attr('d');
//           const current = monthlyLine(month_data);
//           return d3.interpolatePath(previous, current);
//         });
//     };

//     const toggleDailyViewBtn = document.getElementById('toggle-daily-view');
//     const toggleWeeklyViewBtn = document.getElementById('toggle-weekly-view');
//     const toggleMonthlyViewBtn = document.getElementById('toggle-monthly-view');

//     toggleDailyViewBtn.addEventListener('click', dailyViewHandler);
//     toggleWeeklyViewBtn.addEventListener('click', weeklyViewHandler);
//     toggleMonthlyViewBtn.addEventListener('click', monthlyViewHandler);
//   })
//   .catch((err) => console.log(err));
