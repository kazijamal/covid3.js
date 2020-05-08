const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', '960')
  .attr('height', '600');
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
const y = d3.scaleLinear().rangeRound([height, 0]);

const g = svg
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('/data/sentiment/trumptweetspolaritiesonranges')
  .then((data) => {
    return data.map((d) => {
      d.numTweets = +d.numTweets;

      return d;
    });
  })
  .then((data) => {
    x.domain(
      data.map(function (d) {
        return d.rangeBracket;
      })
    );
    y.domain([0, 700]);

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'translate(-10,0)rotate(-45)');

    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(10))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Frequency');

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function (d) {
        return x(d.rangeBracket);
      })
      .attr('y', function (d) {
        return y(d.numTweets);
      })
      .attr('width', x.bandwidth())
      .attr('height', function (d) {
        return height - y(d.numTweets);
      });

    svg.attr('height', '660');
  })
  .catch((error) => {
    throw error;
  });
