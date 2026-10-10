/**
 * Voxel Mumbai - Bundled Offline GeoJSON Datasets for Presets
 * Provides instantaneous, reliable offline map data representing accurate
 * coastlines, buildings, roads, tetrapods, and rails for all preset areas.
 */

export const BUNDLED_PRESET_DATA = {
  marine_drive: {
    type: 'FeatureCollection',
    features: [
      // 1. Arabian Sea & Coastline (Western curved bay - Queen's Necklace)
      {
        type: 'Feature',
        properties: { natural: 'coastline' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8180, 18.9320],
            [72.8205, 18.9290],
            [72.8218, 18.9265],
            [72.8222, 18.9240],
            [72.8230, 18.9215],
            [72.8245, 18.9190]
          ]
        }
      },
      // 2. Tetrapod Breakwater Barrier
      {
        type: 'Feature',
        properties: { man_made: 'breakwater', description: 'Marine Drive Tetrapods' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8183, 18.9320],
            [72.8208, 18.9290],
            [72.8221, 18.9265],
            [72.8225, 18.9240],
            [72.8233, 18.9215],
            [72.8248, 18.9190]
          ]
        }
      },
      // 3. Marine Drive Promenade (Paving)
      {
        type: 'Feature',
        properties: { highway: 'footway', name: 'Marine Drive Promenade', width: 8 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8186, 18.9320],
            [72.8211, 18.9290],
            [72.8224, 18.9265],
            [72.8228, 18.9240],
            [72.8236, 18.9215],
            [72.8251, 18.9190]
          ]
        }
      },
      // 4. Netaji Subhash Chandra Bose Road (6-lane highway)
      {
        type: 'Feature',
        properties: {
          highway: 'primary',
          name: 'Netaji Subhash Chandra Bose Road (Marine Drive)',
          lanes: 6,
          width: 18
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8190, 18.9320],
            [72.8215, 18.9290],
            [72.8228, 18.9265],
            [72.8232, 18.9240],
            [72.8240, 18.9215],
            [72.8255, 18.9190]
          ]
        }
      },
      // Cross streets into Churchgate & Nariman Point
      {
        type: 'Feature',
        properties: { highway: 'secondary', name: 'Veer Nariman Road', width: 12 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8228, 18.9265],
            [72.8280, 18.9275]
          ]
        }
      },
      {
        type: 'Feature',
        properties: { highway: 'secondary', name: 'Madam Cama Road', width: 12 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8240, 18.9215],
            [72.8290, 18.9220]
          ]
        }
      },
      // 5. Historic Art Deco Residential Buildings lining Marine Drive
      {
        type: 'Feature',
        properties: {
          building: 'apartments',
          name: 'Empress Court',
          height: 22,
          'building:levels': 7,
          'building:material': 'whitewash_art_deco',
          'roof:shape': 'flat'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8235, 18.9272],
            [72.8242, 18.9273],
            [72.8243, 18.9268],
            [72.8236, 18.9267],
            [72.8235, 18.9272]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          building: 'apartments',
          name: 'Soona Mahal',
          height: 24,
          'building:levels': 7,
          'building:material': 'whitewash_art_deco',
          'roof:shape': 'flat'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8237, 18.9265],
            [72.8244, 18.9266],
            [72.8245, 18.9260],
            [72.8238, 18.9259],
            [72.8237, 18.9265]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          building: 'apartments',
          name: 'Keval Mahal',
          height: 22,
          'building:levels': 7,
          'building:material': 'whitewash_art_deco',
          'roof:shape': 'flat'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8239, 18.9257],
            [72.8246, 18.9258],
            [72.8247, 18.9252],
            [72.8240, 18.9251],
            [72.8239, 18.9257]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          building: 'commercial',
          name: 'Air India Building (Nariman Point)',
          height: 82,
          'building:levels': 23,
          'building:material': 'glass',
          'roof:shape': 'flat'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8248, 18.9225],
            [72.8260, 18.9227],
            [72.8262, 18.9218],
            [72.8250, 18.9216],
            [72.8248, 18.9225]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          building: 'hotel',
          name: 'The Oberoi & Trident Towers',
          height: 95,
          'building:levels': 28,
          'building:material': 'glass',
          'roof:shape': 'flat'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8245, 18.9212],
            [72.8258, 18.9214],
            [72.8260, 18.9202],
            [72.8247, 18.9200],
            [72.8245, 18.9212]
          ]]
        }
      },
      {
        type: 'Feature',
        properties: {
          building: 'stadium',
          name: 'Wankhede Stadium',
          height: 32,
          'building:levels': 5,
          'building:material': 'concrete_rough',
          'roof:shape': 'flat'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8252, 18.9300],
            [72.8275, 18.9303],
            [72.8278, 18.9280],
            [72.8255, 18.9277],
            [72.8252, 18.9300]
          ]]
        }
      },
      // Churchgate Railway Station and Rail lines
      {
        type: 'Feature',
        properties: { railway: 'rail', name: 'Western Railway Suburban Line' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8272, 18.9350],
            [72.8270, 18.9320],
            [72.8268, 18.9295]
          ]
        }
      },
      {
        type: 'Feature',
        properties: { railway: 'station', name: 'Churchgate Station' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8264, 18.9325],
            [72.8275, 18.9326],
            [72.8276, 18.9295],
            [72.8265, 18.9294],
            [72.8264, 18.9325]
          ]]
        }
      },
      // Oval Maidan Park
      {
        type: 'Feature',
        properties: { leisure: 'park', name: 'Oval Maidan' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8278, 18.9310],
            [72.8295, 18.9312],
            [72.8298, 18.9260],
            [72.8281, 18.9258],
            [72.8278, 18.9310]
          ]]
        }
      }
    ]
  },

  gateway_india: {
    type: 'FeatureCollection',
    features: [
      // Coastline on the East
      {
        type: 'Feature',
        properties: { natural: 'coastline' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8360, 18.9250],
            [72.8355, 18.9230],
            [72.8352, 18.9215],
            [72.8350, 18.9190]
          ]
        }
      },
      // Gateway of India Monument
      {
        type: 'Feature',
        properties: {
          historic: 'monument',
          name: 'Gateway of India',
          height: 26,
          'building:material': 'gothic_sandstone',
          landmark: 'gateway_of_india'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8344, 18.9222],
            [72.8350, 18.9222],
            [72.8350, 18.9218],
            [72.8344, 18.9218],
            [72.8344, 18.9222]
          ]]
        }
      },
      // Taj Mahal Palace Hotel
      {
        type: 'Feature',
        properties: {
          building: 'hotel',
          name: 'Taj Mahal Palace Hotel',
          height: 48,
          'building:levels': 12,
          'building:material': 'gothic_sandstone',
          'roof:shape': 'dome'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8330, 18.9225],
            [72.8340, 18.9226],
            [72.8342, 18.9212],
            [72.8332, 18.9211],
            [72.8330, 18.9225]
          ]]
        }
      },
      // Shivaji Maharaj Marg
      {
        type: 'Feature',
        properties: { highway: 'primary', name: 'Chhatrapati Shivaji Maharaj Marg', width: 14 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8335, 18.9250],
            [72.8336, 18.9220],
            [72.8338, 18.9190]
          ]
        }
      }
    ]
  },

  csmt_fort: {
    type: 'FeatureCollection',
    features: [
      // CSMT Grand Gothic Terminus
      {
        type: 'Feature',
        properties: {
          building: 'train_station',
          name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
          height: 44,
          'building:levels': 8,
          'building:material': 'gothic_sandstone',
          'roof:shape': 'dome',
          landmark: 'csmt'
        },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [72.8348, 18.9412],
            [72.8362, 18.9414],
            [72.8365, 18.9392],
            [72.8351, 18.9390],
            [72.8348, 18.9412]
          ]]
        }
      },
      // Rail tracks heading north
      {
        type: 'Feature',
        properties: { railway: 'rail', name: 'Central Railway Main Line' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8358, 18.9414],
            [72.8360, 18.9450]
          ]
        }
      },
      // Dr. Dadabhai Naoroji Road (Heritage corridor)
      {
        type: 'Feature',
        properties: { highway: 'primary', name: 'Dr. Dadabhai Naoroji Road', width: 16 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8344, 18.9430],
            [72.8346, 18.9400],
            [72.8340, 18.9370]
          ]
        }
      }
    ]
  }
};
