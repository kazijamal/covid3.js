/**
 * Sends requests to a dynamic Flask route based on keyword.
 *
 * The Flask route is linked to the NYC Health GitHub repository.
 * @param {string} keyword possible keywords are file names at this repository:
 * https://github.com/nychealth/coronavirus-data
 * @return {Promise} A Promise containing an Array of Objects of zipcode case data.
 */
let requestCaseData = async (keyword) => await d3.csv(`/data/transportation/covid/${keyword}`);

/**
 * Removes cases from unknown zipcodes.
 * @return {Promise} A Promise containing an Array of Objects of zipcode case data
 */
let getZipCases = async () => {
    let cases = await requestCaseData('tests-by-zcta');
    cases.shift();

    return cases;
}

/**
 * Creates an Object based on cases to map positive cases to zipcodes
 * @param {Array<Object>} cases contains zipcode case data
 * @return {Object} contains the number of positive cases per zipcode
 */
let getZipMap = (cases) => {
    let map = new Object();

    cases.forEach(zip => {
        map[zip.MODZCTA] = +zip.Positive;
    });

    return map;
}

export { requestCaseData, getZipCases, getZipMap }