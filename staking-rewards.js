import fetch from 'node-fetch';

const UNISWAP_V3_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
const WALLET_ADDRESS = '0xfd235968e65b0990584585763f837a5b5330e6de';

const query = `
{
  user(id: "${WALLET_ADDRESS.toLowerCase()}") {
    liquidityPositions {
      id
      liquidityTokenBalance
      pair {
        id
        token0 {
          id
          symbol
          name
        }
        token1 {
          id
          symbol
          name
        }
      }
    }
  }
}`;

async function fetchStakingRewards() {
  try {
    const response = await fetch(UNISWAP_V3_SUBGRAPH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching staking rewards:', error);
    return [];
  }
}

fetchStakingRewards().then((liquidityPositions) => {
  if (liquidityPositions.length && liquidityPositions.length > 0) {
    console.log('Liquidity Positions:');
    liquidityPositions.forEach((position) => {
      console.log(`Position ID: ${position.id}`);
      console.log(`Liquidity Token Balance: ${position.liquidityTokenBalance}`);
      console.log(`Pair: ${position.pair.token0.symbol}/${position.pair.token1.symbol}`);
      console.log(`Token 0: ${position.pair.token0.name} (${position.pair.token0.id})`);
      console.log(`Token 1: ${position.pair.token1.name} (${position.pair.token1.id})`);
      console.log('---');
    });
  } else {
    console.log('No liquidity positions found for the specified wallet address.');
  }
});
