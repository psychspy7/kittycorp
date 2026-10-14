// A single pending intent survives the assistant's lazy loading. No chat is stored.
export const ASSISTANT_OPEN_EVENT = "kitty:open-assistant";
let pendingQuestion: string | null = null;
export function openWebsiteAssistant(question = "") {
  pendingQuestion = question.slice(0, 800);
  window.dispatchEvent(new Event(ASSISTANT_OPEN_EVENT));
}
export function takeAssistantIntent() {
  const question = pendingQuestion;
  pendingQuestion = null;
  return question;
}
