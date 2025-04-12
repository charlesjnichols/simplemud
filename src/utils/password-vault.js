'use strict';

const fs = require('fs');
const path = require('path');
const NodeRSA = require('node-rsa');

const publicKeyPath = path.join(process.cwd(), 'keys', 'public.pem');
const privateKeyPath = path.join(process.cwd(), 'keys', 'private.pem');

const publicKey = new NodeRSA(fs.readFileSync(publicKeyPath), 'pkcs8-public-pem', {
  encryptionScheme: 'pkcs1_oaep',
});

const privateKey = new NodeRSA(fs.readFileSync(privateKeyPath), 'pkcs8-private-pem', {
  encryptionScheme: 'pkcs1_oaep',
});

function encryptPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('encryptPassword: password must be a non-null string');
  }
  return 'ENC:' + publicKey.encrypt(password, 'base64');
}

function decryptPassword(encString) {
  if (!encString || typeof encString !== 'string') {
    throw new Error('decryptPassword: input must be a non-null string');
  }
  const raw = encString.startsWith('ENC:') ? encString.slice(4) : encString;
  return privateKey.decrypt(raw, 'utf8');
}

function isEncrypted(str) {
  return typeof str === 'string' && str.startsWith('ENC:');
}

module.exports = {
  encryptPassword,
  decryptPassword,
  isEncrypted,
};
