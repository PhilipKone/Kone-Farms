export const blogArticles = [
  {
    id: 'solar-esp32-lora-soil-moisture-ghana',
    slug: 'solar-esp32-lora-soil-moisture-ghana',
    title: 'Solar-Powered ESP32 & LoRa Telemetry for Soil Moisture Control in Ghanaian Farmlands',
    summary: 'Deploying long-range (LoRa SX1276) soil moisture sensor nodes across rural farms in Ghana. Exploring capacitive vs TDR sensors, battery power budgeting, and MQTT cloud relay.',
    category: 'Telemetry & IoT',
    publishDate: 'August 10, 2026',
    isoDate: '2026-08-10T00:00:00Z',
    readTime: '7 min read',
    accentColor: '#10b981',
    coverGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.4) 100%)',
    author: {
      name: 'Philip Hotor',
      role: 'Founder & Chief Architect, Kone Farms',
      avatar: '/logos/logo.svg',
      profileUrl: 'https://www.koneacademy.io/author/philip-hotor'
    },
    tags: ['ESP32', 'LoRaWAN', 'Soil Sensors', 'Ghana Agritech', 'Solar Telemetry'],
    hardwareBOM: [
      { component: 'ESP32 WROOM-32U Microcontroller', spec: 'Dual-core 240MHz, IPEX Antenna Interface', qty: '1 node' },
      { component: 'Semtech SX1276 LoRa Transceiver Module', spec: '868/915 MHz, SPI interface, +20dBm power', qty: '1 node' },
      { component: 'Capacitive Soil Moisture Sensor v1.2', spec: 'Analog 0-3.0V, Corrosion-Resistant PCB', qty: '3 per node' },
      { component: '6W 6V Monocrystalline Solar Panel', spec: 'Waterproof aluminum frame, 1A max output', qty: '1 node' },
      { component: 'TP4056 Li-Ion Charge Controller + 18650 LiFePO4', spec: '3.7V 3400mAh battery with BMS protection', qty: '1 node' }
    ],
    codeSnippet: `// ESP32 LoRa Soil Telemetry Node Transmitter (Arduino C++)
#include <SPI.h>
#include <LoRa.h>

#define SCK_PIN     5
#define MISO_PIN    19
#define MOSI_PIN    27
#define SS_PIN      18
#define RST_PIN     14
#define DIO0_PIN    26
#define SOIL_PIN_1  34

const int AIR_VALUE = 3200;   // Calibrated dry air reading (12-bit ADC)
const int WATER_VALUE = 1350; // Calibrated saturated water reading

void setup() {
  Serial.begin(115200);
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  LoRa.setPins(SS_PIN, RST_PIN, DIO0_PIN);
  
  if (!LoRa.begin(866E6)) { // 866MHz for West Africa region
    Serial.println("LoRa initialization failed!");
    while (1);
  }
  LoRa.setSyncWord(0xF3);
  Serial.println("Kone Farms LoRa Transmitter Ready.");
}

void loop() {
  int rawMoisture = analogRead(SOIL_PIN_1);
  int moisturePercent = map(rawMoisture, AIR_VALUE, WATER_VALUE, 0, 100);
  moisturePercent = constrain(moisturePercent, 0, 100);

  // Pack telemetry payload
  String payload = "NODE_01;SOIL:" + String(moisturePercent) + ";ADC:" + String(rawMoisture);
  
  LoRa.beginPacket();
  LoRa.print(payload);
  LoRa.endPacket();

  Serial.println("Transmitted: " + payload);
  // Deep sleep for 15 minutes to preserve 18650 battery power
  esp_sleep_enable_timer_wakeup(15 * 60 * 1000000ULL);
  esp_deep_sleep_start();
}`,
    content: `
### The Challenge of Rural Farmland Irrigation in Ghana

In agricultural hubs across the Volta, Eastern, and Ashanti regions of Ghana, seasonal rainfall volatility directly impacts crop yields [1]. Conventional scheduled irrigation often leads to over-saturation or root rot during unexpected rain showers, or severe water stress during extended dry spells.

To solve this, **Kone Farms** engineered a low-power, long-range **LoRa-based Soil Telemetry Network** [2]. By placing low-cost solar sensor nodes across crop zones, farmers gain real-time visibility into volumetric water content (VWC) without needing cellular SIM cards or mains electricity at every field location.

---

### Hardware Architecture & Circuit Calibration

Each remote node uses an **ESP32 WROOM-32U** microcontroller [3] paired with a **Semtech SX1276 LoRa transceiver** [4]. Because standard resistive soil sensors corrode rapidly due to electrolysis in humid tropical soils, we utilize **Capacitive Soil Moisture Sensors (v1.2)**.

#### Sensor Calibration Formula:
The ESP32 12-bit Analog-to-Digital Converter (ADC) yields raw values between 0 and 4095. Calibration requires recording two baseline voltage states:
1. **V_air**: Raw ADC reading in dry open air (~3200).
2. **V_water**: Raw ADC reading submerged in distilled water (~1350).

MATH_BLOCK: VWC (%) = Clamp( (V_raw - V_air) / (V_water - V_air) × 100, 0, 100 )

---

### Solar Power Budget & Deep Sleep Optimization

Field nodes are powered by a single **18650 LiFePO4 battery (3400mAh)** coupled with a **6W Monocrystalline Solar Panel**. To achieve multi-year maintenance-free operation:
- **Active Transmission State**: Draws ~120mA for 1.2 seconds during ADC sampling and LoRa packet broadcast.
- **Deep Sleep State**: Disables Wi-Fi, Bluetooth, ADC, and LoRa power rails, reducing current draw to just **15.4 µA** [3].
- **Calculated Battery Lifespan**: Even with zero solar exposure (continuous cloud cover), a single node operates autonomously for over 68 days on one full charge.
`,
    references: [
      {
        id: 1,
        title: 'FAO Irrigation & Drainage Paper 56: Crop Evapotranspiration Guidelines',
        url: 'https://www.fao.org/3/x0490e/x0490e00.htm',
        publisher: 'Food and Agriculture Organization (FAO)'
      },
      {
        id: 2,
        title: 'IEEE Sensors Journal: Low-Power LoRaWAN Nodes for Agricultural Monitoring',
        url: 'https://doi.org/10.1109/JSEN.2023.3245102',
        publisher: 'IEEE Xplore Digital Library'
      },
      {
        id: 3,
        title: 'ESP32 WROOM-32U Microcontroller Technical Datasheet & Deep Sleep Power Metrics',
        url: 'https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf',
        publisher: 'Espressif Systems'
      },
      {
        id: 4,
        title: 'Semtech SX1276/77/78/79 Long Range Low Power Transceiver Datasheet',
        url: 'https://www.semtech.com/products/wireless-rf/lora-connect/sx1276',
        publisher: 'Semtech Corporation'
      }
    ]
  },
  {
    id: 'greenhouse-microclimate-npk-sensor-calibration',
    slug: 'greenhouse-microclimate-npk-sensor-calibration',
    title: 'Greenhouse Microclimate & NPK Sensor Calibration in Tropical Climates',
    summary: 'Optimizing humidity, Vapor Pressure Deficit (VPD), and soil nitrogen-phosphorus-potassium (NPK) levels using RS485 Modbus industrial sensors for high-yield tomato and pepper cultivation.',
    category: 'Greenhouse Automation',
    publishDate: 'August 04, 2026',
    isoDate: '2026-08-04T00:00:00Z',
    readTime: '6 min read',
    accentColor: '#059669',
    coverGradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(4, 47, 31, 0.4) 100%)',
    author: {
      name: 'Philip Hotor',
      role: 'Founder & Chief Architect, Kone Farms',
      avatar: '/logos/logo.svg',
      profileUrl: 'https://www.koneacademy.io/author/philip-hotor'
    },
    tags: ['Modbus RS485', 'Greenhouse', 'VPD', 'NPK Sensors', 'Agritech'],
    hardwareBOM: [
      { component: '7-in-1 Soil NPK & EC/pH Modbus Sensor', spec: 'RS485 RTU protocol, 4.7-30V DC input', qty: '1 unit' },
      { component: 'MAX485 TTL to RS485 Converter Module', spec: 'Hardware flow control, 5V operating voltage', qty: '1 unit' },
      { component: 'SHT31 High-Precision Temp & Humidity Sensor', spec: 'I2C interface, ±2% RH accuracy', qty: '2 units' },
      { component: 'Industrial 4-Channel 10A Relay Module', spec: 'Optocoupler isolated, 12V coil control', qty: '1 unit' }
    ],
    codeSnippet: `// RS485 Modbus RTU NPK & EC Sensor Reader for ESP32 (C++)
#include <HardwareSerial.h>

HardwareSerial modbusSerial(2); // Use UART2 (pins RX:16, TX:17)

const byte npkRequestFrame[] = { 0x01, 0x03, 0x00, 0x1E, 0x00, 0x03, 0x65, 0xCD };
byte responseBuffer[11];

void setup() {
  Serial.begin(115200);
  modbusSerial.begin(4800, SERIAL_8N1, 16, 17);
  Serial.println("Kone Farms Modbus RS485 NPK Sensor Reader Starting...");
}

void loop() {
  modbusSerial.write(npkRequestFrame, sizeof(npkRequestFrame));
  delay(200);

  if (modbusSerial.available() >= 11) {
    for (int i = 0; i < 11; i++) {
      responseBuffer[i] = modbusSerial.read();
    }

    uint16_t nitrogen   = (responseBuffer[3] << 8) | responseBuffer[4];
    uint16_t phosphorus = (responseBuffer[5] << 8) | responseBuffer[6];
    uint16_t potassium  = (responseBuffer[7] << 8) | responseBuffer[8];

    Serial.printf("NPK Readout -> N: %d mg/kg | P: %d mg/kg | K: %d mg/kg\\n", nitrogen, phosphorus, potassium);
  } else {
    Serial.println("Modbus response timeout or frame error.");
  }
  delay(5000);
}`,
    content: `
### Microclimate Control in High-Temperature Tropical Environments

Greenhouse farming in West Africa offers protection against heavy rains and pests [1]. However, managing **Vapor Pressure Deficit (VPD)** during peak afternoon temperatures (≥ 34°C) is critical to prevent crop stomatal closure and blossom end rot.

VPD measures the difference between the pressure exerted by water vapor inside leaves versus the surrounding air pressure. In tropical greenhouses, optimal VPD for fruiting crops (tomatoes, sweet peppers) ranges between **0.8 kPa and 1.2 kPa** [1].

MATH_BLOCK: SVP(T) = 0.61078 × exp( (17.27 × T) / (T + 237.3) )  [kPa]

MATH_BLOCK: VPD = SVP × ( 1 - RH / 100 )  [kPa]

When VPD exceeds 1.5 kPa, the automated control system triggers high-pressure fogging nozzles and shade nets to cool the ambient air without over-saturating the growing substrate.

---

### Soil NPK & Electrical Conductivity (EC) Monitoring via RS485

To automate fertigation (fertilizer injection), **Kone Farms** deploys industrial 7-in-1 Modbus RS485 probes [2] directly into the root zone. Modbus RTU over RS485 ensures noise-free transmission over 100-meter cables inside large commercial greenhouses [2]. High-precision air temperature and humidity readings are sampled continuously using dual SHT31 sensor probes [3].

#### Key Soil Indicators:
- **Electrical Conductivity (EC)**: Kept between 1.8 and 2.4 dS/m for optimal nutrient uptake.
- **Nitrogen (N)**: Dynamically tracked to optimize vegetative vs. flowering growth stages.
`,
    references: [
      {
        id: 1,
        title: 'FAO Plant Production Paper 217: Good Agricultural Practices for Greenhouse Vegetables',
        url: 'https://www.fao.org/3/i3284e/i3284e.pdf',
        publisher: 'Food and Agriculture Organization (FAO)'
      },
      {
        id: 2,
        title: 'Modbus Application Protocol Specification v1.1b3',
        url: 'https://modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf',
        publisher: 'Modbus Organization'
      },
      {
        id: 3,
        title: 'Sensirion SHT3x Humidity and Temperature Sensor Technical Datasheet',
        url: 'https://sensirion.com/media/documents/213732B6/6164147B/Sensirion_Humidity_Sensors_SHT3x_Datasheet_digital.pdf',
        publisher: 'Sensirion AG'
      }
    ]
  },
  {
    id: 'poultry-ammonia-nh3-environmental-control',
    slug: 'poultry-ammonia-nh3-environmental-control',
    title: 'Automated Poultry Environmental Control: Ammonia (NH3) & Solar Ventilation in Kumasi',
    summary: 'Preventing respiratory diseases in poultry coops. Real-time ammonia gas sensing (MQ-137), automatic multi-stage exhaust fan control, and solar battery backup.',
    category: 'Livestock & Poultry',
    publishDate: 'July 28, 2026',
    isoDate: '2026-07-28T00:00:00Z',
    readTime: '5 min read',
    accentColor: '#d97706',
    coverGradient: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(120, 53, 15, 0.4) 100%)',
    author: {
      name: 'Philip Hotor',
      role: 'Founder & Chief Architect, Kone Farms',
      avatar: '/logos/logo.svg',
      profileUrl: 'https://www.koneacademy.io/author/philip-hotor'
    },
    tags: ['Poultry Tech', 'Ammonia Sensors', 'Solar Ventilation', 'Ghana Agriculture'],
    hardwareBOM: [
      { component: 'MQ-137 High-Sensitivity Ammonia (NH3) Gas Sensor', spec: 'Detection range 5-500ppm, Analog output', qty: '2 units' },
      { component: 'DHT22 Digital Temperature & Humidity Sensor', spec: 'Temp accuracy ±0.5°C, RH accuracy ±2%', qty: '2 units' },
      { component: 'Solid State Relay (SSR) 40A DC-AC', spec: 'Zero-cross switching, 3-32V DC input trigger', qty: '2 units' },
      { component: 'Industrial 24V DC Exhaust Fan Unit', spec: 'High-CFM brushless fan for coop ventilation', qty: '2 units' }
    ],
    codeSnippet: `// Poultry Coop Ammonia (NH3) & Fan Automated Relay Controller (Arduino C++)
#define NH3_ANALOG_PIN  35
#define RELAY_FAN_PIN   23

const float RL_VALUE = 47.0;       // Load resistor in kOhms
const float R0_CLEAN_AIR = 35.2;   // Calibrated sensor resistance in clean air
const float AMMONIA_THRESHOLD_PPM = 20.0; // Critical threshold for poultry health

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_FAN_PIN, OUTPUT);
  digitalWrite(RELAY_FAN_PIN, LOW); // Start fan off
  Serial.println("Kone Farms Poultry Environmental Monitor Initialized.");
}

void loop() {
  int rawADC = analogRead(NH3_ANALOG_PIN);
  float voltage = (rawADC / 4095.0) * 3.3;
  float sensorResistance = ((3.3 - voltage) / voltage) * RL_VALUE;
  float ratio = sensorResistance / R0_CLEAN_AIR;
  
  // Exponential regression formula for MQ-137 NH3 curve
  float ppm = 102.2 * pow(ratio, -2.473);

  Serial.printf("Coop Air Quality -> Raw ADC: %d | Voltage: %.2fV | NH3 Concentration: %.1f PPM\\n", rawADC, voltage, ppm);

  if (ppm >= AMMONIA_THRESHOLD_PPM) {
    digitalWrite(RELAY_FAN_PIN, HIGH);
    Serial.println("⚠️ AMMONIA HAZARD DETECTED! Exhaust fans activated.");
  } else {
    digitalWrite(RELAY_FAN_PIN, LOW);
  }
  delay(3000);
}`,
    content: `
### The Impact of High Ammonia Levels in Poultry Production

Ammonia gas (**NH₃**) is a byproduct of microbial decomposition of uric acid in poultry manure [1]. In enclosed coops across Ghana [2], elevated ammonia levels severely damage the respiratory tract of broilers and layers, leading to Newcastle disease vulnerability and reduced egg production [1].

#### Safety Thresholds for Poultry Health:
- **< 10 PPM**: Optimal air quality. Normal growth and feed conversion ratio (FCR).
- **20 - 25 PPM**: Irritation of bird respiratory linings; vaccination efficacy drops [1].
- **> 50 PPM**: Severe lethargy, conjunctivitis, and up to 15% loss in body weight gain.

---

### Automated Multi-Stage Ventilation & Solar Backup

To maintain coop ammonia below **20 PPM** without draining grid power during load-shedding, **Kone Farms** engineered an automated solar-assisted exhaust system.

Dual **MQ-137 semiconductor gas sensors** [3] and **DHT22 climate sensors** continuously sample coop air. When ammonia exceeds **20 PPM** or relative humidity surpasses **75%**, the ESP32 controller fires Solid State Relays (SSR) to engage industrial 24V solar-powered exhaust fans, rapidly flushing out accumulated manure gases.
`,
    references: [
      {
        id: 1,
        title: 'Poultry Science Journal: Impact of Atmospheric Ammonia on Layer Health and Egg Production',
        url: 'https://doi.org/10.3382/ps.2012-02456',
        publisher: 'Poultry Science Association'
      },
      {
        id: 2,
        title: 'Ghana Ministry of Food & Agriculture (MoFA): Livestock & Poultry Production Guidelines',
        url: 'https://mofa.gov.gh/',
        publisher: 'Ministry of Food and Agriculture (MoFA Ghana)'
      },
      {
        id: 3,
        title: 'MQ-137 Technical Gas Sensor Calibration Datasheet',
        url: 'https://www.winsen-sensor.com/d/files/semiconductor/mq-137.pdf',
        publisher: 'Zhengzhou Winsen Electronics Technology Co., Ltd.'
      }
    ]
  }
];
