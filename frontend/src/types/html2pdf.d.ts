declare module 'html2pdf.js' {
  const html2pdf: {
    (element: HTMLElement, options?: Record<string, unknown>): Promise<unknown>;
    set: (options: Record<string, unknown>) => typeof html2pdf;
    from: (element: HTMLElement) => typeof html2pdf;
    save: () => Promise<void>;
  };
  export default html2pdf;
}