import { TextHandler } from 's1-zap-agents';
import { Chat, Message } from 'whatsapp-web.js';
import { baseHubCondition } from '../../utils/helpers';

export class ConfigSummaryHandler extends TextHandler {
  static CONFIG_INSTRUCTION = `
*Configuração de grupo*
_Comandos_

*!register <OpenAI API Key>*
Registra a API Key da OpenAI para o grupo.
Exemplo: \`!register sk-1234567890abcdef\`

*!unregister*
Remove a API Key da OpenAI para o grupo.

*!help*
Exibe a lista de comandos disponíveis.

*!gpt <texto>*
Envia o texto para o GPT e retorna a resposta.

*!img <texto>*
Envia o texto para o Dall-E e retorna a imagem.
O prompt definido pelo comando *!prompt* NÃO será usado como base para a geração da imagem.

*!prompt*
Define um texto para ser usado como base em seus comandos.
Exemplo: \`!prompt Você é um assistente pessoal sarcástico\`
`;

  async shouldExecute(msg: Message): Promise<boolean> {
    const chat = await msg.getChat();
    const messages = await chat.fetchMessages({});

    // Automatic show summary on first message
    const isFirstMessage = messages.length === 1;
    const canExecute = await baseHubCondition(msg);

    return (canExecute && isFirstMessage) || (this.matchCommand(msg) && canExecute);
  }

  async handle(chat: Chat): Promise<boolean | null> {
    try {
      await chat.sendMessage(
        this.formatAnswer(ConfigSummaryHandler.CONFIG_INSTRUCTION)
      );

      return true;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}
