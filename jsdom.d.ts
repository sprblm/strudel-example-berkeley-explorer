import { DOMWindow } from 'jsdom';

declare global {
  interface Window extends DOMWindow {}
  interface Document {}
}
