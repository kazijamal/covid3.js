let requestCaseData = async (keyword) => await d3.csv(`/data/transportation/covid/${keyword}`);

// https://github.com/nychealth/coronavirus-data

export { requestCaseData }