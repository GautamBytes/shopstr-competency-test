/* eslint-disable @typescript-eslint/no-explicit-any */
import { CashuMint, CashuWallet, getEncodedToken } from '@cashu/cashu-ts';
import * as secp from '@noble/secp256k1';
import { bytesToHex, randomBytes } from '@noble/hashes/utils';

const MINT_URL = 'https://testnut.cashu.space'; // Test mint URL

// Generate a new secp256k1 key pair and return the keys as hexadecimal strings.
export function generateCashuKeys() {
  const privateKey = randomBytes(32);
  const publicKey = secp.getPublicKey(privateKey);
  return {
    privateKey: bytesToHex(privateKey),
    publicKey: bytesToHex(publicKey),
  };
}

// Helper to simulate P2PK locking by adding a 'p2pk' field to each proof.
function lockProofs(proofs: any[], pubkey: string) {
  return proofs.map((proof) => ({
    ...proof,
    p2pk: pubkey, // Indicates this proof is locked to the provided public key.
  }));
}

// Issues a P2PK token by requesting a mint quote, minting proofs,
// and then "locking" them using our helper.
export async function createP2PkToken(amount: number, pubkey: string) {
  try {
    const mint = new CashuMint(MINT_URL);
    const wallet = new CashuWallet(mint);

    // Request a mint quote using the updated method.
    const mintQuote = await wallet.createMintQuote(amount);
    const { quote } = mintQuote; // Extract the quote from the response.
    
    // Mint proofs using the provided quote.
    const proofs = await wallet.mintProofs(amount, quote);
    
    // Lock the proofs with the given public key.
    const lockedProofs = lockProofs(proofs, pubkey);

    // Include the mint URL in the token object
    return {
      proofs: lockedProofs,
      token: getEncodedToken({ 
        proofs: lockedProofs,
        mint: MINT_URL  // Add the mint URL to satisfy the Token type
      }),
    };
  } catch (error) {
    console.error('Cashu error during issuance:', error);
    throw error;
  }
}

// Claims a token by calling the wallet's receive method.
// If the token is P2PK locked, providing the corresponding private key should "unlock" it.
export async function claimP2PkToken(token: string, privkey: string) {
  try {
    const mint = new CashuMint(MINT_URL);
    const wallet = new CashuWallet(mint);
    
    // Calling receive with the private key should validate/unlock the P2PK token.
    const claimedProofs = await wallet.receive(token, { privkey });
    return claimedProofs;
  } catch (error) {
    console.error('Cashu error during claim:', error);
    throw error;
  }
}
