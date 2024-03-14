import CryptoJS from "crypto-js";

const SECRET_KEY = "icp-dai-chatbot";
export function encryptData(data) {
  if (!data) return;
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

export function decryptData(data) {
  if (!data) return;
  return CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
}
