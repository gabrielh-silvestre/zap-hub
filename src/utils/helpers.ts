import { Message } from 'whatsapp-web.js';
/**
 * Base condition for all handlers
 * @param msg Message
 *
 * @returns boolean
 *
 * @description
 * This function is used to check if the message is from a group with [GPT] prefix
 */
export const baseHubCondition = async (msg: Message) => {
  const chat = await msg.getChat();
  if (!chat.isGroup) return false; // Only groups

  const isHub = chat.name.startsWith('[GPT]');
  return isHub;
};
