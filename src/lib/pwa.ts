export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstallable = false;
  private installCallbacks: Array<(canInstall: boolean) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.isInstallable = true;
      this.notifyInstallCallbacks();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isInstallable = false;
      this.notifyInstallCallbacks();
    });

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstallable = false;
    }
  }

  private notifyInstallCallbacks() {
    this.installCallbacks.forEach(callback => callback(this.isInstallable));
  }

  public onInstallabilityChange(callback: (canInstall: boolean) => void) {
    this.installCallbacks.push(callback);
    // Immediately call with current state
    callback(this.isInstallable);
    
    // Return unsubscribe function
    return () => {
      const index = this.installCallbacks.indexOf(callback);
      if (index > -1) {
        this.installCallbacks.splice(index, 1);
      }
    };
  }

  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        this.deferredPrompt = null;
        this.isInstallable = false;
        this.notifyInstallCallbacks();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during app installation:', error);
      return false;
    }
  }

  public get canInstall(): boolean {
    return this.isInstallable;
  }

  public get isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }
}

export const pwaManager = new PWAManager();

// Service Worker registration
export async function registerServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, prompt user to refresh
              if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// Utility functions for PWA
export function isRunningStandalone(): boolean {
  return pwaManager.isStandalone;
}

export function canInstallPWA(): boolean {
  return pwaManager.canInstall;
}

export async function installPWA(): Promise<boolean> {
  return pwaManager.promptInstall();
}
