/**
 * HEEL Dog Training - In-App Purchase Service
 * react-native-iap v14.7.x (Nitro Modules)
 *
 * v14 BREAKING CHANGES from v12/v13:
 * - Requires react-native-nitro-modules as peer dependency
 * - requestSubscription() is GONE — use requestPurchase() with type: 'subs'
 * - New API: requestPurchase({ request: { apple: { sku } }, type: 'subs' })
 * - purchaseUpdatedListener / purchaseErrorListener still work
 * - finishTransaction({ purchase }) with object param
 */

import { Platform } from 'react-native';

// ============================================================
// Safe module import via require()
// ============================================================
let RNIap: any = null;
try {
  RNIap = require('react-native-iap');
} catch (e) {
  console.error('[IAP] Failed to require react-native-iap:', e);
}

// ============================================================
// PRODUCT IDS
// ============================================================
export const PRODUCT_IDS = {
  MONTHLY: 'com.codyjag95.heel.premium.monthly',
  ANNUAL: 'com.codyjag95.heel.premium.annual',
};

const SUBSCRIPTION_SKUS = [PRODUCT_IDS.MONTHLY, PRODUCT_IDS.ANNUAL];

// ============================================================
// Types
// ============================================================
export interface HEELProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  localizedPrice: string;
  type: 'monthly' | 'annual';
}

export interface PurchaseResult {
  success: boolean;
  productId?: string;
  transactionId?: string;
  error?: string;
}

// ============================================================
// Diagnostics
// ============================================================
export const logIAPDiagnostics = () => {
  console.log('=== IAP DIAGNOSTICS (v14) ===');
  console.log('RNIap loaded:', !!RNIap);
  if (RNIap) {
    [
      'initConnection', 'endConnection',
      'getSubscriptions', 'getProducts',
      'requestPurchase', 'requestSubscription',
      'finishTransaction', 'getAvailablePurchases',
      'purchaseUpdatedListener', 'purchaseErrorListener',
      'useIAP', 'fetchProducts',
    ].forEach(fn => {
      console.log(`  ${fn}: ${typeof RNIap[fn]}`);
    });
  }
  console.log('=============================');
};

// ============================================================
// Initialize Connection
// ============================================================
let isInitialized = false;

export const initializeIAP = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') return false;
  if (!RNIap || typeof RNIap.initConnection !== 'function') {
    console.error('[IAP] Module or initConnection not available');
    logIAPDiagnostics();
    return false;
  }

  try {
    const result = await RNIap.initConnection();
    console.log('[IAP] Connected:', result);
    isInitialized = true;
    logIAPDiagnostics();
    return true;
  } catch (error: any) {
    console.error('[IAP] initConnection failed:', error?.message);
    isInitialized = false;
    return false;
  }
};

// ============================================================
// End Connection
// ============================================================
export const endIAP = async (): Promise<void> => {
  try {
    if (RNIap && typeof RNIap.endConnection === 'function') {
      await RNIap.endConnection();
    }
    isInitialized = false;
  } catch (e) {
    console.error('[IAP] endConnection error:', e);
  }
};

// ============================================================
// Fallback Products
// ============================================================
const getFallbackProducts = (): HEELProduct[] => [
  {
    productId: PRODUCT_IDS.MONTHLY,
    title: 'Monthly',
    description: 'HEEL Premium Monthly',
    price: '$9.99',
    currency: 'USD',
    localizedPrice: '$9.99',
    type: 'monthly',
  },
  {
    productId: PRODUCT_IDS.ANNUAL,
    title: 'Annual',
    description: 'HEEL Premium Annual',
    price: '$69.99',
    currency: 'USD',
    localizedPrice: '$69.99',
    type: 'annual',
  },
];

// ============================================================
// Fetch Products
// ============================================================
export const getProducts = async (): Promise<HEELProduct[]> => {
  if (!isInitialized) {
    const ok = await initializeIAP();
    if (!ok) return getFallbackProducts();
  }

  if (!RNIap || typeof RNIap.getSubscriptions !== 'function') {
    console.error('[IAP] getSubscriptions not available');
    return getFallbackProducts();
  }

  try {
    const subs = await RNIap.getSubscriptions({ skus: SUBSCRIPTION_SKUS });

    if (!subs || subs.length === 0) {
      console.warn('[IAP] No subscription products returned from store');
      return getFallbackProducts();
    }

    console.log('[IAP] Fetched', subs.length, 'products');
    return subs.map((sub: any) => ({
      productId: sub.productId,
      title: sub.title || (sub.productId.includes('monthly') ? 'Monthly' : 'Annual'),
      description: sub.description || 'HEEL Premium Access',
      price: sub.localizedPrice || (sub.productId.includes('monthly') ? '$9.99' : '$69.99'),
      currency: sub.currency || 'USD',
      localizedPrice: sub.localizedPrice || (sub.productId.includes('monthly') ? '$9.99' : '$69.99'),
      type: (sub.productId.includes('monthly') ? 'monthly' : 'annual') as 'monthly' | 'annual',
    }));
  } catch (error: any) {
    console.error('[IAP] getSubscriptions error:', error?.message);
    return getFallbackProducts();
  }
};

// ============================================================
// Purchase Subscription
//
// v14: requestSubscription() does NOT exist!
// Must use requestPurchase() with type: 'subs'
//
// Tries THREE syntaxes in order:
// 1. v14.5+ new format: { request: { apple: { sku } }, type: 'subs' }
// 2. v14.0-14.4 format:  { request: { ios: { sku } }, type: 'subs' }
// 3. Legacy v12 format:  { sku: productId }
// ============================================================
export const purchaseSubscription = async (
  productId: string
): Promise<PurchaseResult> => {
  if (!RNIap) {
    return { success: false, error: 'Store not available. Please reinstall the app.' };
  }

  if (!isInitialized) {
    const ok = await initializeIAP();
    if (!ok) return { success: false, error: 'Could not connect to the App Store.' };
  }

  // v14 uses requestPurchase for everything (subscriptions included)
  const purchaseFn = RNIap.requestPurchase;

  // Fallback: maybe requestSubscription still exists in some v14 builds
  const subsFn = RNIap.requestSubscription;

  if (typeof purchaseFn !== 'function' && typeof subsFn !== 'function') {
    console.error('[IAP] Neither requestPurchase nor requestSubscription available');
    logIAPDiagnostics();
    return { success: false, error: 'Store module error. Please update the app.' };
  }

  // Attempt 1: v14.5+ requestPurchase with apple key
  if (typeof purchaseFn === 'function') {
    try {
      console.log('[IAP] Attempt 1: requestPurchase({ request: { apple: { sku } }, type: "subs" })');
      await purchaseFn({
        request: {
          apple: { sku: productId },
        },
        type: 'subs',
      });
      console.log('[IAP] Payment sheet shown (attempt 1)');
      return { success: false, error: 'pending' };
    } catch (e1: any) {
      console.log('[IAP] Attempt 1 failed:', e1?.message, '— trying next syntax');

      // Check if user cancelled
      if (e1?.code === 'E_USER_CANCELLED' || e1?.message?.includes('cancel')) {
        return { success: false, error: 'cancelled' };
      }

      // Attempt 2: v14.0-14.4 with ios key
      try {
        console.log('[IAP] Attempt 2: requestPurchase({ request: { ios: { sku } }, type: "subs" })');
        await purchaseFn({
          request: {
            ios: { sku: productId },
          },
          type: 'subs',
        });
        console.log('[IAP] Payment sheet shown (attempt 2)');
        return { success: false, error: 'pending' };
      } catch (e2: any) {
        console.log('[IAP] Attempt 2 failed:', e2?.message, '— trying legacy');

        if (e2?.code === 'E_USER_CANCELLED' || e2?.message?.includes('cancel')) {
          return { success: false, error: 'cancelled' };
        }

        // Attempt 3: Legacy { sku } syntax
        try {
          console.log('[IAP] Attempt 3: requestPurchase({ sku: productId })');
          await purchaseFn({ sku: productId });
          console.log('[IAP] Payment sheet shown (attempt 3)');
          return { success: false, error: 'pending' };
        } catch (e3: any) {
          console.log('[IAP] Attempt 3 failed:', e3?.message);
          if (e3?.code === 'E_USER_CANCELLED' || e3?.message?.includes('cancel')) {
            return { success: false, error: 'cancelled' };
          }
          // All requestPurchase attempts failed, fall through to requestSubscription
        }
      }
    }
  }

  // Attempt 4: requestSubscription (may exist in some v14 builds)
  if (typeof subsFn === 'function') {
    try {
      console.log('[IAP] Attempt 4: requestSubscription({ sku: productId })');
      await subsFn({ sku: productId });
      console.log('[IAP] Payment sheet shown (attempt 4 - requestSubscription)');
      return { success: false, error: 'pending' };
    } catch (e4: any) {
      if (e4?.code === 'E_USER_CANCELLED' || e4?.message?.includes('cancel')) {
        return { success: false, error: 'cancelled' };
      }
      console.error('[IAP] All purchase attempts failed. Last error:', e4?.message);
      return { success: false, error: e4?.message || 'Purchase failed. Please try again.' };
    }
  }

  return { success: false, error: 'Purchase not available. Please try again later.' };
};

// ============================================================
// Restore Purchases
// ============================================================
export const restorePurchases = async (): Promise<PurchaseResult> => {
  if (!RNIap) return { success: false, error: 'Store not available.' };

  if (!isInitialized) {
    const ok = await initializeIAP();
    if (!ok) return { success: false, error: 'Could not connect to App Store.' };
  }

  if (typeof RNIap.getAvailablePurchases !== 'function') {
    return { success: false, error: 'Store not fully loaded.' };
  }

  try {
    console.log('[IAP] Restoring...');
    const purchases = await RNIap.getAvailablePurchases();
    const heel = purchases?.find(
      (p: any) => p.productId === PRODUCT_IDS.MONTHLY || p.productId === PRODUCT_IDS.ANNUAL
    );

    if (heel) {
      console.log('[IAP] Restored:', heel.productId);
      return { success: true, productId: heel.productId, transactionId: heel.transactionId };
    }
    return { success: false, error: 'No active subscription found.' };
  } catch (error: any) {
    console.error('[IAP] Restore error:', error?.message);
    return { success: false, error: error?.message || 'Could not restore purchases.' };
  }
};

// ============================================================
// Launch Re-validation — "is this subscription STILL active?"
// error:true means "couldn't check (offline / store down)".
// Callers must NOT revoke premium when error is true — only
// revoke on a confirmed "no active subscription" answer.
// ============================================================
export const checkActiveSubscription = async (): Promise<{
  active: boolean;
  productId?: string;
  error?: boolean;
}> => {
  if (Platform.OS !== 'ios' || !RNIap) return { active: false, error: true };
  if (!isInitialized) {
    const ok = await initializeIAP();
    if (!ok) return { active: false, error: true };
  }
  if (typeof RNIap.getAvailablePurchases !== 'function') return { active: false, error: true };

  try {
    const purchases = await RNIap.getAvailablePurchases();
    const heel = purchases?.find((p: any) => SUBSCRIPTION_SKUS.includes(p.productId));
    return heel ? { active: true, productId: heel.productId } : { active: false };
  } catch (e: any) {
    console.error('[IAP] checkActiveSubscription error:', e?.message);
    return { active: false, error: true };
  }
};

// ============================================================
// Purchase Listener (called ONCE in AppContext)
// ============================================================
export const setupPurchaseListener = (
  onSuccess: (productId: string) => void,
  onError: (error: string) => void
) => {
  if (!RNIap) {
    console.error('[IAP] Cannot set up listeners — module not loaded');
    return () => {};
  }

  let updateSub: any = null;
  let errorSub: any = null;

  if (typeof RNIap.purchaseUpdatedListener === 'function') {
    updateSub = RNIap.purchaseUpdatedListener(async (purchase: any) => {
      console.log('[IAP] LISTENER: Purchase received for', purchase?.productId);
      try {
        if (typeof RNIap.finishTransaction === 'function') {
          await RNIap.finishTransaction({ purchase, isConsumable: false });
          console.log('[IAP] LISTENER: Transaction finished');
        }
      } catch (e: any) {
        console.error('[IAP] LISTENER: finishTransaction error:', e?.message);
      }
      onSuccess(purchase.productId);
    });
  } else {
    console.warn('[IAP] purchaseUpdatedListener NOT available');
    logIAPDiagnostics();
  }

  if (typeof RNIap.purchaseErrorListener === 'function') {
    errorSub = RNIap.purchaseErrorListener((error: any) => {
      if (error?.code !== 'E_USER_CANCELLED') {
        console.error('[IAP] LISTENER Error:', error?.message, error?.code);
        onError(error?.message || 'Purchase failed');
      }
    });
  }

  return () => {
    updateSub?.remove?.();
    errorSub?.remove?.();
  };
};
