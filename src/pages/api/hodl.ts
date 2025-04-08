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
    
    // Create a HODL invoice with a 24h expiry
    const invoice = createHodlInvoice(
      5000, // 5000 sats
      "Shopstr order #12345",
      hash
    );
    
    // Simulate payment (funds are held)
    const heldInvoice = payHodlInvoice(invoice);
    
    // --- Scenario 1: Normal Settlement ---
    // Test settling with correct preimage if not expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    let settledInvoice;
    if (heldInvoice.expiresAt < currentTimestamp) {
      // Invoice has expired -> cancel instead of settling
      settledInvoice = cancelHodlInvoice(heldInvoice);
    } else {
      settledInvoice = settleHodlInvoice(heldInvoice, preimage);
    }
    
    // --- Scenario 2: Failed Settlement ---
    // Test settling with incorrect preimage (remains held)
    const wrongPreimage = crypto.randomBytes(32).toString('hex');
    const failedSettlement = settleHodlInvoice(heldInvoice, wrongPreimage);
    
    // --- Scenario 3: Explicit Cancellation ---
    // Test cancellation
    const canceledInvoice = cancelHodlInvoice(heldInvoice);
    
    // --- Scenario 4: Dispute Simulation for an Expired Invoice ---
    // Simulate an expired invoice by overriding expiresAt to a past time
    const expiredHeldInvoice = { ...heldInvoice, expiresAt: currentTimestamp - 100 };
    let disputedInvoice;
    if (expiredHeldInvoice.expiresAt < currentTimestamp) {
      // Since the invoice is expired, cancel it to simulate a dispute resolution
      disputedInvoice = cancelHodlInvoice(expiredHeldInvoice);
    } else {
      disputedInvoice = settleHodlInvoice(expiredHeldInvoice, preimage);
    }
    
    // Return the results as JSON
    res.status(200).json({
      preimageAndHash: { preimage, hash },
      originalInvoice: invoice,
      heldInvoice,
      settledInvoice,
      failedSettlement,
      canceledInvoice,
      disputedInvoice
    });
  } catch (error) {
    console.error('Error in /api/hodl:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
