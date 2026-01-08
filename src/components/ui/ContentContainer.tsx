/**
 * ContentContainer - Standardized max-width container for all workspace content
 * Enforces the 1600px width standard with automatic centering
 */

import { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Standard content container for all main workspace screens
 * - Enforces max-w-[1600px] width standard
 * - Automatically centers with mx-auto
 * - Accepts additional className for spacing/layout
 */
export function ContentContainer({ children, className = '' }: ContentContainerProps) {
  return (
    <div className={`max-w-[1600px] mx-auto ${className}`}>
      {children}
    </div>
  );
}
