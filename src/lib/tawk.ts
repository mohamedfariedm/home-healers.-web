const TAWK_CHAT_OPEN_CLASS = "tawk-chat-open";
const TAWK_EMBED_SRC =
  "https://embed.tawk.to/6a086137c744531c43731fa0/1joobngld";

let tawkScriptPromise: Promise<void> | null = null;

function setupTawkApi() {
  if (typeof window === "undefined") return;

  window.Tawk_API = window.Tawk_API ?? {};
  window.Tawk_LoadStart = new Date();

  window.Tawk_API.customStyle = {
    visibility: {
      desktop: { position: "br", xOffset: 16, yOffset: 16 },
      mobile: { position: "br", xOffset: 12, yOffset: 12 },
    },
  };

  window.Tawk_API.onLoad = function () {
    window.Tawk_API?.hideWidget?.();
    if (window.__tawkOpenOnLoad) {
      window.Tawk_API?.maximize?.();
      window.__tawkOpenOnLoad = false;
      setTawkChatOpen(true);
      window.dispatchEvent(new Event("tawk-chat-opened"));
    }
  };

  window.Tawk_API.onChatMaximized = function () {
    setTawkChatOpen(true);
    window.dispatchEvent(new Event("tawk-chat-opened"));
  };

  window.Tawk_API.onChatMinimized = function () {
    window.Tawk_API?.hideWidget?.();
    setTawkChatOpen(false);
    window.dispatchEvent(new Event("tawk-chat-closed"));
  };
}

function installTitleGuard() {
  if (typeof document === "undefined") return;

  const pageTitle = document.title;
  const titleEl = document.querySelector("title");
  if (!titleEl) return;

  const isTawkTitleNotification = (title: string) =>
    /رسالة\s*جديدة/i.test(title) ||
    /^\(\d+\)\s/.test(title) ||
    /^\d+\s+new\s+message/i.test(title) ||
    /^new\s+message/i.test(title);

  new MutationObserver(() => {
    const current = document.title;
    if (isTawkTitleNotification(current)) {
      if (titleEl.textContent !== pageTitle) titleEl.textContent = pageTitle;
      return;
    }
  }).observe(titleEl, { childList: true, characterData: true, subtree: true });
}

export function loadTawkScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Tawk_API?.maximize) return Promise.resolve();
  if (tawkScriptPromise) return tawkScriptPromise;

  setupTawkApi();
  installTitleGuard();

  tawkScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${TAWK_EMBED_SRC}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = TAWK_EMBED_SRC;
    script.charset = "UTF-8";
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Tawk.to"));
    document.head.appendChild(script);
  });

  return tawkScriptPromise;
}

export function setTawkChatOpen(open: boolean) {
  if (typeof document === "undefined") return;
  document.body.classList.toggle(TAWK_CHAT_OPEN_CLASS, open);
  document.body.style.setProperty(
    "--tawk-chat-bottom",
    open ? "13rem" : "1.5rem",
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

  void loadTawkScript().catch(() => {
    window.__tawkOpenOnLoad = false;
    setTawkChatOpen(false);
  });
}

export function closeTawkLiveChat() {
  if (typeof window === "undefined") return;

  window.Tawk_API?.minimize?.();
  window.Tawk_API?.hideWidget?.();
  setTawkChatOpen(false);
}

export const TAWK_CHAT_OPENED_EVENT = "tawk-chat-opened";
export const TAWK_CHAT_CLOSED_EVENT = "tawk-chat-closed";
