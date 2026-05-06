/**
 * Detects user intent from text input using keyword matching (Philippines-optimized)
 * @param {string} userMessage - User input text (English or Tagalog)
 * @returns {{intent: string, confidence: number, extractedData: object}}
 */
function detectIntent(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Define intent patterns with keywords and priority (1 = highest)
  const intentPatterns = {
    sos_request: {
      keywords: [
        // Tagalog SOS keywords
        'tulong', 'saklolo', 'emergency', 'rescue', 'sagip', 'ligtas',
        'tawagan', 'makatulong', 'urgent', 'crisis', 'abot-kamay',
        'sobrang', 'apura', 'delikado', 'nasunog', 'nalulunod',
        'help', 'save', 'danger', 'critical'
      ],
      priority: 1,
      minConfidence: 0.3
    },
    hazard_search: {
      keywords: [
        // Tagalog PH disasters
        'baha', 'lindol', 'bagyo', 'sunog', 'bulkan', 'alon', 'kidlat',
        'pagguho', 'tagtuyot', 'daluyong', 'kulog', 'init', 'el niño',
        // English PH disasters
        'flood', 'earthquake', 'typhoon', 'fire', 'volcano', 'tsunami',
        'landslide', 'drought', 'storm surge', 'thunderstorm', 'eruption',
        // Related terms
        'sakuna', 'kalamidad', 'disaster', 'hazard'
      ],
      priority: 2,
      minConfidence: 0.2
    },
    hotline_request: {
      keywords: [
        // Tagalog
        'numero', 'tawag', 'pulis', 'bumbero', 'ambulansya', 'doktor',
        'ospital', 'poison', 'red cross', 'ndrrmc', 'pagasa', 'phivolcs',
        // English
        'hotline', 'contact', 'call', 'phone', 'police', 'fire', 'medical',
        'ambulance', 'doctor', 'hospital'
      ],
      priority: 3,
      minConfidence: 0.2
    },
    evacuation_center_lookup: {
      keywords: [
        // Tagalog
        'likas', 'shelter', 'ligtas na lugar', 'saan', 'dako', 'puntahan',
        'evacuation', 'center', 'bunkhouse', 'tanggapan', 'barangay hall',
        'evacuation center', 'evac center', 'evacuation centers',
        // English
        'evacuate', 'shelter', 'safe place', 'where', 'go to', 'refugee',
        'relief center', 'temporary shelter', 'assembly point'
      ],
      priority: 4,
      minConfidence: 0.15
    },
    checklist_generation: {
      keywords: [
        // Tagalog
        'checklist', 'handa', 'ihanda', 'kailangan', 'dapat', 'inilaan',
        'mag-imbak', 'mag-stock', 'grab bag', 'go bag', 'supplies',
        // English
        'prepare', 'preparation', 'items', 'supplies', 'stock', 'pack',
        'essentials', 'what to bring'
      ],
      priority: 5,
      minConfidence: 0.2
    },
    prep_advice: {
      keywords: [
        // Tagalog
        'paano', 'gabay', 'tips', 'alok', 'basag-kalsada',
        'kung paano', 'ano ang', 'mga dapat', 'payo',
        // English
        'how', 'advice', 'guide', 'steps', 'what to do',
        'during', 'after', 'before'
      ],
      priority: 6,
      minConfidence: 0.2
    }
  };

  let detectedIntent = 'unknown';
  let maxConfidence = 0;
  let matchedKeywords = [];

  // Check each intent pattern
  for (const [intent, pattern] of Object.entries(intentPatterns)) {
    let confidence = 0;
    const keywords = [];

    for (const keyword of pattern.keywords) {
      if (message.includes(keyword)) {
        // Penalize short keywords that match too easily
        const keywordBonus = keyword.length < 3 ? 0.15 : 0.3;
        confidence += keywordBonus;
        keywords.push(keyword);
      }
    }

    // Boost confidence if multiple keywords match
    if (keywords.length > 1) {
      confidence = Math.min(confidence * 1.3, 0.95);
    }

    // Apply minimum confidence threshold
    const minConf = pattern.minConfidence || 0.2;
    confidence = confidence < minConf ? 0 : Math.min(confidence, 1.0);

    if (confidence > maxConfidence) {
      maxConfidence = confidence;
      detectedIntent = intent;
      matchedKeywords = keywords;
    }
  }

  // Extract data based on detected intent
  const extractedData = extractContextData(message, detectedIntent);

  return {
    intent: detectedIntent,
    confidence: parseFloat(maxConfidence.toFixed(2)),
    matchedKeywords: matchedKeywords, // Optional debugging field
    extractedData: extractedData
  };
}

/**
 * Extract contextual data from message based on intent (Philippines-specific)
 * @param {string} message - Processed message
 * @param {string} intent - Detected intent
 * @returns {object}
 */
function extractContextData(message, intent) {
  const data = {
    timestamp: new Date().toISOString()
  };

  // Extract disaster type if hazard search (matching your disasterKnowledge dataset)
  if (intent === 'hazard_search') {
    const hazardKeywords = [
      // Match your exact disaster types
      { type: 'typhoon', keywords: ['bagyo', 'typhoon', 'signal', 'hangin'] },
      { type: 'flood', keywords: ['baha', 'flood', 'bumaha', 'tubig'] },
      { type: 'earthquake', keywords: ['lindol', 'earthquake', 'pagyanig', 'tremor'] },
      { type: 'volcanic eruption', keywords: ['bulkan', 'volcano', 'eruption', 'pagputok', 'abo'] },
      { type: 'landslide', keywords: ['pagguho', 'landslide', 'gumuho', 'slope'] },
      { type: 'tsunami', keywords: ['tsunami', 'alon', 'daluyong', 'tidal wave'] },
      { type: 'fire (urban)', keywords: ['sunog', 'fire', 'apoy', 'nasusunog'] },
      { type: 'drought', keywords: ['tagtuyot', 'drought', 'init', 'el niño'] },
      { type: 'thunderstorm', keywords: ['kidlat', 'thunderstorm', 'kulog', 'lightning'] },
      { type: 'storm surge', keywords: ['storm surge', 'daluyong', 'pagtaas ng alon'] }
    ];

    for (const hazard of hazardKeywords) {
      for (const keyword of hazard.keywords) {
        if (message.includes(keyword)) {
          data.disasterType = hazard.type;
          data.matchedKeyword = keyword;
          break;
        }
      }
      if (data.disasterType) break;
    }
  }

  // Extract location (Philippines context - city/barangay/region)
  const locationPatterns = [
    /(?:sa|at|dito sa)\s+([A-Za-z\s.,]+?)(?:\?|\.|,|$)/i,
    /(?:brgy\.?\s+|barangay\s+)([A-Za-z\s]+?)(?:\?|\.|,|$)/i,
    /nasa\s+([A-Za-z\s.,]+?)(?:\?|\.|,|$)/i,
    /(?:in|near)\s+([A-Za-z\s]+?)(?:\?|$)/i,
    /([A-Za-z\s]+?)\s+(?:evacuation|shelter|center)/i
  ];

  for (const pattern of locationPatterns) {
    const match = message.match(pattern);
    if (match) {
      data.location = match[1].trim();
      break;
    }
  }

  // Extract if user is asking about a specific PAGASA/PHIVOLCS alert
  if (message.includes('signal') || message.includes('alert level')) {
    const signalMatch = message.match(/signal\s*#?(\d+)/i);
    if (signalMatch) {
      data.alertSignal = parseInt(signalMatch[1]);
    }
  }

  return data;
}

export { detectIntent };

