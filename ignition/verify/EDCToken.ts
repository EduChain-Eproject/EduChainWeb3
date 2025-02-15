
const INITIAL_SUPPLY: bigint = 4_000_000_000n;
const DECIMALS = 18;

const agr = INITIAL_SUPPLY * BigInt((10 ** DECIMALS));

module.exports = [
    agr,
]