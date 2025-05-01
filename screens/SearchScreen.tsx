import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, LayoutAnimation, UIManager, Platform, Animated, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import ENV from "../env";

const API_BASE_URL = ENV.API_BASE_URL;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = StackScreenProps<RootStackParamList, "SearchScreen">;

type EbayProduct = {
  title: string;
  price: string;
  priceARS: string;
  currency: string;
  thumbnail: string | null;
  link: string;
}

type EbaySearchResponse = {
  products: EbayProduct[];
  averagePrice: string;
  averagePriceARS: string;
  exchangeRate: number;
}

type AmazonProduct = {
  title: string;
  price: number;
  link: string;
  image: string;
}

type AmazonSearchResponse = {
  products: AmazonProduct[];
  averagePrice: string;
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [productsEbay, setProductsEbay] = useState<EbaySearchResponse | null>(null);
  const [productsAmazon, setProductsAmazon] = useState<AmazonSearchResponse | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const customAnimation = {
    duration: 1500,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const searchProducts = async () => {
    setLoading(true);
    try {
      const [responseEbay, responseAmazon] = await Promise.all([
        axios.get(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`),
        axios.get(`${API_BASE_URL}/search-amazon?query=${query}`)
      ]);
      
      LayoutAnimation.configureNext(customAnimation);
      setProductsEbay(responseEbay.data);
      setProductsAmazon(responseAmazon.data);

      // Verificar si no hay productos en ninguna plataforma
      if ((!responseEbay.data.products || responseEbay.data.products.length === 0) && 
          (!responseAmazon.data.products || responseAmazon.data.products.length === 0)) {
        Alert.alert(
          "No se encontraron productos",
          "No pudimos encontrar resultados para tu búsqueda. Intenta con otros términos.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error en la búsqueda:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        if (error.response?.status === 404) {
          Alert.alert(
            "No se encontraron productos",
            "No pudimos encontrar resultados para tu búsqueda. Intenta con otros términos.",
            [{ text: "OK" }]
          );
        } else {
          Alert.alert(
            "Error",
            `Error al buscar productos: ${error.response?.data?.message || error.message}`
          );
        }
      } else {
        Alert.alert("Error", "Hubo un problema al buscar los productos.");
      }
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Buscar productos</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe un producto..."
          value={query}
          onChangeText={setQuery}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Buscar"
            onPress={searchProducts}
            disabled={loading}
            color="#FF6347"
          />
        </View>
      </Animated.View>

      <View style={styles.resultsContainer}>
        {productsEbay && (
          <View style={styles.card}>
            {productsEbay.products[0]?.thumbnail && (
              <Image
                source={{ uri: productsEbay.products[0].thumbnail }}
                style={styles.image}
              />
            )}
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.priceContainer}>
                <View style={[styles.priceCard, { opacity: productsEbay ? 1 : 0.2 }]}>
                  <Text style={styles.flag}>🇦🇷</Text>
                  <Text style={styles.price}>
                    {productsEbay.averagePriceARS ? `$ARS ${productsEbay.averagePriceARS}` : "Precio no disponible"}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>
        )}

        {productsAmazon && (
          <View style={styles.card}>
            {productsAmazon.products[0]?.image && (
              <Image
                source={{ uri: productsAmazon.products[0].image }}
                style={styles.image}
              />
            )}
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.priceContainer}>
                <View style={[styles.priceCard, { opacity: productsAmazon ? 1 : 0.2 }]}>
                  <Text style={styles.flag}>🇺🇸</Text>
                  <Text style={styles.price}>
                    {productsAmazon.averagePrice ? `$USD ${productsAmazon.averagePrice}` : "Precio no disponible"}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>
        )}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    color: '#000',
    backgroundColor: '#fff',
    width: '100%',
  },
  resultsContainer: {
    width: '100%',
    maxHeight: '50%',
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  priceCard: {
    backgroundColor: "#FF6347",
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  price: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  flag: {
    fontSize: 16,
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default SearchScreen;