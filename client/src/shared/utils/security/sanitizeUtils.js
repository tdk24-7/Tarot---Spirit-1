/**
 * Utility functions for sanitizing HTML content to prevent XSS attacks.
 * This module uses DOMPurify for secure HTML sanitization.
 */

import DOMPurify from 'dompurify';

/**
 * Default DOMPurify configuration
 * Allow basic formatting tags but restrict potentially dangerous elements and attributes
 */
const DEFAULT_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code',
    'pre', 'hr', 'span'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'class', 'target', 'rel'
  ],
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'object', 'embed', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'eval'],
  ADD_ATTR: ['target'], // Allow target="_blank" for links
  FORCE_BODY: true, // Ensure we always get a body node to sanitize
  RETURN_DOM: false, // Return HTML string, not DOM
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * 
 * @param {string} html - HTML content to sanitize
 * @param {Object} [config] - Optional custom DOMPurify configuration
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html, config = {}) => {
  if (!html) return '';
  
  // Merge default config with any custom config
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Configure DOMPurify hook to enforce safe target="_blank" links
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      // Add security attributes for target="_blank" links to prevent tab nabbing
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
  
  // Sanitize the HTML
  return DOMPurify.sanitize(html, mergedConfig);
};

/**
 * Sanitizes user input for non-HTML contexts
 * Removes any potentially dangerous characters
 * 
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input 
 */
export const sanitizeUserInput = (input) => {
  if (!input) return '';
  
  // For plain text, simply remove any HTML tags
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    RETURN_DOM: false
  });
};

/**
 * Sanitizes markdown content before rendering
 * Use this function for any markdown that will be converted to HTML
 * 
 * @param {string} markdown - Markdown content to sanitize
 * @returns {string} Sanitized markdown
 */
export const sanitizeMarkdown = (markdown) => {
  if (!markdown) return '';
  
  // For markdown, we need to be careful about raw HTML
  // First pass sanitization before markdown conversion
  return sanitizeUserInput(markdown);
};

/**
 * Configuration for allowing CSS styles but sanitizing them
 */
export const STYLED_CONTENT_CONFIG = {
  ...DEFAULT_CONFIG,
  ALLOWED_TAGS: [...DEFAULT_CONFIG.ALLOWED_TAGS, 'div', 'span'],
  ALLOWED_ATTR: [...DEFAULT_CONFIG.ALLOWED_ATTR, 'style'],
  ADD_TAGS: ['div', 'span'],
  ADD_ATTR: ['style', 'target'],
  // Only allow safe CSS properties
  ALLOWED_STYLES: {
    '*': ['color', 'font-size', 'font-weight', 'font-style', 'text-decoration',
          'text-align', 'background-color', 'margin', 'padding', 'border',
          'display', 'width', 'height', 'max-width', 'max-height']
  }
};

/**
 * Sanitizes HTML content with limited styling allowed
 * 
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML with safe styles
 */
export const sanitizeStyledHtml = (html) => {
  if (!html) return '';
  return sanitizeHtml(html, STYLED_CONTENT_CONFIG);
};

export default {
  sanitizeHtml,
  sanitizeUserInput,
  sanitizeMarkdown,
  sanitizeStyledHtml,
  STYLED_CONTENT_CONFIG,
  DEFAULT_CONFIG
}; 