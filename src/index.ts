import { startAgent } from 's1-zap-agents';
import { Client, LocalAuth, Events } from 'whatsapp-web.js';
import {
  ChatAudioHandler,
  ChatTextHandler,
  ConfigPromptHandler,
  ConfigRegisterHandler,
  ConfigSummaryHandler,
  ConfigUnregisterHandler,
} from './fluxs';
import { ChatImageHandler } from './fluxs/chat/image';

const AGENT_ID = process.env.AGENT_ID as string;
if (!AGENT_ID) throw new Error('$AGENT_ID is required');

export const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.CHROME_BIN,
    headless: true,
  },

  authStrategy: new LocalAuth(),
});

startAgent(client, {
  route: [
    {
      event: Events.MESSAGE_CREATE,
      handlers: [
        { handler: ConfigSummaryHandler, opts: { command: '!help' } },
        { handler: ConfigRegisterHandler, opts: { command: '!register' } },
        { handler: ConfigUnregisterHandler, opts: { command: '!unregister' } },
        { handler: ConfigPromptHandler, opts: { command: '!prompt' } },
        { handler: ChatImageHandler, opts: { command: '!gpt' } },
        { handler: ChatTextHandler, opts: { command: '!gpt' } },
        { handler: ChatAudioHandler },
      ],
    },
    // {
    //   event: Events.MESSAGE_ACK,
    //   handlers: [
    //     { handler: AgentTextHandler, opts: { command: '!gpt' } },
    //     { handler: AgentAudioHandler },
    //   ],
    // },
    // {
    //   event: Events.MESSAGE_RECEIVED,
    //   handlers: [
    //     { handler: ConfigSummaryHandler, opts: { command: '!help' } },
    //     { handler: ConfigPromptHandler, opts: { command: '!prompt' } },
    //     { handler: ChatTextHandler, opts: { command: '!gpt' } },
    //     { handler: ChatAudioHandler },
    //   ],
    // },
  ],
});
