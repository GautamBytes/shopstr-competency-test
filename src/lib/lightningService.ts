import crypto from 'node:crypto';

export interface HODLInvoice {
  id: string;
  preimage: string;
  hash: string;
  amount: number;
  description: string;
  status: 'pending' | 'held' | 'settled' | 'canceled';
  expiresAt: number;
}

/**
 * Generate a preimage and hash for a HODL invoice
 */
export function generatePreimageAndHash() {
  // Create a random preimage
  const preimage = crypto.randomBytes(32);
  
  // Create the hash of the preimage
  const hash = crypto.createHash('sha256').update(preimage).digest('hex');
  
  return {
    preimage: preimage.toString('hex'),
    hash
  };
}

/**
 * Create a simulated HODL invoice
 */
export function createHodlInvoice(
  amount: number, 
  description: string, 
  preimageHash: string
): HODLInvoice {
  // Generate a random ID for the invoice
  const id = crypto.randomBytes(16).toString('hex');
  
  // Set expiry to 24 hours from now
  const expiresAt = Math.floor(Date.now() / 1000) + 86400;
  
  return {
    id,
    preimage: '', // Preimage is unknown to the receiver
    hash: preimageHash,
    amount,
    description,
    status: 'pending',
    expiresAt
  };
}

/**
 * Simulate payment of a HODL invoice - sets status to 'held'
 */
export function payHodlInvoice(invoice: HODLInvoice): HODLInvoice {
  return {
    ...invoice,
    status: 'held'
  };
}

/**
 * Settle a HODL invoice with the correct preimage
 */
export function settleHodlInvoice(
  invoice: HODLInvoice, 
  providedPreimage: string
): HODLInvoice {
  // Calculate the hash of the provided preimage
  const providedHash = crypto.createHash('sha256')
    .update(Buffer.from(providedPreimage, 'hex'))
    .digest('hex');
  
  // Check if the hash matches
  if (providedHash === invoice.hash) {
    return {
      ...invoice,
      status: 'settled',
      preimage: providedPreimage
    };
  }
  
  // If hash doesn't match, return unchanged invoice
  return invoice;
}

/**
 * Cancel a HODL invoice
 */
export function cancelHodlInvoice(invoice: HODLInvoice): HODLInvoice {
  return {
    ...invoice,
    status: 'canceled'
  };
}
