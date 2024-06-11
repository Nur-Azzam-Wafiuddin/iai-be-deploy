import type { VercelRequest, VercelResponse } from '@vercel/node'

interface LocationData {
    id: string;
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties: {
        location: string;
        air_quality_index: number;
        pm10: number;
        pm2_5: number;
        o3: number;
        no2: number;
        so2: number;
        co: number;
        timestamp: string;
    };
}

let previousData: LocationData[] = [];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateInitialRandomData() {
    const coordinates = [
        [110.3738222, -7.7659456], // Yogyakarta
        [110.36963439175416, -7.7496238], // Sleman
        [110.415648, -7.801391], // Bantul
        [110.422173, -7.808887], // Kulon Progo
        [110.429569, -7.796569], // Gunung Kidul
        [110.444572, -7.780294], // Wonosari
        [110.450119, -7.767698], // Piyungan
        [110.457886, -7.762510], // Pakem
        [110.465653, -7.775210], // Berbah
        [110.373765, -7.759205], // Godean
        [110.366592, -7.787469], // Mlati
        [110.396946, -7.775481], // Depok
        [110.383119, -7.825214], // Kalasan
        [110.381393, -7.820405], // Prambanan
        [110.369077, -7.817103], // Sleman
        [110.357586, -7.819405], // Bantul
        [110.356962, -7.804457], // Ngemplak
        [110.349146, -7.809505], // Kotagede
        [110.376803, -7.803917], // Turi
        [110.401720, -7.805821], // Kasihan
        [110.389388, -7.772328], // Banguntapan
        [110.367626, -7.768743], // Imogiri
        [110.365700, -7.765448], // Kretek
        [110.362576, -7.772868], // Pundong
        [110.348102, -7.773922], // Sewon
        [110.374418, -7.788755], // Sleman
        [110.358428, -7.782454], // Seyegan
        [110.383805, -7.791398], // Ngaglik
        [110.400646, -7.808179], // Prambanan
        [110.418153, -7.816686], // Gamping
        [110.417156, -7.831765], // Mlonggo
        [110.423587, -7.797808], // Banguntapan
        [110.433363, -7.785672], // Srandakan
        [110.454974, -7.793252], // Tepus
        [110.458524, -7.791257], // Wonosari
        [110.462087, -7.792749], // Jatirejo
        [110.457676, -7.795497], // Semanu
        [110.462653, -7.781430], // Girikerto
        [110.459362, -7.776696], // Beji
        [110.463091, -7.772431], // Sendangsari
        [110.471777, -7.761775], // Girisubo
        [110.468504, -7.748122], // Purwodadi
    ];

    const locations = [
        "Yogyakarta",
        "Sleman",
        "Bantul",
        "Kulon Progo",
        "Gunung Kidul",
        "Wonosari",
        "Piyungan",
        "Pakem",
        "Berbah",
        "Godean",
        "Mlati",
        "Depok",
        "Kalasan",
        "Prambanan",
        "Sleman",
        "Bantul",
        "Ngemplak",
        "Kotagede",
        "Turi",
        "Kasihan",
        "Banguntapan",
        "Imogiri",
        "Kretek",
        "Pundong",
        "Sewon",
        "Sleman",
        "Seyegan",
        "Ngaglik",
        "Prambanan",
        "Gamping",
        "Mlonggo",
        "Banguntapan",
        "Srandakan",
        "Tepus",
        "Wonosari",
        "Jatirejo",
        "Semanu",
        "Girikerto",
        "Beji",
        "Sendangsari",
        "Girisubo",
        "Purwodadi",
    ];

    return coordinates.map((coord, index) => {
        return {
            id: locations[index],
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: coord
            },
            properties: {
                location: locations[index],
                air_quality_index: getRandomInt(25, 200),
                pm10: getRandomInt(20, 80),
                pm2_5: getRandomInt(10, 50),
                o3: getRandomInt(30, 100),
                no2: getRandomInt(10, 50),
                so2: getRandomInt(5, 20),
                co: getRandomInt(1, 20),
                timestamp: new Date().toISOString()
            }
        };
    });
}


function updateDataWithInterpolation() {
    const newData = previousData.map(data => {
        const newProperties = {
            air_quality_index: interpolateValueInt(data.properties.air_quality_index, 10, 200),
            pm10: interpolateValueInt(data.properties.pm10, 20, 80),
            pm2_5: interpolateValueInt(data.properties.pm2_5, 10, 50),
            o3: interpolateValueInt(data.properties.o3, 30, 100),
            no2: interpolateValueInt(data.properties.no2, 10, 50),
            so2: interpolateValueInt(data.properties.so2, 5, 20),
            co: interpolateValueInt(data.properties.co, 1, 10),
            timestamp: new Date().toISOString()
        };

        return {
            ...data,
            properties: {
                ...data.properties,
                ...newProperties
            }
        };
    });

    return newData;
}

function interpolateValueInt(prevValue, min, max) {
    const change = Math.floor((Math.random() - 0.5) * 5);

    let newValue = prevValue + change;
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    return newValue;
}


export default function handler(req: VercelRequest, res: VercelResponse) {
  const { name = 'World' } = req.query
  const data = {
    type: "FeatureCollection",
    features: previousData
};
    return res.json(data);
}

previousData = generateInitialRandomData();

setInterval(() => {
    previousData = updateDataWithInterpolation();
}, 3000);
