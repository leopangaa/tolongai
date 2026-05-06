/**
 * Searches disaster knowledge dataset by keyword (Philippines-optimized)
 * @param {string} query - Search query (English or Tagalog)
 * @param {Array} disasterKnowledgeArray - Array of disaster knowledge objects
 * @returns {Array<object>} Top 3 matching disaster objects ranked by relevance
 */
function searchHazards(query, disasterKnowledgeArray) {
  if (
    !query ||
    !Array.isArray(disasterKnowledgeArray) ||
    disasterKnowledgeArray.length === 0
  ) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Philippines-specific Tagalog to English mapping
  const tagalogSynonyms = {
    baha: ['flood', 'overflow', 'tubig', 'bumaha'],
    lindol: ['earthquake', 'pagyanig', 'tremor', 'lindolin'],
    bagyo: ['typhoon', 'cyclone', 'bagyo', 'hangin', 'ulan', 'signal'],
    sunog: ['fire', 'apoy', 'nasusunog', 'residential fire'],
    bulkan: ['volcanic eruption', 'volcano', 'eruption', 'pagputok', 'abo', 'lava'],
    tsunami: ['wave', 'alon', 'daluyong', 'tidal wave'],
    kidlat: ['thunderstorm', 'lightning', 'kulog', 'bagyo na may kulog'],
    pagguho: ['landslide', 'guiho', 'slope', 'lupa gumuho'],
    tagtuyot: ['drought', 'dry', 'init', 'el niño', 'walang ulan'],
    daluyong: ['storm surge', 'pagtaas ng alon', 'coastal flood', 'high tide'],
    pagputok: ['volcanic eruption', 'pagsabog', 'eruption']
  };

  // Expand query with synonyms
  const expandedQueryTerms = [normalizedQuery];
  
  for (const [tag, engTerms] of Object.entries(tagalogSynonyms)) {
    if (normalizedQuery.includes(tag) || engTerms.some(t => normalizedQuery.includes(t))) {
      expandedQueryTerms.push(tag, ...engTerms);
    }
  }

  const uniqueQueryTerms = [...new Set(expandedQueryTerms)];

  // Score each disaster based on relevance
  const scoredResults = disasterKnowledgeArray.map((disaster) => {
    let score = 0;

    // 1. EXACT MATCH (highest priority)
    const disasterTypeLower = disaster.disasterType.toLowerCase();
    if (disasterTypeLower === normalizedQuery) {
      score += 100;
    } else if (disasterTypeLower.includes(normalizedQuery)) {
      score += 50;
    }

    // 2. KEYWORD MATCH (English + Tagalog)
    const allKeywords = [
      ...(disaster.keywordsForSearch || []).map(k => k.toLowerCase()),
      ...(disaster.tagalogKeywords || []).map(k => k.toLowerCase())
    ];
    
    for (const keyword of allKeywords) {
      for (const queryTerm of uniqueQueryTerms) {
        if (keyword === queryTerm) {
          score += 30;
        } else if (keyword.includes(queryTerm) || queryTerm.includes(keyword)) {
          score += 15;
        }
      }
    }

    // 3. WARNING SIGNS (partial match - lower weight)
    if (disaster.warningSigns && Array.isArray(disaster.warningSigns)) {
      for (const sign of disaster.warningSigns) {
        if (sign.toLowerCase().includes(normalizedQuery)) {
          score += 5; // Reduced from 10 to avoid noise
        }
      }
    }

    // 4. LOCAL AGENCY MATCH (bonus for agency-specific queries)
    if (disaster.localAgency && disaster.localAgency.toLowerCase().includes(normalizedQuery)) {
      score += 25;
    }

    // 5. Fuzzy matching only if score is low (performance optimization)
    if (score < 20) {
      const levenshteinScore = calculateSimilarity(normalizedQuery, disasterTypeLower);
      if (levenshteinScore > 0.6) {
        score += Math.round(levenshteinScore * 15);
      }
    }

    return { ...disaster, relevanceScore: score };
  });

  // Filter and sort
  return scoredResults
    .filter(result => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3)
    .map(({ relevanceScore, ...disaster }) => disaster);
}

// Levenshtein functions remain the same
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

export default searchHazards;