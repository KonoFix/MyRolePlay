// ==========================================================================
// FICHA INTERATIVA D&D 5E - CONTROLADOR PRINCIPAL (APP.JS)
// Sistema completo de regras, automação de cálculos e jogabilidade ao vivo
// ==========================================================================

// Estado Global da Aplicação
let currentCharacter = null;
let savedCharacters = {};
let rollMode = 'normal'; // 'normal' | 'advantage' | 'disadvantage'
let currentTheme = 'dark';
let wizardState = {
  step: 1,
  race: 'humano',
  subrace: 'padrao',
  class: 'guerreiro',
  method: 'standard', // 'standard' | 'roll' | 'pointbuy'
  pointsRemaining: 27,
  scores: { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 },
  background: 'soldado',
  name: 'Novo Aventureiro'
};

const POINT_BUY_COSTS = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

// Modelo Padrão de Personagem Inicial (Bruenor Martelo de Batalha como exemplo do livro)
function createDefaultCharacter() {
  return {
    id: 'char_' + Date.now(),
    name: 'Bruenor Martelo de Batalha',
    player: 'Bob',
    class: 'guerreiro',
    level: 1,
    subclass: 'campeao',
    race: 'anao',
    subrace: 'montanha',
    background: 'heroi_povo',
    alignment: 'Leal e Bom',
    xp: 0,
    inspiration: false,
    baseScores: { str: 15, dex: 10, con: 14, int: 8, wis: 13, cha: 12 },
    customScoreBonus: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    savingThrowProficiencies: ['str', 'con'],
    // 0 = none, 1 = proficient, 2 = expertise
    skillProficiencies: {
      athletics: 1,
      survival: 1,
      animal_handling: 1
    },
    hp: { current: 13, max: 13, temp: 0 },
    hitDiceSpent: 0,
    deathSaves: { successes: 0, failures: 0 },
    equippedArmor: 'cota_malha',
    equippedShield: true,
    weapons: [
      { name: 'Machado de Batalha', attackModType: 'str', damage: '1d8', damageType: 'cortante', isVersatile: true, versatileDamage: '1d10', properties: 'Versátil' },
      { name: 'Machadinha', attackModType: 'str', damage: '1d6', damageType: 'cortante', properties: 'Leve, Arremesso (6/18m)' }
    ],
    spells: [],
    spellSlots: [
      { level: 1, max: 0, spent: 0 },
      { level: 2, max: 0, spent: 0 },
      { level: 3, max: 0, spent: 0 },
      { level: 4, max: 0, spent: 0 },
      { level: 5, max: 0, spent: 0 },
      { level: 6, max: 0, spent: 0 },
      { level: 7, max: 0, spent: 0 },
      { level: 8, max: 0, spent: 0 },
      { level: 9, max: 0, spent: 0 }
    ],
    currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
    inventory: [
      { id: '1', name: 'Mochila de Aventureiro', qty: 1, weight: 2.5 },
      { id: '2', name: 'Corda de cânhamo (15m)', qty: 1, weight: 5 },
      { id: '3', name: 'Rações de viagem (1 dia)', qty: 10, weight: 10 },
      { id: '4', name: 'Cantil com água', qty: 1, weight: 2.5 },
      { id: '5', name: 'Ferramentas de ferreiro', qty: 1, weight: 4 },
      { id: '6', name: 'Pá', qty: 1, weight: 2.5 }
    ],
    activeConditions: [],
    exhaustion: 0,
    customResources: [
      { name: 'Retomar o Fôlego', current: 1, max: 1, rest: 'curto' },
      { name: 'Surto de Ação', current: 1, max: 1, rest: 'curto' }
    ],
    bio: {
      traits: 'Rude e ríspido por fora, mas com coração protetor para seus amigos e aliados.',
      ideals: 'Justiça: Ninguém merece tratamento diferenciado perante a lei e ninguém está acima dela.',
      bonds: 'Reivindicar sua terra natal, o Salão de Mitral, expulso pelo dragão das sombras.',
      flaws: 'Tem fraqueza e compaixão extrema por órfãos e almas desvalidas.',
      backstory: 'Cresceu como ferreiro nas aldeias remotas do Vale do Vento Gélido após seu clã ser expulso do Salão de Mitral.',
      appearance: 'Anão de cabelos e barba vermelha volumosa, 1,40m, 80kg, olhar altivo e cicatrizes de forja.'
    }
  };
}

// --------------------------------------------------------------------------
// INICIALIZAÇÃO DA APLICAÇÃO
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  loadStoredCharacters();
  setupUIEventListeners();
  populateDropdowns();
  renderFullSheet();
});

// Carrega personagens do localStorage
function loadStoredCharacters() {
  const stored = localStorage.getItem('dnd5e_characters');
  if (stored) {
    try {
      savedCharacters = JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao ler personagens salvos:', e);
      savedCharacters = {};
    }
  }

  const activeId = localStorage.getItem('dnd5e_active_character_id');
  if (activeId && savedCharacters[activeId]) {
    currentCharacter = savedCharacters[activeId];
  } else if (Object.keys(savedCharacters).length > 0) {
    currentCharacter = Object.values(savedCharacters)[0];
  } else {
    const defaultChar = createDefaultCharacter();
    savedCharacters[defaultChar.id] = defaultChar;
    currentCharacter = defaultChar;
    saveToLocalStorage();
  }

  const themeSaved = localStorage.getItem('dnd5e_theme');
  if (themeSaved) {
    currentTheme = themeSaved;
    applyTheme(currentTheme);
  }
}

function saveToLocalStorage() {
  if (currentCharacter) {
    savedCharacters[currentCharacter.id] = currentCharacter;
    localStorage.setItem('dnd5e_characters', JSON.stringify(savedCharacters));
    localStorage.setItem('dnd5e_active_character_id', currentCharacter.id);
  }
}

// --------------------------------------------------------------------------
// PREENCHIMENTO DE SELECTS & OPÇÕES
// --------------------------------------------------------------------------
function populateDropdowns() {
  // Classes
  const classSelect = document.getElementById('charClass');
  classSelect.innerHTML = '';
  Object.keys(DND_DATA.classes).forEach(clsKey => {
    const opt = document.createElement('option');
    opt.value = clsKey;
    opt.textContent = DND_DATA.classes[clsKey].name;
    classSelect.appendChild(opt);
  });

  // Raças
  const raceSelect = document.getElementById('charRace');
  raceSelect.innerHTML = '';
  Object.keys(DND_DATA.races).forEach(raceKey => {
    const opt = document.createElement('option');
    opt.value = raceKey;
    opt.textContent = DND_DATA.races[raceKey].name;
    raceSelect.appendChild(opt);
  });

  // Antecedentes
  const bgSelect = document.getElementById('charBackground');
  bgSelect.innerHTML = '';
  Object.keys(DND_DATA.backgrounds).forEach(bgKey => {
    const opt = document.createElement('option');
    opt.value = bgKey;
    opt.textContent = DND_DATA.backgrounds[bgKey].name;
    bgSelect.appendChild(opt);
  });

  // Armaduras
  const armorSelect = document.getElementById('equippedArmorSelect');
  armorSelect.innerHTML = '';
  DND_DATA.armors.forEach(arm => {
    const opt = document.createElement('option');
    opt.value = arm.id;
    opt.textContent = `${arm.name} (CA ${arm.acBase} - ${arm.type})`;
    armorSelect.appendChild(opt);
  });
}

function updateSubraceDropdown() {
  const subraceSelect = document.getElementById('charSubrace');
  subraceSelect.innerHTML = '<option value="">Padrão</option>';
  const raceData = DND_DATA.races[currentCharacter.race];
  if (raceData && raceData.subraces && Object.keys(raceData.subraces).length > 0) {
    Object.keys(raceData.subraces).forEach(srKey => {
      const opt = document.createElement('option');
      opt.value = srKey;
      opt.textContent = raceData.subraces[srKey].name;
      subraceSelect.appendChild(opt);
    });
    subraceSelect.value = currentCharacter.subrace || '';
  }
}

function updateSubclassDropdown() {
  const subclassSelect = document.getElementById('charSubclass');
  subclassSelect.innerHTML = '<option value="">(Selecione Subclasse)</option>';
  const classData = DND_DATA.classes[currentCharacter.class];
  if (classData && classData.subclasses) {
    Object.keys(classData.subclasses).forEach(scKey => {
      const opt = document.createElement('option');
      opt.value = scKey;
      opt.textContent = classData.subclasses[scKey].name;
      subclassSelect.appendChild(opt);
    });
    subclassSelect.value = currentCharacter.subclass || '';
  }
}

function updateCharacterSelector() {
  const selector = document.getElementById('characterSelector');
  selector.innerHTML = '';
  Object.values(savedCharacters).forEach(char => {
    const opt = document.createElement('option');
    opt.value = char.id;
    opt.textContent = `${char.name} (Nv ${char.level} ${DND_DATA.classes[char.class]?.name || ''})`;
    selector.appendChild(opt);
  });
  selector.value = currentCharacter.id;
}

// --------------------------------------------------------------------------
// CÁLCULOS MATEMÁTICOS DE REGRAS D&D 5E
// --------------------------------------------------------------------------
function getProficiencyBonus(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

function getRacialBonus(attrKey) {
  let bonus = 0;
  const raceData = DND_DATA.races[currentCharacter.race];
  if (raceData && raceData.abilityBonus && raceData.abilityBonus[attrKey]) {
    bonus += raceData.abilityBonus[attrKey];
  }
  if (raceData && raceData.subraces && currentCharacter.subrace) {
    const subraceData = raceData.subraces[currentCharacter.subrace];
    if (subraceData && subraceData.abilityBonus && subraceData.abilityBonus[attrKey]) {
      bonus += subraceData.abilityBonus[attrKey];
    }
  }
  if (currentCharacter.customScoreBonus && currentCharacter.customScoreBonus[attrKey]) {
    bonus += currentCharacter.customScoreBonus[attrKey];
  }
  return bonus;
}

function getTotalScore(attrKey) {
  const base = currentCharacter.baseScores[attrKey] || 10;
  const bonus = getRacialBonus(attrKey);
  return base + bonus;
}

function getAbilityMod(attrKey) {
  const total = getTotalScore(attrKey);
  return Math.floor((total - 10) / 2);
}

function formatMod(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

function calculateArmorClass() {
  const armorId = currentCharacter.equippedArmor || 'nenhuma';
  const armor = DND_DATA.armors.find(a => a.id === armorId) || DND_DATA.armors[0];
  const dexMod = getAbilityMod('dex');
  const shieldBonus = currentCharacter.equippedShield ? 2 : 0;
  
  let ac = 10;

  // Sem armadura: verifica características especiais (Bárbaro / Monge)
  if (armor.id === 'nenhuma') {
    if (currentCharacter.class === 'barbaro') {
      const conMod = getAbilityMod('con');
      ac = 10 + dexMod + conMod + shieldBonus;
    } else if (currentCharacter.class === 'monge' && !currentCharacter.equippedShield) {
      const wisMod = getAbilityMod('wis');
      ac = 10 + dexMod + wisMod;
    } else {
      ac = 10 + dexMod + shieldBonus;
    }
    return { ac, desc: armor.name + (shieldBonus ? ' + Escudo' : '') };
  }

  // Com armadura
  if (armor.dexMod === 'full') {
    ac = armor.acBase + dexMod + shieldBonus;
  } else if (armor.dexMod === 'max2') {
    ac = armor.acBase + Math.min(2, Math.max(0, dexMod)) + shieldBonus;
  } else {
    ac = armor.acBase + shieldBonus;
  }

  return { ac, desc: `${armor.name} (CA ${armor.acBase})${shieldBonus ? ' + Escudo' : ''}` };
}

function calculateSpellcastingStats() {
  const classData = DND_DATA.classes[currentCharacter.class];
  const prof = getProficiencyBonus(currentCharacter.level);
  let abilityKey = 'int';

  if (classData && classData.spellcasting) {
    abilityKey = classData.spellcasting.ability;
  } else if (currentCharacter.class === 'paladino' || currentCharacter.class === 'bardo' || currentCharacter.class === 'feiticeiro' || currentCharacter.class === 'bruxo') {
    abilityKey = 'cha';
  } else if (currentCharacter.class === 'clerigo' || currentCharacter.class === 'druida' || currentCharacter.class === 'patrulheiro') {
    abilityKey = 'wis';
  } else {
    abilityKey = 'int';
  }

  const mod = getAbilityMod(abilityKey);
  const saveDc = 8 + prof + mod;
  const attackBonus = prof + mod;

  return {
    abilityKey,
    abilityName: DND_DATA.abilities[abilityKey]?.name || 'Inteligência',
    saveDc,
    attackBonus
  };
}

function calculateCarryCapacity() {
  const strScore = getTotalScore('str');
  const maxWeight = (strScore * 7.5).toFixed(1);
  const pushWeight = (strScore * 15).toFixed(1);

  // Calcula peso do inventário
  let currentWeight = 0;
  if (currentCharacter.inventory) {
    currentCharacter.inventory.forEach(item => {
      currentWeight += (item.weight || 0) * (item.qty || 1);
    });
  }

  // Moedas (100 moedas = 1kg)
  const totalCoins = (currentCharacter.currency.cp || 0) +
                     (currentCharacter.currency.sp || 0) +
                     (currentCharacter.currency.ep || 0) +
                     (currentCharacter.currency.gp || 0) +
                     (currentCharacter.currency.pp || 0);
  currentWeight += totalCoins / 100;

  // Armadura e armas
  const armor = DND_DATA.armors.find(a => a.id === currentCharacter.equippedArmor);
  if (armor) currentWeight += armor.weight || 0;
  if (currentCharacter.equippedShield) currentWeight += 3;

  return {
    current: currentWeight.toFixed(1),
    max: maxWeight,
    push: pushWeight,
    isEncumbered: currentWeight > maxWeight
  };
}

// --------------------------------------------------------------------------
// RENDERIZAÇÃO COMPLETA DA FICHA
// --------------------------------------------------------------------------
function renderPortrait() {
  if (!currentCharacter) return;
  const img = document.getElementById('heroPortraitImg');
  const ph = document.getElementById('heroPortraitPlaceholder');
  const btn = document.getElementById('btnRemovePortrait');
  if (!img || !ph || !btn) return;
  const src = currentCharacter.portrait;
  if (src) {
    img.src = src;
    img.hidden = false;
    ph.style.display = 'none';
    btn.hidden = false;
  } else {
    img.removeAttribute('src');
    img.hidden = true;
    ph.style.display = 'flex';
    btn.hidden = true;
  }
}

function handlePortraitUpload(file) {
  if (!file || !currentCharacter) return;
  if (!file.type.startsWith('image/')) {
    alert('Selecione um arquivo de imagem válido.');
    return;
  }
  const MAX_BYTES = 2 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    alert('Imagem muito grande (máx. 2 MB). Escolha uma menor para caber no armazenamento do navegador.');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    currentCharacter.portrait = e.target.result;
    try {
      saveToLocalStorage();
    } catch (err) {
      alert('Não foi possível salvar a imagem (armazenamento cheio). Tente uma imagem menor.');
      currentCharacter.portrait = null;
    }
    renderPortrait();
  };
  reader.readAsDataURL(file);
}

function removePortrait() {
  if (!currentCharacter) return;
  currentCharacter.portrait = null;
  saveToLocalStorage();
  renderPortrait();
}

function renderFullSheet() {
  if (!currentCharacter) return;

  // Retrato do personagem
  renderPortrait();

  // Identidade Superior
  document.getElementById('charName').value = currentCharacter.name || '';
  document.getElementById('playerName').value = currentCharacter.player || '';
  document.getElementById('charClass').value = currentCharacter.class || 'guerreiro';
  document.getElementById('charLevel').value = currentCharacter.level || 1;
  document.getElementById('charRace').value = currentCharacter.race || 'anao';
  document.getElementById('charBackground').value = currentCharacter.background || 'soldado';
  document.getElementById('charAlignment').value = currentCharacter.alignment || 'Leal e Bom';
  document.getElementById('charXP').value = currentCharacter.xp || 0;

  updateSubraceDropdown();
  updateSubclassDropdown();
  updateCharacterSelector();

  // Estágio de Jogo
  const level = parseInt(currentCharacter.level) || 1;
  const prof = getProficiencyBonus(level);
  document.getElementById('profBonusDisplay').textContent = formatMod(prof);

  const tierDisplay = document.getElementById('gameTierDisplay');
  if (level <= 4) tierDisplay.textContent = 'Estágio 1 (Níveis 1–4: Aprendizes)';
  else if (level <= 10) tierDisplay.textContent = 'Estágio 2 (Níveis 5–10: Heróis)';
  else if (level <= 16) tierDisplay.textContent = 'Estágio 3 (Níveis 11–16: Mestres)';
  else tierDisplay.textContent = 'Estágio 4 (Níveis 17–20: Lendários)';

  const xpNextTable = {
    1: 300, 2: 900, 3: 2700, 4: 6500, 5: 14000, 6: 23000, 7: 34000, 8: 48000,
    9: 64000, 10: 85000, 11: 100000, 12: 120000, 13: 140000, 14: 165000,
    15: 195000, 16: 225000, 17: 265000, 18: 305000, 19: 355000, 20: 'Nível Máximo'
  };
  document.getElementById('xpNextLevelDisplay').textContent = xpNextTable[level] ? `${xpNextTable[level]} XP` : '—';

  // Inspiração
  renderInspirationBox();

  // Renderizar 6 Atributos
  renderAbilities();

  // Salvaguardas & Perícias
  renderSavingThrows();
  renderSkills();

  // Vitais
  renderVitals();

  // HP & Barra
  renderHP();

  // Testes de Morte & Dados de Vida
  renderDeathAndHitDice();

  // Armas
  renderWeaponsTable();

  // Condições e Recursos
  renderConditions();
  renderClassResources();
  renderTraits();

  // Magias
  renderSpellcastingTab();

  // Inventário
  renderInventoryTab();

  // Biografia
  renderBioTab();
}

function renderInspirationBox() {
  const box = document.getElementById('inspirationBox');
  const display = document.getElementById('inspirationDisplay');
  if (currentCharacter.inspiration) {
    box.classList.add('active-gold');
    display.innerHTML = '<span class="stat-badge-icon">🌟</span> Ativa';
  } else {
    box.classList.remove('active-gold');
    display.innerHTML = '<span class="stat-badge-icon">⚪</span> Inativa';
  }
}

function renderAbilities() {
  const container = document.getElementById('abilitiesListContainer');
  container.innerHTML = '';

  Object.keys(DND_DATA.abilities).forEach(key => {
    const meta = DND_DATA.abilities[key];
    const total = getTotalScore(key);
    const mod = getAbilityMod(key);
    const racialBonus = getRacialBonus(key);

    const card = document.createElement('div');
    card.className = 'ability-card';
    card.innerHTML = `
      <div class="ability-meta">
        <span class="ability-title">${meta.name} (${meta.abbr})</span>
        <div class="ability-input-box">
          <input type="number" class="ability-score-input" value="${currentCharacter.baseScores[key]}" min="1" max="30" onchange="updateBaseScore('${key}', this.value)" title="Valor base antes do bônus racial">
          ${racialBonus !== 0 ? `<span class="ability-racial-badge" title="Bônus racial e customizado">${racialBonus >= 0 ? '+' + racialBonus : racialBonus} racial</span>` : ''}
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">= <strong>${total}</strong></span>
        </div>
      </div>
      <button class="ability-mod-btn" onclick="rollAbilityCheck('${key}')" title="Clique para rolar teste puro de ${meta.name} no d20!">
        <span>${formatMod(mod)}</span>
        <span class="ability-mod-label">Rolar</span>
      </button>
    `;
    container.appendChild(card);
  });
}

function renderSavingThrows() {
  const grid = document.getElementById('savingThrowsGrid');
  grid.innerHTML = '';
  const prof = getProficiencyBonus(currentCharacter.level);

  Object.keys(DND_DATA.abilities).forEach(key => {
    const isProf = (currentCharacter.savingThrowProficiencies || []).includes(key);
    const mod = getAbilityMod(key) + (isProf ? prof : 0);

    const item = document.createElement('div');
    item.className = 'save-item';
    item.innerHTML = `
      <input type="checkbox" class="save-check" ${isProf ? 'checked' : ''} onchange="toggleSavingThrow('${key}')" title="Marcar como teste de resistência proficiente">
      <span class="save-name">${DND_DATA.abilities[key].abbr}</span>
      <button class="save-mod btn" style="padding:2px 6px; font-size:0.8rem;" onclick="rollSavingThrow('${key}')">${formatMod(mod)}</button>
    `;
    grid.appendChild(item);
  });
}

function renderSkills() {
  const container = document.getElementById('skillsListContainer');
  container.innerHTML = '';
  const prof = getProficiencyBonus(currentCharacter.level);

  DND_DATA.skills.forEach(skill => {
    const profLevel = currentCharacter.skillProficiencies?.[skill.id] || 0; // 0, 1, 2
    const abilityMod = getAbilityMod(skill.ability);
    let totalMod = abilityMod;

    if (profLevel === 1) totalMod += prof;
    else if (profLevel === 2) totalMod += (prof * 2);

    const bubbleClass = profLevel === 2 ? 'expertise' : profLevel === 1 ? 'proficient' : '';

    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <div class="skill-left">
        <span class="prof-bubble ${bubbleClass}" onclick="cycleSkillProficiency('${skill.id}')" title="Clique para alternar: Sem Proficiência / Proficiente / Especialização (Dobro)"></span>
        <button class="skill-name-btn" onclick="rollSkillCheck('${skill.id}')">${skill.name}</button>
        <span class="skill-attr-tag">(${DND_DATA.abilities[skill.ability].abbr})</span>
      </div>
      <button class="skill-mod-btn" onclick="rollSkillCheck('${skill.id}')">${formatMod(totalMod)}</button>
    `;
    container.appendChild(row);
  });

  // Percepção Passiva
  const wisMod = getAbilityMod('wis');
  const percProf = currentCharacter.skillProficiencies?.perception || 0;
  const passive = 10 + wisMod + (percProf === 2 ? prof * 2 : percProf === 1 ? prof : 0);
  document.getElementById('passivePerceptionDisplay').textContent = passive;
}

function renderVitals() {
  // CA
  const { ac, desc } = calculateArmorClass();
  document.getElementById('armorClassDisplay').textContent = ac;
  document.getElementById('armorDetailsDisplay').textContent = desc;

  // Iniciativa
  const dexMod = getAbilityMod('dex');
  document.getElementById('initiativeDisplay').textContent = formatMod(dexMod);

  // Deslocamento
  let speed = 9;
  const raceData = DND_DATA.races[currentCharacter.race];
  if (raceData) {
    speed = raceData.speed;
    if (currentCharacter.subrace && raceData.subraces?.[currentCharacter.subrace]?.speed) {
      speed = raceData.subraces[currentCharacter.subrace].speed;
    }
  }
  // Bônus de Monge / Bárbaro
  if (currentCharacter.class === 'monge' && currentCharacter.level >= 2) {
    const monkBonus = currentCharacter.level >= 18 ? 9 : currentCharacter.level >= 14 ? 7.5 : currentCharacter.level >= 10 ? 6 : currentCharacter.level >= 6 ? 4.5 : 3;
    speed += monkBonus;
  } else if (currentCharacter.class === 'barbaro' && currentCharacter.level >= 5) {
    speed += 3;
  }

  document.getElementById('speedDisplay').textContent = `${speed}m`;
  document.getElementById('speedSquaresDisplay').textContent = `${(speed / 1.5).toFixed(0)} quadrados`;

  // Dado de Vida
  const classData = DND_DATA.classes[currentCharacter.class];
  const hitDie = classData?.hitDie || 8;
  document.getElementById('hitDieDisplay').textContent = `d${hitDie}`;
}

function renderHP() {
  const current = parseInt(currentCharacter.hp?.current) || 0;
  const max = parseInt(currentCharacter.hp?.max) || 1;
  const temp = parseInt(currentCharacter.hp?.temp) || 0;

  document.getElementById('hpCurrent').value = current;
  document.getElementById('hpMax').value = max;
  document.getElementById('hpTemp').value = temp;

  const pct = Math.min(100, Math.max(0, Math.round((current / max) * 100)));
  const progressBar = document.getElementById('hpProgressBar');
  progressBar.style.width = `${pct}%`;

  const pctDisplay = document.getElementById('hpPercentageDisplay');
  pctDisplay.textContent = `${pct}%`;

  if (pct > 50) {
    progressBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
    pctDisplay.style.color = 'var(--accent-green)';
  } else if (pct > 25) {
    progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
    pctDisplay.style.color = '#f59e0b';
  } else {
    progressBar.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
    pctDisplay.style.color = 'var(--accent-red)';
  }
}

function renderDeathAndHitDice() {
  const level = parseInt(currentCharacter.level) || 1;
  const spent = currentCharacter.hitDiceSpent || 0;
  const left = Math.max(0, level - spent);
  const classData = DND_DATA.classes[currentCharacter.class];
  const hitDie = classData?.hitDie || 8;

  document.getElementById('hitDiceLeftDisplay').textContent = `${left} / ${level} (d${hitDie})`;

  // Salvaguardas contra morte
  const ds = currentCharacter.deathSaves || { successes: 0, failures: 0 };
  document.getElementById('deathSuccess1').checked = ds.successes >= 1;
  document.getElementById('deathSuccess2').checked = ds.successes >= 2;
  document.getElementById('deathSuccess3').checked = ds.successes >= 3;

  document.getElementById('deathFail1').checked = ds.failures >= 1;
  document.getElementById('deathFail2').checked = ds.failures >= 2;
  document.getElementById('deathFail3').checked = ds.failures >= 3;
}

function renderWeaponsTable() {
  const tbody = document.getElementById('weaponsTableBody');
  tbody.innerHTML = '';
  const prof = getProficiencyBonus(currentCharacter.level);
  const strMod = getAbilityMod('str');
  const dexMod = getAbilityMod('dex');

  if (!currentCharacter.weapons || currentCharacter.weapons.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:16px;">Nenhuma arma adicionada. Clique em "+ Adicionar Arma".</td></tr>`;
    return;
  }

  currentCharacter.weapons.forEach((w, index) => {
    // Escolhe se usa Força ou Destreza
    const isDex = w.attackModType === 'dex' || (w.properties?.includes('Acuidade') && dexMod > strMod);
    const abilityMod = isDex ? dexMod : strMod;
    const atkBonus = prof + abilityMod;
    const dmgBonus = abilityMod;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${w.name}</strong></td>
      <td><strong>${formatMod(atkBonus)}</strong></td>
      <td>${w.damage} ${formatMod(dmgBonus)} <small style="color:var(--text-muted);">${w.damageType || ''}</small></td>
      <td><small style="color:var(--text-secondary);">${w.properties || '—'}</small></td>
      <td style="text-align:right;">
        <button class="weapon-roll-btn" onclick="rollWeaponAttack(${index})" title="Rolar Ataque com ${w.name}">Atk 🎲</button>
        <button class="weapon-roll-btn" style="margin-left:4px;" onclick="rollWeaponDamage(${index})" title="Rolar Dano de ${w.name}">Dano 💥</button>
        <button class="btn btn-icon" style="padding:2px; font-size:0.75rem; color:var(--accent-red);" onclick="removeWeapon(${index})" title="Remover arma">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderConditions() {
  const container = document.getElementById('conditionsContainer');
  container.innerHTML = '';
  const active = currentCharacter.activeConditions || [];

  DND_DATA.conditions.forEach(cond => {
    const isAct = active.includes(cond.id);
    const chip = document.createElement('span');
    chip.className = `condition-chip ${isAct ? 'active' : ''}`;
    chip.textContent = cond.name;
    chip.title = cond.desc;
    chip.onclick = () => toggleCondition(cond.id);
    container.appendChild(chip);
  });

  document.getElementById('exhaustionSelect').value = currentCharacter.exhaustion || 0;
  const exLevel = parseInt(currentCharacter.exhaustion) || 0;
  const exEffect = DND_DATA.exhaustionLevels[exLevel]?.effect || '';
  document.getElementById('exhaustionEffectText').textContent = exEffect;
}

function renderClassResources() {
  const container = document.getElementById('classResourcesContainer');
  container.innerHTML = '';

  if (!currentCharacter.customResources || currentCharacter.customResources.length === 0) {
    // Inicializa recursos típicos de classe caso vazios
    setupDefaultClassResources();
  }

  currentCharacter.customResources.forEach((res, index) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'space-between';
    row.style.padding = '8px 10px';
    row.style.background = 'rgba(0,0,0,0.2)';
    row.style.borderRadius = 'var(--radius-sm)';

    row.innerHTML = `
      <div>
        <strong style="font-size:0.85rem; color:var(--text-primary);">${res.name}</strong>
        <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase;">Recarrega: Descanso ${res.rest || 'Longo'}</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <button class="btn" style="padding:2px 8px; font-size:0.8rem;" onclick="adjustResource(${index}, -1)">-</button>
        <span style="font-family:var(--font-title); font-weight:800; min-width:36px; text-align:center; color:var(--accent-gold-light);">${res.current} / ${res.max}</span>
        <button class="btn" style="padding:2px 8px; font-size:0.8rem;" onclick="adjustResource(${index}, 1)">+</button>
        <button class="btn btn-icon" style="padding:2px; font-size:0.75rem; color:var(--accent-red);" onclick="removeResource(${index})">✕</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function setupDefaultClassResources() {
  const level = parseInt(currentCharacter.level) || 1;
  const res = [];

  if (currentCharacter.class === 'barbaro') {
    const rages = level >= 20 ? 999 : level >= 17 ? 6 : level >= 12 ? 5 : level >= 6 ? 4 : level >= 3 ? 3 : 2;
    res.push({ name: 'Fúrias', current: rages, max: rages, rest: 'longo' });
  } else if (currentCharacter.class === 'bardo') {
    const chaMod = Math.max(1, getAbilityMod('cha'));
    res.push({ name: 'Inspiração de Bardo', current: chaMod, max: chaMod, rest: level >= 5 ? 'curto' : 'longo' });
  } else if (currentCharacter.class === 'guerreiro') {
    res.push({ name: 'Retomar o Fôlego', current: 1, max: 1, rest: 'curto' });
    if (level >= 2) res.push({ name: 'Surto de Ação', current: level >= 17 ? 2 : 1, max: level >= 17 ? 2 : 1, rest: 'curto' });
    if (level >= 9) res.push({ name: 'Indomável', current: level >= 17 ? 3 : level >= 13 ? 2 : 1, max: level >= 17 ? 3 : level >= 13 ? 2 : 1, rest: 'longo' });
  } else if (currentCharacter.class === 'monge' && level >= 2) {
    res.push({ name: 'Pontos de Chi', current: level, max: level, rest: 'curto' });
  } else if (currentCharacter.class === 'paladino') {
    res.push({ name: 'Cura pelas Mãos (PV)', current: level * 5, max: level * 5, rest: 'longo' });
    const chaMod = Math.max(1, getAbilityMod('cha'));
    res.push({ name: 'Sentido Divino', current: 1 + chaMod, max: 1 + chaMod, rest: 'longo' });
    if (level >= 3) res.push({ name: 'Canalizar Divindade', current: 1, max: 1, rest: 'curto' });
  } else if (currentCharacter.class === 'clerigo' && level >= 2) {
    const uses = level >= 18 ? 3 : level >= 6 ? 2 : 1;
    res.push({ name: 'Canalizar Divindade', current: uses, max: uses, rest: 'curto' });
  } else if (currentCharacter.class === 'druida' && level >= 2) {
    res.push({ name: 'Forma Selvagem', current: 2, max: 2, rest: 'curto' });
  } else if (currentCharacter.class === 'feiticeiro' && level >= 2) {
    res.push({ name: 'Pontos de Feitiçaria', current: level, max: level, rest: 'longo' });
  }

  currentCharacter.customResources = res;
}

function renderTraits() {
  const container = document.getElementById('traitsScrollArea');
  container.innerHTML = '';

  // Traços Raciais
  const raceData = DND_DATA.races[currentCharacter.race];
  if (raceData) {
    (raceData.traits || []).forEach(tr => {
      const pill = document.createElement('div');
      pill.className = 'trait-pill';
      pill.innerHTML = `<div class="trait-pill-title">Raça: ${raceData.name}</div>${tr}`;
      container.appendChild(pill);
    });

    if (currentCharacter.subrace && raceData.subraces?.[currentCharacter.subrace]) {
      const sub = raceData.subraces[currentCharacter.subrace];
      (sub.traits || []).forEach(tr => {
        const pill = document.createElement('div');
        pill.className = 'trait-pill';
        pill.innerHTML = `<div class="trait-pill-title">Sub-raça: ${sub.name}</div>${tr}`;
        container.appendChild(pill);
      });
    }
  }

  // Características de Classe por Nível
  const classData = DND_DATA.classes[currentCharacter.class];
  const level = parseInt(currentCharacter.level) || 1;
  if (classData) {
    for (let l = 1; l <= level; l++) {
      const featList = classData.featuresByLevel[l] || [];
      featList.forEach(f => {
        const pill = document.createElement('div');
        pill.className = 'trait-pill';
        pill.style.borderLeftColor = 'var(--accent-blue)';
        pill.innerHTML = `<div class="trait-pill-title" style="color:#93c5fd;">${classData.name} (${l}º Nível)</div>${f}`;
        container.appendChild(pill);
      });
    }

    // Subclasse
    if (currentCharacter.subclass && classData.subclasses?.[currentCharacter.subclass]) {
      const sc = classData.subclasses[currentCharacter.subclass];
      Object.keys(sc.features || {}).forEach(reqLvl => {
        if (level >= parseInt(reqLvl)) {
          sc.features[reqLvl].forEach(f => {
            const pill = document.createElement('div');
            pill.className = 'trait-pill';
            pill.style.borderLeftColor = 'var(--accent-purple)';
            pill.innerHTML = `<div class="trait-pill-title" style="color:#c4b5fd;">${sc.name} (${reqLvl}º Nível)</div>${f}`;
            container.appendChild(pill);
          });
        }
      });
    }
  }

  // Antecedente
  const bgData = DND_DATA.backgrounds[currentCharacter.background];
  if (bgData) {
    const pill = document.createElement('div');
    pill.className = 'trait-pill';
    pill.style.borderLeftColor = 'var(--accent-green)';
    pill.innerHTML = `<div class="trait-pill-title" style="color:#6ee7b7;">Antecedente: ${bgData.name}</div>${bgData.feature}`;
    container.appendChild(pill);
  }
}

// --------------------------------------------------------------------------
// ABA 2: MAGIAS & CONJURAÇÃO
// --------------------------------------------------------------------------
function renderSpellcastingTab() {
  const stats = calculateSpellcastingStats();
  document.getElementById('spellcastingAbilityDisplay').textContent = `${stats.abilityName} (${stats.abilityKey.toUpperCase()})`;
  document.getElementById('spellSaveDcDisplay').textContent = stats.saveDc;
  document.getElementById('spellAttackBonusDisplay').textContent = formatMod(stats.attackBonus);

  const container = document.getElementById('spellSlotsGridContainer');
  container.innerHTML = '';

  // Truques (Círculo 0)
  const cantrips = (currentCharacter.spells || []).filter(s => s.level === 0);
  const cantripCard = document.createElement('div');
  cantripCard.className = 'spell-level-card';
  cantripCard.innerHTML = `
    <div class="spell-level-title">
      <span>Truques (Nível 0)</span>
      <small style="color:var(--text-muted);">Sem gasto de espaços</small>
    </div>
    <div class="spell-items-list" id="spellsListLevel0">
      ${cantrips.length === 0 ? '<div style="color:var(--text-muted); font-size:0.8rem;">Nenhum truque adicionado.</div>' : ''}
    </div>
  `;
  container.appendChild(cantripCard);

  const cantripsList = cantripCard.querySelector('#spellsListLevel0');
  cantrips.forEach(sp => {
    cantripsList.appendChild(createSpellItemElement(sp));
  });

  // Círculos 1 a 9
  for (let lvl = 1; lvl <= 9; lvl++) {
    const slotData = currentCharacter.spellSlots?.[lvl - 1] || { level: lvl, max: 0, spent: 0 };
    const levelSpells = (currentCharacter.spells || []).filter(s => s.level === lvl);

    const card = document.createElement('div');
    card.className = 'spell-level-card';

    let pipsHtml = '';
    for (let p = 0; p < slotData.max; p++) {
      const isSpent = p < slotData.spent;
      pipsHtml += `<span class="slot-pip ${isSpent ? 'spent' : ''}" onclick="toggleSpellSlot(${lvl}, ${p})" title="Espaço de magia: clique para gastar/recuperar"></span>`;
    }

    card.innerHTML = `
      <div class="spell-level-title">
        <span>${lvl}º Círculo</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="number" value="${slotData.max}" min="0" max="10" style="width:40px; text-align:center; padding:2px; font-size:0.8rem;" onchange="updateMaxSlots(${lvl}, this.value)" title="Espaços Totais">
          <div class="slot-pips-container">${pipsHtml}</div>
        </div>
      </div>
      <div class="spell-items-list" id="spellsListLevel${lvl}">
        ${levelSpells.length === 0 ? '<div style="color:var(--text-muted); font-size:0.8rem;">Nenhuma magia adicionada neste círculo.</div>' : ''}
      </div>
    `;
    container.appendChild(card);

    const spellsList = card.querySelector(`#spellsListLevel${lvl}`);
    levelSpells.forEach(sp => {
      spellsList.appendChild(createSpellItemElement(sp));
    });
  }
}

function createSpellItemElement(sp) {
  const item = document.createElement('div');
  item.className = 'spell-item';
  item.innerHTML = `
    <div>
      <strong>${sp.name}</strong>
      <div style="font-size:0.72rem; color:var(--text-secondary);">${sp.time || '1 ação'} • ${sp.range || 'Toque'} • ${sp.duration || 'Instantânea'}</div>
    </div>
    <div style="display:flex; align-items:center; gap:6px;">
      <span class="spell-tag">${sp.school || 'Magia'}</span>
      <button class="btn btn-icon" style="padding:2px; font-size:0.75rem; color:var(--accent-red);" onclick="removeSpell('${sp.id}')" title="Remover do grimório">✕</button>
    </div>
  `;
  item.onclick = (e) => {
    if (e.target.tagName !== 'BUTTON') {
      alert(`✨ ${sp.name} (${sp.level === 0 ? 'Truque' : sp.level + 'º Círculo'})\nEscola: ${sp.school}\nTempo: ${sp.time}\nAlcance: ${sp.range}\nComponentes: ${sp.comp}\nDuração: ${sp.duration}\n\nDescrição: ${sp.desc}`);
    }
  };
  return item;
}

// --------------------------------------------------------------------------
// ABA 3: INVENTÁRIO & EQUIPAMENTO
// --------------------------------------------------------------------------
function renderInventoryTab() {
  document.getElementById('coinPC').value = currentCharacter.currency?.cp || 0;
  document.getElementById('coinPP').value = currentCharacter.currency?.sp || 0;
  document.getElementById('coinPE').value = currentCharacter.currency?.ep || 0;
  document.getElementById('coinPO').value = currentCharacter.currency?.gp || 0;
  document.getElementById('coinPL').value = currentCharacter.currency?.pp || 0;

  document.getElementById('equippedArmorSelect').value = currentCharacter.equippedArmor || 'nenhuma';
  document.getElementById('equippedShieldChk').checked = !!currentCharacter.equippedShield;

  const tbody = document.getElementById('inventoryTableBody');
  tbody.innerHTML = '';

  if (!currentCharacter.inventory || currentCharacter.inventory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:16px;">Mochila vazia. Clique em "+ Adicionar Item".</td></tr>`;
  } else {
    currentCharacter.inventory.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td style="text-align:center;">
          <input type="number" value="${item.qty || 1}" min="1" style="width:50px; text-align:center; padding:2px;" onchange="updateItemQty(${index}, this.value)">
        </td>
        <td style="text-align:center;">${((item.weight || 0) * (item.qty || 1)).toFixed(1)} kg</td>
        <td style="text-align:right;">
          <button class="btn btn-icon" style="padding:2px; font-size:0.75rem; color:var(--accent-red);" onclick="removeInventoryItem(${index})" title="Remover">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Capacidade de Carga
  const carry = calculateCarryCapacity();
  document.getElementById('currentWeightDisplay').textContent = `${carry.current} kg`;
  document.getElementById('maxWeightDisplay').textContent = `${carry.max} kg`;
  document.getElementById('pushWeightDisplay').textContent = `${carry.push} kg`;

  const encAlert = document.getElementById('encumbranceAlert');
  if (carry.isEncumbered) {
    encAlert.textContent = '⚠️ SOBRECARGA: Peso excedido! Deslocamento reduzido em 3 metros.';
    encAlert.style.color = 'var(--accent-red)';
  } else {
    encAlert.textContent = '✓ Sem sobrecarga de peso';
    encAlert.style.color = 'var(--accent-green)';
  }
}

// --------------------------------------------------------------------------
// ABA 4: BIOGRAFIA & ROLEPLAY
// --------------------------------------------------------------------------
function renderBioTab() {
  document.getElementById('bioTraits').value = currentCharacter.bio?.traits || '';
  document.getElementById('bioIdeals').value = currentCharacter.bio?.ideals || '';
  document.getElementById('bioBonds').value = currentCharacter.bio?.bonds || '';
  document.getElementById('bioFlaws').value = currentCharacter.bio?.flaws || '';
  document.getElementById('bioBackstory').value = currentCharacter.bio?.backstory || '';
  document.getElementById('bioAppearance').value = currentCharacter.bio?.appearance || '';
}

// --------------------------------------------------------------------------
// ROLADOR DE DADOS (DICE ROLLER COM VANTAGEM / DESVANTAGEM)
// --------------------------------------------------------------------------
function setRollMode(mode) {
  rollMode = mode;
  document.querySelectorAll('.dice-mode-toggle .mode-btn').forEach(btn => btn.classList.remove('active'));
  if (mode === 'normal') document.getElementById('modeNormal').classList.add('active');
  if (mode === 'advantage') document.getElementById('modeAdv').classList.add('active');
  if (mode === 'disadvantage') document.getElementById('modeDis').classList.add('active');
}

function rollD20Core() {
  const r1 = Math.floor(Math.random() * 20) + 1;
  const r2 = Math.floor(Math.random() * 20) + 1;

  if (rollMode === 'advantage') {
    const val = Math.max(r1, r2);
    return { val, detail: `[${r1}, ${r2}] Vantagem`, isNat20: val === 20, isNat1: val === 1 };
  } else if (rollMode === 'disadvantage') {
    const val = Math.min(r1, r2);
    return { val, detail: `[${r1}, ${r2}] Desvantagem`, isNat20: val === 20, isNat1: val === 1 };
  } else {
    return { val: r1, detail: `[${r1}]`, isNat20: r1 === 20, isNat1: r1 === 1 };
  }
}

function addDiceLog(label, diceResult, total, isNat20, isNat1) {
  const container = document.getElementById('diceLogContainer');
  const entry = document.createElement('div');
  entry.className = 'dice-log-entry';

  let highlightClass = isNat20 ? 'nat20' : isNat1 ? 'nat1' : '';
  let specialBadge = isNat20 ? ' ★ CRÍTICO (20)!' : isNat1 ? ' ✖ FALHA CRÍTICA (1)!' : '';

  entry.innerHTML = `
    <div>
      <strong style="color:var(--text-primary); font-size:0.85rem;">${label}</strong>
      <div style="font-size:0.72rem; color:var(--text-secondary);">${diceResult}${specialBadge}</div>
    </div>
    <span class="dice-log-result ${highlightClass}">${total}</span>
  `;
  container.prepend(entry);

  // Abre gaveta de dados caso fechada
  document.getElementById('diceDrawer').classList.add('open');
}

function clearDiceLog() {
  document.getElementById('diceLogContainer').innerHTML = '';
}

function rollDie(sides) {
  if (sides === 20) {
    const r = rollD20Core();
    addDiceLog('d20 Puro', r.detail, r.val, r.isNat20, r.isNat1);
  } else {
    const val = Math.floor(Math.random() * sides) + 1;
    addDiceLog(`d${sides}`, `[${val}]`, val, false, false);
  }
}

function rollCustomDicePrompt() {
  const formula = prompt('Digite a fórmula de dados (ex: 2d6+3 ou 3d8):', '2d6+3');
  if (!formula) return;
  parseAndRollDiceFormula(formula, 'Rolagem Customizada');
}

function parseAndRollDiceFormula(formula, label) {
  try {
    const match = formula.replace(/\s+/g, '').match(/^(\d+)d(\d+)([+-]\d+)?$/i);
    if (!match) {
      alert('Fórmula inválida! Use o formato: XdY ou XdY+Z (ex: 2d6, 1d8+3)');
      return;
    }
    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const mod = match[3] ? parseInt(match[3]) : 0;

    let rolls = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * sides) + 1;
      rolls.push(r);
      sum += r;
    }
    const total = sum + mod;
    addDiceLog(label, `${formula} -> [${rolls.join(', ')}] ${formatMod(mod)}`, total, false, false);
  } catch (e) {
    console.error(e);
  }
}

// ROLAGENS ESPECÍFICAS DA FICHA
function rollAbilityCheck(attrKey) {
  const meta = DND_DATA.abilities[attrKey];
  const mod = getAbilityMod(attrKey);
  const r = rollD20Core();
  const total = r.val + mod;
  addDiceLog(`Teste de ${meta.name}`, `d20 ${r.detail} + Mod (${formatMod(mod)})`, total, r.isNat20, r.isNat1);
}

function rollSavingThrow(attrKey) {
  const meta = DND_DATA.abilities[attrKey];
  const isProf = (currentCharacter.savingThrowProficiencies || []).includes(attrKey);
  const prof = getProficiencyBonus(currentCharacter.level);
  const mod = getAbilityMod(attrKey) + (isProf ? prof : 0);
  const r = rollD20Core();
  const total = r.val + mod;
  addDiceLog(`Salvaguarda: ${meta.name}`, `d20 ${r.detail} + Mod (${formatMod(mod)}) ${isProf ? '[Proficiente]' : ''}`, total, r.isNat20, r.isNat1);
}

function rollSkillCheck(skillId) {
  const skill = DND_DATA.skills.find(s => s.id === skillId);
  if (!skill) return;
  const profLevel = currentCharacter.skillProficiencies?.[skill.id] || 0;
  const prof = getProficiencyBonus(currentCharacter.level);
  const abilityMod = getAbilityMod(skill.ability);
  let totalMod = abilityMod;
  let labelTag = '';

  if (profLevel === 1) {
    totalMod += prof;
    labelTag = '[Proficiente]';
  } else if (profLevel === 2) {
    totalMod += (prof * 2);
    labelTag = '[Especialização x2]';
  }

  const r = rollD20Core();
  const total = r.val + totalMod;
  addDiceLog(`Perícia: ${skill.name}`, `d20 ${r.detail} + Mod (${formatMod(totalMod)}) ${labelTag}`, total, r.isNat20, r.isNat1);
}

function rollWeaponAttack(index) {
  const w = currentCharacter.weapons[index];
  if (!w) return;
  const prof = getProficiencyBonus(currentCharacter.level);
  const strMod = getAbilityMod('str');
  const dexMod = getAbilityMod('dex');
  const isDex = w.attackModType === 'dex' || (w.properties?.includes('Acuidade') && dexMod > strMod);
  const mod = (isDex ? dexMod : strMod) + prof;

  const r = rollD20Core();
  const total = r.val + mod;
  addDiceLog(`Ataque com ${w.name}`, `d20 ${r.detail} + Bônus (${formatMod(mod)})`, total, r.isNat20, r.isNat1);
}

function rollWeaponDamage(index) {
  const w = currentCharacter.weapons[index];
  if (!w) return;
  const strMod = getAbilityMod('str');
  const dexMod = getAbilityMod('dex');
  const isDex = w.attackModType === 'dex' || (w.properties?.includes('Acuidade') && dexMod > strMod);
  const mod = isDex ? dexMod : strMod;

  parseAndRollDiceFormula(`${w.damage}${formatMod(mod)}`, `Dano: ${w.name} (${w.damageType || 'dano'})`);
}

function rollDeathSave() {
  const r = rollD20Core();
  const ds = currentCharacter.deathSaves || { successes: 0, failures: 0 };

  if (r.val === 20) {
    adjustHP(1);
    addDiceLog('Teste contra a Morte', '20 NATURAL! O herói recupera 1 PV e acorda!', 20, true, false);
    resetDeathSaves();
    return;
  } else if (r.val === 1) {
    ds.failures = Math.min(3, ds.failures + 2);
    addDiceLog('Teste contra a Morte', '1 NATURAL! 2 Fracassos acumulados!', 1, false, true);
  } else if (r.val >= 10) {
    ds.successes = Math.min(3, ds.successes + 1);
    addDiceLog('Teste contra a Morte', `Sucesso (${r.val})!`, r.val, false, false);
  } else {
    ds.failures = Math.min(3, ds.failures + 1);
    addDiceLog('Teste contra a Morte', `Fracasso (${r.val})!`, r.val, false, false);
  }

  currentCharacter.deathSaves = ds;
  if (ds.failures >= 3) {
    alert('💀 TRAGÉDIA: O personagem acumulou 3 fracassos contra a morte e pereceu!');
  } else if (ds.successes >= 3) {
    alert('🛡️ ESTABILIZADO: O personagem obteve 3 sucessos e está estável com 0 PV!');
  }

  saveToLocalStorage();
  renderDeathAndHitDice();
}

function resetDeathSaves() {
  currentCharacter.deathSaves = { successes: 0, failures: 0 };
  saveToLocalStorage();
  renderDeathAndHitDice();
}

// --------------------------------------------------------------------------
// EVENT LISTENERS & MANIPULAÇÃO DINÂMICA
// --------------------------------------------------------------------------
function setupUIEventListeners() {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      document.getElementById(tabId)?.classList.add('active');
    });
  });

  // Tema
  document.getElementById('btnToggleTheme').addEventListener('click', toggleTheme);

  // Rolador Drawer
  document.getElementById('toggleDiceDrawerBtn').addEventListener('click', () => {
    document.getElementById('diceDrawer').classList.toggle('open');
  });

  // Iniciativa
  document.getElementById('rollInitiativeBtn').addEventListener('click', () => {
    const dexMod = getAbilityMod('dex');
    const r = rollD20Core();
    const total = r.val + dexMod;
    addDiceLog('Iniciativa', `d20 ${r.detail} + Destreza (${formatMod(dexMod)})`, total, r.isNat20, r.isNat1);
  });

  // Inspiração Toggle
  document.getElementById('inspirationBox').addEventListener('click', () => {
    currentCharacter.inspiration = !currentCharacter.inspiration;
    saveToLocalStorage();
    renderInspirationBox();
  });

  // Gastar Dado de Vida
  document.getElementById('btnSpendHitDie').addEventListener('click', spendHitDie);
  document.getElementById('btnResetHitDice').addEventListener('click', () => {
    currentCharacter.hitDiceSpent = 0;
    saveToLocalStorage();
    renderDeathAndHitDice();
  });

  // Descansos
  document.getElementById('btnShortRest').addEventListener('click', triggerShortRest);
  document.getElementById('btnLongRest').addEventListener('click', triggerLongRest);

  // Exportar / Importar JSON
  document.getElementById('btnExportJson').addEventListener('click', exportCharacterJson);
  document.getElementById('importJsonInput').addEventListener('change', importCharacterJson);
  document.getElementById('btnPrintSheet').addEventListener('click', () => window.print());

  // Novo Personagem
  document.getElementById('btnNewCharacter').addEventListener('click', createNewCharacterAction);

  // Seletor de Personagem
  document.getElementById('characterSelector').addEventListener('change', (e) => {
    const id = e.target.value;
    if (savedCharacters[id]) {
      currentCharacter = savedCharacters[id];
      saveToLocalStorage();
      renderFullSheet();
    }
  });

  // Retrato: upload e remoção
  const portraitInput = document.getElementById('portraitFileInput');
  if (portraitInput) {
    portraitInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      handlePortraitUpload(file);
      e.target.value = '';
    });
  }
  const btnRemovePortrait = document.getElementById('btnRemovePortrait');
  if (btnRemovePortrait) {
    btnRemovePortrait.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm('Remover a foto do personagem?')) removePortrait();
    });
  }

  // Inputs de Identidade
  bindField('charName', 'name');
  bindField('playerName', 'player');
  bindField('charLevel', 'level', (val) => {
    currentCharacter.level = Math.max(1, Math.min(20, parseInt(val) || 1));
    saveToLocalStorage();
    renderFullSheet();
  });
  bindField('charXP', 'xp');
  bindField('charAlignment', 'alignment');

  document.getElementById('charClass').addEventListener('change', (e) => {
    currentCharacter.class = e.target.value;
    currentCharacter.subclass = '';
    setupDefaultClassResources();
    saveToLocalStorage();
    renderFullSheet();
  });

  document.getElementById('charSubclass').addEventListener('change', (e) => {
    currentCharacter.subclass = e.target.value;
    saveToLocalStorage();
    renderFullSheet();
  });

  document.getElementById('charRace').addEventListener('change', (e) => {
    currentCharacter.race = e.target.value;
    currentCharacter.subrace = '';
    saveToLocalStorage();
    renderFullSheet();
  });

  document.getElementById('charSubrace').addEventListener('change', (e) => {
    currentCharacter.subrace = e.target.value;
    saveToLocalStorage();
    renderFullSheet();
  });

  document.getElementById('charBackground').addEventListener('change', (e) => {
    currentCharacter.background = e.target.value;
    const bgData = DND_DATA.backgrounds[e.target.value];
    if (bgData && bgData.skills) {
      bgData.skills.forEach(s => {
        currentCharacter.skillProficiencies[s] = Math.max(currentCharacter.skillProficiencies[s] || 0, 1);
      });
    }
    saveToLocalStorage();
    renderFullSheet();
  });

  // HP Inputs
  bindNumberField('hpCurrent', (val) => { currentCharacter.hp.current = val; renderHP(); });
  bindNumberField('hpMax', (val) => { currentCharacter.hp.max = val; renderHP(); });
  bindNumberField('hpTemp', (val) => { currentCharacter.hp.temp = val; renderHP(); });

  // Exaustão
  document.getElementById('exhaustionSelect').addEventListener('change', (e) => {
    currentCharacter.exhaustion = parseInt(e.target.value) || 0;
    saveToLocalStorage();
    renderConditions();
  });

  // Armadura e Escudo
  document.getElementById('equippedArmorSelect').addEventListener('change', (e) => {
    currentCharacter.equippedArmor = e.target.value;
    saveToLocalStorage();
    renderVitals();
    renderInventoryTab();
  });

  document.getElementById('equippedShieldChk').addEventListener('change', (e) => {
    currentCharacter.equippedShield = e.target.checked;
    saveToLocalStorage();
    renderVitals();
    renderInventoryTab();
  });

  // Moedas
  bindCoinField('coinPC', 'cp');
  bindCoinField('coinPP', 'sp');
  bindCoinField('coinPE', 'ep');
  bindCoinField('coinPO', 'gp');
  bindCoinField('coinPL', 'pp');

  // Biografia
  bindBioField('bioTraits', 'traits');
  bindBioField('bioIdeals', 'ideals');
  bindBioField('bioBonds', 'bonds');
  bindBioField('bioFlaws', 'flaws');
  bindBioField('bioBackstory', 'backstory');
  bindBioField('bioAppearance', 'appearance');

  // Modais
  document.getElementById('btnOpenWizard').addEventListener('click', openWizardModal);
  document.getElementById('btnAddWeaponModalBtn').addEventListener('click', openAddWeaponModal);
  document.getElementById('btnOpenSpellCompendiumBtn').addEventListener('click', openSpellCompendiumModal);
  document.getElementById('btnAddCustomSpellBtn').addEventListener('click', openAddCustomSpellModal);
  document.getElementById('spellSearchInput').addEventListener('input', filterSpellCompendium);
  document.getElementById('spellFilterLevel').addEventListener('change', filterSpellCompendium);
  document.getElementById('spellFilterSchool').addEventListener('change', filterSpellCompendium);
}

function bindField(elemId, prop, customHandler) {
  const el = document.getElementById(elemId);
  el.addEventListener('change', () => {
    if (customHandler) customHandler(el.value);
    else {
      currentCharacter[prop] = el.value;
      saveToLocalStorage();
    }
  });
}

function bindNumberField(elemId, handler) {
  const el = document.getElementById(elemId);
  el.addEventListener('change', () => {
    handler(parseInt(el.value) || 0);
    saveToLocalStorage();
  });
}

function bindCoinField(elemId, coinKey) {
  const el = document.getElementById(elemId);
  el.addEventListener('change', () => {
    currentCharacter.currency[coinKey] = parseInt(el.value) || 0;
    saveToLocalStorage();
    renderInventoryTab();
  });
}

function bindBioField(elemId, prop) {
  const el = document.getElementById(elemId);
  el.addEventListener('change', () => {
    if (!currentCharacter.bio) currentCharacter.bio = {};
    currentCharacter.bio[prop] = el.value;
    saveToLocalStorage();
  });
}

// --------------------------------------------------------------------------
// MUTAÇÕES DO ESTADO DO PERSONAGEM
// --------------------------------------------------------------------------
function updateBaseScore(attrKey, val) {
  currentCharacter.baseScores[attrKey] = parseInt(val) || 10;
  saveToLocalStorage();
  renderFullSheet();
}

function toggleSavingThrow(attrKey) {
  if (!currentCharacter.savingThrowProficiencies) currentCharacter.savingThrowProficiencies = [];
  const idx = currentCharacter.savingThrowProficiencies.indexOf(attrKey);
  if (idx > -1) currentCharacter.savingThrowProficiencies.splice(idx, 1);
  else currentCharacter.savingThrowProficiencies.push(attrKey);
  saveToLocalStorage();
  renderSavingThrows();
}

function cycleSkillProficiency(skillId) {
  if (!currentCharacter.skillProficiencies) currentCharacter.skillProficiencies = {};
  const current = currentCharacter.skillProficiencies[skillId] || 0;
  const next = (current + 1) % 3; // 0 -> 1 -> 2 -> 0
  currentCharacter.skillProficiencies[skillId] = next;
  saveToLocalStorage();
  renderSkills();
}

function adjustHP(amount) {
  const cur = parseInt(currentCharacter.hp.current) || 0;
  const max = parseInt(currentCharacter.hp.max) || 1;
  currentCharacter.hp.current = Math.max(0, Math.min(max, cur + amount));
  saveToLocalStorage();
  renderHP();
}

function resetHPToMax() {
  currentCharacter.hp.current = currentCharacter.hp.max;
  saveToLocalStorage();
  renderHP();
}

function spendHitDie() {
  const level = parseInt(currentCharacter.level) || 1;
  const spent = currentCharacter.hitDiceSpent || 0;
  if (spent >= level) {
    alert('Você já gastou todos os seus Dados de Vida! Termine um descanso longo para recuperar.');
    return;
  }
  const classData = DND_DATA.classes[currentCharacter.class];
  const die = classData?.hitDie || 8;
  const conMod = getAbilityMod('con');
  const rolled = Math.floor(Math.random() * die) + 1;
  const healed = Math.max(1, rolled + conMod);

  currentCharacter.hitDiceSpent = spent + 1;
  adjustHP(healed);
  addDiceLog('Gastar Dado de Vida', `d${die} [${rolled}] + Con (${formatMod(conMod)})`, `+${healed} PV`, false, false);
  renderDeathAndHitDice();
}

function toggleCondition(condId) {
  if (!currentCharacter.activeConditions) currentCharacter.activeConditions = [];
  const idx = currentCharacter.activeConditions.indexOf(condId);
  if (idx > -1) currentCharacter.activeConditions.splice(idx, 1);
  else currentCharacter.activeConditions.push(condId);
  saveToLocalStorage();
  renderConditions();
}

function clearAllConditions() {
  currentCharacter.activeConditions = [];
  saveToLocalStorage();
  renderConditions();
}

function adjustResource(index, delta) {
  const res = currentCharacter.customResources[index];
  if (!res) return;
  res.current = Math.max(0, Math.min(res.max, res.current + delta));
  saveToLocalStorage();
  renderClassResources();
}

function removeResource(index) {
  currentCharacter.customResources.splice(index, 1);
  saveToLocalStorage();
  renderClassResources();
}

function addNewCustomResource() {
  const name = prompt('Nome do recurso ou habilidade (ex: Fúria, Inspiração, Toque Divino):');
  if (!name) return;
  const max = parseInt(prompt('Quantidade máxima de usos:', '3')) || 3;
  const rest = prompt('Recarrega em qual descanso? (curto / longo):', 'longo');
  currentCharacter.customResources.push({ name, current: max, max, rest });
  saveToLocalStorage();
  renderClassResources();
}

function toggleSpellSlot(level, pipIndex) {
  const slot = currentCharacter.spellSlots[level - 1];
  if (!slot) return;
  // Se clicou em um pip antes do gasto atual, reduz gasto; senão avança gasto
  if (pipIndex < slot.spent) {
    slot.spent = pipIndex;
  } else {
    slot.spent = pipIndex + 1;
  }
  saveToLocalStorage();
  renderSpellcastingTab();
}

function updateMaxSlots(level, val) {
  if (!currentCharacter.spellSlots[level - 1]) {
    currentCharacter.spellSlots[level - 1] = { level, max: 0, spent: 0 };
  }
  currentCharacter.spellSlots[level - 1].max = parseInt(val) || 0;
  saveToLocalStorage();
  renderSpellcastingTab();
}

// --------------------------------------------------------------------------
// DESCANSOS (CURTO E LONGO)
// --------------------------------------------------------------------------
function triggerShortRest() {
  if (!confirm('Iniciar Descanso Curto (1 hora)?\nRecursos de descanso curto serão restaurados.')) return;

  if (currentCharacter.customResources) {
    currentCharacter.customResources.forEach(res => {
      if (res.rest === 'curto') res.current = res.max;
    });
  }

  // Magia de Pacto de Bruxo
  if (currentCharacter.class === 'bruxo' && currentCharacter.spellSlots) {
    currentCharacter.spellSlots.forEach(sl => sl.spent = 0);
  }

  saveToLocalStorage();
  renderFullSheet();
  alert('☕ Descanso Curto concluído! Seus recursos de descanso curto foram recarregados.');
}

function triggerLongRest() {
  if (!confirm('Iniciar Descanso Longo (8 horas)?\nSeus PVs serão restaurados ao máximo, metade dos Dados de Vida gastos serão recuperados e todos os espaços de magia serão recarregados.')) return;

  // Restaura PV ao máximo
  currentCharacter.hp.current = currentCharacter.hp.max;
  currentCharacter.hp.temp = 0;

  // Recupera metade dos dados de vida gastos
  const level = parseInt(currentCharacter.level) || 1;
  const recoverDice = Math.max(1, Math.floor(level / 2));
  currentCharacter.hitDiceSpent = Math.max(0, (currentCharacter.hitDiceSpent || 0) - recoverDice);

  // Zera salvaguardas contra morte
  currentCharacter.deathSaves = { successes: 0, failures: 0 };

  // Recarrega todos os espaços de magia
  if (currentCharacter.spellSlots) {
    currentCharacter.spellSlots.forEach(sl => sl.spent = 0);
  }

  // Recarrega todos os recursos
  if (currentCharacter.customResources) {
    currentCharacter.customResources.forEach(res => res.current = res.max);
  }

  // Reduz 1 nível de exaustão
  if (currentCharacter.exhaustion > 0) {
    currentCharacter.exhaustion -= 1;
  }

  saveToLocalStorage();
  renderFullSheet();
  alert('⛺ Descanso Longo concluído! PVs cheios, magias recarregadas e herói descansado.');
}

// --------------------------------------------------------------------------
// MODAIS: ARMAS, ITENS E BUGIGANGAS
// --------------------------------------------------------------------------
function openAddWeaponModal() {
  const weaponNames = DND_DATA.weapons.map(w => w.name);
  const choice = prompt(`Escolha uma arma do livro ou digite o nome de uma nova arma:\n\nExemplos: ${weaponNames.slice(0, 8).join(', ')}...`, 'Espada Longa');
  if (!choice) return;

  const found = DND_DATA.weapons.find(w => w.name.toLowerCase() === choice.toLowerCase());
  if (found) {
    currentCharacter.weapons.push({
      name: found.name,
      damage: found.damage,
      damageType: found.damageType,
      attackModType: found.category === 'À distância' ? 'dex' : 'str',
      properties: found.properties.join(', ')
    });
  } else {
    const damage = prompt('Dado de dano (ex: 1d8, 2d6):', '1d8') || '1d8';
    const damageType = prompt('Tipo de dano (cortante, perfurante, concussão):', 'cortante') || 'cortante';
    currentCharacter.weapons.push({ name: choice, damage, damageType, attackModType: 'str', properties: '' });
  }
  saveToLocalStorage();
  renderWeaponsTable();
}

function removeWeapon(index) {
  currentCharacter.weapons.splice(index, 1);
  saveToLocalStorage();
  renderWeaponsTable();
}

function openItemAddModal() {
  const name = prompt('Nome do item:');
  if (!name) return;
  const qty = parseInt(prompt('Quantidade:', '1')) || 1;
  const weight = parseFloat(prompt('Peso por unidade em kg (ex: 0.5):', '1.0')) || 0;
  currentCharacter.inventory.push({ id: 'item_' + Date.now(), name, qty, weight });
  saveToLocalStorage();
  renderInventoryTab();
}

function updateItemQty(index, val) {
  currentCharacter.inventory[index].qty = Math.max(1, parseInt(val) || 1);
  saveToLocalStorage();
  renderInventoryTab();
}

function removeInventoryItem(index) {
  currentCharacter.inventory.splice(index, 1);
  saveToLocalStorage();
  renderInventoryTab();
}

function rollTrinket() {
  const roll = Math.floor(Math.random() * 100) + 1;
  const trinketsSample = [
    'Uma mão de goblin mumificada', 'Um pedaço de cristal que brilha ao luar', 'Uma moeda de ouro de uma terra desconhecida',
    'Um diário escrito em idioma desconhecido', 'Um anel de bronze que nunca perde o brilho', 'Uma velha peça de xadrez feita de vidro',
    'Um par de dados feitos com ossos de falange com crânios na 6ª face', 'Um orbe de vidro com fumaça em movimento perpétuo',
    'Um diminuto porta-retratos com o desenho de um goblin', 'Um canário mecânico dentro de uma lamparina gnômica',
    'Um pedaço de pano que se desdobra em elegante capa', 'Uma tabaqueira prateada com a palavra "Sonhos" gravada'
  ];
  const trinket = trinketsSample[roll % trinketsSample.length];
  currentCharacter.inventory.push({ id: 'trinket_' + Date.now(), name: `Bugiganga (d100 #${roll}): ${trinket}`, qty: 1, weight: 0.1 });
  saveToLocalStorage();
  renderInventoryTab();
  addDiceLog('Tabela de Bugigangas', `d100 [${roll}]`, trinket, false, false);
}

// --------------------------------------------------------------------------
// MODAL DE COMPÊNDIO DE MAGIAS
// --------------------------------------------------------------------------
function openSpellCompendiumModal() {
  document.getElementById('spellsModal').classList.add('open');
  filterSpellCompendium();
}

function closeSpellsModal() {
  document.getElementById('spellsModal').classList.remove('open');
}

function filterSpellCompendium() {
  const query = document.getElementById('spellSearchInput').value.toLowerCase();
  const lvlFilter = document.getElementById('spellFilterLevel').value;
  const schoolFilter = document.getElementById('spellFilterSchool').value;
  const container = document.getElementById('spellCompendiumResults');
  container.innerHTML = '';

  const filtered = DND_DATA.spells.filter(sp => {
    const matchName = sp.name.toLowerCase().includes(query) || sp.desc.toLowerCase().includes(query);
    const matchLvl = lvlFilter === 'all' || sp.level.toString() === lvlFilter;
    const matchSchool = schoolFilter === 'all' || sp.school === schoolFilter;
    return matchName && matchLvl && matchSchool;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">Nenhuma magia encontrada com esses filtros.</div>`;
    return;
  }

  filtered.forEach(sp => {
    const isAlreadyKnown = (currentCharacter.spells || []).some(s => s.id === sp.id);
    const card = document.createElement('div');
    card.style.background = 'rgba(0,0,0,0.3)';
    card.style.border = '1px solid var(--border-color)';
    card.style.borderRadius = 'var(--radius-sm)';
    card.style.padding = '12px';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'flex-start';
    card.style.gap = '12px';

    card.innerHTML = `
      <div style="flex:1;">
        <div style="display:flex; align-items:center; gap:8px;">
          <strong style="color:var(--accent-gold-light); font-size:1rem;">${sp.name}</strong>
          <span class="spell-tag">${sp.level === 0 ? 'Truque' : sp.level + 'º Círculo'}</span>
          <span style="font-size:0.75rem; color:var(--text-muted);">${sp.school}</span>
        </div>
        <div style="font-size:0.75rem; color:var(--text-secondary); margin:4px 0;">
          Tempo: <strong>${sp.time}</strong> • Alcance: <strong>${sp.range}</strong> • Duração: <strong>${sp.duration}</strong>
        </div>
        <p style="font-size:0.83rem; color:var(--text-primary); margin-top:4px;">${sp.desc}</p>
      </div>
      <div>
        ${isAlreadyKnown 
          ? '<span style="font-size:0.75rem; color:var(--accent-green); font-weight:700;">No Grimório ✓</span>'
          : `<button class="btn btn-primary" style="padding:4px 10px; font-size:0.75rem;" onclick="addSpellToGrimoire('${sp.id}')">+ Adicionar</button>`}
      </div>
    `;
    container.appendChild(card);
  });
}

function addSpellToGrimoire(spellId) {
  const sp = DND_DATA.spells.find(s => s.id === spellId);
  if (!sp) return;
  if (!currentCharacter.spells) currentCharacter.spells = [];
  if (!currentCharacter.spells.some(s => s.id === sp.id)) {
    currentCharacter.spells.push({ ...sp });
    saveToLocalStorage();
    renderSpellcastingTab();
    filterSpellCompendium();
  }
}

function removeSpell(spellId) {
  currentCharacter.spells = currentCharacter.spells.filter(s => s.id !== spellId);
  saveToLocalStorage();
  renderSpellcastingTab();
}

function openAddCustomSpellModal() {
  const name = prompt('Nome da magia:');
  if (!name) return;
  const level = parseInt(prompt('Círculo da magia (0 para Truque, 1 a 9):', '1')) || 0;
  const school = prompt('Escola de magia (Evocação, Ilusão, Abjuração, etc.):', 'Evocação') || 'Evocação';
  const desc = prompt('Descrição e efeito da magia:') || '';
  const newSpell = {
    id: 'custom_' + Date.now(),
    name,
    level,
    school,
    time: '1 ação',
    range: '18 metros',
    comp: 'V, S',
    duration: 'Instantânea',
    desc
  };
  currentCharacter.spells.push(newSpell);
  saveToLocalStorage();
  renderSpellcastingTab();
}

// --------------------------------------------------------------------------
// ASSISTENTE (WIZARD) DE CRIAÇÃO PASSO A PASSO
// --------------------------------------------------------------------------
function openWizardModal() {
  wizardState.step = 1;
  document.getElementById('wizardModal').classList.add('open');
  renderWizardStep();
}

function closeWizardModal() {
  document.getElementById('wizardModal').classList.remove('open');
}

function setWizardStep(step) {
  wizardState.step = step;
  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`wizNode${i}`);
    if (i === step) {
      node.className = 'wizard-step-node active';
    } else if (i < step) {
      node.className = 'wizard-step-node completed';
    } else {
      node.className = 'wizard-step-node';
    }
  }
  renderWizardStep();
}

function nextWizardStep() {
  if (wizardState.step < 5) {
    setWizardStep(wizardState.step + 1);
  } else {
    finishWizardCreation();
  }
}

function prevWizardStep() {
  if (wizardState.step > 1) {
    setWizardStep(wizardState.step - 1);
  }
}

function renderWizardStep() {
  const body = document.getElementById('wizardStepBody');
  const nextBtn = document.getElementById('btnWizNext');
  const prevBtn = document.getElementById('btnWizPrev');

  prevBtn.style.visibility = wizardState.step === 1 ? 'hidden' : 'visible';
  nextBtn.textContent = wizardState.step === 5 ? 'Criar Personagem!' : 'Próximo Passo';

  if (wizardState.step === 1) {
    // PASSO 1: RAÇA
    let raceCardsHtml = '';
    Object.keys(DND_DATA.races).forEach(rKey => {
      const r = DND_DATA.races[rKey];
      const isSel = wizardState.race === rKey;
      raceCardsHtml += `
        <div style="background:${isSel ? 'rgba(200,155,60,0.15)' : 'rgba(0,0,0,0.2)'}; border:2px solid ${isSel ? 'var(--border-accent)' : 'var(--border-color)'}; border-radius:var(--radius-md); padding:14px; cursor:pointer;" onclick="selectWizardRace('${rKey}')">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-family:var(--font-title); color:var(--accent-gold-light);">${r.name}</strong>
            <span style="font-size:0.75rem; color:var(--text-muted);">${r.size} • ${r.speed}m</span>
          </div>
          <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:6px;">
            ${(r.traits || []).slice(0, 2).join('<br>')}
          </div>
        </div>
      `;
    });

    body.innerHTML = `
      <h3 style="font-family:var(--font-title); color:var(--text-gold); margin-bottom:12px;">Passo 1: Escolha a Raça</h3>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:12px;">
        ${raceCardsHtml}
      </div>
    `;
  } else if (wizardState.step === 2) {
    // PASSO 2: CLASSE
    let classCardsHtml = '';
    Object.keys(DND_DATA.classes).forEach(cKey => {
      const c = DND_DATA.classes[cKey];
      const isSel = wizardState.class === cKey;
      classCardsHtml += `
        <div style="background:${isSel ? 'rgba(200,155,60,0.15)' : 'rgba(0,0,0,0.2)'}; border:2px solid ${isSel ? 'var(--border-accent)' : 'var(--border-color)'}; border-radius:var(--radius-md); padding:14px; cursor:pointer;" onclick="selectWizardClass('${cKey}')">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-family:var(--font-title); color:var(--accent-gold-light);">${c.name}</strong>
            <span style="font-size:0.75rem; color:var(--accent-red); font-weight:700;">d${c.hitDie} PV</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:6px;">
            Resistências: ${c.savingThrows.map(s => DND_DATA.abilities[s].abbr).join(', ')}<br>
            Perícias: Escolhe ${c.skillCount}
          </div>
        </div>
      `;
    });

    body.innerHTML = `
      <h3 style="font-family:var(--font-title); color:var(--text-gold); margin-bottom:12px;">Passo 2: Escolha a Classe</h3>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:12px;">
        ${classCardsHtml}
      </div>
    `;
  } else if (wizardState.step === 3) {
    // PASSO 3: ATRIBUTOS
    body.innerHTML = `
      <h3 style="font-family:var(--font-title); color:var(--text-gold); margin-bottom:12px;">Passo 3: Determinar Valores de Habilidade</h3>
      <div style="display:flex; gap:10px; margin-bottom:16px;">
        <button class="btn ${wizardState.method === 'standard' ? 'btn-primary' : ''}" onclick="setWizardAttrMethod('standard')">Valores Padrão (15, 14, 13, 12, 10, 8)</button>
        <button class="btn ${wizardState.method === 'pointbuy' ? 'btn-primary' : ''}" onclick="setWizardAttrMethod('pointbuy')">Compra de 27 Pontos</button>
        <button class="btn ${wizardState.method === 'roll' ? 'btn-primary' : ''}" onclick="setWizardAttrMethod('roll')">Rolar 4d6 (Descarta Menor)</button>
      </div>

      <div id="wizardAttrControls"></div>
    `;
    renderWizardAttrControls();
  } else if (wizardState.step === 4) {
    // PASSO 4: ANTECEDENTE
    let bgCardsHtml = '';
    Object.keys(DND_DATA.backgrounds).forEach(bKey => {
      const b = DND_DATA.backgrounds[bKey];
      const isSel = wizardState.background === bKey;
      bgCardsHtml += `
        <div style="background:${isSel ? 'rgba(200,155,60,0.15)' : 'rgba(0,0,0,0.2)'}; border:2px solid ${isSel ? 'var(--border-accent)' : 'var(--border-color)'}; border-radius:var(--radius-md); padding:14px; cursor:pointer;" onclick="selectWizardBg('${bKey}')">
          <strong style="font-family:var(--font-title); color:var(--accent-gold-light);">${b.name}</strong>
          <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:4px;">${b.feature}</p>
        </div>
      `;
    });

    body.innerHTML = `
      <h3 style="font-family:var(--font-title); color:var(--text-gold); margin-bottom:12px;">Passo 4: Escolha o Antecedente</h3>
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:12px;">
        ${bgCardsHtml}
      </div>
    `;
  } else if (wizardState.step === 5) {
    // PASSO 5: FINALIZAR
    const r = DND_DATA.races[wizardState.race];
    const c = DND_DATA.classes[wizardState.class];
    const b = DND_DATA.backgrounds[wizardState.background];

    body.innerHTML = `
      <h3 style="font-family:var(--font-title); color:var(--text-gold); margin-bottom:12px;">Passo 5: Concluir Aventureiro</h3>
      <div class="field-group" style="margin-bottom:16px;">
        <label class="field-label">Nome do Aventureiro</label>
        <input type="text" id="wizardCharNameInput" class="field-input field-input-name" value="${wizardState.name}" oninput="wizardState.name = this.value">
      </div>

      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.9rem;">
          <div>Raça Escolhida: <strong style="color:var(--text-gold);">${r.name}</strong></div>
          <div>Classe Inicial: <strong style="color:var(--text-gold);">${c.name} (Nível 1)</strong></div>
          <div>Antecedente: <strong style="color:var(--text-gold);">${b.name}</strong></div>
          <div>Pontos de Vida Iniciais: <strong>${c.hitDie + Math.floor((wizardState.scores.con - 10) / 2)} PV</strong></div>
        </div>
      </div>
    `;
  }
}

function selectWizardRace(rKey) {
  wizardState.race = rKey;
  renderWizardStep();
}

function selectWizardClass(cKey) {
  wizardState.class = cKey;
  renderWizardStep();
}

function selectWizardBg(bKey) {
  wizardState.background = bKey;
  renderWizardStep();
}

function setWizardAttrMethod(method) {
  wizardState.method = method;
  if (method === 'standard') {
    wizardState.scores = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 };
  } else if (method === 'pointbuy') {
    wizardState.scores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    wizardState.pointsRemaining = 27;
  }
  renderWizardStep();
}

function renderWizardAttrControls() {
  const container = document.getElementById('wizardAttrControls');
  if (!container) return;

  if (wizardState.method === 'pointbuy') {
    let inputsHtml = '';
    Object.keys(DND_DATA.abilities).forEach(key => {
      const val = wizardState.scores[key] || 8;
      inputsHtml += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(0,0,0,0.25); border-radius:var(--radius-sm);">
          <strong>${DND_DATA.abilities[key].name}</strong>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn" style="padding:2px 8px;" onclick="adjustPointBuyScore('${key}', -1)">-</button>
            <span style="font-family:var(--font-title); font-size:1.1rem; font-weight:700; min-width:30px; text-align:center;">${val}</span>
            <button class="btn" style="padding:2px 8px;" onclick="adjustPointBuyScore('${key}', 1)">+</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="point-buy-counter">
        <span>Pontos Disponíveis para Gastar:</span>
        <strong style="font-family:var(--font-title); font-size:1.3rem; color:var(--accent-gold-light);">${wizardState.pointsRemaining} / 27</strong>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        ${inputsHtml}
      </div>
    `;
  } else if (wizardState.method === 'roll') {
    container.innerHTML = `
      <div style="text-align:center; padding:20px;">
        <button class="btn btn-primary" onclick="rollAllWizardAttributes()">🎲 Rolar 4d6 (Descarta o Menor) para os 6 Atributos</button>
        <div id="rolledScoresResult" style="margin-top:16px; display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          ${Object.keys(wizardState.scores).map(k => `
            <div class="vital-box" style="width:70px;">
              <span class="vital-title">${DND_DATA.abilities[k].abbr}</span>
              <span class="vital-value">${wizardState.scores[k]}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    // Standard Array
    container.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px;">
        ${Object.keys(DND_DATA.abilities).map(k => `
          <div class="field-group">
            <label class="field-label">${DND_DATA.abilities[k].name}</label>
            <input type="number" class="field-input" value="${wizardState.scores[k]}" min="1" max="20" onchange="wizardState.scores['${k}'] = parseInt(this.value) || 10">
          </div>
        `).join('')}
      </div>
    `;
  }
}

function adjustPointBuyScore(key, delta) {
  const current = wizardState.scores[key] || 8;
  const next = current + delta;
  if (next < 8 || next > 15) return;

  const currentCost = POINT_BUY_COSTS[current];
  const nextCost = POINT_BUY_COSTS[next];
  const costDiff = nextCost - currentCost;

  if (wizardState.pointsRemaining - costDiff < 0) {
    alert('Pontos insuficientes!');
    return;
  }

  wizardState.scores[key] = next;
  wizardState.pointsRemaining -= costDiff;
  renderWizardAttrControls();
}

function rollAllWizardAttributes() {
  Object.keys(DND_DATA.abilities).forEach(k => {
    const dice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    dice.sort((a, b) => b - a); // Ordena decrescente
    wizardState.scores[k] = dice[0] + dice[1] + dice[2]; // Descarta o 4º
  });
  renderWizardAttrControls();
}

function finishWizardCreation() {
  const classData = DND_DATA.classes[wizardState.class];
  const bgData = DND_DATA.backgrounds[wizardState.background];
  const conMod = Math.floor((wizardState.scores.con - 10) / 2);
  const hpMax = classData.hitDie + conMod;

  const newChar = {
    id: 'char_' + Date.now(),
    name: wizardState.name || 'Novo Aventureiro',
    player: currentCharacter.player || 'Jogador',
    class: wizardState.class,
    level: 1,
    subclass: '',
    race: wizardState.race,
    subrace: '',
    background: wizardState.background,
    alignment: 'Leal e Bom',
    xp: 0,
    inspiration: false,
    baseScores: { ...wizardState.scores },
    customScoreBonus: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
    savingThrowProficiencies: [...classData.savingThrows],
    skillProficiencies: {},
    hp: { current: hpMax, max: hpMax, temp: 0 },
    hitDiceSpent: 0,
    deathSaves: { successes: 0, failures: 0 },
    equippedArmor: 'couro',
    equippedShield: false,
    weapons: [
      { name: 'Adaga', attackModType: 'dex', damage: '1d4', damageType: 'perfurante', properties: 'Acuidade, Leve' }
    ],
    spells: [],
    spellSlots: [
      { level: 1, max: 2, spent: 0 },
      { level: 2, max: 0, spent: 0 },
      { level: 3, max: 0, spent: 0 },
      { level: 4, max: 0, spent: 0 },
      { level: 5, max: 0, spent: 0 },
      { level: 6, max: 0, spent: 0 },
      { level: 7, max: 0, spent: 0 },
      { level: 8, max: 0, spent: 0 },
      { level: 9, max: 0, spent: 0 }
    ],
    currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
    inventory: (bgData.equipment || []).map((e, idx) => ({ id: 'bg_' + idx, name: e, qty: 1, weight: 1.0 })),
    activeConditions: [],
    exhaustion: 0,
    customResources: [],
    bio: {
      traits: '',
      ideals: '',
      bonds: '',
      flaws: '',
      backstory: '',
      appearance: ''
    }
  };

  // Perícias do antecedente
  if (bgData && bgData.skills) {
    bgData.skills.forEach(s => newChar.skillProficiencies[s] = 1);
  }

  savedCharacters[newChar.id] = newChar;
  currentCharacter = newChar;
  setupDefaultClassResources();
  saveToLocalStorage();
  closeWizardModal();
  renderFullSheet();
  alert(`🎉 Parabéns! O aventureiro ${newChar.name} foi criado com sucesso!`);
}

function createNewCharacterAction() {
  const name = prompt('Nome do novo personagem:', 'Novo Herói');
  if (!name) return;
  const newChar = createDefaultCharacter();
  newChar.id = 'char_' + Date.now();
  newChar.name = name;
  savedCharacters[newChar.id] = newChar;
  currentCharacter = newChar;
  saveToLocalStorage();
  renderFullSheet();
}

// --------------------------------------------------------------------------
// EXPORTAÇÃO E IMPORTAÇÃO JSON
// --------------------------------------------------------------------------
function exportCharacterJson() {
  const jsonStr = JSON.stringify(currentCharacter, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentCharacter.name.replace(/\s+/g, '_')}_dnd5e.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importCharacterJson(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (!imported.id) imported.id = 'char_' + Date.now();
      savedCharacters[imported.id] = imported;
      currentCharacter = imported;
      saveToLocalStorage();
      renderFullSheet();
      alert(`Ficha "${imported.name}" importada com sucesso!`);
    } catch (err) {
      alert('Erro ao importar JSON. Verifique se o arquivo é válido.');
    }
  };
  reader.readAsText(file);
}

// --------------------------------------------------------------------------
// ALTERNÂNCIA DE TEMA (DARK FANTASY / MODO PERGAMINHO)
// --------------------------------------------------------------------------
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'parchment' : 'dark';
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  if (theme === 'parchment') {
    document.documentElement.setAttribute('data-theme', 'parchment');
    document.getElementById('themeIcon').textContent = '🌙';
    document.getElementById('themeLabel').textContent = 'Dark Fantasy';
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('themeIcon').textContent = '📜';
    document.getElementById('themeLabel').textContent = 'Pergaminho';
  }
  localStorage.setItem('dnd5e_theme', theme);
}
