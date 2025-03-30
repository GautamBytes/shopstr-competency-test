import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  generateP2PKKeys, 
  mintP2PKToken, 
  signToken, 
  verifySignedToken 
} from '../../lib/cashuService';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Generate P2PK keypair
  const keys = generateP2PKKeys();
  
  // Mint a token locked to the public key
  const token = mintP2PKToken(1000, keys.publicKey);
  
  // Sign the token with the private key
  const signedToken = signToken(token, keys.privateKey);
  
  // Verify the signed token
  const isValid = verifySignedToken(signedToken);
  
  // Return the results
  res.status(200).json({
    publicKey: keys.publicKey.substring(0, 100) + '...',
    token,
    signedToken,
    isValid,
    message: isValid ? "Token successfully verified and can be spent!" : "Token verification failed"
  });
}