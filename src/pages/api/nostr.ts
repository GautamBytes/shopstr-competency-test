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
    // Generate keys for sender and receiver
    const sender = generateNostrKeys();
    const receiver = generateNostrKeys();

    // Create a test message
    const message = "This is a secure message for the Shopstr competency test!";

    // Build direct message
    const directMsg = buildDirectMessage(sender.publicKey, receiver.publicKey, message);

    // Seal the message (await because it's async)
    const sealedMsg = await sealMessage(directMsg, sender.privateKey, receiver.publicKey);

    // Create a wrapping key
    const wrapper = generateNostrKeys();

    // Gift-wrap the message (await)
    const giftWrappedMsg = await giftWrapMessage(sealedMsg, wrapper.privateKey, receiver.publicKey);

    // Simulate receiver unwrapping and decrypting (await)
    const unwrappedMsg = await unwrapGiftMessage(giftWrappedMsg, receiver.privateKey);
    let decryptedContent = null;
    if (unwrappedMsg) {
      decryptedContent = await unsealMessage(unwrappedMsg, receiver.privateKey);
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
      decryptedContent
    });
  } catch (err) {
    console.error("Error in /api/nostr route:", err);
    res.status(500).json({ error: String(err) });
  }
}



