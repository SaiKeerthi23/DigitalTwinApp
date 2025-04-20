import Web3 from 'web3';
import DigitalTwinManagement from './DigitalTwinManagement.json';

console.log('DigitalTwinManagement:', DigitalTwinManagement); // Keep this for debugging

const web3 = new Web3(window.ethereum);

const contractAddress = '0x98fDebea6C1690F8011D9c66caaE7833242828FD'; // Replace with your contract address

// Access the ABI using DigitalTwinManagement.abi
const contract = new web3.eth.Contract(DigitalTwinManagement.abi, contractAddress);


export { web3, contract };