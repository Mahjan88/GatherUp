/**
 * GatherUp UI kit — shared building blocks for the light/teal design.
 * Import from '../components/ui' (path relative to the screen).
 */
import { ReactNode, ComponentProps } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  colors,
  radius,
  spacing,
  typography,
  shadows,
  GUTTER,
} from '../../theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];
export { Ionicons };

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'outline' | 'soft' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  iconRight,
  fullWidth,
  disabled,
  loading,
  style,
}: ButtonProps) {
  const v = buttonVariants[variant];
  const s = buttonSizes[size];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.btn,
        { height: s.height, paddingHorizontal: s.px },
        v.container,
        fullWidth && { alignSelf: 'stretch' },
        (disabled || loading) && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text.color} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={s.icon} color={v.text.color} />}
          <Text style={[styles.btnText, { fontSize: s.font }, v.text]}>
            {label}
          </Text>
          {iconRight && (
            <Ionicons name={iconRight} size={s.icon} color={v.text.color} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const buttonVariants: Record<
  ButtonVariant,
  { container: ViewStyle; text: TextStyle & { color: string } }
> = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.primaryOn },
  },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    text: { color: colors.primary },
  },
  soft: {
    container: { backgroundColor: colors.primarySoft },
    text: { color: colors.primaryDark },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
  },
  danger: {
    container: { backgroundColor: colors.dangerSoft },
    text: { color: colors.danger },
  },
};

const buttonSizes: Record<
  ButtonSize,
  { height: number; px: number; font: number; icon: number }
> = {
  sm: { height: 32, px: 14, font: 13, icon: 15 },
  md: { height: 42, px: 18, font: 15, icon: 18 },
  lg: { height: 52, px: 22, font: 16, icon: 20 },
};

/* ------------------------------------------------------------------ */
/* IconButton                                                          */
/* ------------------------------------------------------------------ */

interface IconButtonProps {
  name: IconName;
  onPress?: () => void;
  size?: number;
  color?: string;
  /** 'plain' = bare icon, 'filled' = light grey circle, 'glass' = on photos */
  variant?: 'plain' | 'filled' | 'glass';
  badge?: number | boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function IconButton({
  name,
  onPress,
  size = 22,
  color,
  variant = 'plain',
  badge,
  style,
  accessibilityLabel,
}: IconButtonProps) {
  const iconColor =
    color ?? (variant === 'glass' ? colors.textOnImage : colors.text);
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={8}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.iconBtn,
        variant === 'filled' && styles.iconBtnFilled,
        variant === 'glass' && styles.iconBtnGlass,
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={iconColor} />
      {!!badge && (
        <View style={styles.iconBadge}>
          {typeof badge === 'number' && (
            <Text style={styles.iconBadgeText}>
              {badge > 99 ? '99+' : badge}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ------------------------------------------------------------------ */
/* Chip / ChipRow                                                      */
/* ------------------------------------------------------------------ */

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  /** 'filter' = teal fill when selected, 'tag' = static grey/outlined tag */
  variant?: 'filter' | 'tag';
  style?: StyleProp<ViewStyle>;
}

export function Chip({
  label,
  selected,
  onPress,
  icon,
  variant = 'filter',
  style,
}: ChipProps) {
  const isTag = variant === 'tag';
  const fg = selected ? colors.primaryOn : colors.text;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        isTag && styles.chipTag,
        selected && styles.chipSelected,
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={14} color={fg} />}
      <Text style={[styles.chipText, { color: fg }]}>{label}</Text>
    </TouchableOpacity>
  );
}

interface ChipRowProps<T extends string> {
  options: { value: T; label: string; icon?: IconName }[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function ChipRow<T extends string>({
  options,
  value,
  onChange,
  style,
}: ChipRowProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.chipRow, style]}
    >
      {options.map((o) => (
        <Chip
          key={o.value}
          label={o.label}
          icon={o.icon}
          selected={o.value === value}
          onPress={() => onChange(o.value)}
        />
      ))}
    </ScrollView>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar / AvatarStack                                                */
/* ------------------------------------------------------------------ */

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  /** Small dot or icon in the bottom-right corner (e.g. online, verified). */
  badge?: 'online' | 'verified';
  ring?: boolean;
  style?: StyleProp<ViewStyle>;
}

const AVATAR_TINTS = ['#FDE2D3', '#D9F2EF', '#E3E8FF', '#FCE7F3', '#FEF3C7'];

export function Avatar({
  uri,
  name,
  size = 40,
  badge,
  ring,
  style,
}: AvatarProps) {
  const initial = (name?.trim()?.[0] ?? '?').toUpperCase();
  const tint = AVATAR_TINTS[(name?.charCodeAt(0) ?? 0) % AVATAR_TINTS.length];
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tint,
          alignItems: 'center',
          justifyContent: 'center',
        },
        ring && { borderWidth: 2, borderColor: colors.surface },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
        />
      ) : (
        <Text
          style={{
            fontSize: size * 0.42,
            fontWeight: '700',
            color: colors.text,
          }}
        >
          {initial}
        </Text>
      )}
      {badge && (
        <View
          style={[
            styles.avatarBadge,
            {
              width: Math.max(10, size * 0.3),
              height: Math.max(10, size * 0.3),
              borderRadius: size,
            },
            badge === 'online' && { backgroundColor: colors.success },
          ]}
        >
          {badge === 'verified' && (
            <Ionicons name="checkmark" size={size * 0.2} color="#fff" />
          )}
        </View>
      )}
    </View>
  );
}

interface AvatarStackProps {
  people: { uri?: string | null; name?: string }[];
  size?: number;
  max?: number;
  label?: string;
}

export function AvatarStack({
  people,
  size = 24,
  max = 3,
  label,
}: AvatarStackProps) {
  const shown = people.slice(0, max);
  return (
    <View style={styles.row}>
      <View style={styles.row}>
        {shown.map((p, i) => (
          <Avatar
            key={i}
            uri={p.uri}
            name={p.name}
            size={size}
            ring
            style={{ marginLeft: i === 0 ? 0 : -size * 0.35 }}
          />
        ))}
      </View>
      {label && (
        <Text style={[typography.caption, { marginLeft: 6 }]}>{label}</Text>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* SearchBar                                                           */
/* ------------------------------------------------------------------ */

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>;
}

export function SearchBar({ style, ...inputProps }: SearchBarProps) {
  return (
    <View style={[styles.search, style]}>
      <Ionicons name="search" size={18} color={colors.textMuted} />
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        returnKeyType="search"
        {...inputProps}
      />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Headers                                                             */
/* ------------------------------------------------------------------ */

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({
  title,
  actionLabel = 'See All',
  onAction,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={typography.h2}>{title}</Text>
      {onAction && (
        <TouchableOpacity onPress={onAction} hitSlop={8}>
          <Text style={styles.link}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface ScreenHeaderProps {
  /** Large left-aligned title (tab roots) or centered title (with back). */
  title?: string;
  subtitle?: string;
  /** Show a back chevron (centered-title layout). */
  showBack?: boolean;
  onBack?: () => void;
  /** Text action on the left instead of chevron, e.g. "Cancel". */
  leftLabel?: string;
  onLeftPress?: () => void;
  /** Right-side content: icons or text actions. */
  right?: ReactNode;
  /** Custom node below the title row (search bar, chips…). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack,
  onBack,
  leftLabel,
  onLeftPress,
  right,
  children,
  style,
}: ScreenHeaderProps) {
  const router = useRouter();
  const back = onBack ?? (() => router.back());
  const centered = showBack || !!leftLabel;

  return (
    <View style={[styles.screenHeader, style]}>
      {centered ? (
        <View style={styles.headerRowCentered}>
          <View style={styles.headerSide}>
            {leftLabel ? (
              <TouchableOpacity onPress={onLeftPress ?? back} hitSlop={8}>
                <Text style={styles.link}>{leftLabel}</Text>
              </TouchableOpacity>
            ) : (
              <IconButton name="chevron-back" size={26} onPress={back} />
            )}
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            {!!title && (
              <Text style={styles.centerTitle} numberOfLines={1}>
                {title}
              </Text>
            )}
            {!!subtitle && <Text style={typography.caption}>{subtitle}</Text>}
          </View>
          <View style={[styles.headerSide, { alignItems: 'flex-end' }]}>
            {right}
          </View>
        </View>
      ) : (
        <View style={styles.headerRowLarge}>
          <View style={{ flex: 1 }}>
            {!!title && <Text style={typography.title}>{title}</Text>}
            {!!subtitle && (
              <Text style={[typography.bodySecondary, { marginTop: 2 }]}>
                {subtitle}
              </Text>
            )}
          </View>
          {right && <View style={styles.row}>{right}</View>}
        </View>
      )}
      {children}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Underline tabs (About / Chat / Photos / Attendees)                  */
/* ------------------------------------------------------------------ */

interface UnderlineTabsProps<T extends string> {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function UnderlineTabs<T extends string>({
  tabs,
  value,
  onChange,
  style,
}: UnderlineTabsProps<T>) {
  return (
    <View style={[styles.uTabs, style]}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <TouchableOpacity
            key={t.value}
            onPress={() => onChange(t.value)}
            style={[styles.uTab, active && styles.uTabActive]}
          >
            <Text
              style={[
                styles.uTabText,
                active && { color: colors.primary, fontWeight: '700' },
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Card, Badge, Divider                                                */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.card, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

export function Badge({
  label,
  tone = 'primary',
  icon,
  outline,
}: {
  label: string;
  tone?: BadgeTone;
  icon?: IconName;
  outline?: boolean;
}) {
  const t = badgeTones[tone];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: outline ? 'transparent' : t.bg },
        outline && { borderWidth: 1, borderColor: t.fg },
      ]}
    >
      {icon && <Ionicons name={icon} size={12} color={t.fg} />}
      <Text style={[styles.badgeText, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const badgeTones: Record<BadgeTone, { bg: string; fg: string }> = {
  primary: { bg: colors.primarySoft, fg: colors.primaryDark },
  success: { bg: colors.successSoft, fg: '#15803D' },
  warning: { bg: colors.warningSoft, fg: '#B45309' },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  neutral: { bg: colors.surfaceAlt, fg: colors.textSecondary },
};

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

/* ------------------------------------------------------------------ */
/* Form fields                                                         */
/* ------------------------------------------------------------------ */

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconName;
  containerStyle?: StyleProp<ViewStyle>;
}

export function TextField({
  label,
  hint,
  error,
  icon,
  multiline,
  containerStyle,
  ...inputProps
}: TextFieldProps) {
  return (
    <View style={[{ marginBottom: spacing.lg }, containerStyle]}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <View
        style={[
          styles.field,
          multiline && {
            minHeight: 96,
            alignItems: 'flex-start',
            paddingTop: 12,
          },
          !!error && { borderColor: colors.danger },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={colors.textMuted}
            style={{ marginRight: 8 }}
          />
        )}
        <TextInput
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          style={[styles.fieldInput, multiline && { textAlignVertical: 'top' }]}
          {...inputProps}
        />
      </View>
      {(error || hint) && (
        <Text
          style={[
            typography.caption,
            { marginTop: 6 },
            !!error && { color: colors.danger },
          ]}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
}

/** Tappable field that looks like an input (e.g. "Select a category  >"). */
export function SelectField({
  label,
  value,
  placeholder,
  icon,
  onPress,
}: {
  label?: string;
  value?: string | null;
  placeholder: string;
  icon?: IconName;
  onPress?: () => void;
}) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <TouchableOpacity
        style={styles.field}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={colors.textSecondary}
            style={{ marginRight: 10 }}
          />
        )}
        <Text
          style={[
            styles.fieldInput,
            { color: value ? colors.text : colors.textMuted },
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* List row (settings, menus)                                          */
/* ------------------------------------------------------------------ */

interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  iconColor?: string;
  left?: ReactNode;
  right?: ReactNode;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ListRow({
  title,
  subtitle,
  icon,
  iconColor,
  left,
  right,
  value,
  onPress,
  showChevron = !!onPress,
  destructive,
  style,
}: ListRowProps) {
  const Wrapper: any = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.listRow, style]}
    >
      {left ??
        (icon && (
          <View style={styles.listIcon}>
            <Ionicons
              name={icon}
              size={18}
              color={
                destructive ? colors.danger : (iconColor ?? colors.primary)
              }
            />
          </View>
        ))}
      <View style={{ flex: 1 }}>
        <Text
          style={[typography.body, destructive && { color: colors.danger }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {!!subtitle && (
          <Text
            style={[typography.caption, { marginTop: 2 }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {!!value && (
        <Text style={[typography.bodySecondary, { marginRight: 4 }]}>
          {value}
        </Text>
      )}
      {right}
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </Wrapper>
  );
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon = 'sparkles-outline',
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={[typography.h3, { textAlign: 'center' }]}>{title}</Text>
      {!!message && (
        <Text
          style={[
            typography.bodySecondary,
            { textAlign: 'center', marginTop: 4 },
          ]}
        >
          {message}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="soft"
          size="md"
          style={{ marginTop: spacing.lg }}
        />
      )}
    </View>
  );
}

export function FAB({
  icon = 'add',
  onPress,
  style,
}: {
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.fab, style]}
      accessibilityLabel="Create"
    >
      <Ionicons name={icon} size={28} color={colors.primaryOn} />
    </TouchableOpacity>
  );
}

/** Step indicator for multi-step flows (Create Event). */
export function StepDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <View style={[styles.row, { justifyContent: 'center', gap: 6 }]}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.stepDot,
            i <= current && { backgroundColor: colors.primary },
            i === current && { width: 22 },
          ]}
        />
      ))}
    </View>
  );
}

/** Small icon + text line used in meta rows (date, location, category). */
export function MetaRow({
  icon,
  children,
  style,
}: {
  icon: IconName;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.row, { gap: 6 }, style]}>
      <Ionicons name={icon} size={14} color={colors.textSecondary} />
      <Text style={typography.caption} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  link: { fontSize: 14, fontWeight: '600', color: colors.link },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.md,
  },
  btnText: { fontWeight: '700' },

  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnFilled: { backgroundColor: colors.surfaceAlt, borderRadius: 18 },
  iconBtnGlass: { backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 18 },
  iconBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 9,
    height: 9,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: { fontSize: 8, fontWeight: '700', color: '#fff' },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
  },
  chipTag: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    height: 30,
    paddingHorizontal: 12,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  chipRow: { paddingHorizontal: GUTTER, gap: spacing.sm },

  avatarBadge: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: GUTTER,
    marginBottom: spacing.md,
  },

  screenHeader: {
    paddingTop: 60,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  headerRowLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: GUTTER,
    gap: spacing.sm,
  },
  headerRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    minHeight: 40,
  },
  headerSide: { width: 72, flexDirection: 'row', alignItems: 'center' },
  centerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },

  uTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: GUTTER,
  },
  uTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginBottom: -1,
  },
  uTabActive: { borderBottomColor: colors.primary },
  uTabText: { fontSize: 14, fontWeight: '500', color: colors.textSecondary },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
    ...shadows.card,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },

  divider: { height: 1, backgroundColor: colors.divider },

  fieldLabel: { ...typography.label, marginBottom: 8 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 10,
  },

  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: GUTTER,
    backgroundColor: colors.surface,
  },
  listIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: GUTTER,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  fab: {
    position: 'absolute',
    right: GUTTER,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.fab,
  },

  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
});
