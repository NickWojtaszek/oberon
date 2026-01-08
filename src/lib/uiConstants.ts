/**
 * UI Constants for Clinical Intelligence Engine
 * Centralized constants for consistent UI measurements across the application
 */

/**
 * Standard sidebar width used throughout the application
 * Used in: AI Personas, PersonaEditor, DataImportExport, Protocol Document, etc.
 */
export const SIDEBAR_WIDTH = 'w-[400px]';

/**
 * Standard sidebar width in pixels (for calculations)
 */
export const SIDEBAR_WIDTH_PX = 400;

/**
 * Other common UI constants can be added here as needed
 */
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_PX,
} as const;
