let getMTARidership = async () => await d3.csv('/data/transportation/mta');

let dateScaffold = (lower, upper, step) => {
    let scaffold = new Object();

    for (let i = lower; i <= upper; i.setDate(i.getDate() + step)) {
        let iso = i.toISOString();
        let current = scaffold[iso.substring(0, iso.indexOf('T'))] = new Object();

        current['date'] = new Date(iso);
        current['riders'] = 0;
    }

    return scaffold;
}

let formatData = (scaffold) => {
    let data = new Array();
    for (const date in scaffold) {
        data.push(scaffold[date]);
    }
    return data;
}

let getDailyRidership = (ridership, lower, upper) => {
    let scaffold = dateScaffold(lower, upper, 1);

    ridership.forEach(d => {
        scaffold[d.date]['riders'] += +d.enter;
    });

    return formatData(scaffold);;
}

let getWeeklyRidership = (ridership, lower, upper) => {
    let scaffold = dateScaffold(lower, upper, 7);

    ridership.forEach(d => {
        let current = new Date(`${d.date}T00:00:00`);
        let day = current.getDay();

        if (day < 6) {
            current.setDate(current.getDate() + 6 - day);
        } else if (day == 6) {
            current.setDate(current.getDate() + 7);
        }

        let iso = current.toISOString();
        let currentString = iso.substring(0, iso.indexOf('T'));

        scaffold[currentString]['riders'] += +d.enter;
    })

    return formatData(scaffold);
}