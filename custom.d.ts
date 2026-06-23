declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

interface TawkAPI {
  maximize?: () => void;
  minimize?: () => void;
  toggle?: () => void;
  hideWidget?: () => void;
  showWidget?: () => void;
  onLoad?: () => void;
  onChatMaximized?: () => void;
  onChatMinimized?: () => void;
  customStyle?: Record<string, unknown>;
}

interface Window {
  Tawk_API?: TawkAPI;
  Tawk_LoadStart?: Date;
  __tawkOpenOnLoad?: boolean;
}
