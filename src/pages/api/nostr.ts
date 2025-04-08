import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  generateNostrKeys, 
  buildDirectMessage, 
  sealMessage, 
  giftWrapMessage,
  unwrapGiftMessage,
  unsealMessage
} from '../../lib/nostrService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Generate keys for sender, receiver, and wrapper
    const sender = generateNostrKeys();
    const receiver = generateNostrKeys();
    const wrapper = generateNostrKeys();

    // Create a test direct message
    const message = "This is a secure message for the Shopstr competency test!";
    const directMsg = buildDirectMessage(sender.publicKey, receiver.publicKey, message);

    // Seal the message using sender's private key
    const sealedMsg = await sealMessage(directMsg, sender.privateKey, receiver.publicKey);

    // Gift-wrap the sealed message using the wrapper's key
    const giftWrappedMsg = await giftWrapMessage(sealedMsg, wrapper.privateKey, receiver.publicKey);

    // Normal flow: receiver unwraps and unseals the gift-wrapped message
    const unwrappedMsg = await unwrapGiftMessage(giftWrappedMsg, receiver.privateKey);
    let decryptedContent = null;
    if (unwrappedMsg) {
      decryptedContent = await unsealMessage(unwrappedMsg, receiver.privateKey);
    }

    // --- Simulation: Tampered Gift-Wrapped Message ---
    // Create a tampered copy by modifying the encrypted content slightly.
    const tamperedGiftWrappedMsg = { 
      ...giftWrappedMsg, 
      content: giftWrappedMsg.content.slice(0, -1) + "X" 
    };
    const tamperedUnwrappedMsg = await unwrapGiftMessage(tamperedGiftWrappedMsg, receiver.privateKey);
    let tamperedDecryptedContent = null;
    if (tamperedUnwrappedMsg) {
      tamperedDecryptedContent = await unsealMessage(tamperedUnwrappedMsg, receiver.privateKey);
    }

    // Return all the data for demonstration
    res.status(200).json({
      keys: {
        sender: { publicKey: sender.publicKey },
        receiver: { publicKey: receiver.publicKey },
        wrapper: { publicKey: wrapper.publicKey }
      },
      originalMessage: message,
      directMsg,
      sealedMsg,
      giftWrappedMsg,
      unwrappedMsg,
      decryptedContent,
      tampered: {
        giftWrappedMsg: tamperedGiftWrappedMsg,
        unwrappedMsg: tamperedUnwrappedMsg,
        decryptedContent: tamperedDecryptedContent
      }
    });
  } catch (err) {
    console.error("Error in /api/nostr route:", err);
    res.status(500).json({ error: String(err) });
  }
}
