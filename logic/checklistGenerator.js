/**
 * Generates personalized checklist based on disaster type and user profile
 * @param {string} disasterType - Type of disaster (matches disasterKnowledge dataset)
 * @param {{hasPets:boolean, hasElderly:boolean, hasInfants:boolean, hasMedicalNeeds:boolean, livesInFloodZone:boolean, livesInCoastalArea:boolean, livesNearVolcano:boolean, livesOnSteepSlope:boolean}} userProfile
 * @returns {Array<{item:string, category:string, priority:number, estimatedMinutes:number}>}
 */
function generateChecklist(disasterType, userProfile = {}) {
  const baseChecklist = [
    {
      item: 'Magtabi ng 1 gallon na tubig per person per day (7 days minimum)',
      category: 'water_food',
      priority: 1,
      estimatedMinutes: 30
    },
    {
      item: 'Magtabi ng 7-araw na pagkain (de lata, noodles, biscuits, tsokolate)',
      category: 'water_food',
      priority: 1,
      estimatedMinutes: 45
    },
    {
      item: 'Maghanda ng first aid kit (bandage, antiseptic, gamot sa lagnat)',
      category: 'medical',
      priority: 1,
      estimatedMinutes: 20
    },
    {
      item: 'Mag-imbak ng mahahalagang dokumento sa waterproof bag',
      category: 'documents',
      priority: 2,
      estimatedMinutes: 25
    },
    {
      item: 'Gumawa ng family emergency communication plan at meeting point',
      category: 'communication',
      priority: 1,
      estimatedMinutes: 15
    },
    {
      item: 'Mag-charge ng powerbank at flashlight (siguraduhing fully charged)',
      category: 'communication',
      priority: 1,
      estimatedMinutes: 10
    },
    {
      item: 'Magtabi ng battery-powered radio para sa PAGASA/NDRRMC updates',
      category: 'communication',
      priority: 1,
      estimatedMinutes: 5
    },
    {
      item: 'Maghanda ng go bag at maging handang lumikas anumang oras',
      category: 'evacuation',
      priority: 1,
      estimatedMinutes: 20
    }
  ];

  // Conditional items based on user profile
  const conditionalChecklist = [];

  if (userProfile.hasPets) {
    conditionalChecklist.push(
      {
        item: 'Maghanda ng pet carrier, leash, at diaper para sa alaga',
        category: 'pets',
        priority: 2,
        estimatedMinutes: 15
      },
      {
        item: 'Magtabi ng 7-araw na pagkain at tubig ng alaga',
        category: 'pets',
        priority: 2,
        estimatedMinutes: 10
      },
      {
        item: 'Magtabi ng recent photo at vaccination records ng alaga',
        category: 'pets',
        priority: 2,
        estimatedMinutes: 5
      }
    );
  }

  if (userProfile.hasElderly) {
    conditionalChecklist.push(
      {
        item: 'Magtabi ng 30-araw supply ng reseta at maintenance medicines',
        category: 'medical',
        priority: 1,
        estimatedMinutes: 20
      },
      {
        item: 'Maghanda ng mobility aids (walker, cane, wheelchair) para sa paglikas',
        category: 'special_needs',
        priority: 1,
        estimatedMinutes: 15
      },
      {
        item: 'Magdala ng medical records at doctor\'s contact numbers',
        category: 'documents',
        priority: 1,
        estimatedMinutes: 15
      }
    );
  }

  if (userProfile.hasInfants) {
    conditionalChecklist.push(
      {
        item: 'Magtabi ng 30-araw supply ng formula, diapers, at baby food',
        category: 'water_food',
        priority: 1,
        estimatedMinutes: 45
      },
      {
        item: 'Maghanda ng baby first aid kit (paracetamol drops, ointment, thermometer)',
        category: 'medical',
        priority: 1,
        estimatedMinutes: 20
      },
      {
        item: 'Magtabi ng vaccination records at pediatrician contact number',
        category: 'documents',
        priority: 1,
        estimatedMinutes: 10
      }
    );
  }

  if (userProfile.hasMedicalNeeds) {
    conditionalChecklist.push(
      {
        item: 'Magtabi ng 30-araw supply ng lahat ng maintenance medications',
        category: 'medical',
        priority: 1,
        estimatedMinutes: 15
      },
      {
        item: 'Maghanda ng medical equipment (inhaler, insulin, nebulizer)',
        category: 'medical',
        priority: 1,
        estimatedMinutes: 10
      },
      {
        item: 'Magdala ng medical alert card at emergency contact numbers',
        category: 'documents',
        priority: 1,
        estimatedMinutes: 10
      }
    );
  }

  if (userProfile.livesInFloodZone) {
    conditionalChecklist.push(
      {
        item: 'Alamin ang evacuation routes at mataas na lugar mula sa barangay',
        category: 'evacuation',
        priority: 1,
        estimatedMinutes: 20
      },
      {
        item: 'Hanapin ang pinakamalapit na evacuation center gamit ang app',
        category: 'evacuation',
        priority: 1,
        estimatedMinutes: 15
      },
      {
        item: 'Ilipat ang mahahalagang gamit sa second floor o mataas na lugar',
        category: 'shelter',
        priority: 1,
        estimatedMinutes: 60
      },
      {
        item: 'Makipag-coordinate sa barangay para sa flood early warning system',
        category: 'communication',
        priority: 2,
        estimatedMinutes: 15
      }
    );
  }

  if (userProfile.livesInCoastalArea) {
    conditionalChecklist.push(
      {
        item: 'Alamin ang tsunami evacuation route papunta sa mataas na lugar (10m+ elevation)',
        category: 'evacuation',
        priority: 1,
        estimatedMinutes: 30
      },
      {
        item: 'Siguraduhing alam ng pamilya ang storm surge at tsunami warning signals',
        category: 'communication',
        priority: 1,
        estimatedMinutes: 20
      },
      {
        item: 'I-practice ang coastal evacuation drill tuwing may malakas na lindol',
        category: 'evacuation',
        priority: 2,
        estimatedMinutes: 25
      }
    );
  }

  if (userProfile.livesNearVolcano) {
    conditionalChecklist.push(
      {
        item: 'Magtabi ng N95 masks at goggles para sa ashfall (PHIVOLCS alert)',
        category: 'medical',
        priority: 1,
        estimatedMinutes: 15
      },
      {
        item: 'Alamin ang PHIVOLCS alert levels at evacuation procedures para sa bulkan',
        category: 'evacuation',
        priority: 1,
        estimatedMinutes: 20
      },
      {
        item: 'Maghanda ng go bag na may mask, salamin, at close-fitting clothes',
        category: 'evacuation',
        priority: 1,
        estimatedMinutes: 15
      }
    );
  }

  if (userProfile.livesOnSteepSlope) {
    conditionalChecklist.push(
      {
        item: 'Alamin ang landslide signs (ground cracks, tilting trees, seepage)',
        category: 'evacuation',
        priority: 1,
        estimatedMinutes: 15
      },
      {
        item: 'Makipag-coordinate sa barangay para sa landslide monitoring',
        category: 'communication',
        priority: 1,
        estimatedMinutes: 20
      },
      {
        item: 'Iwasang magtayo ng bahay sa steep slopes o magpalit ng location kung delikado',
        category: 'shelter',
        priority: 2,
        estimatedMinutes: 120
      }
    );
  }

  // Disaster-specific items (now matching PH disaster types)
  const disasterSpecificItems = getDisasterSpecificItems(
    disasterType,
    userProfile
  );

  // Combine all checklists and sort by priority
  const fullChecklist = [
    ...baseChecklist,
    ...conditionalChecklist,
    ...disasterSpecificItems
  ];

  // Remove duplicates by item text (optional but recommended)
  const uniqueChecklist = [];
  const itemSet = new Set();
  for (const item of fullChecklist) {
    if (!itemSet.has(item.item)) {
      itemSet.add(item.item);
      uniqueChecklist.push(item);
    }
  }

  uniqueChecklist.sort((a, b) => a.priority - b.priority);
  return uniqueChecklist;
}

/**
 * Get disaster-specific checklist items for Philippines disasters
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
          item: 'Mag-charge ng lahat ng powerbank at mobile devices bago dumating ang Signal #1',
          category: 'communication',
          priority: 1,
          estimatedMinutes: 15
        },
        {
          item: 'I-secure ang mga outdoor items (plants, bubong, signages) laban sa hangin',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 45
        },
        {
          item: 'Magtabi ng plywood, martilyo, at duct tape para sa bintana (kung Signal #3 pataas)',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 60
        },
        {
          item: 'Monitor PAGASA typhoon updates sa radyo kada 2 oras',
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
          item: 'Linisan ang drainage at gutter ng bahay para bumilis ang daloy ng tubig',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 45
        },
        {
          item: 'Magtabi ng mga mahahalagang gamit sa mataas na lugar (second floor)',
          category: 'shelter',
          priority: 1,
          estimatedMinutes: 60
        },
        {
          item: 'Maghanda ng sako ng buhangin (sandbags) para i-block ang pinto',
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
          item: 'I-secure ang mabibigat na furniture (cabinet, shelves, TV) sa pader',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 60
        },
        {
          item: 'Alamin ang drop, cover, and hold positions sa bawat kwarto',
          category: 'shelter',
          priority: 1,
          estimatedMinutes: 15
        },
        {
          item: 'Magsagawa ng earthquake drill kasama ang pamilya (buwanan)',
          category: 'evacuation',
          priority: 2,
          estimatedMinutes: 20
        },
        {
          item: 'Magtabi ng flashlight sa tabi ng kama at sa bawat kuwarto',
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
          item: 'Magtabi ng N95 mask at goggles para sa ashfall (1 per person)',
          category: 'medical',
          priority: 1,
          estimatedMinutes: 15
        },
        {
          item: 'Alamin ang PHIVOLCS alert levels at angkop na evacuation procedures',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 20
        },
        {
          item: 'Siguraduhing sarado ang lahat ng bintana at pinto para hindi pumasok ang abo',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 10
        },
        {
          item: 'Magtabi ng extra tubig (maaaring kontaminado ang supply ng ashfall)',
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
          item: 'Alamin ang early warning signs: ground cracks, tilting trees, water seepage',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 15
        },
        {
          item: 'Makipag-coordinate sa barangay para sa landslide monitoring at evacuation plan',
          category: 'communication',
          priority: 1,
          estimatedMinutes: 20
        },
        {
          item: 'Iwasang magtayo ng bahay sa steep slopes (umilag sa "no-build zones")',
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
          item: 'Alamin at mag-practice ng tsunami evacuation route papunta sa high ground (10m+)',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 30
        },
        {
          item: 'Kapag may malakas na lindol sa dagat, lumikas agad — wag maghintay ng warning',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 5
        },
        {
          item: 'Iwasang pumunta sa beach para manood — delikado ang sudden wave rise',
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
          item: 'Gumawa ng 2 evacuation routes mula sa bahay (isang pangunahin at isang alternate)',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 20
        },
        {
          item: 'Magsagawa ng fire drill kasama ang pamilya tuwing 6 na buwan',
          category: 'evacuation',
          priority: 2,
          estimatedMinutes: 15
        },
        {
          item: 'Maglagay ng fire extinguisher sa accesible na lugar (kusina, garahe)',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 10
        },
        {
          item: 'Siguraduhing gumagana ang smoke detector at may bagong battery',
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
          item: 'Mag-imbak ng tubig sa malalaking container (drum, timba, tangke)',
          category: 'water_food',
          priority: 1,
          estimatedMinutes: 60
        },
        {
          item: 'Bawasan ang paggamit ng tubig (reuse, recycle, conserve)',
          category: 'water_food',
          priority: 2,
          estimatedMinutes: 5
        },
        {
          item: 'Alamin ang water rationing schedule mula sa LGU/barangay',
          category: 'communication',
          priority: 2,
          estimatedMinutes: 15
        },
        {
          item: 'Maghanda ng electrolyte drinks para maiwasan ang dehydration',
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
          item: 'I-unplug ang mga electronic appliances bago dumating ang bagyo',
          category: 'shelter',
          priority: 2,
          estimatedMinutes: 10
        },
        {
          item: 'Manatili sa loob ng bahay at lumayo sa bintana habang kumukulog',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 1
        },
        {
          item: 'Iwasang gumamit ng landline phone at kumukulog',
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
          item: 'Lumikas sa high ground (10 meters above sea level) kung nasa coastal area',
          category: 'evacuation',
          priority: 1,
          estimatedMinutes: 30
        },
        {
          item: 'Monitor PAGASA storm surge alerts lalo na kung Signal #3 pataas',
          category: 'communication',
          priority: 1,
          estimatedMinutes: 5
        },
        {
          item: 'I-secure ang bangka at gamit sa dalampasigan',
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