import { BaseHandler } from "s1-zap-agents";
import { GroupChat, Message } from "whatsapp-web.js";

import { getStartAgentOpts } from "../../utils/helpers";
import { AGENT_ID } from "../../utils/configs";

export abstract class BaseZapHubHandler extends BaseHandler {
  getMsgBody(msg: Message): string {
    const isCommandString = typeof this.command === 'string';
    return isCommandString
      ? msg.body.replace(this.command ?? '', '').trim()
      : '';
  }

  async startGroupAgent(chat: GroupChat) {
    const { apiKey, prompt } = await getStartAgentOpts(chat);

    this.startAgent({
      agentId: AGENT_ID,
      openai: { apiKey },
      prompt: { message: prompt }
    });
    this.useAgent(AGENT_ID);
  }
}
