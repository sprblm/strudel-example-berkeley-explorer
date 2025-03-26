import { JSDOM } from 'jsdom';
import React from 'react';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
document = dom.window.document;
window = dom.window as unknown as Window & typeof globalThis;

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return children;
};
