import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, LayoutAnimation, UIManager, Platform, Animated } from "react-native";
import axios from "axios";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import { useAuth } from "../Context/AuthContext";
import ENV from "../env";
const API_BASE_URL = ENV.API_URL
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
type Props = StackScreenProps<RootStackParamList, "SearchScreen">;



const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const {accessToken} = useAuth()
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [productsML, setProductsML] = useState<SearchResponse | null>(null);
  const [productsAM, setProductsAM] = useState<SearchResponse | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true, 
    }).start();
    
  }, [fadeAnim]);

    type Product = {
      title: string;
      price: string;
      image: string;
      link: string;
      thumbnail:string;
    };
    type SearchResponse = {
      averagePrice: string,
      products: Product[]
    }
    const customAnimation = {
      duration: 1500,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    };
   
    

    const searchProducts = async () => {
      if (!accessToken) {
        Alert.alert("Error", "No se pudo autenticar con MercadoLibre.");
        return;
      }
      console.log("token:",accessToken)
      setLoading(true);
      try {
        const responseML = await axios.get(`${API_BASE_URL}/search?q=${query}`, {
          headers: { Authorization: `${accessToken}` },
        });
        const responseAM = await axios.get(`${API_BASE_URL}/search-amazon?query=${query}`)
        LayoutAnimation.configureNext(customAnimation);
        setProductsML(responseML.data);
        setProductsAM(responseAM.data)
      }
      
      catch (error) {
        Alert.alert("Error", "Hubo un problema al buscar los productos.");
        console.error("Error en la búsqueda:", error);
      } finally {
        setLoading(false);
        setQuery("")
      }

    };
  
    return (
      <View style={styles.container}>
        <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>Buscar productos</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe un producto..."
          value={query}
          onChangeText={setQuery}
          />
        <Button title="Buscar" onPress={searchProducts} disabled={loading} color="#FF6347" />
          </Animated.View>
        {productsML && (
  <View style={styles.resultsContainer}>
    <View style={styles.card}>
        <Image
          source={{ uri: productsML?.products[0]?.thumbnail }}
          style={styles.image}
        />
        <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.priceContainer}>
        <View style={[styles.priceCard, { opacity: productsML ? 1 : 0.2}]}>
            <Text style={styles.flag}>🇦🇷</Text>  
          <Text style={styles.price}> 
            {productsML.averagePrice ? `$ARS ${productsML.averagePrice.toString()}` : "Precio no disponible"}
          </Text>
        </View>
        <View style={[styles.priceCard, { opacity: productsAM ? 1 : 0.2 }]}>
          <Text style={styles.flag}>🇺🇸</Text>
            <Text style={styles.price}>
              {productsAM?.averagePrice ? `$USD ${productsAM.averagePrice.toString()}` : "Precio no disponible"}
            </Text>
        </View>
      </View>
        </Animated.View>
    </View>
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
    },
    input: {
      borderWidth: 1,
      borderColor: '#555',
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      color: '#000',
      backgroundColor: '#fff',
    },
    resultsContainer: {
      marginTop: 20,
    },
    card: {
      backgroundColor: '#1f1f1f',
      padding: 16,
      marginBottom: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      elevation: 5,
    },
    image: {
      width: '100%',
      resizeMode: 'contain',
      height:200
    },
    productTitle: {
      fontSize: 18,
      color: '#fff',
      marginTop: 10,
    },
    priceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    priceCard: {
      backgroundColor: "#FF6347",
      padding: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48%',
    },
    price: {
      fontSize: 16,
      color: '#fff',
      marginLeft: 8,
    },
    flag: {
      width: 20,
      height: 20,
    },
    noResults: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 18,
      marginTop: 20,
    },
  });
  
export default SearchScreen;