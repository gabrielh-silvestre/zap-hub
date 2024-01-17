import { GroupChat, Message, MessageMedia } from "whatsapp-web.js";

import { BaseZapHubHandler } from "./base";

import { baseHubCondition } from "../../utils/helpers";

export class ChatGenerateImgHandler extends BaseZapHubHandler {
  async shouldExecute(msg: Message): Promise<boolean> {
    const canExecute = await baseHubCondition(msg);

    return this.matchCommand(msg) && canExecute;
  }
  
  async handle(chat: GroupChat, msg: Message): Promise<boolean | null> {
      await this.startGroupAgent(chat);
      if (!this.agent) return null;

      try {
        const response = await this.agent.openai.images.generate({
          prompt: this.getMsgBody(msg),
          model: 'dall-e-3',
          quality: 'standard',
          style: 'vivid',
          user: msg.author
        });

        for await (const url of response.data.map(async (img) => img.url)) {
          if (!url) continue;

          const media = await MessageMedia.fromUrl(url);
          await msg.reply(url, undefined, { media });
        }

        return true;
      } catch (error: any) {
        console.error(error);
        return null;
      }
  }
}
