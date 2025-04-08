import type { NextApiRequest, NextApiResponse } from 'next';
import { generateCashuKeys, createP2PkToken, claimP2PkToken } from '../../lib/cashuService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Generate a new key pair.
    const { privateKey, publicKey } = generateCashuKeys();

    // Issue (mint and lock) a P2PK token with the public key.
    const issuanceResult = await createP2PkToken(10, publicKey);
    const { proofs, token } = issuanceResult;

    // Claim the token by "receiving" it.
    const claimedProofs = await claimP2PkToken(token, privateKey);
    
    res.status(200).json({
      success: true,
      privateKey,
      publicKey,
      issuedProofs: proofs,
      token,
      claimedProofs,
      message: 'Successfully issued and claimed P2PK token!',
    });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      error: 'Cashu operation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
