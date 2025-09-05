import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { Circle as LeafletCircle, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// OpenCage API key (for real geocoding):
// const OPENCAGE_API_KEY = '24c40a037e7a47ea882bc3058783262d';

type User = { name: string; coords: [number, number] };

type UsersByProvince = {
  [province: string]: User[];
};

const usersByProvince: UsersByProvince = {
    'Gauteng': [
  { name: 'User 1', coords: [-26.2041, 28.0473] }, // Johannesburg
  { name: 'User 2', coords: [-25.7479, 28.2293] }, // Pretoria
  { name: 'User 3', coords: [-26.2708, 28.1123] }, // East Rand
  { name: 'User 4', coords: [-26.1776, 27.9726] }, // Soweto
  { name: 'User 5', coords: [-25.8656, 29.2241] }, // Bronkhorstspruit
  { name: 'User 6', coords: [-26.1445, 28.0457] }, // Sandton
  { name: 'User 7', coords: [-26.2185, 27.8616] }, // Krugersdorp
  { name: 'User 8', coords: [-26.1628, 28.2293] }, // Edenvale
  { name: 'User 9', coords: [-26.1982, 28.0457] }, // Rosebank
  { name: 'User 10', coords: [-26.3201, 28.1502] }, // Nigel
  { name: 'User 11', coords: [-25.8325, 28.1806] }, // Cullinan
  { name: 'User 12', coords: [-25.8652, 27.9931] }, // Centurion
  { name: 'User 13', coords: [-26.0046, 28.2536] }, // Benoni
  { name: 'User 14', coords: [-26.3803, 27.2871] }, // Carletonville
  { name: 'User 15', coords: [-26.6714, 27.9279] }, // Vanderbijlpark
  { name: 'User 16', coords: [-26.6644, 27.8574] }, // Vereeniging
  { name: 'User 17', coords: [-25.9110, 28.1628] }, // Mamelodi
  { name: 'User 18', coords: [-26.4236, 28.4837] }, // Heidelberg
  { name: 'User 19', coords: [-25.7719, 27.9405] }, // Hartbeespoort
  { name: 'User 20', coords: [-26.3655, 28.1224] }, // Springs
],

     'Western Cape': [
  { name: 'User 1', coords: [-33.9180, 18.4232] }, // Cape Town
  { name: 'User 2', coords: [-34.0362, 18.3502] }, // Muizenberg
  { name: 'User 3', coords: [-33.9289, 18.4174] }, // Cape Town CBD
  { name: 'User 4', coords: [-33.8311, 18.6469] }, // Durbanville
  { name: 'User 5', coords: [-33.9189, 18.4233] }, // Cape Town
  { name: 'User 6', coords: [-33.9183, 18.4231] }, // Sea Point
  { name: 'User 7', coords: [-34.1075, 18.4726] }, // Simon's Town
  { name: 'User 8', coords: [-34.0487, 18.6239] }, // Strand
  { name: 'User 9', coords: [-33.9068, 18.4205] }, // Observatory
  { name: 'User 10', coords: [-34.1688, 22.1310] }, // Mossel Bay
  { name: 'User 11', coords: [-33.8121, 19.8966] }, // Worcester
  { name: 'User 12', coords: [-34.1718, 22.1277] }, // George
  { name: 'User 13', coords: [-33.6487, 19.4401] }, // Ceres
  { name: 'User 14', coords: [-32.9922, 18.0000] }, // Vredendal
  { name: 'User 15', coords: [-32.9818, 18.5126] }, // Lamberts Bay
  { name: 'User 16', coords: [-33.8966, 22.4412] }, // Oudtshoorn
  { name: 'User 17', coords: [-33.8781, 18.6468] }, // Bellville
  { name: 'User 18', coords: [-34.1808, 19.2227] }, // Hermanus
  { name: 'User 19', coords: [-33.6016, 19.4515] }, // Tulbagh
  { name: 'User 20', coords: [-33.2140, 20.1187] }, // Montagu
],

 'KwaZulu-Natal': [
  { name: 'User 1', coords: [-29.8587, 31.0218] }, // Durban
  { name: 'User 2', coords: [-28.7435, 31.8900] }, // Richards Bay
  { name: 'User 3', coords: [-29.6168, 30.3928] }, // Pietermaritzburg
  { name: 'User 4', coords: [-28.5337, 32.0836] }, // Empangeni
  { name: 'User 5', coords: [-29.7784, 30.7958] }, // Hillcrest
  { name: 'User 6', coords: [-28.7834, 30.4332] }, // Ulundi
  { name: 'User 7', coords: [-29.8230, 30.8901] }, // Pinetown
  { name: 'User 8', coords: [-30.0037, 30.6586] }, // Amanzimtoti
  { name: 'User 9', coords: [-29.6922, 30.5811] }, // Howick
  { name: 'User 10', coords: [-29.0215, 31.2547] }, // Port Shepstone
  { name: 'User 11', coords: [-28.7321, 30.4532] }, // Nongoma
  { name: 'User 12', coords: [-29.3860, 30.0947] }, // Greytown
  { name: 'User 13', coords: [-29.1256, 30.5871] }, // Ixopo
  { name: 'User 14', coords: [-29.3523, 31.4058] }, // Umkomaas
  { name: 'User 15', coords: [-28.7452, 31.8950] }, // Empangeni outskirts
  { name: 'User 16', coords: [-27.4297, 32.4245] }, // Kosi Bay
  { name: 'User 17', coords: [-28.2180, 32.0121] }, // Mtubatuba
  { name: 'User 18', coords: [-29.4983, 30.6311] }, // Camperdown
  { name: 'User 19', coords: [-30.1469, 30.4726] }, // Scottburgh
  { name: 'User 20', coords: [-29.3634, 30.1767] }, // Tugela Ferry
],

'Eastern Cape': [
  { name: 'User 1', coords: [-32.2968, 26.4194] }, // Queenstown
  { name: 'User 2', coords: [-33.0153, 27.9116] }, // East London
  { name: 'User 3', coords: [-33.9611, 25.6144] }, // Port Elizabeth
  { name: 'User 4', coords: [-32.9833, 27.8667] }, // King William's Town
  { name: 'User 5', coords: [-32.8684, 27.3976] }, // Butterworth
  { name: 'User 6', coords: [-31.8927, 26.8744] }, // Lady Frere
  { name: 'User 7', coords: [-31.5900, 28.7855] }, // Lusikisiki
  { name: 'User 8', coords: [-31.8958, 29.2763] }, // Port St Johns
  { name: 'User 9', coords: [-31.4333, 27.6833] }, // Elliot
  { name: 'User 10', coords: [-32.1466, 25.6228] }, // Cradock
  { name: 'User 11', coords: [-32.1500, 24.5333] }, // Graaff-Reinet
  { name: 'User 12', coords: [-33.3082, 26.5235] }, // Grahamstown (Makhanda)
  { name: 'User 13', coords: [-33.3077, 27.4891] }, // Port Alfred
  { name: 'User 14', coords: [-32.1818, 24.5355] }, // Aberdeen
  { name: 'User 15', coords: [-33.0000, 26.8000] }, // Alice
  { name: 'User 16', coords: [-32.7560, 27.2256] }, // Idutywa
  { name: 'User 17', coords: [-31.9737, 28.5703] }, // Mthatha
  { name: 'User 18', coords: [-33.6000, 26.8833] }, // Kenton-on-Sea
  { name: 'User 19', coords: [-32.8262, 26.9343] }, // Fort Beaufort
  { name: 'User 20', coords: [-32.0183, 26.3021] }, // Sterkstroom
],

  'Free State': [
  { name: 'User 1', coords: [-28.4541, 26.7968] }, // Welkom
  { name: 'User 2', coords: [-29.0852, 26.1596] }, // Bloemfontein
  { name: 'User 3', coords: [-27.9774, 26.7333] }, // Virginia
  { name: 'User 4', coords: [-28.4096, 27.0836] }, // Odendaalsrus
  { name: 'User 5', coords: [-28.3206, 27.4869] }, // Bothaville
  { name: 'User 6', coords: [-28.2192, 28.2995] }, // Kroonstad
  { name: 'User 7', coords: [-30.0310, 26.3189] }, // Zastron
  { name: 'User 8', coords: [-28.6642, 27.0935] }, // Hoopstad
  { name: 'User 9', coords: [-29.0850, 27.6167] }, // Dewetsdorp
  { name: 'User 10', coords: [-29.0586, 26.4728] }, // Botshabelo
  { name: 'User 11', coords: [-29.2087, 27.4803] }, // Thaba Nchu
  { name: 'User 12', coords: [-28.8326, 26.8806] }, // Theunissen
  { name: 'User 13', coords: [-28.6672, 27.4166] }, // Bultfontein
  { name: 'User 14', coords: [-29.2582, 26.7521] }, // Wepener
  { name: 'User 15', coords: [-28.2315, 26.8577] }, // Hennenman
  { name: 'User 16', coords: [-30.0333, 27.5667] }, // Rouxville
  { name: 'User 17', coords: [-28.3701, 28.0904] }, // Viljoenskroon
  { name: 'User 18', coords: [-29.1683, 27.0883] }, // Excelsior
  { name: 'User 19', coords: [-29.7814, 26.5732] }, // Ladybrand
  { name: 'User 20', coords: [-28.6806, 26.4499] }, // Winburg
],

 'North West': [
  { name: 'User 101', coords: [-25.6702, 27.2416] }, // Mahikeng
  { name: 'User 102', coords: [-25.8597, 25.6419] }, // Rustenburg
  { name: 'User 103', coords: [-26.6639, 25.2986] }, // Zeerust
  { name: 'User 104', coords: [-26.2044, 27.9396] }, // Klerksdorp
  { name: 'User 105', coords: [-25.3848, 26.6486] }, // Brits
  { name: 'User 106', coords: [-26.3123, 26.5211] }, // Potchefstroom
  { name: 'User 107', coords: [-25.7756, 27.0932] }, // Lichtenburg
  { name: 'User 108', coords: [-26.3772, 26.7001] }, // Ventersdorp
  { name: 'User 109', coords: [-25.6701, 26.2043] }, // Swartruggens
  { name: 'User 110', coords: [-26.6501, 26.8672] }, // Orkney
  { name: 'User 111', coords: [-25.9643, 26.2341] },
  { name: 'User 112', coords: [-26.4561, 25.9876] },
  { name: 'User 113', coords: [-26.0887, 27.1992] },
  { name: 'User 114', coords: [-26.2104, 26.7342] },
  { name: 'User 115', coords: [-26.0201, 27.8823] },
  { name: 'User 116', coords: [-25.6890, 27.5321] },
  { name: 'User 117', coords: [-26.7822, 25.9123] },
  { name: 'User 118', coords: [-26.1561, 26.8432] },
  { name: 'User 119', coords: [-26.0654, 27.1553] },
  { name: 'User 120', coords: [-26.2922, 26.9564] },
],

  'Mpumalanga': [
  { name: 'User 121', coords: [-25.4563, 30.9991] }, // Nelspruit
  { name: 'User 122', coords: [-25.0960, 30.4597] }, // White River
  { name: 'User 123', coords: [-26.2485, 30.4663] }, // Ermelo
  { name: 'User 124', coords: [-25.7751, 29.4648] }, // Middelburg
  { name: 'User 125', coords: [-25.6853, 29.2335] }, // Witbank
  { name: 'User 126', coords: [-24.9612, 31.1401] }, // Hazyview
  { name: 'User 127', coords: [-26.5281, 30.3921] }, // Bethal
  { name: 'User 128', coords: [-26.3123, 30.0912] }, // Secunda
  { name: 'User 129', coords: [-25.4011, 30.8532] },
  { name: 'User 130', coords: [-24.9733, 30.1234] },
  { name: 'User 131', coords: [-25.1621, 29.9382] },
  { name: 'User 132', coords: [-26.1442, 29.8723] },
  { name: 'User 133', coords: [-25.8221, 30.7122] },
  { name: 'User 134', coords: [-26.0123, 29.5211] },
  { name: 'User 135', coords: [-25.9234, 30.2341] },
  { name: 'User 136', coords: [-26.4321, 30.1123] },
  { name: 'User 137', coords: [-25.6432, 30.1012] },
  { name: 'User 138', coords: [-26.3432, 30.5834] },
  { name: 'User 139', coords: [-25.8791, 29.8543] },
  { name: 'User 140', coords: [-25.7621, 30.3212] },
],
'Northern Cape': [
  { name: 'User 141', coords: [-28.7282, 24.7498] }, // Kimberley
  { name: 'User 142', coords: [-29.6769, 22.7476] }, // Upington
  { name: 'User 143', coords: [-30.7183, 25.0968] }, // De Aar
  { name: 'User 144', coords: [-29.1717, 21.8569] }, // Springbok
  { name: 'User 145', coords: [-27.7476, 23.0034] }, // Kuruman
  { name: 'User 146', coords: [-28.5734, 22.9734] },
  { name: 'User 147', coords: [-29.9834, 23.4561] },
  { name: 'User 148', coords: [-30.1231, 24.5832] },
  { name: 'User 149', coords: [-29.6754, 25.0011] },
  { name: 'User 150', coords: [-27.9833, 23.7823] },
  { name: 'User 151', coords: [-30.2921, 24.6122] },
  { name: 'User 152', coords: [-28.9233, 24.2343] },
  { name: 'User 153', coords: [-29.8123, 22.9831] },
  { name: 'User 154', coords: [-29.1567, 24.8122] },
  { name: 'User 155', coords: [-27.8941, 23.5123] },
  { name: 'User 156', coords: [-28.3451, 25.1432] },
  { name: 'User 157', coords: [-30.2121, 23.7233] },
  { name: 'User 158', coords: [-29.6032, 24.5033] },
  { name: 'User 159', coords: [-28.8211, 22.9211] },
  { name: 'User 160', coords: [-30.0181, 25.0441] },
],

'Limpopo': [
  { name: 'User 161', coords: [-23.9045, 29.4689] }, // Polokwane
  { name: 'User 162', coords: [-24.8807, 28.2905] }, // Mokopane
  { name: 'User 163', coords: [-23.2876, 29.1378] }, // Tzaneen
  { name: 'User 164', coords: [-24.1943, 29.0097] }, // Mookgophong
  { name: 'User 165', coords: [-22.9866, 30.5877] }, // Musina
  { name: 'User 166', coords: [-23.9123, 28.8723] },
  { name: 'User 167', coords: [-23.5432, 29.8721] },
  { name: 'User 168', coords: [-24.2031, 28.7323] },
  { name: 'User 169', coords: [-23.8721, 29.4231] },
  { name: 'User 170', coords: [-22.9321, 30.1032] },
  { name: 'User 171', coords: [-23.3212, 30.9321] },
  { name: 'User 172', coords: [-24.1111, 29.8123] },
  { name: 'User 173', coords: [-24.7823, 28.9812] },
  { name: 'User 174', coords: [-23.0012, 30.1122] },
  { name: 'User 175', coords: [-22.8122, 30.4343] },
  { name: 'User 176', coords: [-23.6723, 28.9322] },
  { name: 'User 177', coords: [-24.3211, 29.0342] },
  { name: 'User 178', coords: [-23.5451, 28.8343] },
  { name: 'User 179', coords: [-23.7992, 30.8123] },
  { name: 'User 180', coords: [-22.9321, 29.4212] },
],

};

type ProvinceCenters = {
  [province: string]: { center: [number, number]; zoom: number };
};

const provinceCenters: ProvinceCenters = {
  Gauteng: { center: [-26.2708, 28.1123], zoom: 9 },
  'Western Cape': { center: [-33.9180, 18.4232], zoom: 9 },
  'KwaZulu-Natal': { center: [-29.8587, 31.0218], zoom: 8 },
  'Eastern Cape': { center: [-32.2968, 26.4194], zoom: 7 },
  'Free State': { center: [-28.4541, 26.7968], zoom: 8 },
  'North West': { center: [-25.6702, 27.2416], zoom: 8 },
  'Mpumalanga': { center: [-25.4563, 30.9991], zoom: 8 },
  'Northern Cape': { center: [-28.7282, 24.7498], zoom: 7 },
  'Limpopo': { center: [-23.9045, 29.4689], zoom: 7 },
};

const mapDefault = { center: [-29.0, 24.0] as [number, number], zoom: 5.5 };

// Helper component to change map view on province select
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

interface UserInsightsMapProps {
  isDarkMode?: boolean;
}

const UserInsightsMap: React.FC<UserInsightsMapProps> = ({ isDarkMode }) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('All Provinces');

  // Show province-level circles if 'All Provinces' is selected
  const provinceData = Object.keys(usersByProvince).map((prov) => ({
    name: prov,
    coords: provinceCenters[prov].center,
    users: usersByProvince[prov].length,
    color: '#e3342f', // Red for all provinces
  }));

  // For selected province, show user-level circles
  const userCircles = selectedProvince !== 'All Provinces' && usersByProvince[selectedProvince]
    ? usersByProvince[selectedProvince]
    : [];

  // Map center/zoom logic
  const mapView = selectedProvince !== 'All Provinces' && provinceCenters[selectedProvince]
    ? provinceCenters[selectedProvince]
    : mapDefault;

  return (
    <div className={isDarkMode ? 'w-full max-w-4xl mx-auto rounded-xl shadow-lg p-6 mb-8' : 'w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8'}
         style={isDarkMode ? { background: 'rgba(50, 50, 50, 0.9)' } : {}}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold mb-2 md:mb-0">User Distribution Map</h2>
        <div>
          <label htmlFor="province-select" className="mr-2 font-medium text-sm">Filter by Province:</label>
          <select
            id="province-select"
            className="border rounded px-3 py-1 text-sm"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option>All Provinces</option>
            {Object.keys(usersByProvince).map((prov) => (
              <option key={prov}>{prov}</option>
            ))}
          </select>
        </div>
      </div>
      <MapContainer
        center={mapView.center as [number, number]}
        zoom={mapView.zoom}
        style={{ height: '400px', width: '100%', borderRadius: '12px', zIndex: 0 }}
        scrollWheelZoom={false}
      >
        <ChangeMapView center={mapView.center as [number, number]} zoom={mapView.zoom} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedProvince === 'All Provinces'
          ? provinceData.map((prov) => (
              <LeafletCircle
                key={prov.name}
                center={prov.coords as [number, number]}
                radius={prov.users * 300} // Larger radius for province-level
                pathOptions={{ color: prov.color, fillColor: prov.color, fillOpacity: 0.5 }}
              >
                <LeafletTooltip>
                  <div className="text-xs font-semibold">
                    {prov.name}: {prov.users} users
                  </div>
                </LeafletTooltip>
              </LeafletCircle>
            ))
          : userCircles.map((user, idx) => (
              <LeafletCircle
                key={user.name + idx}
                center={user.coords as [number, number]}
                radius={4000} // Larger radius for user-level
                pathOptions={{ color: '#e3342f', fillColor: '#e3342f', fillOpacity: 0.7 }}
              >
                <LeafletTooltip>
                  <div className="text-xs font-semibold">
                    {user.name}
                  </div>
                </LeafletTooltip>
              </LeafletCircle>
            ))}
      </MapContainer>
      <div className="mt-4 text-xs text-gray-500">
        <span>Map data: &copy; OpenStreetMap contributors | Circles represent user locations (dummy data).<br/>For real data, use OpenCage Geocoder API key in code comments.</span>
      </div>
    </div>
  );
};

export default UserInsightsMap; 