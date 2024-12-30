import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ListingDetail = ({ route, navigation }) => {
  const { listing } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBuyNow = () => {
    navigation.navigate("ListingCheckout", { listing });
  };

  const handleReport = () => {
    alert("Report submitted!");
  };

  const reviews = [
    { id: 1, user: "John Doe 1", rating: 5, comment: "Amazing product!" },
    { id: 2, user: "Jane Smith", rating: 4, comment: "Great value for money." },
    { id: 3, user: "Alex Johnson", rating: 3, comment: "A bit overpriced." },
  ];

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <Text style={styles.reviewUser}>{item.user}</Text>
      <View style={styles.reviewRating}>
        {[...Array(item.rating)].map((_, index) => (
          <Ionicons key={index} name="star" size={16} color="#FFB74D" />
        ))}
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <View style={styles.imageSliderContainer}>
            <FlatList
              data={listing.images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image source={{ uri: item.url }} style={styles.productImage} />
              )}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
            />
            <View style={styles.imageIndexContainer}>
              <Text style={styles.imageIndexText}>
                {currentImageIndex + 1}/{listing.images.length}
              </Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.productTitle}>{listing.name}</Text>
            <Text style={styles.productDescription}>{listing.description}</Text>
            <Text style={styles.productPrice}>PKR {listing.price}</Text>
            <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={handleReport}
            >
              <Text style={styles.reportButtonText}>Report Listing</Text>
            </TouchableOpacity>
            <View style={styles.statsContainer}>
              <Text style={styles.statText}>{listing.quantity} Quantity</Text>
              <Text style={styles.statText}>\u2022</Text>
              <Text style={styles.statText}>{listing.likes} Likes</Text>
            </View>
          </View>
          <Text style={styles.reviewsTitle}>Reviews</Text>
        </>
      }
      data={reviews}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderReview}
      ListFooterComponent={
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  imageSliderContainer: {
    height: 350,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  productImage: {
    width,
    height: 350,
    resizeMode: "cover",
  },
  imageIndexContainer: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
  },
  imageIndexText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  productTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#333",
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 24,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  statText: {
    fontSize: 16,
    color: "#999",
    marginRight: 15,
  },
  buyButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 25,
    alignItems: "center",
  },
  buyButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  reportButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 15,
    borderRadius: 50,
    marginBottom: 25,
    alignItems: "center",
  },
  reportButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  reviewsTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  reviewCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginHorizontal: 20,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  reviewRating: {
    flexDirection: "row",
    marginVertical: 5,
  },
  reviewComment: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    marginHorizontal: 20,
  },
});

export default ListingDetail;
