import { GroupChat, Message } from 'whatsapp-web.js';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

import { ApiKeyChatRepository, PromptChatRepository } from '../repository';
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

export const getStartAgentOpts = async (chat: GroupChat) => {
  const apiKey = (await new ApiKeyChatRepository(chat).get())?.openai_key;
  if (!apiKey) throw new Error('API Key not found');

  const prompt = (await new PromptChatRepository(chat).get())?.prompt;
  if (!prompt) throw new Error('Prompt not found');

  return { apiKey, prompt };
}

export const getChatHistory = async (chat: GroupChat): Promise<ChatCompletionMessageParam[]> => {
  const messages = await chat.fetchMessages({ limit: 100 });

  const isMsgFromBot = (msg: Message) => /[GPT]/g.test(msg.body);

  return messages.map((msg) => ({
    role: isMsgFromBot(msg) ? 'assistant' : 'user',
    content: msg.body.replace(/[GPT]/g, '').trim(),
  }));
};
