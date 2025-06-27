// update later to degrade user's experience
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const tileSetSvg = document.getElementById('tile-set-svg');
    const mainCharacterSvg = document.getElementById('main-character-svg');
    const backgroundSvg = document.getElementById('background-svg');
    const uiSvg = document.getElementById('ui-svg');

    const CHARACTER_WIDTH = 50;
    const CHARACTER_HEIGHT = 100; // This is the total height of the character SVG viewBox
    const CHARACTER_VISUAL_HEIGHT = 60; // Estimated visual height from SVG's y=0 to feet for the main character drawing
    const TILE_HEIGHT = 100; // This is the height of the tile-set SVG itself
    const TILE_WIDTH = 100; // Each tile will be 100px wide

    let GAME_WIDTH = gameContainer.offsetWidth;
    let GAME_HEIGHT = gameContainer.offsetHeight;

    let characterX = 0; // Initial character X position

    // Function to calculate the correct Y position for elements on the tile-set
    // This returns the Y coordinate for the *top* of an object's SVG to make its *bottom* sit on the tiles.
    function getGroundY(objectVisualHeight) {
        return GAME_HEIGHT - TILE_HEIGHT - objectVisualHeight;
    }

    // --- 1.) Dungeon Themed Tile-set ---
    function drawTileSet() {
        tileSetSvg.innerHTML = ''; // Clear previous tiles
        tileSetSvg.setAttribute('viewBox', `0 0 ${GAME_WIDTH} ${TILE_HEIGHT}`);

        const numberOfTiles = Math.ceil(GAME_WIDTH / TILE_WIDTH);

        for (let i = 0; i < numberOfTiles; i++) {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('x', i * TILE_WIDTH);
            rect.setAttribute('y', 0);
            rect.setAttribute('width', TILE_WIDTH);
            rect.setAttribute('height', TILE_HEIGHT);
            rect.setAttribute('fill', '#444');
            rect.setAttribute('stroke', '#333');
            rect.setAttribute('stroke-width', '1');
            tileSetSvg.appendChild(rect);
        }
    }

    // --- 3.) Main Character Initial Position ---
    function positionMainCharacter() {
        mainCharacterSvg.setAttribute('viewBox', `0 0 ${CHARACTER_WIDTH} ${CHARACTER_HEIGHT}`);
        mainCharacterSvg.style.transform = `translate(${characterX}px, ${getGroundY(CHARACTER_VISUAL_HEIGHT)}px)`;
    }

    // --- 5.) Joystick Function (Arrow Keys for now) ---
    function handleMovement(event) {
        const moveAmount = 10;

        if (event.key === 'ArrowLeft') {
            characterX = Math.max(0, characterX - moveAmount);
        } else if (event.key === 'ArrowRight') {
            characterX = Math.min(GAME_WIDTH - CHARACTER_WIDTH, characterX + moveAmount);
        }
        mainCharacterSvg.style.transform = `translate(${characterX}px, ${getGroundY(CHARACTER_VISUAL_HEIGHT)}px)`;
    }

    document.addEventListener('keydown', handleMovement);

    // --- 4.) UI SVG (Mockup WoW-esque overlay) ---
    function drawUI() {
        uiSvg.innerHTML = '';
        uiSvg.setAttribute('viewBox', `0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`);

        // Health Bar
        const healthBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        healthBar.setAttribute('x', '10');
        healthBar.setAttribute('y', '10');
        healthBar.setAttribute('width', '200');
        healthBar.setAttribute('height', '20');
        healthBar.setAttribute('fill', 'red');
        healthBar.setAttribute('rx', '5');
        uiSvg.appendChild(healthBar);

        const healthText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        healthText.setAttribute('x', '110');
        healthText.setAttribute('y', '25');
        healthText.setAttribute('fill', 'white');
        healthText.setAttribute('font-size', '12');
        healthText.setAttribute('text-anchor', 'middle');
        healthText.textContent = '1000/1000 HP';
        uiSvg.appendChild(healthText);

        // Mana Bar
        const manaBar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        manaBar.setAttribute('x', '10');
        manaBar.setAttribute('y', '40');
        manaBar.setAttribute('width', '150');
        manaBar.setAttribute('height', '15');
        manaBar.setAttribute('fill', 'blue');
        manaBar.setAttribute('rx', '3');
        uiSvg.appendChild(manaBar);

        const manaText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        manaText.setAttribute('x', '85');
        manaText.setAttribute('y', '52');
        manaText.setAttribute('fill', 'white');
        manaText.setAttribute('font-size', '10');
        manaText.setAttribute('text-anchor', 'middle');
        manaText.textContent = '500/500 MP';
        uiSvg.appendChild(manaText);

        // Action Bar (simple rectangles for now)
        for (let i = 0; i < 5; i++) {
            const actionBarSlot = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            actionBarSlot.setAttribute('x', GAME_WIDTH / 2 - 175 + (i * 70));
            actionBarSlot.setAttribute('y', GAME_HEIGHT - 70);
            actionBarSlot.setAttribute('width', '60');
            actionBarSlot.setAttribute('height', '60');
            actionBarSlot.setAttribute('fill', '#555');
            actionBarSlot.setAttribute('stroke', '#888');
            actionBarSlot.setAttribute('stroke-width', '2');
            uiSvg.appendChild(actionBarSlot);
        }
    }

    // --- 8.) Background SVG: Shop, NPC, LVL 99 Player, Torch ---
    function drawBackgroundAssets() {
        backgroundSvg.innerHTML = '';
        backgroundSvg.setAttribute('viewBox', `0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`);

        // Shop (medieval look)
        const shopGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const SHOP_BUILDING_HEIGHT = 150;
        const SHOP_ROOF_HEIGHT = 50; // Height of the triangular roof
        const TOTAL_SHOP_VISUAL_HEIGHT = SHOP_BUILDING_HEIGHT + SHOP_ROOF_HEIGHT;

        shopGroup.setAttribute('transform', `translate(${GAME_WIDTH * 0.5 - 90}, ${getGroundY(TOTAL_SHOP_VISUAL_HEIGHT)})`);

        shopGroup.innerHTML = `
            <rect x="0" y="${SHOP_ROOF_HEIGHT}" width="180" height="${SHOP_BUILDING_HEIGHT}" fill="#8B4513" stroke="#5A2D0C" stroke-width="5"/>

            <polygon points="0,${SHOP_ROOF_HEIGHT} 180,${SHOP_ROOF_HEIGHT} 90,0" fill="#654321" stroke="#3E270F" stroke-width="5"/>

            <rect x="70" y="${SHOP_ROOF_HEIGHT + SHOP_BUILDING_HEIGHT - 80}" width="40" height="80" fill="#5A2D0C" stroke="#3E270F" stroke-width="3"/>
            <circle cx="78" y="${SHOP_ROOF_HEIGHT + SHOP_BUILDING_HEIGHT - 40}" r="3" fill="gold"/> <rect x="15" y="${SHOP_ROOF_HEIGHT + 20}" width="30" height="30" fill="#ADD8E6" stroke="#3E270F" stroke-width="2"/>
            <line x1="15" y1="${SHOP_ROOF_HEIGHT + 35}" x2="45" y2="${SHOP_ROOF_HEIGHT + 35}" stroke="#3E270F" stroke-width="1"/>
            <line x1="30" y1="${SHOP_ROOF_HEIGHT + 20}" x2="30" y2="${SHOP_ROOF_HEIGHT + 50}" stroke="#3E270F" stroke-width="1"/>

            <text x="90" y="${SHOP_ROOF_HEIGHT - 10}" fill="gold" font-size="20" text-anchor="middle">The Dungeon Emporium</text>
        `;
        backgroundSvg.appendChild(shopGroup);

        // NPC (simple stick figure next to shop)
        const npcGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        // NPC's visual height is ~60 from its internal (0,0) to feet.
        npcGroup.setAttribute('transform', `translate(${GAME_WIDTH * 0.5 + 80}, ${getGroundY(60)})`);
        npcGroup.innerHTML = `
            <line x1="0" y1="0" x2="0" y2="40" stroke="brown" stroke-width="3"/>
            <circle cx="0" cy="-5" r="7" fill="brown"/>
            <line x1="0" y1="10" x2="-15" y2="25" stroke="brown" stroke-width="3"/>
            <line x1="0" y1="10" x2="15" y2="25" stroke="brown" stroke-width="3"/>
            <line x1="0" y1="40" x2="-10" y2="60" stroke="brown" stroke-width="3"/>
            <line x1="0" y1="40" x2="10" y2="60" stroke="brown" stroke-width="3"/>
            <text x="0" y="-15" fill="white" font-size="12" text-anchor="middle">NPC</text>
        `;
        backgroundSvg.appendChild(npcGroup);

        // In script.js, within the drawBackgroundAssets() function:

        // ... (previous code for shop, NPC, etc.)

            // LVL 99 End-Game Player (Daedric Armor semblance with shimmering aura)
            const lvl99PlayerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            // New estimated visual height for the fully armored legend (from group's y=0 to bottom of feet)
            const LVL99_VISUAL_HEIGHT = 150;
            lvl99PlayerGroup.setAttribute('transform', `translate(${GAME_WIDTH * 0.5 + 250}, ${getGroundY(LVL99_VISUAL_HEIGHT)})`);

            lvl99PlayerGroup.innerHTML = `
                <defs>
                    <filter id="daedricAura">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                        <feColorMatrix in="blur" type="matrix" values="
                            1 0 0 0 0    0 0.1 0 0 0  0 0 1 0 0    0 0 0 6 0    " result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <linearGradient id="daedricMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#330066;stop-opacity:1" />
                        <stop offset="50%" style="stop-color:#1A0033;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
                    </linearGradient>

                    <filter id="glowLine">
                        <feFlood flood-color="#FF00FF" result="flood" /> <feComposite in="flood" in2="SourceGraphic" operator="in" result="coloredSource" />
                        <feGaussianBlur in="coloredSource" stdDeviation="1.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="SourceGraphic" />
                            <feMergeNode in="blur" />
                        </feMerge>
                    </filter>
                </defs>

                <rect x="-25" y="-15" width="50" height="90" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2" filter="url(#daedricAura)"/>
                <path d="M-25 -15 L25 -15 L20 20 L-20 20 Z" fill="#5500AA" stroke="#FF00FF" stroke-width="1" filter="url(#glowLine)"/>
                <polygon points="-10,5 -5,15 0,5 5,15 10,5 0, -5" fill="#FF00FF" filter="url(#glowLine)"/>

                <g transform="translate(0, -25)"> <path d="M-20 0 C -35 5, -35 30, -20 35 L0 40 L20 35 C 35 30, 35 5, 20 0 Z"
                          fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2" filter="url(#daedricAura)"/>
                    <path d="M-15 -5 L-30 -25 L-20 -5 Z" fill="#5500AA" stroke="#FF00FF" stroke-width="1.5" filter="url(#glowLine)"/>
                    <path d="M15 -5 L30 -25 L20 -5 Z" fill="#5500AA" stroke="#FF00FF" stroke-width="1.5" filter="url(#glowLine)"/>
                    <rect x="-10" y="10" width="5" height="10" fill="#FF00FF" filter="url(#glowLine)"/>
                    <rect x="5" y="10" width="5" height="10" fill="#FF00FF" filter="url(#glowLine)"/>
                    <path d="M0 35 L-5 45 L5 45 Z" fill="#5500AA" stroke="#FF00FF" stroke-width="1" filter="url(#glowLine)"/>
                </g>

                <rect x="-40" y="10" width="15" height="40" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2" transform="rotate(-15, -20, 30)"/>
                <rect x="-50" y="50" width="15" height="40" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2" transform="rotate(20, -30, 70)"/>
                <path d="M-55 85 L-40 90 L-45 100 L-60 95 Z" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2"/>
                <polygon points="-48,93 -40,90 -50,90" fill="#FF00FF" filter="url(#glowLine)"/> <rect x="25" y="10" width="15" height="40" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2" transform="rotate(15, 20, 30)"/>
                <rect x="35" y="50" width="15" height="40" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2" transform="rotate(-20, 30, 70)"/>
                <path d="M40 85 L55 90 L50 100 L35 95 Z" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2"/>
                <polygon points="47,93 55,90 45,90" fill="#FF00FF" filter="url(#glowLine)"/> <rect x="-20" y="80" width="20" height="50" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2"/> <rect x="0" y="80" width="20" height="50" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2"/> <rect x="-20" y="130" width="20" height="50" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2"/> <rect x="0" y="130" width="20" height="50" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2"/> <path d="M-25 180 L-10 180 L-15 195 L-30 195 Z" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2"/> <polygon points="-15,185 -10,180 -20,180" fill="#FF00FF" filter="url(#glowLine)"/> <path d="M25 180 L10 180 L15 195 L30 195 Z" fill="url(#daedricMetal)" stroke="#9900FF" stroke-width="2"/> <polygon points="15,185 10,180 20,180" fill="#FF00FF" filter="url(#glowLine)"/> <g transform="translate(45, 90) rotate(45)"> <path d="M0 0 L10 -100 L20 0 Z" fill="#6600AA" stroke="#BB00FF" stroke-width="2"/>
                    <rect x="-5" y="0" width="30" height="8" fill="#5500AA" stroke="#BB00FF" stroke-width="1"/>
                    <rect x="8" y="8" width="4" height="20" fill="#333" stroke="#666" stroke-width="0.5"/>
                    <path d="M5 -5 L10 -95 L15 -5 Z" fill="#FF00FF" filter="url(#glowLine)"/>
                    <polygon points="10,-100 15,-105 20,-100 15,-95" fill="#FF00FF" filter="url(#glowLine)"/> </g>

                <text x="0" y="-80" fill="gold" font-size="14" text-anchor="middle">LVL 99 Legend</text>
            `;
            backgroundSvg.appendChild(lvl99PlayerGroup);

        // Torch (left of the shop)
        const torchGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        // Torch pole height is 80 (y=0 to y=80). Flame goes above, est. total visual height 110.
        torchGroup.setAttribute('transform', `translate(${GAME_WIDTH * 0.5 - 150}, ${getGroundY(110)})`);

        // Torch pole
        torchGroup.innerHTML += `
            <rect x="-5" y="0" width="10" height="80" fill="#663300"/>
        `;
        // Flame (simple shape with animation)
        const flame = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        flame.setAttribute('points', '0,0 -10,-20 0,-30 10,-20');
        flame.setAttribute('fill', 'orange');
        flame.setAttribute('filter', 'url(#aura)'); // Reuse aura filter for shimmer

        const animateFlame = document.createElementNS("http://www.w3.org/2000/svg", "animate");
        animateFlame.setAttribute('attributeName', 'points');
        animateFlame.setAttribute('dur', '1s');
        animateFlame.setAttribute('repeatCount', 'indefinite');
        animateFlame.setAttribute('values', '0,0 -10,-20 0,-30 10,-20; 0,0 -8,-22 0,-32 8,-22; 0,0 -10,-20 0,-30 10,-20');
        flame.appendChild(animateFlame);
        torchGroup.appendChild(flame);
        backgroundSvg.appendChild(torchGroup);
    }

    // --- 10.) End-Game Treasure Chest and Open Modal ---
    function drawTreasureChest() {
        const chestGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        chestGroup.setAttribute('id', 'treasure-chest');
        // Visual height of chest is around 60 (from 0 to 60 for the body).
        chestGroup.setAttribute('transform', `translate(${GAME_WIDTH - 200}, ${getGroundY(60)})`);

        chestGroup.innerHTML = `
            <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:rgb(255,215,0);stop-opacity:1" />
                    <stop offset="50%" style="stop-color:rgb(255,255,200);stop-opacity:1" />
                    <stop offset="100%" style="stop-color:rgb(255,215,0);stop-opacity:1" />
                </linearGradient>
                <filter id="shimmer">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                    <feDiffuseLighting in="noise" lighting-color="gold" surfaceScale="2" result="light">
                        <fePointLight x="40" y="30" z="20" /> </feDiffuseLighting>
                    <feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
                </filter>
            </defs>

            <rect x="0" y="20" width="80" height="40" rx="5" ry="5" fill="url(#goldGradient)" stroke="#B8860B" stroke-width="2" filter="url(#shimmer)"/>
            <path d="M-5 20 L85 20 L75 0 L5 0 Z" fill="url(#goldGradient)" stroke="#B8860B" stroke-width="2" filter="url(#shimmer)"/>
            <rect x="35" y="15" width="10" height="25" fill="#5A2D0C" stroke="#333" stroke-width="1"/>
            <circle cx="40" cy="35" r="3" fill="black"/>
            <line x1="10" y1="20" x2="10" y2="60" stroke="#B8860B" stroke-width="2"/>
            <line x1="70" y1="20" x2="70" y2="60" stroke="#B8860B" stroke-width="2"/>

            <text x="40" y="15" fill="white" font-size="16" text-anchor="middle">Loot!</text>
        `;

        backgroundSvg.appendChild(chestGroup);

        chestGroup.style.cursor = 'pointer';
        chestGroup.addEventListener('click', openLootBoxModal);
    }

    // --- 11.) Loot Box Modal Logic ---
    const lootBoxModal = document.getElementById('loot-box-modal');
    const closeButton = lootBoxModal.querySelector('.close-button');
    const claimItemsButton = document.getElementById('claim-items-button');
    const lootGrid = document.getElementById('loot-grid');

    const lootItems = [
        "Bag of Holding", "Rare Sword", "Rare Helmet", "Rare Cuirass",
        "Enchanted Ring", "Mystic Amulet", "Legendary Boots", "Potion of Might",
        "Scroll of Wisdom", "Dragon Scale Shield", "Orb of Power", "Gloves of Dexterity",
        "Cursed Dagger", "Blessed Gauntlets", "Ring of Protection", "Mana Gem"
    ];

    function openLootBoxModal() {
        lootBoxModal.style.display = 'flex';
        populateLootGrid();
    }

    function closeLootBoxModal() {
        lootBoxModal.style.display = 'none';
    }

    function populateLootGrid() {
        lootGrid.innerHTML = '';
        const shuffledLoot = lootItems.sort(() => 0.5 - Math.random());
        const selectedLoot = shuffledLoot.slice(0, 16);

        selectedLoot.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('loot-item');
            itemDiv.innerHTML = `
                <h3>${item}</h3>
                <svg width="50" height="50" viewBox="0 0 50 50">
                    <rect x="0" y="0" width="50" height="50" fill="#666" stroke="gold" stroke-width="1"/>
                    <text x="25" y="30" fill="white" font-size="10" text-anchor="middle">ITEM</text>
                </svg>
            `;
            lootGrid.appendChild(itemDiv);
        });
    }

    closeButton.addEventListener('click', closeLootBoxModal);
    window.addEventListener('click', (event) => {
        if (event.target == lootBoxModal) {
            closeLootBoxModal();
        }
    });

    // --- 12.) Update Required Popup ---
    const updateRequiredModal = document.getElementById('update-required-modal');

    claimItemsButton.addEventListener('click', () => {
        closeLootBoxModal();
        setTimeout(() => {
            updateRequiredModal.style.display = 'flex';
        }, 2000);
    });

    // Initialize the game
    function initializeGame() {
        GAME_WIDTH = gameContainer.offsetWidth;
        GAME_HEIGHT = gameContainer.offsetHeight;

        drawTileSet();
        positionMainCharacter();
        drawUI();
        drawBackgroundAssets();
        drawTreasureChest();
    }

    initializeGame();
    window.addEventListener('resize', initializeGame);
});
