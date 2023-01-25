import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {adapty} from 'react-native-adapty';
import useIAP from './src/useIAP';

const App: React.FC = () => {
  useEffect(() => {
    (async () => {
      try {
        await adapty.activate('your-api-key');
      } catch (e) {
        console.log({e});
      }
    })();
  }, []);

  const {isPremiumActive} = useIAP();

  const handleCheckPremium = () => {
    isPremiumActive();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonStyle} onPress={handleCheckPremium}>
        <Text style={styles.textStyle}>Check Premium Active</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    height: 50,
    width: '60%',
    borderRadius: 12,
    backgroundColor: '#039',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
