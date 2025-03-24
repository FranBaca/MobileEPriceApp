import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import { useAuth } from "../Context/AuthContext";
const API_BASE_URL = "http://192.168.100.78:5000";

type Props = StackScreenProps<RootStackParamList, "SearchScreen">;

const SearchScreen: React.FC<Props> = ({ navigation }) => {
    const {accessToken} = useAuth()
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [productsML, setProductsML] = useState<SearchResponse | null>(null);
    const [productsAM, setProductsAM] = useState<SearchResponse | null>(null);

    type Product = {
      title: string;
      price: string;
      image: string;
      link: string;
    };
    type SearchResponse = {
      averagePrice: string,
      products: Product[]
    }
    const searchProducts = async () => {
      if (!accessToken) {
        Alert.alert("Error", "No se pudo autenticar con MercadoLibre.");
        return;
      }
  
      setLoading(true);
      try {
        const responseML = await axios.get(`${API_BASE_URL}/search?q=${query}`, {
          headers: { Authorization: `${accessToken}` },
        });
        setProductsML(responseML.data);
        const responseAM = await axios.get(`${API_BASE_URL}/search-amazon?query=${query}`)
        setProductsAM(responseAM.data)
      }
      
      catch (error) {
        Alert.alert("Error", "Hubo un problema al buscar los productos.");
        console.error("Error en la búsqueda:", error);
      } finally {
        setLoading(false);
      }

    };
    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search products</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe un producto..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={searchProducts} disabled={loading}/>
            {productsML && (
              <Text style={styles.productTitle}>$ARS {productsML.averagePrice}</Text>
            )}
            {productsAM && (
              <Text style={styles.price}>$USD {productsAM.averagePrice}</Text>
            )}
          </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 },
  card: { padding: 10, marginVertical: 5, backgroundColor: "#fff", borderRadius: 8, elevation: 3 },
  image: { width: "100%", height: 150, resizeMode: "contain" },
  productTitle: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "green" },
});
export default SearchScreen;