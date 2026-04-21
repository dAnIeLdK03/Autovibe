import React, { useState, useCallback } from "react";
import { 
  View, 
  Image, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Dimensions, 
  ScrollView 
} from "react-native";
import { getImageUrl } from "../../../utils/getImageurl"; 

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAIN_IMAGE_HEIGHT = Math.min(420, Math.round(SCREEN_WIDTH * 0.78));

interface CarGalleryProps {
  imageUrls: string[] | undefined;
  make: string;
  model: string;
  year: number;
}

function CarGallery({ imageUrls, make, model, year }: CarGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const validImages = (imageUrls ?? [])
    .filter((url) => url && typeof url === "string" && url.trim() !== "")
    .slice(0, 10);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  if (validImages.length === 0) {
    return (
      <View style={styles.noImageContainer}>
        <Text style={{ color: '#64748b' }}>No images</Text>
      </View>
    );
  }

  const currentUri = getImageUrl(validImages[currentIndex]);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => setIsZoomOpen(true)}>
        <Image
          source={{ uri: currentUri }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        
        <View style={styles.yearBadge}>
          <Text style={styles.yearText}>{year}</Text>
        </View>

        {validImages.length > 1 && (
          <View style={styles.controls}>
            <TouchableOpacity onPress={handlePrev} style={styles.arrowBtn}>
              <Text style={styles.arrowText}>{"<"}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleNext} style={styles.arrowBtn}>
              <Text style={styles.arrowText}>{">"}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.countBadge}>
          <Text style={{ color: 'white' }}>{validImages.length} images</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isZoomOpen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsZoomOpen(false)} // Това замества ESCAPE
      >
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setIsZoomOpen(false)}
          >
            <Text style={styles.closeButtonText}>✕ Close</Text>
          </TouchableOpacity>

          <ScrollView
            maximumZoomScale={5}
            minimumZoomScale={1}
            centerContent={true}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          >
            <Image
              source={{ uri: currentUri }}
              style={styles.zoomImage}
              resizeMode="contain"
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  mainImage: {
    width: '100%',
    height: MAIN_IMAGE_HEIGHT,
  },
  noImageContainer: {
    height: 250,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  yearText: {
    color: '#70FFE2',
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  arrowBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { color: 'white', fontSize: 20 },
  countBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'black',
  },
  zoomImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  closeButtonText: { color: 'white', fontWeight: 'bold' }
});

export default CarGallery;