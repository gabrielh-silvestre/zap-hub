import { GroupChat } from "whatsapp-web.js";

import { BaseRepository } from "../types";

export abstract class BaseChatRepository<T extends object> implements BaseRepository<T> {
  protected abstract descKey: string;

  private guardDescKey(data: T) {
    const [key] = Object.keys(data);

    if (key !== this.descKey) {
      throw new Error(`Invalid key. "descKey" must be "${key}"`);
    }
  }

  constructor(protected readonly chat: GroupChat) {}

  protected get descRegex() {
    return new RegExp(`${this.descKey}:[a-zA-Z0-9+/=]+`);
  }

  protected get chatDescription() {
    return this.chat.description ?? '';
  }

  private threatData(data: T) {
    const [key, value] = Object.entries(data)[0];
    const newValue = Buffer.from(value as string).toString('base64')

    return { key, value: newValue };
  }

  private create(data: T) {
    const desc = this.chatDescription;

    const { key, value } = this.threatData(data);
    const newDesc = desc.concat(`\n${key}:${value}\n`);

    return this.chat.setDescription(newDesc);
  }

  private update(data: T) {
    const desc = this.chatDescription;

    const { key, value } = this.threatData(data);
    const newDesc = desc.replace(this.descRegex, `${key}:${value}`);

    return this.chat.setDescription(newDesc);
  }

  async save(data: T): Promise<void> {
    this.guardDescKey(data);
    const hasValue = this.chatDescription.match(this.descRegex);

    if (hasValue) await this.update(data);
    else await this.create(data);
  }

  async get(): Promise<T | null> {
    const desc = this.chatDescription;

    const match = desc.match(this.descRegex);
    if (!match) return null;

    const [key, value] = match[0].split(':');
    const descodedValue = Buffer.from(value, 'base64').toString('utf-8');

    return { [key]: descodedValue } as T;
  }

  async delete(): Promise<void> {
    const desc = this.chatDescription;
    const newDesc = desc.replace(this.descRegex, '');

    this.chat.setDescription(newDesc);
  }
}