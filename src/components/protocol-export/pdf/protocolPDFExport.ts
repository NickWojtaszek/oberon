/**
 * Protocol PDF Export Service
 * Generates and downloads professional PDF documents for protocols
 */

import { pdf } from '@react-pdf/renderer';
import { createElement } from 'react';
import { ProtocolPDFDocument, type ProtocolPDFData } from './ProtocolPDFDocument';
import { spectraExtractor } from '../../ai-personas/statistician/spectra/SPECTRAExtractor';
import type { SavedProtocol, ProtocolVersion } from '../../protocol-workbench/types';
import type { StudyMethodology } from '../../../contexts/ProtocolContext';
import type { FoundationalPaperExtraction } from '../../../services/geminiService';

// =============================================================================
// EXPORT OPTIONS
// =============================================================================

export interface PDFExportOptions {
  /** Include SPECTRA framework extraction (default: true) */
  includeSPECTRA?: boolean;
  /** Include foundational papers section (default: true) */
  includeFoundationalPapers?: boolean;
  /** Include schema details (default: true) */
  includeSchema?: boolean;
  /** Include statistical plan (default: true) */
  includeStatisticalPlan?: boolean;
  /** Custom filename (default: auto-generated from protocol number) */
  filename?: string;
}

const DEFAULT_OPTIONS: PDFExportOptions = {
  includeSPECTRA: true,
  includeFoundationalPapers: true,
  includeSchema: true,
  includeStatisticalPlan: true,
};

// =============================================================================
// MAIN EXPORT FUNCTION
// =============================================================================

/**
 * Generate and download a PDF document for a protocol
 */
export async function downloadProtocolPDF(
  protocol: SavedProtocol,
  version?: ProtocolVersion,
  methodology?: StudyMethodology,
  foundationalPapers?: FoundationalPaperExtraction[],
  options: PDFExportOptions = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Get the version to export (latest if not specified)
  const targetVersion = version || protocol.versions[protocol.versions.length - 1];

  if (!targetVersion) {
    throw new Error('No protocol version available for export');
  }

  // Extract PICO fields from methodology
  const picoFields = extractPICOFields(methodology);

  // Build SPECTRA context if requested
  let spectra = undefined;
  if (opts.includeSPECTRA && methodology) {
    try {
      const result = spectraExtractor.extract(
        protocol,
        targetVersion,
        methodology,
        foundationalPapers
      );
      if (result.success && result.context) {
        spectra = result.context;
      }
    } catch (error) {
      console.warn('Failed to extract SPECTRA context:', error);
    }
  }

  // Prepare PDF data
  const pdfData: ProtocolPDFData = {
    protocol,
    version: targetVersion,
    spectra,
    foundationalPapers: opts.includeFoundationalPapers ? foundationalPapers : undefined,
    picoFields,
    generatedAt: new Date().toISOString(),
  };

  // Generate PDF
  console.log('📄 Generating protocol PDF...');

  try {
    const doc = createElement(ProtocolPDFDocument, { data: pdfData });
    const blob = await pdf(doc).toBlob();

    // Create filename
    const safeName = (protocol.protocolNumber || protocol.protocolTitle || 'protocol')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .substring(0, 50);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = opts.filename || `${safeName}_protocol_${timestamp}.pdf`;

    // Download
    downloadBlob(blob, filename);

    console.log(`✅ Protocol PDF exported: ${filename}`);
  } catch (error) {
    console.error('❌ Failed to generate PDF:', error);
    throw new Error(`Failed to generate PDF: ${String(error)}`);
  }
}

/**
 * Generate PDF blob without downloading (for preview or other uses)
 */
export async function generateProtocolPDFBlob(
  protocol: SavedProtocol,
  version?: ProtocolVersion,
  methodology?: StudyMethodology,
  foundationalPapers?: FoundationalPaperExtraction[],
  options: PDFExportOptions = {}
): Promise<Blob> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const targetVersion = version || protocol.versions[protocol.versions.length - 1];

  if (!targetVersion) {
    throw new Error('No protocol version available for export');
  }

  const picoFields = extractPICOFields(methodology);

  let spectra = undefined;
  if (opts.includeSPECTRA && methodology) {
    try {
      const result = spectraExtractor.extract(
        protocol,
        targetVersion,
        methodology,
        foundationalPapers
      );
      if (result.success && result.context) {
        spectra = result.context;
      }
    } catch (error) {
      console.warn('Failed to extract SPECTRA context:', error);
    }
  }

  const pdfData: ProtocolPDFData = {
    protocol,
    version: targetVersion,
    spectra,
    foundationalPapers: opts.includeFoundationalPapers ? foundationalPapers : undefined,
    picoFields,
    generatedAt: new Date().toISOString(),
  };

  const doc = createElement(ProtocolPDFDocument, { data: pdfData });
  return await pdf(doc).toBlob();
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract PICO fields from methodology (handles multiple formats)
 */
function extractPICOFields(
  methodology?: StudyMethodology
): ProtocolPDFData['picoFields'] {
  if (!methodology) return undefined;

  // Try picoFields first (new format)
  const picoFields = (methodology as any).picoFields;
  if (picoFields) {
    return {
      population: picoFields.population,
      intervention: picoFields.intervention,
      comparison: picoFields.comparison,
      outcome: picoFields.outcome,
      timeframe: picoFields.timeframe,
    };
  }

  // Try hypothesis.picoFramework (legacy format)
  if (methodology.hypothesis?.picoFramework) {
    return methodology.hypothesis.picoFramework;
  }

  return undefined;
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

export { ProtocolPDFDocument } from './ProtocolPDFDocument';
export type { ProtocolPDFData } from './ProtocolPDFDocument';
