import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { sign } from "ethereum-cryptography/secp256k1";

import { PRIVATE_KEY } from "./consts";

function hashMessage(message) {
  const bytes = utf8ToBytes(message.toString());
  return keccak256(bytes);
}

export async function signMessage(message) {
  const hashedMessage = hashMessage(message);
  try {
    return sign(hashedMessage, PRIVATE_KEY, {
      recovered: true,
    });
  } catch (e) {
    console.log({ e });
  }
}
