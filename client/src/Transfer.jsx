import { useState } from 'react';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { utf8ToBytes, toHex } from 'ethereum-cryptography/utils.js';
import server from './server';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const signMessage = async (msg) => {
    const msgHash = hashMessage(msg);
    return secp256k1.sign(msgHash, privateKey);
  };

  const hashMessage = (message) => {
    return keccak256(utf8ToBytes(message));
  };

  async function transfer(evt) {
    evt.preventDefault();
    const signature = await signMessage(address);
    console.log(`r: ${signature.r.toString()}`);
    console.log(`s: ${signature.s.toString()}`);
    console.log(`recovery: ${signature.recovery}`);
    const hashMsg = toHex(hashMessage(address));
    console.log(`hashMsg: ${hashMsg}`);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: signature.toCompactHex(),
        recovery: signature.recovery,
        hashMsg,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className='container transfer' onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder='1, 2, 3...'
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder='Type an address, for example: 0x2'
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type='submit' className='button' value='Transfer' />
    </form>
  );
}

export default Transfer;
