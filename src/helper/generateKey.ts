import _ from "lodash";
import { KeyRedisPrefix } from "./enum";

function genKeyTokenPriceOHLC(
  network: string,
  tokenAddress: string,
  period: string
) {
  return `${KeyRedisPrefix.ohlcPrefix}:${network}_${tokenAddress}:${period}`;
}

function genKeyTokenPriceOHLCVNDC(
  network: string,
  tokenAddress: string,
  period: string
) {
  return `${KeyRedisPrefix.ohlcPrefix}_vndc:${network}_${tokenAddress}:${period}`;
}

function genKeyTokenPriceOHLCInTimestamp(
  tokenAddress: string,
  timestamp: number,
  period: string
) {
  return `${KeyRedisPrefix.ohlcPrefix}:${tokenAddress}:${timestamp}:${period}`;
}

function genKeySpecificProvider(network: string, token: string) {
  return `${_.toLower(network)}_${_.toLower(token)}`;
}

function getKeyCacheTokeInfo(network: string, token: string) {
  return `${KeyRedisPrefix.searchToken}_${network}_${token}`;
}

export {
  genKeyTokenPriceOHLC,
  genKeyTokenPriceOHLCInTimestamp,
  genKeySpecificProvider,
  getKeyCacheTokeInfo,
  genKeyTokenPriceOHLCVNDC,
};
