import { initFromToCandleMinutes } from "./Sync_Candle";

const from = new Date().getTime() - 2 * 24 * 60 * 60 * 1000;
const to = new Date().getTime();

initFromToCandleMinutes(Math.round(from / 1000), Math.round(to / 1000)).then();
// initFromToCandleMinutes(1708490160, 1708490520).then();
