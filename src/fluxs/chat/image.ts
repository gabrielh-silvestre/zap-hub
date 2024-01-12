import { isImageMsg } from "s1-zap-agents";
import { GroupChat, Message } from "whatsapp-web.js";

import { BaseZapHubHandler } from "./base";

import { baseHubCondition } from "../../utils/helpers";

export class ChatImageHandler extends BaseZapHubHandler {
  async shouldExecute(msg: Message): Promise<boolean> {
    const canExecute = await baseHubCondition(msg);

    return this.matchCommand(msg) && canExecute && isImageMsg(msg);
  }

  async handle(chat: GroupChat, msg: Message): Promise<boolean | null> {
    await this.startGroupAgent(chat);
    if (!this.agent) return null;

    try {
      const media = await msg.downloadMedia();
      const buffer = Buffer.from(media.data, 'base64');

      const streamResponses = this.agent.genChatImage(msg.body, {
        image: buffer,
        mimetype: media.mimetype,
      });
      for await (const res of streamResponses) {
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
