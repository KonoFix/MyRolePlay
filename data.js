// ==========================================================================
// BANCO DE DADOS OFICIAL D&D 5ª EDIÇÃO (LIVRO DO JOGADOR - PT-BR)
// Extraído e estruturado a partir do Livro do Jogador da Biblioteca Élfica
// ==========================================================================

const DND_DATA = {
  // ------------------------------------------------------------------------
  // HABILIDADES & PERÍCIAS
  // ------------------------------------------------------------------------
  abilities: {
    str: { name: 'Força', abbr: 'FOR', desc: 'Mede poder físico e treinamento atlético' },
    dex: { name: 'Destreza', abbr: 'DES', desc: 'Mede agilidade, reflexos e equilíbrio' },
    con: { name: 'Constituição', abbr: 'CON', desc: 'Mede saúde, resistência e vigor vital' },
    int: { name: 'Inteligência', abbr: 'INT', desc: 'Mede acuidade mental, memória e raciocínio' },
    wis: { name: 'Sabedoria', abbr: 'SAB', desc: 'Mede percepção, intuição e sintonia com o ambiente' },
    cha: { name: 'Carisma', abbr: 'CAR', desc: 'Mede força de personalidade, eloquência e liderança' }
  },

  skills: [
    { id: 'acrobatics', name: 'Acrobacia', ability: 'dex' },
    { id: 'animal_handling', name: 'Adestrar Animais', ability: 'wis' },
    { id: 'arcana', name: 'Arcanismo', ability: 'int' },
    { id: 'athletics', name: 'Atletismo', ability: 'str' },
    { id: 'deception', name: 'Enganação', ability: 'cha' },
    { id: 'history', name: 'História', ability: 'int' },
    { id: 'insight', name: 'Intuição', ability: 'wis' },
    { id: 'intimidation', name: 'Intimidação', ability: 'cha' },
    { id: 'investigation', name: 'Investigação', ability: 'int' },
    { id: 'medicine', name: 'Medicina', ability: 'wis' },
    { id: 'nature', name: 'Natureza', ability: 'int' },
    { id: 'perception', name: 'Percepção', ability: 'wis' },
    { id: 'performance', name: 'Atuação', ability: 'cha' },
    { id: 'persuasion', name: 'Persuasão', ability: 'cha' },
    { id: 'religion', name: 'Religião', ability: 'int' },
    { id: 'sleight_of_hand', name: 'Prestidigitação', ability: 'dex' },
    { id: 'stealth', name: 'Furtividade', ability: 'dex' },
    { id: 'survival', name: 'Sobrevivência', ability: 'wis' }
  ],

  // ------------------------------------------------------------------------
  // RAÇAS & SUB-RAÇAS
  // ------------------------------------------------------------------------
  races: {
    anao: {
      name: 'Anão',
      abilityBonus: { con: 2 },
      speed: 7.5,
      size: 'Médio',
      languages: ['Comum', 'Anão'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Resiliência Anã: Vantagem em salvaguardas contra veneno e resistência a dano de veneno',
        'Treinamento Anão em Combate: Proficiência com machado de batalha, machadinha, martelo leve e martelo de guerra',
        'Proficiência com Ferramentas: Escolha entre ferramentas de ferreiro, cervejeiro ou pedreiro',
        'Especialização em Rochas: Dobro de proficiência em testes de Inteligência (História) relacionados a trabalhos em pedra'
      ],
      subraces: {
        colina: {
          name: 'Anão da Colina',
          abilityBonus: { wis: 1 },
          traits: ['Tenacidade Anã: Seu máximo de PV aumenta em 1, e +1 PV a cada nível adicional.']
        },
        montanha: {
          name: 'Anão da Montanha',
          abilityBonus: { str: 2 },
          traits: ['Treinamento Anão com Armaduras: Proficiência em armaduras leves e médias.']
        },
        cinzento: {
          name: 'Anão Cinzento (Duergar)',
          abilityBonus: { str: 1 },
          traits: [
            'Visão no Escuro Superior: 36 metros (substitui a visão no escuro padrão)',
            'Resiliência Duergar: Vantagem em salvaguardas contra veneno (e resistência a dano de veneno), ilusões, ficar enfeitiçado ou paralisado',
            'Magia Duergar: 3º nível: Aumentar/Diminuir (só aumentar) em si mesmo; 5º nível: Invisibilidade em si mesmo — 1x cada por descanso longo, efeito cessa sob luz solar direta (Inteligência)',
            'Sensibilidade à Luz Solar: Desvantagem em ataques e testes de Percepção que dependam de visão sob sol direto',
            'Idioma Adicional: Submundo (Undercommon)'
          ]
        }
      }
    },
    elfo: {
      name: 'Elfo',
      abilityBonus: { dex: 2 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Élfico'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Sentidos Aguçados: Proficiência na perícia Percepção',
        'Ancestral Feérico: Vantagem em salvaguardas contra ser enfeitiçado e imunidade a sono mágico',
        'Transe: Meditação consciente por 4 horas diárias substitui 8 horas de sono humano'
      ],
      subraces: {
        alto_elfo: {
          name: 'Alto Elfo',
          abilityBonus: { int: 1 },
          traits: [
            'Treinamento Élfico com Armas: Espadas longas, espadas curtas, arcos longos e curtos',
            'Truque Adicional: Conhece 1 truque da lista de mago (Inteligência)',
            'Idioma Adicional: 1 idioma à sua escolha'
          ]
        },
        elfo_floresta: {
          name: 'Elfo da Floresta',
          abilityBonus: { wis: 1 },
          speed: 10.5,
          traits: [
            'Treinamento Élfico com Armas: Espadas longas, espadas curtas, arcos longos e curtos',
            'Pés Ligeiros: Deslocamento base aumenta para 10,5 metros',
            'Máscara da Natureza: Pode tentar se esconder mesmo sob folhagem leve, chuva ou névoa'
          ]
        },
        drow: {
          name: 'Elfo Negro (Drow)',
          abilityBonus: { cha: 1 },
          traits: [
            'Visão no Escuro Superior: 36 metros',
            'Sensibilidade à Luz Solar: Desvantagem em ataques e testes de Percepção sob sol direto',
            'Magia Drow: Truque Globos de Luz; 3º nível: Fogo das Fadas; 5º nível: Escuridão (Carisma)',
            'Treinamento Drow com Armas: Rapieiras, espadas curtas e bestas de mão'
          ]
        },
        eladrin: {
          name: 'Eladrin',
          abilityBonus: { cha: 1 },
          traits: [
            'Passo Feérico: Ação bônus, teletransporte mágico até 9 metros para um espaço desocupado que possa ver (recarrega em descanso curto ou longo)',
            'Estação Feérica: A partir do 3º nível, escolha uma estação (Outono, Inverno, Primavera ou Verão) ao final de um descanso longo — ela adiciona um efeito extra ao usar Passo Feérico (Outono: encanta inimigos próximos; Inverno: amedronta um inimigo próximo; Primavera: teleporta um aliado em seu lugar; Verão: causa dano de fogo igual ao seu Carisma aos inimigos próximos)'
          ]
        }
      }
    },
    halfling: {
      name: 'Halfling',
      abilityBonus: { dex: 2 },
      speed: 7.5,
      size: 'Pequeno',
      languages: ['Comum', 'Halfling'],
      traits: [
        'Sortudo: Ao rolar 1 natural em ataque, teste de habilidade ou salvaguarda, pode rolar novamente',
        'Bravura: Vantagem em salvaguardas contra ficar amedrontado',
        'Agilidade Halfling: Pode mover-se pelo espaço de criaturas de tamanho maior que o seu'
      ],
      subraces: {
        pes_leves: {
          name: 'Pés-Leves',
          abilityBonus: { cha: 1 },
          traits: ['Furtividade Natural: Pode tentar se esconder atrás de criaturas pelo menos um tamanho maiores']
        },
        robusto: {
          name: 'Robusto',
          abilityBonus: { con: 1 },
          traits: ['Resiliência dos Robustos: Vantagem contra veneno e resistência a dano de veneno']
        }
      }
    },
    humano: {
      name: 'Humano',
      abilityBonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', '1 Idioma à escolha'],
      traits: [
        'Adaptabilidade Humana: +1 em todos os valores de habilidade',
        'Versatilidade Cultural: Idioma extra à sua escolha'
      ],
      subraces: {
        padrao: {
          name: 'Humano Padrão',
          abilityBonus: {},
          traits: ['+1 em todas as 6 habilidades fundamentais']
        },
        variante: {
          name: 'Humano Variante (Opcional)',
          abilityBonus: { choice: 2 },
          traits: [
            '+1 em dois atributos diferentes à sua escolha',
            'Proficiência em 1 perícia adicional à sua escolha',
            '1 Talento inicial à sua escolha'
          ]
        }
      }
    },
    draconato: {
      name: 'Draconato',
      abilityBonus: { str: 2, cha: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Dracônico'],
      traits: [
        'Ancestral Dracônico: Escolha um tipo de dragão para determinar tipo de sopro e resistência',
        'Arma de Sopro: Ação para exalar dano em área (2d6, aumenta com níveis; CD 8 + Con + Prof)',
        'Resistência a Dano: Resistência ao dano elemental associado ao seu ancestral dracônico'
      ],
      subraces: {
        vermelho: { name: 'Ancestral Vermelho (Fogo, Cone 4,5m, Des)', damageType: 'Fogo' },
        ouro: { name: 'Ancestral Ouro (Fogo, Cone 4,5m, Des)', damageType: 'Fogo' },
        latão: { name: 'Ancestral Latão (Fogo, Linha 9m, Des)', damageType: 'Fogo' },
        azul: { name: 'Ancestral Azul (Elétrico, Linha 9m, Des)', damageType: 'Elétrico' },
        bronze: { name: 'Ancestral Bronze (Elétrico, Linha 9m, Des)', damageType: 'Elétrico' },
        branco: { name: 'Ancestral Branco (Frio, Cone 4,5m, Con)', damageType: 'Frio' },
        prata: { name: 'Ancestral Prata (Frio, Cone 4,5m, Con)', damageType: 'Frio' },
        negro: { name: 'Ancestral Negro (Ácido, Linha 9m, Des)', damageType: 'Ácido' },
        cobre: { name: 'Ancestral Cobre (Ácido, Linha 9m, Des)', damageType: 'Ácido' },
        verde: { name: 'Ancestral Verde (Veneno, Cone 4,5m, Con)', damageType: 'Veneno' }
      }
    },
    gnomo: {
      name: 'Gnomo',
      abilityBonus: { int: 2 },
      speed: 7.5,
      size: 'Pequeno',
      languages: ['Comum', 'Gnômico'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Esperteza Gnômica: Vantagem em todas as salvaguardas de Inteligência, Sabedoria e Carisma contra magia'
      ],
      subraces: {
        floresta: {
          name: 'Gnomo da Floresta',
          abilityBonus: { dex: 1 },
          traits: [
            'Ilusionista Nato: Conhece o truque Ilusão Menor (Inteligência)',
            'Falar com Bestas Pequenas: Comunica ideias simples com animais pequenos através de sons e gestos'
          ]
        },
        rochas: {
          name: 'Gnomo das Rochas',
          abilityBonus: { con: 1 },
          traits: [
            'Conhecimento de Artífice: Dobro de proficiência em História com itens mágicos e mecanismos',
            'Engenhoqueiro: Cria mecanismos úteis (Brinquedo Mecânico, Isqueiro, Caixa de Música)'
          ]
        }
      }
    },
    meio_elfo: {
      name: 'Meio-Elfo',
      abilityBonus: { cha: 2, choice: 2 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Élfico', '1 Idioma à escolha'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Ancestral Feérico: Vantagem contra encantamentos e imune a sono mágico',
        'Versatilidade em Perícia: Proficiência em duas perícias quaisquer à sua escolha',
        '+2 em Carisma e +1 em outros dois valores de habilidade à sua escolha'
      ],
      subraces: {}
    },
    meio_orc: {
      name: 'Meio-Orc',
      abilityBonus: { str: 2, con: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Orc'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Ameaçador: Proficiência na perícia Intimidação',
        'Resistência Implacável: Ao ser reduzido a 0 PV sem morrer, pode voltar para 1 PV (1x por descanso longo)',
        'Ataques Selvagens: Ao obter um acerto crítico corpo-a-corpo, rola um dado de dano extra da arma'
      ],
      subraces: {}
    },
    tiefling: {
      name: 'Tiefling',
      abilityBonus: { int: 1, cha: 2 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Infernal'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Resistência Infernal: Resistência a dano de fogo',
        'Legado Infernal: Conhece Taumaturgia; 3º nível: Repreensão Infernal (2º nível); 5º nível: Escuridão (Carisma)'
      ],
      subraces: {}
    },

    // ---- Raças de expansões (Volo's Guide, Mordenkainen, Eberron, Theros, Ravnica, Witchlight etc.) ----
    aarakocra: {
      name: 'Aarakocra',
      abilityBonus: { dex: 2, wis: 1 },
      speed: 7.5,
      size: 'Médio',
      languages: ['Comum', 'Aarakocra', 'Auran'],
      traits: [
        'Voo: Deslocamento de voo de 15 metros (não pode usar vestindo armadura média ou pesada)',
        'Talões: Arma natural para ataques desarmados, causando 1d4 + modificador de Força de dano cortante'
      ],
      subraces: {}
    },
    aasimar: {
      name: 'Aasimar',
      abilityBonus: { cha: 2 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Celestial'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Resistência Celestial: Resistência a dano necrótico e radiante',
        'Mãos Curativas: Ação para tocar uma criatura e curar PV igual ao seu nível (1x por descanso longo)',
        'Portador de Luz: Conhece o truque Luz (Carisma)'
      ],
      subraces: {
        protetor: {
          name: 'Aasimar Protetor',
          abilityBonus: { wis: 1 },
          traits: ['Alma Radiante: A partir do 3º nível, ação para ganhar asas e voo de 9 metros por 1 minuto; dano radiante extra igual ao seu nível 1x por turno (1x por descanso longo)']
        },
        flagelo: {
          name: 'Aasimar Flagelo',
          abilityBonus: { con: 1 },
          traits: ['Consumação Radiante: A partir do 3º nível, ação para irradiar luz por 1 minuto; ao fim de cada turno você e criaturas a 3m sofrem dano radiante igual à metade do seu nível, e causa dano radiante extra igual ao seu nível 1x por turno (1x por descanso longo)']
        },
        caido: {
          name: 'Aasimar Caído',
          abilityBonus: { str: 1 },
          traits: ['Manto Necrótico: A partir do 3º nível, ação para amedrontar criaturas próximas (salvaguarda de Carisma) e, por 1 minuto, causar dano necrótico extra igual ao seu nível 1x por turno (1x por descanso longo)']
        }
      }
    },
    bugbear: {
      name: 'Bugbear',
      abilityBonus: { str: 2, dex: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Goblin'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Braços Longos: Alcance corpo-a-corpo +1,5 metro',
        'Compleição Poderosa: Conta como uma categoria de tamanho maior para capacidade de carga',
        'Furtivo: Proficiência na perícia Furtividade',
        'Ataque Surpresa: +2d6 de dano ao acertar uma criatura surpresa (1x por combate)'
      ],
      subraces: {}
    },
    centauro: {
      name: 'Centauro',
      abilityBonus: { str: 2, wis: 1 },
      speed: 12,
      size: 'Médio',
      languages: ['Comum', 'Silvano'],
      traits: [
        'Tipo Feérico (ao invés de humanoide)',
        'Investida: Ao mover 9m reto em direção a um alvo e acertá-lo corpo-a-corpo, pode atacar com os cascos como ação bônus',
        'Cascos: Arma natural, 1d4 + modificador de Força de dano contundente',
        'Compleição Equina: Conta como tamanho maior para carga; escalar com mãos e pés custa 4x o deslocamento normal',
        'Sobrevivente: Proficiência em 1 perícia à escolha entre Adestrar Animais, Medicina, Natureza ou Sobrevivência'
      ],
      subraces: {}
    },
    changeling: {
      name: 'Changeling',
      abilityBonus: { cha: 2, choice: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', '2 idiomas à escolha'],
      traits: [
        'Metamorfo: Ação para mudar aparência e voz (sem alterar estatísticas); mantém a forma até reverter com outra ação',
        'Instintos de Changeling: Proficiência em 2 perícias à escolha entre Enganação, Intuição, Intimidação e Persuasão'
      ],
      subraces: {}
    },
    firbolg: {
      name: 'Firbolg',
      abilityBonus: { wis: 2, str: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Élfico', 'Gigante'],
      traits: [
        'Magia Firbolg: Conhece Detectar Magia e Disfarçar-se, 1x cada por descanso curto ou longo (Sabedoria)',
        'Passo Oculto: Ação bônus para ficar invisível até o início do próximo turno ou até atacar (1x por descanso curto ou longo)',
        'Compleição Poderosa: Conta como tamanho maior para capacidade de carga',
        'Fala com Bestas e Plantas: Comunica ideias simples com elas; vantagem em testes de Carisma para influenciá-las'
      ],
      subraces: {}
    },
    genasi: {
      name: 'Genasi',
      abilityBonus: { con: 2 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Primordial'],
      traits: [
        'Descendência Elemental: Filhos de gênios, carregam um traço de um dos quatro planos elementais (Ar, Terra, Fogo ou Água)',
        'Escolha uma variante elemental abaixo para definir seus traços raciais específicos'
      ],
      subraces: {
        ar: {
          name: 'Genasi do Ar',
          abilityBonus: { dex: 1 },
          traits: [
            'Fôlego Infinito: Pode prender a respiração indefinidamente enquanto não estiver incapacitado',
            'Mesclar-se ao Vento: Conhece Levitar, 1x por descanso longo (Constituição)'
          ]
        },
        terra: {
          name: 'Genasi da Terra',
          abilityBonus: { str: 1 },
          traits: [
            'Passo Terrestre: Ignora terreno difícil feito de terra ou pedra',
            'Fundir-se com a Pedra: Conhece Passo sem Rastro, 1x por descanso longo (Constituição)'
          ]
        },
        fogo: {
          name: 'Genasi do Fogo',
          abilityBonus: { int: 1 },
          traits: [
            'Visão no Escuro (18 metros, em tons de vermelho)',
            'Resistência a Fogo',
            'Alcançar a Chama: Conhece o truque Criar Chama; 3º nível: Mãos Flamejantes 1x por descanso longo (Constituição)'
          ]
        },
        agua: {
          name: 'Genasi da Água',
          abilityBonus: { wis: 1 },
          speed: 9,
          traits: [
            'Anfíbio: Respira ar e água',
            'Natação: Deslocamento de natação de 9 metros',
            'Resistência a Ácido',
            'Chamado da Onda: Conhece o truque Manipular Água; 3º nível: Criar ou Destruir Água 1x por descanso longo (Constituição)'
          ]
        }
      }
    },
    gith: {
      name: 'Gith',
      abilityBonus: {},
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Gith'],
      traits: ['Resistência Psíquica: Resistência a dano psíquico'],
      subraces: {
        githyanki: {
          name: 'Githyanki',
          abilityBonus: { str: 2, int: 1 },
          traits: [
            'Conhecimento Astral: Ao final de um descanso longo, ganha proficiência em 1 perícia e 1 arma ou ferramenta à escolha até o fim do próximo descanso longo',
            'Psiônicos Githyanki: Conhece o truque Mão Mágica (invisível); 3º nível: Saltar; 5º nível: Passo Enevoado — 1x cada por descanso longo (Inteligência, Sabedoria ou Carisma)'
          ]
        },
        githzerai: {
          name: 'Githzerai',
          abilityBonus: { wis: 2, int: 1 },
          traits: [
            'Disciplina Mental: Vantagem em salvaguardas contra ficar enfeitiçado ou amedrontado',
            'Psiônicos Githzerai: Conhece o truque Mão Mágica (invisível); 3º nível: Escudo Arcano; 5º nível: Detectar Pensamentos — 1x cada por descanso longo (Inteligência, Sabedoria ou Carisma)'
          ]
        }
      }
    },
    goblin: {
      name: 'Goblin',
      abilityBonus: { dex: 2, con: 1 },
      speed: 9,
      size: 'Pequeno',
      languages: ['Comum', 'Goblin'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Fúria do Pequeno: Dano extra igual ao seu nível ao acertar uma criatura maior que você (1x por descanso curto ou longo)',
        'Fuga Ágil: Pode usar Desengajar ou Esconder-se como ação bônus'
      ],
      subraces: {}
    },
    goliath: {
      name: 'Goliath',
      abilityBonus: { str: 2, con: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Gigante'],
      traits: [
        'Atleta Natural: Proficiência na perícia Atletismo',
        'Resistência de Pedra: Reação para rolar 1d12 + Constituição e reduzir o dano sofrido (1x por descanso curto ou longo)',
        'Compleição Poderosa: Conta como tamanho maior para capacidade de carga',
        'Nascido na Montanha: Resistência a dano de frio; aclimatado a grandes altitudes'
      ],
      subraces: {}
    },
    hobgoblin: {
      name: 'Hobgoblin',
      abilityBonus: { con: 2, int: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Goblin'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Treinamento Marcial: Proficiência com 2 armas marciais à escolha e com armaduras leves',
        'Salvar as Aparências: Ao falhar um ataque, teste ou salvaguarda, ganha bônus igual ao nº de aliados visíveis a 9m (máx. +5), 1x por descanso curto ou longo'
      ],
      subraces: {}
    },
    kalashtar: {
      name: 'Kalashtar',
      abilityBonus: { wis: 2, cha: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Quori', '1 idioma à escolha'],
      traits: [
        'Mente Dupla: Vantagem em salvaguardas de Sabedoria',
        'Disciplina Mental: Resistência a dano psíquico',
        'Elo Mental: Telepatia com criaturas visíveis em alcance (3m × seu nível)',
        'Livre de Sonhos: Imune a efeitos mágicos que exigem sonhar'
      ],
      subraces: {}
    },
    kenku: {
      name: 'Kenku',
      abilityBonus: { dex: 2, wis: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Lê e escreve Comum e Auran (só fala por Mímica)'],
      traits: [
        'Falsificação Perita: Vantagem em testes para forjar ou duplicar objetos',
        'Treinamento Kenku: Proficiência em 2 perícias à escolha entre Acrobacia, Enganação, Furtividade e Prestidigitação',
        'Mímica: Pode imitar sons e vozes já ouvidos'
      ],
      subraces: {}
    },
    kobold: {
      name: 'Kobold',
      abilityBonus: { dex: 2, str: -2 },
      speed: 9,
      size: 'Pequeno',
      languages: ['Comum', 'Dracônico'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Implorar e Se Encolher: Ação para dar vantagem a aliados contra inimigos próximos até o fim do próximo turno (1x por descanso curto ou longo)',
        'Táticas de Matilha: Vantagem em ataque se um aliado estiver a 1,5m do alvo',
        'Sensibilidade à Luz Solar: Desvantagem em ataques e testes de Percepção visual sob sol direto'
      ],
      subraces: {}
    },
    homem_lagarto: {
      name: 'Homem-Lagarto',
      abilityBonus: { con: 2, wis: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Dracônico'],
      traits: [
        'Natação: Deslocamento de natação de 9 metros',
        'Mordida: Arma natural, 1d6 + modificador de Força de dano perfurante',
        'Armadura Natural: CA 13 + Destreza sem armadura (compatível com escudo)',
        'Prender a Respiração: Até 15 minutos',
        'Instinto de Caçador: Proficiência em 2 perícias à escolha entre Adestrar Animais, Natureza, Percepção, Furtividade e Sobrevivência',
        'Mandíbulas Famintas: Ação bônus com a mordida; ao acertar, ganha PV temporários igual ao mod. de Constituição (1x por descanso curto ou longo)'
      ],
      subraces: {}
    },
    minotauro: {
      name: 'Minotauro',
      abilityBonus: { str: 2, con: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Minotauro'],
      traits: [
        'Chifres: Arma natural, 1d6 + modificador de Força de dano perfurante',
        'Investida Perfurante: Após Disparada e mover ao menos 6m, pode atacar com os chifres como ação bônus',
        'Chifres Martelantes: Após acertar um ataque corpo-a-corpo, ação bônus para empurrar o alvo até 3m (CD 8 + proficiência + Força)',
        'Presença Imponente: Proficiência em Intimidação ou Persuasão'
      ],
      subraces: {}
    },
    orc: {
      name: 'Orc',
      abilityBonus: { str: 2, con: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Orc'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Agressivo: Ação bônus para mover até seu deslocamento em direção a um inimigo visível ou audível',
        'Intuição Primitiva: Proficiência em 2 perícias à escolha entre Adestrar Animais, Intuição, Intimidação, Medicina, Natureza, Percepção e Sobrevivência',
        'Compleição Poderosa: Conta como tamanho maior para capacidade de carga'
      ],
      subraces: {}
    },
    satiro: {
      name: 'Sátiro',
      abilityBonus: { cha: 2, dex: 1 },
      speed: 10.5,
      size: 'Médio',
      languages: ['Comum', 'Silvano'],
      traits: [
        'Tipo Feérico (ao invés de humanoide)',
        'Aríete: Arma natural (chifres), 1d4 + modificador de Força de dano contundente',
        'Resistência Mágica: Vantagem em salvaguardas contra magia',
        'Saltos Alegres: Soma 1d8 à distância de saltos',
        'Folgazão: Proficiência em Atuação e Persuasão, e com 1 instrumento musical à escolha'
      ],
      subraces: {}
    },
    shifter: {
      name: 'Shifter',
      abilityBonus: {},
      speed: 9,
      size: 'Médio',
      languages: ['Comum'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Metamorfose: Ação bônus por 1 minuto, ganha PV temporários = nível + Constituição (mín. 1); benefício extra varia por subraça (1x por descanso curto ou longo)'
      ],
      subraces: {
        pele_de_fera: {
          name: 'Shifter Pele de Fera',
          abilityBonus: { str: 1, con: 2 },
          traits: ['Atleta Natural: Proficiência em Atletismo', 'Metamorfose: +1d6 PV temporários extras; +1 CA enquanto metamorfoseado']
        },
        presas_longas: {
          name: 'Shifter Presas Longas',
          abilityBonus: { str: 2, dex: 1 },
          traits: ['Feroz: Proficiência em Intimidação', 'Metamorfose: Ataque desarmado bônus com presas, 1d6 + Força de dano perfurante']
        },
        passo_veloz: {
          name: 'Shifter Passo Veloz',
          abilityBonus: { dex: 2, cha: 1 },
          traits: ['Grácil: Proficiência em Acrobacia', 'Metamorfose: +3m de deslocamento; reação para mover 3m quando criatura termina o turno a 1,5m']
        },
        caca_selvagem: {
          name: 'Shifter Caça Selvagem',
          abilityBonus: { dex: 1, wis: 2 },
          traits: ['Rastreador Natural: Proficiência em Sobrevivência', 'Metamorfose: Vantagem em testes de Sabedoria; ninguém a 9m tem vantagem em ataques contra você, a menos que incapacitado']
        }
      }
    },
    tabaxi: {
      name: 'Tabaxi',
      abilityBonus: { dex: 2, cha: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', '1 idioma à escolha'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Agilidade Felina: Dobra o deslocamento até o fim do turno (recarrega ao mover 0 em um turno)',
        'Garras de Gato: Escalada de 6 metros; arma natural, 1d4 + Força de dano cortante',
        'Talentos de Gato: Proficiência em Percepção e Furtividade'
      ],
      subraces: {}
    },
    tortle: {
      name: 'Tortle',
      abilityBonus: { str: 2, wis: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Aquan', 'Comum'],
      traits: [
        'Garras: Arma natural, 1d4 + Força de dano cortante',
        'Prender a Respiração: Até 1 hora',
        'Armadura Natural: CA 17 (Destreza não se aplica); pode usar escudo normalmente',
        'Defesa de Casco: Ação para +4 CA e vantagem em salvaguardas de Força e Constituição; enquanto isso fica caído, deslocamento 0, desvantagem em DES, sem reações (só sai com ação bônus)',
        'Instinto de Sobrevivência: Proficiência em Sobrevivência'
      ],
      subraces: {}
    },
    tritao: {
      name: 'Tritão',
      abilityBonus: { str: 1, con: 1, cha: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Primordial'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Anfíbio: Respira ar e água',
        'Natação: Deslocamento de natação de 9 metros',
        'Resistência a Frio',
        'Controlar Ar e Água: Conhece Névoa; 3º nível: Rajada de Vento; 5º nível: Muralha de Água — 1x cada por descanso longo (Carisma)',
        'Emissário do Mar: Comunica ideias simples com bestas aquáticas'
      ],
      subraces: {}
    },
    yuan_ti: {
      name: 'Yuan-ti Puro-Sangue',
      abilityBonus: { cha: 2, int: 1 },
      speed: 9,
      size: 'Médio',
      languages: ['Comum', 'Abissal', 'Dracônico'],
      traits: [
        'Visão no Escuro (18 metros)',
        'Imunidade a Veneno: Imune a dano de veneno e à condição envenenado',
        'Resistência Mágica: Vantagem em salvaguardas contra magia',
        'Magia Inata: Conhece o truque Borrifo Venenoso; conjura Amizade com Animais ilimitadamente (só em cobras); 3º nível: Sugestão 1x por descanso longo (Carisma)'
      ],
      subraces: {}
    },
    harengon: {
      name: 'Harengon',
      abilityBonus: { choice: 2 },
      speed: 9,
      size: 'Pequeno ou Médio (à escolha)',
      languages: ['Comum', '1 idioma à escolha'],
      traits: [
        'Gatilho de Lebre: Soma o bônus de proficiência na iniciativa',
        'Sentidos Leporinos: Proficiência em Percepção',
        'Trabalho de Pés Sortudo: Reação ao falhar salvaguarda de Destreza, rola 1d4 e soma ao resultado',
        'Salto de Coelho: Ação bônus para saltar 1,5m × 5 × bônus de proficiência sem provocar ataques de oportunidade (usos = bônus de proficiência, recarrega em descanso longo)'
      ],
      subraces: {}
    },
    owlin: {
      name: 'Owlin',
      abilityBonus: { choice: 2 },
      speed: 9,
      size: 'Pequeno ou Médio (à escolha)',
      languages: ['Comum', '1 idioma à escolha'],
      traits: [
        'Visão no Escuro (36 metros)',
        'Voo: Deslocamento de voo igual ao de pernas (não pode usar vestindo armadura média ou pesada)',
        'Penas Silenciosas: Proficiência em Furtividade'
      ],
      subraces: {}
    }
  },

  // ------------------------------------------------------------------------
  // CLASSES & ARQUÉTIPOS
  // ------------------------------------------------------------------------
  classes: {
    barbaro: {
      name: 'Bárbaro',
      hitDie: 12,
      primaryAbility: ['str'],
      savingThrows: ['str', 'con'],
      armorProficiencies: ['Armaduras leves', 'Armaduras médias', 'Escudos'],
      weaponProficiencies: ['Armas simples', 'Armas marciais'],
      skillChoices: ['Adestrar Animais', 'Atletismo', 'Intimidação', 'Natureza', 'Percepção', 'Sobrevivência'],
      skillCount: 2,
      featuresByLevel: {
        1: ['Fúria (2 usos, +2 dano)', 'Defesa sem Armadura (10 + Des + Con)'],
        2: ['Ataque Descuidado (Vantagem em ataques com Força)', 'Sentido de Perigo (Vantagem em salvaguardas de Des)'],
        3: ['Caminho Primitivo (Subclasse)', 'Fúria (3 usos)'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Ataque Extra (2 ataques)', 'Movimento Rápido (+3m sem armadura pesada)'],
        6: ['Recurso de Caminho Primitivo', 'Fúria (4 usos)'],
        7: ['Instinto Selvagem (Vantagem em iniciativa, age surpreso com fúria)'],
        8: ['Incremento no Valor de Habilidade'],
        9: ['Crítico Brutal (+1 dado de dano extra em crítico)', 'Dano de Fúria (+3)'],
        10: ['Recurso de Caminho Primitivo'],
        11: ['Fúria Implacável (salvaguarda de Con para não cair a 0 PV)'],
        12: ['Incremento no Valor de Habilidade', 'Fúria (5 usos)'],
        13: ['Crítico Brutal (+2 dados extras)'],
        14: ['Recurso de Caminho Primitivo'],
        15: ['Fúria Persistente (só acaba se cair inconsciente ou encerrar)'],
        16: ['Incremento no Valor de Habilidade', 'Dano de Fúria (+4)'],
        17: ['Crítico Brutal (+3 dados extras)', 'Fúria (6 usos)'],
        18: ['Força Indomável (resultado mínimo no d20 igual ao valor de Força)'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Campeão Primitivo (+4 em Força e Constituição, máximo 24)', 'Fúria Ilimitada']
      },
      subclasses: {
        furioso: {
          name: 'Caminho do Furioso',
          desc: 'Foco na violência desmedida, com frenesi para ataques extras com ação bônus e imunidade mental em combate.',
          features: {
            3: ['Frenesi: Ataque corpo-a-corpo com arma como ação bônus em cada turno de fúria (gera exaustão ao final).'],
            6: ['Fúria Inconsciente: Imune a ser enfeitiçado ou amedrontado durante a fúria.'],
            10: ['Presença Intimidante: Ação para amedrontar criatura a até 9 metros com teste de Sabedoria.'],
            14: ['Retaliação: Ao sofrer dano a 1,5m, usa reação para fazer um ataque corpo-a-corpo.']
          }
        },
        totemico: {
          name: 'Caminho do Guerreiro Totêmico',
          desc: 'Sintonia espiritual com espíritos animais da natureza que potencializam a fúria e sentidos.',
          features: {
            3: ['Conselheiro Espiritual (Sentido Bestial e Falar com Animais como rituais)', 'Totem Espiritual (Urso: resistência a todo dano exceto psíquico; Águia: disparada bônus e desvantagem em oportunidades; Lobo: aliados ganham vantagem contra seus alvos)'],
            6: ['Aspecto da Besta (Urso: dobro de capacidade de carga; Águia: visão a 1,6km; Lobo: rastreio rápido furtivo)'],
            10: ['Andarilho Espiritual (Comunhão com a Natureza como ritual)'],
            14: ['Sintonia Totêmica (Urso: impõe desvantagem a ataques contra aliados; Águia: voo temporário; Lobo: derruba com ação bônus)']
          }
        }
      }
    },

    bardo: {
      name: 'Bardo',
      hitDie: 8,
      primaryAbility: ['cha'],
      savingThrows: ['dex', 'cha'],
      armorProficiencies: ['Armaduras leves'],
      weaponProficiencies: ['Armas simples', 'Bestas de mão', 'Espadas longas', 'Rapieiras', 'Espadas curtas'],
      tools: ['Três instrumentos musicais'],
      skillChoices: ['Todas as 18 perícias disponíveis'],
      skillCount: 3,
      spellcasting: { ability: 'cha', type: 'known' },
      featuresByLevel: {
        1: ['Conjuração de Magias', 'Inspiração de Bardo (d6, usos = Carisma)'],
        2: ['Versatilidade (Jack of All Trades: +metade da proficiência)', 'Canção do Descanso (+1d6 cura no descanso curto)'],
        3: ['Colégio de Bardo (Subclasse)', 'Aptidão (Expertise em 2 perícias)'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Inspiração de Bardo (d8)', 'Fonte de Inspiração (Inspiração recarrega em descanso curto)'],
        6: ['Habilidade de Colégio', 'Canção de Proteção (Vantagem contra medo e encanto para aliados)'],
        7: ['Espaços de magia de 4º nível'],
        8: ['Incremento no Valor de Habilidade'],
        9: ['Canção do Descanso (1d8)'],
        10: ['Inspiração de Bardo (d10)', 'Aptidão (mais 2 perícias)', 'Segredos Mágicos (2 magias de qualquer classe)'],
        11: ['Espaços de magia de 6º nível'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Canção do Descanso (1d10)'],
        14: ['Habilidade de Colégio', 'Segredos Mágicos (2 magias de qualquer classe)'],
        15: ['Inspiração de Bardo (d12)'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Canção do Descanso (1d12)'],
        18: ['Segredos Mágicos (2 magias de qualquer classe)'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Inspiração Superior (Recupera 1 uso de Inspiração se rolar iniciativa sem nenhum)']
      },
      subclasses: {
        conhecimento: {
          name: 'Colégio do Conhecimento',
          desc: 'Colecionadores de segredos e canções populares com maestria em erudição e interrupção mágica.',
          features: {
            3: ['Proficiência Adicional: Ganha proficiência em 3 perícias quaisquer', 'Palavras de Interrupção: Reação para gastar Inspiração e subtrair do teste, ataque ou dano de inimigo'],
            6: ['Segredos Mágicos Adicionais: Aprende 2 magias de qualquer classe no 6º nível'],
            14: ['Perícia Inigualável: Gasta Inspiração para adicionar ao próprio teste de habilidade']
          }
        },
        bravura: {
          name: 'Colégio da Bravura',
          desc: 'Escaldos de batalha que cantam as lendas de heróis do passado e lideram linhas de frente armadas.',
          features: {
            3: ['Proficiência Adicional: Armaduras médias, escudos e armas marciais', 'Inspiração em Combate: Aliado pode somar inspiração ao dano de arma ou à CA contra ataque'],
            6: ['Ataque Extra: Ataca duas vezes ao realizar a ação de Ataque'],
            14: ['Magia de Batalha: Ao conjurar magia de bardo com uma ação, faz ataque de arma como ação bônus']
          }
        }
      }
    },

    bruxo: {
      name: 'Bruxo',
      hitDie: 8,
      primaryAbility: ['cha'],
      savingThrows: ['wis', 'cha'],
      armorProficiencies: ['Armaduras leves'],
      weaponProficiencies: ['Armas simples'],
      skillChoices: ['Arcanismo', 'Enganação', 'História', 'Intimidação', 'Investigação', 'Natureza', 'Religião'],
      skillCount: 2,
      spellcasting: { ability: 'cha', type: 'pact' },
      featuresByLevel: {
        1: ['Patrono Transcendental', 'Magia de Pacto (Slots de nível máximo recarregam em descanso curto)'],
        2: ['Invocações Místicas (2 invocações conhecidas)'],
        3: ['Dádiva do Pacto (Corrente, Lâmina ou Tomo)'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Slots de Pacto de 3º nível'],
        6: ['Característica de Patrono Transcendental'],
        7: ['Slots de Pacto de 4º nível'],
        8: ['Incremento no Valor de Habilidade'],
        9: ['Slots de Pacto de 5º nível (máximo)'],
        10: ['Característica de Patrono Transcendental'],
        11: ['Arcana Mística (Magia de 6º nível 1x/descanso longo)'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Arcana Mística (Magia de 7º nível)'],
        14: ['Característica de Patrono Transcendental'],
        15: ['Arcana Mística (Magia de 8º nível)'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Arcana Mística (Magia de 9º nível)', '4 Slots de Pacto'],
        18: ['8 Invocações Místicas conhecidas'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Mestre Místico (Gasta 1 minuto para recuperar todos os slots de magia de pacto)']
      },
      subclasses: {
        arquifada: {
          name: 'A Arquifada',
          desc: 'Pacto selado com senhores feéricos majestosos e caprichosos de Faéria.',
          features: {
            1: ['Presença Feérica: Cubo de 3m centrado em você; alvos fazem teste de Sabedoria ou ficam enfeitiçados/amedrontados.'],
            6: ['Névoa de Fuga: Reação ao sofrer dano para ficar invisível e se teletransportar até 18 metros.'],
            10: ['Defesa Sedutora: Imune a ser enfeitiçado; reação para virar encantamento de volta ao conjurador.'],
            14: ['Delírio Sombrio: Imerge um alvo num reino ilusório e aterrorizante por até 1 minuto.']
          }
        },
        corruptor: {
          name: 'O Corruptor',
          desc: 'Pacto forjado com lordes demônios do Abismo ou arquidiabos dos Nove Infernos de Baator.',
          features: {
            1: ['Bênção do Obscuro: Ao reduzir criatura a 0 PV, ganha PV temporário = Carisma + nível de bruxo.'],
            6: ['Sorte do Próprio Obscuro: Adiciona 1d10 a um teste de habilidade ou salvaguarda (1x/descanso).'],
            10: ['Resistência Demoníaca: Escolhe um tipo de dano a cada descanso para ter resistência.'],
            14: ['Lançar no Inferno: Ao atingir ataque, transporta o alvo para os planos inferiores causando 10d10 psíquico.']
          }
        },
        grande_antigo: {
          name: 'O Grande Antigo',
          desc: 'Conexão com entidades alienígenas e inconcebíveis dos ermos exteriores do Reino Distante.',
          features: {
            1: ['Despertar a Mente: Comunicação telepática a até 18 metros com qualquer criatura inteligente.'],
            6: ['Proteção Entrópica: Reação para impor desvantagem em ataque recebido; se errar, ganha vantagem no próximo.'],
            10: ['Escudo de Pensamentos: Pensamentos não podem ser lidos; resistência a dano psíquico e devolve o dano.'],
            14: ['Criar Lacaio: Toca humanoide incapacitado tornando-o permanentemente enfeitiçado como seu lacaio telepático.']
          }
        }
      }
    },

    clerigo: {
      name: 'Clérigo',
      hitDie: 8,
      primaryAbility: ['wis'],
      savingThrows: ['wis', 'cha'],
      armorProficiencies: ['Armaduras leves', 'Armaduras médias', 'Escudos'],
      weaponProficiencies: ['Todas as armas simples'],
      skillChoices: ['História', 'Intuição', 'Medicina', 'Persuasão', 'Religião'],
      skillCount: 2,
      spellcasting: { ability: 'wis', type: 'prepared' },
      featuresByLevel: {
        1: ['Conjuração Divina', 'Domínio Divino (Subclasse com magias preparadas automáticas)'],
        2: ['Canalizar Divindade (1x/descanso)', 'Expulsar Mortos-Vivos', 'Recurso de Domínio Divino'],
        3: ['Magias de 2º nível'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Destruir Mortos-Vivos (ND 1/2 ou menor)'],
        6: ['Canalizar Divindade (2x/descanso)', 'Recurso de Domínio Divino'],
        7: ['Magias de 4º nível'],
        8: ['Incremento no Valor de Habilidade', 'Destruir Mortos-Vivos (ND 1)', 'Golpe Divino / Conjuração Poderosa'],
        9: ['Magias de 5º nível'],
        10: ['Intervenção Divina (Rola d100: se resultado <= nível, a divindade atende)'],
        11: ['Destruir Mortos-Vivos (ND 2)'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Magias de 7º nível'],
        14: ['Destruir Mortos-Vivos (ND 3)'],
        15: ['Magias de 8º nível'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Destruir Mortos-Vivos (ND 4)', 'Recurso Supremo de Domínio'],
        18: ['Canalizar Divindade (3x/descanso)'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Aprimoramento de Intervenção Divina (Sucesso automático garantido sem rolagem)']
      },
      subclasses: {
        vida: {
          name: 'Domínio da Vida',
          desc: 'Canalizadores da energia positiva primordial, promovendo cura, ressurreição e proteção em batalha.',
          features: {
            1: ['Proficiência Adicional: Armaduras pesadas', 'Discípulo da Vida: Suas magias de cura curam 2 + nível da magia adicionais'],
            2: ['Canalizar Divindade: Preservar a Vida (Cura 5x o nível de clérigo distribuído a criaturas até metade dos PVs)'],
            6: ['Curandeiro Abençoado: Ao curar outra criatura, você também cura 2 + nível da magia em si mesmo'],
            8: ['Golpe Divino: +1d8 de dano radiante em ataques com arma (2d8 no 14º)'],
            17: ['Cura Suprema: Todos os dados de cura rolam sempre o valor máximo possível']
          }
        },
        guerra: {
          name: 'Domínio da Guerra',
          desc: 'Campeões de deuses guerreiros, vestidos em aço pesado e infundindo seus golpes com fúria sagrada.',
          features: {
            1: ['Proficiência Adicional: Armas marciais e armaduras pesadas', 'Sacerdote da Guerra: Ataque com arma como ação bônus (Sabedoria vezes por descanso)'],
            2: ['Canalizar Divindade: Ataque Dirigido (+10 de bônus em uma jogada de ataque)'],
            6: ['Canalizar Divindade: Bênção do Deus da Guerra (+10 no ataque de um aliado a 9 metros)'],
            8: ['Golpe Divino: +1d8 de dano extra com arma (2d8 no 14º)'],
            17: ['Avatar da Batalha: Resistência a concussão, cortante e perfurante de armas não-mágicas']
          }
        },
        luz: {
          name: 'Domínio da Luz',
          desc: 'Chamas sagradas e sol radiante que desintegram a escuridão, mentiras e mortos-vivos.',
          features: {
            1: ['Truque Luz adicional', 'Labareda Protetora: Reação para impor desvantagem em atacante antes de acertar'],
            2: ['Canalizar Divindade: Radiação do Amanhecer (Dissipa escuridão mágica e causa 2d10+nível radiante em 9m)'],
            6: ['Labareda Aprimorada: Pode usar Labareda Protetora para defender aliados'],
            8: ['Conjuração Poderosa: Adiciona Sabedoria no dano de qualquer truque de clérigo'],
            17: ['Coroa de Luz: Aura solar de 18 metros; inimigos têm desvantagem contra seu dano de fogo/radiante']
          }
        },
        tempestade: {
          name: 'Domínio da Tempestade',
          desc: 'Senhores dos mares e trovões que manipulam relâmpagos e empurram adversários com a força dos ventos.',
          features: {
            1: ['Proficiência Adicional: Armas marciais e armaduras pesadas', 'Ira da Tormenta: Reação para causar 2d8 elétrico/trovão a quem te atingir'],
            2: ['Canalizar Divindade: Ira Destruidora (Maximiza rolagens de dano elétrico ou trovejante)'],
            6: ['Golpe de Relâmpago: Dano elétrico empurra criaturas até 3 metros'],
            8: ['Golpe Divino: +1d8 de dano trovejante com armas (2d8 no 14º)'],
            17: ['Filho da Tormenta: Deslocamento de voo permanente a céu aberto']
          }
        }
      }
    },

    druida: {
      name: 'Druida',
      hitDie: 8,
      primaryAbility: ['wis'],
      savingThrows: ['int', 'wis'],
      armorProficiencies: ['Armaduras leves (não-metálicas)', 'Armaduras médias (não-metálicas)', 'Escudos (não-metálicos)'],
      weaponProficiencies: ['Clavas, adagas, dardos, azagaias, maças, bordões, cimitarras, foices, fundas e lanças'],
      tools: ['Kit de herbalismo'],
      skillChoices: ['Arcanismo', 'Adestrar Animais', 'Intuição', 'Medicina', 'Natureza', 'Percepção', 'Religião', 'Sobrevivência'],
      skillCount: 2,
      spellcasting: { ability: 'wis', type: 'prepared' },
      featuresByLevel: {
        1: ['Druídico (Idioma secreto dos druidas)', 'Conjuração de Magias'],
        2: ['Forma Selvagem (2 usos/descanso curto)', 'Círculo Druídico (Subclasse)'],
        3: ['Magias de 2º nível'],
        4: ['Aprimoramento de Forma Selvagem (ND 1/2, sem voo)', 'Incremento no Valor de Habilidade'],
        5: ['Magias de 3º nível'],
        6: ['Característica de Círculo Druídico'],
        7: ['Magias de 4º nível'],
        8: ['Aprimoramento de Forma Selvagem (ND 1, com voo)', 'Incremento no Valor de Habilidade'],
        9: ['Magias de 5º nível'],
        10: ['Característica de Círculo Druídico'],
        11: ['Magias de 6º nível'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Magias de 7º nível'],
        14: ['Característica de Círculo Druídico'],
        15: ['Magias de 8º nível'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Magias de 9º nível'],
        18: ['Corpo Atemporal (envelhece 10x mais devagar)', 'Magias da Besta (conjura magias na forma selvagem)'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Arquidruida (Forma Selvagem ilimitada, ignora componentes V e S)']
      },
      subclasses: {
        lua: {
          name: 'Círculo da Lua',
          desc: 'Guardiões ferozes que transformam-se em predadores brutais em combate com ação bônus.',
          features: {
            2: ['Forma Selvagem de Combate: Transforma-se como ação bônus; gasta slots de magia para curar 1d8/nível em besta', 'Formas de Círculo: Transforma-se em feras de até ND 1 no 2º nível'],
            6: ['Ataque Primordial: Ataques na forma de besta contam como mágicos', 'Formas Selvagens superiores (ND = Nível de Druida / 3)'],
            10: ['Forma Selvagem de Elemental: Gasta 2 usos para virar Elemental da Água, Ar, Fogo ou Terra'],
            14: ['Mil Formas: Conjura Alterar-se à vontade']
          }
        },
        terra: {
          name: 'Círculo da Terra',
          desc: 'Místicos de círculos sagrados com regeneração de magia e listas de magias adaptadas ao bioma de origem.',
          features: {
            2: ['Truque de Druida Adicional', 'Recuperação Natural: Recupera espaços de magia igual à metade do nível em descanso curto'],
            3: ['Magias de Círculo (Ligadas ao terreno: Ártico, Costa, Deserto, Floresta, Montanha, Pântano, Planície, Subterrâneo)'],
            6: ['Caminho da Floresta: Ignora terreno difícil não-mágico e plantas espinhosas'],
            10: ['Proteção Natural: Imune a venenos, doenças e a ser enfeitiçado/amedrontado por fadas e elementais'],
            14: ['Santuário Natural: Bestas e plantas hesitam em te atacar']
          }
        }
      }
    },

    feiticeiro: {
      name: 'Feiticeiro',
      hitDie: 6,
      primaryAbility: ['cha'],
      savingThrows: ['con', 'cha'],
      armorProficiencies: ['Nenhuma'],
      weaponProficiencies: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas leves'],
      skillChoices: ['Arcanismo', 'Enganação', 'Intuição', 'Intimidação', 'Persuasão', 'Religião'],
      skillCount: 2,
      spellcasting: { ability: 'cha', type: 'known' },
      featuresByLevel: {
        1: ['Conjuração Inata', 'Origem de Feitiçaria (Subclasse)'],
        2: ['Fonte de Magia (Pontos de Feitiçaria)', 'Conjuração Flexível (Cria/Converte slots de magia)'],
        3: ['Metamágica (Escolha 2 opções)'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Magias de 3º nível'],
        6: ['Característica de Origem de Feitiçaria'],
        7: ['Magias de 4º nível'],
        8: ['Incremento no Valor de Habilidade'],
        9: ['Magias de 5º nível'],
        10: ['Metamágica (Mais 1 opção)'],
        11: ['Magias de 6º nível'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Magias de 7º nível'],
        14: ['Característica de Origem de Feitiçaria'],
        15: ['Magias de 8º nível'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Metamágica (Mais 1 opção, total 4)'],
        18: ['Característica de Origem de Feitiçaria'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Restauração Mística (Recupera 4 pontos de feitiçaria em descanso curto)']
      },
      subclasses: {
        draconica: {
          name: 'Linhagem Dracônica',
          desc: 'Magia antiga nascida do sangue de dragões lendários, concedendo escamas, robustez e asas.',
          features: {
            1: ['Ancestral Dracônico (Fala Dracônico, dobra perícias com dragões)', 'Resiliência Dracônica (+1 PV por nível, CA 13 + Des sem armadura)'],
            6: ['Afinidade Elemental: Adiciona Carisma ao dano do elemento ancestral e ganha resistência gastando 1 ponto'],
            14: ['Asas de Dragão: Brota asas de dragão nas costas como ação bônus, ganhando voo igual ao deslocamento'],
            18: ['Presença Dracônica: Gasta 5 pontos para exalar aura de medo ou fascínio em 18 metros']
          }
        },
        selvagem: {
          name: 'Magia Selvagem',
          desc: 'Poder caótico das forças primordiais com surtos imprevisíveis capazes de distorcer a realidade.',
          features: {
            1: ['Surto de Magia Selvagem (Rola d20 ao lançar magias: ao cair 1, dispara tabela d100 de surtos)', 'Marés de Caos (Ganha vantagem em 1 jogada por descanso ou até próximo surto)'],
            6: ['Dobrar a Sorte: Reação para gastar 2 pontos e somar ou subtrair 1d4 da jogada de outra criatura'],
            14: ['Caos Controlado: Rola duas vezes na tabela de Surto e escolhe o resultado preferido'],
            18: ['Bombardeio de Magia: Ao tirar o valor máximo no dado de dano de magia, adiciona um dado extra']
          }
        }
      }
    },

    guerreiro: {
      name: 'Guerreiro',
      hitDie: 10,
      primaryAbility: ['str', 'dex'],
      savingThrows: ['str', 'con'],
      armorProficiencies: ['Todas as armaduras', 'Escudos'],
      weaponProficiencies: ['Armas simples', 'Armas marciais'],
      skillChoices: ['Acrobacia', 'Adestrar Animais', 'Atletismo', 'História', 'Intuição', 'Intimidação', 'Percepção', 'Sobrevivência'],
      skillCount: 2,
      featuresByLevel: {
        1: ['Estilo de Luta (Arquearia, Combate com Duas Armas, Defesa, Duelismo, etc.)', 'Retomar o Fôlego (Ação bônus cura 1d10 + nível)'],
        2: ['Surto de Ação (1 ação extra no turno, 1x/descanso)'],
        3: ['Arquétipo Marcial (Subclasse)'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Ataque Extra (2 ataques por ação)'],
        6: ['Incremento no Valor de Habilidade'],
        7: ['Característica de Arquétipo Marcial'],
        8: ['Incremento no Valor de Habilidade'],
        9: ['Indomável (Rerrola salvaguarda falhada, 1x/descanso longo)'],
        10: ['Característica de Arquétipo Marcial'],
        11: ['Ataque Extra (2) (3 ataques por ação)'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Indomável (2 usos)'],
        14: ['Incremento no Valor de Habilidade'],
        15: ['Característica de Arquétipo Marcial'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Surto de Ação (2 usos)', 'Indomável (3 usos)'],
        18: ['Característica de Arquétipo Marcial'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Ataque Extra (3) (4 ataques por ação)']
      },
      subclasses: {
        campeao: {
          name: 'Campeão',
          desc: 'Foco na maestria atlética crua e na letalidade devastadora dos golpes críticos.',
          features: {
            3: ['Crítico Aprimorado: Seus ataques com armas têm acerto crítico com 19 ou 20 no d20.'],
            7: ['Atletismo Extraordinário: Adiciona metade da proficiência em testes físicos e salta mais longe.'],
            10: ['Estilo de Luta Adicional: Escolhe um segundo Estilo de Combate.'],
            15: ['Crítico Superior: Seus ataques têm acerto crítico com 18, 19 ou 20 no d20.'],
            18: ['Sobrevivente: No começo do seu turno recupera 5 + Con em PV se estiver abaixo da metade.']
          }
        },
        mestre_batalha: {
          name: 'Mestre de Batalha',
          desc: 'Combatente tático que utiliza dados de superioridade para manobras de controle e liderança marcial.',
          features: {
            3: ['Superioridade em Combate (4 dados d8 de superioridade e 3 manobras conhecidas)', 'Estudioso da Guerra (Proficiência com ferramenta de artesão)'],
            7: ['Conheça Seu Inimigo: Analisa adversário fora de combate para descobrir atributos e CA comparativos', '+1 Dado de Superioridade e 2 manobras'],
            10: ['Superioridade Aprimorada: Dados de superioridade tornam-se d10s'],
            15: ['Implacável: Ao rolar iniciativa sem dados restantes, recupera 1 dado de superioridade'],
            18: ['Superioridade Máxima: Dados de superioridade tornam-se d12s']
          }
        },
        cavaleiro_arcano: {
          name: 'Cavaleiro Arcano',
          desc: 'Guerreiro que combina esgrima pesada com magias arcanas de Abjuração e Evocação.',
          features: {
            3: ['Conjuração Arcana (Truques e magias de mago baseadas em Inteligência)', 'Vínculo com Arma (Não pode ser desarmado e teletransporta a arma para a mão)'],
            7: ['Magia de Guerra: Ao conjurar um truque com sua ação, faz um ataque com arma como ação bônus'],
            10: ['Golpe Místico: Ataque com arma impõe desvantagem na próxima salvaguarda mágica do alvo'],
            15: ['Investida Arcana: Teletransporta até 9 metros ao usar o Surto de Ação'],
            18: ['Magia de Guerra Aprimorada: Ao conjurar qualquer magia de ação, faz ataque de arma como bônus']
          }
        }
      }
    },

    ladino: {
      name: 'Ladino',
      hitDie: 8,
      primaryAbility: ['dex'],
      savingThrows: ['dex', 'int'],
      armorProficiencies: ['Armaduras leves'],
      weaponProficiencies: ['Armas simples', 'Bestas de mão', 'Espadas longas', 'Rapieiras', 'Espadas curtas'],
      tools: ['Ferramentas de ladrão'],
      skillChoices: ['Acrobacia', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'Intimidação', 'Intuição', 'Investigação', 'Percepção', 'Persuasão', 'Prestidigitação'],
      skillCount: 4,
      featuresByLevel: {
        1: ['Especialização (Dobro de proficiência em 2 perícias)', 'Ataque Furtivo (+1d6)', 'Gíria de Ladrão'],
        2: ['Ação Ardilosa (Ação bônus para Disparada, Desengajar ou Esconder)'],
        3: ['Arquétipo de Ladino (Subclasse)', 'Ataque Furtivo (+2d6)'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Esquiva Sobrenatural (Reação para reduzir pela metade dano de ataque recebido)', 'Ataque Furtivo (+3d6)'],
        6: ['Especialização (Mais 2 perícias ou ferramentas)'],
        7: ['Evasão (Sucesso em teste de Des não toma dano, falha toma metade)', 'Ataque Furtivo (+4d6)'],
        8: ['Incremento no Valor de Habilidade'],
        9: ['Característica de Arquétipo', 'Ataque Furtivo (+5d6)'],
        10: ['Incremento no Valor de Habilidade'],
        11: ['Talento Confiável (Rolagens no d20 de 9 ou menor contam como 10 em testes proficientes)', 'Ataque Furtivo (+6d6)'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Característica de Arquétipo', 'Ataque Furtivo (+7d6)'],
        14: ['Sentido Cego (Detecta criaturas escondidas a até 3 metros)', 'Ataque Furtivo (+7d6)'],
        15: ['Mente Escorregadia (Proficiência em salvaguardas de Sabedoria)', 'Ataque Furtivo (+8d6)'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Característica de Arquétipo', 'Ataque Furtivo (+9d6)'],
        18: ['Elusivo (Nenhum ataque tem vantagem contra você enquanto consciente)'],
        19: ['Incremento no Valor de Habilidade', 'Ataque Furtivo (+10d6)'],
        20: ['Golpe de Sorte (Transforma um ataque falho em acerto ou teste falho em 20 natural)']
      },
      subclasses: {
        ladrao: {
          name: 'Ladrão',
          desc: 'Perito na agilidade de mãos, desarmar armadilhas e invasão veloz de ruínas antigas.',
          features: {
            3: ['Mãos Rápidas: Ação bônus para Prestidigitação, abrir fechaduras ou Usar Objeto', 'Andarilho de Telhados: Escalar não custa movimento extra, salta mais longe'],
            9: ['Furtividade Suprema: Vantagem em Furtividade se mover metade do deslocamento'],
            13: ['Usar Instrumento Mágico: Ignora todos os requisitos de raça, classe e nível para itens mágicos'],
            17: ['Reflexos de Ladrão: Dois turnos completos na primeira rodada de combate']
          }
        },
        assassino: {
          name: 'Assassino',
          desc: 'Mestre da morte silenciosa, venenos e disfarces com golpes letais em alvos desprevenidos.',
          features: {
            3: ['Proficiências Adicionais: Kit de disfarce e kit de venenos', 'Assassinar: Vantagem em alvos que não agiram; crítico automático em alvos surpresos'],
            9: ['Especialização em Infiltração: Cria identidades falsas infalíveis com 7 dias de preparação'],
            13: ['Impostor: Imita fala, escrita e maneirismos com 3 horas de estudo'],
            17: ['Golpe Letal: Alvo surpreso falha em salvaguarda de Con ou sofre o dobro de todo o dano']
          }
        },
        trapaceiro_arcano: {
          name: 'Trapaceiro Arcano',
          desc: 'Ladino que aprimora furtividade com ilusões e encantamentos arcanos.',
          features: {
            3: ['Conjuração Arcana (Truques e magias de Ilusão/Encantamento)', 'Mãos Mágicas Malabaristas: Mão invisível que furta ou desarma à distância'],
            9: ['Emboscada Mágica: Magias conjuradas escondido impõem desvantagem nas salvaguardas'],
            13: ['Trapaceiro Versátil: Usa a mão espectral com ação bônus para ganhar vantagem no ataque'],
            17: ['Ladrão de Magia: Reação para anular e roubar temporariamente a magia de um conjurador inimigo']
          }
        }
      }
    },

    mago: {
      name: 'Mago',
      hitDie: 6,
      primaryAbility: ['int'],
      savingThrows: ['int', 'wis'],
      armorProficiencies: ['Nenhuma'],
      weaponProficiencies: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas leves'],
      skillChoices: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Religião'],
      skillCount: 2,
      spellcasting: { ability: 'int', type: 'book' },
      featuresByLevel: {
        1: ['Conjuração no Grimório', 'Recuperação Arcana (Recupera metade do nível em slots em descanso curto)'],
        2: ['Tradição Arcana (Escola de Magia)'],
        3: ['Magias de 2º nível'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Magias de 3º nível'],
        6: ['Característica de Tradição Arcana'],
        7: ['Magias de 4º nível'],
        8: ['Incremento no Valor de Habilidade'],
        9: ['Magias de 5º nível'],
        10: ['Característica de Tradição Arcana'],
        11: ['Magias de 6º nível'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Magias de 7º nível'],
        14: ['Característica de Tradição Arcana'],
        15: ['Magias de 8º nível'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Magias de 9º nível'],
        18: ['Dominar Magia (Conjura uma magia de 1º e uma de 2º nível à vontade sem gastar slots)'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Assinatura Mágica (Duas magias de 3º nível sempre preparadas e 1x grátis/descanso)']
      },
      subclasses: {
        evocacao: {
          name: 'Escola de Evocação',
          desc: 'Mestres de explosões de fogo, raios e forças destrutivas no campo de batalha.',
          features: {
            2: ['Evocação Instruída: Custo e tempo para copiar magias de evocação caem pela metade', 'Esculpir Magias: Cria bolsas de segurança para aliados não sofrerem dano em suas áreas'],
            6: ['Truque Potente: Alvos que passarem no teste ainda sofrem metade do dano do truque'],
            10: ['Evocação Potencializada: Adiciona modificador de Inteligência ao dano das magias de evocação'],
            14: ['Sobrecarga: Maximiza o dano de magias até o 5º nível (custo de dano necrótico subsequente)']
          }
        },
        adivinhacao: {
          name: 'Escola de Adivinhação',
          desc: 'Videntes que enxergam o destino e manipulam rolagens de dados com premonições.',
          features: {
            2: ['Adivinhação Instruída: Custo e tempo para copiar magias caem pela metade', 'Prodígio: Rola 2 d20s em cada descanso longo para substituir qualquer rolagem no dia'],
            6: ['Especialista em Adivinhação: Ao conjurar magia de adivinhação, recupera um slot de nível inferior'],
            10: ['O Terceiro Olho: Ganha sentidos extras como Visão no Escuro, Etérea ou Ver Invisibilidade'],
            14: ['Prodígio Maior: Rola 3 d20s de premonição em vez de 2']
          }
        },
        abjuracao: {
          name: 'Escola de Abjuração',
          desc: 'Especialistas em defesas impenetráveis, banimento de espíritos e anulação de magias inimigas.',
          features: {
            2: ['Abjuração Instruída: Custo reduzido à metade', 'Proteção Arcana: Cria barreira com PV = dobro do nível + Inteligência'],
            6: ['Proteção Projetada: Reação para absorver dano que um aliado a 9 metros sofreria'],
            10: ['Abjuração Aprimorada: Soma bônus de proficiência nos testes de Contramágica e Dissipar Magia'],
            14: ['Resistência à Magia: Vantagem em salvaguardas contra magias e resistência a danos mágicos']
          }
        },
        necromancia: {
          name: 'Escola de Necromancia',
          desc: 'Manipuladores das energias cósmicas de vida e morte, comandando legiões de mortos-vivos.',
          features: {
            2: ['Necromancia Instruída: Custo reduzido à metade', 'Colheita Sinistra: Recupera PV ao matar criaturas com magias'],
            6: ['Escravos Mortos-Vivos: Animar Mortos adicionado ao grimório; ergue mortos extras com mais PV e dano'],
            10: ['Acostumado à Morte-Vida: Resistência a dano necrótico e PV máximo não pode ser reduzido'],
            14: ['Comandar Mortos-Vivos: Ação para subjugar e controlar mortos-vivos de outros conjuradores']
          }
        }
      }
    },

    monge: {
      name: 'Monge',
      hitDie: 8,
      primaryAbility: ['dex', 'wis'],
      savingThrows: ['str', 'dex'],
      armorProficiencies: ['Nenhuma'],
      weaponProficiencies: ['Armas simples', 'Espadas curtas'],
      tools: ['Um instrumento musical ou ferramenta de artesão'],
      skillChoices: ['Acrobacia', 'Atletismo', 'Furtividade', 'História', 'Intuição', 'Religião'],
      skillCount: 2,
      featuresByLevel: {
        1: ['Defesa sem Armadura (10 + Des + Sab)', 'Artes Marciais (Dano 1d4, ataque desarmado com ação bônus)'],
        2: ['Chi (Pontos = nível)', 'Rajada de Golpes', 'Defesa Paciente', 'Passo do Vento', 'Movimento sem Armadura (+3m)'],
        3: ['Tradição Monástica (Subclasse)', 'Defletir Projéteis (Reduz dano de disparo e pode devolver)'],
        4: ['Incremento no Valor de Habilidade', 'Queda Lenta (Reduz dano de queda em 5x nível)'],
        5: ['Ataque Extra', 'Ataque Atordoante (Gasta 1 chi para atordoar alvo com falha em Con)', 'Artes Marciais (1d6)'],
        6: ['Golpes de Chi (Ataques desarmados contam como mágicos)', 'Movimento (+4,5m)'],
        7: ['Evasão', 'Mente Tranquila (Ação encerra efeito de medo ou encanto em si)'],
        8: ['Incremento no Valor de Habilidade'],
        9: ['Aprimoramento de Movimento (Corre em superfícies verticais e líquidos)'],
        10: ['Pureza Corporal (Imune a venenos e doenças)', 'Movimento (+6m)'],
        11: ['Artes Marciais (1d8)'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Idiomas do Sol e da Lua (Compreende e fala todos os idiomas falados)'],
        14: ['Alma de Diamante (Proficiência em TODAS as salvaguardas; rerrola com 1 chi)', 'Movimento (+7,5m)'],
        15: ['Corpo Atemporal (Não sofre velhice e não precisa de comida/água)'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Artes Marciais (1d10)'],
        18: ['Corpo Vazio (Invisibilidade e resistência a todo dano exceto energia; Projeção Astral)', 'Movimento (+9m)'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Auto Aperfeiçoamento (Recupera 4 pontos de chi ao rolar iniciativa se estiver sem nenhum)']
      },
      subclasses: {
        mao_aberta: {
          name: 'Caminho da Mão Aberta',
          desc: 'Mestres absolutos das técnicas de combate marcial, derrubando e quebrando a postura do oponente.',
          features: {
            3: ['Técnica da Mão Aberta: Na rajada de golpes, pode derrubar, empurrar 4,5m ou negar reações do alvo'],
            6: ['Integridade Corporal: Cura 3x nível em PV uma vez por descanso longo'],
            11: ['Tranquilidade: Aura protetora permanente equivalente à magia Santuário após descanso longo'],
            17: ['Palma Vibrante: Implanta vibrações mortais que matam instantaneamente ou causam 10d10 necrótico']
          }
        },
        sombra: {
          name: 'Caminho da Sombra',
          desc: 'Assassinos e espiões das sombras com técnicas ninjas de silêncio e infiltração.',
          features: {
            3: ['Artes Sombrias: Gasta 2 chi para lançar Escuridão, Visão no Escuro, Passos sem Pegadas ou Silêncio'],
            6: ['Passo das Sombras: Teletransporte de 18 metros entre áreas de sombra com ação bônus'],
            11: ['Manto de Sombras: Invisibilidade total enquanto estiver sob penumbra ou escuridão'],
            17: ['Oportunista: Reação para atacar criatura atingida por um aliado a até 1,5 metro']
          }
        }
      }
    },

    paladino: {
      name: 'Paladino',
      hitDie: 10,
      primaryAbility: ['str', 'cha'],
      savingThrows: ['wis', 'cha'],
      armorProficiencies: ['Todas as armaduras', 'Escudos'],
      weaponProficiencies: ['Armas simples', 'Armas marciais'],
      skillChoices: ['Atletismo', 'Intuição', 'Intimidação', 'Medicina', 'Persuasão', 'Religião'],
      skillCount: 2,
      spellcasting: { ability: 'cha', type: 'prepared' },
      featuresByLevel: {
        1: ['Sentido Divino (Detecta celestiais, corruptores e mortos-vivos)', 'Cura pelas Mãos (Reserva de 5x nível em PV)'],
        2: ['Estilo de Luta', 'Conjuração Divina', 'Destruição Divina (Divine Smite: +2d8 até +5d8 radiante)'],
        3: ['Saúde Divina (Imunidade a doenças)', 'Juramento Sagrado (Subclasse com magias automáticas)'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Ataque Extra (2 ataques)'],
        6: ['Aura de Proteção (+Modificador de Carisma em TODAS as salvaguardas para você e aliados em 3m)'],
        7: ['Característica de Juramento Sagrado'],
        8: ['Incremento no Valor de Habilidade'],
        9: ['Magias de 3º nível'],
        10: ['Aura de Coragem (Imune a ser amedrontado em 3 metros)'],
        11: ['Destruição Divina Aprimorada (+1d8 radiante passivo em todos os ataques corpo-a-corpo)'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Magias de 4º nível'],
        14: ['Toque Purificador (Encerra magia em si ou aliado com toque)'],
        15: ['Característica de Juramento Sagrado'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Magias de 5º nível'],
        18: ['Aprimoramento de Auras (Alcance de todas as auras expande para 9 metros)'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Avatar Sagrado de Juramento']
      },
      subclasses: {
        devocao: {
          name: 'Juramento de Devoção',
          desc: 'O clássico cavaleiro em armadura brilhante, devotado à justiça, honra e aos anjos do bem maior.',
          features: {
            3: ['Arma Sagrada (Soma Carisma no ataque da arma e emite luz)', 'Expulsar o Profano (Expulsa corruptores e mortos-vivos)'],
            7: ['Aura de Devoção: Aliados na aura não podem ser enfeitiçados'],
            15: ['Pureza de Espírito: Proteção permanente equivalente a Proteção contra o Bem e Mal'],
            20: ['Halo Sagrado: Aura solar que queima inimigos com 10 de dano radiante a cada turno']
          }
        },
        vinganca: {
          name: 'Juramento de Vingança',
          desc: 'Cavaleiros implacáveis que exterminam os maiores males sem hesitação nem misericórdia.',
          features: {
            3: ['Abjurar Inimigo (Amedronta e zera deslocamento do alvo)', 'Voto de Inimizade (Vantagem permanente nos ataques contra o alvo por 1 minuto)'],
            7: ['Vingador Implacável: Move-se metade do deslocamento como reação após acertar ataque de oportunidade'],
            15: ['Alma de Vingança: Reação para contra-atacar o alvo do voto sempre que ele atacar'],
            20: ['Anjo Vingador: Transforma-se em anjo com asas (voo 18m) e aura aterrorizante']
          }
        },
        ancioes: {
          name: 'Juramento dos Anciões',
          desc: 'Cavaleiros verdes que defendem a beleza, alegria, arte e os ritos ancestrais da natureza.',
          features: {
            3: ['Fúria da Natureza (Enreda oponente em vinhas)', 'Expulsar os Infiéis (Expulsa fadas e corruptores)'],
            7: ['Aura de Vigilância: Resistência a dano de magias para você e aliados próximos'],
            15: ['Sentinela Imortal: Ao cair a 0 PV pode ficar com 1 PV (1x/descanso) e não sofre velhice'],
            20: ['Campeão dos Anciões: Regenera 10 PV por turno e conjura magias de paladino com ação bônus']
          }
        }
      }
    },

    patrulheiro: {
      name: 'Patrulheiro',
      hitDie: 10,
      primaryAbility: ['dex', 'wis'],
      savingThrows: ['str', 'dex'],
      armorProficiencies: ['Armaduras leves', 'Armaduras médias', 'Escudos'],
      weaponProficiencies: ['Armas simples', 'Armas marciais'],
      skillChoices: ['Adestrar Animais', 'Atletismo', 'Furtividade', 'Intuição', 'Investigação', 'Natureza', 'Percepção', 'Sobrevivência'],
      skillCount: 3,
      spellcasting: { ability: 'wis', type: 'known' },
      featuresByLevel: {
        1: ['Inimigo Favorito (+2 de dano e vantagem em rastreio)', 'Explorador Natural (Ignora terreno difícil, iniciativa com vantagem, grupo nunca se perde)'],
        2: ['Estilo de Luta', 'Conjuração da Natureza'],
        3: ['Conclave de Patrulheiro (Subclasse)', 'Consciência Primitiva (Sentido de inimigos até 8 km)'],
        4: ['Incremento no Valor de Habilidade'],
        5: ['Característica de Conclave (Ataque Extra)'],
        6: ['Inimigo Favorito Maior (+4 de dano contra aberrações, dragões, etc. e vantagem em resistências)'],
        7: ['Característica de Conclave'],
        8: ['Pés Rápidos (Disparada como ação bônus)', 'Incremento no Valor de Habilidade'],
        9: ['Magias de 3º nível'],
        10: ['Mimetismo (-10 na percepção inimiga quando imóvel emboscando)'],
        11: ['Característica de Conclave'],
        12: ['Incremento no Valor de Habilidade'],
        13: ['Magias de 4º nível'],
        14: ['Desaparecer (Esconder como ação bônus e não pode ser rastreado sem magia)'],
        15: ['Característica de Conclave'],
        16: ['Incremento no Valor de Habilidade'],
        17: ['Magias de 5º nível'],
        18: ['Sentidos Selvagens (Sem desvantagem contra invisíveis e detecta a até 9m)'],
        19: ['Incremento no Valor de Habilidade'],
        20: ['Matador de Inimigos (Soma Sabedoria no ataque ou dano em cada turno)']
      },
      subclasses: {
        cacador: {
          name: 'Conclave do Caçador',
          desc: 'Especialistas no combate com armas para aniquilar feras gigantes e hordas de monstros.',
          features: {
            3: ['Presa do Caçador: Escolha entre Assassino de Colossos (+1d8 dano), Matador de Gigantes (reação) ou Destruidor de Hordas'],
            5: ['Ataque Extra: Ataca duas vezes por ação'],
            7: ['Táticas Defensivas: Escapar da Horda, Defesa contra Múltiplos Ataques (+4 CA) ou Vontade de Aço'],
            11: ['Ataque Múltiplo: Saraivada (à distância em 3m) ou Ataque Giratório (corpo-a-corpo em todos a 1,5m)'],
            15: ['Defesa de Caçador Superior: Evasão, Esquiva Sobrenatural ou Manter-se Contra a Maré']
          }
        },
        besta: {
          name: 'Conclave da Besta',
          desc: 'Elo mágico profundo com uma fera leal (lobo, pantera, urso negro, javali, etc.) que evolui junto.',
          features: {
            3: ['Companheiro Animal: Vincula fera leal que ganha sua proficiência na CA, ataques e dano'],
            5: ['Ataque Coordenado: Ação de ataque permite que a fera ataque com a reação dela'],
            7: ['Defesa da Besta: O companheiro tem vantagem em testes de resistência quando puder te ver'],
            11: ['Tempestade de Garras e Presas: O animal ataca cada inimigo a até 1,5 metro'],
            15: ['Defesa da Besta Superior: O animal usa reação para reduzir à metade dano recebido']
          }
        },
        rastreador_subterraneo: {
          name: 'Rastreador Subterrâneo (Gloom Stalker)',
          desc: 'Sentinelas do Subterrâneo mortais na escuridão e imperceptíveis à visão no escuro alheia.',
          features: {
            3: ['Batedor do Subterrâneo: +3m deslocamento e ataque extra no 1º turno; invisível a visão no escuro', 'Visão no Escuro (27 metros)', 'Magias do Rastreador (Disfarçar-se, etc.)'],
            5: ['Ataque Extra: Ataca duas vezes por turno'],
            7: ['Mente de Aço: Proficiência em testes de resistência de Sabedoria'],
            11: ['Rajada do Rastreador: Ao errar um ataque, pode realizar outro imediatamente'],
            15: ['Esquiva do Rastreador: Reação para impor desvantagem em atacante sem vantagem']
          }
        }
      }
    }
  },

  // ------------------------------------------------------------------------
  // ANTECEDENTES (BACKGROUNDS)
  // ------------------------------------------------------------------------
  backgrounds: {
    acolito: {
      name: 'Acólito',
      skills: ['insight', 'religion'],
      languages: 2,
      equipment: ['Símbolo sagrado', 'Livro de preces', '5 varetas de incenso', 'Vestimentas', 'Roupas comuns', '15 po'],
      feature: 'Abrigo dos Fiéis: Recebe acolhimento, abrigo e rituais gratuitos em templos da sua fé.'
    },
    artesao_guilda: {
      name: 'Artesão de Guilda',
      skills: ['insight', 'persuasion'],
      tools: ['1 Ferramenta de artesão'],
      languages: 1,
      equipment: ['Ferramentas de artesão', 'Carta de apresentação da guilda', 'Roupas de viajante', '15 po'],
      feature: 'Associados da Guilda: Benefícios de hospedagem, assessoria política e rede de contatos mercantis.'
    },
    artista: {
      name: 'Artista',
      skills: ['acrobatics', 'performance'],
      tools: ['Kit de disfarce', '1 Instrumento musical'],
      equipment: ['Instrumento musical', 'Presente de admirador', 'Traje de atuação', '15 po'],
      feature: 'Pela Demanda Popular: Encontra abrigo e alimentação gratuitos atuando todas as noites.'
    },
    charlatao: {
      name: 'Charlatão',
      skills: ['deception', 'sleight_of_hand'],
      tools: ['Kit de disfarce', 'Kit de falsificação'],
      equipment: ['Roupas finas', 'Kit de disfarce', 'Ferramentas de trapaça', '15 po'],
      feature: 'Identidade Falsa: Documentos e disfarces estabelecidos para assumir outra persona.'
    },
    criminoso: {
      name: 'Criminoso',
      skills: ['deception', 'stealth'],
      tools: ['Kit de jogo', 'Ferramentas de ladrão'],
      equipment: ['Pé de cabra', 'Roupas escuras com capuz', '15 po'],
      feature: 'Contato Criminal: Rede confiável de informantes no submundo das cidades.'
    },
    eremita: {
      name: 'Eremita',
      skills: ['medicine', 'religion'],
      tools: ['Kit de herbalismo'],
      languages: 1,
      equipment: ['Estojo com anotações de estudo', 'Cobertor de inverno', 'Kit de herbalismo', '5 po'],
      feature: 'Descoberta: Revelação única sobre o cosmos, os deuses ou grande segredo do mundo.'
    },
    forasteiro: {
      name: 'Forasteiro',
      skills: ['athletics', 'survival'],
      tools: ['1 Instrumento musical'],
      languages: 1,
      equipment: ['Bordão', 'Armadilha de caça', 'Fetiche animal', 'Roupas de viajante', '10 po'],
      feature: 'Andarilho: Excelente memória para mapas e encontra comida/água fresca para até 6 pessoas.'
    },
    heroi_povo: {
      name: 'Herói do Povo',
      skills: ['animal_handling', 'survival'],
      tools: ['1 Ferramenta de artesão', 'Veículos terrestres'],
      equipment: ['Ferramentas de artesão', 'Pá', 'Pote de ferro', 'Roupas comuns', '10 po'],
      feature: 'Hospitalidade Rústica: Camponeses e povo simples oferecem abrigo e proteção contra tiranos.'
    },
    marinheiro: {
      name: 'Marinheiro',
      skills: ['athletics', 'perception'],
      tools: ['Ferramentas de navegador', 'Veículos aquáticos'],
      equipment: ['Malagueta (clava)', '15m de corda de seda', 'Amuleto da sorte', 'Roupas comuns', '10 po'],
      feature: 'Passagem de Navio: Consegue passagem gratuita em navios para o grupo em troca de trabalho a bordo.'
    },
    nobre: {
      name: 'Nobre',
      skills: ['history', 'persuasion'],
      tools: ['1 Kit de jogos'],
      languages: 1,
      equipment: ['Trajes finos', 'Anel de sinete', 'Pergaminho de linhagem', '25 po'],
      feature: 'Posição Privilegiada: Bem-vindo na alta sociedade e consegue audiência com nobres locais.'
    },
    orfao: {
      name: 'Órfão',
      skills: ['sleight_of_hand', 'stealth'],
      tools: ['Kit de disfarce', 'Ferramentas de ladrão'],
      equipment: ['Faca pequena', 'Mapa da cidade natal', 'Rato de estimação', 'Roupas comuns', '10 po'],
      feature: 'Segredos da Cidade: Conhece passagens e atalhos urbanos, viajando no dobro da velocidade comum.'
    },
    sabio: {
      name: 'Sábio',
      skills: ['arcana', 'history'],
      languages: 2,
      equipment: ['Vidro de tinta', 'Pena', 'Faca pequena', 'Carta de colega falecido', 'Roupas comuns', '10 po'],
      feature: 'Pesquisador: Sabe exatamente onde e com quem obter qualquer fragmento de conhecimento antigo.'
    },
    soldado: {
      name: 'Soldado',
      skills: ['athletics', 'intimidation'],
      tools: ['1 Kit de jogo', 'Veículos terrestres'],
      equipment: ['Insígnia de patente', 'Troféu de guerra', 'Dados de osso/baralho', 'Roupas comuns', '10 po'],
      feature: 'Patente Militar: Soldados e guardas reconhecem sua patente militar e prestam deferência.'
    }
  },

  // ------------------------------------------------------------------------
  // ARMADURAS & EQUIPAMENTOS DEFENSIVOS
  // ------------------------------------------------------------------------
  armors: [
    { id: 'nenhuma', name: 'Nenhuma (Sem Armadura)', type: 'Nenhuma', acBase: 10, dexMod: 'full', strReq: 0, stealthDis: false, weight: 0, cost: '0' },
    // Leves
    { id: 'acolchoada', name: 'Acolchoada', type: 'Leve', acBase: 11, dexMod: 'full', strReq: 0, stealthDis: true, weight: 4, cost: '5 po' },
    { id: 'couro', name: 'Armadura de Couro', type: 'Leve', acBase: 11, dexMod: 'full', strReq: 0, stealthDis: false, weight: 5, cost: '10 po' },
    { id: 'couro_batido', name: 'Couro Batido', type: 'Leve', acBase: 12, dexMod: 'full', strReq: 0, stealthDis: false, weight: 6.5, cost: '45 po' },
    // Médias
    { id: 'gibao_peles', name: 'Gibão de Peles', type: 'Média', acBase: 12, dexMod: 'max2', strReq: 0, stealthDis: false, weight: 6, cost: '10 po' },
    { id: 'camisao_malha', name: 'Camisão de Malha', type: 'Média', acBase: 13, dexMod: 'max2', strReq: 0, stealthDis: false, weight: 10, cost: '30 po' },
    { id: 'brunea', name: 'Brunea', type: 'Média', acBase: 14, dexMod: 'max2', strReq: 0, stealthDis: true, weight: 22.5, cost: '50 po' },
    { id: 'peitoral', name: 'Peitoral de Aço', type: 'Média', acBase: 14, dexMod: 'max2', strReq: 0, stealthDis: false, weight: 10, cost: '400 po' },
    { id: 'meia_armadura', name: 'Meia-Armadura', type: 'Média', acBase: 15, dexMod: 'max2', strReq: 0, stealthDis: true, weight: 20, cost: '750 po' },
    // Pesadas
    { id: 'cota_aneis', name: 'Cota de Anéis', type: 'Pesada', acBase: 14, dexMod: 'none', strReq: 0, stealthDis: true, weight: 20, cost: '30 po' },
    { id: 'cota_malha', name: 'Cota de Malha', type: 'Pesada', acBase: 16, dexMod: 'none', strReq: 13, stealthDis: true, weight: 27.5, cost: '75 po' },
    { id: 'cota_talas', name: 'Cota de Talas', type: 'Pesada', acBase: 17, dexMod: 'none', strReq: 15, stealthDis: true, weight: 30, cost: '200 po' },
    { id: 'placas', name: 'Armadura de Placas', type: 'Pesada', acBase: 18, dexMod: 'none', strReq: 15, stealthDis: true, weight: 32.5, cost: '1.500 po' }
  ],

  // ------------------------------------------------------------------------
  // ARMAS DO LIVRO
  // ------------------------------------------------------------------------
  weapons: [
    // Simples Corpo-a-Corpo
    { name: 'Adaga', category: 'Simples', type: 'Corpo-a-corpo', damage: '1d4', damageType: 'perfurante', weight: 0.5, cost: '2 po', properties: ['Acuidade', 'Leve', 'Arremesso (6/18m)'] },
    { name: 'Azagaia', category: 'Simples', type: 'Corpo-a-corpo', damage: '1d6', damageType: 'perfurante', weight: 1, cost: '5 pp', properties: ['Arremesso (9/36m)'] },
    { name: 'Bordão', category: 'Simples', type: 'Corpo-a-corpo', damage: '1d6', damageType: 'concussão', weight: 2, cost: '2 pp', properties: ['Versátil (1d8)'] },
    { name: 'Clava Grande', category: 'Simples', type: 'Corpo-a-corpo', damage: '1d8', damageType: 'concussão', weight: 5, cost: '2 pp', properties: ['Pesada', 'Duas mãos'] },
    { name: 'Foice Curta', category: 'Simples', type: 'Corpo-a-corpo', damage: '1d4', damageType: 'cortante', weight: 1, cost: '1 po', properties: ['Leve'] },
    { name: 'Lança', category: 'Simples', type: 'Corpo-a-corpo', damage: '1d6', damageType: 'perfurante', weight: 1.5, cost: '1 po', properties: ['Arremesso (6/18m)', 'Versátil (1d8)'] },
    { name: 'Maça', category: 'Simples', type: 'Corpo-a-corpo', damage: '1d6', damageType: 'concussão', weight: 2, cost: '5 po', properties: [] },
    { name: 'Machadinha', category: 'Simples', type: 'Corpo-a-corpo', damage: '1d6', damageType: 'cortante', weight: 1, cost: '5 po', properties: ['Leve', 'Arremesso (6/18m)'] },
    { name: 'Martelo Leve', category: 'Simples', type: 'Corpo-a-corpo', damage: '1d4', damageType: 'concussão', weight: 1, cost: '2 po', properties: ['Leve', 'Arremesso (6/18m)'] },
    // Simples à Distância
    { name: 'Arco Curto', category: 'Simples', type: 'À distância', damage: '1d6', damageType: 'perfurante', weight: 1, cost: '25 po', properties: ['Munição (24/96m)', 'Duas mãos'] },
    { name: 'Besta Leve', category: 'Simples', type: 'À distância', damage: '1d8', damageType: 'perfurante', weight: 2.5, cost: '25 po', properties: ['Munição (24/96m)', 'Recarga', 'Duas mãos'] },
    { name: 'Dardo', category: 'Simples', type: 'À distância', damage: '1d4', damageType: 'perfurante', weight: 0.1, cost: '5 pc', properties: ['Acuidade', 'Arremesso (6/18m)'] },
    { name: 'Funda', category: 'Simples', type: 'À distância', damage: '1d4', damageType: 'concussão', weight: 0, cost: '1 pp', properties: ['Munição (9/36m)'] },
    // Marciais Corpo-a-Corpo
    { name: 'Alabarda', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d10', damageType: 'cortante', weight: 3, cost: '20 po', properties: ['Pesada', 'Alcance', 'Duas mãos'] },
    { name: 'Cimitarra', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d6', damageType: 'cortante', weight: 1.5, cost: '25 po', properties: ['Acuidade', 'Leve'] },
    { name: 'Chicote', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d4', damageType: 'cortante', weight: 1.5, cost: '2 po', properties: ['Acuidade', 'Alcance'] },
    { name: 'Espada Curta', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d6', damageType: 'perfurante', weight: 1, cost: '10 po', properties: ['Acuidade', 'Leve'] },
    { name: 'Espada Grande', category: 'Marcial', type: 'Corpo-a-corpo', damage: '2d6', damageType: 'cortante', weight: 3, cost: '50 po', properties: ['Pesada', 'Duas mãos'] },
    { name: 'Espada Longa', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d8', damageType: 'cortante', weight: 1.5, cost: '15 po', properties: ['Versátil (1d10)'] },
    { name: 'Glaive', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d10', damageType: 'cortante', weight: 3, cost: '20 po', properties: ['Pesada', 'Alcance', 'Duas mãos'] },
    { name: 'Lança Longa', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d10', damageType: 'perfurante', weight: 4, cost: '5 po', properties: ['Pesada', 'Alcance', 'Duas mãos'] },
    { name: 'Machado de Batalha', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d8', damageType: 'cortante', weight: 2, cost: '10 po', properties: ['Versátil (1d10)'] },
    { name: 'Machado Grande', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d12', damageType: 'cortante', weight: 3.5, cost: '30 po', properties: ['Pesada', 'Duas mãos'] },
    { name: 'Malho', category: 'Marcial', type: 'Corpo-a-corpo', damage: '2d6', damageType: 'concussão', weight: 5, cost: '10 po', properties: ['Pesada', 'Duas mãos'] },
    { name: 'Mangual', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d8', damageType: 'concussão', weight: 1, cost: '10 po', properties: [] },
    { name: 'Martelo de Guerra', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d8', damageType: 'concussão', weight: 1, cost: '15 po', properties: ['Versátil (1d10)'] },
    { name: 'Rapieira', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d8', damageType: 'perfurante', weight: 1, cost: '25 po', properties: ['Acuidade'] },
    { name: 'Tridente', category: 'Marcial', type: 'Corpo-a-corpo', damage: '1d6', damageType: 'perfurante', weight: 2, cost: '5 po', properties: ['Arremesso (6/18m)', 'Versátil (1d8)'] },
    // Marciais à Distância
    { name: 'Arco Longo', category: 'Marcial', type: 'À distância', damage: '1d8', damageType: 'perfurante', weight: 1, cost: '50 po', properties: ['Munição (45/180m)', 'Pesada', 'Duas mãos'] },
    { name: 'Besta de Mão', category: 'Marcial', type: 'À distância', damage: '1d6', damageType: 'perfurante', weight: 1.5, cost: '75 po', properties: ['Munição (9/36m)', 'Leve', 'Recarga'] },
    { name: 'Besta Pesada', category: 'Marcial', type: 'À distância', damage: '1d10', damageType: 'perfurante', weight: 4.5, cost: '50 po', properties: ['Munição (30/120m)', 'Pesada', 'Recarga', 'Duas mãos'] }
  ],

  // ------------------------------------------------------------------------
  // CONDIÇÕES & EXAUSTÃO (APÊNDICE A)
  // ------------------------------------------------------------------------
  conditions: [
    { id: 'agarrado', name: 'Agarrado', desc: 'Deslocamento se torna 0 e não se beneficia de bônus de movimento. Encerra se o agarrador for incapacitado.' },
    { id: 'amedrontado', name: 'Amedrontado', desc: 'Desvantagem em testes e ataques enquanto a fonte do medo estiver visível. Não pode se mover voluntariamente em direção à fonte.' },
    { id: 'atordoado', name: 'Atordoado', desc: 'Incapacitado, não pode se mover e fala com dificuldade. Falha automática em salvaguardas de For e Des. Ataques contra têm vantagem.' },
    { id: 'caido', name: 'Caído (Prone)', desc: 'Só pode rastejar (custa dobro de movimento) ou gastar metade do deslocamento para se levantar. Ataques do caído têm desvantagem. Ataques a 1,5m contra ele têm vantagem; à distância têm desvantagem.' },
    { id: 'cego', name: 'Cego', desc: 'Falha automática em testes que exigem visão. Ataques contra têm vantagem e os ataques do cego têm desvantagem.' },
    { id: 'enfeiticado', name: 'Enfeitiçado', desc: 'Não pode atacar nem alvejar quem o enfeitiçou com efeitos nocivos. Quem enfeitiçou tem vantagem em testes sociais.' },
    { id: 'envenenado', name: 'Envenenado', desc: 'Desvantagem em jogadas de ataque e testes de habilidade.' },
    { id: 'impedido', name: 'Impedido', desc: 'Deslocamento se torna 0. Ataques contra têm vantagem e seus ataques têm desvantagem. Desvantagem em salvaguardas de Destreza.' },
    { id: 'incapacitado', name: 'Incapacitado', desc: 'Não pode realizar nenhuma ação ou reação.' },
    { id: 'inconsciente', name: 'Inconsciente', desc: 'Incapacitado, cai no chão e solta itens. Falha automática em testes de For e Des. Ataques contra têm vantagem e a até 1,5m são críticos automáticos.' },
    { id: 'invisivel', name: 'Invisível', desc: 'Impossível de ver sem magia. Ataques contra têm desvantagem e seus ataques têm vantagem.' },
    { id: 'paralisado', name: 'Paralisado', desc: 'Incapacitado e não pode se mover nem falar. Falha automática em For e Des. Ataques a até 1,5m são acertos críticos automáticos.' },
    { id: 'petrificado', name: 'Petrificado', desc: 'Transformado em pedra (peso x10). Incapacitado, imune a veneno/doença e resistente a todos os danos.' },
    { id: 'surdo', name: 'Surdo', desc: 'Falha automática em testes que exijam audição.' }
  ],

  exhaustionLevels: [
    { level: 0, effect: 'Normal (Nenhum efeito adverso)' },
    { level: 1, effect: 'Desvantagem em testes de habilidade' },
    { level: 2, effect: 'Deslocamento reduzido à metade' },
    { level: 3, effect: 'Desvantagem em jogadas de ataque e testes de resistência' },
    { level: 4, effect: 'Máximo de pontos de vida reduzido à metade' },
    { level: 5, effect: 'Deslocamento reduzido a 0' },
    { level: 6, effect: 'Morte imediata' }
  ],

  // ------------------------------------------------------------------------
  // GRIMÓRIO SELECIONADO DE MAGIAS DO LIVRO (CAPÍTULO 11)
  // ------------------------------------------------------------------------
  spells: [
    // Truques (0)
    { id: 'rajada_mistica', name: 'Rajada Mística', level: 0, school: 'Evocação', time: '1 ação', range: '36 metros', comp: 'V, S', duration: 'Instantânea', classes: ['bruxo'], desc: 'Feixe de energia crepitante causa 1d10 de energia (+1 feixe nos níveis 5, 11 e 17).' },
    { id: 'raio_de_fogo', name: 'Raio de Fogo', level: 0, school: 'Evocação', time: '1 ação', range: '36 metros', comp: 'V, S', duration: 'Instantânea', classes: ['mago', 'feiticeiro'], desc: 'Ataque à distância com magia causa 1d10 de fogo em criatura ou incendeia objeto.' },
    { id: 'raio_de_gelo', name: 'Raio de Gelo', level: 0, school: 'Evocação', time: '1 ação', range: '18 metros', comp: 'V, S', duration: 'Instantânea', classes: ['mago', 'feiticeiro'], desc: 'Raio gélido causa 1d8 de frio e reduz o deslocamento do alvo em 3 metros.' },
    { id: 'toque_chocante', name: 'Toque Chocante', level: 0, school: 'Evocação', time: '1 ação', range: 'Toque', comp: 'V, S', duration: 'Instantânea', classes: ['mago', 'feiticeiro'], desc: '1d8 de dano elétrico, vantagem contra armadura de metal e impede reações do alvo.' },
    { id: 'chama_sagrada', name: 'Chama Sagrada', level: 0, school: 'Evocação', time: '1 ação', range: '18 metros', comp: 'V, S', duration: 'Instantânea', classes: ['clerigo'], desc: 'Chama radiante desce sobre o alvo causando 1d8 radiante (salvaguarda de Des sem benefício de cobertura).' },
    { id: 'prestidigitacao', name: 'Prestidigitação', level: 0, school: 'Transmutação', time: '1 ação', range: '3 metros', comp: 'V, S', duration: 'Até 1 hora', classes: ['bardo', 'bruxo', 'feiticeiro', 'mago'], desc: 'Pequenos truques sensoriais: acender velas, limpar objetos, pequenos odores ou chamas.' },
    { id: 'maos_magicas', name: 'Mãos Mágicas', level: 0, school: 'Conjuração', time: '1 ação', range: '9 metros', comp: 'V, S', duration: '1 minuto', classes: ['bardo', 'bruxo', 'feiticeiro', 'mago'], desc: 'Mão espectral flutuante manipula objetos, abre portas ou derrama frascos até 5 kg.' },
    { id: 'ilusa_menor', name: 'Ilusão Menor', level: 0, school: 'Ilusão', time: '1 ação', range: '9 metros', comp: 'S, M', duration: '1 minuto', classes: ['bardo', 'bruxo', 'feiticeiro', 'mago'], desc: 'Cria som ou imagem estática em um cubo de 1,5 metro.' },
    { id: 'orientacao', name: 'Orientação', level: 0, school: 'Adivinhação', time: '1 ação', range: 'Toque', comp: 'V, S', duration: 'Concentração, até 1 min', classes: ['clerigo', 'druida'], desc: 'Alvo tocado pode rolar +1d4 em um teste de habilidade.' },
    { id: 'zombaria_viciosa', name: 'Zombaria Viciosa', level: 0, school: 'Encantamento', time: '1 ação', range: '18 metros', comp: 'V', duration: 'Instantânea', classes: ['bardo'], desc: 'Insulto sutil causa 1d4 psíquico e desvantagem no próximo ataque do alvo em caso de falha em Sab.' },
    { id: 'taumaturgia', name: 'Taumaturgia', level: 0, school: 'Transmutação', time: '1 ação', range: '9 metros', comp: 'V', duration: 'Até 1 minuto', classes: ['clerigo'], desc: 'Manifesta pequenas maravilhas: voz 3x mais alta, tremores leves, olhos modificados.' },
    { id: 'druidismo', name: 'Druidismo', level: 0, school: 'Transmutação', time: '1 ação', range: '9 metros', comp: 'V, S', duration: 'Instantânea', classes: ['druida'], desc: 'Sussurros naturais preveem o clima por 24h, florescem sementes ou criam brisas.' },

    // Nível 1
    { id: 'misseis_magicos', name: 'Mísseis Mágicos', level: 1, school: 'Evocação', time: '1 ação', range: '36 metros', comp: 'V, S', duration: 'Instantânea', classes: ['mago', 'feiticeiro'], desc: 'Dispara 3 dardos luminosos infalíveis causando 1d4 + 1 de dano de energia cada (+1 dardo por nível acima).' },
    { id: 'curar_ferimentos', name: 'Curar Ferimentos', level: 1, school: 'Evocação', time: '1 ação', range: 'Toque', comp: 'V, S', duration: 'Instantânea', classes: ['bardo', 'clerigo', 'druida', 'paladino', 'patrulheiro'], desc: 'Criatura tocada recupera 1d8 + mod. conjuração de PV (+1d8 por nível superior).' },
    { id: 'palavra_curativa', name: 'Palavra Curativa', level: 1, school: 'Evocação', time: '1 ação bônus', range: '18 metros', comp: 'V', duration: 'Instantânea', classes: ['bardo', 'clerigo', 'druida'], desc: 'Restaura 1d4 + mod. de conjuração em pontos de vida à distância como ação bônus.' },
    { id: 'escudo_arcano', name: 'Escudo Arcano (Shield)', level: 1, school: 'Abjuração', time: '1 reação', range: 'Pessoal', comp: 'V, S', duration: '1 rodada', classes: ['mago', 'feiticeiro'], desc: '+5 de bônus na CA até o início do seu próximo turno e imunidade total a Mísseis Mágicos.' },
    { id: 'armadura_arcana', name: 'Armadura Arcana', level: 1, school: 'Abjuração', time: '1 ação', range: 'Toque', comp: 'V, S, M', duration: '8 horas', classes: ['mago', 'feiticeiro'], desc: 'A CA básica do alvo voluntário desarmadurado passa a ser 13 + modificador de Destreza.' },
    { id: 'bencao', name: 'Bênção', level: 1, school: 'Encantamento', time: '1 ação', range: '9 metros', comp: 'V, S, M', duration: 'Concentração, até 1 min', classes: ['clerigo', 'paladino'], desc: 'Até três aliados somam 1d4 em jogadas de ataque e testes de resistência.' },
    { id: 'onda_trovejante', name: 'Onda Trovejante', level: 1, school: 'Evocação', time: '1 ação', range: 'Pessoal (cubo 4,5m)', comp: 'V, S', duration: 'Instantânea', classes: ['bardo', 'druida', 'feiticeiro', 'mago'], desc: '2d8 de dano trovejante em área e empurra criaturas 3 metros para longe.' },
    { id: 'fogo_das_fadas', name: 'Fogo das Fadas', level: 1, school: 'Evocação', time: '1 ação', range: '18 metros', comp: 'V', duration: 'Concentração, até 1 min', classes: ['bardo', 'druida'], desc: 'Delineia criaturas em cubo de 6m; concede vantagem em ataques contra os alvos iluminados.' },
    { id: 'marca_do_cacador', name: 'Marca do Caçador', level: 1, school: 'Adivinhação', time: '1 ação bônus', range: '27 metros', comp: 'V', duration: 'Concentração, até 1 hora', classes: ['patrulheiro'], desc: 'Marca presa misticamente causando +1d6 de dano a cada ataque que acertar.' },
    { id: 'bruxaria', name: 'Bruxaria (Hex)', level: 1, school: 'Encantamento', time: '1 ação bônus', range: '18 metros', comp: 'V, S, M', duration: 'Concentração, até 1 hora', classes: ['bruxo'], desc: 'Amaldiçoa oponente para sofrer +1d6 de dano necrótico e ter desvantagem em testes de uma habilidade.' },

    // Nível 2
    { id: 'passo_nebuloso', name: 'Passo Nebuloso', level: 2, school: 'Conjuração', time: '1 ação bônus', range: 'Pessoal', comp: 'V', duration: 'Instantânea', classes: ['bruxo', 'feiticeiro', 'mago'], desc: 'Teletransporta-se instantaneamente até 9 metros para um local visível.' },
    { id: 'invisibilidade', name: 'Invisibilidade', level: 2, school: 'Ilusão', time: '1 ação', range: 'Toque', comp: 'V, S, M', duration: 'Concentração, até 1 hora', classes: ['bardo', 'bruxo', 'feiticeiro', 'mago'], desc: 'Alvo e seus pertences tornam-se invisíveis até que ele ataque ou conjure uma magia.' },
    { id: 'arma_espiritual', name: 'Arma Espiritual', level: 2, school: 'Evocação', time: '1 ação bônus', range: '18 metros', comp: 'V, S', duration: '1 minuto', classes: ['clerigo'], desc: 'Arma espectral flutuante ataca com ação bônus causando 1d8 + Sabedoria de dano de energia.' },
    { id: 'imobilizar_pessoa', name: 'Imobilizar Pessoa', level: 2, school: 'Encantamento', time: '1 ação', range: '18 metros', comp: 'V, S, M', duration: 'Concentração, até 1 min', classes: ['bardo', 'clerigo', 'druida', 'feiticeiro', 'mago'], desc: 'Humanoide falha em salvaguarda de Sabedoria ou fica paralisado.' },
    { id: 'esquentar_metal', name: 'Esquentar Metal', level: 2, school: 'Transmutação', time: '1 ação', range: '18 metros', comp: 'V, S, M', duration: 'Concentração, até 1 min', classes: ['bardo', 'druida'], desc: 'Objeto de metal brilha em brasa causando 2d8 de fogo; ação bônus repete dano a cada turno.' },

    // Nível 3
    { id: 'bola_de_fogo', name: 'Bola de Fogo', level: 3, school: 'Evocação', time: '1 ação', range: '45 metros', comp: 'V, S, M', duration: 'Instantânea', classes: ['feiticeiro', 'mago'], desc: 'Explosão em esfera de 6m de raio causa 8d6 de fogo (metade em sucesso de Des).' },
    { id: 'relampago', name: 'Relâmpago', level: 3, school: 'Evocação', time: '1 ação', range: 'Pessoal (linha 30m)', comp: 'V, S, M', duration: 'Instantânea', classes: ['feiticeiro', 'mago'], desc: 'Linha de 30m de eletricidade causa 8d6 de dano elétrico.' },
    { id: 'contramagica', name: 'Contramágica', level: 3, school: 'Abjuração', time: '1 reação', range: '18 metros', comp: 'S', duration: 'Instantânea', classes: ['feiticeiro', 'bruxo', 'mago'], desc: 'Interrompe conjuração de magia inimiga de até 3º nível (teste para níveis superiores).' },
    { id: 'dissipar_magia', name: 'Dissipar Magia', level: 3, school: 'Abjuração', time: '1 ação', range: '36 metros', comp: 'V, S', duration: 'Instantânea', classes: ['bardo', 'clerigo', 'druida', 'paladino', 'feiticeiro', 'bruxo', 'mago'], desc: 'Encerra qualquer efeito mágico de até 3º nível num alvo ou local.' },
    { id: 'espiritos_guardioes', name: 'Espíritos Guardiões', level: 3, school: 'Conjuração', time: '1 ação', range: 'Pessoal (raio 4,5m)', comp: 'V, S, M', duration: 'Concentração, até 10 min', classes: ['clerigo'], desc: 'Espíritos sagrados reduzem deslocamento inimigo e causam 3d8 radiante/necrótico na área.' },
    { id: 'velocidade', name: 'Velocidade (Haste)', level: 3, school: 'Transmutação', time: '1 ação', range: '18 metros', comp: 'V, S, M', duration: 'Concentração, até 1 min', classes: ['feiticeiro', 'mago'], desc: 'Dobra velocidade do alvo, +2 CA, vantagem em Des e 1 ação extra por turno.' },
    { id: 'revivificar', name: 'Revivificar', level: 3, school: 'Necromancia', time: '1 ação', range: 'Toque', comp: 'V, S, M (300 po)', duration: 'Instantânea', classes: ['clerigo', 'paladino'], desc: 'Traz criatura morta no último minuto de volta à vida com 1 ponto de vida.' }
  ]
};

// Expõe em window para consumo por scripts ES module (ex: dm.js), que não
// enxergam top-level const de scripts clássicos por escopo léxico direto.
window.DND_DATA = DND_DATA;
