export default class Choropleth {
    constructor(
        svg, areaclass, borderclass,
        geoarea, geoborder, path
    ) {
        this.svg = svg;
        this.areaclass = areaclass;
        this.borderclass = borderclass;
        this.geoarea = geoarea;
        this.geoborder = geoborder;
        this.path = path;
    }

    render() {
        this.svg.selectAll(`.${this.areaclass}`)
            .data(this.geoarea)
            .join(
                enter => {
                    return enter.append('path')
                        .attr('d', this.path)
                        .attr('class', this.areaclass)
                        .attr('fill', 'red');
                }
            )

        this.svg.append('path')
            .datum(this.geoborder)
            .attr('fill', 'none')
            .attr('class', this.borderclass)
            .attr('stroke', 'black')
            .attr('stroke-linejoin', 'round')
            .attr('d', this.path);
    }
}