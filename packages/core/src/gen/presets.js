/**
 * Voxel Mumbai - 10 Curated Location Presets
 * Each preset defines geographic coordinates, boundary radius, camera spawn point,
 * district architectural style, and authentic Mumbai trivia.
 */

export const PRESETS = [
  {
    id: 'marine_drive',
    name: 'Marine Drive & Nariman Point',
    nameHi: 'मरीन ड्राइव और नरीमन पॉइंट',
    nameMr: 'मरीन ड्राईव्ह आणि नरिमन पॉइंट',
    subtitle: "The Queen's Necklace & Art Deco Promenade",
    lat: 18.9265,
    lon: 72.8228,
    radius: 650,
    spawn: { x: 30, y: 35, z: 20, yaw: -1.75, pitch: -0.15 },
    districtStyle: 'art_deco',
    waterSide: 'west',
    fact: "Marine Drive has the world's second largest cluster of Art Deco buildings after Miami, recognized as a UNESCO World Heritage site."
  },
  {
    id: 'gateway_india',
    name: 'Gateway of India & Colaba',
    nameHi: 'गेटवे ऑफ इंडिया और कोलाबा',
    nameMr: 'गेटवे ऑफ इंडिया आणि कुलाबा',
    subtitle: 'Colonial Arch & Arabian Harbor',
    lat: 18.9220,
    lon: 72.8347,
    radius: 600,
    spawn: { x: -20, y: 38, z: 40, yaw: -0.6, pitch: -0.2 },
    districtStyle: 'gothic',
    waterSide: 'east',
    fact: "The Gateway of India was erected to commemorate the landing of King George V in 1911 and served as the ceremonial departure point of British troops in 1948."
  },
  {
    id: 'csmt_fort',
    name: 'CSMT & Fort Heritage Precinct',
    nameHi: 'सीएसएमटी और फोर्ट',
    nameMr: 'सीएसएमटी आणि फोर्ट',
    subtitle: 'Victorian Gothic Terminus & Financial District',
    lat: 18.9400,
    lon: 72.8354,
    radius: 550,
    spawn: { x: 0, y: 40, z: 35, yaw: -0.1, pitch: -0.25 },
    districtStyle: 'gothic',
    waterSide: 'none',
    fact: "Chhatrapati Shivaji Maharaj Terminus (CSMT) is an Italian Gothic masterpiece built in 1888 and one of the busiest railway stations in Asia."
  },
  {
    id: 'sea_link_bandra',
    name: 'Bandra-Worli Sea Link & Bandstand',
    nameHi: 'बांद्रा-वर्ली सी लिंक और बैंडस्टैंड',
    nameMr: 'वांद्रे-वरळी सी लिंक आणि बँडस्टँड',
    subtitle: 'Cable-Stayed Engineering & Rocky Coastline',
    lat: 19.0435,
    lon: 72.8198,
    radius: 750,
    spawn: { x: -40, y: 45, z: 30, yaw: -1.3, pitch: -0.2 },
    districtStyle: 'coastal',
    waterSide: 'west',
    fact: "The Bandra-Worli Sea Link has cable steel wire equal to the circumference of the Earth and weighs the equivalent of 50,000 African elephants."
  },
  {
    id: 'dharavi',
    name: 'Dharavi Precinct',
    nameHi: 'धारावी प्रभाग',
    nameMr: 'धारावी प्रभाग',
    subtitle: 'Dense Artisan Workshops & Recycling Hub',
    lat: 19.0423,
    lon: 72.8550,
    radius: 500,
    spawn: { x: 0, y: 32, z: 0, yaw: 0.2, pitch: -0.3 },
    districtStyle: 'chawl',
    waterSide: 'none',
    fact: "Dharavi generates an estimated $1 billion in annual economic output through tens of thousands of leather, pottery, and textile cottage industries."
  },
  {
    id: 'bkc',
    name: 'Bandra Kurla Complex (BKC)',
    nameHi: 'बांद्रा कुर्ला कॉम्प्लेक्स',
    nameMr: 'वांद्रे कुर्ला कॉम्प्लेक्स',
    subtitle: 'Modern Glass Curtain Towers & Financial Hub',
    lat: 19.0662,
    lon: 72.8687,
    radius: 650,
    spawn: { x: -30, y: 55, z: 40, yaw: -0.8, pitch: -0.25 },
    districtStyle: 'glass_towers',
    waterSide: 'none',
    fact: "Built on reclaimed land in the late 1990s, BKC is now Mumbai's premier international corporate hub housing national stock exchanges and embassies."
  },
  {
    id: 'juhu_beach',
    name: 'Juhu Beach & Aerodrome',
    nameHi: 'जुहू बीच और एरोड्रम',
    nameMr: 'जुहू बीच आणि एरोड्रोम',
    subtitle: 'Golden Sand Coast & Street Food Pavilions',
    lat: 19.0988,
    lon: 72.8264,
    radius: 600,
    spawn: { x: 50, y: 32, z: 10, yaw: -1.6, pitch: -0.15 },
    districtStyle: 'coastal',
    waterSide: 'west',
    fact: "Juhu Beach is famous for its vibrant street food kiosks serving Pav Bhaji, Sev Puri, and Bhel Puri alongside the historic 1932 Juhu Aerodrome."
  },
  {
    id: 'powai_lake',
    name: 'Powai Lake & IIT Bombay',
    nameHi: 'पवई झील और आईआईटी बॉम्बे',
    nameMr: 'पवई तलाव आणि आयआयटी बॉम्बे',
    subtitle: 'Freshwater Reservoir & Lush Green Foothills',
    lat: 19.1250,
    lon: 72.9050,
    radius: 700,
    spawn: { x: 0, y: 48, z: 60, yaw: 0.0, pitch: -0.25 },
    districtStyle: 'nature',
    waterSide: 'lake',
    fact: "Powai Lake is an artificial lake built by the British in 1891, nestled against the slopes of Sanjay Gandhi National Park and home to marsh crocodiles."
  },
  {
    id: 'borivali_sgnp',
    name: 'Sanjay Gandhi National Park (Borivali)',
    nameHi: 'संजय गांधी राष्ट्रीय उद्यान',
    nameMr: 'संजय गांधी राष्ट्रीय उद्यान',
    subtitle: 'Wilderness Within City & Ancient Kanheri Caves',
    lat: 19.2288,
    lon: 72.9180,
    radius: 800,
    spawn: { x: 0, y: 52, z: 50, yaw: 0.1, pitch: -0.2 },
    districtStyle: 'nature',
    waterSide: 'none',
    fact: "Sanjay Gandhi National Park is one of the world's only national parks completely surrounded by a major metropolis, housing wild leopards."
  }
];

export function getPresetById(id) {
  return PRESETS.find(p => p.id === id) || PRESETS[0];
}
