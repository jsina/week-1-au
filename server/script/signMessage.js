// private key: 19176edf2aaf805f09fcc66855bd37cff9f3af5a872c5d069537c904a4ffa800
// full public key: 04ee24586ba6262fca75a888478633cab964b8fbcd0dd0d941f0fede63cc1450054fd970370e4293b230f7e8dd111f009db626052b4434488a06f1c17e5354a155
// publicKey key: c6bb66f539d0d3a89776f0b0a6e74159ae82a943

// private key: 86e235bde1f0c8d68535abb6a3dd4f00dd720f9e879542af31a25e91028db8dd
// full public key: 042c56eb71f3f1b5f52b4ee65f36a5c941220ee419d835ac5f865364e23c2f438d8737f24e3c9f3831438cff2a25c56173765323cb9b1a7be896bf3ea183fac67a
// publicKey key: c3b9cce0ae6b3186ff14b08f401c2fae23de9118

// private key: 2409f23e696f72fd334ce6e1d50ac659f404d2dcd892dd54f3b9d316d2522fba
// full public key: 0442ade6a4085bf6621e83eafcd54eb608f64ec2db6d1df657b10577db07d25715dc97ff731caa8b328ed216021728595c4e2f00131fac699bd9bdeb9730e74fa5
// publicKey key: c7275eaf563b793603a1b1a552f61621038e44b7
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

let privateKey = "";
let message = "";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
readline.question("what is your pk", (key) => {
  privateKey = key;
  readline.close();
});
readline.question("what is your message", (key) => {
  message = key;
  readline.close();
});

function hashMessage(message) {
  const byte = utf8ToBytes(message.toString());
  return keccak256(byte);
}

async function signMessage() {
  const hashedMessage = hashMessage(message);
  return secp.sign(hashedMessage, privateKey, { recovered: true });
}

async function recoveryKey(message, signature, recoveryBit) {
  const hashedMessage = hashMessage(message);
  return secp.recoverPublicKey(hashedMessage, signature, recoveryBit);
}
