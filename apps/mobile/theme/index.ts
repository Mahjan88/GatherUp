/**
 * GatherUp design tokens.
 *
 * Light, photo-forward UI with a single teal accent. Every screen should pull
 * colors, spacing, radii, type and shadows from here instead of hard-coding.
 */

export const colors = {
  // Brand
  primary: '#17C3B2',
  primaryDark: '#0FA697',
  primarySoft: '#E7F8F6',
  primaryOn: '#FFFFFF',

  // Surfaces
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F4F5F7',
  surfaceMuted: '#F9FAFB',
  overlay: 'rgba(17, 24, 39, 0.45)',
  scrim: 'rgba(0, 0, 0, 0.35)',

  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnImage: '#FFFFFF',
  link: '#17C3B2',

  // Lines
  border: '#E5E7EB',
  divider: '#F0F1F3',

  // Status
  success: '#22C55E',
  successSoft: '#E8F8EE',
  warning: '#F59E0B',
  warningSoft: '#FEF3E2',
  danger: '#EF4444',
  dangerSoft: '#FDECEC',
  info: '#3B82F6',
  infoSoft: '#EAF2FE',
  accentOrange: '#F97362',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/** Horizontal page gutter used by every screen. */
export const GUTTER = spacing.xl;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, fontWeight: '800' as const, color: colors.text },
  title: { fontSize: 26, fontWeight: '700' as const, color: colors.text },
  h1: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodySecondary: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  label: { fontSize: 14, fontWeight: '600' as const, color: colors.text },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textSecondary,
  },
  overline: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.primary,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  raised: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  fab: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export const theme = { colors, spacing, radius, typography, shadows, GUTTER };
export default theme;
