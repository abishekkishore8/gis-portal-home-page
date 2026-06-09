import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import shapefile from 'shapefile';
import proj4 from 'proj4';
import * as turf from '@turf/turf';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const mapLayesDir = path.join(rootDir, 'MapLayes');
const publicDir = path.join(rootDir, 'public', 'map-layers');

// Create output directory
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const wgs84Proj = 'WGS84';

const layers = [
  {
    name: 'ganga-basin',
    shp: path.join(mapLayesDir, 'Ganga_Basin.shp'),
    dbf: path.join(mapLayesDir, 'Ganga_Basin.dbf'),
    label: 'Ganga Basin',
    proj: `+proj=lcc +lat_1=12.4729444 +lat_2=35.17280555 +lat_0=24.0 +lon_0=80.0 +x_0=4000000 +y_0=4000000 +datum=WGS84 +units=m +no_defs`
  },
  {
    name: 'ganga-tributaries',
    shp: path.join(mapLayesDir, 'GangaRiver_ALL_Tributaries_Merged_LCC.shp'),
    dbf: path.join(mapLayesDir, 'GangaRiver_ALL_Tributaries_Merged_LCC.dbf'),
    label: 'Ganga Tributaries',
    proj: `+proj=lcc +lat_1=12.47294444444444 +lat_2=35.17280555555556 +lat_0=20.0 +lon_0=82.0 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m +no_defs`
  },
  {
    name: 'india-states',
    shp: path.join(mapLayesDir, 'Updated_india_states.shp'),
    dbf: path.join(mapLayesDir, 'Updated_india_states.dbf'),
    label: 'India States',
    proj: null // Already WGS84
  }
];

// Function to transform coordinates
function transformCoordinates(coord, sourceProj) {
  if (Array.isArray(coord[0])) {
    // Nested array - recurse
    return coord.map(c => transformCoordinates(c, sourceProj));
  } else if (Array.isArray(coord) && coord.length === 2) {
    // [x, y] coordinate pair
    const transformed = proj4(sourceProj, wgs84Proj, coord);
    return [transformed[0], transformed[1]];
  }
  return coord;
}

// Function to transform geometry
function transformGeometry(geometry, sourceProj) {
  if (!geometry || !geometry.coordinates || !sourceProj) return geometry;
  
  return {
    ...geometry,
    coordinates: transformCoordinates(geometry.coordinates, sourceProj)
  };
}

async function convertShapefiles() {
  for (const layer of layers) {
    try {
      console.log(`Converting ${layer.name}...`);
      
      const source = await shapefile.open(layer.shp, layer.dbf);
      const features = [];
      let result;
      
      while (!(result = await source.read()).done) {
        const feature = result.value;
        if (layer.proj) {
          feature.geometry = transformGeometry(feature.geometry, layer.proj);
        }
        features.push(feature);
      }
      
      const geojson = {
        type: 'FeatureCollection',
        features: features
      };
      
      const outputPath = path.join(publicDir, `${layer.name}.geojson`);
      fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
      
      console.log(`✓ Converted ${layer.name} to GeoJSON (${features.length} features)`);
      
      // If this is india-states, also create the unioned india boundary
      if (layer.name === 'india-states') {
        console.log(`Creating unioned India boundary...`);
        // We will try to union all features to create an outline of India
        try {
          // Use turf.union to merge all state polygons
          let unioned = null;
          for (const feature of features) {
            // Ensure the feature is valid and has geometry
            if (feature.geometry) {
                // Ensure polygon coordinates follow the right-hand rule
                const cleanFeature = turf.rewind(feature, {mutate: true});
                if (unioned === null) {
                  unioned = cleanFeature;
                } else {
                  unioned = turf.union(turf.featureCollection([unioned, cleanFeature]));
                }
            }
          }
          
          if (unioned) {
            const indiaBoundaryGeojson = {
              type: 'FeatureCollection',
              features: [unioned]
            };
            const boundaryPath = path.join(publicDir, `india-boundary.geojson`);
            fs.writeFileSync(boundaryPath, JSON.stringify(indiaBoundaryGeojson, null, 2));
            console.log(`✓ Created india-boundary.geojson from state union`);
          }
        } catch (unionError) {
           console.error(`✗ Error unioning india states:`, unionError.message);
        }
      }
    } catch (error) {
      console.error(`✗ Error converting ${layer.name}:`, error.message);
    }
  }
  
  console.log('\nConversion complete!');
}

convertShapefiles();
