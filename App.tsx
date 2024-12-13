import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, RefreshControl } from "react-native";
import axios from "axios";
import Config from 'react-native-config';

//crypto info
type Crypto = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
};

export default function App() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get(Config.COINGECKO_API , {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 5,
          page: 1,
          sparkline: false,
        },
      });
      setCryptos(response.data);
    } catch (error) {
      console.error("Error fetching cryptocurrency data:", error);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCryptoData().finally(() => setRefreshing(false));
  };

  const renderItem = ({ item }: { item: Crypto }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name} ({item.symbol.toUpperCase()})</Text>
      <Text>Price: ${item.current_price.toFixed(2)}</Text>
      <Text>Market cap: ${item.market_cap.toLocaleString()}</Text>
      <Text>24h change: {item.price_change_percentage_24h.toFixed(2)}%</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cryptos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
