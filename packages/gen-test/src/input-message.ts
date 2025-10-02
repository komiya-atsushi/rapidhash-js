export class InputMessage {
  static readonly #encoder = new TextEncoder();

  readonly baseMessage: string;
  readonly repetitions: number;
  readonly message: string;
  readonly buffer: ArrayBuffer;
  readonly length: number;

  constructor(baseMessage: string, repetitions: number = 1) {
    const message = baseMessage.repeat(repetitions);
    const encoded = InputMessage.#encoder.encode(message);

    this.baseMessage = baseMessage;
    this.repetitions = repetitions;
    this.message = message;
    this.buffer = encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength) as ArrayBuffer;
    this.length = encoded.byteLength;
  }
}

export class InputMessages {
  readonly shortMessages: InputMessage[];
  readonly longMessage: InputMessage;

  constructor(shortMessages: string[], longMessage: string, repetitions: number) {
    this.shortMessages = shortMessages.map((message) => new InputMessage(message));
    this.longMessage = new InputMessage(longMessage, repetitions);
  }
}

const shortMessages = ['', 'a', 'AB', '123', '¶', 'あ', 'Hello, world.', 'こんにちは、世界。'];
const longMessage =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export const inputMessages = new InputMessages(
  shortMessages,
  longMessage,
  Math.ceil((2 ** 13 + 1) / longMessage.length),
);
