const reactionFormulas = [
    {
        reactants: ['Na', 'Cl'].sort(),
        products: [{ id: 'NaCl', count: 1 }],
        equation: '2Na + Cl₂ → 2NaCl'
    },
    {
        reactants: ['H2O', 'Na'].sort(),
        products: [{ id: 'NaOH', count: 1 }, { id: 'H2', count: 1 }],
        equation: '2Na + 2H₂O → 2NaOH + H₂↑',
        config: { exothermic: true, force: 0.01 }
    },
    {
        reactants: ['H', 'Cl'].sort(),
        products: [{ id: 'HCl', count: 1 }],
        equation: 'H₂ + Cl₂ → 2HCl'
    },
    {
        reactants: ['HCl', 'NaOH'].sort(),
        products: [{ id: 'NaCl', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'HCl + NaOH → NaCl + H₂O',
        config: { exothermic: true, force: 0.005 } // 중화 반응은 발열 반응
    },
    {
        reactants: ['AgNO3', 'HCl'].sort(),
        products: [{ id: 'AgCl', count: 1 }, { id: 'HNO3', count: 1 }],
        equation: 'AgNO₃ + HCl → AgCl(s)↓ + HNO₃ (침전)',
        config: { note: '흰색 앙금 생성' }
    },
    {
        reactants: ['CH4', 'O2'].sort(),
        products: [{ id: 'CO2', count: 1 }, { id: 'H2O', count: 2 }],
        equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O (연소)',
        config: { exothermic: true, force: 0.015 }
    },
    {
        reactants: ['H', 'O'].sort(),
        products: [{ id: 'H2O', count: 1 }],
        equation: '2H₂ + O₂ → 2H₂O (폭발)',
        config: { exothermic: true, force: 0.02 }
    },
    {
        reactants: ['Zn', 'HCl'].sort(),
        products: [{ id: 'ZnCl2', count: 1 }, { id: 'H2', count: 1 }],
        equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
        config: { exothermic: true, force: 0.002 }
    },
    {
        reactants: ['N', 'H'].sort(),
        products: [{ id: 'NH3', count: 1 }],
        equation: 'N₂ + 3H₂ → 2NH₃ (하버-보슈법)',
        config: { exothermic: true, force: 0.001 }
    },
    {
        type: 'decomposition',
        reactant: 'CaCO3',
        products: [{ id: 'CaO', count: 1 }, { id: 'CO2', count: 1 }],
        equation: 'CaCO₃(s) → CaO(s) + CO₂(g) (열분해)',
        config: { minTemp: 1100 } // 827°C (1100K) 이상에서 분해 시작
    },
    {
        reactants: ['Cu', 'O2'].sort(),
        products: [{ id: 'CuO', count: 2 }],
        equation: '2Cu + O₂ → 2CuO',
        config: { minTemp: 573 } // 구리의 산화는 고온에서 가속 (300°C)
    },
    {
        type: 'decomposition',
        reactant: 'H2O2',
        products: [{ id: 'H2O', count: 2 }, { id: 'O2', count: 1 }],
        equation: '2H₂O₂ → 2H₂O + O₂↑',
        config: { note: '과산화수소 분해. 촉매(MnO₂) 존재 시 가속.' }
    },
    {
        reactants: ['C', 'O2'].sort(),
        products: [{ id: 'CO2', count: 1 }],
        equation: 'C + O₂ → CO₂',
        config: { minTemp: 1000, exothermic: true, force: 0.01 } // 탄소 연소 (약 700°C 이상)
    },
    {
        reactants: ['Fe', 'S'].sort(),
        products: [{ id: 'FeS', count: 1 }],
        equation: 'Fe + S → FeS',
        config: { minTemp: 423, exothermic: true, force: 0.008 } // 철과 황의 반응 (약 150°C 이상)
    },
    {
        type: 'decomposition',
        reactant: 'KMnO4',
        products: [{ id: 'K2MnO4', count: 1 }, { id: 'MnO2', count: 1 }, { id: 'O2', count: 1 }],
        equation: '2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑',
        config: { minTemp: 513 } // 과망가니즈산 칼륨 열분해 (240°C)
    },
    {
        reactants: ['Pb(NO3)2', 'KI'].sort(),
        products: [{ id: 'PbI2', count: 1 }, { id: 'KNO3', count: 2 }],
        equation: 'Pb(NO₃)₂ + 2KI → PbI₂(s)↓ + 2KNO₃',
        config: { note: '노란색 앙금 생성' }
    },
    {
        reactants: ['CuSO4', 'Zn'].sort(),
        products: [{ id: 'ZnSO4', count: 1 }, { id: 'Cu', count: 1 }],
        equation: 'CuSO₄ + Zn → ZnSO₄ + Cu',
        config: { note: '아연 판에 구리가 석출' }
    },
    {
        reactants: ['Mg', 'O2'].sort(),
        products: [{ id: 'MgO', count: 2 }],
        equation: '2Mg + O₂ → 2MgO',
        config: { minTemp: 873, exothermic: true, force: 0.02, note: '밝은 빛을 내며 연소' } // 마그네슘 연소 (약 600°C)
    },
    {
        reactants: ['Na2CO3', 'CaCl2'].sort(),
        products: [{ id: 'CaCO3', count: 1 }, { id: 'NaCl', count: 2 }],
        equation: 'Na₂CO₃ + CaCl₂ → CaCO₃(s)↓ + 2NaCl',
        config: { note: '흰색 앙금 생성 (탄산칼슘)' }
    },
    {
        reactants: ['CO2', 'H2O'].sort(),
        products: [{ id: 'C6H12O6', count: 1 }, { id: 'O2', count: 6 }],
        equation: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
        config: { note: '광합성 (빛 에너지 필요)', requires: 'light' }
    },
    {
        reactants: ['H2', 'I2'].sort(),
        products: [{ id: 'HI', count: 2 }],
        equation: 'H₂ + I₂ → 2HI'
    },
    {
        reactants: ['K', 'Cl2'].sort(),
        products: [{ id: 'KCl', count: 2 }],
        equation: '2K + Cl₂ → 2KCl'
    },
    {
        reactants: ['Al', 'O2'].sort(),
        products: [{ id: 'Al2O3', count: 2 }],
        equation: '4Al + 3O₂ → 2Al₂O₃',
        config: { exothermic: true, force: 0.01 }
    },
    {
        reactants: ['P4', 'O2'].sort(),
        products: [{ id: 'P4O10', count: 1 }],
        equation: 'P₄ + 5O₂ → P₄O₁₀',
        config: { exothermic: true, force: 0.015 }
    },
    {
        reactants: ['SO2', 'O2'].sort(),
        products: [{ id: 'SO3', count: 2 }],
        equation: '2SO₂ + O₂ → 2SO₃',
        config: { note: '접촉법, V₂O₅ 촉매 필요' }
    },
    {
        reactants: ['NO', 'O2'].sort(),
        products: [{ id: 'NO2', count: 2 }],
        equation: '2NO + O₂ → 2NO₂'
    },
    {
        reactants: ['Fe', 'O2'].sort(),
        products: [{ id: 'Fe2O3', count: 2 }],
        equation: '4Fe + 3O₂ → 2Fe₂O₃ (녹슨 철)',
        config: { note: '느린 산화 반응' }
    },
    {
        type: 'decomposition',
        reactant: 'H2O',
        products: [{ id: 'H2', count: 2 }, { id: 'O2', count: 1 }],
        equation: '2H₂O → 2H₂ + O₂ (전기분해)',
        config: { requires: 'electricity' }
    },
    {
        type: 'decomposition',
        reactant: 'NH4Cl',
        products: [{ id: 'NH3', count: 1 }, { id: 'HCl', count: 1 }],
        equation: 'NH₄Cl → NH₃ + HCl'
    },
    {
        type: 'decomposition',
        reactant: 'N2O4',
        products: [{ id: 'NO2', count: 2 }],
        equation: 'N₂O₄ ⇌ 2NO₂'
    },
    {
        type: 'decomposition',
        reactant: 'NaHCO3',
        products: [{ id: 'Na2CO3', count: 1 }, { id: 'H2O', count: 1 }, { id: 'CO2', count: 1 }],
        equation: '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂'
    },
    {
        reactants: ['Cl2', 'KBr'].sort(),
        products: [{ id: 'KCl', count: 2 }, { id: 'Br2', count: 1 }],
        equation: 'Cl₂ + 2KBr → 2KCl + Br₂'
    },
    {
        reactants: ['Zn', 'CuSO4'].sort(),
        products: [{ id: 'ZnSO4', count: 1 }, { id: 'Cu', count: 1 }],
        equation: 'Zn + CuSO₄ → ZnSO₄ + Cu'
    },
    {
        reactants: ['Br2', 'KI'].sort(),
        products: [{ id: 'KBr', count: 2 }, { id: 'I2', count: 1 }],
        equation: 'Br₂ + 2KI → 2KBr + I₂'
    },
    {
        reactants: ['H2SO4', 'NaOH'].sort(),
        products: [{ id: 'Na2SO4', count: 1 }, { id: 'H2O', count: 2 }],
        equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
        config: { exothermic: true, force: 0.006 }
    },
    {
        reactants: ['HNO3', 'KOH'].sort(),
        products: [{ id: 'KNO3', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'HNO₃ + KOH → KNO₃ + H₂O',
        config: { exothermic: true, force: 0.005 }
    },
    {
        reactants: ['BaCl2', 'Na2SO4'].sort(),
        products: [{ id: 'BaSO4', count: 1 }, { id: 'NaCl', count: 2 }],
        equation: 'BaCl₂ + Na₂SO₄ → BaSO₄(s)↓ + 2NaCl',
        config: { note: '흰색 앙금 생성 (황산바륨)' }
    },
    {
        reactants: ['C2H5OH', 'O2'].sort(),
        products: [{ id: 'CO2', count: 2 }, { id: 'H2O', count: 3 }],
        equation: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O',
        config: { exothermic: true, force: 0.018 }
    },
    {
        reactants: ['C3H8', 'O2'].sort(),
        products: [{ id: 'CO2', count: 3 }, { id: 'H2O', count: 4 }],
        equation: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
        config: { exothermic: true, force: 0.02 }
    },
    {
        reactants: ['C6H12O6', 'O2'].sort(),
        products: [{ id: 'CO2', count: 6 }, { id: 'H2O', count: 6 }],
        equation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O',
        config: { note: '세포 호흡', exothermic: true, force: 0.01 }
    },
    {
        reactants: ['H2O2', 'KI'].sort(),
        products: [{ id: 'H2O', count: 2 }, { id: 'I2', count: 1 }, {id: 'KOH', count: 2}],
        equation: 'H₂O₂ + 2KI → 2H₂O + I₂ + 2K⁺',
        config: { note: '요오드-녹말 반응 확인에 사용' }
    },
    {
        reactants: ['MnO4-', 'Fe2+'].sort(),
        products: [{ id: 'Mn2+', count: 1 }, { id: 'Fe3+', count: 5 }],
        equation: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O',
        config: { note: '과망가니즈산 적정' }
    },
    {
        reactants: ['Cr2O7^2-', 'C2H5OH'].sort(),
        products: [{ id: 'Cr3+', count: 2 }, { id: 'CH3COOH', count: 3 }],
        equation: '2Cr₂O₇²⁻ + 3C₂H₅OH + 16H⁺ → 4Cr³⁺ + 3CH₃COOH + 11H₂O',
        config: { note: '음주 측정기 원리' }
    },
    {
        reactants: ['Ca(OH)2', 'CO2'].sort(),
        products: [{ id: 'CaCO3', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'Ca(OH)₂ + CO₂ → CaCO₃(s)↓ + H₂O',
        config: { note: '석회수가 뿌옇게 흐려짐' }
    },
    {
        reactants: ['NH3', 'HCl'].sort(),
        products: [{ id: 'NH4Cl', count: 1 }],
        equation: 'NH₃ + HCl → NH₄Cl(s)',
        config: { note: '흰색 고체 생성' }
    },
    {
        reactants: ['SiO2', 'HF'].sort(),
        products: [{ id: 'SiF4', count: 1 }, { id: 'H2O', count: 2 }],
        equation: 'SiO₂ + 4HF → SiF₄(g) + 2H₂O',
        config: { note: '유리 부식' }
    },
    {
        reactants: ['FeCl3', 'KSCN'].sort(),
        products: [{ id: '[Fe(SCN)]2+', count: 1 }, {id: 'KCl', count: 3}],
        equation: 'FeCl₃ + KSCN → [Fe(SCN)]²⁺ + 3KCl + 2Cl⁻',
        config: { note: '붉은색 착이온 생성' }
    },
    {
        type: 'decomposition',
        reactant: 'Ca(HCO3)2',
        products: [{ id: 'CaCO3', count: 1 }, { id: 'H2O', count: 1 }, { id: 'CO2', count: 1 }],
        equation: 'Ca(HCO₃)₂ → CaCO₃ + H₂O + CO₂',
        config: { note: '종유석/석순 생성 원리' }
    },
    {
        reactants: ['CH3COOH', 'NaHCO3'].sort(),
        products: [{ id: 'CH3COONa', count: 1 }, { id: 'H2O', count: 1 }, { id: 'CO2', count: 1 }],
        equation: 'CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂(g)',
        config: { note: '식초와 베이킹소다 반응' }
    },
    {
        reactants: ['Li', 'H2O'].sort(),
        products: [{ id: 'LiOH', count: 2 }, { id: 'H2', count: 1 }],
        equation: '2Li + 2H₂O → 2LiOH + H₂↑',
        config: { exothermic: true, force: 0.008 }
    },
    {
        reactants: ['K', 'H2O'].sort(),
        products: [{ id: 'KOH', count: 2 }, { id: 'H2', count: 1 }],
        equation: '2K + 2H₂O → 2KOH + H₂↑',
        config: { exothermic: true, force: 0.012 }
    },
    {
        reactants: ['Ca', 'H2O'].sort(),
        products: [{ id: 'Ca(OH)2', count: 1 }, { id: 'H2', count: 1 }],
        equation: 'Ca + 2H₂O → Ca(OH)₂ + H₂↑',
        config: { exothermic: true, force: 0.005 }
    },
    {
        reactants: ['Ba', 'H2O'].sort(),
        products: [{ id: 'Ba(OH)2', count: 1 }, { id: 'H2', count: 1 }],
        equation: 'Ba + 2H₂O → Ba(OH)₂ + H₂↑',
        config: { exothermic: true, force: 0.006 }
    },
    {
        reactants: ['Al', 'HCl'].sort(),
        products: [{ id: 'AlCl3', count: 2 }, { id: 'H2', count: 3 }],
        equation: '2Al + 6HCl → 2AlCl₃ + 3H₂↑'
    },
    {
        reactants: ['Mg', 'HCl'].sort(),
        products: [{ id: 'MgCl2', count: 1 }, { id: 'H2', count: 1 }],
        equation: 'Mg + 2HCl → MgCl₂ + H₂↑'
    },
    {
        reactants: ['Fe', 'HCl'].sort(),
        products: [{ id: 'FeCl2', count: 1 }, { id: 'H2', count: 1 }],
        equation: 'Fe + 2HCl → FeCl₂ + H₂↑'
    },
    {
        reactants: ['F2', 'H2O'].sort(),
        products: [{ id: 'HF', count: 4 }, { id: 'O2', count: 1 }],
        equation: '2F₂ + 2H₂O → 4HF + O₂'
    },
    {
        reactants: ['Cl2', 'H2O'].sort(),
        products: [{ id: 'HCl', count: 1 }, { id: 'HOCl', count: 1 }],
        equation: 'Cl₂ + H₂O ⇌ HCl + HOCl',
        config: { note: '수돗물 소독' }
    },
    {
        reactants: ['CO', 'O2'].sort(),
        products: [{ id: 'CO2', count: 2 }],
        equation: '2CO + O₂ → 2CO₂',
        config: { exothermic: true, force: 0.01 }
    },
    {
        reactants: ['NO2', 'H2O'].sort(),
        products: [{ id: 'HNO3', count: 2 }, { id: 'NO', count: 1 }],
        equation: '3NO₂ + H₂O → 2HNO₃ + NO',
        config: { note: '산성비 원인 물질' }
    },
    {
        reactants: ['SO3', 'H2O'].sort(),
        products: [{ id: 'H2SO4', count: 1 }],
        equation: 'SO₃ + H₂O → H₂SO₄',
        config: { exothermic: true, force: 0.01, note: '산성비 원인 물질' }
    },
    {
        reactants: ['CaO', 'H2O'].sort(),
        products: [{ id: 'Ca(OH)2', count: 1 }],
        equation: 'CaO + H₂O → Ca(OH)₂',
        config: { exothermic: true }
    },
    {
        type: 'decomposition',
        reactant: 'Ag2O',
        products: [{ id: 'Ag', count: 4 }, { id: 'O2', count: 1 }],
        equation: '2Ag₂O(s) → 4Ag(s) + O₂(g)'
    },
    {
        type: 'decomposition',
        reactant: 'CuO',
        products: [{ id: 'Cu', count: 2 }, { id: 'O2', count: 1 }],
        equation: '2CuO(s) → 2Cu(s) + O₂(g)',
        config: { minTemp: 1300 }
    },
    {
        type: 'decomposition',
        reactant: 'NH4NO3',
        products: [{ id: 'N2O', count: 1 }, { id: 'H2O', count: 2 }],
        equation: 'NH₄NO₃(s) → N₂O(g) + 2H₂O(g)'
    },
    {
        type: 'decomposition',
        reactant: 'KClO3',
        products: [{ id: 'KCl', count: 2 }, { id: 'O2', count: 3 }],
        equation: '2KClO₃(s) → 2KCl(s) + 3O₂(g)',
        config: { note: '산소 발생 실험' }
    },
    {
        reactants: ['C2H4', 'H2'].sort(),
        products: [{ id: 'C2H6', count: 1 }],
        equation: 'C₂H₄ + H₂ → C₂H₆',
        config: { note: '에텐의 수소 첨가 반응' }
    },
    {
        reactants: ['C2H2', 'H2'].sort(),
        products: [{ id: 'C2H6', count: 1 }],
        equation: 'C₂H₂ + 2H₂ → C₂H₆',
        config: { note: '에타인의 수소 첨가 반응' }
    },
    {
        reactants: ['C2H4', 'Br2'].sort(),
        products: [{ id: 'C2H4Br2', count: 1 }],
        equation: 'C₂H₄ + Br₂ → C₂H₄Br₂',
        config: { note: '브로민 첨가 반응' }
    },
    {
        reactants: ['C6H6', 'Br2'].sort(),
        products: [{ id: 'C6H5Br', count: 1 }, { id: 'HBr', count: 1 }],
        equation: 'C₆H₆ + Br₂ → C₆H₅Br + HBr',
        config: { note: '벤젠의 브로민화 (FeBr₃ 촉매)' }
    },
    {
        reactants: ['C6H6', 'HNO3'].sort(),
        products: [{ id: 'C6H5NO2', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O',
        config: { note: '벤젠의 나이트로화 (H₂SO₄ 촉매)' }
    },
    {
        reactants: ['CH3COOH', 'C2H5OH'].sort(),
        products: [{ id: 'CH3COOC2H5', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O',
        config: { note: '에스터화 반응' }
    },
    {
        reactants: ['Ag', 'S'].sort(),
        products: [{ id: 'Ag2S', count: 1 }],
        equation: '2Ag + S → Ag₂S',
        config: { note: '은의 황화' }
    },
    {
        reactants: ['Cu', 'Cl2'].sort(),
        products: [{ id: 'CuCl2', count: 1 }],
        equation: 'Cu + Cl₂ → CuCl₂'
    },
    {
        reactants: ['I2', 'Na2S2O3'].sort(),
        products: [{ id: 'Na2S4O6', count: 1 }, { id: 'NaI', count: 2 }],
        equation: 'I₂ + 2Na₂S₂O₃ → Na₂S₄O₆ + 2NaI',
        config: { note: '아이오딘 적정' }
    },
    {
        reactants: ['Al', 'Fe2O3'].sort(),
        products: [{ id: 'Al2O3', count: 1 }, { id: 'Fe', count: 2 }],
        equation: '2Al + Fe₂O₃ → Al₂O₃ + 2Fe',
        config: { note: '테르밋 반응', exothermic: true, force: 0.05, minTemp: 2000 }
    },
    {
        reactants: ['Si', 'O2'].sort(),
        products: [{ id: 'SiO2', count: 1 }],
        equation: 'Si + O₂ → SiO₂'
    },
    {
        reactants: ['CS2', 'O2'].sort(),
        products: [{ id: 'CO2', count: 1 }, { id: 'SO2', count: 2 }],
        equation: 'CS₂ + 3O₂ → CO₂ + 2SO₂',
        config: { exothermic: true, force: 0.012 }
    },
    {
        reactants: ['PCl5', 'H2O'].sort(),
        products: [{ id: 'H3PO4', count: 1 }, { id: 'HCl', count: 5 }],
        equation: 'PCl₅ + 4H₂O → H₃PO₄ + 5HCl'
    },
    {
        reactants: ['ZnS', 'O2'].sort(),
        products: [{ id: 'ZnO', count: 2 }, { id: 'SO2', count: 2 }],
        equation: '2ZnS + 3O₂ → 2ZnO + 2SO₂'
    },
    {
        reactants: ['FeS2', 'O2'].sort(),
        products: [{ id: 'Fe2O3', count: 2 }, { id: 'SO2', count: 8 }],
        equation: '4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂'
    },
    {
        reactants: ['CH4', 'Cl2'].sort(),
        products: [{ id: 'CH3Cl', count: 1 }, { id: 'HCl', count: 1 }],
        equation: 'CH₄ + Cl₂ → CH₃Cl + HCl',
        config: { note: '메테인의 염소화 (자외선 필요)', requires: 'light' }
    },
    {
        reactants: ['O3', 'NO'].sort(),
        products: [{ id: 'O2', count: 1 }, { id: 'NO2', count: 1 }],
        equation: 'O₃ + NO → O₂ + NO₂',
        config: { note: '오존층 파괴 반응' }
    },
    {
        reactants: ['AgBr', 'Na2S2O3'].sort(),
        products: [{ id: 'Na3[Ag(S2O3)2]', count: 1 }, {id: 'NaBr', count: 1}],
        equation: 'AgBr + 2Na₂S₂O₃ → Na₃[Ag(S₂O₃)₂] + NaBr',
        config: { note: '사진 정착 과정' }
    },
    {
        reactants: ['NaOH', 'Al', 'H2O'].sort(),
        products: [{ id: 'Na[Al(OH)4]', count: 2 }, { id: 'H2', count: 3 }],
        equation: '2Al + 2NaOH + 6H₂O → 2Na[Al(OH)₄] + 3H₂↑'
    },
    {
        reactants: ['CuO', 'H2'].sort(),
        products: [{ id: 'Cu', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'CuO + H₂ → Cu + H₂O'
    },
    {
        reactants: ['Fe2O3', 'CO'].sort(),
        products: [{ id: 'Fe', count: 2 }, { id: 'CO2', count: 3 }],
        equation: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂',
        config: { note: '용광로 내 철의 제련' }
    },
    {
        reactants: ['PbO2', 'Pb', 'H2SO4'].sort(),
        products: [{ id: 'PbSO4', count: 2 }, { id: 'H2O', count: 2 }],
        equation: 'PbO₂ + Pb + 2H₂SO₄ → 2PbSO₄ + 2H₂O',
        config: { note: '납 축전지 방전' }
    },
    {
        reactants: ['PbSO4', 'H2O'].sort(),
        products: [{ id: 'PbO2', count: 1 }, { id: 'Pb', count: 1 }, {id: 'H2SO4', count: 2}],
        equation: '2PbSO₄ + 2H₂O → PbO₂ + Pb + 2H₂SO₄',
        config: { note: '납 축전지 충전', requires: 'electricity' }
    },
    {
        reactants: ['C', 'H2O'].sort(),
        products: [{ id: 'CO', count: 1 }, { id: 'H2', count: 1 }],
        equation: 'C(s) + H₂O(g) → CO(g) + H₂(g)',
        config: { note: '수성 가스 생성' }
    },
    {
        reactants: ['CH4', 'H2O'].sort(),
        products: [{ id: 'CO', count: 1 }, { id: 'H2', count: 3 }],
        equation: 'CH₄ + H₂O → CO + 3H₂',
        config: { note: '증기 개질' }
    },
    {
        reactants: ['TiCl4', 'Mg'].sort(),
        products: [{ id: 'Ti', count: 1 }, { id: 'MgCl2', count: 2 }],
        equation: 'TiCl₄ + 2Mg → Ti + 2MgCl₂',
        config: { note: '크롤법 (타이타늄 제련)' }
    },
    {
        reactants: ['N2', 'O2'].sort(),
        products: [{ id: 'NO', count: 2 }],
        equation: 'N₂ + O₂ ⇌ 2NO',
        config: { note: '고온/방전에서 발생' }
    },
    {
        reactants: ['C2H5OH', 'Na'].sort(),
        products: [{ id: 'C2H5ONa', count: 2 }, { id: 'H2', count: 1 }],
        equation: '2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑'
    },
    {
        reactants: ['Cu', 'HNO3'].sort(),
        products: [{ id: 'Cu(NO3)2', count: 1 }, { id: 'NO2', count: 2 }, { id: 'H2O', count: 2 }],
        equation: 'Cu + 4HNO₃(진) → Cu(NO₃)₂ + 2NO₂(g) + 2H₂O',
        config: { note: '구리와 진한 질산의 반응' }
    },
    {
        reactants: ['Cu', 'HNO3'].sort(),
        products: [{ id: 'Cu(NO3)2', count: 3 }, { id: 'NO', count: 2 }, { id: 'H2O', count: 4 }],
        equation: '3Cu + 8HNO₃(묽) → 3Cu(NO₃)₂ + 2NO(g) + 4H₂O',
        config: { note: '구리와 묽은 질산의 반응' }
    },
    {
        reactants: ['Cu', 'H2SO4'].sort(),
        products: [{ id: 'CuSO4', count: 1 }, { id: 'SO2', count: 1 }, { id: 'H2O', count: 2 }],
        equation: 'Cu + 2H₂SO₄(진) → CuSO₄ + SO₂(g) + 2H₂O',
        config: { note: '구리와 진한 황산의 반응' }
    },
    {
        reactants: ['Cl2', 'NaOH'].sort(),
        products: [{ id: 'NaCl', count: 1 }, { id: 'NaClO', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'Cl₂ + 2NaOH → NaCl + NaClO + H₂O',
        config: { note: '차아염소산소다 생성' }
    },
    {
        reactants: ['NH3', 'O2'].sort(),
        products: [{ id: 'NO', count: 4 }, { id: 'H2O', count: 6 }],
        equation: '4NH₃ + 5O₂ → 4NO + 6H₂O',
        config: { note: '오스트발트법 (Pt 촉매)' }
    },
    {
        reactants: ['H2S', 'O2'].sort(),
        products: [{ id: 'S', count: 2 }, { id: 'H2O', count: 2 }],
        equation: '2H₂S + O₂ → 2S + 2H₂O',
        config: { note: '클라우스 공정' }
    },
    {
        reactants: ['H2S', 'SO2'].sort(),
        products: [{ id: 'S', count: 3 }, { id: 'H2O', count: 2 }],
        equation: '2H₂S + SO₂ → 3S + 2H₂O',
        config: { note: '클라우스 공정' }
    },
    {
        reactants: ['BCl3', 'H2O'].sort(),
        products: [{ id: 'H3BO3', count: 1 }, { id: 'HCl', count: 3 }],
        equation: 'BCl₃ + 3H₂O → H₃BO₃ + 3HCl'
    },
    {
        reactants: ['SiCl4', 'H2O'].sort(),
        products: [{ id: 'H4SiO4', count: 1 }, { id: 'HCl', count: 4 }],
        equation: 'SiCl₄ + 4H₂O → H₄SiO₄ + 4HCl'
    },
    {
        type: 'decomposition',
        reactant: 'HCN',
        products: [{ id: 'H+', count: 1 }, { id: 'CN-', count: 1 }],
        equation: 'HCN ⇌ H⁺ + CN⁻',
        config: { note: '약산 이온화' }
    },
    {
        type: 'decomposition',
        reactant: 'HF',
        products: [{ id: 'H+', count: 1 }, { id: 'F-', count: 1 }],
        equation: 'HF ⇌ H⁺ + F⁻',
        config: { note: '약산 이온화' }
    },
    {
        type: 'decomposition',
        reactant: 'CH3COOH',
        products: [{ id: 'H+', count: 1 }, { id: 'CH3COO-', count: 1 }],
        equation: 'CH₃COOH ⇌ H⁺ + CH₃COO⁻',
        config: { note: '약산 이온화' }
    },
    {
        type: 'decomposition',
        reactant: 'NH4OH',
        products: [{ id: 'NH4+', count: 1 }, { id: 'OH-', count: 1 }],
        equation: 'NH₄OH ⇌ NH₄⁺ + OH⁻',
        config: { note: '약염기 이온화' }
    },
    {
        reactants: ['CaF2', 'H2SO4'].sort(),
        products: [{ id: 'CaSO4', count: 1 }, { id: 'HF', count: 2 }],
        equation: 'CaF₂ + H₂SO₄ → CaSO₄ + 2HF(g)'
    },
    {
        reactants: ['NaCl', 'H2SO4'].sort(),
        products: [{ id: 'NaHSO4', count: 1 }, { id: 'HCl', count: 1 }],
        equation: 'NaCl + H₂SO₄ → NaHSO₄ + HCl(g)'
    },
    {
        reactants: ['FeCl2', 'Cl2'].sort(),
        products: [{ id: 'FeCl3', count: 2 }],
        equation: '2FeCl₂ + Cl₂ → 2FeCl₃'
    },
    {
        reactants: ['SnCl2', 'HgCl2'].sort(),
        products: [{ id: 'SnCl4', count: 1 }, { id: 'Hg2Cl2', count: 1 }],
        equation: 'SnCl₂ + 2HgCl₂ → SnCl₄ + Hg₂Cl₂(s)'
    },
    {
        reactants: ['SnCl2', 'Hg2Cl2'].sort(),
        products: [{ id: 'SnCl4', count: 1 }, { id: 'Hg', count: 2 }],
        equation: 'SnCl₂ + Hg₂Cl₂ → SnCl₄ + 2Hg(l)'
    },
    {
        reactants: ['As2O3', 'I2', 'H2O'].sort(),
        products: [{ id: 'As2O5', count: 1 }, { id: 'HI', count: 4 }],
        equation: 'As₂O₃ + 2I₂ + 2H₂O ⇌ As₂O₅ + 4HI'
    },
    {
        reactants: ['S2O3^2-', 'I2'].sort(),
        products: [{ id: 'S4O6^2-', count: 1 }, { id: 'I-', count: 2 }],
        equation: '2S₂O₃²⁻ + I₂ → S₄O₆²⁻ + 2I⁻'
    },
    {
        reactants: ['H2O2', 'KMnO4', 'H2SO4'].sort(),
        products: [{ id: 'MnSO4', count: 2 }, { id: 'K2SO4', count: 1 }, { id: 'O2', count: 5 }, { id: 'H2O', count: 8 }],
        equation: '5H₂O₂ + 2KMnO₄ + 3H₂SO₄ → 2MnSO₄ + K₂SO₄ + 5O₂ + 8H₂O'
    },
    {
        reactants: ['K2Cr2O7', 'HCl'].sort(),
        products: [{ id: 'KCl', count: 2 }, { id: 'CrCl3', count: 2 }, { id: 'Cl2', count: 3 }, { id: 'H2O', count: 7 }],
        equation: 'K₂Cr₂O₇ + 14HCl → 2KCl + 2CrCl₃ + 3Cl₂ + 7H₂O'
    },
    {
        reactants: ['K2Cr2O7', 'H2S', 'H2SO4'].sort(),
        products: [{ id: 'K2SO4', count: 1 }, { id: 'Cr2(SO4)3', count: 1 }, { id: 'S', count: 3 }, { id: 'H2O', count: 7 }],
        equation: 'K₂Cr₂O₇ + 3H₂S + 4H₂SO₄ → K₂SO₄ + Cr₂(SO₄)₃ + 3S + 7H₂O'
    },
    {
        reactants: ['C2H2', 'O2'].sort(),
        products: [{ id: 'CO2', count: 4 }, { id: 'H2O', count: 2 }],
        equation: '2C₂H₂ + 5O₂ → 4CO₂ + 2H₂O',
        config: { note: '아세틸렌 연소', exothermic: true, force: 0.022 }
    },
    {
        reactants: ['C7H16', 'O2'].sort(),
        products: [{ id: 'CO2', count: 7 }, { id: 'H2O', count: 8 }],
        equation: 'C₇H₁₆ + 11O₂ → 7CO₂ + 8H₂O',
        config: { note: '헵테인 연소', exothermic: true, force: 0.025 }
    },
    {
        reactants: ['C8H18', 'O2'].sort(),
        products: [{ id: 'CO2', count: 16 }, { id: 'H2O', count: 18 }],
        equation: '2C₈H₁₈ + 25O₂ → 16CO₂ + 18H₂O',
        config: { note: '옥테인 연소', exothermic: true, force: 0.028 }
    },
    {
        reactants: ['NH3', 'CuO'].sort(),
        products: [{ id: 'N2', count: 1 }, { id: 'Cu', count: 3 }, { id: 'H2O', count: 3 }],
        equation: '2NH₃ + 3CuO → N₂ + 3Cu + 3H₂O'
    },
    {
        reactants: ['P', 'Cl2'].sort(),
        products: [{ id: 'PCl3', count: 4 }],
        equation: 'P₄ + 6Cl₂ → 4PCl₃'
    },
    {
        reactants: ['PCl3', 'Cl2'].sort(),
        products: [{ id: 'PCl5', count: 1 }],
        equation: 'PCl₃ + Cl₂ → PCl₅'
    },
    {
        reactants: ['P', 'O2'].sort(),
        products: [{ id: 'P2O5', count: 2 }],
        equation: '4P + 5O₂ → 2P₂O₅'
    },
    {
        reactants: ['P2O5', 'H2O'].sort(),
        products: [{ id: 'H3PO4', count: 4 }],
        equation: 'P₂O₅ + 3H₂O → 2H₃PO₄',
        config: { note: 'P4O10 + 6H2O -> 4H3PO4가 더 정확' }
    },
    {
        reactants: ['I-', 'OCl-'].sort(),
        products: [{ id: 'I2', count: 1 }, { id: 'Cl-', count: 1 }],
        equation: '2I⁻ + OCl⁻ + 2H⁺ → I₂ + Cl⁻ + H₂O'
    },
    {
        reactants: ['C2H4', 'O2'].sort(),
        products: [{ id: 'C2H4O', count: 2 }],
        equation: '2C₂H₄ + O₂ → 2C₂H₄O',
        config: { note: '에틸렌옥사이드 생성 (Ag 촉매)' }
    },
    {
        reactants: ['C3H6', 'O2', 'NH3'].sort(),
        products: [{ id: 'C3H3N', count: 2 }, { id: 'H2O', count: 6 }],
        equation: '2C₃H₆ + 2NH₃ + 3O₂ → 2C₃H₃N + 6H₂O',
        config: { note: '아크릴로나이트릴 합성 (SOHIO 공정)' }
    },
    {
        reactants: ['CH2O', 'Ag(NH3)2+'].sort(),
        products: [{ id: 'Ag', count: 2 }, { id: 'HCOOH', count: 1 }, { id: 'NH3', count: 4 }],
        equation: 'HCHO + 2Ag(NH₃)₂⁺ + 2OH⁻ → HCOOH + 2Ag(s) + 4NH₃ + H₂O',
        config: { note: '은거울 반응 (포름알데히드)' }
    },
    {
        reactants: ['C6H12O6', 'Ag(NH3)2+'].sort(),
        products: [{ id: 'Ag', count: 2 }],
        equation: 'C₆H₁₂O₆ + 2Ag(NH₃)₂⁺ + 2OH⁻ → C₅H₁₁O₅-COONH₄ + 2Ag(s) + 3NH₃ + H₂O',
        config: { note: '은거울 반응 (포도당)' }
    },
    {
        reactants: ['RCHO', 'Cu(OH)2'].sort(),
        products: [{ id: 'RCOOH', count: 1 }, { id: 'Cu2O', count: 1 }, {id: 'H2O', count: 2}],
        equation: 'RCHO + 2Cu(OH)₂ + OH⁻ → RCOOH + Cu₂O(s)↓ + 3H₂O',
        config: { note: '펠링 반응 (알데하이드)' }
    },
    {
        reactants: ['CaC2', 'H2O'].sort(),
        products: [{ id: 'C2H2', count: 1 }, { id: 'Ca(OH)2', count: 1 }],
        equation: 'CaC₂ + 2H₂O → C₂H₂(g) + Ca(OH)₂'
    },
    {
        reactants: ['Al4C3', 'H2O'].sort(),
        products: [{ id: 'CH4', count: 3 }, { id: 'Al(OH)3', count: 4 }],
        equation: 'Al₄C₃ + 12H₂O → 3CH₄(g) + 4Al(OH)₃(s)'
    },
    {
        reactants: ['Mg2Si', 'HCl'].sort(),
        products: [{ id: 'SiH4', count: 1 }, { id: 'MgCl2', count: 2 }],
        equation: 'Mg₂Si + 4HCl → SiH₄(g) + 2MgCl₂'
    },
    {
        reactants: ['ICl', 'H2O'].sort(),
        products: [{ id: 'HCl', count: 1 }, { id: 'HIO', count: 1 }],
        equation: 'ICl + H₂O → HCl + HIO'
    },
    {
        reactants: ['BrF3', 'H2O'].sort(),
        products: [{ id: 'HF', count: 3 }, { id: 'HBrO2', count: 1 }],
        equation: 'BrF₃ + 2H₂O → 3HF + HBrO₂'
    },
    {
        reactants: ['XeF6', 'H2O'].sort(),
        products: [{ id: 'XeO3', count: 1 }, { id: 'HF', count: 6 }],
        equation: 'XeF₆ + 3H₂O → XeO₃ + 6HF'
    },
    {
        reactants: ['H2', 'D2'].sort(),
        products: [{ id: 'HD', count: 2 }],
        equation: 'H₂ + D₂ ⇌ 2HD'
    },
    {
        reactants: ['Na2O2', 'H2O'].sort(),
        products: [{ id: 'NaOH', count: 4 }, { id: 'O2', count: 1 }],
        equation: '2Na₂O₂ + 2H₂O → 4NaOH + O₂'
    },
    {
        reactants: ['KO2', 'H2O'].sort(),
        products: [{ id: 'KOH', count: 4 }, { id: 'O2', count: 3 }],
        equation: '4KO₂ + 2H₂O → 4KOH + 3O₂'
    },
    {
        reactants: ['Na2O2', 'CO2'].sort(),
        products: [{ id: 'Na2CO3', count: 2 }, { id: 'O2', count: 1 }],
        equation: '2Na₂O₂ + 2CO₂ → 2Na₂CO₃ + O₂'
    },
    {
        reactants: ['KO2', 'CO2'].sort(),
        products: [{ id: 'K2CO3', count: 2 }, { id: 'O2', count: 3 }],
        equation: '4KO₂ + 2CO₂ → 2K₂CO₃ + 3O₂',
        config: { note: '우주선 공기 정화' }
    },
    {
        reactants: ['Li3N', 'H2O'].sort(),
        products: [{ id: 'LiOH', count: 3 }, { id: 'NH3', count: 1 }],
        equation: 'Li₃N + 3H₂O → 3LiOH + NH₃'
    },
    {
        reactants: ['Mg3N2', 'H2O'].sort(),
        products: [{ id: 'Mg(OH)2', count: 3 }, { id: 'NH3', count: 2 }],
        equation: 'Mg₃N₂ + 6H₂O → 3Mg(OH)₂ + 2NH₃'
    },
    {
        reactants: ['BF3', 'NH3'].sort(),
        products: [{ id: 'H3N-BF3', count: 1 }],
        equation: 'BF₃ + NH₃ → H₃N-BF₃',
        config: { note: '루이스 산-염기 반응' }
    },
    {
        reactants: ['AlCl3', 'Cl-'].sort(),
        products: [{ id: '[AlCl4]-', count: 1 }],
        equation: 'AlCl₃ + Cl⁻ → [AlCl₄]⁻'
    },
    {
        reactants: ['SO3', 'H2SO4'].sort(),
        products: [{ id: 'H2S2O7', count: 1 }],
        equation: 'SO₃ + H₂SO₄ → H₂S₂O₇',
        config: { note: '발연황산 생성' }
    },
    {
        reactants: ['H2S2O7', 'H2O'].sort(),
        products: [{ id: 'H2SO4', count: 2 }],
        equation: 'H₂S₂O₇ + H₂O → 2H₂SO₄'
    },
    {
        reactants: ['C', 'HNO3'].sort(),
        products: [{ id: 'CO2', count: 1 }, { id: 'NO2', count: 4 }, { id: 'H2O', count: 2 }],
        equation: 'C + 4HNO₃(진) → CO₂ + 4NO₂ + 2H₂O'
    },
    {
        reactants: ['S', 'HNO3'].sort(),
        products: [{ id: 'H2SO4', count: 1 }, { id: 'NO2', count: 6 }, { id: 'H2O', count: 2 }],
        equation: 'S + 6HNO₃(진) → H₂SO₄ + 6NO₂ + 2H₂O'
    },
    {
        reactants: ['P4', 'HNO3'].sort(),
        products: [{ id: 'H3PO4', count: 4 }, { id: 'NO2', count: 20 }, { id: 'H2O', count: 4 }],
        equation: 'P₄ + 20HNO₃(진) → 4H₃PO₄ + 20NO₂ + 4H₂O'
    },
    {
        reactants: ['I2', 'HNO3'].sort(),
        products: [{ id: 'HIO3', count: 2 }, { id: 'NO2', count: 10 }, { id: 'H2O', count: 4 }],
        equation: 'I₂ + 10HNO₃(진) → 2HIO₃ + 10NO₂ + 4H₂O'
    },
    {
        reactants: ['Zn', 'NaOH'].sort(),
        products: [{ id: 'Na2ZnO2', count: 1 }, { id: 'H2', count: 1 }],
        equation: 'Zn + 2NaOH → Na₂ZnO₂ + H₂'
    },
    {
        reactants: ['Sn', 'NaOH', 'H2O'].sort(),
        products: [{ id: 'Na2[Sn(OH)6]', count: 1 }, { id: 'H2', count: 2 }],
        equation: 'Sn + 2NaOH + 4H₂O → Na₂[Sn(OH)₆] + 2H₂↑'
    },
    {
        reactants: ['Pb', 'NaOH', 'H2O'].sort(),
        products: [{ id: 'Na2[Pb(OH)4]', count: 1 }, { id: 'H2', count: 1 }],
        equation: 'Pb + 2NaOH + 2H₂O → Na₂[Pb(OH)₄] + H₂↑'
    },
    {
        reactants: ['Cr(OH)3', 'NaOH'].sort(),
        products: [{ id: 'Na[Cr(OH)4]', count: 1 }],
        equation: 'Cr(OH)₃ + NaOH → Na[Cr(OH)₄]',
        config: { note: '양쪽성 수산화물' }
    },
    {
        reactants: ['Al(OH)3', 'HCl'].sort(),
        products: [{ id: 'AlCl3', count: 1 }, { id: 'H2O', count: 3 }],
        equation: 'Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O'
    },
    {
        reactants: ['Al(OH)3', 'NaOH'].sort(),
        products: [{ id: 'Na[Al(OH)4]', count: 1 }],
        equation: 'Al(OH)₃ + NaOH → Na[Al(OH)₄]'
    },
    {
        reactants: ['Zn(OH)2', 'HCl'].sort(),
        products: [{ id: 'ZnCl2', count: 1 }, { id: 'H2O', count: 2 }],
        equation: 'Zn(OH)₂ + 2HCl → ZnCl₂ + 2H₂O'
    },
    {
        reactants: ['Zn(OH)2', 'NaOH'].sort(),
        products: [{ id: 'Na2[Zn(OH)4]', count: 1 }],
        equation: 'Zn(OH)₂ + 2NaOH → Na₂[Zn(OH)₄]'
    },
    {
        reactants: ['CuSO4', 'NH3', 'H2O'].sort(),
        products: [{ id: '[Cu(NH3)4]SO4', count: 1 }],
        equation: 'CuSO₄ + 4NH₃(aq) → [Cu(NH₃)₄]SO₄',
        config: { note: '진한 푸른색 착이온 생성' }
    },
    {
        reactants: ['AgCl', 'NH3'].sort(),
        products: [{ id: '[Ag(NH3)2]Cl', count: 1 }],
        equation: 'AgCl(s) + 2NH₃(aq) → [Ag(NH₃)₂]Cl(aq)',
        config: { note: '앙금 용해' }
    },
    {
        reactants: ['CO', 'H2'].sort(),
        products: [{ id: 'CH3OH', count: 1 }],
        equation: 'CO + 2H₂ → CH₃OH',
        config: { note: '메탄올 합성' }
    },
    {
        reactants: ['C', 'S'].sort(),
        products: [{ id: 'CS2', count: 1 }],
        equation: 'C + 2S → CS₂'
    },
    {
        type: 'decomposition',
        reactant: 'Ni(CO)4',
        products: [{ id: 'Ni', count: 1 }, { id: 'CO', count: 4 }],
        equation: 'Ni(CO)₄(g) ⇌ Ni(s) + 4CO(g)',
        config: { note: '몬드법 (니켈 정제)' }
    },
    {
        type: 'decomposition',
        reactant: 'O3',
        products: [{ id: 'O2', count: 3 }],
        equation: '2O₃ → 3O₂',
        config: { note: '오존 분해', exothermic: true }
    },
    {
        reactants: ['O', 'O2'].sort(),
        products: [{ id: 'O3', count: 1 }],
        equation: 'O + O₂ → O₃',
        config: { note: '오존 생성' }
    },
    {
        reactants: ['Cl', 'O3'].sort(),
        products: [{ id: 'ClO', count: 1 }, { id: 'O2', count: 1 }],
        equation: 'Cl + O₃ → ClO + O₂',
        config: { note: '오존층 파괴 (염소 라디칼)' }
    },
    {
        reactants: ['ClO', 'O'].sort(),
        products: [{ id: 'Cl', count: 1 }, { id: 'O2', count: 1 }],
        equation: 'ClO + O → Cl + O₂',
        config: { note: '오존층 파괴 (염소 라디칼 재생)' }
    },
    {
        reactants: ['CaH2', 'H2O'].sort(),
        products: [{ id: 'Ca(OH)2', count: 1 }, { id: 'H2', count: 2 }],
        equation: 'CaH₂ + 2H₂O → Ca(OH)₂ + 2H₂↑'
    },
    {
        reactants: ['LiH', 'H2O'].sort(),
        products: [{ id: 'LiOH', count: 1 }, { id: 'H2', count: 1 }],
        equation: 'LiH + H₂O → LiOH + H₂↑'
    },
    {
        reactants: ['LiAlH4', 'H2O'].sort(),
        products: [{ id: 'LiOH', count: 1 }, { id: 'Al(OH)3', count: 1 }, { id: 'H2', count: 4 }],
        equation: 'LiAlH₄ + 4H₂O → LiOH + Al(OH)₃ + 4H₂↑'
    },
    {
        reactants: ['NaBH4', 'H2O'].sort(),
        products: [{ id: 'NaBO2', count: 1 }, { id: 'H2', count: 4 }],
        equation: 'NaBH₄ + 2H₂O → NaBO₂ + 4H₂↑'
    },
    {
        reactants: ['SOCl2', 'H2O'].sort(),
        products: [{ id: 'SO2', count: 1 }, { id: 'HCl', count: 2 }],
        equation: 'SOCl₂ + H₂O → SO₂ + 2HCl'
    },
    {
        reactants: ['POCl3', 'H2O'].sort(),
        products: [{ id: 'H3PO4', count: 1 }, { id: 'HCl', count: 3 }],
        equation: 'POCl₃ + 3H₂O → H₃PO₄ + 3HCl'
    },
    {
        reactants: ['B2H6', 'O2'].sort(),
        products: [{ id: 'B2O3', count: 1 }, { id: 'H2O', count: 3 }],
        equation: 'B₂H₆ + 3O₂ → B₂O₃ + 3H₂O',
        config: { exothermic: true, force: 0.015 }
    },
    {
        reactants: ['SiH4', 'O2'].sort(),
        products: [{ id: 'SiO2', count: 1 }, { id: 'H2O', count: 2 }],
        equation: 'SiH₄ + 2O₂ → SiO₂ + 2H₂O',
        config: { exothermic: true, force: 0.016 }
    },
    {
        reactants: ['PH3', 'O2'].sort(),
        products: [{ id: 'P4O10', count: 1 }, { id: 'H2O', count: 6 }],
        equation: '4PH₃ + 8O₂ → P₄O₁₀ + 6H₂O',
        config: { exothermic: true, force: 0.014 }
    },
    {
        reactants: ['FeCl3', 'H2S'].sort(),
        products: [{ id: 'FeCl2', count: 2 }, { id: 'S', count: 1 }, { id: 'HCl', count: 2 }],
        equation: '2FeCl₃ + H₂S → 2FeCl₂ + S + 2HCl'
    },
    {
        reactants: ['HgCl2', 'H2S'].sort(),
        products: [{ id: 'HgS', count: 1 }, { id: 'HCl', count: 2 }],
        equation: 'HgCl₂ + H₂S → HgS↓ + 2HCl'
    },
    {
        reactants: ['CuCl2', 'H2S'].sort(),
        products: [{ id: 'CuS', count: 1 }, { id: 'HCl', count: 2 }],
        equation: 'CuCl₂ + H₂S → CuS↓ + 2HCl'
    },
    {
        reactants: ['Pb(NO3)2', 'H2S'].sort(),
        products: [{ id: 'PbS', count: 1 }, { id: 'HNO3', count: 2 }],
        equation: 'Pb(NO₃)₂ + H₂S → PbS↓ + 2HNO₃'
    },
    {
        reactants: ['AgNO3', 'H2S'].sort(),
        products: [{ id: 'Ag2S', count: 1 }, { id: 'HNO3', count: 2 }],
        equation: '2AgNO₃ + H₂S → Ag₂S↓ + 2HNO₃'
    },
    {
        reactants: ['CdSO4', 'H2S'].sort(),
        products: [{ id: 'CdS', count: 1 }, { id: 'H2SO4', count: 1 }],
        equation: 'CdSO₄ + H₂S → CdS↓ + H₂SO₄'
    },
    {
        reactants: ['Bi(NO3)3', 'H2S'].sort(),
        products: [{ id: 'Bi2S3', count: 1 }, { id: 'HNO3', count: 6 }],
        equation: '2Bi(NO₃)₃ + 3H₂S → Bi₂S₃↓ + 6HNO₃'
    },
    {
        reactants: ['SbCl3', 'H2S'].sort(),
        products: [{ id: 'Sb2S3', count: 1 }, { id: 'HCl', count: 6 }],
        equation: '2SbCl₃ + 3H₂S → Sb₂S₃↓ + 6HCl'
    },
    {
        reactants: ['SnCl4', 'H2S'].sort(),
        products: [{ id: 'SnS2', count: 1 }, { id: 'HCl', count: 4 }],
        equation: 'SnCl₄ + 2H₂S → SnS₂↓ + 4HCl'
    },
    {
        reactants: ['ZnCl2', 'H2S'].sort(),
        products: [{ id: 'ZnS', count: 1 }, { id: 'HCl', count: 2 }],
        equation: 'ZnCl₂ + H₂S → ZnS↓ + 2HCl'
    },
    {
        reactants: ['MnCl2', 'H2S'].sort(),
        products: [{ id: 'MnS', count: 1 }, { id: 'HCl', count: 2 }],
        equation: 'MnCl₂ + H₂S → MnS↓ + 2HCl'
    },
    {
        reactants: ['FeSO4', 'H2S'].sort(),
        products: [{ id: 'FeS', count: 1 }, { id: 'H2SO4', count: 1 }],
        equation: 'FeSO₄ + H₂S → FeS↓ + H₂SO₄'
    },
    {
        reactants: ['NiCl2', 'H2S'].sort(),
        products: [{ id: 'NiS', count: 1 }, { id: 'HCl', count: 2 }],
        equation: 'NiCl₂ + H₂S → NiS↓ + 2HCl'
    },
    {
        reactants: ['CoCl2', 'H2S'].sort(),
        products: [{ id: 'CoS', count: 1 }, { id: 'HCl', count: 2 }],
        equation: 'CoCl₂ + H₂S → CoS↓ + 2HCl'
    },
    {
        reactants: ['CH4', 'NH3', 'O2'].sort(),
        products: [{ id: 'HCN', count: 2 }, { id: 'H2O', count: 6 }],
        equation: '2CH₄ + 2NH₃ + 3O₂ → 2HCN + 6H₂O',
        config: { note: '안드루소프 공정 (사이안화 수소 합성)' }
    },
    {
        reactants: ['Haber-Bosch Process', 'N2', 'H2'].sort(),
        products: [{ id: 'NH3', count: 2 }],
        equation: 'N₂ + 3H₂ ⇌ 2NH₃',
        config: { note: '암모니아 합성 (고압, 고온, 철 촉매)', exothermic: true, force: 0.001 }
    },
    {
        reactants: ['Contact Process', 'SO2', 'O2'].sort(),
        products: [{ id: 'SO3', count: 2 }],
        equation: '2SO₂ + O₂ ⇌ 2SO₃',
        config: { note: '황산 제조 (V₂O₅ 촉매)' }
    },
    {
        reactants: ['Ostwald Process', 'NH3', 'O2'].sort(),
        products: [{ id: 'NO', count: 4 }, { id: 'H2O', count: 6 }],
        equation: '4NH₃ + 5O₂ → 4NO + 6H₂O',
        config: { note: '질산 제조 (Pt-Rh 촉매)' }
    },
    {
        reactants: ['Hall-Héroult Process', 'Al2O3'].sort(),
        type: 'decomposition',
        reactant: 'Al2O3',
        products: [{ id: 'Al', count: 4 }, { id: 'O2', count: 3 }],
        equation: '2Al₂O₃(l) → 4Al(l) + 3O₂(g)',
        config: { note: '알루미늄 제련 (전기분해)', requires: 'electricity' }
    },
    {
        reactants: ['Dow Process', 'MgCl2'].sort(),
        type: 'decomposition',
        reactant: 'MgCl2',
        products: [{ id: 'Mg', count: 1 }, { id: 'Cl2', count: 1 }],
        equation: 'MgCl₂(l) → Mg(l) + Cl₂(g)',
        config: { note: '마그네슘 제련 (전기분해)', requires: 'electricity' }
    },
    {
        reactants: ['Solvay Process', 'NaCl', 'NH3', 'CO2', 'H2O'].sort(),
        products: [{ id: 'NaHCO3', count: 1 }, { id: 'NH4Cl', count: 1 }],
        equation: 'NaCl + NH₃ + CO₂ + H₂O → NaHCO₃↓ + NH₄Cl',
        config: { note: '탄산나트륨 제조' }
    },
    {
        reactants: ['Frasch Process', 'S'].sort(),
        products: [{ id: 'S', count: 1 }],
        equation: 'S(s) + H₂O(superheated) → S(l)',
        config: { note: '황 채취' }
    },
    {
        reactants: ['Fischer-Tropsch Process', 'CO', 'H2'].sort(),
        products: [{ id: '(-CH2-)', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'nCO + (2n+1)H₂ → CnH(2n+2) + nH₂O',
        config: { note: '인조 석유 합성' }
    },
    {
        reactants: ['Saponification', 'Fat', 'NaOH'].sort(),
        products: [{ id: 'Glycerol', count: 1 }, { id: 'Soap', count: 3 }],
        equation: 'Triglyceride + 3NaOH → Glycerol + 3 Soap',
        config: { note: '비누화 반응' }
    },
    {
        reactants: ['Polymerization', 'C2H4'].sort(),
        products: [{ id: '(-CH2-CH2-)n', count: 1 }],
        equation: 'n(CH₂=CH₂) → [-CH₂-CH₂-]n',
        config: { note: '폴리에틸렌 중합' }
    },
    {
        reactants: ['CFC Decomposition', 'CCl2F2'].sort(),
        products: [{ id: 'Cl', count: 1 }],
        equation: 'CCl₂F₂ --(UV)--> CClF₂ + Cl',
        config: { note: '오존층 파괴 원인', requires: 'light' }
    },
    {
        reactants: ['Mg', 'N2'].sort(),
        products: [{ id: 'Mg3N2', count: 1 }],
        equation: '3Mg + N₂ → Mg₃N₂'
    },
    {
        reactants: ['Li', 'N2'].sort(),
        products: [{ id: 'Li3N', count: 2 }],
        equation: '6Li + N₂ → 2Li₃N'
    },
    {
        reactants: ['H2O2', 'Ag2O'].sort(),
        products: [{ id: 'Ag', count: 2 }, { id: 'H2O', count: 1 }, { id: 'O2', count: 1 }],
        equation: 'H₂O₂ + Ag₂O → 2Ag + H₂O + O₂'
    },
    {
        reactants: ['H2O2', 'PbS'].sort(),
        products: [{ id: 'PbSO4', count: 1 }, { id: 'H2O', count: 4 }],
        equation: '4H₂O₂ + PbS → PbSO₄ + 4H₂O'
    },
    {
        reactants: ['BaO2', 'H2SO4'].sort(),
        products: [{ id: 'BaSO4', count: 1 }, { id: 'H2O2', count: 1 }],
        equation: 'BaO₂ + H₂SO₄ → BaSO₄ + H₂O₂'
    },
    {
        reactants: ['H2', 'S'].sort(),
        products: [{ id: 'H2S', count: 1 }],
        equation: 'H₂ + S → H₂S'
    },
    {
        reactants: ['H2', 'F2'].sort(),
        products: [{ id: 'HF', count: 2 }],
        equation: 'H₂ + F₂ → 2HF',
        config: { exothermic: true, force: 0.03, note: '폭발적으로 반응' }
    },
    {
        reactants: ['H2', 'Br2'].sort(),
        products: [{ id: 'HBr', count: 2 }],
        equation: 'H₂ + Br₂ → 2HBr'
    },
    {
        reactants: ['SO2', 'H2S'].sort(),
        products: [{ id: 'S', count: 3 }, { id: 'H2O', count: 2 }],
        equation: 'SO₂ + 2H₂S → 3S + 2H₂O'
    },
    {
        reactants: ['Na', 'CH3OH'].sort(),
        products: [{ id: 'NaOCH3', count: 2 }, { id: 'H2', count: 1 }],
        equation: '2Na + 2CH₃OH → 2NaOCH₃ + H₂↑'
    },
    {
        reactants: ['C6H5OH', 'NaOH'].sort(),
        products: [{ id: 'C6H5ONa', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'C₆H₅OH + NaOH → C₆H₅ONa + H₂O',
        config: { note: '페놀의 산성' }
    },
    {
        reactants: ['C6H5ONa', 'CO2', 'H2O'].sort(),
        products: [{ id: 'C6H5OH', count: 1 }, { id: 'NaHCO3', count: 1 }],
        equation: 'C₆H₅ONa + CO₂ + H₂O → C₆H₅OH + NaHCO₃',
        config: { note: '페놀의 재생성 (카복실산보다 약산)' }
    },
    {
        reactants: ['Kolbe-Schmitt reaction', 'C6H5ONa', 'CO2'].sort(),
        products: [{ id: 'Salicylic acid', count: 1 }],
        equation: 'C₆H₅ONa + CO₂ → Salicylate → Salicylic acid',
        config: { note: '살리실산 합성' }
    },
    {
        reactants: ['Reimer-Tiemann reaction', 'Phenol', 'CHCl3', 'NaOH'].sort(),
        products: [{ id: 'Salicylaldehyde', count: 1 }],
        equation: 'Phenol + CHCl₃ + NaOH → Salicylaldehyde',
        config: { note: '살리실알데하이드 합성' }
    },
    {
        reactants: ['Williamson ether synthesis', 'RONa', 'R\'X'].sort(),
        products: [{ id: 'ROR\'', count: 1 }, { id: 'NaX', count: 1 }],
        equation: 'RONa + R\'X → R-O-R\' + NaX',
        config: { note: '에터 합성' }
    },
    {
        reactants: ['Wurtz reaction', 'RX', 'Na'].sort(),
        products: [{ id: 'R-R', count: 1 }, { id: 'NaX', count: 2 }],
        equation: '2R-X + 2Na → R-R + 2NaX',
        config: { note: '알케인 합성' }
    },
    {
        reactants: ['Grignard reaction', 'RMgX', 'H2O'].sort(),
        products: [{ id: 'RH', count: 1 }, { id: 'Mg(OH)X', count: 1 }],
        equation: 'R-MgX + H₂O → R-H + Mg(OH)X',
        config: { note: '그리냐르 시약과 물의 반응' }
    },
    {
        reactants: ['Friedel-Crafts alkylation', 'C6H6', 'RCl'].sort(),
        products: [{ id: 'C6H5R', count: 1 }, { id: 'HCl', count: 1 }],
        equation: 'C₆H₆ + R-Cl --(AlCl₃)--> C₆H₅-R + HCl',
        config: { note: '벤젠의 알킬화' }
    },
    {
        reactants: ['Friedel-Crafts acylation', 'C6H6', 'RCOCl'].sort(),
        products: [{ id: 'C6H5COR', count: 1 }, { id: 'HCl', count: 1 }],
        equation: 'C₆H₆ + R-CO-Cl --(AlCl₃)--> C₆H₅-CO-R + HCl',
        config: { note: '벤젠의 아실화' }
    },
    {
        reactants: ['Clemmensen reduction', 'Ketone', 'Zn(Hg)', 'HCl'].sort(),
        products: [{ id: 'Alkane', count: 1 }],
        equation: 'Ketone --(Zn(Hg), HCl)--> Alkane',
        config: { note: '케톤의 환원' }
    },
    {
        reactants: ['Wolff-Kishner reduction', 'Ketone', 'N2H4', 'KOH'].sort(),
        products: [{ id: 'Alkane', count: 1 }],
        equation: 'Ketone --(N₂H₄, KOH)--> Alkane',
        config: { note: '케톤의 환원' }
    },
    {
        reactants: ['Cannizzaro reaction', 'Aldehyde (no alpha-H)', 'NaOH'].sort(),
        products: [{ id: 'Alcohol', count: 1 }, { id: 'Carboxylate', count: 1 }],
        equation: '2RCHO + OH⁻ → RCH₂OH + RCOO⁻',
        config: { note: '알데하이드의 불균등화 반응' }
    },
    {
        reactants: ['Aldol condensation', 'Aldehyde (with alpha-H)', 'NaOH'].sort(),
        products: [{ id: 'Aldol', count: 1 }],
        equation: '2CH₃CHO ⇌ CH₃CH(OH)CH₂CHO',
        config: { note: '알돌 축합' }
    },
    {
        reactants: ['Claisen condensation', 'Ester (with alpha-H)', 'NaOEt'].sort(),
        products: [{ id: 'beta-keto ester', count: 1 }],
        equation: '2CH₃COOEt --(NaOEt)--> CH₃COCH₂COOEt + EtOH',
        config: { note: '클라이젠 축합' }
    },
    {
        reactants: ['Hofmann degradation', 'Amide', 'Br2', 'NaOH'].sort(),
        products: [{ id: 'Amine', count: 1 }],
        equation: 'RCONH₂ + Br₂ + 4NaOH → RNH₂ + Na₂CO₃ + 2NaBr + 2H₂O',
        config: { note: '아마이드 분해' }
    },
    {
        reactants: ['Diels-Alder reaction', 'Diene', 'Dienophile'].sort(),
        products: [{ id: 'Cyclohexene derivative', count: 1 }],
        equation: 'Butadiene + Ethene → Cyclohexene',
        config: { note: '고리화 첨가 반응' }
    },
    {
        reactants: ['Ozonolysis', 'Alkene', 'O3'].sort(),
        products: [{ id: 'Carbonyl compounds', count: 2 }],
        equation: 'R₂C=CR₂ + O₃ → 2R₂C=O',
        config: { note: '알켄의 오존 분해' }
    },
    {
        reactants: ['Simmons-Smith reaction', 'Alkene', 'CH2I2', 'Zn(Cu)'].sort(),
        products: [{ id: 'Cyclopropane derivative', count: 1 }],
        equation: 'Alkene + CH₂I₂ --(Zn-Cu)--> Cyclopropane',
        config: { note: '사이클로프로페인 합성' }
    },
    {
        reactants: ['Wittig reaction', 'Aldehyde/Ketone', 'Phosphonium ylide'].sort(),
        products: [{ id: 'Alkene', count: 1 }],
        equation: 'R₂C=O + Ph₃P=CR\'₂ → R₂C=CR\'₂ + Ph₃P=O',
        config: { note: '알켄 합성' }
    },
    {
        reactants: ['Hydroboration-oxidation', 'Alkene', 'BH3', 'H2O2', 'NaOH'].sort(),
        products: [{ id: 'Alcohol', count: 1 }],
        equation: 'Alkene --(1. BH₃ 2. H₂O₂, NaOH)--> Alcohol',
        config: { note: '알코올 합성 (Anti-Markovnikov)' }
    },
    {
        reactants: ['Oxymercuration-demercuration', 'Alkene', 'Hg(OAc)2', 'H2O', 'NaBH4'].sort(),
        products: [{ id: 'Alcohol', count: 1 }],
        equation: 'Alkene --(1. Hg(OAc)₂, H₂O 2. NaBH₄)--> Alcohol',
        config: { note: '알코올 합성 (Markovnikov)' }
    },
    {
        reactants: ['Ba(NO3)2', 'H2SO4'].sort(),
        products: [{ id: 'BaSO4', count: 1 }, { id: 'HNO3', count: 2 }],
        equation: 'Ba(NO₃)₂ + H₂SO₄ → BaSO₄(s)↓ + 2HNO₃'
    },
    {
        reactants: ['SrCl2', 'Na2CO3'].sort(),
        products: [{ id: 'SrCO3', count: 1 }, { id: 'NaCl', count: 2 }],
        equation: 'SrCl₂ + Na₂CO₃ → SrCO₃(s)↓ + 2NaCl'
    },
    {
        reactants: ['MgCO3', 'H2O'].sort(),
        products: [{ id: 'Mg(OH)2', count: 1 }, { id: 'CO2', count: 1 }],
        equation: 'MgCO₃ + H₂O → Mg(OH)₂ + CO₂ (가수분해)'
    },
    {
        type: 'decomposition',
        reactant: 'Li2CO3',
        products: [{ id: 'Li2O', count: 1 }, { id: 'CO2', count: 1 }],
        equation: 'Li₂CO₃ → Li₂O + CO₂',
        config: { minTemp: 1573 } // 1300°C
    },
    {
        type: 'decomposition',
        reactant: 'Mg(NO3)2',
        products: [{ id: 'MgO', count: 2 }, { id: 'NO2', count: 4 }, { id: 'O2', count: 1 }],
        equation: '2Mg(NO₃)₂ → 2MgO + 4NO₂ + O₂'
    },
    {
        type: 'decomposition',
        reactant: 'Cu(NO3)2',
        products: [{ id: 'CuO', count: 2 }, { id: 'NO2', count: 4 }, { id: 'O2', count: 1 }],
        equation: '2Cu(NO₃)₂ → 2CuO + 4NO₂ + O₂'
    },
    {
        reactants: ['NO2', 'N2O4'].sort(),
        products: [],
        equation: '2NO₂ ⇌ N₂O₄',
        config: { note: '평형 반응', exothermic: true }
    },
    {
        reactants: ['Fe3O4', 'H2'].sort(),
        products: [{ id: 'Fe', count: 3 }, { id: 'H2O', count: 4 }],
        equation: 'Fe₃O₄ + 4H₂ → 3Fe + 4H₂O'
    },
    {
        reactants: ['MnO2', 'HCl'].sort(),
        products: [{ id: 'MnCl2', count: 1 }, { id: 'Cl2', count: 1 }, { id: 'H2O', count: 2 }],
        equation: 'MnO₂ + 4HCl → MnCl₂ + Cl₂ + 2H₂O'
    },
    {
        reactants: ['Cl2', 'KI'].sort(),
        products: [{ id: 'KCl', count: 2 }, { id: 'I2', count: 1 }],
        equation: 'Cl₂ + 2KI → 2KCl + I₂'
    },
    {
        reactants: ['Br2', 'NaI'].sort(),
        products: [{ id: 'NaBr', count: 2 }, { id: 'I2', count: 1 }],
        equation: 'Br₂ + 2NaI → 2NaBr + I₂'
    },
    {
        reactants: ['F2', 'NaCl'].sort(),
        products: [{ id: 'NaF', count: 2 }, { id: 'Cl2', count: 1 }],
        equation: 'F₂ + 2NaCl → 2NaF + Cl₂'
    },
    {
        reactants: ['CH3Cl', 'NaOH'].sort(),
        products: [{ id: 'CH3OH', count: 1 }, { id: 'NaCl', count: 1 }],
        equation: 'CH₃Cl + NaOH → CH₃OH + NaCl',
        config: { note: '친핵성 치환 반응 (SN2)' }
    },
    {
        reactants: ['(CH3)3CBr', 'H2O'].sort(),
        products: [{ id: '(CH3)3COH', count: 1 }, { id: 'HBr', count: 1 }],
        equation: '(CH₃)₃CBr + H₂O → (CH₃)₃COH + HBr',
        config: { note: '친핵성 치환 반응 (SN1)' }
    },
    {
        reactants: ['CH3CH2Br', 'NaOH'].sort(),
        products: [{ id: 'C2H4', count: 1 }, { id: 'NaBr', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'CH₃CH₂Br + NaOH → CH₂=CH₂ + NaBr + H₂O',
        config: { note: '제거 반응 (E2)' }
    },
    {
        reactants: ['(CH3)3COH', 'H2SO4'].sort(),
        products: [{ id: 'C4H8', count: 1 }, { id: 'H2O', count: 1 }],
        equation: '(CH₃)₃COH --(H₂SO₄, heat)--> (CH₃)₂C=CH₂ + H₂O',
        config: { note: '제거 반응 (E1)' }
    },
    {
        reactants: ['C2H4', 'HBr'].sort(),
        products: [{ id: 'CH3CH2Br', count: 1 }],
        equation: 'CH₂=CH₂ + HBr → CH₃CH₂Br',
        config: { note: '친전자성 첨가 반응' }
    },
    {
        reactants: ['CH3CH=CH2', 'HBr'].sort(),
        products: [{ id: 'CH3CHBrCH3', count: 1 }],
        equation: 'CH₃CH=CH₂ + HBr → CH₃CHBrCH₃',
        config: { note: 'Markovnikov 법칙' }
    },
    {
        reactants: ['CH3CH=CH2', 'HBr', 'ROOR'].sort(),
        products: [{ id: 'CH3CH2CH2Br', count: 1 }],
        equation: 'CH₃CH=CH₂ + HBr --(ROOR)--> CH₃CH₂CH₂Br',
        config: { note: 'Anti-Markovnikov 법칙 (라디칼 반응)' }
    },
    {
        reactants: ['C2H4', 'H2O', 'H+'].sort(),
        products: [{ id: 'C2H5OH', count: 1 }],
        equation: 'CH₂=CH₂ + H₂O --(H⁺)--> CH₃CH₂OH',
        config: { note: '알켄의 수화 반응' }
    },
    {
        reactants: ['C2H4', 'Cl2'].sort(),
        products: [{ id: 'CH2ClCH2Cl', count: 1 }],
        equation: 'CH₂=CH₂ + Cl₂ → CH₂ClCH₂Cl',
        config: { note: '할로젠 첨가' }
    },
    {
        reactants: ['C2H4', 'HOCl'].sort(),
        products: [{ id: 'CH2(OH)CH2Cl', count: 1 }],
        equation: 'CH₂=CH₂ + HOCl → HOCH₂CH₂Cl',
        config: { note: '할로하이드린 형성' }
    },
    {
        reactants: ['C2H5OH', 'PCC'].sort(),
        products: [{ id: 'CH3CHO', count: 1 }],
        equation: 'CH₃CH₂OH --(PCC)--> CH₃CHO',
        config: { note: '1차 알코올의 산화 (알데하이드)' }
    },
    {
        reactants: ['C2H5OH', 'KMnO4'].sort(),
        products: [{ id: 'CH3COOH', count: 1 }],
        equation: 'CH₃CH₂OH --(KMnO₄)--> CH₃COOH',
        config: { note: '1차 알코올의 산화 (카복실산)' }
    },
    {
        reactants: ['(CH3)2CHOH', 'CrO3'].sort(),
        products: [{ id: '(CH3)2CO', count: 1 }],
        equation: '(CH₃)₂CHOH --(CrO₃)--> (CH₃)₂C=O',
        config: { note: '2차 알코올의 산화 (케톤)' }
    },
    {
        reactants: ['CH3CHO', 'HCN'].sort(),
        products: [{ id: 'CH3CH(OH)CN', count: 1 }],
        equation: 'CH₃CHO + HCN → CH₃CH(OH)CN',
        config: { note: '사이아노하이드린 형성' }
    },
    {
        reactants: ['RCOCl', 'R2CuLi'].sort(),
        products: [{ id: 'RCOR', count: 1 }],
        equation: 'RCOCl + R\'₂CuLi → R-CO-R\'',
        config: { note: '길만 시약을 이용한 케톤 합성' }
    },
    {
        reactants: ['RCOOH', 'SOCl2'].sort(),
        products: [{ id: 'RCOCl', count: 1 }, { id: 'SO2', count: 1 }, { id: 'HCl', count: 1 }],
        equation: 'RCOOH + SOCl₂ → RCOCl + SO₂ + HCl',
        config: { note: '아실 클로라이드 합성' }
    },
    {
        reactants: ['RCOCl', 'NH3'].sort(),
        products: [{ id: 'RCONH2', count: 1 }, { id: 'HCl', count: 1 }],
        equation: 'RCOCl + NH₃ → RCONH₂ + HCl',
        config: { note: '아마이드 합성' }
    },
    {
        reactants: ['RCOCl', 'R\'OH'].sort(),
        products: [{ id: 'RCOOR\'', count: 1 }, { id: 'HCl', count: 1 }],
        equation: 'RCOCl + R\'OH → RCOOR\' + HCl',
        config: { note: '에스터 합성' }
    },
    {
        reactants: ['RCOCl', 'R\'COO-'].sort(),
        products: [{ id: '(RCO)2O', count: 1 }, { id: 'Cl-', count: 1 }],
        equation: 'RCOCl + R\'COO⁻ → RCO-O-COR\' + Cl⁻',
        config: { note: '산 무수물 합성' }
    },
    {
        reactants: ['Ester', 'H3O+'].sort(),
        products: [{ id: 'Carboxylic acid', count: 1 }, { id: 'Alcohol', count: 1 }],
        equation: 'RCOOR\' + H₃O⁺ → RCOOH + R\'OH',
        config: { note: '에스터의 산 촉매 가수분해' }
    },
    {
        reactants: ['Ester', 'OH-'].sort(),
        products: [{ id: 'Carboxylate', count: 1 }, { id: 'Alcohol', count: 1 }],
        equation: 'RCOOR\' + OH⁻ → RCOO⁻ + R\'OH',
        config: { note: '에스터의 염기 촉매 가수분해 (비누화)' }
    },
    {
        reactants: ['Ester', 'LiAlH4'].sort(),
        products: [{ id: 'Alcohol', count: 2 }],
        equation: 'RCOOR\' --(1. LiAlH₄ 2. H₂O)--> RCH₂OH + R\'OH',
        config: { note: '에스터의 환원' }
    },
    {
        reactants: ['Ester', 'R\'MgX'].sort(),
        products: [{ id: 'Alcohol', count: 1 }],
        equation: 'RCOOR\' + 2R\'\'MgX → RR\'\'₂COH',
        config: { note: '그리냐르 시약을 이용한 에스터 반응' }
    },
    {
        reactants: ['Amide', 'H3O+'].sort(),
        products: [{ id: 'Carboxylic acid', count: 1 }, { id: 'NH4+', count: 1 }],
        equation: 'RCONH₂ + H₃O⁺ → RCOOH + NH₄⁺',
        config: { note: '아마이드의 가수분해' }
    },
    {
        reactants: ['Amide', 'LiAlH4'].sort(),
        products: [{ id: 'Amine', count: 1 }],
        equation: 'RCONH₂ --(1. LiAlH₄ 2. H₂O)--> RCH₂NH₂',
        config: { note: '아마이드의 환원' }
    },
    {
        reactants: ['Nitrile', 'H3O+'].sort(),
        products: [{ id: 'Carboxylic acid', count: 1 }, { id: 'NH4+', count: 1 }],
        equation: 'RCN + H₃O⁺ → RCOOH + NH₄⁺',
        config: { note: '나이트릴의 가수분해' }
    },
    {
        reactants: ['Nitrile', 'LiAlH4'].sort(),
        products: [{ id: 'Amine', count: 1 }],
        equation: 'RCN --(1. LiAlH₄ 2. H₂O)--> RCH₂NH₂',
        config: { note: '나이트릴의 환원' }
    },
    {
        reactants: ['Benzene', 'H2', 'Ni'].sort(),
        products: [{ id: 'Cyclohexane', count: 1 }],
        equation: 'C₆H₆ + 3H₂ --(Ni, heat, pressure)--> C₆H₁₂',
        config: { note: '벤젠의 수소화' }
    },
    {
        reactants: ['Toluene', 'KMnO4'].sort(),
        products: [{ id: 'Benzoic acid', count: 1 }],
        equation: 'C₆H₅CH₃ --(KMnO₄)--> C₆H₅COOH',
        config: { note: '톨루엔의 산화' }
    },
    {
        reactants: ['Phenol', 'Br2'].sort(),
        products: [{ id: '2,4,6-Tribromophenol', count: 1 }, { id: 'HBr', count: 3 }],
        equation: 'C₆H₅OH + 3Br₂ → C₆H₂(Br)₃OH(s)↓ + 3HBr',
        config: { note: '페놀의 브로민화' }
    },
    {
        reactants: ['Aniline', 'Br2'].sort(),
        products: [{ id: '2,4,6-Tribromoaniline', count: 1 }, { id: 'HBr', count: 3 }],
        equation: 'C₆H₅NH₂ + 3Br₂ → C₆H₂(Br)₃NH₂(s)↓ + 3HBr',
        config: { note: '아닐린의 브로민화' }
    },
    {
        reactants: ['Aniline', 'NaNO2', 'HCl'].sort(),
        products: [{ id: 'Benzenediazonium chloride', count: 1 }],
        equation: 'C₆H₅NH₂ + NaNO₂ + 2HCl → [C₆H₅N₂]⁺Cl⁻ + NaCl + 2H₂O',
        config: { note: '다이아조화 반응' }
    },
    {
        reactants: ['Benzenediazonium chloride', 'CuCl'].sort(),
        products: [{ id: 'Chlorobenzene', count: 1 }, { id: 'N2', count: 1 }],
        equation: '[C₆H₅N₂]⁺Cl⁻ --(CuCl)--> C₆H₅Cl + N₂',
        config: { note: 'Sandmeyer 반응' }
    },
    {
        reactants: ['Benzenediazonium chloride', 'H2O'].sort(),
        products: [{ id: 'Phenol', count: 1 }, { id: 'N2', count: 1 }, { id: 'HCl', count: 1 }],
        equation: '[C₆H₅N₂]⁺Cl⁻ + H₂O → C₆H₅OH + N₂ + HCl',
        config: { note: '다이아조늄 염의 페놀 합성' }
    },
    {
        reactants: ['Benzenediazonium chloride', 'H3PO2'].sort(),
        products: [{ id: 'Benzene', count: 1 }, { id: 'N2', count: 1 }],
        equation: '[C₆H₅N₂]⁺Cl⁻ + H₃PO₂ + H₂O → C₆H₆ + N₂ + H₃PO₃ + HCl',
        config: { note: '다이아조늄 염의 환원' }
    },
    {
        reactants: ['Benzenediazonium chloride', 'Phenol'].sort(),
        products: [{ id: 'p-Hydroxyazobenzene', count: 1 }],
        equation: '[C₆H₅N₂]⁺Cl⁻ + C₆H₅OH → p-HOC₆H₄N=NC₆H₅',
        config: { note: '아조 커플링 반응 (주황색 염료)' }
    },
    {
        reactants: ['Malonic ester synthesis', 'Malonic ester', 'NaOEt', 'RX'].sort(),
        products: [{ id: 'Substituted carboxylic acid', count: 1 }],
        equation: 'CH₂(COOEt)₂ --(1. NaOEt 2. RX 3. H₃O⁺, heat)--> RCH₂COOH',
        config: { note: '말로닉 에스터 합성법' }
    },
    {
        reactants: ['Acetoacetic ester synthesis', 'Acetoacetic ester', 'NaOEt', 'RX'].sort(),
        products: [{ id: 'Substituted ketone', count: 1 }],
        equation: 'CH₃COCH₂COOEt --(1. NaOEt 2. RX 3. H₃O⁺, heat)--> CH₃COCH₂R',
        config: { note: '아세토아세트산 에스터 합성법' }
    },
    {
        reactants: ['Michael addition', 'alpha,beta-Unsaturated carbonyl', 'Nucleophile'].sort(),
        products: [{ id: '1,4-addition product', count: 1 }],
        equation: 'R₂C=CH-COR + Nu⁻ → Nu-CR₂-CH=C(O⁻)R',
        config: { note: '마이클 첨가 반응' }
    },
    {
        reactants: ['Robinson annulation', 'alpha,beta-Unsaturated ketone', 'Enolate'].sort(),
        products: [{ id: 'Cyclic ketone', count: 1 }],
        equation: 'Michael addition + Intramolecular aldol condensation',
        config: { note: '로빈슨 고리화 반응' }
    },
    {
        reactants: ['Carbohydrate', 'H2O'].sort(),
        products: [{ id: 'Monosaccharide', count: 'n' }],
        equation: '(C₆H₁₀O₅)n + nH₂O → nC₆H₁₂O₆',
        config: { note: '녹말의 가수분해' }
    },
    {
        reactants: ['Glucose', 'Yeast'].sort(),
        products: [{ id: 'Ethanol', count: 2 }, { id: 'CO2', count: 2 }],
        equation: 'C₆H₁₂O₆ --(Zymase)--> 2C₂H₅OH + 2CO₂',
        config: { note: '알코올 발효' }
    },
    {
        reactants: ['Amino acid', 'Amino acid'].sort(),
        products: [{ id: 'Dipeptide', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'H₂N-CHR-COOH + H₂N-CHR\'-COOH → H₂N-CHR-CO-NH-CHR\'-COOH + H₂O',
        config: { note: '펩타이드 결합 형성' }
    },
    {
        reactants: ['Fats', 'H2'].sort(),
        products: [{ id: 'Hardened fats', count: 1 }],
        equation: 'Unsaturated fat + H₂ --(Ni)--> Saturated fat',
        config: { note: '유지의 경화' }
    },
    {
        reactants: ['SO2Cl2', 'heat'].sort(),
        products: [{ id: 'SO2', count: 1 }, { id: 'Cl2', count: 1 }],
        equation: 'SO₂Cl₂ ⇌ SO₂ + Cl₂',
        config: { note: '열분해 평형' }
    },
    {
        reactants: ['PCl5', 'heat'].sort(),
        products: [{ id: 'PCl3', count: 1 }, { id: 'Cl2', count: 1 }],
        equation: 'PCl₅(g) ⇌ PCl₃(g) + Cl₂(g)',
        config: { note: '열분해 평형' }
    },
    {
        reactants: ['HI', 'heat'].sort(),
        products: [{ id: 'H2', count: 1 }, { id: 'I2', count: 1 }],
        equation: '2HI(g) ⇌ H₂(g) + I₂(g)',
        config: { note: '열분해 평형' }
    },
    {
        reactants: ['CaCO3', 'HCl'].sort(),
        products: [{ id: 'CaCl2', count: 1 }, { id: 'H2O', count: 1 }, { id: 'CO2', count: 1 }],
        equation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂'
    },
    {
        reactants: ['Na2SO3', 'HCl'].sort(),
        products: [{ id: 'NaCl', count: 2 }, { id: 'H2O', count: 1 }, { id: 'SO2', count: 1 }],
        equation: 'Na₂SO₃ + 2HCl → 2NaCl + H₂O + SO₂'
    },
    {
        reactants: ['FeS', 'HCl'].sort(),
        products: [{ id: 'FeCl2', count: 1 }, { id: 'H2S', count: 1 }],
        equation: 'FeS + 2HCl → FeCl₂ + H₂S'
    },
    {
        reactants: ['NH4Cl', 'NaOH'].sort(),
        products: [{ id: 'NaCl', count: 1 }, { id: 'H2O', count: 1 }, { id: 'NH3', count: 1 }],
        equation: 'NH₄Cl + NaOH → NaCl + H₂O + NH₃'
    },
    {
        reactants: ['(NH4)2SO4', 'NaOH'].sort(),
        products: [{ id: 'Na2SO4', count: 1 }, { id: 'H2O', count: 2 }, { id: 'NH3', count: 2 }],
        equation: '(NH₄)₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O + 2NH₃'
    },
    {
        reactants: ['Cu', 'O2', 'H2O', 'CO2'].sort(),
        products: [{ id: 'Cu2(OH)2CO3', count: 1 }],
        equation: '2Cu + O₂ + H₂O + CO₂ → Cu₂(OH)₂CO₃',
        config: { note: '구리 녹 (녹청)' }
    },
    {
        reactants: ['C', 'PbO'].sort(),
        products: [{ id: 'Pb', count: 2 }, { id: 'CO2', count: 1 }],
        equation: 'C + 2PbO → 2Pb + CO₂'
    },
    {
        reactants: ['Na', 'O2'].sort(),
        products: [{ id: 'Na2O2', count: 1 }],
        equation: '2Na + O₂ → Na₂O₂ (과산화나트륨)'
    },
    {
        reactants: ['B2O3', 'Mg'].sort(),
        products: [{ id: 'B', count: 2 }, { id: 'MgO', count: 3 }],
        equation: 'B₂O₃ + 3Mg → 2B + 3MgO'
    },
    {
        reactants: ['SiO2', 'Mg'].sort(),
        products: [{ id: 'Si', count: 1 }, { id: 'MgO', count: 2 }],
        equation: 'SiO₂ + 2Mg → Si + 2MgO'
    },
    {
        reactants: ['SiO2', 'C'].sort(),
        products: [{ id: 'SiC', count: 1 }, { id: 'CO', count: 2 }],
        equation: 'SiO₂ + 3C → SiC + 2CO'
    },
    {
        reactants: ['SiO2', 'NaOH'].sort(),
        products: [{ id: 'Na2SiO3', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'SiO₂ + 2NaOH → Na₂SiO₃ + H₂O',
        config: { note: '유리와 강염기 반응' }
    },
    {
        reactants: ['P4', 'NaOH', 'H2O'].sort(),
        products: [{ id: 'PH3', count: 1 }, { id: 'NaH2PO2', count: 3 }],
        equation: 'P₄ + 3NaOH + 3H₂O → PH₃ + 3NaH₂PO₂'
    },
    {
        reactants: ['Cl2', 'NaOH(cold,dilute)'].sort(),
        products: [{ id: 'NaCl', count: 1 }, { id: 'NaOCl', count: 1 }, { id: 'H2O', count: 1 }],
        equation: 'Cl₂ + 2NaOH → NaCl + NaOCl + H₂O'
    },
    {
        reactants: ['Cl2', 'NaOH(hot,conc)'].sort(),
        products: [{ id: 'NaCl', count: 5 }, { id: 'NaClO3', count: 1 }, { id: 'H2O', count: 3 }],
        equation: '3Cl₂ + 6NaOH → 5NaCl + NaClO₃ + 3H₂O'
    },
    {
        reactants: ['Br2', 'NaOH'].sort(),
        products: [{ id: 'NaBr', count: 5 }, { id: 'NaBrO3', count: 1 }, { id: 'H2O', count: 3 }],
        equation: '3Br₂ + 6NaOH → 5NaBr + NaBrO₃ + 3H₂O'
    },
    {
        reactants: ['I2', 'NaOH'].sort(),
        products: [{ id: 'NaI', count: 5 }, { id: 'NaIO3', count: 1 }, { id: 'H2O', count: 3 }],
        equation: '3I₂ + 6NaOH → 5NaI + NaIO₃ + 3H₂O'
    },
    {
        reactants: ['S', 'H2SO4(conc)'].sort(),
        products: [{ id: 'SO2', count: 3 }, { id: 'H2O', count: 2 }],
        equation: 'S + 2H₂SO₄ → 3SO₂ + 2H₂O'
    },
    {
        reactants: ['C', 'H2SO4(conc)'].sort(),
        products: [{ id: 'CO2', count: 1 }, { id: 'SO2', count: 2 }, { id: 'H2O', count: 2 }],
        equation: 'C + 2H₂SO₄ → CO₂ + 2SO₂ + 2H₂O'
    },
    {
        reactants: ['P4', 'H2SO4(conc)'].sort(),
        products: [{ id: 'H3PO4', count: 4 }, { id: 'SO2', count: 10 }, { id: 'H2O', count: 4 }],
        equation: 'P₄ + 10H₂SO₄ → 4H₃PO₄ + 10SO₂ + 4H₂O'
    },
    {
        reactants: ['Xe', 'F2'].sort(),
        products: [{ id: 'XeF2', count: 1 }],
        equation: 'Xe(g) + F₂(g) --(Ni tube, 673K, 1bar)--> XeF₂(s)',
        config: { note: '제논 화합물 합성' }
    },
    {
        reactants: ['Xe', 'F2'].sort(),
        products: [{ id: 'XeF4', count: 1 }],
        equation: 'Xe(g) + 2F₂(g) --(873K, 7bar)--> XeF₄(s)',
        config: { note: '제논 화합물 합성' }
    },
    {
        reactants: ['Xe', 'F2'].sort(),
        products: [{ id: 'XeF6', count: 1 }],
        equation: 'Xe(g) + 3F₂(g) --(573K, 60-70bar)--> XeF₆(s)',
        config: { note: '제논 화합물 합성' }
    },
    {
        reactants: ['XeF4', 'O2F2'].sort(),
        products: [{ id: 'XeF6', count: 1 }, { id: 'O2', count: 1 }],
        equation: 'XeF₄ + O₂F₂ → XeF₆ + O₂'
    },
    {
        reactants: ['XeF2', 'H2O'].sort(),
        products: [{ id: 'Xe', count: 2 }, { id: 'HF', count: 4 }, { id: 'O2', count: 1 }],
        equation: '2XeF₂ + 2H₂O → 2Xe + 4HF + O₂'
    },
    {
        reactants: ['XeF4', 'H2O'].sort(),
        products: [{ id: 'Xe', count: 4 }, { id: 'XeO3', count: 2 }, { id: 'HF', count: 24 }, { id: 'O2', count: 3 }],
        equation: '6XeF₄ + 12H₂O → 4Xe + 2XeO₃ + 24HF + 3O₂'
    },
    {
        reactants: ['XeF6', 'PF5'].sort(),
        products: [{ id: '[XeF5]+[PF6]-', count: 1 }],
        equation: 'XeF₆ + PF₅ → [XeF₅]⁺[PF₆]⁻'
    },
    {
        reactants: ['XeF2', 'SbF5'].sort(),
        products: [{ id: '[XeF]+[SbF6]-', count: 1 }],
        equation: 'XeF₂ + SbF₅ → [XeF]⁺[SbF₆]⁻'
    },
    {
        reactants: ['H2O(ice)', 'H2O(liquid)'].sort(),
        products: [],
        equation: 'H₂O(s) ⇌ H₂O(l)',
        config: { note: '물의 상평형 (녹는점/어는점)' }
    },
    {
        reactants: ['H2O(liquid)', 'H2O(gas)'].sort(),
        products: [],
        equation: 'H₂O(l) ⇌ H₂O(g)',
        config: { note: '물의 상평형 (끓는점/응축)' }
    },
    {
        reactants: ['CO2(solid)', 'CO2(gas)'].sort(),
        products: [],
        equation: 'CO₂(s) ⇌ CO₂(g)',
        config: { note: '드라이아이스 승화' }
    },
    {
        reactants: ['I2(solid)', 'I2(gas)'].sort(),
        products: [],
        equation: 'I₂(s) ⇌ I₂(g)',
        config: { note: '아이오딘 승화' }
    },
    {
        reactants: ['CuSO4.5H2O', 'heat'].sort(),
        products: [{ id: 'CuSO4', count: 1 }, { id: 'H2O', count: 5 }],
        equation: 'CuSO₄·5H₂O(s) → CuSO₄(s) + 5H₂O(g)',
        config: { note: '황산구리 수화물의 탈수' }
    },
    {
        reactants: ['CuSO4', 'H2O'].sort(),
        products: [{ id: 'CuSO4.5H2O', count: 1 }],
        equation: 'CuSO₄(s) + 5H₂O(l) → CuSO₄·5H₂O(s)',
        config: { note: '무수 황산구리의 수화' }
    },
    {
        reactants: ['Diamond', 'Graphite'].sort(),
        products: [],
        equation: 'C(diamond) → C(graphite)',
        config: { note: '탄소 동소체 간의 전환 (흑연이 더 안정)' }
    },
    {
        reactants: ['S8(rhombic)', 'S8(monoclinic)'].sort(),
        products: [],
        equation: 'S₈(사방황) ⇌ S₈(단사황)',
        config: { note: '황 동소체 간의 전환' }
    },
    {
        reactants: ['O2', 'light'].sort(),
        products: [{ id: 'O', count: 2 }],
        equation: 'O₂ --(UV)--> 2O',
        config: { note: '산소 분자의 광분해' }
    },
    {
        reactants: ['NO2', 'light'].sort(),
        products: [{ id: 'NO', count: 1 }, { id: 'O', count: 1 }],
        equation: 'NO₂ --(UV)--> NO + O',
        config: { note: '이산화질소의 광분해 (광화학 스모그)' }
    }
]; 