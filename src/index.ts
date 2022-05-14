import fs from 'fs';
import { Interface } from '@ethersproject/abi';
import { JsonRpcProvider, WebSocketProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { Wallet } from '@ethersproject/wallet';

const CHAIN_HOST = 'localhost';
const CHAIN_PORT = 8545;
const DEMO_CONTRACT_ABI_PATH = './build/contracts/VoteDemo.json';
const DEMO_CONTRACT_ADDRESS = '0xD2B31360732BcC40da3a46462a1c562853e18203';
const DEMO_WALLET_PRIVATE_KEY = '0x1bf8999ad463d3f969cfca2324f5610ffcb4bcb456953ec85cf3863d6c50e72e';

(async () => {
  // const provider = new JsonRpcProvider(`http://${CHAIN_HOST}:${CHAIN_PORT}`);
  const provider = new WebSocketProvider(`ws://${CHAIN_HOST}:${CHAIN_PORT}`);

  const walletWithProvider = new Wallet(DEMO_WALLET_PRIVATE_KEY, provider);
  
  console.log(`address: ${walletWithProvider.address} / balance: ${await walletWithProvider.getBalance()} / isSigner: ${walletWithProvider._isSigner}`);

  const [
    firstAccount,
    secondAccount,
    ...otherAccounts
  ] = await provider.listAccounts();

  const abiFileJson = JSON.parse(await fs.promises.readFile(DEMO_CONTRACT_ABI_PATH, {
    encoding: 'utf-8'
  }));

  // https://docs.ethers.io/v5/api/utils/abi/interface/
  const voteInterface = new Interface(abiFileJson.abi);

  // list all vote interface functions
  // console.log(voteInterface.functions);

  const voteContract = new Contract(DEMO_CONTRACT_ADDRESS, voteInterface, walletWithProvider);

  const voteOwner = await voteContract.owner();
  const voteResult = await voteContract.vote('0x1');

  console.log(`vote owner address: ${voteOwner}`);
  console.log(voteResult);
  console.log('✨ Done');

  await provider.destroy();
})();
