export default class Choropleth {
    constructor(
        svg, areaclass, borderclass,
        geoarea, geoborder, path,
        datamap, colormap,
        getprop
    ) {
        this.svg = svg;
        this.areaclass = areaclass;
        this.borderclass = borderclass;
        this.geoarea = geoarea;
        this.geoborder = geoborder;
        this.path = path;
        this.datamap = datamap;
        this.colormap = colormap;
        this.getprop = getprop;
    }

    colorfunction(d) {
        let c = this.colormap(this.datamap[d]);
        return (c == undefined) ? 'lightgrey' : c;
    }

    render() {
        this.svg.selectAll(`.${this.areaclass}`)
            .data(this.geoarea)
            .join(
                enter => {
                    return enter.append('path')
                        .attr('d', this.path)
                        .attr('class', this.areaclass)
                        .attr('fill', d => this.colorfunction(this.getprop(d)));
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