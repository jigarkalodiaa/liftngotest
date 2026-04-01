export type ChatRole = 'user' | 'assistant';

export type ChatTurn = { role: ChatRole; content: string };

export type ChatAction = {
  type: 'redirect';
  url: string;
};

export type ChatApiRequest = {
  message: string;
  session_id: string;
};

export type ChatApiResponse = {
  reply: string;
  action: ChatAction | null;
};
