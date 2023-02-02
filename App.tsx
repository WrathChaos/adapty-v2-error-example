import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {adapty, AdaptyError} from 'react-native-adapty';
import useIAP from './src/useIAP';

async function init() {
  try {
    console.info('[ADAPTY] Activating Adapty SDK...');
    // Async activate Adapty
    await adapty.activate('TOKEN', {
      lockMethodsUntilReady: true,
    });
  } catch (error: any) {
    console.error('[ADAPTY] Error activating Adapty SDK', error.message);
  }
}
init();

const App: React.FC = () => {
  const {isPremiumActive} = useIAP();

  const fetchProfile = async (shouldAlert = false) => {
    // setIsLoadingProfile(true);

    try {
      console.info('[ADAPTY] Fetching user profile...');
      const _profile = await adapty.getProfile();
      console.log('Profile: ', _profile);
      // setProfile(_profile);
    } catch (error: any) {
      console.error('[ADAPTY] Error fetching user profile', error.message);

      if (shouldAlert && error instanceof AdaptyError) {
        Alert.alert(
          `Error fetching user profile ${error.adaptyCode}`,
          error.localizedDescription,
        );
      }
    } finally {
      // setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    async function fetch() {
      try {
        console.info('[ADAPTY] Activating Adapty SDK...');
        // Async activate Adapty
        await adapty.activate('TOKEN', {
          lockMethodsUntilReady: true,
        });
      } catch (error: any) {
        console.error('[ADAPTY] Error activating Adapty SDK', error.message);
      }

      try {
        // Set fallback paywalls
        // const json = await Platform.select({
        //   ios: import('./assets/ios_fallback.json'),
        //   android: import('./assets/android_fallback.json'),
        // });
        // const str = JSON.stringify(json); // Webpack converts json string to object, but we need string here
        // await adapty.setFallbackPaywalls(str);
      } catch {}

      fetchProfile();

      adapty.addEventListener('onLatestProfileLoad', profile_ => {
        console.info('[ADAPTY] onLatestProfileLoad', profile_);
        // setProfile(profile_);
      });
    }
    fetch();

    return () => {
      // Unsubscribe from adapty events
      console.log('[ADAPTY] Unsubscribing from adapty events');
      adapty.removeAllListeners();
    };
  }, []);

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
