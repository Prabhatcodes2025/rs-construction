export type InteriorCard = {
  title: string;
  image: string;
  label?: string;
  meta?: string;
  description: string;
};

const images = {
  living: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=82",
  livingWarm: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=82",
  livingLight: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=82",
  kitchen: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1600&q=82",
  kitchenDark: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=82",
  kitchenIsland: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=82",
  bedroom: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=82",
  bedroomSoft: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1600&q=82",
  wardrobe: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=82",
  dining: "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=1600&q=82",
};

export const interiorData = {
  hero: {
    eyebrow: "RS INTERIORS · BENGALURU",
    title: "Interiors designed around the way you live.",
    description:
      "From intelligent space planning and modular kitchens to elegant living rooms and complete home interiors, RS Construction delivers thoughtfully designed spaces with one accountable team.",
    image: images.living,
  },
  trust: [
    "Complete Design-to-Execution",
    "Space-Smart Planning",
    "Transparent Specifications",
    "Dedicated Project Coordination",
  ],
  services: [
    { title: "Living & Dining Interiors", label: "Social spaces", image: images.livingWarm, description: "TV units, feature walls, crockery units, display storage, partitions, lighting and customised furniture." },
    { title: "Modular Kitchens", label: "Made for daily life", image: images.kitchen, description: "L-shaped, U-shaped, parallel, island and straight modular kitchens with intelligent storage solutions." },
    { title: "Bedroom Interiors", label: "Personal retreats", image: images.bedroom, description: "Wardrobes, beds with storage, study units, dressing areas, side tables, lighting and customised finishes." },
    { title: "Wardrobes & Storage", label: "Organised living", image: images.wardrobe, description: "Sliding wardrobes, walk-in wardrobes, loft storage, concealed storage and customised organisers." },
    { title: "False Ceiling & Lighting", label: "Layered ambience", image: images.dining, description: "Layered ceilings, ambient lighting, task lighting, accent lighting and decorative electrical planning." },
    { title: "Home Improvement", label: "Careful upgrades", image: images.livingLight, description: "Painting, flooring, bathroom upgrades, electrical work, plumbing, civil modifications and deep cleaning." },
  ] satisfies InteriorCard[],
  spaceSaving: [
    ["Murphy Bed with Sofa", "A flexible guest room that returns to a lounge when the bed is stored.", images.bedroomSoft],
    ["Hidden Dressing Unit", "A streamlined dressing zone concealed behind coordinated shutters.", images.wardrobe],
    ["Floor-to-Ceiling Wardrobe", "Full-height storage that makes practical use of vertical space.", images.bedroom],
    ["Kitchen Pantry Pull-Out", "Easy-access tall storage for groceries, jars and everyday essentials.", images.kitchenDark],
    ["Storage Bed", "Useful concealed capacity built below a comfortable bed platform.", images.bedroomSoft],
    ["TV Unit with Concealed Storage", "Media, cables and daily clutter kept behind a composed elevation.", images.living],
    ["Under-Stair Storage", "Custom drawers and cabinets fitted into otherwise unused volume.", images.livingWarm],
    ["Foldable Study Desk", "A compact work surface that closes neatly after use.", images.bedroom],
    ["Multi-Functional Crockery Unit", "Display, serving and closed storage combined in one dining feature.", images.dining],
    ["Corner Storage Solutions", "Purpose-built hardware makes difficult corners easier to reach.", images.kitchen],
  ],
  kitchens: ["L-Shaped Kitchen", "U-Shaped Kitchen", "Parallel Kitchen", "Straight Kitchen", "Island Kitchen", "Kitchen with Breakfast Counter"].map((title, index) => ({
    title,
    image: [images.kitchen, images.kitchenDark, images.kitchenIsland][index % 3],
    description: ["Efficient corner planning with a clear working triangle.", "Generous worktop and storage for active family kitchens.", "A tailored layout balancing preparation, cooking and circulation."][index % 3],
  })),
  livingRooms: ["Contemporary Living Room", "Minimal Living Room", "Luxury Living Room", "Compact Apartment Living Room", "Living Room with Pooja Unit", "Living Room with Display Storage"].map((title, index) => ({
    title,
    meta: index === 3 ? "Compact apartment" : "Living & dining",
    image: [images.living, images.livingWarm, images.livingLight][index % 3],
    description: "A considered composition of seating, storage, lighting and finishes shaped around the room.",
  })),
  bedrooms: ["Master Bedroom", "Kids’ Bedroom", "Guest Bedroom", "Compact Bedroom", "Bedroom with Study Unit", "Bedroom with Sliding Wardrobe"].map((title, index) => ({
    title,
    image: [images.bedroom, images.bedroomSoft, images.wardrobe][index % 3],
    description: "Comfort-led planning with practical storage, layered lighting and coordinated finishes.",
  })),
  inclusions: [
    ["Design & Planning", ["Requirement consultation", "Space planning", "Mood boards", "Material selection", "2D layouts", "3D design visualisation"]],
    ["Modular Solutions", ["Modular kitchen", "Wardrobes", "TV units", "Crockery units", "Study units", "Custom storage"]],
    ["Interior Works", ["False ceiling", "Lighting", "Wall panelling", "Painting", "Flooring", "Electrical work"]],
    ["Execution & Management", ["Project coordination", "Quality checks", "Material tracking", "Progress updates", "Installation", "Final handover"]],
  ],
  process: [
    ["Consultation", "Understand the space, requirements, lifestyle and budget."],
    ["Site Measurement", "Capture dimensions, structural conditions and service points."],
    ["Concept & Space Planning", "Develop layouts, functionality and design direction."],
    ["3D Visualisation", "Present materials, finishes, colours and realistic design previews."],
    ["Finalisation & Quotation", "Confirm scope, specifications, timelines and costs."],
    ["Production & Execution", "Coordinate modular production and on-site interior work."],
    ["Quality Inspection", "Verify finishing, alignment, functionality and installation quality."],
    ["Handover", "Complete the final walkthrough and deliver the finished space."],
  ],
  portfolio: [
    ["Kitchen Concept 01", "Bengaluru · Client placeholder", "Kitchen", "Contemporary", "3 BHK", images.kitchen],
    ["Living Concept 01", "Bengaluru · Client placeholder", "Living Room", "Warm minimal", "Apartment", images.livingWarm],
    ["Bedroom Concept 01", "Bengaluru · Client placeholder", "Bedroom", "Modern", "Villa", images.bedroom],
    ["Wardrobe Concept 01", "Bengaluru · Client placeholder", "Wardrobe", "Space-smart", "2 BHK", images.wardrobe],
    ["Complete Home Concept 01", "Bengaluru · Client placeholder", "Complete Home", "Contemporary", "3 BHK", images.living],
    ["Commercial Concept 01", "Bengaluru · Client placeholder", "Commercial", "Refined", "Office", images.kitchenDark],
  ],
  benefits: [
    "Construction and interiors under one roof", "Personalised design solutions", "Clear scope and specifications",
    "Dedicated project coordination", "Stage-wise quality checks", "Premium material options",
    "Transparent communication", "Timely execution planning",
  ],
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
