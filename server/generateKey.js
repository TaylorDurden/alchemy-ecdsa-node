const { secp256k1 } = require('ethereum-cryptography/secp256k1.js');
const { utf8ToBytes, toHex } = require('ethereum-cryptography/utils.js');

const privateKey1 = toHex(secp256k1.utils.randomPrivateKey());
const privateKey2 = toHex(secp256k1.utils.randomPrivateKey());
const privateKey3 = toHex(secp256k1.utils.randomPrivateKey());

console.log('privateKey1: ', privateKey1);
console.log('privateKey2: ', privateKey2);
console.log('privateKey3: ', privateKey3);

const getLast20BytesPublicKey = (privateKey) =>
  toHex(secp256k1.getPublicKey(privateKey)).slice(-20);

const publicKey1 = getLast20BytesPublicKey(privateKey1);
const publicKey2 = getLast20BytesPublicKey(privateKey2);
const publicKey3 = getLast20BytesPublicKey(privateKey3);

console.log('publicKey1: ', publicKey1);
console.log('publicKey2: ', publicKey2);
console.log('publicKey3: ', publicKey3);
