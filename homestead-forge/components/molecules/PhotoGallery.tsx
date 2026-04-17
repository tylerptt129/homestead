import React, { useRef } from 'react';
import { View, Pressable, Image, StyleSheet, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../theme';
import { Text, Icon } from '../atoms';

interface PhotoGalleryProps {
  photos: string[];
  onAddPhoto: (uri: string) => void;
  onRemovePhoto: (uri: string) => void;
  maxPhotos?: number;
}

export default function PhotoGallery({
  photos,
  onAddPhoto,
  onRemovePhoto,
  maxPhotos = 20,
}: PhotoGalleryProps) {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const f = Platform.select({ web: '"Inter", sans-serif', default: undefined });

  const handleWebPick = () => {
    if (Platform.OS === 'web') {
      // Create a hidden file input for web
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.onchange = (e: any) => {
        const files = e.target?.files;
        if (!files) return;
        Array.from(files).forEach((file: any) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            if (dataUrl) onAddPhoto(dataUrl);
          };
          reader.readAsDataURL(file);
        });
      };
      input.click();
    }
  };

  const canAdd = photos.length < maxPhotos;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="Camera" size={18} color={theme.colors.primary} />
          <Text variant="body" style={{ fontWeight: '600', color: theme.colors.text }}>
            Photos & Documents
          </Text>
        </View>
        <Text variant="caption" style={{ color: theme.colors.textMuted, fontFamily: f }}>
          {photos.length} added
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
        <View style={styles.photoRow}>
          {/* Add button */}
          {canAdd && (
            <Pressable
              onPress={handleWebPick}
              style={[styles.addBtn, {
                backgroundColor: theme.colors.primary + '10',
                borderColor: theme.colors.primary + '30',
              }]}
            >
              <Icon name="Plus" size={24} color={theme.colors.primary} />
              <Text variant="caption" style={{ color: theme.colors.primary, fontSize: 11, fontFamily: f }}>
                Add Photo
              </Text>
            </Pressable>
          )}

          {/* Photo thumbnails */}
          {photos.map((uri, idx) => (
            <View key={idx} style={styles.photoWrap}>
              <Image source={{ uri }} style={[styles.photo, { borderColor: theme.colors.border }]} />
              <Pressable
                onPress={() => onRemovePhoto(uri)}
                style={[styles.removeBtn, { backgroundColor: theme.colors.danger }]}
              >
                <Icon name="X" size={10} color="#fff" />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      {photos.length === 0 && (
        <Text variant="caption" style={{ color: theme.colors.textMuted, fontStyle: 'italic', marginTop: 4, fontFamily: f }}>
          Add photos of your progress, receipts, or reference materials
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scrollRow: {
    flexGrow: 0,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  addBtn: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  photoWrap: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
  },
  removeBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
