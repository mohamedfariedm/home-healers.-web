declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

interface TawkAPI {
  maximize: () => void;
  minimize: () => void;
  toggle: () => void;
  hideWidget: () => void;
  showWidget: () => void;
  onLoad?: () => void;
}

interface Window {
  Tawk_API?: TawkAPI;
  __tawkOpenOnLoad?: boolean;
}
