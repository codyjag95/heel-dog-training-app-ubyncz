
/**
 * Sentry Helper Utilities
 * Provides safe wrappers for Sentry operations
 */

import * as Sentry from '@sentry/react-native';

/**
 * Safely capture an exception in Sentry
 */
export function captureException(error: Error | unknown, context?: {
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
}): void {
  try {
    console.error('📊 Capturing exception in Sentry:', error);
    
    Sentry.captureException(error, {
      level: context?.level || 'error',
      tags: context?.tags,
      extra: context?.extra,
    });
  } catch (sentryError) {
    console.error('❌ Failed to capture exception in Sentry:', sentryError);
  }
}

/**
 * Safely add a breadcrumb to Sentry
 */
export function addBreadcrumb(breadcrumb: {
  message: string;
  category?: string;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  data?: Record<string, any>;
}): void {
  try {
    Sentry.addBreadcrumb({
      message: breadcrumb.message,
      category: breadcrumb.category || 'app',
      level: breadcrumb.level || 'info',
      data: breadcrumb.data,
      timestamp: Date.now() / 1000,
    });
  } catch (sentryError) {
    console.error('❌ Failed to add breadcrumb to Sentry:', sentryError);
  }
}

/**
 * Safely set user context in Sentry
 */
export function setUser(user: {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}): void {
  try {
    Sentry.setUser(user);
  } catch (sentryError) {
    console.error('❌ Failed to set user in Sentry:', sentryError);
  }
}

/**
 * Safely set a tag in Sentry
 */
export function setTag(key: string, value: string): void {
  try {
    Sentry.setTag(key, value);
  } catch (sentryError) {
    console.error('❌ Failed to set tag in Sentry:', sentryError);
  }
}

/**
 * Safely set context in Sentry
 */
export function setContext(key: string, context: Record<string, any>): void {
  try {
    Sentry.setContext(key, context);
  } catch (sentryError) {
    console.error('❌ Failed to set context in Sentry:', sentryError);
  }
}

/**
 * Capture a message in Sentry
 */
export function captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info'): void {
  try {
    console.log(`📊 Capturing message in Sentry [${level}]:`, message);
    Sentry.captureMessage(message, level);
  } catch (sentryError) {
    console.error('❌ Failed to capture message in Sentry:', sentryError);
  }
}

/**
 * Start a new span for performance monitoring
 * Note: In newer Sentry versions, use startSpan instead of startTransaction
 */
export function startPerformanceSpan(name: string, op: string): any {
  try {
    // Use the newer startSpan API if available, fallback to manual span creation
    if (Sentry.startSpan) {
      return Sentry.startSpan({ name, op }, (span) => span);
    } else {
      // Fallback: create a manual span
      const span = Sentry.getCurrentHub().getScope()?.getTransaction()?.startChild({
        op,
        description: name,
      });
      return span || null;
    }
  } catch (sentryError) {
    console.error('❌ Failed to start performance span in Sentry:', sentryError);
    return null;
  }
}

/**
 * Test Sentry integration by sending a test error
 */
export function testSentry(): void {
  try {
    console.log('🧪 Testing Sentry integration...');
    
    // Add a breadcrumb
    addBreadcrumb({
      message: 'Sentry test initiated',
      category: 'test',
      level: 'info',
    });
    
    // Capture a test message
    captureMessage('Sentry test message', 'info');
    
    // Capture a test error
    const testError = new Error('Sentry test error - this is intentional');
    captureException(testError, {
      tags: { test: 'true' },
      level: 'warning',
    });
    
    console.log('✅ Sentry test completed. Check your Sentry dashboard.');
  } catch (error) {
    console.error('❌ Sentry test failed:', error);
  }
}
