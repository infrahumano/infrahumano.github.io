const canvas = document.getElementById('globe');
const ctx = canvas.getContext('2d');

let W, H, R, cx, cy;

const rot = { lon: -74.3, lat: 4.6 };
const target = { lon: -74.3, lat: 4.6 };

// ── Country metadata (ISO 3166-1 numeric → name + iso3) ───────────────────────
const COUNTRIES = {
  4:   { name: 'Afghanistan',                    iso3: 'AFG' },
  8:   { name: 'Albania',                         iso3: 'ALB' },
  12:  { name: 'Algeria',                         iso3: 'DZA' },
  24:  { name: 'Angola',                          iso3: 'AGO' },
  32:  { name: 'Argentina',                       iso3: 'ARG' },
  36:  { name: 'Australia',                       iso3: 'AUS' },
  40:  { name: 'Austria',                         iso3: 'AUT' },
  31:  { name: 'Azerbaijan',                      iso3: 'AZE' },
  50:  { name: 'Bangladesh',                      iso3: 'BGD' },
  56:  { name: 'Belgium',                         iso3: 'BEL' },
  84:  { name: 'Belize',                          iso3: 'BLZ' },
  204: { name: 'Benin',                           iso3: 'BEN' },
  64:  { name: 'Bhutan',                          iso3: 'BTN' },
  68:  { name: 'Bolivia',                         iso3: 'BOL' },
  70:  { name: 'Bosnia and Herzegovina',          iso3: 'BIH' },
  72:  { name: 'Botswana',                        iso3: 'BWA' },
  76:  { name: 'Brazil',                          iso3: 'BRA' },
  96:  { name: 'Brunei',                          iso3: 'BRN' },
  100: { name: 'Bulgaria',                        iso3: 'BGR' },
  854: { name: 'Burkina Faso',                    iso3: 'BFA' },
  108: { name: 'Burundi',                         iso3: 'BDI' },
  116: { name: 'Cambodia',                        iso3: 'KHM' },
  120: { name: 'Cameroon',                        iso3: 'CMR' },
  124: { name: 'Canada',                          iso3: 'CAN' },
  132: { name: 'Cape Verde',                      iso3: 'CPV' },
  140: { name: 'Central African Republic',        iso3: 'CAF' },
  148: { name: 'Chad',                            iso3: 'TCD' },
  152: { name: 'Chile',                           iso3: 'CHL' },
  156: { name: 'China',                           iso3: 'CHN' },
  170: { name: 'Colombia',                        iso3: 'COL' },
  174: { name: 'Comoros',                         iso3: 'COM' },
  178: { name: 'Republic of the Congo',           iso3: 'COG' },
  180: { name: 'Democratic Republic of the Congo',iso3: 'COD' },
  188: { name: 'Costa Rica',                      iso3: 'CRI' },
  191: { name: 'Croatia',                         iso3: 'HRV' },
  192: { name: 'Cuba',                            iso3: 'CUB' },
  196: { name: 'Cyprus',                          iso3: 'CYP' },
  203: { name: 'Czech Republic',                  iso3: 'CZE' },
  208: { name: 'Denmark',                         iso3: 'DNK' },
  262: { name: 'Djibouti',                        iso3: 'DJI' },
  214: { name: 'Dominican Republic',              iso3: 'DOM' },
  218: { name: 'Ecuador',                         iso3: 'ECU' },
  818: { name: 'Egypt',                           iso3: 'EGY' },
  222: { name: 'El Salvador',                     iso3: 'SLV' },
  226: { name: 'Equatorial Guinea',               iso3: 'GNQ' },
  232: { name: 'Eritrea',                         iso3: 'ERI' },
  233: { name: 'Estonia',                         iso3: 'EST' },
  748: { name: 'Eswatini',                        iso3: 'SWZ' },
  231: { name: 'Ethiopia',                        iso3: 'ETH' },
  238: { name: 'Falkland Islands',                iso3: 'FLK' },
  242: { name: 'Fiji',                            iso3: 'FJI' },
  246: { name: 'Finland',                         iso3: 'FIN' },
  250: { name: 'France',                          iso3: 'FRA' },
  254: { name: 'French Guiana',                   iso3: 'GUF' },
  266: { name: 'Gabon',                           iso3: 'GAB' },
  270: { name: 'Gambia',                          iso3: 'GMB' },
  268: { name: 'Georgia',                         iso3: 'GEO' },
  276: { name: 'Germany',                         iso3: 'DEU' },
  288: { name: 'Ghana',                           iso3: 'GHA' },
  300: { name: 'Greece',                          iso3: 'GRC' },
  320: { name: 'Guatemala',                       iso3: 'GTM' },
  324: { name: 'Guinea',                          iso3: 'GIN' },
  624: { name: 'Guinea-Bissau',                   iso3: 'GNB' },
  328: { name: 'Guyana',                          iso3: 'GUY' },
  332: { name: 'Haiti',                           iso3: 'HTI' },
  340: { name: 'Honduras',                        iso3: 'HND' },
  348: { name: 'Hungary',                         iso3: 'HUN' },
  352: { name: 'Iceland',                         iso3: 'ISL' },
  356: { name: 'India',                           iso3: 'IND' },
  360: { name: 'Indonesia',                       iso3: 'IDN' },
  364: { name: 'Iran',                            iso3: 'IRN' },
  368: { name: 'Iraq',                            iso3: 'IRQ' },
  372: { name: 'Ireland',                         iso3: 'IRL' },
  376: { name: 'Israel',                          iso3: 'ISR' },
  380: { name: 'Italy',                           iso3: 'ITA' },
  384: { name: 'Ivory Coast',                     iso3: 'CIV' },
  388: { name: 'Jamaica',                         iso3: 'JAM' },
  392: { name: 'Japan',                           iso3: 'JPN' },
  400: { name: 'Jordan',                          iso3: 'JOR' },
  398: { name: 'Kazakhstan',                      iso3: 'KAZ' },
  404: { name: 'Kenya',                           iso3: 'KEN' },
  408: { name: 'North Korea',                     iso3: 'PRK' },
  410: { name: 'South Korea',                     iso3: 'KOR' },
  414: { name: 'Kuwait',                          iso3: 'KWT' },
  417: { name: 'Kyrgyzstan',                      iso3: 'KGZ' },
  418: { name: 'Laos',                            iso3: 'LAO' },
  422: { name: 'Lebanon',                         iso3: 'LBN' },
  426: { name: 'Lesotho',                         iso3: 'LSO' },
  428: { name: 'Latvia',                          iso3: 'LVA' },
  430: { name: 'Liberia',                         iso3: 'LBR' },
  434: { name: 'Libya',                           iso3: 'LBY' },
  438: { name: 'Liechtenstein',                   iso3: 'LIE' },
  440: { name: 'Lithuania',                       iso3: 'LTU' },
  442: { name: 'Luxembourg',                      iso3: 'LUX' },
  450: { name: 'Madagascar',                      iso3: 'MDG' },
  454: { name: 'Malawi',                          iso3: 'MWI' },
  458: { name: 'Malaysia',                        iso3: 'MYS' },
  466: { name: 'Mali',                            iso3: 'MLI' },
  478: { name: 'Mauritania',                      iso3: 'MRT' },
  480: { name: 'Mauritius',                       iso3: 'MUS' },
  484: { name: 'Mexico',                          iso3: 'MEX' },
  492: { name: 'Monaco',                          iso3: 'MCO' },
  496: { name: 'Mongolia',                        iso3: 'MNG' },
  498: { name: 'Moldova',                         iso3: 'MDA' },
  499: { name: 'Montenegro',                      iso3: 'MNE' },
  504: { name: 'Morocco',                         iso3: 'MAR' },
  508: { name: 'Mozambique',                      iso3: 'MOZ' },
  104: { name: 'Myanmar',                         iso3: 'MMR' },
  516: { name: 'Namibia',                         iso3: 'NAM' },
  524: { name: 'Nepal',                           iso3: 'NPL' },
  528: { name: 'Netherlands',                     iso3: 'NLD' },
  540: { name: 'New Caledonia',                   iso3: 'NCL' },
  554: { name: 'New Zealand',                     iso3: 'NZL' },
  558: { name: 'Nicaragua',                       iso3: 'NIC' },
  562: { name: 'Niger',                           iso3: 'NER' },
  566: { name: 'Nigeria',                         iso3: 'NGA' },
  578: { name: 'Norway',                          iso3: 'NOR' },
  512: { name: 'Oman',                            iso3: 'OMN' },
  586: { name: 'Pakistan',                        iso3: 'PAK' },
  275: { name: 'Palestine',                       iso3: 'PSE' },
  591: { name: 'Panama',                          iso3: 'PAN' },
  598: { name: 'Papua New Guinea',                iso3: 'PNG' },
  600: { name: 'Paraguay',                        iso3: 'PRY' },
  604: { name: 'Peru',                            iso3: 'PER' },
  608: { name: 'Philippines',                     iso3: 'PHL' },
  616: { name: 'Poland',                          iso3: 'POL' },
  620: { name: 'Portugal',                        iso3: 'PRT' },
  630: { name: 'Puerto Rico',                     iso3: 'PRI' },
  634: { name: 'Qatar',                           iso3: 'QAT' },
  642: { name: 'Romania',                         iso3: 'ROU' },
  643: { name: 'Russia',                          iso3: 'RUS' },
  646: { name: 'Rwanda',                          iso3: 'RWA' },
  674: { name: 'San Marino',                      iso3: 'SMR' },
  678: { name: 'Sao Tome and Principe',           iso3: 'STP' },
  682: { name: 'Saudi Arabia',                    iso3: 'SAU' },
  686: { name: 'Senegal',                         iso3: 'SEN' },
  688: { name: 'Serbia',                          iso3: 'SRB' },
  694: { name: 'Sierra Leone',                    iso3: 'SLE' },
  702: { name: 'Singapore',                       iso3: 'SGP' },
  703: { name: 'Slovakia',                        iso3: 'SVK' },
  705: { name: 'Slovenia',                        iso3: 'SVN' },
  90:  { name: 'Solomon Islands',                 iso3: 'SLB' },
  706: { name: 'Somalia',                         iso3: 'SOM' },
  710: { name: 'South Africa',                    iso3: 'ZAF' },
  728: { name: 'South Sudan',                     iso3: 'SSD' },
  724: { name: 'Spain',                           iso3: 'ESP' },
  144: { name: 'Sri Lanka',                       iso3: 'LKA' },
  729: { name: 'Sudan',                           iso3: 'SDN' },
  740: { name: 'Suriname',                        iso3: 'SUR' },
  752: { name: 'Sweden',                          iso3: 'SWE' },
  756: { name: 'Switzerland',                     iso3: 'CHE' },
  760: { name: 'Syria',                           iso3: 'SYR' },
  158: { name: 'Taiwan',                          iso3: 'TWN' },
  762: { name: 'Tajikistan',                      iso3: 'TJK' },
  834: { name: 'Tanzania',                        iso3: 'TZA' },
  764: { name: 'Thailand',                        iso3: 'THA' },
  626: { name: 'Timor-Leste',                     iso3: 'TLS' },
  768: { name: 'Togo',                            iso3: 'TGO' },
  780: { name: 'Trinidad and Tobago',             iso3: 'TTO' },
  788: { name: 'Tunisia',                         iso3: 'TUN' },
  792: { name: 'Turkey',                          iso3: 'TUR' },
  795: { name: 'Turkmenistan',                    iso3: 'TKM' },
  800: { name: 'Uganda',                          iso3: 'UGA' },
  804: { name: 'Ukraine',                         iso3: 'UKR' },
  784: { name: 'United Arab Emirates',            iso3: 'ARE' },
  826: { name: 'United Kingdom',                  iso3: 'GBR' },
  840: { name: 'United States',                   iso3: 'USA' },
  858: { name: 'Uruguay',                         iso3: 'URY' },
  860: { name: 'Uzbekistan',                      iso3: 'UZB' },
  548: { name: 'Vanuatu',                         iso3: 'VUT' },
  336: { name: 'Vatican City',                    iso3: 'VAT' },
  862: { name: 'Venezuela',                       iso3: 'VEN' },
  704: { name: 'Vietnam',                         iso3: 'VNM' },
  732: { name: 'Western Sahara',                  iso3: 'ESH' },
  887: { name: 'Yemen',                           iso3: 'YEM' },
  894: { name: 'Zambia',                          iso3: 'ZMB' },
  716: { name: 'Zimbabwe',                        iso3: 'ZWE' },
  51:  { name: 'Armenia',                         iso3: 'ARM' },
  112: { name: 'Belarus',                         iso3: 'BLR' },
  807: { name: 'North Macedonia',                 iso3: 'MKD' },
  48:  { name: 'Bahrain',                         iso3: 'BHR' },
};

// ── Game state ─────────────────────────────────────────────────────────────────
let features = [];
let centroids = {};
let adjacency = {};
let countryColors = {};
let targetIso3 = null;
let guesses = new Set();
let guessCount = 0;
let nameMap = {};
let iso3ToName = {};
let gameOver = false;

// ── Resize ─────────────────────────────────────────────────────────────────────
function resize() {
  W = canvas.width = overlay.width = window.innerWidth;
  H = canvas.height = overlay.height = window.innerHeight;
  R = Math.min(W, H) * 0.45;
  cx = W / 2;
  cy = H / 2;
}

// ── Projection ─────────────────────────────────────────────────────────────────
function project(lon, lat) {
  const λ = (lon - rot.lon) * Math.PI / 180;
  const φ = lat * Math.PI / 180;
  const φ0 = rot.lat * Math.PI / 180;
  const cosC = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ);
  if (cosC < 0) return null;
  return {
    x: cx + R * Math.cos(φ) * Math.sin(λ),
    y: cy - R * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ)),
  };
}

// ── TopoJSON decode ────────────────────────────────────────────────────────────
function decodeTopoJSON(topo) {
  const { scale, translate } = topo.transform;

  const arcs = topo.arcs.map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });

  const getArc = i => i < 0 ? [...arcs[~i]].reverse() : arcs[i];
  const decodeRing = indices => indices.flatMap(getArc);

  const features = topo.objects.countries.geometries.map(geom => {
    const meta = COUNTRIES[parseInt(geom.id, 10)];
    const coordinates = geom.type === 'Polygon'
      ? geom.arcs.map(decodeRing)
      : geom.arcs.map(poly => poly.map(decodeRing));
    return { id: geom.id, iso3: meta?.iso3 ?? null, name: meta?.name ?? null, type: geom.type, coordinates };
  });
  const missing = features.filter(f => !f.iso3).map(f => f.id);
  console.log('[topo] total features:', features.length, '| no-iso3:', missing.length, missing.slice(0,10));
  const bra = features.find(f => f.iso3 === 'BRA');
  if (bra) console.log('[topo] BRA type:', bra.type, '| coords length:', bra.coordinates.length, '| first ring length:', bra.type==='Polygon' ? bra.coordinates[0]?.length : bra.coordinates[0]?.[0]?.length);
  else console.log('[topo] BRA not found in features');
  return features;
}

// ── Centroid ───────────────────────────────────────────────────────────────────
function buildCentroids(feats) {
  const result = {};
  for (const f of feats) {
    if (!f.iso3) continue;
    const ring = f.type === 'Polygon'
      ? f.coordinates[0]
      : f.coordinates.reduce((best, poly) => poly[0].length > best.length ? poly[0] : best, []);
    let lonSum = 0, latSum = 0;
    for (const [lon, lat] of ring) { lonSum += lon; latSum += lat; }
    result[f.iso3] = { lon: lonSum / ring.length, lat: latSum / ring.length };
  }
  return result;
}

// ── Adjacency ──────────────────────────────────────────────────────────────────
function buildAdjacency(feats) {
  const coordMap = new Map();
  for (const f of feats) {
    if (!f.iso3) continue;
    const rings = f.type === 'Polygon'
      ? [f.coordinates[0]]
      : f.coordinates.map(poly => poly[0]);
    for (const ring of rings) {
      for (const [lon, lat] of ring) {
        const key = `${lon},${lat}`;
        if (!coordMap.has(key)) coordMap.set(key, new Set());
        coordMap.get(key).add(f.iso3);
      }
    }
  }
  const adj = {};
  for (const countries of coordMap.values()) {
    if (countries.size < 2) continue;
    const arr = [...countries];
    for (let i = 0; i < arr.length; i++)
      for (let j = i + 1; j < arr.length; j++) {
        (adj[arr[i]] ??= new Set()).add(arr[j]);
        (adj[arr[j]] ??= new Set()).add(arr[i]);
      }
  }
  return adj;
}

// ── Render ─────────────────────────────────────────────────────────────────────
function traceRing(ring) {
  let started = false;
  ctx.beginPath();
  for (const [lon, lat] of ring) {
    const p = project(lon, lat);
    if (!p) { started = false; continue; }
    started ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
    started = true;
  }
}

function drawRing(ring) {
  traceRing(ring);
  ctx.fill();
}

function strokeRing(ring) {
  traceRing(ring);
  ctx.stroke();
}

function drawFeature(f) {
  ctx.fillStyle = countryColors[f.iso3] || '#272c38';
  if (f.type === 'Polygon') {
    drawRing(f.coordinates[0]);
  } else {
    for (const poly of f.coordinates) drawRing(poly[0]);
  }
}

function strokeFeature(f) {
  if (f.type === 'Polygon') {
    strokeRing(f.coordinates[0]);
  } else {
    for (const poly of f.coordinates) strokeRing(poly[0]);
  }
}

function drawGlobe() {
  const dLon = (() => { let d = target.lon - rot.lon; while (d > 180) d -= 360; while (d < -180) d += 360; return d; })();
  const dLat = target.lat - rot.lat;
  if (Math.abs(dLon) > 0.01 || Math.abs(dLat) > 0.01) {
    rot.lon += dLon * 0.08;
    rot.lat += dLat * 0.08;
  }

  ctx.clearRect(0, 0, W, H);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = '#191c22';
  ctx.fillRect(cx - R - 1, cy - R - 1, R * 2 + 2, R * 2 + 2);

  // Relief shadow (bottom-right offset, drawn under fill)
  ctx.save();
  ctx.translate(1.4, 1.6);
  ctx.strokeStyle = 'rgba(0,0,0,0.55)';
  ctx.lineWidth = 1.2;
  for (const f of features) strokeFeature(f);
  ctx.restore();

  // Relief highlight (top-left offset, drawn under fill)
  ctx.save();
  ctx.translate(-0.8, -1.0);
  ctx.strokeStyle = 'rgba(255,255,255,0.13)';
  ctx.lineWidth = 1.0;
  for (const f of features) strokeFeature(f);
  ctx.restore();

  for (const f of features) drawFeature(f);

  const shade = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.32, 0, cx + R * 0.1, cy + R * 0.1, R * 1.3);
  shade.addColorStop(0, 'rgba(255,255,255,0.07)');
  shade.addColorStop(0.5, 'rgba(0,0,0,0)');
  shade.addColorStop(1, 'rgba(0,0,0,0.38)');
  ctx.fillStyle = shade;
  ctx.fillRect(cx - R - 1, cy - R - 1, R * 2 + 2, R * 2 + 2);

  ctx.restore();

  const atm = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.14);
  atm.addColorStop(0, 'rgba(120,150,200,0.18)');
  atm.addColorStop(0.6, 'rgba(100,130,180,0.06)');
  atm.addColorStop(1, 'rgba(80,110,160,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.14, 0, Math.PI * 2);
  ctx.fillStyle = atm;
  ctx.fill();

  requestAnimationFrame(drawGlobe);
}

// ── Drag ───────────────────────────────────────────────────────────────────────
let drag = null;

canvas.addEventListener('pointerdown', e => {
  drag = { x: e.clientX, y: e.clientY };
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener('pointermove', e => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  const dy = e.clientY - drag.y;
  drag = { x: e.clientX, y: e.clientY };
  const latCos = Math.max(0.15, Math.cos(rot.lat * Math.PI / 180));
  rot.lon -= dx * 0.28 / latCos;
  rot.lat = Math.max(-85, Math.min(85, rot.lat + dy * 0.28));
  target.lon = rot.lon;
  target.lat = rot.lat;
});

canvas.addEventListener('pointerup', () => {
  drag = null;
  if (!gameOver) document.getElementById('guess').focus();
});
canvas.addEventListener('pointercancel', () => { drag = null; });

// ── ISO alpha-2 for flag emojis ────────────────────────────────────────────────
const ISO2 = {
  AFG:'AF',ALB:'AL',DZA:'DZ',AGO:'AO',ARG:'AR',AUS:'AU',AUT:'AT',AZE:'AZ',
  BGD:'BD',BEL:'BE',BLZ:'BZ',BEN:'BJ',BTN:'BT',BOL:'BO',BIH:'BA',BWA:'BW',
  BRA:'BR',BRN:'BN',BGR:'BG',BFA:'BF',BDI:'BI',KHM:'KH',CMR:'CM',CAN:'CA',
  CPV:'CV',CAF:'CF',TCD:'TD',CHL:'CL',CHN:'CN',COL:'CO',COM:'KM',COG:'CG',
  COD:'CD',CRI:'CR',HRV:'HR',CUB:'CU',CYP:'CY',CZE:'CZ',DNK:'DK',DJI:'DJ',
  DOM:'DO',ECU:'EC',EGY:'EG',SLV:'SV',GNQ:'GQ',ERI:'ER',EST:'EE',SWZ:'SZ',
  ETH:'ET',FLK:'FK',FJI:'FJ',FIN:'FI',FRA:'FR',GUF:'GF',GAB:'GA',GMB:'GM',
  GEO:'GE',DEU:'DE',GHA:'GH',GRC:'GR',GTM:'GT',GIN:'GN',GNB:'GW',GUY:'GY',
  HTI:'HT',HND:'HN',HUN:'HU',ISL:'IS',IND:'IN',IDN:'ID',IRN:'IR',IRQ:'IQ',
  IRL:'IE',ISR:'IL',ITA:'IT',CIV:'CI',JAM:'JM',JPN:'JP',JOR:'JO',KAZ:'KZ',
  KEN:'KE',PRK:'KP',KOR:'KR',KWT:'KW',KGZ:'KG',LAO:'LA',LBN:'LB',LSO:'LS',
  LVA:'LV',LBR:'LR',LBY:'LY',LIE:'LI',LTU:'LT',LUX:'LU',MDG:'MG',MWI:'MW',
  MYS:'MY',MLI:'ML',MRT:'MR',MUS:'MU',MEX:'MX',MCO:'MC',MNG:'MN',MDA:'MD',
  MNE:'ME',MAR:'MA',MOZ:'MZ',MMR:'MM',NAM:'NA',NPL:'NP',NLD:'NL',NCL:'NC',
  NZL:'NZ',NIC:'NI',NER:'NE',NGA:'NG',NOR:'NO',OMN:'OM',PAK:'PK',PSE:'PS',
  PAN:'PA',PNG:'PG',PRY:'PY',PER:'PE',PHL:'PH',POL:'PL',PRT:'PT',PRI:'PR',
  QAT:'QA',ROU:'RO',RUS:'RU',RWA:'RW',SMR:'SM',STP:'ST',SAU:'SA',SEN:'SN',
  SRB:'RS',SLE:'SL',SGP:'SG',SVK:'SK',VNM:'VN',SVN:'SI',SLB:'SB',SOM:'SO',
  ZAF:'ZA',SSD:'SS',ESP:'ES',LKA:'LK',SDN:'SD',SUR:'SR',SWE:'SE',CHE:'CH',
  SYR:'SY',TWN:'TW',TJK:'TJ',TZA:'TZ',THA:'TH',TLS:'TL',TGO:'TG',TTO:'TT',
  TUN:'TN',TUR:'TR',TKM:'TM',UGA:'UG',UKR:'UA',ARE:'AE',GBR:'GB',USA:'US',
  URY:'UY',UZB:'UZ',VUT:'VU',VAT:'VA',VEN:'VE',ESH:'EH',YEM:'YE',ZMB:'ZM',
  ZWE:'ZW',ARM:'AM',BLR:'BY',MKD:'MK',BHR:'BH',
};

function flagEmoji(iso3) {
  const a2 = ISO2[iso3];
  if (!a2) return '';
  return [...a2].map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))).join('');
}

// ── Confetti overlay canvas ────────────────────────────────────────────────────
const overlay = document.createElement('canvas');
overlay.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:10';
document.body.appendChild(overlay);
const oc = overlay.getContext('2d');

// ── Name normalisation ─────────────────────────────────────────────────────────
function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '').trim().replace(/\s+/g, ' ');
}

function buildNameMap() {
  for (const { name, iso3 } of Object.values(COUNTRIES)) {
    if (!centroids[iso3]) continue;
    nameMap[normalize(name)] = iso3;
    iso3ToName[iso3] = name;
  }
  const aliases = {
    'usa': 'USA', 'america': 'USA', 'united states of america': 'USA',
    'uk': 'GBR', 'britain': 'GBR', 'great britain': 'GBR', 'england': 'GBR',
    'drc': 'COD', 'dr congo': 'COD', 'congo kinshasa': 'COD', 'zaire': 'COD',
    'congo': 'COG', 'congo brazzaville': 'COG',
    'czechia': 'CZE',
    'turkey': 'TUR', 'turkiye': 'TUR',
    'burma': 'MMR',
    'east timor': 'TLS',
    'cabo verde': 'CPV',
    'swaziland': 'SWZ',
    'korea': 'KOR',
    'macedonia': 'MKD',
    'holland': 'NLD',
    'persia': 'IRN',
    'ivory coast': 'CIV', 'cote divoire': 'CIV', 'cote d ivoire': 'CIV',
    'trinidad': 'TTO',
    'taiwan': 'TWN',
    'palestine': 'PSE',
    'russia': 'RUS',
    'laos': 'LAO',
    'vietnam': 'VNM',
  };
  for (const [alias, iso3] of Object.entries(aliases)) {
    if (centroids[iso3]) nameMap[alias] = iso3;
  }
}

// ── Distance & colour ──────────────────────────────────────────────────────────
function haversineKm(lon1, lat1, lon2, lat2) {
  const r = 6371;
  const dφ = (lat2 - lat1) * Math.PI / 180;
  const dλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dφ / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dλ / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
}

function distanceColor(km) {
  const t = Math.min(km / 20000, 1);
  const stops = [
    [0.00, [229, 85,  85]],
    [0.15, [224, 138, 48]],
    [0.35, [196, 168, 74]],
    [0.65, [100, 106, 124]],
    [1.00, [48,  52,  62]],
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i], [t1, c1] = stops[i + 1];
    if (t <= t1) {
      const s = (t - t0) / (t1 - t0);
      return `rgb(${stops[i][1].map((v, j) => Math.round(v + s * (c1[j] - v))).join(',')})`;
    }
  }
  return 'rgb(48,52,62)';
}

// ── Feedback ───────────────────────────────────────────────────────────────────
function setFeedback(text, cls = '') {
  const el = document.getElementById('feedback');
  el.textContent = text;
  el.className = cls;
}

function makeHistoryItem(iso3, name, won) {
  const el = document.createElement('div');
  el.className = 'h-item';
  el.dataset.iso3 = iso3;
  el.textContent = `${flagEmoji(iso3)} ${name}`;
  if (won) el.style.color = '#6a9a78';
  return el;
}

function addHistory(iso3, name, won = false) {
  document.getElementById('history').prepend(makeHistoryItem(iso3, name, won));
  const dl = document.getElementById('drawer-list');
  if (dl) dl.prepend(makeHistoryItem(iso3, name, won));
  updateDrawerPeek();
}

function flashHistory(iso3) {
  for (const el of document.querySelectorAll(`[data-iso3="${iso3}"]`)) {
    el.style.transition = 'opacity 0.1s';
    el.style.opacity = '1';
    setTimeout(() => { el.style.transition = 'opacity 1.2s'; el.style.opacity = '0.45'; }, 500);
  }
}

// ── Mobile drawer ──────────────────────────────────────────────────────────────
const drawer = document.getElementById('drawer');
const drawerHandle = document.getElementById('drawer-handle');
let drawerOpen = false;
let drawerTouchStartY = 0;
let drawerTouchStartTranslate = 0;
let isDraggingDrawer = false;

function drawerCollapsedY() {
  return drawer.getBoundingClientRect().height - 48;
}

function openDrawer() {
  drawerOpen = true;
  drawer.style.transition = '';
  drawer.style.transform = 'translateY(0)';
}

function closeDrawer() {
  drawerOpen = false;
  drawer.style.transition = '';
  drawer.style.transform = '';
}

function updateDrawerPeek() {
  const el = document.getElementById('drawer-peek');
  if (!el) return;
  el.textContent = guessCount === 0 ? '' : `${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'}`;
}

drawerHandle.addEventListener('touchstart', e => {
  drawerTouchStartY = e.touches[0].clientY;
  drawerTouchStartTranslate = drawerOpen ? 0 : drawerCollapsedY();
  isDraggingDrawer = false;
  drawer.style.transition = 'none';
}, { passive: true });

drawerHandle.addEventListener('touchmove', e => {
  const dy = e.touches[0].clientY - drawerTouchStartY;
  if (Math.abs(dy) > 5) isDraggingDrawer = true;
  const y = Math.max(0, Math.min(drawerCollapsedY(), drawerTouchStartTranslate + dy));
  drawer.style.transform = `translateY(${y}px)`;
}, { passive: true });

drawerHandle.addEventListener('touchend', e => {
  drawer.style.transition = '';
  const dy = e.changedTouches[0].clientY - drawerTouchStartY;
  if (!isDraggingDrawer) { drawerOpen ? closeDrawer() : openDrawer(); return; }
  dy < -30 ? openDrawer() : closeDrawer();
});

drawerHandle.addEventListener('click', () => {
  if (!isDraggingDrawer) drawerOpen ? closeDrawer() : openDrawer();
});

// Close drawer when tapping outside it
document.addEventListener('pointerdown', e => {
  if (drawerOpen && !drawer.contains(e.target)) closeDrawer();
}, { passive: true });

// ── Guess handler ──────────────────────────────────────────────────────────────
function handleGuess(raw) {
  if (gameOver) return;
  const key = normalize(raw);
  const iso3 = nameMap[key];
  console.log('[guess]', raw, '→ key:', key, '→ iso3:', iso3, '| guesses:', [...guesses], '| target:', targetIso3);
  if (!iso3) { setFeedback('not found — try a different spelling', 'error'); return; }
  if (guesses.has(iso3)) {
    setFeedback(`${iso3ToName[iso3]} — already guessed`, 'error');
    flashHistory(iso3);
    document.getElementById('guess').value = '';
    return;
  }

  const c = centroids[iso3];
  const tgt = centroids[targetIso3];
  console.log('[guess] centroid c:', c, '| tgt:', tgt);
  if (!c || !tgt) { setFeedback('not found — try a different spelling', 'error'); return; }

  guesses.add(iso3);
  guessCount++;
  document.getElementById('count').textContent = guessCount;

  const dist = haversineKm(c.lon, c.lat, tgt.lon, tgt.lat);
  const isAdj = adjacency[targetIso3]?.has(iso3) ?? false;
  const displayName = iso3ToName[iso3];

  if (iso3 === targetIso3) {
    countryColors[iso3] = '#4caf7d';
    target.lon = c.lon;
    target.lat = c.lat;
    addHistory(iso3, displayName, true);
    document.getElementById('guess').value = '';
    gameOver = true;
    onWin();
    return;
  }

  countryColors[iso3] = distanceColor(dist);
  target.lon = c.lon;
  target.lat = c.lat;

  const distStr = Math.round(dist).toLocaleString();
  let msg = `${displayName} — ${distStr} km away`;
  if (isAdj) msg += ' · adjacent to the answer';
  setFeedback(msg, isAdj ? 'adjacent' : '');

  addHistory(iso3, displayName);
  document.getElementById('guess').value = '';
}

// ── Particle system ────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#c8b89a','#9ab4c8','#b4c89a','#c89ab4','#c8c89a','#aaaaaa'];
let particles = [];
let particleRunning = false;

function smoothstep(a, b, t) {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

function drawStar(ctx, x, y, r, alpha, color) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  const inner = r * 0.4;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const rad = i % 2 === 0 ? r : inner;
    i === 0 ? ctx.moveTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle))
             : ctx.lineTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawConfettoRect(ctx, p, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = p.color;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.fillRect(-1.5, -4, 3, 8);
  ctx.restore();
}

function tickParticles(ts) {
  oc.clearRect(0, 0, W, H);
  const alive = [];
  for (const p of particles) {
    p.age += 1 / 60;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    if (p.angle !== undefined) p.angle += p.spin;

    if (p.age < p.delay) { alive.push(p); continue; }
    const t = (p.age - p.delay) / p.lifetime;
    if (t >= 1) continue;

    const alpha = 1 - smoothstep(0.75, 1, t);
    if (p.type === 'sparkle') {
      drawStar(oc, p.x, p.y, p.size, alpha, p.color);
    } else {
      drawConfettoRect(oc, p, alpha);
    }
    alive.push(p);
  }
  particles = alive;
  if (particles.length > 0) requestAnimationFrame(tickParticles);
  else oc.clearRect(0, 0, W, H);
}

function launchParticles() {
  particles = [];

  // Sparkles — burst from globe centre
  for (let i = 0; i < 26; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5 + Math.random() * 5;
    particles.push({
      type: 'sparkle',
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.06,
      size: 3 + Math.random() * 6,
      color: Math.random() < 0.5 ? 'rgba(255,255,255,1)' : 'rgba(240,210,140,1)',
      age: 0, delay: 0,
      lifetime: 1.4 + Math.random() * 1.2,
    });
  }

  // Confetti — rain from top
  for (let i = 0; i < 65; i++) {
    particles.push({
      type: 'confetti',
      x: (Math.random() - 0.1) * W * 1.2,
      y: -10 - Math.random() * 80,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 1.5 + Math.random() * 2.5,
      gravity: 0.04,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.18,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      age: 0, delay: Math.random() * 0.8,
      lifetime: 3 + Math.random() * 2,
    });
  }

  if (!particleRunning) {
    particleRunning = true;
    requestAnimationFrame(tickParticles);
  }
}

function onWin() {
  const form = document.getElementById('form');
  form.style.opacity = '0';
  form.style.pointerEvents = 'none';

  launchParticles();

  setTimeout(() => {
    document.getElementById('win-name').textContent = iso3ToName[targetIso3];
    document.getElementById('win-score').textContent =
      `found in ${guessCount} ${guessCount === 1 ? 'guess' : 'guesses'}`;
    document.getElementById('win').style.opacity = '1';
    document.getElementById('play-again').style.display = 'block';
  }, 500);
}

// ── Data loading ───────────────────────────────────────────────────────────────
const CACHE_KEY = 'globe_topo_v2';

async function init() {
  let topo;
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try { topo = JSON.parse(cached); } catch (_) { localStorage.removeItem(CACHE_KEY); }
  }
  if (!topo) {
    const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    topo = await res.json();
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(topo)); } catch (_) {}
  }

  features = decodeTopoJSON(topo);
  centroids = buildCentroids(features);
  adjacency = buildAdjacency(features);
  buildNameMap();

  const eligible = Object.keys(centroids);
  targetIso3 = eligible[Math.floor(Math.random() * eligible.length)];

  document.getElementById('loading').style.display = 'none';
  document.getElementById('guess').focus();
}

document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const val = document.getElementById('guess').value.trim();
  if (val) handleGuess(val);
});

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(drawGlobe);
init();
