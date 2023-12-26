import { TextHandler } from 's1-zap-agents';
import { GroupChat, Message } from 'whatsapp-web.js';

import { baseHubCondition } from '../../utils/helpers';
import { ApiKeyChatRepository } from '../../repository';

export class ConfigRegisterHandler extends TextHandler {
  async saveApiKey(chat: GroupChat, apiKey: string) {
    const repo = new ApiKeyChatRepository(chat);
    await repo.save({ openai_key: apiKey })
  }

  async shouldExecute(msg: Message): Promise<boolean> {
    const canExecute = await baseHubCondition(msg);

    return this.matchCommand(msg) && canExecute;
  }

  async handle(chat: GroupChat, msg: Message): Promise<boolean | null> {
    try {
      const apiKey = this.getMsgBody(msg);
      if (!apiKey) return null;

      await msg.delete(true);
      await this.saveApiKey(chat, apiKey);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
