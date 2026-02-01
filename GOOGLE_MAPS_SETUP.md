# Google Maps Setup Guide for SalonEase

## Overview
The MapScreen now uses real Google Maps with live data from your backend database. This guide explains how to set up Google Maps API and configure the app.

## Prerequisites
1. Google Cloud Platform account
2. Google Maps API key
3. Backend running with salon location data

## Setup Steps

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (optional, for enhanced search)
4. Create credentials (API Key)
5. Restrict the API key to your app's bundle ID/package name

### 2. Configure API Key

Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` in `app.json` with your actual API key:

```json
{
  "expo": {
    "ios": {
      "config": {
        "googleMapsApiKey": "AIzaSyC4R6AN7SmRp85JjGR6cJLBw0rz_maQGOo"
      }
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyC4R6AN7SmRp85JjGR6cJLBw0rz_maQGOo"
        }
      }
    }
  }
}
```

### 3. Install Dependencies

Run in your frontend directory:
```bash
npm install react-native-maps@1.18.0
```

### 4. Backend Data Requirements

Ensure your salon documents in MongoDB have location data:

```javascript
{
  "_id": "salon_id",
  "name": "Beauty Salon",
  "address": "123 Main St, City",
  "location": {
    "latitude": -1.9441,
    "longitude": 30.0619
  },
  "images": ["image_url"],
  "rating": 4.5
}
```

### 5. Add Location Data to Existing Salons

If your salons don't have location data, you can add it via your backend:

```javascript
// Example: Add location to salon
db.salons.updateOne(
  { _id: ObjectId("salon_id") },
  {
    $set: {
      location: {
        latitude: -1.9441,
        longitude: 30.0619
      }
    }
  }
)
```

## Features Implemented

### Real-Time Map Integration
- **Google Maps**: Uses real Google Maps with satellite/street view
- **Live Location**: Shows user's actual GPS location
- **Dynamic Markers**: Salon markers from database with real coordinates
- **Interactive**: Tap markers to select salons

### Backend Integration
- **Real Data**: Loads salons from your MongoDB database
- **Location Sync**: User location synced with backend
- **Search**: Real-time search through salon database
- **Distance Calculation**: Actual distances between user and salons

### Location Features
- **GPS Permission**: Requests and handles location permissions
- **Auto-Center**: Centers map on user location
- **Nearest Salons**: Shows salons within specified radius
- **Location Updates**: Updates user location in database

### Dynamic Data Flow
1. **User Location**: Gets GPS → Saves locally → Syncs with backend
2. **Salon Loading**: Queries backend → Filters by location → Shows on map
3. **Search**: User searches → Queries backend → Updates map markers
4. **Selection**: User taps marker → Shows salon details → Can book

## API Endpoints Used

- `GET /location/nearest?lat=X&lng=Y&radius=Z` - Get nearby salons
- `GET /salons/search?q=query` - Search salons
- `PUT /location/update` - Update user location
- `GET /salons` - Get all salons (fallback)

## Testing

1. **Location Permission**: Test on device (not simulator for GPS)
2. **Map Loading**: Verify Google Maps loads correctly
3. **Salon Markers**: Check salons appear as markers
4. **Search**: Test search functionality
5. **Selection**: Verify salon selection works

## Troubleshooting

### Common Issues

1. **Map not loading**: Check API key configuration
2. **No markers**: Verify salon location data in database
3. **Location permission denied**: Handle gracefully, show all salons
4. **Search not working**: Check backend search endpoint

### Debug Steps

1. Check console logs for API errors
2. Verify backend is running and accessible
3. Test API endpoints directly
4. Check location permissions in device settings

## Production Considerations

1. **API Key Security**: Restrict API key to your app bundle
2. **Rate Limiting**: Monitor Google Maps API usage
3. **Offline Handling**: Cache salon data for offline use
4. **Performance**: Limit number of markers shown simultaneously

## Next Steps

1. Add clustering for many markers
2. Implement route directions
3. Add traffic layer
4. Integrate with booking system
5. Add salon photos in map callouts

The map now provides a complete real-time experience with your backend data!