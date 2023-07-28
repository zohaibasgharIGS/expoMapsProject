import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
  Callout,
  Circle,
} from "react-native-maps";

export default function App() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    axios
      .get("https://api.plurppl.com/api/events", {
        headers: {
          Accept: "*/*",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFhNWI4MmE4LTE4NzktNDhiMS05NmY1LWY5MTAwMDVkNjE4NCIsInBpZCI6IlBMMTY4MzAzMTYwNjAwMCIsIm5hbWUiOiJzYWFkIDMxMDYwODk3NjAiLCJlbWFpbCI6InNhYWRxYWRpcjc4NkBnbWFpbC5jb20iLCJwaG9uZSI6IjMxMDYwODk3NjAiLCJyb2xlIjoiU3RhbmRhcmQiLCJpYXQiOjE2OTAxNzg1NTJ9.AEV6dACdH5yWK5iVpr7JQcQYUzM1tPZ-WuD3q-NAWZI",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setEvents(res.data.slice(1, 50));
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {events.length > 0 ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          minZoomLevel={5}
          initialRegion={{
            latitude: 30.269544,
            longitude: -97.745284,
            longitudeDelta: 0.0421,
            latitudeDelta: 0.0922,
          }}
          initialCamera={{
            latitude: 30.269544,
            longitude: -97.745284,
          }}
        >
          <Polygon
            coordinates={[
              { longitude: -97.721751, latitude: 30.301187 },
              { longitude: -97.895092, latitude: 30.25067 },
              { longitude: -97.740802, latitude: 30.160229 },
            ]}
            strokeWidth={1}
            fillColor="rgba(90,34,139,0.2)"
            strokeColor="rgba(90,34,139,1)"
            tappable={true}
          />
          <Circle
            center={{ latitude: 30.269544, longitude: -97.745284 }}
            radius={5000}
            strokeColor="orange"
            fillColor="rgba(211,84,0,1)"
          />
          {events?.map((event) => {
            if (event?.latitude > 90 || event?.latitude < -90) {
              return null;
            }
            return (
              <Marker
                key={event?.id}
                coordinate={{
                  latitude: Number(event?.latitude),
                  longitude: Number(event?.longitude),
                }}
                pinColor="red"
              >
                <Callout
                  children={
                    <View>
                      <Text style={{ textAlign: "center" }}>{event.name}</Text>
                      <Text style={{ textAlign: "center" }}>
                        Category: {event.category}
                      </Text>
                    </View>
                  }
                />
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <Text>Loading events...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
