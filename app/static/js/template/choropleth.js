export default class Choropleth {
    constructor(
        svg, areaclass, geoarea, geoborder, path
    ) {
        this.svg = svg;
        this.areaclass = areaclass;
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
    }
}