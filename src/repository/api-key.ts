import { ApiKeyData } from "../types";
import { BaseChatRepository } from "./base";

export class ApiKeyChatRepository extends BaseChatRepository<ApiKeyData> {
  protected descKey: string = 'openai_key';
}
