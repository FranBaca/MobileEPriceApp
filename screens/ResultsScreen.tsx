import React from "react";
import {View, Text, FlatList, Image, StyleSheet} from "react-native"

type product ={
    title: string,
    price: string,
    image: string,
    link: string,
}

type ResultsScreenProps = {
    route: { params: {products: product[]}};
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({route}) =>{
    const {products} = route.params;

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Search results</Text>
            <FlatList
                data={products}
                keyExtractor={(item)=> item.link}
                renderItem={({item}) =>(
                    <View style={styles.card}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <Text style={styles.productTitle}>{item.title}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    card: { padding: 10, marginVertical: 5, backgroundColor: "#f9f9f9", borderRadius: 8, elevation: 3 },
    image: { width: "100%", height: 150, resizeMode: "contain" },
    productTitle: { fontSize: 16, fontWeight: "bold" },
    price: { fontSize: 14, color: "green" },
  });
  

export default ResultsScreen;