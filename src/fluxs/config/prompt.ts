import { TextHandler } from 's1-zap-agents';
import { GroupChat, Message } from 'whatsapp-web.js';

import { baseHubCondition } from '../../utils/helpers';
import { PromptChatRepository } from '../../repository';

export class ConfigPromptHandler extends TextHandler {
  async savePrompt(chat: GroupChat, prompt: string) {
    const repo = new PromptChatRepository(chat);
    await repo.save({ prompt })
  }

  async shouldExecute(msg: Message) {
    const canExecute = await baseHubCondition(msg);

    return this.matchCommand(msg) && canExecute;
  }

  async handle(chat: GroupChat, msg: Message) {
    try {
      const prompt = this.getMsgBody(msg);
      if (!prompt) return null;

      await this.savePrompt(chat, prompt);

      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
