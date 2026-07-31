export type InteriorCard = {
  title: string;
  image: string;
  alt: string;
  label?: string;
  meta?: string;
  description: string;
};

export type EditableInteriorCard = InteriorCard & {
  id: string;
  section: "Hero" | "Main Services" | "Space-Saving" | "Kitchen" | "Living Room" | "Bedroom";
  category: "Complete Home" | "Kitchen" | "Living Room" | "Bedroom" | "Wardrobe" | "Storage";
  displayOrder: number;
  active: boolean;
};

const image = (name: string) => `/images/interiors/${name}.jpeg`;

const images = {
  bedroomStudy: image("bedroom-study-workstation"), kidsBunkBedroom: image("kids-bunk-bedroom"),
  masterBedroom: image("premium-master-bedroom"), kidsBedroomStudy: image("kids-bedroom-study"),
  marbleBedroom: image("marble-feature-bedroom"), entertainmentWall: image("wooden-entertainment-wall"),
  livingPooja: image("tv-unit-ganesh-pooja"), livingOpenKitchen: image("living-open-kitchen"),
  luxuryLiving: image("luxury-living-room"), breakfastKitchen: image("breakfast-counter-kitchen"),
  woodenIslandKitchen: image("wooden-island-kitchen"), straightKitchen: image("straight-kitchen-dining"),
  parallelKitchen: image("parallel-kitchen"), greyIslandKitchen: image("grey-island-kitchen"),
  lShapedKitchen: image("l-shaped-kitchen"), crockeryUnit: image("crockery-display-unit"),
  studyStorage: image("study-storage-unit"), underStairStorage: image("under-stair-storage"),
  storageBed: image("lift-up-storage-bed"), glassWardrobeIsland: image("glass-wardrobe-island"),
  stoneLiving: image("stone-wall-living-room"), concealedTvUnit: image("concealed-tv-unit"),
  pantry: image("pull-out-pantry"), wardrobeDressing: image("wardrobe-dressing-mirror"),
  walkInWardrobe: image("luxury-walk-in-wardrobe"), woodenBedroom: image("wooden-headboard-bedroom"),
};

export const interiorData = {
  hero: {
    eyebrow: "RS INTERIORS · BENGALURU", title: "Interiors designed around the way you live.",
    description: "From intelligent space planning and modular kitchens to elegant living rooms and complete home interiors, RS Construction delivers thoughtfully designed spaces with one accountable team.",
    image: images.livingOpenKitchen, alt: "Luxury open-plan living room with marble TV wall and adjoining kitchen",
  },
  trust: ["Complete Design-to-Execution", "Space-Smart Planning", "Transparent Specifications", "Dedicated Project Coordination"],
  services: [
    { title: "Living & Dining Interiors", label: "Social spaces", image: images.luxuryLiving, alt: "Luxury living room with curved wooden TV wall and indoor greenery", description: "TV units, feature walls, crockery units, display storage, partitions, lighting and customised furniture." },
    { title: "Modular Kitchens", label: "Made for daily life", image: images.greyIslandKitchen, alt: "Modern grey island kitchen with marble backsplash and pendant lighting", description: "L-shaped, U-shaped, parallel, island and straight modular kitchens with intelligent storage solutions." },
    { title: "Bedroom", label: "Personal retreats", image: images.masterBedroom, alt: "Premium master bedroom with upholstered bed and sculpted ceiling lighting", description: "Wardrobes, beds with storage, study units, dressing areas, side tables, lighting and customised finishes." },
    { title: "Wardrobes & Storage", label: "Organised living", image: images.walkInWardrobe, alt: "Luxury walk-in wardrobe with display shelves and central island", description: "Sliding wardrobes, walk-in wardrobes, loft storage, concealed storage and customised organisers." },
    { title: "False Ceiling & Lighting", label: "Layered ambience", image: images.stoneLiving, alt: "Premium living room with layered ceiling lighting and stone TV feature wall", description: "Layered ceilings, ambient lighting, task lighting, accent lighting and decorative electrical planning." },
    { title: "Home Improvement", label: "Careful upgrades", image: images.livingOpenKitchen, alt: "Complete open-plan living room renovation with integrated lighting and kitchen", description: "Painting, flooring, bathroom upgrades, electrical work, plumbing, civil modifications and deep cleaning." },
  ] satisfies InteriorCard[],
  spaceSaving: [
    ["Space-Smart Bunk Bedroom", "Two comfortable sleeping zones arranged vertically to preserve open floor area.", images.kidsBunkBedroom, "Space-saving kids bedroom with illuminated bunk beds and staircase storage"],
    ["Hidden Dressing Unit", "An integrated dressing position composed neatly between two glass-front wardrobes.", images.wardrobeDressing, "Integrated dressing unit between glass wardrobes with illuminated mirror"],
    ["Floor-to-Ceiling Wardrobe", "Full-height display storage paired with a useful central folding and storage island.", images.glassWardrobeIsland, "Floor-to-ceiling glass wardrobe with integrated lighting and storage island"],
    ["Kitchen Pantry Pull-Out", "Easy-access tall storage for groceries, jars and everyday essentials.", images.pantry, "White kitchen with open walk-in pantry and pull-out storage racks"],
    ["Storage Bed", "Useful concealed capacity built below a comfortable upholstered bed platform.", images.storageBed, "Luxury upholstered bed lifted upward to reveal concealed storage"],
    ["TV Unit with Concealed Storage", "Media, cables and daily clutter kept behind a composed full-height elevation.", images.concealedTvUnit, "Modern dark TV unit with concealed cabinets and illuminated display shelves"],
    ["Under-Stair Storage", "Custom cabinets and display shelves fitted into otherwise unused volume.", images.underStairStorage, "Under-stair storage cabinets with display shelves and warm lighting"],
    ["Foldable Study Desk", "A compact space-saving workstation paired with high-capacity mobile book storage.", images.studyStorage, "Space-saving study desk with pegboard and pull-out book storage"],
    ["Multi-Functional Crockery Unit", "Display, serving and closed storage combined in one dining feature.", images.crockeryUnit, "Luxury crockery display unit with glass cabinets and illuminated shelves"],
  ] as const,
  kitchens: [
    { title: "Kitchen with Breakfast Counter", image: images.breakfastKitchen, alt: "Open modular kitchen framed by an illuminated arch with breakfast counter seating", description: "A welcoming open layout with practical counter seating for quick meals." },
    { title: "Island Kitchen", image: images.woodenIslandKitchen, alt: "Premium island kitchen with stone worktop and four counter stools", description: "Warm timber cabinetry arranged around a generous central preparation island." },
    { title: "Parallel Kitchen", image: images.parallelKitchen, alt: "Bright parallel kitchen with marble backsplash and glass display cabinets", description: "Two long work runs balance preparation, cooking, cleaning and storage." },
    { title: "Straight Kitchen", image: images.straightKitchen, alt: "Modern straight kitchen with wooden upper cabinets and dining table", description: "A clean single-wall arrangement with an adjacent everyday dining zone." },
    { title: "U-Shaped Kitchen", image: images.greyIslandKitchen, alt: "Modern U-shaped kitchen with extensive grey cabinetry and marble worktops", description: "Three connected work runs provide clear circulation and extensive cabinetry." },
    { title: "L-Shaped Kitchen", image: images.lShapedKitchen, alt: "Luxury L-shaped modular kitchen with glass cabinets and integrated appliances", description: "Efficient corner planning with bright worktops and coordinated storage." },
  ] satisfies InteriorCard[],
  livingRooms: [
    { title: "Luxury Living Room", meta: "Living room", image: images.luxuryLiving, alt: "Luxury living room with curved wooden TV wall and green feature panel", description: "Soft seating, warm timber and greenery create a welcoming premium ambience." },
    { title: "Contemporary Living Room", meta: "Complete home", image: images.livingOpenKitchen, alt: "Contemporary living room with marble TV wall and adjoining open kitchen", description: "A spacious social zone composed around a large sectional and open kitchen." },
    { title: "Living Room with Pooja Unit", meta: "Living + pooja", image: images.livingPooja, alt: "Living room TV unit with illuminated Ganesh mandir and pooja niche", description: "A composed TV elevation with a dedicated illuminated Ganesh pooja niche." },
    { title: "Living Room with Display Storage", meta: "TV lounge", image: images.entertainmentWall, alt: "Living room with full-height wooden entertainment wall and illuminated display storage", description: "An expansive media wall combining display storage, natural finishes and layered light." },
  ] satisfies InteriorCard[],
  bedrooms: [
    { title: "Master Bedroom", image: images.masterBedroom, alt: "Luxury master bedroom with upholstered headboard and sculpted ceiling lighting", description: "A calm master suite with generous proportions and softly layered illumination." },
    { title: "Kids’ Bedroom", image: images.kidsBedroomStudy, alt: "Kids bedroom with toy display shelves and integrated study desk", description: "Playful display storage and a practical study position support changing routines." },
    { title: "Guest Bedroom", image: images.woodenBedroom, alt: "Welcoming guest bedroom with wooden headboard and balanced bedside lighting", description: "Warm wood, upholstered panels and balanced lighting create a welcoming secondary bedroom." },
    { title: "Compact Bedroom", image: images.kidsBunkBedroom, alt: "Compact bedroom with space-saving bunk beds and storage stairs", description: "Vertical sleeping zones and stair storage make efficient use of a compact footprint." },
    { title: "Bedroom with Study Unit", image: images.bedroomStudy, alt: "Modern bedroom with computer workstation and wall-to-wall bookshelves", description: "A dedicated computer desk and book storage are integrated without crowding the bed." },
  ] satisfies InteriorCard[],
  inclusions: [
    ["Design & Planning", ["Requirement consultation", "Space planning", "Mood boards", "Material selection", "2D layouts", "3D design visualisation"]],
    ["Modular Solutions", ["Modular kitchen", "Wardrobes", "TV units", "Crockery units", "Study units", "Custom storage"]],
    ["Interior Works", ["False ceiling", "Lighting", "Wall panelling", "Painting", "Flooring", "Electrical work"]],
    ["Execution & Management", ["Project coordination", "Quality checks", "Material tracking", "Progress updates", "Installation", "Final handover"]],
  ],
  process: [
    ["Consultation", "Understand the space, requirements, lifestyle and budget."], ["Site Measurement", "Capture dimensions, structural conditions and service points."],
    ["Concept & Space Planning", "Develop layouts, functionality and design direction."], ["3D Visualisation", "Present materials, finishes, colours and realistic design previews."],
    ["Finalisation & Quotation", "Confirm scope, specifications, timelines and costs."], ["Production & Execution", "Coordinate modular production and on-site interior work."],
    ["Quality Inspection", "Verify finishing, alignment, functionality and installation quality."], ["Handover", "Complete the final walkthrough and deliver the finished space."],
  ],
  portfolio: [
    ["Luxury L-Shaped Kitchen", "Bengaluru · Residential concept", "Kitchen", "Contemporary", "3 BHK", images.lShapedKitchen, "Luxury L-shaped modular kitchen with integrated appliances"],
    ["Wooden Entertainment Wall", "Bengaluru · Residential concept", "Living Room", "Warm modern", "Apartment", images.entertainmentWall, "Living room with wooden entertainment wall and illuminated shelving"],
    ["Wooden Master Suite", "Bengaluru · Residential concept", "Bedroom", "Modern", "Villa", images.woodenBedroom, "Luxury master bedroom with wooden headboard wall"],
    ["Walk-In Wardrobe Suite", "Bengaluru · Residential concept", "Wardrobe", "Luxury", "Villa", images.walkInWardrobe, "Luxury walk-in wardrobe with display storage and central island"],
    ["Open-Plan Complete Home", "Bengaluru · Residential concept", "Complete Home", "Contemporary", "3 BHK", images.livingOpenKitchen, "Open-plan complete home with living room, TV wall and kitchen"],
  ] as const,
  benefits: ["Construction and interiors under one roof", "Personalised design solutions", "Clear scope and specifications", "Dedicated project coordination", "Stage-wise quality checks", "Premium material options", "Transparent communication", "Timely execution planning"],
  packages: [
    ["Essential Interiors", "For practical and budget-conscious homes.", "Apartments and first homes", "Planning, layouts and material guidance", "Kitchen, wardrobes and essential storage", "Reliable standard options", "Focused"],
    ["Signature Interiors", "For modern homes with upgraded finishes and customised storage.", "2–4 BHK homes", "Full design development and 3D visualisation", "Coordinated modular solutions", "Upgraded finish options", "High"],
    ["Luxury Interiors", "For highly personalised spaces, premium materials and bespoke detailing.", "Villas and premium residences", "Bespoke design direction and detailing", "Custom modular and made-to-measure elements", "Premium material options", "Bespoke"],
  ],
  faqs: [
    ["How long does a complete home interior project take?", "Timelines depend on property size, design complexity, material selections and site readiness. After consultation and measurement, the team can provide a project-specific schedule."],
    ["Can you work with an already constructed home?", "Yes. Existing homes can be assessed for interior fit-outs or renovation work, subject to site conditions and the agreed scope."],
    ["Do you provide only modular kitchen services?", "Yes, modular kitchens can be planned as a focused service, depending on location, requirements and project suitability."],
    ["Can interior designs be customised?", "Yes. Layouts, finishes, storage and detailing are developed around your space, daily routines and preferences."],
    ["Do you provide 3D design previews?", "3D visualisation can be included in the agreed design scope so key spaces and material combinations can be reviewed before execution."],
    ["Can construction and interiors be handled together?", "Yes. RS Construction can coordinate architecture, construction and interiors under one accountable team when included in the project scope."],
    ["What factors affect interior-design pricing?", "Property size, number of spaces, modular scope, materials, hardware, finishes, site conditions and custom detailing all influence the final estimate."],
    ["Do you undertake renovation projects?", "Renovation and home-improvement work can be considered after a site review confirms the existing conditions and required changes."],
    ["Which Bengaluru locations do you serve?", "Service availability is confirmed during the first conversation based on the property location and project requirements."],
    ["How can I book a design consultation?", "Submit the consultation form on this page, call the team or start a WhatsApp conversation using the contact actions provided."],
  ],
};

export const interiorImages = images;

export const defaultInteriorCards: EditableInteriorCard[] = [
  { id: "interior-hero", section: "Hero", category: "Complete Home", title: "Interiors Hero", image: interiorData.hero.image, alt: interiorData.hero.alt, description: interiorData.hero.description, displayOrder: 1, active: true },
  ...interiorData.services.map((card, index) => ({ ...card, id: `interior-service-${index + 1}`, section: "Main Services" as const, category: card.title === "Modular Kitchens" ? "Kitchen" as const : card.title === "Bedroom" ? "Bedroom" as const : card.title.includes("Wardrobe") ? "Wardrobe" as const : "Living Room" as const, displayOrder: index + 1, active: true })),
  ...interiorData.spaceSaving.map(([title, description, image, alt], index) => ({ id: `interior-storage-${index + 1}`, section: "Space-Saving" as const, category: title.includes("Wardrobe") || title.includes("Dressing") ? "Wardrobe" as const : title.includes("Kitchen") ? "Kitchen" as const : "Storage" as const, title, description, image, alt, displayOrder: index + 1, active: true })),
  ...interiorData.kitchens.map((card, index) => ({ ...card, id: `interior-kitchen-${index + 1}`, section: "Kitchen" as const, category: "Kitchen" as const, displayOrder: index + 1, active: true })),
  ...interiorData.livingRooms.map((card, index) => ({ ...card, id: `interior-living-${index + 1}`, section: "Living Room" as const, category: "Living Room" as const, displayOrder: index + 1, active: true })),
  ...interiorData.bedrooms.map((card, index) => ({ ...card, id: `interior-bedroom-${index + 1}`, section: "Bedroom" as const, category: "Bedroom" as const, displayOrder: index + 1, active: true })),
];
