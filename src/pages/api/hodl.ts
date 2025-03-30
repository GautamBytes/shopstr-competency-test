import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'node:crypto';
import {
  generatePreimageAndHash,
  createHodlInvoice,
  payHodlInvoice,
  settleHodlInvoice,
  cancelHodlInvoice
} from '../../lib/lightningService';

// Ensure this API route runs using the Node.js runtime.
export const config = {
  runtime: 'nodejs',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Generate a preimage and hash for the invoice
    const { preimage, hash } = generatePreimageAndHash();
    
    // Create a HODL invoice
    const invoice = createHodlInvoice(
      5000, // 5000 sats
      "Shopstr order #12345",
      hash
    );
    
    // Simulate payment (funds are held)
    const heldInvoice = payHodlInvoice(invoice);
    
    // Test settling with correct preimage
    const settledInvoice = settleHodlInvoice(heldInvoice, preimage);
    
    // Test settling with incorrect preimage
    const wrongPreimage = crypto.randomBytes(32).toString('hex');
    const failedSettlement = settleHodlInvoice(heldInvoice, wrongPreimage);
    
    // Test cancellation
    const canceledInvoice = cancelHodlInvoice(heldInvoice);
    
    // Return the results as JSON
    res.status(200).json({
      preimageAndHash: { preimage, hash },
      originalInvoice: invoice,
      heldInvoice,
      settledInvoice,
      failedSettlement,
      canceledInvoice
    });
  } catch (error) {
    console.error('Error in /api/hodl:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
