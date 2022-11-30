const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();
console.log("private key:", toHex(privateKey));

const fullPublicKey = secp.getPublicKey(privateKey);
console.log("full public key:", toHex(fullPublicKey));

const publicKey = getAddress(fullPublicKey);
console.log("publicKey key:", toHex(publicKey));

function getAddress(publicKey) {
  const firstByte = publicKey.slice(1);
  const cak = keccak256(firstByte);
  const address = cak.slice(-20);
  return address;
}
