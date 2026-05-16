import libraryData from './master_dataset.json';

export const PROJECT_MAP = {
  "Substructure": ["Excavation", "Piling & Shoring", "Foundations", "Water Proofing", "Retaining Wall"],
  "Superstructure": ["Columns & Beams", "Floor Slab", "Core Construction", "Roof structure"],
  "Building Envelope": ["External Wall", "Roofing", "Glazing", "Windows & Doors"],
  "First Install": ["Fire-Stopping", "Internal Partitioning", "MEP Rough-in", "Fire Sprinklers", "Elevators"],
  "Second Install": ["Internal Plastering", "Ceiling Installation", "Bathroom Installation", "Kitchen & Appliances", "Second Fix MEP", "Joinery", "Flooring", "Electrical Installation", "Internal Finishes"],
  "External Works": ["Landscaping"],
  "Testing, Commissioning & Handover": ["Testing & Balancing", "Electrical Certification", "Snagging", "Final Inspection", "Practical Completion"]
};

// ADD THIS EXPORT BLOCK AT THE TOP: This provides the baseline values your dropdown needs
export const TYPOLOGY_BASELINES = {
  "Single Family Home": { gia: 200, storeys: 2, wallArea: 0, windowArea: 0 },
  "Apartment Building": { gia: 3000, storeys: 5, wallArea: 0, windowArea: 0 },
  "Office": { gia: 5000, storeys: 8, wallArea: 0, windowArea: 0 },
  "School": { gia: 2500, storeys: 3, wallArea: 0, windowArea: 0 }
};

/**
 * 1. AUTOMATED GEOMETRY & TYPOLOGY DERIVATION RULE
 */
export const calculateDerivedParameters = (projectData) => {
  const typology = projectData.typology || 'Single Family Home';
  
  // Use the dictionary definition to protect calculations if numbers are missing
  const defaults = TYPOLOGY_BASELINES[typology] || TYPOLOGY_BASELINES["Single Family Home"];

  const gia = parseFloat(projectData.gia !== undefined ? projectData.gia : defaults.gia) || 0;
  const storeys = parseFloat(projectData.storeys !== undefined ? projectData.storeys : defaults.storeys) || 1;

  let derivedWallArea = 0;
  if (gia > 0 && storeys > 0) {
    const footprintArea = gia / storeys;
    const sideLength = Math.sqrt(footprintArea);
    derivedWallArea = Math.round(4 * sideLength * 3.5 * storeys);
  }

  const windowCoverageRatios = {
    "Single Family Home": 0.25,
    "Apartment Building": 0.30,
    "Office": 0.50,
    "School": 0.35
  };
  const ratio = windowCoverageRatios[typology] || 0.25;
  const derivedWindowArea = Math.round(derivedWallArea * ratio);

  const finalWallArea = (projectData.wallArea === 0 || !projectData.wallArea) ? derivedWallArea : parseFloat(projectData.wallArea);
  const finalWindowArea = (projectData.windowArea === 0 || !projectData.windowArea) ? derivedWindowArea : parseFloat(projectData.windowArea);

  return {
    ...projectData,
    typology,
    gia,
    storeys,
    wallArea: finalWallArea,
    windowArea: finalWindowArea
  };
};

export const getItemQuantity = (item, projectData) => {
  // 1. FORCE THE ENGINE TO CHECK IF THIS ITEM ACTUALLY EXISTS IN OUR SLICED TEMPLATE
  let itemExistsInTemplate = false;
  Object.values(BASE_PROJECT_TEMPLATE).forEach(tasksObj => {
    Object.values(tasksObj).forEach(itemsArray => {
      if (itemsArray.some(tItem => tItem.code === item.Code)) {
        itemExistsInTemplate = true;
      }
    });
  });

  if (!itemExistsInTemplate && item.Category !== 'Labor') {
    return 0;
  }
  
  const params = calculateDerivedParameters(projectData);
  
  const category = item.Category || '';
  if (category === 'Labor') {
    return 6; 
  }

  const unit = (item["U.M."] || item.Unit || '').toLowerCase().trim();
  const isM2 = unit.includes('m2') || unit.includes('m²');
  const identifierLower = (item.Identifier || '').toLowerCase();

  if (isM2) {
    if (identifierLower.includes('window') || identifierLower.includes('glaz')) {
      const primaryWindow = "bottom-hung window in natural oak";
      return identifierLower === primaryWindow ? (params.windowArea || 0) : 0;
    }

    if (identifierLower.includes('insulation')) {
      const primaryInsulation = "rock wool insulation panel";
      return identifierLower === primaryInsulation ? (params.wallArea || 0) : 0;
    }

    if (identifierLower.includes('wall') || identifierLower.includes('facade') || identifierLower.includes('partition')) {
      return params.wallArea || 0;
    }

    return params.gia / params.storeys;
  }

  return 0; 
};

/**
 * 3. SPLIT SAMPLING TEMPLATE GENERATOR
 */
export const generateSmartTemplate = () => {
  const template = {};
  Object.entries(PROJECT_MAP).forEach(([phase, tasks]) => {
    template[phase] = {};
    tasks.forEach(taskName => {
      const matchingItems = libraryData.filter(item => item.Task === taskName);
      if (matchingItems.length > 0) {
        const sampleRatio = (taskName === "Landscaping") ? 0.125 : 0.20;
        const sampleSize = Math.max(1, Math.floor(matchingItems.length * sampleRatio));
        
        template[phase][taskName] = matchingItems.slice(0, sampleSize).map(item => ({
          code: item.Code,
          name: item.Identifier,
          unit: item["U.M."],
          price: item["Price (€)"],
          factor: 1.0 
        }));
      }
    });
  });
  return template;
};

export const BASE_PROJECT_TEMPLATE = generateSmartTemplate();

export const getInitialQuantities = (projectData) => {
  const initialQty = {};
  libraryData.forEach(item => {
    initialQty[item.Code] = getItemQuantity(item, projectData);
  });
  return initialQty;
};

export default getInitialQuantities;