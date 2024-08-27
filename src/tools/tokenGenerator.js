import crypto from 'crypto';

function generateRandomToken() {
  return crypto.randomBytes(32).toString('hex'); 
}

export default generateRandomToken;