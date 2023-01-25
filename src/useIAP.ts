import {
  adapty,
  AdaptyError,
  AdaptyPaywall,
  AdaptyProduct,
  AdaptyProductDiscount,
  AdaptyProfile,
} from 'react-native-adapty';
import {useEffect, useState} from 'react';

const useIAP = () => {
  const [paywall, setPaywall] = useState<AdaptyPaywall>();
  const [products, setProducts] = useState<AdaptyProduct[]>([]);
  const [introductoryDiscount, setIntroductoryDiscount] =
    useState<AdaptyProductDiscount>();
  const [discounts, setDiscounts] = useState<AdaptyProductDiscount[]>([]);

  //   const {userData, setUserData} = useUserData();

  useEffect(() => {
    (async () => {
      const activePaywall = await adapty.getPaywall('shoppy.paywall');
      const activeProducts = await adapty.getPaywallProducts(activePaywall);

      if (activePaywall && activeProducts.length > 0) {
        // Setting the monthly subscription discounts
        const discountsData = activeProducts[0].ios?.discounts;
        if (discountsData && discountsData.length > 0) {
          setDiscounts(discountsData);
        }
        // Setting the monthly subscription introductory discounts
        const introductoryDiscountData = activeProducts[0].introductoryDiscount;
        if (introductoryDiscountData) {
          setIntroductoryDiscount(introductoryDiscountData);
        }

        setPaywall(activePaywall);
        setProducts(activeProducts.reverse());
        // ? Analytics
        await adapty.logShowPaywall(activePaywall);
      }
    })();
  }, []);

  const getSubscriptionInfo = (): Promise<AdaptyProfile> | null => {
    try {
      return adapty.getProfile();
    } catch (error) {
      console.log('getSubscriptionInfo Error: ', error);
      return null;
    }
  };

  const isPremiumActive = async (): Promise<boolean> => {
    try {
      const profile = await adapty.getProfile();
      const hasPremium = profile?.accessLevels?.premium?.isActive || false;
      console.log({hasPremium});

      return hasPremium;
    } catch (error: unknown) {
      console.log({error});
      return false;
    }
  };

  const purchaseOffer = async (selectedProduct: AdaptyProduct) => {
    try {
      const profile = await adapty.makePurchase(selectedProduct);
      if (profile.accessLevels?.premium.isActive) {
        // grant access to premium features
        console.log('User is premium now! Hurray!');
        // return await makeUserPremium(userData, profile);
      }
      return Promise.reject(null);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const restorePurchase = async (): Promise<any | AdaptyError> => {
    try {
      const profile = await adapty.restorePurchases();
      if (profile?.accessLevels?.premium.isActive) {
        // await setPremiumToUser(profile);
        // return await makeUserPremium(userData, profile);
      }
      return Promise.reject('We could not find any restorable purchase');
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getActiveSubscription = (purchaserInfo: AdaptyProfile) => {
    const currentSubscriptionId =
      purchaserInfo?.accessLevels?.premium?.vendorProductId;

    return (
      currentSubscriptionId &&
      purchaserInfo.subscriptions &&
      purchaserInfo.subscriptions[currentSubscriptionId]
    );
  };

  return {
    paywall,
    products,
    discounts,
    purchaseOffer,
    isPremiumActive,
    restorePurchase,
    introductoryDiscount,
    getSubscriptionInfo,
    getActiveSubscription,
  };
};

export default useIAP;
