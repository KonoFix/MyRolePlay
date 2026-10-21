# 🎲 D&D 5ª Edição - Ficha de Jogador Interativa Oficial

Uma aplicação web moderna, imersiva e completa criada com base em todos os dados do **Livro do Jogador (Player's Handbook) de D&D 5e** (versão traduzida em português pela *Biblioteca Élfica*).

Projetada para substituir 100% o papel nas mesas presenciais e online, funcionando direto no navegador com **zero dependências**, salvamento automático e suporte para celulares, tablets e computadores.

---

## 🌟 Principais Recursos

### 1. Dados e Regras 100% Fiéis ao Livro do Jogador
* **9 Raças & Todas as Sub-raças**: Anão (Colina/Montanha), Elfo (Alto Elfo/Floresta/Drow), Halfling (Pés-Leves/Robusto), Humano (Padrão/Variante), Draconato (10 ancestrais dracônicos), Gnomo (Floresta/Rochas), Meio-Elfo, Meio-Orc e Tiefling.
* **12 Classes Oficiais & Subclasses**: Bárbaro, Bardo, Bruxo, Clérigo, Druida, Feiticeiro, Guerreiro, Ladino, Mago, Monge, Paladino e Patrulheiro com progressão até o nível 20.
* **13 Antecedentes Completos**: Acólito, Artesão de Guilda, Artista, Charlatão, Criminoso, Eremita, Forasteiro, Herói do Povo, Marinheiro, Nobre, Órfão, Sábio e Soldado.
* **Cálculo Automático da CA**: Reconhece armaduras leves, médias (com teto de +2 em Destreza), pesadas (sem Destreza), escudos (+2) e *Defesa sem Armadura* de Bárbaro (10 + Des + Con) ou Monge (10 + Des + Sab).
* **Capacidade de Carga em Kg**: Limites de carga (Força × 7,5 kg) e erguer/arrastar (Força × 15 kg) com alerta visual de sobrecarga.
* **18 Perícias Oficiais**: Suporte a 3 níveis (Normal, Proficiente e Especialização/Dobro de Proficiência do Ladino e Bardo).

### 2. Jogabilidade ao Vivo na Mesa (Live RPG)
* **Rolagens com 1 Clique**: Clique em qualquer modificador de atributo, salvaguarda, perícia ou arma para rolar no d20 somando os bônus instantaneamente.
* **Rolador de Dados Flutuante**: Rolagens de d4, d6, d8, d10, d12, d20, d100 e fórmulas livres (ex: `2d6+3`).
* **Suporte a Vantagem & Desvantagem**: Rola 2 dados e seleciona o maior ou menor automaticamente, destacando 20 Natural (Crítico) e 1 Natural (Falha).
* **Controle de Pontos de Vida**: Barra dinâmica de saúde com cores (verde, amarelo, vermelho), PV Atual, Máximo e Temporário, com botões rápidos (+1, -1, +5, -5).
* **Testes Contra a Morte**: Marcadores de 3 sucessos e 3 fracassos com rolagem integrada (20 cura 1 PV, 1 adiciona 2 falhas).
* **Descansos Rápidos**:
  * *Descanso Curto (1h)*: Rola Dados de Vida para curar ferimentos e recarrega recursos de descanso curto (Magias de Bruxo, Chi, Fôlego, etc.).
  * *Descanso Longo (8h)*: Restaura PV total, recupera metade dos Dados de Vida, recarrega todos os slots de magia e reduz 1 nível de exaustão.
* **Condições & Exaustão**: Toggles para as 14 condições oficiais (Cego, Enfeitiçado, Envenenado, etc.) e níveis de 1 a 6 de exaustão com os efeitos descritos.

### 3. Grimório de Magias Completo
* Gestão de Círculos do 0 (Truques) ao 9º nível com pips clicáveis para gastar e recuperar espaços de magia.
* Compêndio com busca por nome, filtro por círculo (1º ao 3º+) e escola de magia, permitindo adicionar qualquer feitiço com 1 clique.
* Cálculo automático de Habilidade Chave, CD de Resistência (8 + Prof + Mod) e Bônus de Ataque Mágico.

### 4. Assistente de Criação Passo a Passo (Wizard)
* Guiado pelas regras do Capítulo 1 do Livro do Jogador:
  1. Escolha de Raça e Sub-raça (com aplicação automática de bônus raciais).
  2. Escolha de Classe (com proficiências e dados de vida).
  3. Determinação de Atributos: escolha entre **Valores Padrão** (15, 14, 13, 12, 10, 8), **Compra de 27 Pontos** (*Point Buy*) com contador dinâmico ou **Rolar 4d6 (descarta o menor)**.
  4. Antecedente e perícias iniciais.
  5. Finalização e cálculo dos PVs iniciais.

### 5. Personalização e Utilidades
* **Alternância de Tema**: Modo *Dark Fantasy Moderno* e modo *Pergaminho / Fundo Claro* (fiel à versão de fundo branco do livro).
* **Multi-Personagens**: Crie e mantenha múltiplos aventureiros salvos no mesmo navegador.
* **Salva Automático no Navegador** via `localStorage`.
* **Exportar / Importar JSON**: Faça backup de fichas ou compartilhe com outros jogadores.
* **Pronto para Impressão**: Layout estilizado para imprimir ou salvar em PDF (`Ctrl+P` / `Cmd+P`).

---

## 🚀 Como Executar

Basta abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Safari, Firefox, Edge).
Nenhuma instalação de servidor ou pacote é necessária!
