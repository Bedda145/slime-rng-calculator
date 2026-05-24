export interface SlimeConfig {
  title: string;
  baseOdds: number | string;
  tier: string;
}

export interface PotionConfig {
  id: string;
  name: string;
  luckBonus: number;
  label: string;
  colorTheme: 'none' | 'green' | 'purple';
}

export const SLIME_REGISTRY: SlimeConfig[] = [
  { title: "Goopy", baseOdds: 3, tier: "Basic" },
  { title: "Sunset", baseOdds: 5, tier: "Basic" },
  { title: "Fin", baseOdds: 8, tier: "Common" },
  { title: "Leafy", baseOdds: 11, tier: "Common" },
  { title: "Meow", baseOdds: 35, tier: "Uncommon" },
  { title: "Glo", baseOdds: 57, tier: "Uncommon" },
  { title: "Buggy", baseOdds: 103, tier: "Rare" },
  { title: "Scorchy / Boomy", baseOdds: 160, tier: "Rare" },
  { title: "Brutis", baseOdds: 263, tier: "Rare" },
  { title: "Frankenslime", baseOdds: 415, tier: "Rare" },
  { title: "Orca", baseOdds: 719, tier: "Epic" },
  { title: "Spike", baseOdds: 1260, tier: "Epic" },
  { title: "Axolotl", baseOdds: 2390, tier: "Epic" },
  { title: "Spidey", baseOdds: 4270, tier: "Legendary" },
  { title: "Mushy", baseOdds: 7770, tier: "Legendary" },
  { title: "Rocky", baseOdds: 13900, tier: "Legendary" },
  { title: "Lucky", baseOdds: 21500, tier: "Mythic" },
  { title: "Stump", baseOdds: 35900, tier: "Mythic" },
  { title: "Pondy / Lily", baseOdds: 53800, tier: "Mythic" },
  { title: "Crafty", baseOdds: 57400, tier: "Mythic" },
  { title: "Icy", baseOdds: 86100, tier: "Divine" },
  { title: "Orbit", baseOdds: 126000, tier: "Divine" },
  { title: "Aegis", baseOdds: 215000, tier: "Divine" }, // Fixed: Removed stray border string property
  { title: "Wicked", baseOdds: 326000, tier: "Divine" },
  { title: "Thorn", baseOdds: 330000, tier: "Divine" },
  { title: "King", baseOdds: 538000, tier: "Prismatic" },
  { title: "Guest", baseOdds: 861000, tier: "Prismatic" },
  { title: "Ninja", baseOdds: 1260000, tier: "Prismatic" },
  { title: "Buzz", baseOdds: 2150000, tier: "Prismatic" },
  { title: "Stormy", baseOdds: 3070000, tier: "Prismatic" },
  { title: "Geode", baseOdds: 3110000, tier: "Prismatic" },
  { title: "Bucky", baseOdds: 4780000, tier: "Transcendent" },
  { title: "Pokey", baseOdds: 7180000, tier: "Transcendent" },
  { title: "SlimesSlime", baseOdds: 10700000, tier: "Transcendent" },
  { title: "Unicorn", baseOdds: 17900000, tier: "Transcendent" },
  { title: "Wizzy", baseOdds: 26900000, tier: "Ethereal" },
  { title: "Petal", baseOdds: 39100000, tier: "Ethereal" },
  { title: "SlimesSlimeSlime", baseOdds: 42900000, tier: "Ethereal" },
  { title: "Shelly", baseOdds: 61500000, tier: "Ethereal" },
  { title: "Derpy", baseOdds: 89700000, tier: "Ethereal" },
  { title: "Octo", baseOdds: 134000000, tier: "Ethereal" },
  { title: "Puffy", baseOdds: 195000000, tier: "Ethereal" },
  { title: "Halo", baseOdds: 195000000, tier: "Ethereal" },
  { title: "Bomber", baseOdds: 307000000, tier: "Secret" },
  { title: "UFO", baseOdds: 478000000, tier: "Secret" },
  { title: "Witchy", baseOdds: 718000000, tier: "Secret" },
  { title: "Blackhole", baseOdds: 1070000000, tier: "Secret" },
  { title: "Ember", baseOdds: 1720000000, tier: "Secret" },
  { title: "Astro", baseOdds: 2470000000, tier: "Secret" },
  { title: "Pumpkin", baseOdds: 277000000000, tier: "Secret" },
  { title: "Ouchy", baseOdds: 439000000000, tier: "Secret" },
  { title: "Sunny", baseOdds: 118000000000, tier: "Secret" },
  { title: "Monke", baseOdds: 153000000000, tier: "Secret" },
  { title: "Waxie", baseOdds: 50100000000, tier: "Secret" },
  { title: "Germy", baseOdds: 133000000000, tier: "Secret" },
  { title: "Melly", baseOdds: 237000000000, tier: "Ethereal" },
  { title: "Mato", baseOdds: 673000000000, tier: "Nova" },
  { title: "Frosty", baseOdds: 1070000000000, tier: "Nova" },
  { title: "Pouchy", baseOdds: 1720000000000, tier: "Nova" },
  { title: "Hoppity", baseOdds: 2690000000000, tier: "Nova" },
  { title: "Sweetie", baseOdds: 3500000000000, tier: "Nova" },
  { title: "Shady", baseOdds: 3990000000000, tier: "Nova" },
  { title: "Galaxy", baseOdds: 6950000000000, tier: "Nova" },
  { title: "Painty", baseOdds: 11300000000000, tier: "Solar" },
  { title: "Patty", baseOdds: 18700000000000, tier: "Solar" },
  { title: "Broclee", baseOdds: 28700000000000, tier: "Solar" },
  { title: "Meaty", baseOdds: 43000000000000, tier: "Solar" },
  { title: "Zappy", baseOdds: 67300000000000, tier: "Solar" },
  { title: "Bacon Hair", baseOdds: 107000000000000, tier: "Lunar" },
  { title: "Cow", baseOdds: 168000000000000, tier: "Lunar" },
  { title: "Cowboy", baseOdds: 269000000000000, tier: "Lunar" },
  { title: "Cyber", baseOdds: 420000000000000, tier: "Lunar" },
  { title: "Mossy", baseOdds: 1140000000000000, tier: "Galactic" }
];

export const AVAILABLE_POTIONS: PotionConfig[] = [
  { id: 'luck_1', name: 'Luck Potion', luckBonus: 1, label: '+1 Luck', colorTheme: 'green' },
  { id: 'ultra', name: 'Ultra Luck Boost', luckBonus: 2, label: '+2 Luck', colorTheme: 'purple' }
];