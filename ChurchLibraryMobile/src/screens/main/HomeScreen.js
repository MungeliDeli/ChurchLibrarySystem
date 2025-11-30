import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import Input from '../../components/common/Input'; // Import the Input component
import ContinueReadingCard from "../../components/common/ContinueReadingCard";
import ContentCarousel from "../../components/common/ContentCarousel";
import {
  getNewArrivals,
  getTrending,
  getFeatured,
  getContinueReading,
} from "../../services/homeService";

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [continueReading, setContinueReading] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [
          continueReadingRes,
          newArrivalsRes,
          trendingRes,
          featuredRes,
        ] = await Promise.all([
          getContinueReading(),
          getNewArrivals(),
          getTrending(),
          getFeatured(),
        ]);

        const responses = [continueReadingRes, newArrivalsRes, trendingRes, featuredRes];
        if (responses.some(res => !res.ok)) {
          responses.forEach(res => {
            if (!res.ok) {
              console.error('API call failed:', res);
            }
          });
          setError("Some content could not be loaded. Please try again later.");
        }

        if (continueReadingRes.ok) setContinueReading(continueReadingRes.data);
        if (newArrivalsRes.ok) setNewArrivals(newArrivalsRes.data);
        if (trendingRes.ok) setTrending(trendingRes.data);
        if (featuredRes.ok) setFeatured(featuredRes.data);

      } catch (e) {
        setError("Failed to load home screen data. Please try again later.");
        console.error('Caught an error in fetchHomeData:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleBookPress = (book) => {
    navigation.navigate('BookDetails', { book });
  };

  const handleContinueReadingPress = (book) => {
    navigation.navigate('BookReader', {
      itemId: book.itemId,
      // Future enhancement: pass last read location from progress tracking
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <Text style={[styles.welcomeTitle, { color: theme.colors.text.primary }]}>
        Welcome to Church Library!
      </Text>
      {user?.name ? (
        <Text style={[styles.welcomeSubtitle, { color: theme.colors.text.secondary }]}>
          Hello, {user.name}
        </Text>
      ) : null}

      <Input
        placeholder="Search the entire library..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary.main} style={{ marginTop: 20 }} />
      ) : error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      ) : (
        <>
          {continueReading.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Continue Reading</Text>
              {continueReading.map(book => (
                <ContinueReadingCard
                  key={book.itemId}
                  book={book}
                  onPress={handleContinueReadingPress}
                />
              ))}
            </View>
          )}

          {newArrivals.length > 0 && (
            <ContentCarousel
              title="New Arrivals"
              data={newArrivals}
              onBookPress={handleBookPress}
            />
          )}

          {trending.length > 0 && (
            <ContentCarousel
              title="Trending Books"
              data={trending}
              onBookPress={handleBookPress}
            />
          )}

          {featured.length > 0 && (
            <ContentCarousel
              title="Featured Books"
              data={featured}
              onBookPress={handleBookPress}
            />
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, // Adjusted padding for better layout
  },
  welcomeTitle: {
    fontSize: 24, // Larger font for welcome
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 0, // Resetting from ContentCarousel style
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  title: { fontSize: 20, fontWeight: "700" }, // Keep original title for potential reuse
  subtitle: { marginTop: 8, fontSize: 16 }, // Keep original subtitle for potential reuse
});
