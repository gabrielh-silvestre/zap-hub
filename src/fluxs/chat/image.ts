import OpenAI from "openai";
import { ImageHandler, ZapAgent } from "s1-zap-agents";
import { GroupChat, Message } from "whatsapp-web.js";
import { baseHubCondition } from "../../utils/helpers";
import { ApiKeyChatRepository, PromptChatRepository } from "../../repository";

export class ChatImageHandler extends ImageHandler {
  async getApiKey(chat: GroupChat) {
    const repo = new ApiKeyChatRepository(chat);
    return await repo.get();
  }

  async getPrompt(chat: GroupChat) {
    const repo = new PromptChatRepository(chat);
    return await repo.get();
  }

  private async startAgent(chat: GroupChat) {
    const apiKey = (await this.getApiKey(chat))?.openai_key;
    if (!apiKey) throw new Error('API Key not found');

    const message = (await this.getPrompt(chat))?.prompt;
    if (!message) throw new Error('Prompt not found');

    this.agent = new ZapAgent({
      agentId: import.meta.env.AGENT_ID as string,
      openai: new OpenAI({ apiKey }),
      prompt: { message },
    });
  }

  async shouldExecute(msg: Message): Promise<boolean> {
    const canExecute = await baseHubCondition(msg);
    const isImage = this.isImage(msg);

    return this.matchCommand(msg) && canExecute && isImage;
  }

  async handle(chat: GroupChat, msg: Message): Promise<boolean> {
      await this.startAgent(chat);
      return super.handle(chat, msg);
  }
}
