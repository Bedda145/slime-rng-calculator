export interface SlimeConfig {
  title: string;
  tier: string;
  odds: {
    Base: number | string;
    Big: number | string;
    Huge: number | string;
    Shiny: number | string;
    Inverted: number | string;
  };
}

export interface PotionConfig {
  id: string;
  name: string;
  luckBonus: number;
  label: string;
  colorTheme: 'none' | 'green' | 'purple';
}

export const SLIME_REGISTRY: SlimeConfig[] = [
  { title: "Goopy", tier: "Basic", odds: { Base: 3, Big: 216, Huge: 2150, Shiny: 539, Inverted: 5380 } },
  { title: "Sunset", tier: "Basic", odds: { Base: 5, Big: 431, Huge: 4310, Shiny: 1070, Inverted: 10700 } },
  { title: "Fin", tier: "Common", odds: { Base: 8, Big: 719, Huge: 7180, Shiny: 1790, Inverted: 17800 } },
  { title: "Leafy", tier: "Common", odds: { Base: 11, Big: 1070, Huge: 10700, Shiny: 2690, Inverted: 26900 } },
  { title: "Meow", tier: "Uncommon", odds: { Base: 35, Big: 3470, Huge: 34700, Shiny: 8680, Inverted: 86800 } },
  { title: "Glo", tier: "Uncommon", odds: { Base: 57, Big: 5740, Huge: 57400, Shiny: 14300, Inverted: 143000 } },
  { title: "Buggy", tier: "Rare", odds: { Base: 103, Big: 10700, Huge: 107000, Shiny: 26900, Inverted: 269000 } },
  { title: "Scorchy / Boomy", tier: "Rare", odds: { Base: 160, Big: 16000, Huge: 160000, Shiny: 40000, Inverted: 400000 } },
  { title: "Brutis", tier: "Rare", odds: { Base: 263, Big: 26300, Huge: 263000, Shiny: 65800, Inverted: 658000 } },
  { title: "Frankenslime", tier: "Rare", odds: { Base: 415, Big: 41500, Huge: 415000, Shiny: 104000, Inverted: 1040000 } },
  { title: "Orca", tier: "Epic", odds: { Base: 719, Big: 71900, Huge: 719000, Shiny: 180000, Inverted: 1800000 } },
  { title: "Spike", tier: "Epic", odds: { Base: 1260, Big: 126000, Huge: 1260000, Shiny: 315000, Inverted: 3150000 } },
  { title: "Axolotl", tier: "Epic", odds: { Base: 2390, Big: 239000, Huge: 2390000, Shiny: 598000, Inverted: 5980000 } },
  { title: "Spidey", tier: "Legendary", odds: { Base: 4270, Big: 427000, Huge: 4270000, Shiny: 1070000, Inverted: 10700000 } },
  { title: "Mushy", tier: "Legendary", odds: { Base: 7770, Big: 777000, Huge: 7770000, Shiny: 1940000, Inverted: 19400000 } },
  { title: "Rocky", tier: "Legendary", odds: { Base: 13900, Big: 1390000, Huge: 13900000, Shiny: 3470000, Inverted: 34700000 } },
  { title: "Lucky", tier: "Mythic", odds: { Base: 21500, Big: 2150000, Huge: 21500000, Shiny: 5380000, Inverted: 53800000 } },
  { title: "Stump", tier: "Mythic", odds: { Base: 35900, Big: 3590000, Huge: 35900000, Shiny: 8970000, Inverted: 89700000 } },
  { title: "Pondy / Lily", tier: "Mythic", odds: { Base: 53800, Big: 5380000, Huge: 53800000, Shiny: 13450000, Inverted: 134500000 } },
  { title: "Crafty", tier: "Mythic", odds: { Base: 57400, Big: 5740000, Huge: 57400000, Shiny: 14350000, Inverted: 143500000 } },
  { title: "Icy", tier: "Divine", odds: { Base: 86100, Big: 8610000, Huge: 86100000, Shiny: 21525000, Inverted: 215250000 } },
  { title: "Orbit", tier: "Divine", odds: { Base: 126000, Big: 12600000, Huge: 126000000, Shiny: 31600000, Inverted: 316000000 } },
  { title: "Aegis", tier: "Divine", odds: { Base: 215000, Big: 21500000, Huge: 215000000, Shiny: 53800000, Inverted: 538000000 } },
  { title: "Wicked", tier: "Divine", odds: { Base: 326000, Big: 32600000, Huge: 326000000, Shiny: 81500000, Inverted: 815000000 } },
  { title: "Thorn", tier: "Divine", odds: { Base: 330000, Big: 33000000, Huge: 330000000, Shiny: 82500000, Inverted: 825000000 } },
  { title: "King", tier: "Prismatic", odds: { Base: 538000, Big: 53800000, Huge: 538000000, Shiny: 134500000, Inverted: 1340000000 } },
  { title: "Guest", tier: "Prismatic", odds: { Base: 861000, Big: 86100000, Huge: 861000000, Shiny: 215250000, Inverted: 2152500000 } },
  { title: "Ninja", tier: "Prismatic", odds: { Base: 1260000, Big: 126000000, Huge: 1260000000, Shiny: 316000000, Inverted: 3160000000 } },
  { title: "Buzz", tier: "Prismatic", odds: { Base: 2150000, Big: 215000000, Huge: 2150000000, Shiny: 538000000, Inverted: 5380000000 } },
  { title: "Stormy", tier: "Prismatic", odds: { Base: 3070000, Big: 307000000, Huge: 3070000000, Shiny: 767500000, Inverted: 7675000000 } },
  { title: "Geode", tier: "Prismatic", odds: { Base: 3110000, Big: 311000000, Huge: 3110000000, Shiny: 777500000, Inverted: 7775000000 } },
  { title: "Bucky", tier: "Transcendent", odds: { Base: 4780000, Big: 478000000, Huge: 4780000000, Shiny: 1195000000, Inverted: 11950000000 } },
  { title: "Pokey", tier: "Transcendent", odds: { Base: 7180000, Big: 718000000, Huge: 7180000000, Shiny: 1795000000, Inverted: 17950000000 } },
  { title: "SlimesSlime", tier: "Transcendent", odds: { Base: 10700000, Big: 1070000000, Huge: 10700000000, Shiny: 2690000000, Inverted: 26900000000 } },
  { title: "Unicorn", tier: "Transcendent", odds: { Base: 17900000, Big: 1790000000, Huge: 17900000000, Shiny: 4475000000, Inverted: 44750000000 } },
  { title: "Wizzy", tier: "Ethereal", odds: { Base: 26900000, Big: 2690000000, Huge: 26900000000, Shiny: 6725000000, Inverted: 67250000000 } },
  { title: "Petal", tier: "Ethereal", odds: { Base: 39100000, Big: 3910000000, Huge: 39100000000, Shiny: 9775000000, Inverted: 97750000000 } },
  { title: "SlimesSlimeSlime", tier: "Ethereal", odds: { Base: 42900000, Big: 4290000000, Huge: 42900000000, Shiny: 10725000000, Inverted: 107250000000 } },
  { title: "Shelly", tier: "Ethereal", odds: { Base: 61500000, Big: 6150000000, Huge: 61500000000, Shiny: 15375000000, Inverted: 153750000000 } },
  { title: "Derpy", tier: "Ethereal", odds: { Base: 89700000, Big: 8970000000, Huge: 89700000000, Shiny: 22425000000, Inverted: 224250000000 } },
  { title: "Octo", tier: "Ethereal", odds: { Base: 134000000, Big: 13400000000, Huge: 134000000000, Shiny: 33500000000, Inverted: 335000000000 } },
  { title: "Puffy", tier: "Ethereal", odds: { Base: 195000000, Big: 19500000000, Huge: 195000000000, Shiny: 48750000000, Inverted: 487500000000 } },
  { title: "Halo", tier: "Ethereal", odds: { Base: 195000000, Big: 19500000000, Huge: 195000000000, Shiny: 48900000000, Inverted: 489000000000 } },
  { title: "Bomber", tier: "Secret", odds: { Base: 307000000, Big: 30700000000, Huge: 307000000000, Shiny: 76750000000, Inverted: 767500000000 } },
  { title: "UFO", tier: "Secret", odds: { Base: 478000000, Big: 47800000000, Huge: 478000000000, Shiny: 119500000000, Inverted: 1195000000000 } },
  { title: "Witchy", tier: "Secret", odds: { Base: 718000000, Big: 71800000000, Huge: 718000000000, Shiny: 179500000000, Inverted: 1795000000000 } },
  { title: "Blackhole", tier: "Secret", odds: { Base: 1070000000, Big: 107000000000, Huge: 1070000000000, Shiny: 267500000000, Inverted: 2675000000000 } },
  { title: "Ember", tier: "Secret", odds: { Base: 1720000000, Big: 172000000000, Huge: 1720000000000, Shiny: 430000000000, Inverted: 4300000000000 } },
  { title: "Astro", tier: "Secret", odds: { Base: 2470000000, Big: 247000000000, Huge: 2470000000000, Shiny: 617500000000, Inverted: 6175000000000 } },
  { title: "Pumpkin", tier: "Secret", odds: { Base: "Unknown", Big: "Unknown", Huge: "Unknown", Shiny: "Unknown", Inverted: "Unknown" } },
  { title: "Ouchy", tier: "Secret", odds: { Base: "Unknown", Big: "Unknown", Huge: "Unknown", Shiny: "Unknown", Inverted: "Unknown" } },
  { title: "Sunny", tier: "Secret", odds: { Base: "Craftable", Big: "Craftable", Huge: "Craftable", Shiny: "Craftable", Inverted: "Craftable" } },
  { title: "Monke", tier: "Secret", odds: { Base: "Unknown", Big: "Unknown", Huge: "Unknown", Shiny: "Unknown", Inverted: "Unknown" } },
  { title: "Waxie", tier: "Secret", odds: { Base: "Unknown", Big: "Unknown", Huge: "Unknown", Shiny: "Unknown", Inverted: "Unknown" } },
  { title: "Germy", tier: "Secret", odds: { Base: "Unknown", Big: "Unknown", Huge: "Unknown", Shiny: "Unknown", Inverted: "Unknown" } },
  { title: "Melly", tier: "Ethereal", odds: { Base: "Craftable", Big: "Craftable", Huge: "Craftable", Shiny: "Craftable", Inverted: "Craftable" } },
  { title: "Mato", tier: "Nova", odds: { Base: 673000000000, Big: 67300000000000, Huge: 673000000000000, Shiny: 168250000000000, Inverted: 1682500000000000 } },
  { title: "Frosty", tier: "Nova", odds: { Base: 1070000000000, Big: 107000000000000, Huge: 1070000000000000, Shiny: 267000000000000, Inverted: 2670000000000000 } },
  { title: "Pouchy", tier: "Nova", odds: { Base: 1720000000000, Big: 172000000000000, Huge: 1720000000000000, Shiny: 430000000000000, Inverted: 4300000000000000 } },
  { title: "Hoppity", tier: "Nova", odds: { Base: 2690000000000, Big: 269000000000000, Huge: 2690000000000000, Shiny: 672500000000000, Inverted: 6725000000000000 } },
  { title: "Sweetie", tier: "Nova", odds: { Base: 3500000000000, Big: 350000000000000, Huge: 3500000000000000, Shiny: 875000000000000, Inverted: 8750000000000000 } },
  { title: "Shady", tier: "Nova", odds: { Base: 3990000000000, Big: 399000000000000, Huge: 3990000000000000, Shiny: 997500000000000, Inverted: 9975000000000000 } },
  { title: "Galaxy", tier: "Nova", odds: { Base: 6950000000000, Big: 69500000000000, Huge: 6950000000000000, Shiny: 1730000000000000, Inverted: 17300000000000000 } },
  { title: "Painty", tier: "Solar", odds: { Base: 11300000000000, Big: 1130000000000000, Huge: 11300000000000000, Shiny: 2830000000000000, Inverted: 28300000000000000 } },
  { title: "Patty", tier: "Solar", odds: { Base: 18700000000000, Big: 1870000000000000, Huge: 18700000000000000, Shiny: 4680000000000000, Inverted: 46800000000000000 } },
  { title: "Broclee", tier: "Solar", odds: { Base: 28700000000000, Big: 2870000000000000, Huge: 28700000000000000, Shiny: 7180000000000000, Inverted: 71800000000000000 } },
  { title: "Meaty", tier: "Solar", odds: { Base: 43000000000000, Big: 4300000000000000, Huge: 43000000000000000, Shiny: 10800000000000000, Inverted: 108000000000000000 } },
  { title: "Zappy", tier: "Solar", odds: { Base: 67300000000000, Big: 6730000000000000, Huge: 67300000000000000, Shiny: 16800000000000000, Inverted: 168000000000000000 } },
  { title: "Bacon Hair", tier: "Lunar", odds: { Base: 107000000000000, Big: 1070000000000000, Huge: 10700000000000000, Shiny: 26800000000000000, Inverted: 268000000000000000 } },
  { title: "Cow", tier: "Lunar", odds: { Base: 168000000000000, Big: 1680000000000000, Huge: 16800000000000000, Shiny: 42000000000000000, Inverted: 420000000000000000 } },
  { title: "Cowboy", tier: "Lunar", odds: { Base: 269000000000000, Big: 2690000000000000, Huge: 26900000000000000, Shiny: 67300000000000000, Inverted: 673000000000000000 } },
  { title: "Cyber", tier: "Lunar", odds: { Base: 420000000000000, Big: 4200000000000000, Huge: 42000000000000000, Shiny: 105000000000000000, Inverted: "1.05Qi" } },
  { title: "Mossy", tier: "Galactic", odds: { Base: 1140000000000000, Big: 11400000000000000, Huge: "1.14Qi", Shiny: 28500000000000000, Inverted: "2.85Qi" } }
];

export const AVAILABLE_POTIONS: PotionConfig[] = [
  { id: 'luck_1', name: 'Luck Potion', luckBonus: 1, label: '+1 Luck', colorTheme: 'green' },
  { id: 'ultra', name: 'Ultra Luck Boost', luckBonus: 2, label: '+2 Luck', colorTheme: 'purple' }
];