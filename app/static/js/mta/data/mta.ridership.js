let getMTARidership = async () => await d3.csv('/data/transportation/mta');

let getExtent = (ridership) => d3.extent(ridership, d => new Date(`${d.date}T00:00:00`));

let makeRidershipObject = (extent, step) => {
    // Map each date in the data to 0 ridership
    let ridership = new Object();
    for (let i = extent[0]; i <= extent[1]; i.setDate(i.getDate() + step)) {
        let iso = i.toISOString();
        let current = ridership[`${iso.substring(0, iso.indexOf('T'))}`] = new Object();

        current['date'] = new Date(iso);
        current['riders'] = 0;
    }

    return ridership;
}

let insertData = (ridershipObject) => {
    let array = new Array();
    for (const date in ridershipObject) {
        array.push(ridershipObject[date])
    }

    return array;
}

let getDailyRidership = async () => {
    let ridership = await getMTARidership();

    let extent = getExtent(ridership);

    // Map each date in the data to 0 ridership
    let dailyRidership = makeRidershipObject(extent, 1);

    // Fill in ridership data for each day
    ridership.forEach(d => {
        dailyRidership[d.date]['riders'] += +d.enter;
    });

    // Insert data into an array
    return insertData(dailyRidership);
}

let getWeeklyRidership = async () => {
    let ridership = await getMTARidership();

    let extent = getExtent(ridership);

    // Map each week in the data to 0 ridership
    let weeklyRidership = makeRidershipObject(extent, 7);

    // Fill in ridership data for each day
    ridership.forEach(d => {
        let current = new Date(`${d.date}T00:00:00`);
        let day = current.getDay();
        if (day < 6) {
            // shift days other than Saturday
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay
        }
        weeklyRidership[d.date]['riders'] += +d.enter;
    });

    return insertData(weeklyRidership);
}

export { getDailyRidership, getWeeklyRidership };