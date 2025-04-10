import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

type Product = {
  title: string;
  averagePrice: string;
  image: string;
  link: string;
};

type Props = {
  route: {
    params: {
      productsML: Product[];
      productsAM: Product[];
    };
  };
};

const ResultsScreen: React.FC<Props> = ({ route }) => {
  const { productsML, productsAM } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados de la búsqueda</Text>
      
      <Text style={styles.subtitle}>Mercado Libre</Text>
      <FlatList
        data={productsML}
        keyExtractor={(item) => item.link}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.price}>$ARS {item.averagePrice}</Text>
          </View>
        )}
      />
      
      <Text style={styles.subtitle}>Amazon</Text>
      <FlatList
        data={productsAM}
        keyExtractor={(item) => item.link}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.price}>$USD {item.averagePrice}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9F9F9" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, color: "#333" },
  subtitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, color: "#333" },
  card: { 
    backgroundColor: "#fff", 
    padding: 16, 
    marginVertical: 8, 
    borderRadius: 8, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 5 
  },
  image: { width: "100%", height: 150, resizeMode: "contain", borderRadius: 8 },
  productTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#333" },
  price: { fontSize: 16, color: "#28a745", marginVertical: 4 },
});

export default ResultsScreen;
