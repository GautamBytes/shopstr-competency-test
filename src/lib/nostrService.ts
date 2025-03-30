import { getPublicKey, nip04, Event } from 'nostr-tools';
import { randomBytes, createHash } from 'crypto';
import * as secp from 'noble-secp256k1';

/**
 * Fallback implementation of generatePrivateKey using Node's crypto module.
 * Returns a 32-byte hex string.
 */
export function generatePrivateKey(): string {
  return randomBytes(32).toString('hex');
}

export interface NostrKeys {
  privateKey: string;
  publicKey: string;
}

/**
 * Generate a new Nostr keypair.
 * The newer version of nostr-tools expects Uint8Array for the private key.
 */
export function generateNostrKeys(): NostrKeys {
  const privateKeyHex = generatePrivateKey();
  // Convert hex string to Uint8Array
  const privateKeyBytes = Buffer.from(privateKeyHex, 'hex');
  const publicKey = getPublicKey(privateKeyBytes);
  return { privateKey: privateKeyHex, publicKey };
}

/**
 * Build a plain direct message (kind 14).
 */
export function buildDirectMessage(
  senderPubkey: string,
  receiverPubkey: string,
  message: string
): Event {
  return {
    kind: 14,
    pubkey: senderPubkey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["p", receiverPubkey, "wss://relay.example.com"]],
    content: message,
    id: '', // To be set after signing
    sig: '',
  };
}

/**
 * Our own implementation of finishEvent to compute the event's id and signature.
 */
async function finishEvent(event: Event, privateKey: string): Promise<Event> {
  // The Nostr protocol specifies that the event id is the SHA-256 hash of a serialized array:
  // [0, pubkey, created_at, kind, tags, content]
  const eventData = [0, event.pubkey, event.created_at, event.kind, event.tags, event.content];
  const serialized = JSON.stringify(eventData);
  const hash = createHash('sha256').update(serialized).digest('hex');
  
  // Convert hex string to Uint8Array for noble-secp256k1
  const privateKeyBytes = Buffer.from(privateKey, 'hex');
  // Use noble-secp256k1 to sign the hash with the private key.
  const sig = await secp.sign(hash, privateKeyBytes, { recovered: false });
  
  return {
    ...event,
    id: hash,
    sig,
  };
}

/**
 * Seal the message (convert to kind 13).
 * Uses nip04.encrypt (which is async) and then finishes (signs) the event.
 */
export async function sealMessage(
  plainEvent: Event,
  senderPrivkey: string,
  receiverPubkey: string
): Promise<Event> {
  // Convert hex string to Uint8Array for nip04
  const senderPrivkeyBytes = Buffer.from(senderPrivkey, 'hex');
  
  const encryptedContent = await nip04.encrypt(
    senderPrivkeyBytes,
    receiverPubkey,
    plainEvent.content
  );

  const sealedEvent: Event = {
    ...plainEvent,
    kind: 13,
    content: encryptedContent,
  };

  const finishedEvent = await finishEvent(sealedEvent, senderPrivkey);
  return finishedEvent;
}

/**
 * Gift-wrap the sealed message (kind 1059).
 */
export async function giftWrapMessage(
  sealedEvent: Event,
  wrappingPrivkey: string,
  receiverPubkey: string
): Promise<Event> {
  // Convert hex string to Uint8Array for nip04
  const wrappingPrivkeyBytes = Buffer.from(wrappingPrivkey, 'hex');
  
  const giftContent = await nip04.encrypt(
    wrappingPrivkeyBytes,
    receiverPubkey,
    JSON.stringify(sealedEvent)
  );

  const wrappingPubkey = getPublicKey(Buffer.from(wrappingPrivkey, 'hex'));
  
  const giftWrappedEvent: Event = {
    kind: 1059,
    pubkey: wrappingPubkey,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["p", receiverPubkey]],
    content: giftContent,
    id: '',
    sig: '',
  };

  const finishedGiftEvent = await finishEvent(giftWrappedEvent, wrappingPrivkey);
  return finishedGiftEvent;
}

/**
 * Unwrap and decrypt a gift-wrapped message.
 */
export async function unwrapGiftMessage(
  giftWrappedEvent: Event,
  receiverPrivkey: string
): Promise<Event | null> {
  try {
    // Convert hex string to Uint8Array for nip04
    const receiverPrivkeyBytes = Buffer.from(receiverPrivkey, 'hex');
    
    const senderPubkey = giftWrappedEvent.pubkey;
    const decryptedContent = await nip04.decrypt(
      receiverPrivkeyBytes,
      senderPubkey,
      giftWrappedEvent.content
    );
    const sealedEvent = JSON.parse(decryptedContent) as Event;
    return sealedEvent;
  } catch (error) {
    console.error("Failed to unwrap gift message:", error);
    return null;
  }
}

/**
 * Unseal (decrypt) a sealed message.
 */
export async function unsealMessage(
  sealedEvent: Event,
  receiverPrivkey: string
): Promise<string | null> {
  try {
    // Convert hex string to Uint8Array for nip04
    const receiverPrivkeyBytes = Buffer.from(receiverPrivkey, 'hex');
    
    const senderPubkey = sealedEvent.pubkey;
    const decryptedContent = await nip04.decrypt(
      receiverPrivkeyBytes,
      senderPubkey,
      sealedEvent.content
    );
    return decryptedContent;
  } catch (error) {
    console.error("Failed to unseal message:", error);
    return null;
  }
}
