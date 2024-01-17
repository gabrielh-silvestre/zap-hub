import { GroupChat, Message } from 'whatsapp-web.js';

import { BaseZapHubHandler } from './base';

import { baseHubCondition, getChatHistory } from '../../utils/helpers';

export class ChatTextHandler extends BaseZapHubHandler {
  async shouldExecute(msg: Message): Promise<boolean> {
    const canExecute = await baseHubCondition(msg);

    return this.matchCommand(msg) && canExecute;
  }

  async handle(chat: GroupChat, msg: Message): Promise<boolean | null> {
    await this.startGroupAgent(chat);
    if (!this.agent) return null;

    try {
      const history = await getChatHistory(chat);

      const answer = await this.agent?.chat(this.getMsgBody(msg), history);
      if (!answer) return false;

      await chat.sendMessage(this.formatAnswer(answer));

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
