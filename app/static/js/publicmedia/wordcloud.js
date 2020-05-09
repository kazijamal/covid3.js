// Set the dimensions and margins of the graph
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 800; // Use window's width
const height = 800 - margin.top - margin.bottom; // Use window's height

const data = [
  { text: 'Hello', value: 2400 },
  { text: 'happy', value: 2000 },
  { text: 'beautiful', value: 1000 },
  { text: 'rainbow', value: 1740 },
  { text: 'unicorn', value: 500 },
  { text: 'glitter', value: 1256 },
  { text: 'happy', value: 400 },
  { text: 'pie', value: 1692 },
];

const fill = d3.scaleOrdinal(d3.schemeCategory10);

const wordScale = d3.scaleLinear().domain([0, 2400]).range([20, 60]);

const draw = (words) => {
  d3.select('#wordcloud')
    .append('svg')
    .attr('width', 900)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
    .selectAll('text')
    .data(words)
    .enter()
    .append('text')
    .text((d) => d.text)
    .style('font-size', (d) => {
      console.log(d.size);
      console.log(wordScale(d.value));
      return wordScale(d.value) + 'px';
    })
    .style('font-family', (d) => {
      return d.font;
    })
    .style('fill', (d, i) => fill(i))
    .attr('text-anchor', 'middle')
    .attr(
      'transform',
      (d) => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')'
    );
};

const layout = d3.layout
  .cloud()
  .size([300, 700])
  .words(data)
  .font('Open Sans')
  .padding(10)
  .rotate(function () {
    return ~~(Math.random() * 2) * 90;
  })
  .on('end', draw);

layout.start();
