"use client";

import { useState, useEffect } from "react";

interface Listing {
  id: string;
  title: string;
  dailyRate: number;
  ratingAvg: number;
  ratingCount: number;
  photos: string;
  locationText: string;
  distance?: number | null;
  hasInsurance?: boolean;
  isInDemand?: boolean;
  instantBook?: boolean;
}

// Mock data for listings with real stock images
const mockListings: Listing[] = [
  {
    id: "mock-1",
    title: "מצלמה מקצועית Canon",
    dailyRate: 120,
    ratingAvg: 4.8,
    ratingCount: 24,
    photos: JSON.stringify(["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop"]),
    locationText: "תל אביב",
    distance: 2.5,
    hasInsurance: true,
    isInDemand: true,
    instantBook: true,
  },
  {
    id: "mock-2",
    title: "מקדחה חשמלית Bosch",
    dailyRate: 45,
    ratingAvg: 4.6,
    ratingCount: 18,
    photos: JSON.stringify(["https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop"]),
    locationText: "רמת גן",
    distance: 5.2,
    hasInsurance: false,
    isInDemand: false,
    instantBook: true,
  },
  {
    id: "mock-3",
    title: "רחפן DJI Mavic",
    dailyRate: 250,
    ratingAvg: 4.9,
    ratingCount: 32,
    photos: JSON.stringify(["https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop"]),
    locationText: "הרצליה",
    distance: 8.1,
    hasInsurance: true,
    isInDemand: true,
    instantBook: false,
  },
  {
    id: "mock-4",
    title: "סולם מתקפל 3 מטר",
    dailyRate: 35,
    ratingAvg: 4.5,
    ratingCount: 12,
    photos: JSON.stringify(["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop"]),
    locationText: "רמת אביב",
    distance: 3.8,
    hasInsurance: false,
    isInDemand: false,
    instantBook: true,
  },
  {
    id: "mock-5",
    title: "מצלמת גו-פרו למים",
    dailyRate: 80,
    ratingAvg: 4.7,
    ratingCount: 21,
    photos: JSON.stringify(["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop"]),
    locationText: "חיפה",
    distance: 12.5,
    hasInsurance: true,
    isInDemand: false,
    instantBook: true,
  },
  {
    id: "mock-6",
    title: "מחבט טניס מקצועי",
    dailyRate: 30,
    ratingAvg: 4.4,
    ratingCount: 8,
    photos: JSON.stringify(["https://images.unsplash.com/photo-1622279457484736-62e2f6f3a1b4?w=800&h=600&fit=crop"]),
    locationText: "רעננה",
    distance: 15.3,
    hasInsurance: false,
    isInDemand: false,
    instantBook: true,
  },
];

export function useNearbyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief loading state for better UX
    const timer = setTimeout(() => {
      setListings(mockListings);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return { listings, loading };
}

