import React from "react";
import { View, Text } from "react-native";

function LibraryScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>LibraryScreen</Text>
    </View>
  );
}

export default React.memo(LibraryScreen);
