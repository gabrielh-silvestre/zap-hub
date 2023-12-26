import OpenAI from 'openai';
import { TextHandler, ZapAgent } from 's1-zap-agents';
import { GroupChat, Message } from 'whatsapp-web.js';

import { baseHubCondition } from '../../utils/helpers';
import { ApiKeyChatRepository, PromptChatRepository } from '../../repository';

export class ChatTextHandler extends TextHandler {
  async getApiKey(chat: GroupChat) {
    const repo = new ApiKeyChatRepository(chat);
    return await repo.get();
  }

  async getPrompt(chat: GroupChat) {
    const repo = new PromptChatRepository(chat);
    return await repo.get();
  }

  async shouldExecute(msg: Message): Promise<boolean> {
    const canExecute = await baseHubCondition(msg);

    return this.matchCommand(msg) && canExecute;
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

  async handle(chat: GroupChat, msg: Message): Promise<boolean | null> {
    try {
      await this.startAgent(chat);

      const answer = await this.agent?.chat(this.getMsgBody(msg));
      if (!answer) return false;

      await chat.sendMessage(this.formatAnswer(answer));

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
