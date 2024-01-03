import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef(null);

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  const handleGoBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'http://192.168.0.186:3000/' }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleNavigationStateChange}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} disabled={!canGoBack}>
          <Text style={canGoBack ? styles.link : styles.disabledLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  link: {
    color: 'blue',
  },
  disabledLink: {
    color: '#ccc',
  },
});
