import server from './server';
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { toHex } from 'ethereum-cryptography/utils.js';

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  const getLast20BytesPublicKey = (privateKey) =>
    toHex(secp256k1.getPublicKey(privateKey)).slice(-20);
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = getLast20BytesPublicKey(privateKey);
    if (publicKey) {
      setAddress(publicKey);
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className='container wallet'>
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder='Type an private key'
          type='password'
          value={address}
          onChange={onChange}
        ></input>
      </label>

      <label>Public Key Address: {address}</label>

      <div className='balance'>Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
