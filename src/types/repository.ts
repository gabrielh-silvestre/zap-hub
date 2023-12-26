export type BaseRepository<T = any> = {
  save(value: T): Promise<void>;
  get(): Promise<T | null>;
  delete(): Promise<void>;
}

export type ApiKeyData = { openai_key: string };
export type ApiKeyRepository = BaseRepository<ApiKeyData>;

export type PromptData = { prompt: string };
export type PromptRepository = BaseRepository<PromptData>;
