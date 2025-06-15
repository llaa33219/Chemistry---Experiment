document.addEventListener('DOMContentLoaded', () => {

    // Matter.js 모듈 별칭 설정
    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Constraint = Matter.Constraint,
        Events = Matter.Events,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Body = Matter.Body,
        Query = Matter.Query;

    // DOM 요소 가져오기
    const beakerContainer = document.getElementById('beaker-container');
    const tooltip = document.getElementById('tooltip');
    const compoundsDropdown = document.getElementById('compounds-dropdown');
    const toolsDropdown = document.getElementById('tools-dropdown');
    const directControlsContainer = document.getElementById('direct-controls');
    const equationsContainer = document.getElementById('equations');
    const tempDisplay = document.getElementById('temp-display');
    const pressureDisplay = document.getElementById('pressure-display');
    const periodicTableContainer = document.getElementById('periodic-table-container');
    const periodicTable = document.getElementById('periodic-table');
    const elementsButton = document.getElementById('elements-button');
    const closePeriodicTableButton = document.getElementById('close-periodic-table');

    const width = beakerContainer.clientWidth;
    const height = beakerContainer.clientHeight;

    // Matter.js 엔진 생성
    const engine = Engine.create({
        // 입자가 빠르게 움직일 때 벽을 통과하는 현상(터널링)을 줄이기 위해 반복 횟수 증가
        positionIterations: 10,
        velocityIterations: 8,
        enableSleeping: true // 입자가 많아질 때 성능 향상 및 안정화를 위해 슬리핑 활성화
    });
    const world = engine.world;
    world.gravity.y = 0.5; // 중력 설정

    // 렌더러 생성
    const render = Render.create({
        element: beakerContainer,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: false,
            background: 'transparent',
            showSleeping: false // 슬리핑 상태를 시각적으로 표시하지 않음 (반투명 효과 제거)
        }
    });

    Render.run(render);

    // 슬리핑 입자가 반투명해지는 현상을 막기 위한 최종 해결책
    Events.on(render, 'beforeRender', () => {
        const bodies = Composite.allBodies(world);
        for (const body of bodies) {
            // isSleeping 상태를 직접 확인하여 투명도를 1로 고정
            if (body.isSleeping) {
                body.render.opacity = 1;
            }
        }
    });

    // 캔버스 포인터 이벤트 활성화
    render.canvas.style.pointerEvents = 'auto';

    // 러너 생성 및 실행
    const runner = Runner.create();
    Runner.run(runner, engine);

    // 비커 경계 생성 (선으로 표현)
    const wallThickness = 20; // 선 두께 (터널링 방지를 위해 두껍게 설정)
    const beakerBottomY = 570;
    const beakerHeight = 550;
    const beakerBottomWidth = 350;
    const beakerTopWidth = 400;
    
    const beakerLeftX_bottom = (width - beakerBottomWidth) / 2;
    const beakerRightX_bottom = width - beakerLeftX_bottom;
    const beakerLeftX_top = (width - beakerTopWidth) / 2;
    const beakerRightX_top = width - beakerLeftX_top;
    const beakerTopY = beakerBottomY - beakerHeight;

    const beakerWallRender = {
        fillStyle: '#a0a0b0'
    };

    const bottomWall = Bodies.rectangle(width / 2, beakerBottomY, beakerBottomWidth, wallThickness, {
        isStatic: true,
        render: beakerWallRender
    });

    const leftWall_dx = beakerLeftX_top - beakerLeftX_bottom;
    const leftWall_dy = beakerTopY - beakerBottomY;
    const leftWall_len = Math.hypot(leftWall_dx, leftWall_dy);
    const leftWall_angle = Math.atan2(leftWall_dy, leftWall_dx);
    const leftWall = Bodies.rectangle(
        beakerLeftX_bottom + leftWall_dx / 2, 
        beakerBottomY + leftWall_dy / 2, 
        leftWall_len, 
        wallThickness, {
        isStatic: true,
        angle: leftWall_angle,
        render: beakerWallRender
    });

    const rightWall_dx = beakerRightX_top - beakerRightX_bottom;
    const rightWall_dy = beakerTopY - beakerBottomY;
    const rightWall_len = Math.hypot(rightWall_dx, rightWall_dy);
    const rightWall_angle = Math.atan2(rightWall_dy, rightWall_dx);
    const rightWall = Bodies.rectangle(
        beakerRightX_bottom + rightWall_dx / 2, 
        beakerBottomY + rightWall_dy / 2, 
        rightWall_len, 
        wallThickness, {
        isStatic: true,
        angle: rightWall_angle,
        render: beakerWallRender
    });

    const beakerWalls = [bottomWall, leftWall, rightWall];
    Composite.add(world, beakerWalls);

    // 가열 및 냉각판 생성 (비커 바로 아래 위치)
    const heatingPlate = Bodies.rectangle(width / 2, beakerBottomY + 25, beakerBottomWidth + 20, 30, {
        isStatic: true,
        label: 'heatingPlate',
        friction: 0.9,
        render: { fillStyle: '#ff4444' }
    });
    const coolingPlate = Bodies.rectangle(width / 2, beakerBottomY + 25, beakerBottomWidth + 20, 30, {
        isStatic: true,
        label: 'coolingPlate',
        friction: 0.9,
        render: { fillStyle: '#4444ff' }
    });
    
    // 마우스 컨트롤 추가
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });
    Composite.add(world, mouseConstraint);

    // 입자 최대 속도 제한 (터널링 방지)
    const maxSpeed = 8; // 더 낮춤
    Events.on(engine, 'beforeUpdate', () => {
        const bodies = Composite.allBodies(world);
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (body.isStatic) continue;

            const speed = Matter.Vector.magnitude(body.velocity);
            if (speed > maxSpeed) {
                // 속도를 점진적으로 감소시킴
                const dampingFactor = 0.95;
                Body.setVelocity(body, Matter.Vector.mult(body.velocity, dampingFactor));
            }
        }
    });

    // 현재 선택된 물질
    let selectedSubstance = null;
    let lid = null;
    let isLidOn = false;
    let isMouseDown = false;
    let lastSpawnTime = 0;
    const spawnInterval = 50; // 50ms 마다 생성 (0.05초)
    let pressureImpulse = 0;
    let heatingInterval = null;
    let coolingInterval = null;
    let isHeating = false;
    let isCooling = false;

    // 기체 물질 목록 (실제 기체만 포함하도록 수정)
    const gases = ['H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn', 'H2', 'CO2', 'NH3', 'CH4', 'HCl', 'NO', 'NO2', 'SO2'];

    // 주기율표 데이터
    const fullPeriodicTable = {
        'H': { name: 'Hydrogen', symbol: 'H', atomicNumber: 1, mass: 1.008, radius: 4, color: '#FFFFFF' }, 'He': { name: 'Helium', symbol: 'He', atomicNumber: 2, mass: 4.0026, radius: 3, color: '#D9FFFF' },
        'Li': { name: 'Lithium', symbol: 'Li', atomicNumber: 3, mass: 6.94, radius: 8, color: '#CC80FF' }, 'Be': { name: 'Beryllium', symbol: 'Be', atomicNumber: 4, mass: 9.0122, radius: 7, color: '#C2FF00' },
        'B': { name: 'Boron', symbol: 'B', atomicNumber: 5, mass: 10.81, radius: 6, color: '#FFB5B5' }, 'C': { name: 'Carbon', symbol: 'C', atomicNumber: 6, mass: 12.011, radius: 6, color: '#909090' },
        'N': { name: 'Nitrogen', symbol: 'N', atomicNumber: 7, mass: 14.007, radius: 5, color: '#3050F8' }, 'O': { name: 'Oxygen', symbol: 'O', atomicNumber: 8, mass: 15.999, radius: 5, color: '#FF0D0D' },
        'F': { name: 'Fluorine', symbol: 'F', atomicNumber: 9, mass: 18.998, radius: 4, color: '#90E050' }, 'Ne': { name: 'Neon', symbol: 'Ne', atomicNumber: 10, mass: 20.180, radius: 4, color: '#B3E3F5' },
        'Na': { name: 'Sodium', symbol: 'Na', atomicNumber: 11, mass: 22.990, radius: 10, color: '#AB5CF2' }, 'Mg': { name: 'Magnesium', symbol: 'Mg', atomicNumber: 12, mass: 24.305, radius: 9, color: '#8AFF00' },
        'Al': { name: 'Aluminium', symbol: 'Al', atomicNumber: 13, mass: 26.982, radius: 9, color: '#BFA6A6' }, 'Si': { name: 'Silicon', symbol: 'Si', atomicNumber: 14, mass: 28.085, radius: 8, color: '#F0C8A0' },
        'P': { name: 'Phosphorus', symbol: 'P', atomicNumber: 15, mass: 30.974, radius: 7, color: '#FF8000' }, 'S': { name: 'Sulfur', symbol: 'S', atomicNumber: 16, mass: 32.06, radius: 7, color: '#FFFF30' },
        'Cl': { name: 'Chlorine', symbol: 'Cl', atomicNumber: 17, mass: 35.45, radius: 6, color: '#1FF01F' }, 'Ar': { name: 'Argon', symbol: 'Ar', atomicNumber: 18, mass: 39.948, radius: 6, color: '#80D1E3' },
        'K': { name: 'Potassium', symbol: 'K', atomicNumber: 19, mass: 39.098, radius: 13, color: '#8F40D4' }, 'Ca': { name: 'Calcium', symbol: 'Ca', atomicNumber: 20, mass: 40.078, radius: 11, color: '#3DFF00' },
        'Sc': { name: 'Scandium', symbol: 'Sc', atomicNumber: 21, mass: 44.956, radius: 11, color: '#E6E6E6' }, 'Ti': { name: 'Titanium', symbol: 'Ti', atomicNumber: 22, mass: 47.867, radius: 10, color: '#BFC2C7' },
        'V': { name: 'Vanadium', symbol: 'V', atomicNumber: 23, mass: 50.942, radius: 10, color: '#A6A6AB' }, 'Cr': { name: 'Chromium', symbol: 'Cr', atomicNumber: 24, mass: 51.996, radius: 10, color: '#8A99C7' },
        'Mn': { name: 'Manganese', symbol: 'Mn', atomicNumber: 25, mass: 54.938, radius: 10, color: '#9CC2C7' }, 'Fe': { name: 'Iron', symbol: 'Fe', atomicNumber: 26, mass: 55.845, radius: 10, color: '#E06633' },
        'Co': { name: 'Cobalt', symbol: 'Co', atomicNumber: 27, mass: 58.933, radius: 9, color: '#F090A0' }, 'Ni': { name: 'Nickel', symbol: 'Ni', atomicNumber: 28, mass: 58.693, radius: 9, color: '#50D050' },
        'Cu': { name: 'Copper', symbol: 'Cu', atomicNumber: 29, mass: 63.546, radius: 9, color: '#C88033' }, 'Zn': { name: 'Zinc', symbol: 'Zn', atomicNumber: 30, mass: 65.38, radius: 9, color: '#7D80B0' },
        'Ga': { name: 'Gallium', symbol: 'Ga', atomicNumber: 31, mass: 69.723, radius: 9, color: '#C28F8F' }, 'Ge': { name: 'Germanium', symbol: 'Ge', atomicNumber: 32, mass: 72.63, radius: 8, color: '#668F8F' },
        'As': { name: 'Arsenic', symbol: 'As', atomicNumber: 33, mass: 74.922, radius: 8, color: '#BD80E3' }, 'Se': { name: 'Selenium', symbol: 'Se', atomicNumber: 34, mass: 78.971, radius: 7, color: '#FFA100' },
        'Br': { name: 'Bromine', symbol: 'Br', atomicNumber: 35, mass: 79.904, radius: 7, color: '#A62929' }, 'Kr': { name: 'Krypton', symbol: 'Kr', atomicNumber: 36, mass: 83.798, radius: 7, color: '#5CB8D1' },
        'Rb': { name: 'Rubidium', symbol: 'Rb', atomicNumber: 37, mass: 85.468, radius: 14, color: '#702EB0' }, 'Sr': { name: 'Strontium', symbol: 'Sr', atomicNumber: 38, mass: 87.62, radius: 12, color: '#00FF00' },
        'Y': { name: 'Yttrium', symbol: 'Y', atomicNumber: 39, mass: 88.906, radius: 12, color: '#94FFFF' }, 'Zr': { name: 'Zirconium', symbol: 'Zr', atomicNumber: 40, mass: 91.224, radius: 11, color: '#94E0E0' },
        'Nb': { name: 'Niobium', symbol: 'Nb', atomicNumber: 41, mass: 92.906, radius: 11, color: '#73C2C9' }, 'Mo': { name: 'Molybdenum', symbol: 'Mo', atomicNumber: 42, mass: 95.96, radius: 11, color: '#54B5B5' },
        'Tc': { name: 'Technetium', symbol: 'Tc', atomicNumber: 43, mass: 98, radius: 10, color: '#3B9E9E' }, 'Ru': { name: 'Ruthenium', symbol: 'Ru', atomicNumber: 44, mass: 101.07, radius: 10, color: '#248F8F' },
        'Rh': { name: 'Rhodium', symbol: 'Rh', atomicNumber: 45, mass: 102.91, radius: 10, color: '#0A7D8C' }, 'Pd': { name: 'Palladium', symbol: 'Pd', atomicNumber: 46, mass: 106.42, radius: 10, color: '#006985' },
        'Ag': { name: 'Silver', symbol: 'Ag', atomicNumber: 47, mass: 107.87, radius: 10, color: '#C0C0C0' }, 'Cd': { name: 'Cadmium', symbol: 'Cd', atomicNumber: 48, mass: 112.41, radius: 10, color: '#FFD98F' },
        'In': { name: 'Indium', symbol: 'In', atomicNumber: 49, mass: 114.82, radius: 10, color: '#A67573' }, 'Sn': { name: 'Tin', symbol: 'Sn', atomicNumber: 50, mass: 118.71, radius: 9, color: '#668080' },
        'Sb': { name: 'Antimony', symbol: 'Sb', atomicNumber: 51, mass: 121.76, radius: 9, color: '#9E63B5' }, 'Te': { name: 'Tellurium', symbol: 'Te', atomicNumber: 52, mass: 127.60, radius: 9, color: '#D47A00' },
        'I': { name: 'Iodine', symbol: 'I', atomicNumber: 53, mass: 126.90, radius: 8, color: '#940094' }, 'Xe': { name: 'Xenon', symbol: 'Xe', atomicNumber: 54, mass: 131.29, radius: 8, color: '#429EB0' },
        'Cs': { name: 'Caesium', symbol: 'Cs', atomicNumber: 55, mass: 132.91, radius: 15, color: '#57178F' }, 'Ba': { name: 'Barium', symbol: 'Ba', atomicNumber: 56, mass: 137.33, radius: 13, color: '#00C900' },
        'La': { name: 'Lanthanum', symbol: 'La', atomicNumber: 57, mass: 138.91, radius: 13, color: '#70D4FF' }, 'Ce': { name: 'Cerium', symbol: 'Ce', atomicNumber: 58, mass: 140.12, radius: 13, color: '#FFFFC7' },
        'Pr': { name: 'Praseodymium', symbol: 'Pr', atomicNumber: 59, mass: 140.91, radius: 12, color: '#D9FFC7' }, 'Nd': { name: 'Neodymium', symbol: 'Nd', atomicNumber: 60, mass: 144.24, radius: 12, color: '#C7FFC7' },
        'Pm': { name: 'Promethium', symbol: 'Pm', atomicNumber: 61, mass: 145, radius: 12, color: '#A3FFC7' }, 'Sm': { name: 'Samarium', symbol: 'Sm', atomicNumber: 62, mass: 150.36, radius: 12, color: '#8FFFC7' },
        'Eu': { name: 'Europium', symbol: 'Eu', atomicNumber: 63, mass: 151.96, radius: 12, color: '#61FFC7' }, 'Gd': { name: 'Gadolinium', symbol: 'Gd', atomicNumber: 64, mass: 157.25, radius: 12, color: '#45FFC7' },
        'Tb': { name: 'Terbium', symbol: 'Tb', atomicNumber: 65, mass: 158.93, radius: 11, color: '#30FFC7' }, 'Dy': { name: 'Dysprosium', symbol: 'Dy', atomicNumber: 66, mass: 162.50, radius: 11, color: '#1FFFC7' },
        'Ho': { name: 'Holmium', symbol: 'Ho', atomicNumber: 67, mass: 164.93, radius: 11, color: '#00FF9C' }, 'Er': { name: 'Erbium', symbol: 'Er', atomicNumber: 68, mass: 167.26, radius: 11, color: '#00E675' },
        'Tm': { name: 'Thulium', symbol: 'Tm', atomicNumber: 69, mass: 168.93, radius: 11, color: '#00D452' }, 'Yb': { name: 'Ytterbium', symbol: 'Yb', atomicNumber: 70, mass: 173.05, radius: 11, color: '#00BF38' },
        'Lu': { name: 'Lutetium', symbol: 'Lu', atomicNumber: 71, mass: 174.97, radius: 11, color: '#00AB24' }, 'Hf': { name: 'Hafnium', symbol: 'Hf', atomicNumber: 72, mass: 178.49, radius: 11, color: '#4DC2FF' },
        'Ta': { name: 'Tantalum', symbol: 'Ta', atomicNumber: 73, mass: 180.95, radius: 10, color: '#4DA6FF' }, 'W': { name: 'Tungsten', symbol: 'W', atomicNumber: 74, mass: 183.84, radius: 10, color: '#2194D6' },
        'Re': { name: 'Rhenium', symbol: 'Re', atomicNumber: 75, mass: 186.21, radius: 10, color: '#267DAB' }, 'Os': { name: 'Osmium', symbol: 'Os', atomicNumber: 76, mass: 190.23, radius: 10, color: '#266696' },
        'Ir': { name: 'Iridium', symbol: 'Ir', atomicNumber: 77, mass: 192.22, radius: 9, color: '#175487' }, 'Pt': { name: 'Platinum', symbol: 'Pt', atomicNumber: 78, mass: 195.08, radius: 9, color: '#D0D0E0' },
        'Au': { name: 'Gold', symbol: 'Au', atomicNumber: 79, mass: 196.97, radius: 9, color: '#FFD123' }, 'Hg': { name: 'Mercury', symbol: 'Hg', atomicNumber: 80, mass: 200.59, radius: 9, color: '#B8B8D0' },
        'Tl': { name: 'Thallium', symbol: 'Tl', atomicNumber: 81, mass: 204.38, radius: 9, color: '#A6544D' }, 'Pb': { name: 'Lead', symbol: 'Pb', atomicNumber: 82, mass: 207.2, radius: 9, color: '#575961' },
        'Bi': { name: 'Bismuth', symbol: 'Bi', atomicNumber: 83, mass: 208.98, radius: 9, color: '#9E4FB5' }, 'Po': { name: 'Polonium', symbol: 'Po', atomicNumber: 84, mass: 209, radius: 8, color: '#AB5C00' },
        'At': { name: 'Astatine', symbol: 'At', atomicNumber: 85, mass: 210, radius: 8, color: '#754F45' }, 'Rn': { name: 'Radon', symbol: 'Rn', atomicNumber: 86, mass: 222, radius: 8, color: '#428296' },
        'Fr': { name: 'Francium', symbol: 'Fr', atomicNumber: 87, mass: 223, radius: 15, color: '#420066' }, 'Ra': { name: 'Radium', symbol: 'Ra', atomicNumber: 88, mass: 226, radius: 13, color: '#007D00' },
        'Ac': { name: 'Actinium', symbol: 'Ac', atomicNumber: 89, mass: 227, radius: 13, color: '#70ABFA' }, 'Th': { name: 'Thorium', symbol: 'Th', atomicNumber: 90, mass: 232.04, radius: 13, color: '#00BAFF' },
        'Pa': { name: 'Protactinium', symbol: 'Pa', atomicNumber: 91, mass: 231.04, radius: 12, color: '#00A1FF' }, 'U': { name: 'Uranium', symbol: 'U', atomicNumber: 92, mass: 238.03, radius: 12, color: '#008FFF' },
        'Np': { name: 'Neptunium', symbol: 'Np', atomicNumber: 93, mass: 237, radius: 12, color: '#0080FF' }, 'Pu': { name: 'Plutonium', symbol: 'Pu', atomicNumber: 94, mass: 244, radius: 12, color: '#006BFF' },
        'Am': { name: 'Americium', symbol: 'Am', atomicNumber: 95, mass: 243, radius: 12, color: '#545CF2' }, 'Cm': { name: 'Curium', symbol: 'Cm', atomicNumber: 96, mass: 247, radius: 12, color: '#785CE3' },
        'Bk': { name: 'Berkelium', symbol: 'Bk', atomicNumber: 97, mass: 247, radius: 12, color: '#8A4FE3' }, 'Cf': { name: 'Californium', symbol: 'Cf', atomicNumber: 98, mass: 251, radius: 11, color: '#A136D4' },
        'Es': { name: 'Einsteinium', symbol: 'Es', atomicNumber: 99, mass: 252, radius: 11, color: '#B31FD4' }, 'Fm': { name: 'Fermium', symbol: 'Fm', atomicNumber: 100, mass: 257, radius: 11, color: '#B31FBA' },
        'Md': { name: 'Mendelevium', symbol: 'Md', atomicNumber: 101, mass: 258, radius: 11, color: '#B30DA6' }, 'No': { name: 'Nobelium', symbol: 'No', atomicNumber: 102, mass: 259, radius: 11, color: '#BD0D87' },
        'Lr': { name: 'Lawrencium', symbol: 'Lr', atomicNumber: 103, mass: 262, radius: 10, color: '#C70066' }, 'Rf': { name: 'Rutherfordium', symbol: 'Rf', atomicNumber: 104, mass: 267, radius: 10, color: '#CC0059' },
        'Db': { name: 'Dubnium', symbol: 'Db', atomicNumber: 105, mass: 270, radius: 10, color: '#D1004F' }, 'Sg': { name: 'Seaborgium', symbol: 'Sg', atomicNumber: 106, mass: 271, radius: 10, color: '#D90045' },
        'Bh': { name: 'Bohrium', symbol: 'Bh', atomicNumber: 107, mass: 270, radius: 9, color: '#E00038' }, 'Hs': { name: 'Hassium', symbol: 'Hs', atomicNumber: 108, mass: 277, radius: 9, color: '#E6002E' },
        'Mt': { name: 'Meitnerium', symbol: 'Mt', atomicNumber: 109, mass: 276, radius: 9, color: '#EB0026' }, 'Ds': { name: 'Darmstadtium', symbol: 'Ds', atomicNumber: 110, mass: 281, radius: 9, color: '#ED0021' },
        'Rg': { name: 'Roentgenium', symbol: 'Rg', atomicNumber: 111, mass: 280, radius: 8, color: '#F0001C' }, 'Cn': { name: 'Copernicium', symbol: 'Cn', atomicNumber: 112, mass: 285, radius: 8, color: '#F20017' },
        'Nh': { name: 'Nihonium', symbol: 'Nh', atomicNumber: 113, mass: 284, radius: 8, color: '#F50012' }, 'Fl': { name: 'Flerovium', symbol: 'Fl', atomicNumber: 114, mass: 289, radius: 8, color: '#F7000D' },
        'Mc': { name: 'Moscovium', symbol: 'Mc', atomicNumber: 115, mass: 288, radius: 8, color: '#FA0008' }, 'Lv': { name: 'Livermorium', symbol: 'Lv', atomicNumber: 116, mass: 293, radius: 8, color: '#FC0003' },
        'Ts': { name: 'Tennessine', symbol: 'Ts', atomicNumber: 117, mass: 294, radius: 7, color: '#FE0001' }, 'Og': { name: 'Oganesson', symbol: 'Og', atomicNumber: 118, mass: 294, radius: 7, color: '#FF0000' }
    };

    const elementPositions = {
        1: { r: 1, c: 1 }, 2: { r: 1, c: 18 },
        3: { r: 2, c: 1 }, 4: { r: 2, c: 2 }, 5: { r: 2, c: 13 }, 6: { r: 2, c: 14 }, 7: { r: 2, c: 15 }, 8: { r: 2, c: 16 }, 9: { r: 2, c: 17 }, 10: { r: 2, c: 18 },
        11: { r: 3, c: 1 }, 12: { r: 3, c: 2 }, 13: { r: 3, c: 13 }, 14: { r: 3, c: 14 }, 15: { r: 3, c: 15 }, 16: { r: 3, c: 16 }, 17: { r: 3, c: 17 }, 18: { r: 3, c: 18 },
        19: { r: 4, c: 1 }, 20: { r: 4, c: 2 }, 21: { r: 4, c: 3 }, 22: { r: 4, c: 4 }, 23: { r: 4, c: 5 }, 24: { r: 4, c: 6 }, 25: { r: 4, c: 7 }, 26: { r: 4, c: 8 }, 27: { r: 4, c: 9 }, 28: { r: 4, c: 10 }, 29: { r: 4, c: 11 }, 30: { r: 4, c: 12 }, 31: { r: 4, c: 13 }, 32: { r: 4, c: 14 }, 33: { r: 4, c: 15 }, 34: { r: 4, c: 16 }, 35: { r: 4, c: 17 }, 36: { r: 4, c: 18 },
        37: { r: 5, c: 1 }, 38: { r: 5, c: 2 }, 39: { r: 5, c: 3 }, 40: { r: 5, c: 4 }, 41: { r: 5, c: 5 }, 42: { r: 5, c: 6 }, 43: { r: 5, c: 7 }, 44: { r: 5, c: 8 }, 45: { r: 5, c: 9 }, 46: { r: 5, c: 10 }, 47: { r: 5, c: 11 }, 48: { r: 5, c: 12 }, 49: { r: 5, c: 13 }, 50: { r: 5, c: 14 }, 51: { r: 5, c: 15 }, 52: { r: 5, c: 16 }, 53: { r: 5, c: 17 }, 54: { r: 5, c: 18 },
        55: { r: 6, c: 1 }, 56: { r: 6, c: 2 }, 
        57: { r: 8, c: 3 }, 58: { r: 8, c: 4 }, 59: { r: 8, c: 5 }, 60: { r: 8, c: 6 }, 61: { r: 8, c: 7 }, 62: { r: 8, c: 8 }, 63: { r: 8, c: 9 }, 64: { r: 8, c: 10 }, 65: { r: 8, c: 11 }, 66: { r: 8, c: 12 }, 67: { r: 8, c: 13 }, 68: { r: 8, c: 14 }, 69: { r: 8, c: 15 }, 70: { r: 8, c: 16 }, 71: { r: 8, c: 17 },
        72: { r: 6, c: 4 }, 73: { r: 6, c: 5 }, 74: { r: 6, c: 6 }, 75: { r: 6, c: 7 }, 76: { r: 6, c: 8 }, 77: { r: 6, c: 9 }, 78: { r: 6, c: 10 }, 79: { r: 6, c: 11 }, 80: { r: 6, c: 12 }, 81: { r: 6, c: 13 }, 82: { r: 6, c: 14 }, 83: { r: 6, c: 15 }, 84: { r: 6, c: 16 }, 85: { r: 6, c: 17 }, 86: { r: 6, c: 18 },
        87: { r: 7, c: 1 }, 88: { r: 7, c: 2 }, 
        89: { r: 9, c: 3 }, 90: { r: 9, c: 4 }, 91: { r: 9, c: 5 }, 92: { r: 9, c: 6 }, 93: { r: 9, c: 7 }, 94: { r: 9, c: 8 }, 95: { r: 9, c: 9 }, 96: { r: 9, c: 10 }, 97: { r: 9, c: 11 }, 98: { r: 9, c: 12 }, 99: { r: 9, c: 13 }, 100: { r: 9, c: 14 }, 101: { r: 9, c: 15 }, 102: { r: 9, c: 16 }, 103: { r: 9, c: 17 },
        104: { r: 7, c: 4 }, 105: { r: 7, c: 5 }, 106: { r: 7, c: 6 }, 107: { r: 7, c: 7 }, 108: { r: 7, c: 8 }, 109: { r: 7, c: 9 }, 110: { r: 7, c: 10 }, 111: { r: 7, c: 11 }, 112: { r: 7, c: 12 }, 113: { r: 7, c: 13 }, 114: { r: 7, c: 14 }, 115: { r: 7, c: 15 }, 116: { r: 7, c: 16 }, 117: { r: 7, c: 17 }, 118: { r: 7, c: 18 }
    };

    // 화합물 및 특수 액션 정의
    const compounds = {
        'H2O': { name: '물', create: (x, y) => Bodies.circle(x, y, 5, { restitution: 0.5, friction: 0.02, density: 0.001, label: 'H2O', render: { fillStyle: '#a0c0ff' } }) },
        'NaCl': { name: '소금', create: (x, y) => Bodies.circle(x, y, 8, { restitution: 0.1, friction: 0.1, density: 0.00217, label: 'NaCl', render: { fillStyle: '#ffffff', strokeStyle: '#aaaaaa', lineWidth: 2 } }) },
        'NaOH': { name: '수산화나트륨', create: (x, y) => Bodies.circle(x, y, 9, { restitution: 0.4, friction: 0.08, density: 0.00213, label: 'NaOH', render: { fillStyle: '#f0e0f0' } }) },
        'H2': { name: '수소 기체', create: (x, y) => Bodies.circle(x, y, 3, { restitution: 0.9, friction: 0.01, density: 0.00001, label: 'H2', render: { fillStyle: '#ffffff', strokeStyle: '#eeeeee', lineWidth: 1 } }) },
        'HCl': { name: '염화수소', create: (x, y) => Bodies.circle(x, y, 4, { restitution: 0.8, friction: 0.01, density: 0.001, label: 'HCl', render: { fillStyle: '#90ee90', strokeStyle: '#A0A0A0', lineWidth: 1 } }) },
        'O2': { name: '산소', create: (x, y) => Bodies.circle(x, y, 5, { restitution: 0.6, friction: 0.05, density: 0.0014, label: 'O2', render: { fillStyle: '#ff4040' } }) },
        'CO2': { name: '이산화탄소', create: (x, y) => Bodies.circle(x, y, 6, { restitution: 0.7, friction: 0.02, density: 0.0019, label: 'CO2', render: { fillStyle: '#c0c0c0' } }) },
        'CH4': { name: '메테인', create: (x, y) => Bodies.circle(x, y, 7, { restitution: 0.7, friction: 0.02, density: 0.0006, label: 'CH4', render: { fillStyle: '#a0ffa0' } }) },
        'NH3': { name: '암모니아', create: (x, y) => Bodies.circle(x, y, 6, { restitution: 0.7, friction: 0.02, density: 0.0007, label: 'NH3', render: { fillStyle: '#c0c0ff' } }) },
        'AgNO3': { name: '질산 은', create: (x, y) => Bodies.circle(x, y, 8, { restitution: 0.3, friction: 0.1, density: 0.0043, label: 'AgNO3', render: { fillStyle: '#e0e0e0', strokeStyle: '#808080', lineWidth: 2 } }) },
        'AgCl': { name: '염화 은', create: (x, y) => Bodies.circle(x, y, 8, { restitution: 0.1, friction: 0.8, density: 0.0055, label: 'AgCl', render: { fillStyle: '#fafafa', strokeStyle: '#606060', lineWidth: 2 } }) },
        'HNO3': { name: '질산', create: (x, y) => Bodies.circle(x, y, 6, { restitution: 0.6, friction: 0.05, density: 0.0015, label: 'HNO3', render: { fillStyle: '#fff0a0' } }) },
        'ZnCl2': { name: '염화 아연', create: (x, y) => Bodies.circle(x, y, 9, { restitution: 0.2, friction: 0.1, density: 0.0029, label: 'ZnCl2', render: { fillStyle: '#d0d0f0' } }) },
        'CaCO3': { name: '탄산칼슘', create: (x, y) => Bodies.circle(x, y, 10, { restitution: 0.1, friction: 0.7, density: 0.0027, label: 'CaCO3', render: { fillStyle: '#f5f5dc' } }) },
        'CaO': { name: '산화칼슘', create: (x, y) => Bodies.circle(x, y, 9, { restitution: 0.1, friction: 0.6, density: 0.0033, label: 'CaO', render: { fillStyle: '#f0e68c' } }) },
        'NaNO3': { name: '질산 나트륨', create: (x, y) => Bodies.circle(x, y, 7, { restitution: 0.4, friction: 0.05, density: 0.0022, label: 'NaNO3', render: { fillStyle: '#d0f0d0' } }) },
        'CuO': { name: '산화 구리(II)', create: (x, y) => Bodies.circle(x, y, 8, { restitution: 0.2, friction: 0.7, density: 0.0063, label: 'CuO', render: { fillStyle: '#402020' } }) },
        'K2MnO4': { name: '망가니즈산 칼륨', create: (x, y) => Bodies.circle(x, y, 9, { restitution: 0.2, friction: 0.6, density: 0.0025, label: 'K2MnO4', render: { fillStyle: '#006400' } }) },
        'MnO2': { name: '이산화 망가니즈', create: (x, y) => Bodies.circle(x, y, 7, { restitution: 0.3, friction: 0.8, density: 0.0050, label: 'MnO2', render: { fillStyle: '#303030' } }) },
        'PbI2': { name: '아이오딘화 납', create: (x, y) => Bodies.circle(x, y, 10, { restitution: 0.1, friction: 0.8, density: 0.0062, label: 'PbI2', render: { fillStyle: '#f5d742' } }) },
        'KNO3': { name: '질산 칼륨', create: (x, y) => Bodies.circle(x, y, 8, { restitution: 0.3, friction: 0.1, density: 0.0021, label: 'KNO3', render: { fillStyle: '#f5f5f5' } }) },
        'ZnSO4': { name: '황산 아연', create: (x, y) => Bodies.circle(x, y, 9, { restitution: 0.3, friction: 0.1, density: 0.0035, label: 'ZnSO4', render: { fillStyle: '#e0f0ff' } }) },
        'MgO': { name: '산화 마그네슘', create: (x, y) => Bodies.circle(x, y, 8, { restitution: 0.1, friction: 0.7, density: 0.0036, label: 'MgO', render: { fillStyle: '#ffffff' } }) },
        'C6H12O6': { name: '포도당', create: (x, y) => Bodies.circle(x, y, 12, { restitution: 0.4, friction: 0.3, density: 0.0016, label: 'C6H12O6', render: { fillStyle: '#fffacd' } }) },
    };
    
    const specialActions = {
        'stir': { name: '섞기', execute: stir },
        'lid': { name: '뚜껑', execute: toggleLid },
        'heat': { name: '가열', execute: toggleHeating },
        'cool': { name: '냉각', execute: toggleCooling },
        'clear': { name: '초기화', execute: clearBeaker }
    };

    // UI 요소 채우기 (완전히 새로 작성하여 중복 문제 해결)
    function populateUI() {
        // 기존 내용 초기화 (중복 방지)
        compoundsDropdown.innerHTML = '';
        toolsDropdown.innerHTML = '';
        directControlsContainer.innerHTML = '';

        // 화합물 드롭다운 채우기
        for (const id in compounds) {
            const item = document.createElement('a');
            item.href = "#";
            item.textContent = compounds[id].name;
            item.onclick = (e) => { e.preventDefault(); selectSubstance(id, 'compound'); };
            compoundsDropdown.appendChild(item);
        }

        // 도구 드롭다운 채우기 (이 부분은 현재 비어있으므로 필요 시 항목 추가 가능)
        // 예시: const tools = { 'someTool': { name: '어떤 도구' } };
        // Object.keys(tools).forEach(...)

        // 즉시 실행 버튼 컨테이너에 버튼 생성
        Object.keys(specialActions).forEach(id => {
            const action = specialActions[id];
            const button = document.createElement('button');
            button.id = `${id}-button`;
            button.textContent = action.name;
            button.addEventListener('click', action.execute);
            directControlsContainer.appendChild(button);
        });

        // 주기율표 생성
        createPeriodicTable();
    }

    function createPeriodicTable() {
        periodicTable.innerHTML = ''; // 기존 테이블 초기화
        for (const symbol in fullPeriodicTable) {
            const element = fullPeriodicTable[symbol];
            const pos = elementPositions[element.atomicNumber];
            if (!pos) continue;

            const cell = document.createElement('div');
            cell.className = 'element-cell';
            cell.style.gridRow = pos.r;
            cell.style.gridColumn = pos.c;
            cell.style.backgroundColor = element.color;
            cell.title = element.name;

            const atomicNumberSpan = document.createElement('span');
            atomicNumberSpan.className = 'atomic-number';
            atomicNumberSpan.textContent = element.atomicNumber;

            const symbolSpan = document.createElement('span');
            symbolSpan.className = 'symbol';
            symbolSpan.textContent = element.symbol;
            
            // 텍스트 색상 대비 조정
            const bgColor = element.color.replace('#', '');
            const r = parseInt(bgColor.substring(0, 2), 16);
            const g = parseInt(bgColor.substring(2, 4), 16);
            const b = parseInt(bgColor.substring(4, 6), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            if (luminance > 0.5) {
                cell.style.color = '#000000';
            } else {
                cell.style.color = '#ffffff';
            }

            cell.appendChild(atomicNumberSpan);
            cell.appendChild(symbolSpan);

            cell.onclick = () => {
                selectSubstance(symbol, 'element');
                periodicTableContainer.classList.add('hidden');
            };

            periodicTable.appendChild(cell);
        }
    }

    elementsButton.onclick = () => {
        if (periodicTableContainer.classList.contains('hidden')) {
            const rect = elementsButton.getBoundingClientRect();
            periodicTableContainer.style.left = `${rect.left + rect.width / 2}px`;
            periodicTableContainer.style.top = `${rect.bottom + 10}px`; // 10px below the button
            
            // The popup's own width needs to be considered for centering
            const popupRect = periodicTableContainer.getBoundingClientRect();
            const popupWidth = periodicTable.offsetWidth; // get width of the table itself
            periodicTableContainer.style.transform = `translateX(-50%)`;

            periodicTableContainer.classList.remove('hidden');
        } else {
            periodicTableContainer.classList.add('hidden');
        }
    };

    closePeriodicTableButton.onclick = () => {
        periodicTableContainer.classList.add('hidden');
    };

    // 즉시 실행 컨트롤 생성
    const directControls = {
        '가열': { action: toggleHeating },
        '냉각': { action: toggleCooling },
        '섞기': { action: stir },
        '뚜껑': { action: toggleLid },
        '초기화': { action: clearBeaker },
    };

    for (const name in directControls) {
        const button = document.createElement('button');
        button.textContent = name;
        button.onclick = directControls[name].action;
        directControlsContainer.appendChild(button);
    }
    
    // 현재 선택된 물질 표시
    const currentSelectionDisplay = document.createElement('div');
    currentSelectionDisplay.id = 'current-selection-display';
    currentSelectionDisplay.style.marginTop = '10px';
    currentSelectionDisplay.style.fontWeight = 'bold';
    currentSelectionDisplay.style.color = '#eee';
    currentSelectionDisplay.style.fontSize = '14px';
    directControlsContainer.appendChild(currentSelectionDisplay);

    let currentSelection = { id: null, type: null };
    function selectSubstance(id, type) {
        currentSelection = { id, type };
        
        let name = '';
        if (type === 'element') {
            name = fullPeriodicTable[id].name;
        } else if (type === 'compound') {
            name = compounds[id].name;
        } else if (type === 'action') {
            name = specialActions[id].name;
        }

        if (id) {
            currentSelectionDisplay.textContent = `선택: ${name} (${id})`;
        } else {
            currentSelectionDisplay.textContent = '선택 없음';
        }
    }

    // 물질 생성 함수
    function createParticle(id, type, x, y) {
        let particle;
        const positionX = x || (width / 2 + (Math.random() - 0.5) * 50);
        const positionY = y || 50;

        if (type === 'element') {
            const element = fullPeriodicTable[id];
            if (!element) return null;
            // 밀도: 원자량 / (반지름^3), 스케일링 필요
            const density = element.mass / Math.pow(element.radius, 3) / 5000;
            particle = Bodies.circle(positionX, positionY, element.radius, {
                restitution: 0.5,
                friction: 0.1,
                density: density,
                label: element.symbol,
                render: { fillStyle: element.color }
            });
        } else if (type === 'compound') {
            const compound = compounds[id];
            if (!compound) return null;
            particle = compound.create(positionX, positionY);
        }
        
        if (particle) {
            // 모든 입자에 particleType과 temperature 속성 부여
            particle.particleType = type;
            particle.temperature = 298; // 상온에서 시작
            particle.originalColor = particle.render.fillStyle;
            Composite.add(world, particle);
        }

        return particle;
    }

    function handleSpawning(mousePos) {
        // 비커 내부인지 확인하는 로직 개선
        const slope = (beakerLeftX_bottom - beakerLeftX_top) / (beakerBottomY - beakerTopY);
        const leftBoundary = (mousePos.y - beakerTopY) * slope + beakerLeftX_top;
        const rightBoundary = width - leftBoundary;

        if (!(mousePos.x > leftBoundary && mousePos.x < rightBoundary && mousePos.y > beakerTopY && mousePos.y < beakerBottomY)) return;

        if (currentSelection.id) {
            const now = Date.now();
            if (now - lastSpawnTime > spawnInterval) {
                if (currentSelection.type === 'action' && currentSelection.id === 'liquid_H2O') {
                    addLiquid(mousePos.x, mousePos.y, 2, 2, 10); // 드래그 시 더 작은 물방울 생성
                } else {
                    createParticle(currentSelection.id, currentSelection.type, mousePos.x, mousePos.y);
                }
                lastSpawnTime = now;
            }
        }
    }
    
    Events.on(mouseConstraint, 'mousedown', (event) => {
        isMouseDown = true;
        handleSpawning(event.mouse.position);
    });

    Events.on(mouseConstraint, 'mouseup', (event) => {
        isMouseDown = false;
    });

    Events.on(mouseConstraint, 'mousemove', (event) => {
        if (isMouseDown) {
            handleSpawning(event.mouse.position);
        }
    });

    // 액체 시뮬레이션을 위한 함수
    function addLiquid(xx, yy, columns, rows, spacing) {
        const particles = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const x = xx + (j - columns / 2) * spacing;
                const y = yy + i * spacing;
                const particle = compounds.H2O.create(x, y);
                particles.push(particle);
                Composite.add(world, particle);
            }
        }

        // 입자들을 부드러운 제약으로 연결
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const pa = particles[i];
                const pb = particles[j];
                const dx = pa.position.x - pb.position.x;
                const dy = pa.position.y - pb.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < spacing * 1.5) {
                    const constraint = Constraint.create({
                        bodyA: pa,
                        bodyB: pb,
                        stiffness: 0.05,
                        damping: 0.1,
                        render: { visible: false }
                    });
                    Composite.add(world, constraint);
                }
            }
        }
    }

    function triggerReaction(reaction, bodies) {
        setTimeout(() => {
            // 반응할 입자가 여전히 존재하는지 확인
            const allBodiesExist = bodies.every(b => Composite.get(world, b.id, 'body'));
            if (!allBodiesExist) return;

            const avgPosition = {
                x: bodies.reduce((sum, b) => sum + b.position.x, 0) / bodies.length,
                y: bodies.reduce((sum, b) => sum + b.position.y, 0) / bodies.length
            };

            Composite.remove(world, bodies);

            reaction.products.forEach(p => {
                for (let i = 0; i < p.count; i++) {
                    // 생성물 ID가 화합물 목록에 있는지 확인
                    const type = compounds[p.id] ? 'compound' : 'element';
                    createParticle(p.id, type, avgPosition.x + (Math.random() - 0.5) * 5, avgPosition.y + (Math.random() - 0.5) * 5);
                }
            });
            
            updateReactionEquation(reaction.equation);

            if (reaction.config && reaction.config.exothermic) {
                applyExplosion(avgPosition, reaction.config.force);
            }
        }, 0);
    }

    function applyExplosion(position, force) {
        const bodies = Composite.allBodies(world);
        bodies.forEach(body => {
            if (!body.isStatic) {
                const dx = body.position.x - position.x;
                const dy = body.position.y - position.y;
                let distance = Math.hypot(dx, dy) || 1;
                if (distance < 100) {
                    Body.applyForce(body, body.position, {
                        x: dx / distance * force / distance,
                        y: dy / distance * force / distance
                    });
                }
            }
        });
    }

    // 온도에 따른 색상 변화 함수
    function getTemperatureColor(temp, originalColor) {
        const baseTemp = 298; // 상온
        const maxTemp = 1500; // 최대 표현 온도 (낮춤)
        const minTemp = 0; // 최소 표현 온도

        // 16진수 색상을 RGB로 변환
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };

        const originalRgb = hexToRgb(originalColor);
        if (!originalRgb) return originalColor;

        let r = originalRgb.r;
        let g = originalRgb.g;
        let b = originalRgb.b;

        if (temp > baseTemp + 10) { // 308K(35°C) 이상에서 가열 색상 시작 (매우 민감하게)
            // 가열 (점진적으로 빨간색으로 변화)
            const heatRatio = Math.min((temp - baseTemp - 10) / 400, 1); // 400도 범위로 색상 변화
            r = Math.round(r * (1 - heatRatio) + 255 * heatRatio);
            g = Math.round(g * (1 - heatRatio) + 50 * heatRatio);
            b = Math.round(b * (1 - heatRatio) + 50 * heatRatio);
        } else if (temp < baseTemp - 10) { // 288K(15°C) 이하에서 냉각 색상 시작 (매우 민감하게)
            // 냉각 (점진적으로 파란색으로 변화)
            const coolRatio = Math.min((baseTemp - 10 - temp) / 200, 1); // 200도 범위로 색상 변화
            r = Math.round(r * (1 - coolRatio) + 100 * coolRatio);
            g = Math.round(g * (1 - coolRatio) + 150 * coolRatio);
            b = Math.round(b * (1 - coolRatio) + 255 * coolRatio);
        }

        // RGB를 16진수로 변환
        const componentToHex = (c) => {
            const clampedC = Math.max(0, Math.min(255, c));
            const hex = clampedC.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };

        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    }

    Events.on(engine, 'collisionStart', (event) => {
        for (const pair of event.pairs) {
            const { bodyA, bodyB } = pair;
            const reactantLabels = [bodyA.label, bodyB.label].sort();
            
            const reaction = reactionFormulas.find(r => 
                r.reactants &&
                r.reactants.length === 2 && 
                r.reactants[0] === reactantLabels[0] && 
                r.reactants[1] === reactantLabels[1]
            );

            if (reaction) {
                // 반응 조건: 개별 입자의 온도를 확인
                const meetsTempCondition = !reaction.config || !reaction.config.minTemp ||
                    (bodyA.temperature >= reaction.config.minTemp && bodyB.temperature >= reaction.config.minTemp);

                if (meetsTempCondition) {
                    triggerReaction(reaction, [bodyA, bodyB]);
                }
            }
        }
    });

    let currentTemperature = 298;
    // 온도 변화 함수들 (간단하고 효과적)
    function heatNearbyParticles() {
        if (!isHeating) return;
        
        const allParticles = Composite.allBodies(world).filter(b => !b.isStatic);
        for (const body of allParticles) {
            // 온도 속성 확인 및 초기화
            if (typeof body.temperature !== 'number') {
                body.temperature = 298;
                body.originalColor = body.render.fillStyle;
            }
            
            // 비커 바닥 근처 입자들만 가열
            if (body.position.y > beakerBottomY - 100) {
                const maxTemp = 1000;
                body.temperature = Math.min(maxTemp, body.temperature + 15); // 더 빠른 가열
                Body.setSleeping(body, false);
                
                console.log(`가열: ${body.label} 온도 ${body.temperature.toFixed(1)}K`); // 디버그용
            }
        }
    }

    function coolNearbyParticles() {
        if (!isCooling) return;
        
        const allParticles = Composite.allBodies(world).filter(b => !b.isStatic);
        for (const body of allParticles) {
            // 온도 속성 확인 및 초기화
            if (typeof body.temperature !== 'number') {
                body.temperature = 298;
                body.originalColor = body.render.fillStyle;
            }
            
            // 비커 바닥 근처 입자들만 냉각
            if (body.position.y > beakerBottomY - 100) {
                const minTemp = 100;
                body.temperature = Math.max(minTemp, body.temperature - 15); // 더 빠른 냉각
                Body.setSleeping(body, false);
                
                console.log(`냉각: ${body.label} 온도 ${body.temperature.toFixed(1)}K`); // 디버그용
            }
        }
    }

    Events.on(engine, 'beforeUpdate', () => {
        let totalTemperature = 0;
        let particleCount = 0;
        
        const allParticles = Composite.allBodies(world).filter(b => !b.isStatic);

        // 가열/냉각 효과 적용
        heatNearbyParticles();
        coolNearbyParticles();

        for (const body of allParticles) {
            // 입자가 여전히 존재하는지 확인
            if (!Composite.get(world, body.id, 'body')) {
                continue;
            }
            
            // 온도 속성이 없는 입자에 온도 추가
            if (typeof body.temperature !== 'number') {
                body.temperature = 298;
                body.originalColor = body.render.fillStyle;
            }
            
            // 기체 부력 적용
            if (gases.includes(body.label)) {
                Body.applyForce(body, body.position, { x: 0, y: -0.0004 * body.mass });
            }

            // 자연스러운 온도 감쇄 (공기 중 열손실)
            if (body.temperature > 310) {
                body.temperature -= 0.2;
            } else if (body.temperature < 290) {
                body.temperature += 0.2;
            }

            // 온도 계산용 에너지 누적
            totalTemperature += body.temperature;
            particleCount++;

            // 온도 시각화
            if (body.originalColor) {
                body.render.fillStyle = getTemperatureColor(body.temperature, body.originalColor);
            }

            if (body.isSleeping) {
                body.render.opacity = 1;
            }
        }

        // 평균 온도 업데이트
        if (particleCount > 0) {
            currentTemperature = totalTemperature / particleCount;
            tempDisplay.textContent = `${currentTemperature.toFixed(1)}`;
        } else {
            currentTemperature = 298;
            tempDisplay.textContent = '298.0';
        }
        
        // 압력 업데이트
        const pressure = (pressureImpulse * 100).toFixed(2);
        pressureDisplay.textContent = `${pressure}`;
        pressureImpulse = 0;
    });

    Events.on(engine, 'collisionActive', (event) => {
        for (const pair of event.pairs) {
            const { bodyA, bodyB } = pair;

            // 가열/냉각판과의 열전달 (현실적인 접촉 기반)
            const processHeatTransfer = (particle, plate) => {
                if (!particle.isStatic && plate.isStatic) {
                    if (plate.label === 'heatingPlate' && isHeating) {
                        const maxTemp = 1200;
                        const heatRate = 8; // 적당한 가열 속도
                        particle.temperature = Math.min(maxTemp, particle.temperature + heatRate);
                        Body.setSleeping(particle, false);
                        
                        // 가열로 인한 약간의 대류 효과
                        const convectionForce = 0.00008;
                        Body.applyForce(particle, particle.position, {
                            x: (Math.random() - 0.5) * convectionForce,
                            y: -Math.random() * convectionForce // 위쪽으로 상승
                        });
                    } else if (plate.label === 'coolingPlate' && isCooling) {
                        const minTemp = 100; // 절대영도까지는 가지 않음
                        const coolRate = 8; // 적당한 냉각 속도
                        particle.temperature = Math.max(minTemp, particle.temperature - coolRate);
                        Body.setSleeping(particle, false);
                        
                        // 냉각으로 인한 밀도 증가 효과
                        const densityForce = 0.00005;
                        Body.applyForce(particle, particle.position, {
                            x: (Math.random() - 0.5) * densityForce,
                            y: Math.random() * densityForce // 아래쪽으로 가라앉음
                        });
                    }
                }
            };

            // 열판과의 접촉 확인
            if (bodyA.isStatic && !bodyB.isStatic) {
                processHeatTransfer(bodyB, bodyA);
            } else if (bodyB.isStatic && !bodyA.isStatic) {
                processHeatTransfer(bodyA, bodyB);
            }

            // 입자 간 열전도 (현실적인 열전도)
            if (!bodyA.isStatic && !bodyB.isStatic) {
                const tempDiff = bodyA.temperature - bodyB.temperature;
                if (Math.abs(tempDiff) > 1.0) { // 온도차가 1도 이상일 때만
                    const heatTransferRate = 0.08; // 적당한 열전도율
                    const heatTransfer = tempDiff * heatTransferRate;
                    
                    bodyA.temperature -= heatTransfer;
                    bodyB.temperature += heatTransfer;
                    
                    // 열전도가 활발할 때 입자 활성화
                    if (Math.abs(heatTransfer) > 0.5) {
                        Body.setSleeping(bodyA, false);
                        Body.setSleeping(bodyB, false);
                    }
                }
            }

            // 기체 압력 계산
            let gasBody = null;
            if (gases.includes(bodyA.label) && bodyB.isStatic) gasBody = bodyA;
            else if (gases.includes(bodyB.label) && bodyA.isStatic) gasBody = bodyB;

            if (gasBody) {
                pressureImpulse += Math.hypot(pair.collision.impulse.x, pair.collision.impulse.y);
            }
        }
    });

    function updateReactionEquation(equation) {
        const p = document.createElement('p');
        p.textContent = equation;
        // 동일한 반응식이 이미 있는지 확인 (선택 사항)
        if (![...equationsContainer.children].some(el => el.textContent === equation)) {
            equationsContainer.prepend(p);
        }
    }

    function stir() {
        const center = { x: width / 2, y: beakerBottomY - 200 }; // 비커 중심으로 조정
        Composite.allBodies(world).forEach(body => {
            if (!body.isStatic) {
                const vector = { x: body.position.x - center.x, y: body.position.y - center.y };
                const distance = Math.hypot(vector.x, vector.y);
                
                // 비커 안에 있는 입자만 섞기
                if (distance < 200) { // 비커 반지름 내에서만 섞기
                    const forceMagnitude = 0.00015 * body.mass; // 섞는 힘 크게 감소
                    Body.applyForce(body, body.position, { 
                        x: -vector.y * forceMagnitude, 
                        y: vector.x * forceMagnitude 
                    });
                }
            }
        });
    }

    function toggleLid() {
        const lidButton = [...directControlsContainer.getElementsByTagName('button')].find(btn => btn.textContent === '뚜껑');
        if (isLidOn) {
            if (lid) Composite.remove(world, lid);
            lid = null;
            isLidOn = false;
            lidButton.style.backgroundColor = '';
        } else {
            // 뚜껑 위치와 크기를 비커 상단에 맞게 수정
            lid = Bodies.rectangle(width / 2, beakerTopY - 5, beakerTopWidth, 10, { isStatic: true, label: 'lid', render: { fillStyle: '#a0a0b0' } });
            Composite.add(world, lid);
            isLidOn = true;
            lidButton.style.backgroundColor = '#c0e0c0';
        }
    }

    function toggleHeating() {
        // 냉각 중이면 중지
        if (isCooling) {
            isCooling = false;
            try {
                Composite.remove(world, coolingPlate);
            } catch (e) {}
        }
        
        isHeating = !isHeating;
        
        if (isHeating) {
            try {
                Composite.add(world, heatingPlate);
                console.log('🔥 가열 시작! 비커 바닥 근처 입자들이 가열됩니다.');
            } catch (e) {
                console.log('가열판 추가 오류:', e);
            }
        } else {
            try {
                Composite.remove(world, heatingPlate);
                console.log('🔥 가열 중지');
            } catch (e) {
                console.log('가열판 제거 오류:', e);
            }
        }
        
        updateTemperatureControls();
    }

    function toggleCooling() {
        // 가열 중이면 중지
        if (isHeating) {
            isHeating = false;
            try {
                Composite.remove(world, heatingPlate);
            } catch (e) {}
        }
        
        isCooling = !isCooling;
        
        if (isCooling) {
            try {
                Composite.add(world, coolingPlate);
                console.log('❄️ 냉각 시작! 비커 바닥 근처 입자들이 냉각됩니다.');
            } catch (e) {
                console.log('냉각판 추가 오류:', e);
            }
        } else {
            try {
                Composite.remove(world, coolingPlate);
                console.log('❄️ 냉각 중지');
            } catch (e) {
                console.log('냉각판 제거 오류:', e);
            }
        }
        
        updateTemperatureControls();
    }

    function updateTemperatureControls() {
        const heatButton = [...directControlsContainer.getElementsByTagName('button')].find(btn => btn.textContent === '가열');
        const coolButton = [...directControlsContainer.getElementsByTagName('button')].find(btn => btn.textContent === '냉각');
        
        // 가열 버튼 스타일 업데이트
        if (isHeating && heatButton) {
            heatButton.style.backgroundColor = '#ffaaaa';
            heatButton.style.color = '#ffffff';
        } else if (heatButton) {
            heatButton.style.backgroundColor = '#f0f0f0';
            heatButton.style.color = '#333333';
        }

        // 냉각 버튼 스타일 업데이트
        if (isCooling && coolButton) {
            coolButton.style.backgroundColor = '#aaaaff';
            coolButton.style.color = '#ffffff';
        } else if (coolButton) {
            coolButton.style.backgroundColor = '#f0f0f0';
            coolButton.style.color = '#333333';
        }
    }

    function clearBeaker() {
        Composite.clear(world, false); 
        Composite.add(world, beakerWalls);
        
        // 가열/냉각 상태 초기화
        isHeating = false;
        isCooling = false;
        
        // 온도를 상온으로 리셋
        currentTemperature = 298;
        
        // 마우스 제약조건 다시 추가 (clear 후 복원 필요)
        Composite.add(world, mouseConstraint);
        
        updateTemperatureControls();

        if (isLidOn) toggleLid();
        equationsContainer.innerHTML = '';
        currentSelection = { id: null, type: null };
        selectSubstance(null, null); // 선택 초기화
    }

    // 입자 정보 표시를 위한 이벤트 리스너
    render.canvas.addEventListener('mousemove', (event) => {
        const mousePosition = mouse.position;
        const bodies = Composite.allBodies(world);
        // isStatic이 아닌 몸체만 필터링
        const foundBodies = Query.point(bodies, mousePosition).filter(body => {
            // 마우스 제약조건에 잡힌 몸체는 제외
            if (mouseConstraint.body && body.id === mouseConstraint.body.id) {
                return false;
            }
            // 벽이나 뚜껑 같은 정적 몸체는 제외
            return !body.isStatic;
        });

        if (foundBodies.length > 0) {
            const body = foundBodies[0]; // 가장 위에 있는 입자
            let content = `<b>${body.label}</b><br>`;
            content += `종류: ${body.particleType || '원소/화합물'}<br>`;
            content += `위치: (${Math.round(body.position.x)}, ${Math.round(body.position.y)})<br>`;
            content += `속도: ${Matter.Vector.magnitude(body.velocity).toFixed(2)}<br>`;
            content += `질량: ${body.mass.toFixed(4)}<br>`;
            if (body.temperature) {
                content += `온도: ${body.temperature.toFixed(2)} K`;
            }
            
            tooltip.innerHTML = content;
            tooltip.style.left = `${event.clientX + 15}px`;
            tooltip.style.top = `${event.clientY}px`;
            tooltip.classList.remove('hidden');
        } else {
            tooltip.classList.add('hidden');
        }
    });

    render.canvas.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
    });

    // 마우스 휠 이벤트로 입자 추가/제거 (선택적 기능)
    render.canvas.addEventListener('wheel', (event) => {
        // ... existing code ...
    });

    // 초기화 함수 호출
    populateUI();
    selectSubstance(null, null); // 선택 표시 초기화
}); 