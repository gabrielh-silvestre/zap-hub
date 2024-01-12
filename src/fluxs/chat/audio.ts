import { isAudioMsg } from 's1-zap-agents';
import { GroupChat, Message } from 'whatsapp-web.js';

import { BaseZapHubHandler } from './base';

import { baseHubCondition } from '../../utils/helpers';

export class ChatAudioHandler extends BaseZapHubHandler {
   async shouldExecute(msg: Message): Promise<boolean> {
    const canExecute = await baseHubCondition(msg);

    return isAudioMsg(msg) && canExecute;
  }

  async handle(chat: GroupChat, msg: Message): Promise<boolean | null> {
    await this.startGroupAgent(chat);
    if (!this.agent) return null;

    try {
      const media = await msg.downloadMedia();
      const buffer = Buffer.from(media.data, 'base64');

      const transcription = await this.agent?.transcriptAudio(buffer);
      if (!transcription) return false;

      for await (const res of this.agent.genChat(transcription)) {
        if (!res) continue;
        await msg.reply(this.formatAnswer(res));
      }

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
