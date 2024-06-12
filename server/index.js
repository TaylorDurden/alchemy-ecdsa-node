import * as secp from '@noble/secp256k1';
import { utf8ToBytes, toHex } from 'ethereum-cryptography/utils.js';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import express from 'express';
import cors from 'cors';
const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  '156d35cd47645f32b9b3': 100,
  '16a9fa5e0835c8429852': 50,
  '28d058ef9e61af6c5435': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { signature, recovery, hashMsg, recipient, amount } = req.body;

  let sig = secp.Signature.fromCompact(signature);
  sig = sig.addRecoveryBit(recovery);
  console.log(`sig recovery: ${sig.recovery}`);
  console.log(`sig r: ${sig.r.toString()}`);
  console.log(`sig s: ${sig.s.toString()}`);

  console.log(`signature: ${sig}`);

  const rawPublicKey = sig.recoverPublicKey(hashMsg);
  // console.log(`rawPublicKey: ${JSON.stringify(rawPublicKey)}`);
  const publicKey = rawPublicKey.toHex().slice(-20);
  console.log(`publicKey: ${publicKey}`);
  setInitialBalance(publicKey);
  setInitialBalance(recipient);

  if (balances[publicKey] < amount) {
    res.status(400).send({ message: 'Not enough funds!' });
  } else {
    balances[publicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[publicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

const hashMessage = (message) => {
  return keccak256(utf8ToBytes(message));
};
