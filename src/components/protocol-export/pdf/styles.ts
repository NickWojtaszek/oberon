/**
 * PDF Document Styles
 * Professional styling for protocol export PDF
 */

import { StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (using system fonts for compatibility)
// Font.register({
//   family: 'Inter',
//   fonts: [
//     { src: '/fonts/Inter-Regular.ttf', fontWeight: 'normal' },
//     { src: '/fonts/Inter-Bold.ttf', fontWeight: 'bold' },
//   ],
// });

// Color palette
export const colors = {
  primary: '#1e40af', // Blue-800
  primaryLight: '#3b82f6', // Blue-500
  primaryBg: '#eff6ff', // Blue-50
  secondary: '#059669', // Emerald-600
  secondaryBg: '#ecfdf5', // Emerald-50
  accent: '#7c3aed', // Violet-600
  accentBg: '#f5f3ff', // Violet-50
  warning: '#d97706', // Amber-600
  warningBg: '#fffbeb', // Amber-50
  danger: '#dc2626', // Red-600
  text: '#1e293b', // Slate-800
  textMuted: '#64748b', // Slate-500
  textLight: '#94a3b8', // Slate-400
  border: '#e2e8f0', // Slate-200
  borderDark: '#cbd5e1', // Slate-300
  background: '#ffffff',
  backgroundAlt: '#f8fafc', // Slate-50
};

// Base styles
export const styles = StyleSheet.create({
  // Page layout
  page: {
    flexDirection: 'column',
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.text,
  },

  // Cover page
  coverPage: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 50,
  },
  coverLogo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  coverSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 40,
  },
  coverProtocolNumber: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    backgroundColor: colors.primaryBg,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginBottom: 30,
  },
  coverMetaContainer: {
    marginTop: 40,
    width: '100%',
    maxWidth: 400,
  },
  coverMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  coverMetaLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  coverMetaValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    color: colors.textLight,
  },

  // Headers and titles
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  pageHeaderTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  pageHeaderProtocol: {
    fontSize: 9,
    color: colors.textMuted,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    marginTop: 20,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  subsectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    marginTop: 14,
    marginBottom: 8,
  },

  // Content
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 8,
    color: colors.text,
  },

  label: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  value: {
    fontSize: 10,
    color: colors.text,
    marginBottom: 10,
  },

  // Cards and boxes
  card: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },

  cardPrimary: {
    backgroundColor: colors.primaryBg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },

  cardSecondary: {
    backgroundColor: colors.secondaryBg,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },

  cardAccent: {
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },

  infoBox: {
    backgroundColor: colors.primaryBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 10,
    marginBottom: 12,
  },

  warningBox: {
    backgroundColor: colors.warningBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    padding: 10,
    marginBottom: 12,
  },

  // Tables
  table: {
    marginBottom: 12,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  tableHeaderCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.background,
    flex: 1,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundAlt,
  },

  tableCell: {
    fontSize: 9,
    color: colors.text,
    flex: 1,
  },

  tableCellBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    flex: 1,
  },

  // Lists
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  listBullet: {
    width: 15,
    fontSize: 10,
    color: colors.primary,
  },

  listContent: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
  },

  // Grid layouts
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  col2: {
    flex: 1,
    paddingRight: 10,
  },

  col3: {
    flex: 1,
    paddingRight: 8,
  },

  // Badges and tags
  badge: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  badgePrimary: {
    backgroundColor: colors.primaryBg,
    color: colors.primary,
  },

  badgeSecondary: {
    backgroundColor: colors.secondaryBg,
    color: colors.secondary,
  },

  badgeWarning: {
    backgroundColor: colors.warningBg,
    color: colors.warning,
  },

  // Dividers
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: 15,
  },

  dividerThick: {
    borderBottomWidth: 2,
    borderBottomColor: colors.borderDark,
    marginVertical: 20,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  footerText: {
    fontSize: 8,
    color: colors.textLight,
  },

  pageNumber: {
    fontSize: 8,
    color: colors.textMuted,
  },

  // Utility
  bold: {
    fontFamily: 'Helvetica-Bold',
  },

  italic: {
    fontFamily: 'Helvetica-Oblique',
  },

  textCenter: {
    textAlign: 'center',
  },

  textRight: {
    textAlign: 'right',
  },

  mt10: {
    marginTop: 10,
  },

  mb10: {
    marginBottom: 10,
  },

  mb20: {
    marginBottom: 20,
  },
});
