'use strict';

const SAVE_KEY = 'wanda_time_room_v1';

const PRACTICE_CARDS = [
  ['チェアーコンボ', ['バリエーション', 'キレ', '3点へ', '肘へ']],
  ['3点倒立コンボ', ['バリエーション', 'キレ', 'チェアーへ', '肘へ', '倒立へ']],
  ['肘倒立左右', ['やり込み', 'フリーズ', 'エルボーラビット']],
  ['開脚倒立', ['壁を使ってキープ', '壁無しキープ']],
  ['倒立旋回', ['エントリー', '開脚', '周数', 'スピード', 'チェアーへ']],
  ['エアベイビー', ['キープ', 'チェアーへ', '倒立へ']],
  ['人型チェアー', ['キープ', '左右', '片手']],
  ['マックス', ['バリエーション', 'キレ', 'やり込み']],
  ['フラッグ、片手倒立', ['キープ']],
  ['ラビット', ['やり込み', '派生', 'フリーズへ']],
  ['ハローバック', ['やり込み', 'コンボ']],
  ['アクロバット', ['やり込み']],
  ['バックスピン', ['周数', '入り方', 'スタイルへ繋ぐ', 'チェアーや3点へ繋ぐ']],
  ['ウィンドミル', ['やり込み', '入り方', 'スピード', '足をキレイに']],
  ['スワイプス', ['やり込み', '高さ', 'スピード']],
  ['ノーハンドウィンドミル', ['やり込み', '派生']],
  ['トーマス', ['やり込み', '右手', '後ろの足の開き']],
  ['エアー', ['やり込み', '倒立で足の振り', 'スリッキー']],
  ['エルボーエアー', ['やり込み', '繋ぎ']],
  ['ドリル', ['やり込み', '足クロス', '入り方']],
  ['ショルダースピン', ['やり込み']]
];

const MISSION_CARDS = [
  'ウィンドミル5周', '高速ウィンドミル5周', 'スワイプス5周', '高速スワイプス5周',
  'トーマス5周', 'トーマス7周', 'トーマス10周', 'ドリル',
  'Aトラックス', 'Aトラックス2周', 'ショルダースピン3周',
  'ラビット10回', 'ラビット30回', 'エルボーラビット10回', 'エルボーラビット30回',
  'エルボー入れ替えラビット10回', 'マックス→ハロー→マックス',
  '肘上げ→マックス', '3点→エルボー→入れ替え',
  'エルボーエアー2発', 'エルボーエアー3発', 'エアー2発', 'エアー3発',
  'バックスピン→チェアー', 'ウィンドミル→トーマス', 'トーマス→ウィンドミル',
  'スワイプス→トーマス', 'トーマス→スワイプス',
  'シフト10回', 'ダブルシフト2回', '跳ね起き', 'マカコ', 'ロンダート', 'バタフライ'
].map((name, i) => ({
  id: 'm' + i,
  name,
  diamond: 3 + Math.floor(i / 5)
}));

const GACHA_CARDS = [
  'ワンダ', '時のカギ', '肉球スタンプ', '練習の妖精', 'チェアーマスター',
  'ウィンドミルスター', 'トーマスドラゴン', 'ラビットキャット', 'エアーウィング',
  '努力の時計', '秘密のファイル', 'ダイヤの部屋'
];

let state = load();
let filePage = 0;

function defaultState() {
  return {
    name: 'なまえ未設定',
    diamond: 20,
    practice: {},
    cleared: {},
    collection: [],
    shelf: Array(9).fill(null)
  };
}

function load() {
  try {
    return { ...defaultState(), ...JSON.parse(localStorage.getItem(SAVE_KEY)) };
  } catch {
    return defaultState();
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  renderHeader();
}

function today() {
  return new Date().toLocaleDateString('ja-JP');
}

function show(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screen + 'Screen').classList.add('active');

  if (screen === 'practice') renderPractice();
  if (screen === 'mission') renderMission();
  if (screen === 'phone') renderPhone();
  if (screen === 'file') renderFile();
  if (screen === 'gacha') renderGacha();
}

function modal(text, actions) {
  document.getElementById('modalText').textContent = text;
  const area = document.getElementById('modalActions');
  area.innerHTML = '';

  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.textContent = a.text;
    btn.onclick = () => {
      document.getElementById('modal').classList.add('hidden');
      if (a.onClick) a.onClick();
    };
    area.appendChild(btn);
  });

  document.getElementById('modal').classList.remove('hidden');
}

function renderHeader() {
  document.getElementById('diamondCount').textContent = state.diamond;
}

function renderMain() {
  document.getElementById('nameBtn').textContent = state.name;
  renderShelf();
  renderHeader();
}

function renderShelf() {
  const grid = document.getElementById('shelfGrid');
  grid.innerHTML = '';

  state.shelf.forEach((card, index) => {
    const div = document.createElement('div');
    div.className = card ? 'miniCard' : 'slot empty';
    div.innerHTML = card ? `<div>✨</div><div>${card}</div><div>COLLECT</div>` : 'タップで飾る';
    div.onclick = () => chooseShelf(index);
    grid.appendChild(div);
  });
}

function chooseShelf(index) {
  if (!state.collection.length) {
    modal('まだガチャカードを持っていません。', [{ text: 'OK' }]);
    return;
  }

  const actions = state.collection.map(card => ({
    text: card,
    onClick: () => {
      state.shelf[index] = card;
      save();
      renderShelf();
    }
  }));

  actions.push({
    text: '空にする',
    onClick: () => {
      state.shelf[index] = null;
      save();
      renderShelf();
    }
  });

  modal('飾るカードを選んでください', actions);
}

function renderPractice() {
  const list = document.getElementById('practiceList');
  list.innerHTML = '';

  PRACTICE_CARDS.forEach(([name, points], i) => {
    const id = 'p' + i;
    const data = state.practice[id] || { count: 0, lastDate: '' };

    const div = document.createElement('div');
    div.className = 'practiceCard';
    div.innerHTML = `
      <div class="cardTitle">${name}</div>
      <div class="points">${points.map(p => '・' + p).join('<br>')}</div>
      <div class="stamp">🐾 × ${data.count} ${data.lastDate ? `<br>最後：${data.lastDate}` : ''}</div>
      <button>スタンプを押す</button>
    `;

    div.querySelector('button').onclick = () => stampPractice(id);
    list.appendChild(div);
  });
}

function stampPractice(id) {
  const d = state.practice[id] || { count: 0, lastDate: '' };
  const now = today();

  if (d.lastDate === now) {
    modal('このカードは今日はもうスタンプ済みです。', [{ text: 'OK' }]);
    return;
  }

  modal('納得のいく練習が出来ましたか？', [
    {
      text: 'はい',
      onClick: () => {
        d.count++;
        d.lastDate = now;
        state.practice[id] = d;
        save();
        renderPractice();
      }
    },
    { text: 'いいえ' }
  ]);
}

function renderMission() {
  const list = document.getElementById('missionList');
  list.innerHTML = '';

  MISSION_CARDS.forEach(card => {
    if (state.cleared[card.id]) return;

    const div = document.createElement('div');
    div.className = 'missionCard';
    div.innerHTML = `
      <div class="cardTitle">${card.name}</div>
      <div class="points">クリア報酬：💎${card.diamond}</div>
      <button>クリア</button>
    `;

    div.querySelector('button').onclick = () => clearMission(card);
    list.appendChild(div);
  });
}

function clearMission(card) {
  const pass = prompt('クリアパスワードを入力してください');

  if (pass !== '0321') {
    modal('パスワードが違います。', [{ text: 'OK' }]);
    return;
  }

  state.cleared[card.id] = {
    name: card.name,
    diamond: card.diamond,
    date: today()
  };

  state.diamond += card.diamond;
  save();
  renderMission();

  modal(`${card.name} クリア！\n💎${card.diamond} 獲得！`, [{ text: 'OK' }]);
}

function renderPhone() {
  const clearCount = Object.keys(state.cleared).length;
  const stampScore = Object.values(state.practice).reduce((sum, p) => sum + p.count, 0);
  const score = stampScore * 10 + clearCount * 100;

  document.getElementById('phoneName').textContent = state.name;
  document.getElementById('phoneScore').textContent = score;
  document.getElementById('phoneClear').textContent = clearCount;
  document.getElementById('phoneCollection').textContent = state.collection.length;
  document.getElementById('phoneDiamond').textContent = state.diamond;
}

function renderFile() {
  const grid = document.getElementById('fileGrid');
  const cleared = Object.values(state.cleared);
  const totalPages = Math.max(1, Math.ceil(cleared.length / 9));

  if (filePage >= totalPages) filePage = totalPages - 1;

  grid.innerHTML = '';
  const pageItems = cleared.slice(filePage * 9, filePage * 9 + 9);

  for (let i = 0; i < 9; i++) {
    const card = pageItems[i];
    const div = document.createElement('div');
    div.className = card ? 'miniCard' : 'slot empty';
    div.innerHTML = card
      ? `<div>✅</div><div>${card.name}</div><div>${card.date}</div>`
      : '空き';
    grid.appendChild(div);
  }

  document.getElementById('pageInfo').textContent = `${filePage + 1} / ${totalPages}`;
}

function renderGacha() {
  document.getElementById('gachaResult').innerHTML = '';
}

function drawGacha() {
  if (state.diamond < 5) {
    modal('ダイヤが足りません。', [{ text: 'OK' }]);
    return;
  }

  state.diamond -= 5;

  const card = GACHA_CARDS[Math.floor(Math.random() * GACHA_CARDS.length)];
  state.collection.push(card);
  save();

  document.getElementById('gachaResult').innerHTML = `
    <div class="miniCard" style="margin:0 auto;width:130px;">
      <div>✨GET✨</div>
      <div>${card}</div>
      <div>COLLECTION</div>
    </div>
  `;
}

document.querySelectorAll('[data-open]').forEach(btn => {
  btn.onclick = () => show(btn.dataset.open);
});

document.querySelectorAll('.backBtn').forEach(btn => {
  btn.onclick = () => {
    renderMain();
    show('main');
  };
});

document.getElementById('nameBtn').onclick = () => {
  const name = prompt('名前を入力してください', state.name);
  if (name && name.trim()) {
    state.name = name.trim();
    save();
    renderMain();
  }
};

document.getElementById('gachaBtn').onclick = drawGacha;

document.getElementById('prevPage').onclick = () => {
  filePage = Math.max(0, filePage - 1);
  renderFile();
};

document.getElementById('nextPage').onclick = () => {
  const total = Math.max(1, Math.ceil(Object.keys(state.cleared).length / 9));
  filePage = Math.min(total - 1, filePage + 1);
  renderFile();
};

renderMain();
