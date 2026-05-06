import checklistRules from '../data/checklistRules.json';

/**
 * Generates personalized checklist based on disaster type and user profile
 * @param {string} disasterType - Type of disaster (matches disasterKnowledge dataset)
 * @param {{hasPets:boolean, hasElderly:boolean, hasInfants:boolean, hasMedicalNeeds:boolean, livesInFloodZone:boolean, livesInCoastalArea:boolean, livesNearVolcano:boolean, livesOnSteepSlope:boolean}} userProfile
 * @returns {Array<{item:string, category:string, priority:number, estimatedMinutes:number}>}
 */
function generateChecklist(disasterType, userProfile = {}) {
  const checklist = [];
  const addedItems = new Set();

  // Normalize disaster type
  const normalizedDisaster = disasterType ? disasterType.toLowerCase() : 'typhoon';

  // Process all rules from checklistRules.json
  for (const rule of checklistRules) {
    let shouldAdd = false;
    const triggerCondition = rule.triggerCondition || {};

    // Check if this is a base item (no trigger condition)
    if (Object.keys(triggerCondition).length === 0) {
      shouldAdd = true;
    }
    // Check if this item matches the disaster type
    else if (triggerCondition.disasterTypes) {
      shouldAdd = triggerCondition.disasterTypes.some(d => 
        d.toLowerCase() === normalizedDisaster
      );
    }
    // Check if this item matches user profile
    else if (triggerCondition.userProfile) {
      const profile = triggerCondition.userProfile;
      if (profile.hasElderly && userProfile.hasElderly) shouldAdd = true;
      if (profile.hasInfants && userProfile.hasInfants) shouldAdd = true;
      if (profile.hasPets && userProfile.hasPets) shouldAdd = true;
      if (profile.hasMedicalNeeds && userProfile.hasMedicalNeeds) shouldAdd = true;
      if (profile.livesInFloodZone && userProfile.livesInFloodZone) shouldAdd = true;
      if (profile.livesInCoastalArea && userProfile.livesInCoastalArea) shouldAdd = true;
      if (profile.livesNearVolcano && userProfile.livesNearVolcano) shouldAdd = true;
      if (profile.livesOnSteepSlope && userProfile.livesOnSteepSlope) shouldAdd = true;
    }

    // Add item if it matches and hasn't been added already
    if (shouldAdd && !addedItems.has(rule.checklistItem)) {
      checklist.push({
        item: rule.checklistItem,
        category: rule.category,
        priority: rule.priority,
        estimatedMinutes: rule.estimatedMinutes
      });
      addedItems.add(rule.checklistItem);
    }
  }

  // Sort by priority
  checklist.sort((a, b) => a.priority - b.priority);
  return checklist;
}

/**
 * Get disaster-specific checklist items for Philippines disasters (Hardcoded Fallback)
 * @param {string} disasterType
 * @param {object} userProfile
 * @returns {Array}
 */
function getDisasterSpecificItems(disasterType, userProfile) {
  const items = [];
  const type = disasterType.toLowerCase();

  switch (type) {
    case 'typhoon':
    case 'bagyo':
      items.push(
        {
          item: 'Charge all powerbanks and mobile devices before Signal #1 arrives',
          category: 'communication',
          priority: 1,
          estimatedMinutes: 15
        },
        {
          item: 'Secure outdoor items (plants, roofs, signs) against strong winds',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 45
        },
        {
          item: 'Prepare plywood, hammer, and duct tape for windows (if Signal #3 or higher)',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 60
        },
        {
          item: 'Monitor PAGASA typhoon updates on radio every 2 hours',
          category: 'communication',
          priority: 2,
          estimatedMinutes: 5
        }
      );
      break;

    case 'flood':
    case 'baha':
      items.push(
        {
          item: 'Clean house drainage and gutters to improve water flow',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 45
        },
        {
          item: 'Store important belongings in high places (second floor)',
          category: 'shelter',
          priority: 1,
          estimatedMinutes: 60
        },
        {
          item: 'Prepare sandbags to block doorways',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 30
        }
      );
      break;

    case 'earthquake':
    case 'lindol':
      items.push(
        {
          item: 'Secure heavy furniture (cabinets, shelves, TV) to the wall',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 60
        },
        {
          item: 'Identify drop, cover, and hold positions in every room',
          category: 'shelter',
          priority: 1,
          estimatedMinutes: 15
        },
        {
          item: 'Practice earthquake drill with family (monthly)',
          category: 'evacuation',
          priority: 2,
          estimatedMinutes: 20
        },
        {
          item: 'Keep a flashlight next to your bed and in every room',
          category: 'communication',
          priority: 1,
          estimatedMinutes: 10
        }
      );
      break;

    case 'volcanic eruption':
    case 'volcano':
    case 'bulkan':
      items.push(
        {
          item: 'Stock N95 masks and goggles for ashfall (1 per person)',
          category: 'medical',
          priority: 1,
          estimatedMinutes: 15
        },
        {
          item: 'Know PHIVOLCS alert levels and appropriate evacuation procedures',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 20
        },
        {
          item: 'Ensure all windows and doors are closed to prevent ash from entering',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 10
        },
        {
          item: 'Store extra water (ashfall may contaminate water supply)',
          category: 'water_food',
          priority: 1,
          estimatedMinutes: 30
        }
      );
      break;

    case 'landslide':
    case 'pagguho':
      items.push(
        {
          item: 'Learn early warning signs: ground cracks, tilting trees, water seepage',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 15
        },
        {
          item: 'Coordinate with barangay for landslide monitoring and evacuation plan',
          category: 'communication',
          priority: 1,
          estimatedMinutes: 20
        },
        {
          item: 'Avoid building houses on steep slopes (stay away from "no-build zones")',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 120
        }
      );
      break;

    case 'tsunami':
    case 'alon':
      items.push(
        {
          item: 'Learn and practice tsunami evacuation route to high ground (10m+ elevation)',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 30
        },
        {
          item: 'If there is a strong earthquake near the sea, evacuate immediately — don\'t wait for a warning',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 5
        },
        {
          item: 'Do not go to the beach to watch — sudden wave rise is dangerous',
          category: 'evacuation',
          priority: 2,
          estimatedMinutes: 1
        }
      );
      break;

    case 'fire':
    case 'sunog':
      items.push(
        {
          item: 'Create 2 evacuation routes from home (one primary and one alternate)',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 20
        },
        {
          item: 'Practice fire drill with family every 6 months',
          category: 'evacuation',
          priority: 2,
          estimatedMinutes: 15
        },
        {
          item: 'Place fire extinguisher in accessible area (kitchen, garage)',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 10
        },
        {
          item: 'Ensure smoke detector works and has fresh batteries',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 5
        }
      );
      break;

    case 'drought':
    case 'tagtuyot':
      items.push(
        {
          item: 'Store water in large containers (drums, buckets, tanks)',
          category: 'water_food',
          priority: 1,
          estimatedMinutes: 60
        },
        {
          item: 'Reduce water usage (reuse, recycle, conserve)',
          category: 'water_food',
          priority: 2,
          estimatedMinutes: 5
        },
        {
          item: 'Learn water rationing schedule from LGU/barangay',
          category: 'communication',
          priority: 2,
          estimatedMinutes: 15
        },
        {
          item: 'Prepare electrolyte drinks to prevent dehydration',
          category: 'medical',
          priority: 2,
          estimatedMinutes: 20
        }
      );
      break;

    case 'thunderstorm':
    case 'kidlat':
      items.push(
        {
          item: 'Unplug electronic appliances before the storm arrives',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 10
        },
        {
          item: 'Stay inside your home and away from windows while thundering',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 1
        },
        {
          item: 'Avoid using landline phones while thundering',
          category: 'communication',
          priority: 2,
          estimatedMinutes: 1
        }
      );
      break;

    case 'storm surge':
    case 'daluyong':
      items.push(
        {
          item: 'Evacuate to high ground (10 meters above sea level) if in coastal area',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 30
        },
        {
          item: 'Monitor PAGASA storm surge alerts especially if Signal #3 or higher',
          category: 'communication',
          priority: 1,
          estimatedMinutes: 5
        },
        {
          item: 'Secure boats and belongings on the shoreline',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 45
        }
      );
      break;

    default:
      // Unknown disaster type — return generic items only
      break;
  }

  return items;
}

export default generateChecklist;