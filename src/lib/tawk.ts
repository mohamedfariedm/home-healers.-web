const TAWK_CHAT_OPEN_CLASS = "tawk-chat-open";

export function setTawkChatOpen(open: boolean) {
  if (typeof document === "undefined") return;
  document.body.classList.toggle(TAWK_CHAT_OPEN_CLASS, open);
  document.body.style.setProperty(
    "--tawk-chat-bottom",
    open ? "13rem" : "1.5rem"
  );
}

export function openTawkLiveChat() {
  if (typeof window === "undefined") return;

  setTawkChatOpen(true);

  if (window.Tawk_API?.maximize) {
    window.Tawk_API.maximize();
    return;
  }

  window.__tawkOpenOnLoad = true;
}

export function closeTawkLiveChat() {
  if (typeof window === "undefined") return;

  window.Tawk_API?.minimize?.();
  window.Tawk_API?.hideWidget?.();
  setTawkChatOpen(false);
}

export const TAWK_CHAT_OPENED_EVENT = "tawk-chat-opened";
export const TAWK_CHAT_CLOSED_EVENT = "tawk-chat-closed";
