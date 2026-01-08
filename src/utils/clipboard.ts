/**
 * CLIPBOARD UTILITY
 * 
 * Provides robust clipboard operations with fallback methods
 * for environments where Clipboard API is blocked.
 */

/**
 * Copy text to clipboard with fallback methods
 * 
 * Attempts multiple methods in order:
 * 1. Modern Clipboard API (navigator.clipboard.writeText)
 * 2. Fallback using execCommand (deprecated but still works)
 * 3. Create temporary textarea element
 * 
 * @param text - Text to copy to clipboard
 * @returns Promise<boolean> - Success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Method 1: Try modern Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Silently fall through to fallback method
      // Clipboard API may be blocked by permissions policy in some environments
    }
  }

  // Method 2: Fallback using execCommand with textarea
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';
    textarea.setAttribute('readonly', '');
    textarea.style.opacity = '0';
    
    document.body.appendChild(textarea);
    
    // Select the text
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      // iOS requires different selection method
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textarea.setSelectionRange(0, 999999);
    } else {
      textarea.select();
    }
    
    // Copy the text
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    if (successful) {
      return true;
    }
  } catch (error) {
    // Only log error if all methods fail
    console.error('All clipboard methods failed:', error);
  }

  return false;
}

/**
 * Show user-friendly feedback after copy attempt
 * 
 * @param success - Whether copy was successful
 * @param successMessage - Message to show on success
 * @param errorMessage - Message to show on failure
 */
export function showCopyFeedback(
  success: boolean,
  successMessage: string = '✅ Copied to clipboard',
  errorMessage: string = '❌ Failed to copy. Please copy manually.'
): void {
  if (success) {
    // Could use toast notification here if available
    console.log(successMessage);
  } else {
    console.error(errorMessage);
    alert(errorMessage);
  }
}

/**
 * Copy text with automatic user feedback
 * 
 * @param text - Text to copy
 * @param successMessage - Optional custom success message
 * @returns Promise<boolean> - Success status
 */
export async function copyWithFeedback(
  text: string,
  successMessage?: string
): Promise<boolean> {
  const success = await copyToClipboard(text);
  
  if (!success) {
    // If copy fails, offer to show the text for manual copying
    const shouldShow = confirm(
      'Automatic copy failed. Would you like to see the text to copy manually?'
    );
    
    if (shouldShow) {
      prompt('Copy this text manually (Ctrl+C / Cmd+C):', text);
    }
  }
  
  return success;
}