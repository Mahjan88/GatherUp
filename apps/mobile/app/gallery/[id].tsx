import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEventMedia, uploadEventMedia, deleteEventMedia } from '@gatherup/shared';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function EventGalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: media, isLoading, refetch } = useQuery({
    queryKey: ['event-media', id],
    queryFn: () => getEventMedia(id),
  });

  const deleteMediaMutation = useMutation({
    mutationFn: deleteEventMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-media', id] });
      Alert.alert('Success', 'Media deleted successfully');
    },
  });

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await handleUpload(result.assets[0].uri, result.assets[0].fileName || 'image.jpg');
    }
  };

  const handleUpload = async (uri: string, fileName: string) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadEventMedia(id, blob, fileName);
      await refetch();
      Alert.alert('Success', 'Media uploaded successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (mediaId: string) => {
    Alert.alert(
      'Delete Media',
      'Are you sure you want to delete this media?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMediaMutation.mutate(mediaId),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row justify-between items-center">
        <Text className="text-lg font-semibold">Event Gallery</Text>
        <TouchableOpacity
          onPress={handlePickImage}
          disabled={uploading}
          className="bg-primary-600 px-4 py-2 rounded-lg"
        >
          {uploading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-semibold">Upload</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {media && media.length > 0 ? (
          <View className="flex-row flex-wrap">
            {media.map((item) => (
              <TouchableOpacity
                key={item.id}
                className="w-1/3 p-1"
                onLongPress={() => handleDelete(item.id)}
              >
                <Image
                  source={{ uri: item.media_url }}
                  className="w-full aspect-square rounded-lg"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="images-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-center mt-4">
              No media yet
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Upload photos and videos to share with event members
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
