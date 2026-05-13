import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../components/Header';

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

  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
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
      <Header
        title="Report"
        showBack
        showLogo={false}
        showHamburger={false}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Context Info */}
        <View style={styles.contextCard}>
          <Text style={styles.contextText}>
            Reporting {getTargetLabel().toLowerCase()}
          </Text>
          <Text style={styles.contextSubtext}>
            Select a reason below and add optional details to help us review this report.
          </Text>
        </View>

        {/* Reason Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Reason <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
          <View style={styles.reasonList}>
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonOption,
                  selectedReason === reason && styles.reasonOptionActive,
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <View style={styles.radioRow}>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedReason === reason && styles.radioCircleActive,
                    ]}
                  >
                    {selectedReason === reason && (
                      <View style={styles.radioCircleInner} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReason === reason && styles.reasonTextActive,
                    ]}
                  >
                    {reason}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Details Textarea */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Additional Details</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide any additional context that may help our review..."
            placeholderTextColor="#64748b"
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={5}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedReason || submitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!selectedReason || submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contextCard: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  contextText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  contextSubtext: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '500',
  },
  requiredAsterisk: {
    color: '#ef4444',
  },
  reasonList: {
    gap: 8,
  },
  reasonOption: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  reasonOptionActive: {
    borderColor: '#14b8a6',
    backgroundColor: '#0f2a2a',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#14b8a6',
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#14b8a6',
  },
  reasonText: {
    fontSize: 14,
    color: '#e2e8f0',
  },
  reasonTextActive: {
    color: '#14b8a6',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 14,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 34,
    backgroundColor: '#0f172a',
  },
  submitButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
