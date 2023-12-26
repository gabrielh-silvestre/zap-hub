import { TextHandler } from 's1-zap-agents';
import { GroupChat, Message } from 'whatsapp-web.js';

import { baseHubCondition } from '../../utils/helpers';
import { ApiKeyChatRepository } from '../../repository';

export class ConfigUnregisterHandler extends TextHandler {
  async deleteApiKey(chat: GroupChat) {
    const repo = new ApiKeyChatRepository(chat);
    await repo.delete();
  }

  async shouldExecute(msg: Message): Promise<boolean> {
    const canExecute = await baseHubCondition(msg);

    return this.matchCommand(msg) && canExecute;
  }

  async handle(chat: GroupChat, msg: Message): Promise<boolean | null> {
    try {
      const apiKey = this.getMsgBody(msg);
      if (!apiKey) return null;

      await this.deleteApiKey(chat);

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
