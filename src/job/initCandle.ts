import { initFromToCandleMinutes } from "./Sync_Candle";

const from = new Date().getTime() - 2 * 24 * 60 * 60 * 1000;
const to = new Date().getTime();

initFromToCandleMinutes(Math.round(from / 1000), Math.round(to / 1000)).then();
