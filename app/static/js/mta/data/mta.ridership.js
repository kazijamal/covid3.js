import { setDate, parseData } from '../../utility.js';

const getMTARidership = async () => await d3.csv('/data/transportation/mta');

export { getMTARidership };