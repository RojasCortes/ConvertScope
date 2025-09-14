# Google AdSense Setup Guide

## Overview

ConvertScope now includes a production-ready Google AdSense integration for web advertising. The implementation includes intelligent fallbacks, proper error handling, and compliance-ready infrastructure.

## Environment Variables Required

### For Web AdSense (Required for web advertising)

Add these environment variables to your Replit Secrets or production environment:

```
VITE_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
VITE_ADSENSE_SLOT_BANNER=1234567890
VITE_ADSENSE_SLOT_RECTANGLE=9876543210
```

### For Mobile AdMob (Optional - for future mobile app)

```
VITE_ADMOB_APP_ID_ANDROID=ca-app-pub-1234567890123456~1234567890
VITE_ADMOB_BANNER_ID_ANDROID=ca-app-pub-1234567890123456/1234567890
VITE_ADMOB_INTERSTITIAL_ID_ANDROID=ca-app-pub-1234567890123456/0987654321
VITE_ADMOB_REWARD_ID_ANDROID=ca-app-pub-1234567890123456/5432109876
```

## How to Get Google AdSense IDs

### 1. Create Google AdSense Account
- Visit https://www.google.com/adsense/
- Apply for AdSense account with your website
- Complete the verification process

### 2. Get Client ID
- Your client ID format: `ca-pub-XXXXXXXXXXXXXXXX`
- Found in AdSense dashboard under Account > Settings

### 3. Create Ad Slots
- Go to Ads > Ad units in AdSense dashboard
- Create new ad units:
  - **Banner**: Responsive display ad for header/footer
  - **Rectangle**: Square ad for content areas
- Copy the numeric slot IDs (not the full HTML code)

## Ad Placement Locations

The application strategically places ads on:
- **Home page**: Banner and rectangle ads
- **Currency converter**: Banner ads
- **Category converter**: Banner ads

## Current Status

✅ **Working Features:**
- Automatic AdSense script loading
- Intelligent placeholder system when not configured
- Proper Google-compliant ad formats (`data-ad-format="auto"`)
- Error handling and graceful fallbacks
- Production-ready integration

✅ **Compliance Ready:**
- Legal pages (About, Contact, Privacy, Terms)
- SEO-compliant robots.txt and sitemap.xml
- Bilingual content support

⚠️ **Future Enhancement Needed:**
- **CMP (Consent Management Platform)**: Required for EEA/GDPR compliance
  - Consider implementing IAB TCF v2.0 compatible solution
  - Block ads until user consent is obtained

## Testing the Integration

### Without Configuration (Default State)
- Ads show placeholder messages: "📱 Espacio publicitario"
- Console shows: "🔧 AdSense no configurado - usando placeholders"

### With Configuration
- Real Google ads will load and display
- AdSense script loads automatically
- No console errors should appear

## Production Deployment

1. **Add environment variables** to your hosting platform
2. **Apply for AdSense approval** with your live website
3. **Monitor performance** in Google AdSense dashboard
4. **Consider implementing CMP** for global compliance

## Troubleshooting

### Ads Not Showing
- Verify environment variables are set correctly
- Check browser console for JavaScript errors
- Confirm AdSense account is approved and active

### AdSense Policy Compliance
- Ensure all legal pages are accessible
- Verify privacy policy mentions Google AdSense
- Follow Google AdSense content policies

## Technical Implementation Details

- **Centralized loading**: Single AdSense script per page
- **Component-based**: Reusable AdSenseBanner and AdSenseRectangle components
- **Type-safe**: Full TypeScript integration
- **Performance optimized**: No duplicate script loading
- **Mobile-ready**: Prepared for Capacitor AdMob integration

The implementation is production-ready and follows Google AdSense best practices.