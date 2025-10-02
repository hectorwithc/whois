import numeral from "numeral";

export function formatWithCommas(number: number) {
  return numeral(number).format("0,0");
}

export function formatWithSuffix(number: number) {
  return numeral(number).format("0.00a").toUpperCase();
}
