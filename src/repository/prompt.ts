import { PromptData } from "../types";
import { BaseChatRepository } from "./base";

export class PromptChatRepository extends BaseChatRepository<PromptData>  {
  protected descKey: string = 'prompt';
}
