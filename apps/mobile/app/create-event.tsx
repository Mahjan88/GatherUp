import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent, getCurrentUser } from '@gatherup/shared';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000));
  const [isPublic, setIsPublic] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['my-hosted-events'] });
      Alert.alert('Success', 'Event created successfully!');
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not authenticated');

      await createEventMutation.mutateAsync({
        host_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        location: location.trim() || null,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        visibility: isPublic ? 'public' : 'private',
        requires_approval: requiresApproval,
        public_fields: isPublic
          ? {
              title: true,
              description: true,
              location: true,
              guestList: false,
              chat: false,
              gallery: false,
            }
          : null,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 space-y-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3"
            placeholder="Enter event title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Description
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 h-24"
            placeholder="Enter event description"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Location
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3"
            placeholder="Enter event location"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Start Time
          </Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-lg px-4 py-3"
            onPress={() => setShowStartPicker(true)}
          >
            <Text>{startTime.toLocaleString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="datetime"
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) setStartTime(date);
              }}
            />
          )}
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            End Time
          </Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-lg px-4 py-3"
            onPress={() => setShowEndPicker(true)}
          >
            <Text>{endTime.toLocaleString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="datetime"
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) setEndTime(date);
              }}
            />
          )}
        </View>

        <View className="flex-row items-center justify-between py-3">
          <Text className="text-base font-medium">Public Event</Text>
          <Switch value={isPublic} onValueChange={setIsPublic} />
        </View>

        {isPublic && (
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-base font-medium">
              Require Approval to Join
            </Text>
            <Switch
              value={requiresApproval}
              onValueChange={setRequiresApproval}
            />
          </View>
        )}

        <TouchableOpacity
          className="bg-primary-600 rounded-lg py-4 mt-4"
          onPress={handleCreate}
          disabled={createEventMutation.isPending}
        >
          <Text className="text-white text-center font-semibold text-base">
            {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-gray-300 rounded-lg py-4"
          onPress={() => router.back()}
        >
          <Text className="text-gray-700 text-center font-semibold">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
