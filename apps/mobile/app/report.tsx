import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';
import { Button, Divider, Ionicons, TextField } from '../components/ui';
import { colors, radius, spacing, typography, GUTTER } from '../theme';

type TargetType = 'user' | 'event' | 'community' | 'message' | 'media';

const REPORT_REASONS = [
  'Spam or misleading',
  'Harassment or bullying',
  'Inappropriate content',
  'Hate speech',
  'Scam or fraud',
  'Other',
] as const;

type ReportReason = (typeof REPORT_REASONS)[number];

export default function ReportScreen() {
  const router = useRouter();
  const { target_type, target_id } = useLocalSearchParams<{
    target_type: TargetType;
    target_id: string;
  }>();

  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null
  );
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;

    setSubmitting(true);

    // TODO: Call API to submit report
    // POST /api/reports with body:
    // {
    //   reporter_id: <from auth context>,
    //   target_type: target_type,
    //   target_id: target_id,
    //   reason: selectedReason,
    //   details: details || null,
    // }

    // Simulate API call delay
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert(
        'Report Submitted',
        'Thank you for your report. Our team will review it shortly.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 500);
  };

  const getTargetLabel = (): string => {
    switch (target_type) {
      case 'user':
        return 'User';
      case 'event':
        return 'Event';
      case 'community':
        return 'Community';
      case 'message':
        return 'Message';
      case 'media':
        return 'Media';
      default:
        return 'Content';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Report" showBack showLogo={false} showHamburger={false} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Context Info */}
        <View style={styles.contextCard}>
          <View style={styles.contextIcon}>
            <Ionicons name="flag-outline" size={20} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={typography.h3}>
              Reporting {getTargetLabel().toLowerCase()}
            </Text>
            <Text style={[typography.bodySecondary, styles.contextSubtext]}>
              Select a reason below and add optional details to help us review
              this report.
            </Text>
          </View>
        </View>

        {/* Reason Picker */}
        <Text style={styles.sectionTitle}>Reason *</Text>
        <View style={styles.reasonList}>
          {REPORT_REASONS.map((reason, i) => {
            const active = selectedReason === reason;
            return (
              <View key={reason}>
                {i > 0 && <Divider style={styles.rowDivider} />}
                <TouchableOpacity
                  style={styles.reasonOption}
                  onPress={() => setSelectedReason(reason)}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                >
                  <Text
                    style={[
                      typography.body,
                      styles.reasonText,
                      active && styles.reasonTextActive,
                    ]}
                  >
                    {reason}
                  </Text>
                  <View
                    style={[styles.radioCircle, active && styles.radioActive]}
                  >
                    {active && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.primaryOn}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Details Textarea */}
        <Text style={styles.sectionTitle}>Additional Details</Text>
        <TextField
          placeholder="Provide any additional context that may help our review..."
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={5}
          hint="Optional"
        />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <Button
          label={submitting ? 'Submitting...' : 'Submit Report'}
          variant="danger"
          icon="flag-outline"
          onPress={handleSubmit}
          disabled={!selectedReason || submitting}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 110,
  },
  contextCard: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  contextIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextSubtext: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  reasonList: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  reasonText: {
    flex: 1,
  },
  reasonTextActive: {
    fontWeight: '600',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rowDivider: {
    marginLeft: spacing.lg,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: GUTTER,
    paddingTop: spacing.md,
    paddingBottom: 34,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});
