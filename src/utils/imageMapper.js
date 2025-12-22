
// Dynamically import all images from the images directory
const imageModules = import.meta.glob('../images/*.{png,jpg,jpeg,svg,webp}', { eager: true });

// Build a map of filename -> image path
// e.g., 'shero_tegabino' -> '/src/images/shero_tegabino.jpeg'
export const images = Object.fromEntries(
    Object.entries(imageModules).map(([path, module]) => {
        const filename = path.split('/').pop().split('.')[0].toLowerCase().replace(/[-_]/g, '');
        return [filename, module.default];
    })
);

// Helper to manually access specific specific assets if needed (like logo)
export const getLogo = () => {
    // Try to find the logo
    // Matches 'logo.png', 'Ayu-Logo.jpg', 'ayu_logo.jpg' etc.
    return images['ayulogo'] || images['logo'] || null;
};

export const getCategoryImage = (category, itemName = '') => {
    // 1. Try to match specific item name
    const normalizedName = itemName.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check for direct name match in our images map
    // We iterate because the map keys are normalized
    for (const [key, src] of Object.entries(images)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            // Avoid over-matching short strings, but for now strict inclusion is decent
            // Better: if key is substantial part of name or vice-versa
            // key 'shero' matches name 'shero tegabino'
            if (key.length > 3) return src;
        }
    }

    // 2. Specific known mappings based on file list provided
    if (normalizedName.includes('tegabino')) return images['sherotegabino'] || images['shero'];
    if (normalizedName.includes('bozena')) return images['sherobozena'] || images['shero'];
    if (normalizedName.includes('tibs') || normalizedName.includes('tebs')) return images['tebs'] || images['yefyeltebs'];
    if (normalizedName.includes('kitfo') || normalizedName.includes('ketfo')) return images['ketfo'] || images['specialketfo'];
    if (normalizedName.includes('firfir') || normalizedName.includes('ferfer')) return images['ferfer'] || images['kuantaferfer'];
    if (normalizedName.includes('chechebsa')) return images['chechebsa'] || images['specialchechebsa'];
    if (normalizedName.includes('pasta')) return images['pasta'] || images['pastaa'] || images['pastaatklt'];
    if (normalizedName.includes('shiro') || normalizedName.includes('shero')) return images['shiro'] || images['shero'];

    // 3. Fallback to category defaults
    if (!category) return images['shiro'] || images['shero'];

    const catLower = category.toLowerCase();

    if (catLower.includes('breakfast')) return images['breakfast'] || images['full'];
    if (catLower.includes('drink')) return images['softdrinks'] || images['drinks'];
    if (catLower.includes('pasta') || catLower.includes('rice')) return images['pasta'] || images['pastaatklt'];
    if (catLower.includes('lunch') || catLower.includes('dinner')) {
        return images['shero'] || images['tibs'];
    }

    return images['shiro'] || images['shero'];
};
