import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type { Layer } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./HongKongChoropleth.css";

interface DistrictDonationData {
  district_code: string;
  district_name: string;
  total_donations: number;
  donation_count: number;
  unique_donors: number;
  average_donation: number;
  lives_impacted: number;
  color: string;
  opacity: number;
}

export function HongKongChoropleth() {
  const [districtData, setDistrictData] = useState<DistrictDonationData[]>([]);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.GeoJsonObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Colour allocation based on donations distribution
  const getDynamicChoroplethStyle = (totalDonations: number, allDonations: number[]) => {
    if (totalDonations === 0) {
      return { color: '#dc2626', opacity: 0.8 }; // Red for districts with 0 donations
    }
    
    // Get all districts with donations > 0
    const districtsWithDonations = allDonations.filter(d => d > 0);
    
    // If all districts have donations, sort and color bottom 5 as red
    if (districtsWithDonations.length === allDonations.length) {
      const sortedDonations = [...districtsWithDonations].sort((a, b) => a - b);
      const bottom5Threshold = sortedDonations[Math.min(4, sortedDonations.length - 1)]; // 5th lowest or last if < 5
      
      if (totalDonations <= bottom5Threshold) {
        return { color: '#dc2626', opacity: 0.8 }; // Red for bottom 5 districts
      } else {
        return { color: '#059669', opacity: 0.9 }; // Green for top districts
      }
    } else {
      // Some districts have 0 donations - color non-zero donations as green
      if (totalDonations > 0) {
        return { color: '#059669', opacity: 0.9 }; // Green for districts with donations
      } else {
        return { color: '#dc2626', opacity: 0.8 }; // Red for districts with 0 donations
      }
    }
  };

  // Generate dynamic legend based on current data
  const generateDynamicLegend = (districts: DistrictDonationData[]) => {
    if (districts.length === 0) return [];
    
    const districtsWithDonations = districts.filter(d => d.total_donations > 0);
    const districtsWithoutDonations = districts.filter(d => d.total_donations === 0);
    
    if (districtsWithDonations.length === 0) {
      return [{ color: '#dc2626', label: 'No Donations', threshold: 0 }];
    }
    
    // If all districts have donations, show bottom 5 vs top
    if (districtsWithoutDonations.length === 0) {
      const sortedDonations = districtsWithDonations.map(d => d.total_donations).sort((a, b) => a - b);
      const bottom5Threshold = sortedDonations[Math.min(4, sortedDonations.length - 1)];
      
      return [
        { color: '#059669', label: 'Top Districts', threshold: bottom5Threshold },
        { color: '#dc2626', label: 'Bottom 5 Districts', threshold: bottom5Threshold }
      ];
    } else {
      // Some districts have 0 donations
      return [
        { color: '#059669', label: 'Has Donations', threshold: 0 },
        { color: '#dc2626', label: 'No Donations', threshold: 0 }
      ];
    }
  };

  // Create district data with real donations from Supabase database
  const createDistrictData = useCallback(async (): Promise<DistrictDonationData[]> => {
    try {
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select(`
          id,
          amount,
          region_id,
          donor_name,
          created_at,
          lives_impacted
        `);
      
      if (donationsError) {
        console.error('Error fetching donations:', donationsError);
        throw donationsError;
      }
      
      // Get regions with names
      const { data: regions, error: regionsError } = await supabase
        .from('regions')
        .select('id, name');
      
      if (regionsError) {
        console.error('Error fetching regions:', regionsError);
        throw regionsError;
      }
      
      // Create mapping from region_id to region name, then to district_code
      const regionToDistrictMap = new Map();
      regions?.forEach(region => {
        // Map region names to district codes based on common naming patterns
        const districtCode = getDistrictCodeFromRegionName(region.name);
        if (districtCode) {
          regionToDistrictMap.set(region.id, districtCode);
        }
      });
      
      // Aggregate donations by district
      type DistrictAggregation = {
        total_amount: number;
        donation_count: number;
        unique_donors: Set<string>;
        lives_impacted: number;
      };
      
      const districtDonations = new Map<string, DistrictAggregation>();
      
      // Initialize all districts with zero values
      // We'll get the actual districts from the GeoJSON data
      const districtCodes = ['CW', 'EA', 'SO', 'WC', 'SS', 'KC', 'KT', 'WT', 'YT', 'KI', 'TW', 'TM', 'YL', 'NO', 'TP', 'ST', 'SK', 'IS'];
      districtCodes.forEach(districtCode => {
        districtDonations.set(districtCode, {
          total_amount: 0,
          donation_count: 0,
          unique_donors: new Set(),
          lives_impacted: 0
        });
      });
      
      // Process each donation by mapping region_id to district_code
      donations?.forEach(donation => {
        const districtCode = regionToDistrictMap.get(donation.region_id);
        if (districtCode && districtDonations.has(districtCode)) {
          const districtData = districtDonations.get(districtCode)!;
          districtData.total_amount += donation.amount;
          districtData.donation_count += 1;
          districtData.unique_donors.add(donation.donor_name);
          districtData.lives_impacted += donation.lives_impacted;
        }
      });
      
      // Convert to DistrictDonationData format
      const result = districtCodes.map(districtCode => {
        const data = districtDonations.get(districtCode)!;
        const uniqueDonorsCount = data.unique_donors.size;
        
        return {
          district_code: districtCode,
          district_name: getDistrictName(districtCode),
          total_donations: data.total_amount,
          donation_count: data.donation_count,
          unique_donors: uniqueDonorsCount,
          average_donation: data.donation_count > 0 ? (data.total_amount) / data.donation_count : 0,
          lives_impacted: data.lives_impacted,
          color: '#e5e7eb',
          opacity: 0.6
        };
      });
      
      return result;
      
    } catch (error) {
      console.error('Error creating district data:', error);
      throw error;
    }
  }, []);

  // Helper function to get district code from region name
  const getDistrictCodeFromRegionName = (regionName: string): string | null => {
    if (!regionName) return null;
    
    const name = regionName.toLowerCase();
    
    // Map common region names to district codes
    if (name.includes('central') || name.includes('western')) return 'CW';
    if (name.includes('eastern')) return 'EA';
    if (name.includes('southern')) return 'SO';
    if (name.includes('wan chai') || name.includes('wanchai')) return 'WC';
    if (name.includes('sham shui po') || name.includes('shamshuipo')) return 'SS';
    if (name.includes('kowloon city') || name.includes('kowlooncity')) return 'KC';
    if (name.includes('kwun tong') || name.includes('kwuntong')) return 'KT';
    if (name.includes('wong tai sin') || name.includes('wongtaisin')) return 'WT';
    if (name.includes('yau tsim mong') || name.includes('yautsimong')) return 'YT';
    if (name.includes('tsuen wan') || name.includes('tsuenwan')) return 'TW';
    if (name.includes('sha tin') || name.includes('shatin')) return 'ST';
    if (name.includes('tuen mun') || name.includes('tuenmun')) return 'TM';
    if (name.includes('yuen long') || name.includes('yuenlong')) return 'YL';
    if (name.includes('tai po') || name.includes('taipo')) return 'TP';
    if (name.includes('sai kung') || name.includes('saikung')) return 'SK';
    if (name.includes('kwai tsing') || name.includes('kwaitsing')) return 'KI';
    if (name.includes('north')) return 'NO';
    if (name.includes('islands')) return 'IS';
    
    return null;
  };

  // Helper function to get district name from code
  const getDistrictName = (code: string): string => {
    const districtNames: { [key: string]: string } = {
      'CW': 'Central and Western',
      'EA': 'Eastern',
      'SO': 'Southern', 
      'WC': 'Wan Chai',
      'SS': 'Sham Shui Po',
      'KC': 'Kowloon City',
      'KT': 'Kwun Tong',
      'WT': 'Wong Tai Sin',
      'YT': 'Yau Tsim Mong',
      'TW': 'Tsuen Wan',
      'ST': 'Sha Tin',
      'TM': 'Tuen Mun',
      'YL': 'Yuen Long',
      'TP': 'Tai Po',
      'SK': 'Sai Kung',
      'KI': 'Kwai Tsing',
      'NO': 'North',
      'IS': 'Islands'
    };
    return districtNames[code] || code;
  };

  // Load GeoJSON data
  const loadGeoJSON = useCallback(async () => {
    try {
      const response = await fetch('/hong-kong-districts.geojson');
      if (response.ok) {
        const data = await response.json();
        setGeoJsonData(data);
        return;
      }
      
      throw new Error('Failed to load GeoJSON data from /hong-kong-districts.geojson');
      
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
      setError('Failed to load map data');
    }
  }, []);

  // Fetch donation data and create district-level data
  const fetchDonationData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real district data from Supabase database
      const sampleDistrictData = await createDistrictData();
      
      // Get all donation amounts for dynamic coloring
      const allDonationAmounts = sampleDistrictData.map(d => d.total_donations);
      
      // Apply dynamic colors based on actual data distribution
      const dataWithColors = sampleDistrictData.map(data => {
        const { color, opacity } = getDynamicChoroplethStyle(data.total_donations, allDonationAmounts);
        return {
          ...data,
          color,
          opacity
        };
      });
      
      setDistrictData(dataWithColors);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error('Error creating district data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [createDistrictData]);

  // Helper function to get district info
  const getDistrictInfo = (districtCode: string): DistrictDonationData | undefined => {
    return districtData.find(d => d.district_code === districtCode);
  };

  // Applies district-level colors
  const getFeatureStyle = (feature: Feature<Geometry, Record<string, unknown>>) => {
    // Check what properties are available - convert DCCA2011_I to string
    const districtCode = String(feature.properties.DCCA2011_I || 
                         feature.properties.DCCA2011 || 
                         feature.properties.district_code || 
                         feature.properties.code || 
                         feature.properties.id ||
                         'UNKNOWN');
    
    // Find the specific district
    const districtInfo = districtData.find(d => d.district_code === districtCode);
    
    // Apply the dynamic coloring
    if (districtInfo) {
      const allDonations = districtData.map(d => d.total_donations);
      const { color, opacity } = getDynamicChoroplethStyle(districtInfo.total_donations, allDonations);
      
      return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: opacity
      };
    }
    
    // Fallback for unknown districts
    return {
      fillColor: '#e5e7eb', // Light grey
      weight: 1,
      opacity: 1,
      color: '#9ca3af', // Medium grey border
      fillOpacity: 0.6
    };
  };

    // Event handlers for each feature
  const onEachFeature = (feature: Feature<Geometry, Record<string, unknown>>, layer: Layer) => {
    // Check what properties are available - convert DCCA2011_I to string
    const districtCode = String(feature.properties.DCCA2011_I || 
                         feature.properties.DCCA2011 || 
                         feature.properties.district_code || 
                         feature.properties.code || 
                         feature.properties.id ||
                         'UNKNOWN');
    
    // Find the specific district data
    const districtInfo = districtData.find(d => d.district_code === districtCode);
    
    // Apply styling using the custom style function
    const style = getFeatureStyle(feature);
    (layer as any).setStyle(style);
    
    // Force a style update to ensure colors are applied
    setTimeout(() => {
      (layer as any).setStyle(style);
    }, 100);
    
    // Bind tooltip with district-specific information
    (layer as any).bindTooltip(`
      <div class="p-2">
        <strong>${districtInfo?.district_name || feature?.properties?.name || 'District'}</strong><br/>
        District Code: ${districtCode}<br/>
        ${districtInfo ? `
          District Donations: $${districtInfo.total_donations.toLocaleString()}<br/>
          Donation Count: ${districtInfo.donation_count}<br/>
          Status: ${districtInfo.total_donations > 0 ? 'Has Donations' : 'No donations'}
        ` : 'No donation data'}
      </div>
    `, { permanent: false, direction: 'top' });
    
    // Add event handlers
    (layer as any).on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.9
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        // Reset to original style
        layer.setStyle(getFeatureStyle(feature));
      }
    });
  };

  // Refresh data
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDonationData();
    setRefreshing(false);
  }, [fetchDonationData]);

  useEffect(() => {
    loadGeoJSON();
    fetchDonationData();
  }, [loadGeoJSON, fetchDonationData]);

  // Auto-refresh - updates every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDonationData();
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [fetchDonationData]);



  if (loading) {
    return (
      <Card className="w-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Hong Kong Donation Intensity Choropleth</h2>
          </div>
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </Card>
    );
  }

  // Dynamic legend based on current district data
  const dynamicLegend = generateDynamicLegend(districtData);

  return (
    <div className="hong-kong-choropleth">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Hong Kong Regional Donation Impact</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}

      {loading && !geoJsonData && (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="text-gray-500">Loading Hong Kong map data...</div>
        </div>
      )}

      {geoJsonData && (
        <div className="relative">
          <MapContainer
            center={[22.3193, 114.1694]}
            zoom={10}
            className="h-96 w-full rounded-lg border"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ZoomControl position="bottomright" />
            <GeoJSON
              key={`geojson-${lastUpdated.getTime()}-${districtData.length}`}
              data={geoJsonData}
              style={(feature) => {
                return getFeatureStyle(feature);
              }}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        </div>
      )}

      {/* Dynamic Legend */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Donation Status by District</h4>
        <div className="space-y-2">
          {dynamicLegend.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Red: Districts with no donations or bottom 5 performers. Green: Districts with donations or top performers.
            Auto-refreshes every 5 minutes.
          </p>
        </div>
      </div>

      {/* Data Summary */}
      {districtData.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Current District Data</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {districtData.filter(d => d.total_donations > 0).map((district) => (
              <motion.div
                key={district.district_code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-l-4" style={{ borderLeftColor: district.color }}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" style={{ color: district.color }} />
                      <span className="text-sm font-medium">{district.district_name}</span>
                    </div>
                    <p className="text-2xl font-bold mb-1">
                      ${district.total_donations.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">Total Donations</p>
                    <div className="flex justify-between text-xs">
                      <span>Donations: {district.donation_count}</span>
                      <span>Avg: ${district.average_donation.toFixed(0)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
