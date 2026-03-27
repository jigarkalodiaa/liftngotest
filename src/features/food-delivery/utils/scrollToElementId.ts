/** Smooth-scroll to an element by id (client-only). */
export function scrollToElementId(elementId: string, block: ScrollLogicalPosition = 'start'): void {
  document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block });
}
