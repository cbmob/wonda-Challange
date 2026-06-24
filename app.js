'use strict';

const SAVE_KEY = 'wanda_time_room_v2';
const ADMIN_PASS = '0321';

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
  'ウィンドミル5周',
  '高速ウィンドミル5周',
  'スワイプス5周',
  '高速スワイプス5周',
  'トーマス5周',
  'トーマス7周',
  'トーマス10周',
  'ドリル',
  'Aトラックス',
  'Aトラックス2周',
  'ショルダースピン3周',
  'ラビット10回',
  'ラビット30回',
  'エルボーラビット10回',
  'エルボーラビット30回',
  'エルボー入れ替えラビット10回',
  'マックス→ハロー→マックス',
  '肘上げ→マックス',
  '3点→エルボー→入れ替え',
  'エルボーエアー2発',
  'エルボーエアー3発',
  'エアー2発',
  'エアー3発',
  'バックスピン→チェアー',
  'ウィンドミル→トーマス',
  'トーマス→ウィンドミル',
  'スワイプス→トーマス',
  'トーマス→スワイプス',
  'シフト10回',
  'ダブルシフト2回',
  '跳ね起き',
  'マカコ',
  'ロンダート',
  'バタフライ'
].map((name, i) => ({
  id: 'm' + i,
  name,
  diamond: 1
}));

const GACHA_CARDS = [
  'ワンダ',
  '時のカギ',
  '肉球スタンプ',
  '練習の妖精',
  'チェアーマスター',
  'ウィンドミルスター',
  'トーマスドラゴン',
  'ラビットキャット',
  'エアーウィング',
  '努力の時計',
  '秘密のファイル',
  'ダイヤの部屋',
  'ハローバックムーン',
  'マックスブレイブ',
  'ドリルスパーク',
  'スワイプスフェニックス',
  'ショルダーコメット',
  '倒立クロック',
  'エルボーライト',
  'アクロバットスター'
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

function normalizeState(raw) {
  const base = defaultState();
  const merged = Object.assign(base, raw || {});

  if (!Array.isArray(merged.collection)) merged.collection = [];
  if (!Array.isArray(merged.shelf)) merged.shelf = Array(9).fill(null);

  merged.shelf = merged.shelf.slice(0, 9);
  while (merged.shelf.length < 9) merged.shelf.push(null);

  if (!merged.practice || typeof merged.practice !== 'object') merged.practice = {};
  if (!merged.cleared || typeof merged.cleared !== 'object') merged.cleared = {};
  if (typeof merged.diamond !== 'number') merged.diamond = 20;
  if (!merged.name) merged.name = 'なまえ未設定';

  return merged;
}

function load() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(SAVE_KEY)));
  } catch (e) {
    return defaultState();
  }
}

function save() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  renderHeader();
}

function resetSave() {
  localStorage.removeItem(SAVE_KEY);
  state = defaultState();
  filePage = 0;
  renderAll();
  show('main');
}

function today() {
  return new Date().toLocaleDateString('ja-JP');
}

function renderHeader() {
  const diamond = document.getElementById('diamondCount');
  if (diamond) diamond.textContent = state.diamond;
}

function renderAll() {
  renderHeader();
  renderMain();
  renderPractice();
  renderMission();
  renderFile();
  renderPhone();
  renderAdmin();
}

function show(screen) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));

  const target = document.getElementById(screen + 'Screen');
  if (target) target.classList.add('active');

  if (screen === 'main') renderMain();
  if (screen === 'practice') renderPractice();
  if (screen === 'mission') renderMission();
  if (screen === 'phone') renderPhone();
  if (screen === 'file') renderFile();
  if (screen === 'gacha') renderGacha();
  if (screen === 'admin') renderAdmin();
}

function modal(text, actions) {
  const modalEl = document.getElementById('modal');
  const modalText = document.getElementById('modalText');
  const modalActions = document.getElementById('modalActions');

  modalText.textContent = text;
  modalActions.innerHTML = '';

  actions.forEach(action => {
    const btn = document.createElement('button');
    btn.textContent = action.text;
    btn.onclick = () => {
      modalEl.classList.add('hidden');
      if (typeof action.onClick === 'function') action.onClick();
    };
    modalActions.appendChild(btn);
  });

  modalEl.classList.remove('hidden');
}

function renderMain() {
  const nameBtn = document.getElementById('nameBtn');
  if (nameBtn) nameBtn.textContent = state.name;

  renderShelf();
  renderHeader();
}

function renderShelf() {
  const grid = document.getElementById('shelfGrid');
  if (!grid) return;

  grid.innerHTML = '';

  state.shelf.forEach((cardName, index) => {
    const div = document.createElement('div');
    div.className = cardName ? 'miniCard' : 'slot empty';

    if (cardName) {
      div.innerHTML = `
        <div>✨</div>
        <div>${escapeHtml(cardName)}</div>
        <div>SHELF</div>
      `;
    } else {
      div.textContent = 'タップで飾る';
    }

    div.onclick = () => chooseShelfCard(index);
    grid.appendChild(div);
  });
}

function chooseShelfCard(index) {
  const owned = uniqueCollection();

  if (owned.length <= 0) {
    modal('まだガチャカードを持っていません。', [
      { text: 'OK' }
    ]);
    return;
  }

  const actions = owned.map(cardName => ({
    text: cardName,
    onClick: () => {
      state.shelf[index] = cardName;
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

  modal('飾るカードを選んでください。', actions);
}

function uniqueCollection() {
  return Array.from(new Set(state.collection));
}

function renderPractice() {
  const list = document.getElementById('practiceList');
  if (!list) return;

  list.innerHTML = '';

  PRACTICE_CARDS.forEach(([name, points], i) => {
    const id = 'p' + i;
    const data = state.practice[id] || { count: 0, lastDate: '' };

    const div = document.createElement('div');
    div.className = 'practiceCard';
    div.innerHTML = `
      <div class="cardTitle">${escapeHtml(name)}</div>
      <div class="points">${points.map(p => '・' + escapeHtml(p)).join('<br>')}</div>
      <div class="stamp">🐾 × ${data.count}${data.lastDate ? `<br>最後：${escapeHtml(data.lastDate)}` : ''}</div>
      <button type="button">スタンプを押す</button>
    `;

    div.querySelector('button').onclick = () => stampPractice(id);
    list.appendChild(div);
  });
}

function stampPractice(id) {
  const data = state.practice[id] || { count: 0, lastDate: '' };
  const now = today();

  if (data.lastDate === now) {
    modal('このカードは今日はもうスタンプ済みです。', [
      { text: 'OK' }
    ]);
    return;
  }

  modal('納得のいく練習が出来ましたか？', [
    {
      text: 'はい',
      onClick: () => {
        data.count += 1;
        data.lastDate = now;
        state.practice[id] = data;
        save();
        renderPractice();
        modal('肉球スタンプを押しました！\n🐾 +1', [
          { text: 'OK' }
        ]);
      }
    },
    {
      text: 'いいえ'
    }
  ]);
}

function renderMission() {
  const list = document.getElementById('missionList');
  if (!list) return;

  list.innerHTML = '';

  let count = 0;

  MISSION_CARDS.forEach(card => {
    if (state.cleared[card.id]) return;

    count += 1;

    const div = document.createElement('div');
    div.className = 'missionCard';
    div.innerHTML = `
      <div class="cardTitle">${escapeHtml(card.name)}</div>
      <div class="points">課題をクリアしたら先生に確認してもらおう。</div>
      <div class="stamp">報酬：💎${card.diamond}</div>
      <button type="button">クリア</button>
    `;

    div.querySelector('button').onclick = () => clearMission(card);
    list.appendChild(div);
  });

  if (count === 0) {
    const div = document.createElement('div');
    div.className = 'missionCard';
    div.innerHTML = `
      <div class="cardTitle">全課題クリア済み</div>
      <div class="points">クリアファイルからいつでも確認できます。</div>
    `;
    list.appendChild(div);
  }
}

function clearMission(card) {
  const pass = prompt('クリアパスワードを入力してください');

  if (pass !== ADMIN_PASS) {
    modal('パスワードが違います。', [
      { text: 'OK' }
    ]);
    return;
  }

  if (state.cleared[card.id]) {
    modal('この課題はすでにクリア済みです。', [
      { text: 'OK' }
    ]);
    return;
  }

  state.cleared[card.id] = {
    id: card.id,
    name: card.name,
    diamond: card.diamond,
    date: today()
  };

  state.diamond += card.diamond;
  save();
  renderMission();

  modal(`${card.name} クリア！\n💎${card.diamond} 獲得！\nクリアファイルに移動しました。`, [
    { text: 'OK' }
  ]);
}

function renderPhone() {
  const clearCount = Object.keys(state.cleared).length;
  const stampScore = Object.values(state.practice).reduce((sum, p) => {
    if (!p || typeof p.count !== 'number') return sum;
    return sum + p.count;
  }, 0);

  const score = stampScore * 10 + clearCount * 100;

  setText('phoneName', state.name);
  setText('phoneScore', score);
  setText('phoneClear', clearCount);
  setText('phoneCollection', uniqueCollection().length);
  setText('phoneDiamond', state.diamond);
}

function renderFile() {
  const grid = document.getElementById('fileGrid');
  if (!grid) return;

  const cleared = Object.values(state.cleared);
  const totalPages = Math.max(1, Math.ceil(cleared.length / 9));

  if (filePage < 0) filePage = 0;
  if (filePage >= totalPages) filePage = totalPages - 1;

  const items = cleared.slice(filePage * 9, filePage * 9 + 9);

  grid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const card = items[i];
    const div = document.createElement('div');

    if (card) {
      div.className = 'miniCard';
      div.innerHTML = `
        <div>✅ CLEAR</div>
        <div>${escapeHtml(card.name)}</div>
        <div>${escapeHtml(card.date)}</div>
      `;
    } else {
      div.className = 'slot empty';
      div.textContent = '空き';
    }

    grid.appendChild(div);
  }

  setText('pageInfo', `${filePage + 1} / ${totalPages}`);
}

function renderGacha() {
  const result = document.getElementById('gachaResult');
  if (result) result.innerHTML = '';
}

function drawGacha() {
  const cost = 5;

  if (state.diamond < cost) {
    modal('ダイヤが足りません。', [
      { text: 'OK' }
    ]);
    return;
  }

  state.diamond -= cost;

  const cardName = GACHA_CARDS[Math.floor(Math.random() * GACHA_CARDS.length)];
  state.collection.push(cardName);

  save();

  const result = document.getElementById('gachaResult');
  if (result) {
    result.innerHTML = `
      <div class="miniCard" style="width:140px;margin:0 auto;">
        <div>✨ GET ✨</div>
        <div>${escapeHtml(cardName)}</div>
        <div>COLLECTION</div>
      </div>
    `;
  }
}

function enterAdmin() {
  const pass = prompt('管理者パスワードを入力してください');

  if (pass !== ADMIN_PASS) {
    modal('パスワードが違います。', [
      { text: 'OK' }
    ]);
    return;
  }

  show('admin');
}

function renderAdmin() {
  const select = document.getElementById('adminClearSelect');
  if (!select) return;

  select.innerHTML = '';

  const cleared = Object.values(state.cleared);

  if (cleared.length <= 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'クリア済みカードなし';
    select.appendChild(option);
    return;
  }

  cleared.forEach(card => {
    const option = document.createElement('option');
    option.value = card.id;
    option.textContent = `${card.name} / ${card.date}`;
    select.appendChild(option);
  });
}

function adminChangeDiamond() {
  const input = document.getElementById('adminDiamondInput');
  if (!input) return;

  const value = Number(input.value);

  if (!Number.isFinite(value) || value === 0) {
    modal('増減する数字を入力してください。\n例：10 または -10', [
      { text: 'OK' }
    ]);
    return;
  }

  state.diamond += value;
  if (state.diamond < 0) state.diamond = 0;

  input.value = '';
  save();
  renderAdmin();

  modal(`ダイヤを変更しました。\n現在：💎${state.diamond}`, [
    { text: 'OK' }
  ]);
}

function adminUnlockClear() {
  const select = document.getElementById('adminClearSelect');
  if (!select || !select.value) {
    modal('解除できるクリア済みカードがありません。', [
      { text: 'OK' }
    ]);
    return;
  }

  const id = select.value;
  const card = state.cleared[id];

  if (!card) {
    modal('対象カードが見つかりません。', [
      { text: 'OK' }
    ]);
    return;
  }

  delete state.cleared[id];
  save();
  renderAdmin();
  renderMission();
  renderFile();

  modal(`${card.name} のクリアを解除しました。`, [
    { text: 'OK' }
  ]);
}

function adminDeleteSave() {
  modal('本当に全セーブを削除しますか？\n名前・ダイヤ・スタンプ・クリア状況・ガチャカードが全て消えます。', [
    {
      text: '削除する',
      onClick: () => {
        resetSave();
        modal('セーブを削除しました。', [
          { text: 'OK' }
        ]);
      }
    },
    {
      text: 'やめる'
    }
  ]);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch];
  });
}

document.querySelectorAll('[data-open]').forEach(btn => {
  btn.onclick = () => show(btn.dataset.open);
});

document.querySelectorAll('.backBtn').forEach(btn => {
  btn.onclick = () => show('main');
});

document.getElementById('nameBtn').onclick = () => {
  const name = prompt('名前を入力してください', state.name);

  if (name && name.trim()) {
    state.name = name.trim();
    save();
    renderMain();
  }
};

document.getElementById('drawGachaBtn').onclick = drawGacha;
document.getElementById('adminEnterBtn').onclick = enterAdmin;
document.getElementById('adminDiamondBtn').onclick = adminChangeDiamond;
document.getElementById('adminUnlockBtn').onclick = adminUnlockClear;
document.getElementById('adminDeleteSaveBtn').onclick = adminDeleteSave;

document.getElementById('prevPage').onclick = () => {
  filePage -= 1;
  renderFile();
};

document.getElementById('nextPage').onclick = () => {
  filePage += 1;
  renderFile();
};

renderAll();
show('main');
