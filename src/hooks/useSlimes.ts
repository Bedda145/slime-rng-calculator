import { useEffect, useState } from 'react';
import { fetchSlimeImages } from '../services/wikiApi';
import { SLIME_REGISTRY } from '../data/dropRates';
import type { Slime } from '../types/game';

export function useSlimes() {
  const [slimes, setSlimes] = useState<Slime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssets() {
      try {
        // Extract base lookup strings (e.g., "Scorchy / Boomy" splits down to look up "Scorchy")
        const searchTitles = SLIME_REGISTRY.map(s => s.title.split('/')[0].trim());
        const imageMap = await fetchSlimeImages(searchTitles);

        const loadedSlimes = SLIME_REGISTRY.map((slime, index) => {
          const lookupKey = slime.title.split('/')[0].trim().toLowerCase();
          return {
            pageid: index,
            title: slime.title,
            imageUrl: imageMap[lookupKey] || null
          };
        });

        setSlimes(loadedSlimes);
      } catch (err) {
        console.error("Failed loading wiki image assets", err);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  return { slimes, loading };
}