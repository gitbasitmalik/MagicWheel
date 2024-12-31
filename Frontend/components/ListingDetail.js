import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ImageCarousel = ({ images, onImageChange }) => (
  <View style={styles.imageSliderContainer}>
    <FlatList
      data={images}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <Image source={{ uri: item.url }} style={styles.productImage} />
      )}
      onMomentumScrollEnd={(e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        onImageChange(index);
      }}
    />
  </View>
);

const ProductDetails = ({ listing, onBuyNow, onReport }) => (
  <View style={styles.detailsContainer}>
    <View style={styles.header}>
      <Text style={styles.productTitle}>{listing.name}</Text>
      <Text style={styles.productPrice}>PKR {listing.price}</Text>
    </View>

    <Text style={styles.productDescription}>{listing.description}</Text>

    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Ionicons name="cube-outline" size={24} color="#666" />
        <Text style={styles.statText}>{listing.quantity} left</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="calendar-outline" size={24} color="#666" />
        <Text style={styles.statText}>2022</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons name="heart-outline" size={24} color="#666" />
        <Text style={styles.statText}>{listing.likes} Likes</Text>
      </View>
    </View>

    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.buyButton} onPress={onBuyNow}>
        <Ionicons name="cart-outline" size={24} color="white" />
        <Text style={styles.buyButtonText}>Buy Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.reportButton} onPress={onReport}>
        <Ionicons name="flag-outline" size={24} color="#FF5722" />
      </TouchableOpacity>
    </View>
  </View>
);

const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {review.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.reviewUserInfo}>
        <Text style={styles.reviewUser}>{review.name}</Text>
        <View style={styles.reviewRating}>
          {[...Array(review.rating)].map((_, index) => (
            <Ionicons key={index} name="star" size={16} color="#FFB74D" />
          ))}
        </View>
      </View>
      <Text style={styles.reviewDate}>2d ago</Text>
    </View>
    <Text style={styles.reviewComment}>{review.review_message}</Text>
  </View>
);

const ListingDetail = ({ route, navigation }) => {
  const { listing } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const reviews = listing.reviews || [];

  const handleBuyNow = () => {
    navigation.navigate("ListingCheckout", { listing });
  };

  const handleReport = () => {
    alert("Report submitted!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ListHeaderComponent={
          <>
            <ImageCarousel
              images={listing.images}
              onImageChange={setCurrentImageIndex}
            />
            <View style={styles.imageIndexContainer}>
              <Text style={styles.imageIndexText}>
                {currentImageIndex + 1}/{listing.images.length}
              </Text>
            </View>

            <ProductDetails
              listing={listing}
              onBuyNow={handleBuyNow}
              onReport={handleReport}
            />

            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsTitle}>Reviews</Text>
              <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
            </View>
          </>
        }
        data={reviews}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <ReviewCard review={item} />}
        ListEmptyComponent={
          <Text style={styles.noReviewsText}>No reviews yet</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  listContent: {
    paddingBottom: 20,
  },
  imageSliderContainer: {
    height: 400,
    backgroundColor: "#000",
  },
  productImage: {
    width,
    height: 400,
    resizeMode: "cover",
  },
  imageIndexContainer: {
    position: "absolute",
    top: 350,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageIndexText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  detailsContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  productTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    marginRight: 16,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2196F3",
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  statItem: {
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buyButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  reportButton: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FF5722",
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  reviewsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  reviewCount: {
    fontSize: 16,
    color: "#666",
  },
  reviewCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewDate: {
    fontSize: 14,
    color: "#999",
  },
  reviewComment: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  noReviewsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 24,
    fontStyle: "italic",
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 24,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    borderRadius: 24,
  },
});

export default ListingDetail;
