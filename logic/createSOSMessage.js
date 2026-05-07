/**
 * Generates SOS message for emergency communication (Philippines-optimized)
 * @param {string} userName - Person's name
 * @param {{city?: string, region?: string, barangay?: string, address?: string, latitude?: number, longitude?: number}} location - Location data
 * @param {string} disasterType - Type of disaster (from disasterKnowledge)
 * @param {string} additionalNotes - Extra information (injuries, trapped, etc.)
 * @param {Object} options - Optional settings
 * @param {boolean} options.includeNumbers - Include emergency hotline numbers in SMS
 * @param {boolean} options.tagalogMode - Generate Tagalog version instead
 * @returns {{smsText: string, shareablePayload: object, smsTagalog?: string}}
 */
function createSOSMessage(userName, location = {}, disasterType = '', additionalNotes = '', options = {}) {
  const { includeNumbers = true, tagalogMode = false } = options;
  const timestamp = new Date().toISOString();
  const locationString = formatLocation(location);
  const mapsLink = generateMapsLink(location);

  // Philippines emergency numbers
  const emergencyNumbers = {
    general: '911',
    redCross: '143',
    policeFire: '117'
  };

  const numbersString = ` Call ${emergencyNumbers.general} or ${emergencyNumbers.redCross}.`;

  // English version
  let smsText = '';
  
  if (tagalogMode) {
    smsText = buildTagalogSMS(userName, locationString, disasterType, additionalNotes, emergencyNumbers);
  } else {
    smsText = buildEnglishSMS(userName, locationString, disasterType, additionalNotes, emergencyNumbers);
  }

  // Ensure SMS doesn't exceed 160 characters
  if (smsText.length > 160) {
    // Prioritize keeping location and disaster type
    const maxLen = 157;
    let truncated = smsText.substring(0, maxLen);
    
    // Remove partial word at end
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLen - 20) {
      truncated = truncated.substring(0, lastSpace);
    }
    
    smsText = truncated + '...';
  }

  // Build shareable payload
  const shareablePayload = {
    version: '1.1',
    timestamp: timestamp,
    sosInfo: {
      personName: userName,
      location: location,
      formattedLocation: locationString,
      disasterType: disasterType || 'Unknown',
      additionalNotes: additionalNotes || 'None',
      smsText: smsText,
      mapsLink: mapsLink
    },
    recommendedHotlines: emergencyNumbers,
    shareableFormats: {
      english: smsText,
      tagalog: tagalogMode ? smsText : buildTagalogSMS(userName, locationString, disasterType, additionalNotes, emergencyNumbers)
    }
  };

  const result = {
    smsText: smsText,
    shareablePayload: shareablePayload
  };

  // Include Tagalog version if not already primary
  if (!tagalogMode) {
    result.smsTagalog = buildTagalogSMS(userName, locationString, disasterType, additionalNotes, emergencyNumbers);
  }

  return result;
}

/**
 * Build English SMS message
 */
function buildEnglishSMS(userName, locationString, disasterType, additionalNotes, emergencyNumbers) {
  let smsText = `SOS: ${userName} needs help`;

  if (locationString && locationString !== 'No location provided') {
    smsText += ` at ${locationString}`;
  }

  if (disasterType) {
    smsText += `. ${disasterType}`;
  }

  if (additionalNotes) {
    smsText += `. ${additionalNotes}`;
  }

  smsText += `. Send rescue.`;
  
  if (locationString === 'No location provided') {
    smsText += ` Share my location if possible.`;
  }

  return smsText;
}

/**
 * Build Tagalog SMS message (Philippines-specific)
 */
function buildTagalogSMS(userName, locationString, disasterType, additionalNotes, emergencyNumbers) {
  let smsText = `SOS: Kailangan po ng tulong ni ${userName}`;

  if (locationString && locationString !== 'No location provided') {
    smsText += ` sa ${locationString}`;
  }

  if (disasterType) {
    // Map English disaster types to Tagalog
    const tagalogDisasters = {
      'typhoon': 'bagyo',
      'flood': 'baha',
      'earthquake': 'lindol',
      'volcanic eruption': 'pagputok ng bulkan',
      'landslide': 'pagguho',
      'tsunami': 'tsunami',
      'fire': 'sunog',
      'drought': 'tagtuyot',
      'thunderstorm': 'kidlat',
      'storm surge': 'daluyong'
    };
    
    const disasterKey = disasterType.toLowerCase();
    const tagalogType = tagalogDisasters[disasterKey] || disasterType;
    smsText += `. Sakuna: ${tagalogType}`;
  }

  if (additionalNotes) {
    smsText += `. Tala: ${additionalNotes}`;
  }

  smsText += `. Padala ng rescue.`;
  
  if (locationString === 'No location provided') {
    smsText += `. Pakishare ang lokasyon kung maaari.`;
  }

  return smsText;
}

/**
 * Format location data into readable string (Philippines-aware)
 * @param {{city?: string, region?: string, barangay?: string, address?: string, latitude?: number, longitude?: number}} location
 * @returns {string}
 */
function formatLocation(location) {
  if (!location || typeof location !== 'object') {
    return 'No location provided';
  }

  const parts = [];

  // Philippines priority order: barangay -> city/municipality -> region
  if (location.barangay) {
    parts.push(`Brgy. ${location.barangay}`);
  }

  if (location.address) {
    parts.push(location.address);
  }

  if (location.city) {
    parts.push(location.city);
  }

  if (location.region) {
    parts.push(location.region);
  }

  if (parts.length === 0) {
    if (location.latitude !== undefined && location.longitude !== undefined) {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
    return 'No location provided';
  }

  return parts.join(', ');
}

/**
 * Generate Google Maps link if coordinates are available
 * @param {{latitude?: number, longitude?: number}} location
 * @returns {string|null}
 */
function generateMapsLink(location) {
  if (
    location &&
    location.latitude !== undefined &&
    location.longitude !== undefined &&
    !isNaN(location.latitude) &&
    !isNaN(location.longitude)
  ) {
    return `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  }
  return null;
}

export default createSOSMessage;