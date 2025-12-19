export type ImageSearchInput = {
  style?: string // vintage | streetwear | classic | sporty | minimal-chic | edgy-bold | etc
  colors?: string[]
  bodyType?: string // hourglass | pear | apple | rectangle | inverted-triangle
  gender?: string // optional, could be 'women' | 'men' | 'unisex'
  ethnicity?: string // optional: asian | south-asian | black | latino | middle-eastern | white | mixed | indigenous | pacific-islander
  height?: number // cm
  occasion?: string // casual | professional | party | workout
  age?: string | number // optional: age range or numeric
  lifestyle?: string // optional: active | moderate | relaxed | mixed
  climate?: string // optional: tropical | temperate | cold | varied
  limit?: number
}

export type NormalizedImage = {
  id: string
  src: string
  width?: number
  height?: number
  alt: string
  author?: string
  link?: string
  provider: 'unsplash' | 'pexels'
  color?: string | null
}

export function buildSearchQuery(input: ImageSearchInput): {
  query: string
  orientation: 'portrait' | 'landscape' | 'squarish'
} {
  const terms: string[] = []

  // Style mapping
  if (input.style) {
    const styleMap: Record<string, string> = {
      vintage: 'vintage outfit street style',
      streetwear: 'streetwear outfit urban',
      classic: 'classic outfit business casual',
      sporty: 'athleisure sporty outfit',
      'minimal-chic': 'minimal outfit neutral tones',
      'edgy-bold': 'edgy bold fashion',
      'casual-comfort': 'casual outfit everyday',
      'polished-professional': 'professional outfit office',
      'eclectic-artsy': 'artsy outfit colorful',
      bohemian: 'bohemian boho outfit flowy',
      minimalist: 'minimalist clean lines fashion',
      preppy: 'preppy collegiate outfit',
      goth: 'goth dark fashion alternative',
      romantic: 'romantic feminine soft outfit',
      'grunge-rebel': 'grunge rebel outfit 90s',
      cottagecore: 'cottagecore prairie outfit floral',
      'y2k-futuristic': 'y2k futuristic tech fashion',
      earthcore: 'earthcore natural organic fashion',
    }
    terms.push(styleMap[input.style] || input.style)
  }

  // Body type hints (not strictly supported by providers, used as tags)
  if (input.bodyType) {
    const bodyMap: Record<string, string> = {
      hourglass: 'hourglass',
      pear: 'pear body',
      apple: 'apple body',
      rectangle: 'rectangle body',
      'inverted-triangle': 'inverted triangle body',
    }
    terms.push(bodyMap[input.bodyType] || input.bodyType)
  }

  // Height-based cues
  if (typeof input.height === 'number') {
    if (input.height <= 160) terms.push('petite')
    else if (input.height >= 185) terms.push('tall')
  }

  // Age cues (broad ranges)
  if (input.age) {
    const ageStr = input.age.toString()
    const ageNum = Number(ageStr)

    if (!Number.isNaN(ageNum)) {
      if (ageNum < 25) terms.push('young adult')
      else if (ageNum < 35) terms.push('adult style')
      else if (ageNum < 45) terms.push('mature professional')
      else if (ageNum < 60) terms.push('elegant mature')
      else terms.push('sophisticated senior')
    } else {
      if (ageStr.includes('18') || ageStr.includes('20')) terms.push('young adult')
      else if (ageStr.includes('25') || ageStr.includes('30') || ageStr.includes('35')) terms.push('adult style')
      else if (ageStr.includes('40') || ageStr.includes('45') || ageStr.includes('50')) terms.push('mature style')
      else if (ageStr.includes('55') || ageStr.includes('60') || ageStr.includes('65')) terms.push('elegant mature')
    }
  }

  // Lifestyle cues
  if (input.lifestyle) {
    const l = input.lifestyle
    if (l === 'active') terms.push('athleisure', 'comfort')
    if (l === 'moderate' || l === 'mixed') terms.push('versatile outfit', 'smart casual')
    if (l === 'relaxed') terms.push('casual relaxed fit', 'soft fabrics')
    if (l === 'office') terms.push('business casual', 'office wear')
    if (l === 'student') terms.push('campus outfit', 'casual')
    if (l === 'creative') terms.push('creative outfit', 'artsy')
    if (l === 'traveler') terms.push('travel outfit', 'layered')
    if (l === 'formal') terms.push('formal wear', 'evening outfit')
  }

  // Climate cues
  if (input.climate) {
    const c = input.climate
    if (c === 'tropical') terms.push('lightweight', 'breathable', 'summer')
    if (c === 'temperate') terms.push('layering')
    if (c === 'cold') terms.push('winter outfit', 'coats')
    if (c === 'dry') terms.push('light layers', 'neutral tones')
    if (c === 'four-season') terms.push('versatile layers')
  }

  // Occasion
  if (input.occasion) {
    const occ = input.occasion
    const occasionMap: Record<string, string[]> = {
      work: ['office outfit', 'smart casual'],
      casual: ['casual everyday'],
      evening: ['evening outfit', 'night out'],
      athletic: ['athleisure', 'performance wear'],
      travel: ['travel outfit', 'comfortable layers'],
      events: ['event wear', 'dressy outfit'],
      party: ['party outfit'],
      professional: ['professional outfit', 'business casual'],
    }
    terms.push(...(occasionMap[occ] || [occ]))
  }

  // Ethnicity / complexion (optional, helps tailor representation)
  if (input.ethnicity) {
    const eth = input.ethnicity.toLowerCase()
    if (eth.includes('asian') || eth.includes('east')) {
      terms.push('asian model', 'diverse')
    } else if (eth.includes('south-asian') || eth.includes('desi')) {
      terms.push('south asian', 'desi', 'diverse')
    } else if (eth.includes('black') || eth.includes('african')) {
      terms.push('black model', 'diverse')
    } else if (eth.includes('latino') || eth.includes('hispanic')) {
      terms.push('latino', 'hispanic', 'diverse')
    } else if (eth.includes('middle-eastern') || eth.includes('arab')) {
      terms.push('middle eastern', 'diverse')
    } else if (eth.includes('white') || eth.includes('caucasian')) {
      terms.push('model')
    } else if (eth.includes('mixed') || eth.includes('multiracial')) {
      terms.push('multiracial', 'diverse')
    } else if (eth.includes('indigenous') || eth.includes('native')) {
      terms.push('indigenous', 'native', 'diverse')
    } else if (eth.includes('pacific-islander') || eth.includes('pacific')) {
      terms.push('pacific islander', 'diverse')
    }
  }

  // Colors
  if (input.colors?.length) terms.push(...input.colors)

  // Gender (inclusive defaults)
  if (input.gender) {
    const g = input.gender.toLowerCase()
    if (g === 'women' || g === 'female' || g === 'feminine' || g === 'feminine-leaning') {
      terms.push('women outfit', 'gender neutral', 'androgynous')
    } else if (g === 'men' || g === 'male' || g === 'masculine' || g === 'masculine-leaning') {
      terms.push('men outfit', 'gender neutral', 'androgynous')
    } else if (g === 'unisex' || g === 'neutral' || g === 'nonbinary' || g === 'non-binary' || g === 'androgynous') {
      terms.push('unisex', 'gender neutral', 'androgynous')
    } else {
      // Unknown value, keep inclusive
      terms.push('gender neutral', 'unisex')
    }
  } else {
    // No gender provided → default to inclusive imagery
    terms.push('gender neutral', 'unisex')
  }

  const query = terms.filter(Boolean).join(' ').trim() || 'fashion outfit'

  return { query, orientation: 'portrait' }
}
