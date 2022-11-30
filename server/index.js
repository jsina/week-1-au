const express = require("express");
const {
  utf8ToBytes,
  toHex,
  hexToBytes,
} = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const secp = require("ethereum-cryptography/secp256k1");

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  c7275eaf563b793603a1b1a552f61621038e44b7: 100,
  c3b9cce0ae6b3186ff14b08f401c2fae23de9118: 50,
  c6bb66f539d0d3a89776f0b0a6e74159ae82a943: 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, signature, recoveryBit } = req.body;

  const message = JSON.stringify({
    amount: amount,
    sender,
    recipient,
  });
  const hashedMessage = hashMessage(message);

  const recoverd = secp.recoverPublicKey(hashedMessage, signature, recoveryBit);

  const add = getAddress(recoverd);

  if (toHex(add) != sender) {
    res.status(400).send({ message: "You are not a guy!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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

function hashMessage(message) {
  const byte = utf8ToBytes(message.toString());
  return keccak256(byte);
}
// async function recoverKey(amount, signature, recoveryBit) {
//   console.log({ x: typeof signature });
//   const hashedMessage = hashMessage(amount.toString());
//   return secp.recoverPublicKey(hashedMessage, signature, recoveryBit);
// }

function getAddress(publicKey) {
  const firstByte = publicKey.slice(1);
  const cak = keccak256(firstByte);
  const address = cak.slice(-20);
  console.log({ address });
  return address;
}
