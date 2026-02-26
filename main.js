/**
 * POKECRYING GAME
 * Fix: Precise 10 Rounds limit & Round Display logic
 * Multilingual Support: EN, JA, KO
 */

const ROUNDS = 10;
const TIME_LIMIT = 15;
const DIFFICULTIES = {
  1: { maxId: 151, label: 'EASY' },
  2: { maxId: 251, label: 'NORMAL' },
  3: { maxId: 386, label: 'HARD' }
};

const translations = {
  en: {
    mainTitle: "POKECRYING GAME",
    mainSubtitle: "Challenge the Legendary Trainer!<br>Can you identify Pokemon by sound alone?",
    pressStart: "PRESS START",
    selectDiffText: "Select difficulty and start",
    easy: "EASY",
    normal: "NORMAL",
    hard: "HARD",
    battleStart: "▶ BATTLE START",
    listenCry: "♪ LISTEN TO CRY",
    hint: "💡 HINT (-50 PTS)",
    correct: "CORRECT!",
    wrong: "WRONG!",
    nextPokemon: "NEXT POKÉMON ▶",
    viewResults: "VIEW RESULTS ▶",
    tryAgain: "↺ TRY AGAIN",
    score: "SCORE",
    round: "ROUND",
    searching: "SEARCHING...",
    lastGames: "LAST GAMES",
    topTrainers: "TOP TRAINERS",
    aboutTitle: "ABOUT POKECRYING",
    aboutP1: "A Pokemon cry guessing game in retro Game Boy style.",
    aboutP2: "Listen to unique sounds and prove your skills!",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    termsContent: "This is a fan game. All Pokemon rights belong to Nintendo/Creatures Inc./GAME FREAK inc.<br><br>1. Non-commercial use only.<br>2. Data is stored locally.",
    privacyContent: "We don't collect sensitive info.<br><br>1. Collected: Scores, streaks, settings.<br>2. Purpose: Local ranking.<br>3. Storage: LocalStorage only.",
    noData: "NO DATA",
    rank: "RANK",
    combo: "COMBO",
    master: "MASTER TRAINER",
    ace: "ACE TRAINER",
    rookie: "ROOKIE TRAINER",
    navHome: "HOME",
    navHistory: "HISTORY",
    navRanking: "RANKING",
    faqTitle: "Frequently Asked Questions (FAQ)",
    faqQ1: "Q. What is POKECRYING GAME?",
    faqA1: "It's a free web quiz game where you identify Pokemon by their cries alone, featuring a retro Game Boy aesthetic.",
    faqQ2: "Q. How do I play?",
    faqA2: "Listen to the cry and choose the correct Pokemon from 4 options. Use the hint feature if you get stuck!",
    bgmOn: "BGM: ON",
    bgmOff: "BGM: OFF",
    shareBtnStart: "SHARE WITH FRIENDS",
    shareBtnEnd: "SHARE MY SCORE",
    shareTitle: "POKECRYING GAME",
    shareMessage: "Can you identify Pokemon by their cries? Challenge me!",
    shareResult: "I scored {score} PTS in POKECRYING GAME! Can you beat me?",
    copySuccess: "Link copied to clipboard!"
  },
  ja: {
    mainTitle: "POKECRYING GAME",
    mainSubtitle: "伝説のトレーナーに挑戦！<br>鳴き声だけでポケモンを特定できますか？",
    pressStart: "プレス スタート",
    selectDiffText: "難易度を選択して開始してください",
    easy: "かんたん",
    normal: "ふつう",
    hard: "むずかしい",
    battleStart: "▶ バトル開始",
    listenCry: "♪ 鳴き声を聞く",
    hint: "💡 ヒント (-50点)",
    correct: "正解！",
    wrong: "不正解！",
    nextPokemon: "次のポケモン ▶",
    viewResults: "結果を見る ▶",
    tryAgain: "↺ もう一度",
    score: "スコア",
    round: "ラウンド",
    searching: "読み込み中...",
    lastGames: "最近の記録",
    topTrainers: "トップトレーナー",
    aboutTitle: "ポケクライについて",
    aboutP1: "레트로なゲームボーイスタイルのポケモン鳴き声当てクイズです。",
    aboutP2: "ポケモンの鳴き声を聞いて名前を当て、実力を証明しましょう！",
    terms: "利用規約",
    privacy: "プライバシーポリシー",
    termsContent: "本サービスはファンゲームです。著作権は任天堂・クリーチャーズ・ゲームフリークに帰属します。<br><br>1. 非営利目的でのみ利用可能です。<br>2. 記録はローカルに保存されます。",
    privacyContent: "個人情報は収集しません。<br><br>1. 収集項目：スコア、記録、設定。<br>2. 目的：ランキング表示。<br>3. 保存：LocalStorageのみ。",
    noData: "データなし",
    rank: "ランク",
    combo: "コンボ",
    master: "マスター トレーナー",
    ace: "エース トレーナー",
    rookie: "ルーキー トレーナー",
    navHome: "ホーム",
    navHistory: "履歴",
    navRanking: "ランク",
    faqTitle: "よくある質問 (FAQ)",
    faqQ1: "Q. ポ케クライ ゲームとは何ですか？",
    faqA1: "鳴き声だけでポケモンを当てる無料のウェブクイズゲームです。レトロなゲームボーイ風のデザインが特徴です。",
    faqQ2: "Q. どうやってプレイしますか？",
    faqA2: "鳴き声を聞いて、4つの選択肢から正しいポケモンを選びます。難しい場合はヒント機能を使うことができます。",
    bgmOn: "BGM: オン",
    bgmOff: "BGM: オフ",
    shareBtnStart: "友達に教える",
    shareBtnEnd: "スコアをシェア",
    shareTitle: "POKECRYING GAME",
    shareMessage: "鳴き声だけでポケモンがわかりますか？挑戦してみてください！",
    shareResult: "POKECRYING GAMEで {score} 点を獲得しました！私を超えられますか？",
    copySuccess: "リンクをコピーしました！"
  },
  ko: {
    mainTitle: "POKECRYING GAME",
    mainSubtitle: "전설의 트레이너에 도전하세요!<br>소리만으로 포켓몬을 식별할 수 있나요?",
    pressStart: "PRESS START",
    selectDiffText: "난이도를 선택하고 시작하세요",
    easy: "쉬움",
    normal: "보통",
    hard: "어려움",
    battleStart: "▶ 배틀 시작",
    listenCry: "♪ 울음소리 듣기",
    hint: "💡 힌트 (-50점)",
    correct: "정답입니다!",
    wrong: "틀렸습니다!",
    nextPokemon: "다음 포켓몬 ▶",
    viewResults: "결과 보기 ▶",
    tryAgain: "↺ 다시 하기",
    score: "SCORE",
    round: "ROUND",
    searching: "검색 중...",
    lastGames: "최근 기록",
    topTrainers: "명예의 전당",
    aboutTitle: "ABOUT POKECRYING",
    aboutP1: "추억의 게임보이 스타일로 즐기는 포켓몬 울음소리 맞추기 게임입니다.",
    aboutP2: "각 포켓몬 고유의 사운드를 듣고 이름을 맞춰 당신의 실력을 증명하세요!",
    terms: "이용약관",
    privacy: "개인정보처리방침",
    termsContent: "본 서비스는 팬 게임으로, 모든 포켓몬 관련 저작권은 Nintendo/Creatures Inc./GAME FREAK inc.에 있습니다.<br><br>1. 사용자는 비상업적인 목적으로만 본 서비스를 이용할 수 있습니다.<br>2. 서비스 내 점수 및 기록은 브라우저 로컬 저장소에 저장될 수 있습니다.",
    privacyContent: "POKECRYING GAME은 사용자의 민감한 개인정보를 수집하지 않습니다.<br><br>1. 수집 항목: 게임 점수, 콤보 기록, 난이도 설정값.<br>2. 수집 목적: 게임 기록 유지 및 로컬 랭킹 시스템 제공.<br>3. 저장 방식: 사용자의 로컬 브라우저 저장소(LocalStorage)를 이용하며 서버에는 저장되지 않습니다.",
    noData: "기록 없음",
    rank: "RANK",
    combo: "COMBO",
    master: "마스터 트레이너",
    ace: "에이스 트레이너",
    rookie: "루키 트레이너",
    navHome: "홈",
    navHistory: "기록",
    navRanking: "랭킹",
    faqTitle: "자주 묻는 질문 (FAQ)",
    faqQ1: "Q. 포켓크라이 게임은 어떤 게임인가요?",
    faqA1: "소리만으로 포켓몬을 식별하는 무료 웹 퀴즈 게임입니다. 게임보이 감성으로 즐길 수 있습니다.",
    faqQ2: "Q. 어떻게 플레이하나요?",
    faqA2: "울음소리를 듣고 4개의 선택지 중 정답인 포켓몬을 고르면 됩니다. 어려울 땐 힌트 기능을 사용할 수 있습니다.",
    bgmOn: "BGM: 켜짐",
    bgmOff: "BGM: 꺼짐",
    shareBtnStart: "친구에게 공유하기",
    shareBtnEnd: "내 점수 공유하기",
    shareTitle: "POKECRYING GAME",
    shareMessage: "포켓몬 울음소리만 듣고 맞출 수 있나요? 지금 도전해보세요!",
    shareResult: "POKECRYING GAME에서 {score}점을 획득했습니다! 당신도 도전해보세요!",
    copySuccess: "링크가 복사되었습니다!"
  }
};

let state = {
  lang: 'en',
  difficulty: 1,
  maxId: 151,
  currentRound: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  correctCount: 0,
  usedIds: [],
  currentPokemon: null,
  currentSpecies: null,
  timeLeft: TIME_LIMIT,
  timerInterval: null,
  isAnswered: true, 
  hintUsed: false,
  audio: null,
  crySrc: '',
  cache: {},
  speciesCache: {}
};

const els = {
  body: document.getElementById('gameBody'),
  screens: document.querySelectorAll('.screen'),
  bgRows: [document.getElementById('bgRow1'), document.getElementById('bgRow2'), document.getElementById('bgRow3')],
  
  headerScore: document.getElementById('headerScore'),
  headerRound: document.getElementById('headerRound'),
  timerBar: document.getElementById('timerBar'),
  pokemonSprite: document.getElementById('pokemonSprite'),
  unknownIcon: document.getElementById('unknownIcon'),
  playCryBtn: document.getElementById('playCryBtn'),
  hintBtn: document.getElementById('hintBtn'),
  choices: document.getElementById('choices'),
  resultMsg: document.getElementById('resultMsg'),
  nextBtnWrap: document.getElementById('nextBtnWrap'),
  
  finalScore: document.getElementById('finalScore'),
  finalGrade: document.getElementById('finalGrade'),
  statRank: document.getElementById('statRank'),
  statStreak: document.getElementById('statStreak'),
  historyList: document.getElementById('historyList'),
  rankingList: document.getElementById('rankingList'),

  startBtn: document.getElementById('startBtn'),
  nextBtn: document.getElementById('nextBtn'),
  restartBtn: document.getElementById('restartBtn'),
  diffBtns: document.querySelectorAll('.diff-btn'),

  startUI: document.getElementById('startUI'),
  gameUI: document.getElementById('gameUI'),
  endUI: document.getElementById('endUI'),

  modalTerms: document.getElementById('modalTerms'),
  modalPrivacy: document.getElementById('modalPrivacy'),

  bgm: document.getElementById('bgm'),
  bgmToggle: document.getElementById('bgmToggle'),
  
  langBtns: document.querySelectorAll('.lang-btn'),
  navHome: document.getElementById('navHome'),
  navHistory: document.getElementById('navHistory'),
  navRanking: document.getElementById('navRanking'),
  scoreBoard: document.getElementById('scoreBoard'),
  
  shareBtnStart: document.getElementById('shareBtnStart'),
  shareBtnEnd: document.getElementById('shareBtnEnd')
};

function init() {
  setupEventListeners();
  initBackgroundRows();
  if (els.bgm) els.bgm.volume = 0.3;
  updateLanguage('en');
}

function setupEventListeners() {
  els.startBtn.addEventListener('click', startGame);
  els.nextBtn.addEventListener('click', nextRound);
  els.restartBtn.addEventListener('click', () => showScreen('screenStart'));
  els.playCryBtn.addEventListener('click', playCry);
  els.hintBtn.addEventListener('click', useHint);

  els.bgmToggle.addEventListener('click', toggleBGM);

  els.diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.difficulty = parseInt(btn.dataset.diff);
      state.maxId = DIFFICULTIES[state.difficulty].maxId;
      els.diffBtns.forEach(b => b.classList.toggle('selected', b === btn));
    });
  });

  els.langBtns.forEach(btn => {
    btn.addEventListener('click', () => updateLanguage(btn.dataset.lang));
  });

  els.navHome.addEventListener('click', () => { stopEverything(); showScreen('screenStart'); });
  els.navHistory.addEventListener('click', () => { stopEverything(); showHistory(); });
  els.navRanking.addEventListener('click', () => { stopEverything(); showRanking(); });

  document.getElementById('openTerms').addEventListener('click', () => els.modalTerms.style.display = 'flex');
  document.getElementById('openPrivacy').addEventListener('click', () => els.modalPrivacy.style.display = 'flex');
  document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', (e) => e.target.closest('.modal-overlay').style.display = 'none'));

  els.shareBtnStart.addEventListener('click', () => shareGame(false));
  els.shareBtnEnd.addEventListener('click', () => shareGame(true));
}

function updateLanguage(lang) {
  state.lang = lang;
  const t = translations[lang];
  
  // Update HTML elements
  document.getElementById('t-mainTitle').innerHTML = t.mainTitle;
  document.getElementById('t-mainSubtitle').innerHTML = t.mainSubtitle;
  document.getElementById('t-pressStart').innerHTML = t.pressStart;
  document.getElementById('t-selectDiffText').innerHTML = t.selectDiffText;
  
  els.startBtn.innerHTML = t.battleStart;
  els.playCryBtn.innerHTML = t.listenCry;
  els.hintBtn.innerHTML = t.hint;
  els.restartBtn.innerHTML = t.tryAgain;
  
  els.diffBtns[0].innerHTML = t.easy;
  els.diffBtns[1].innerHTML = t.normal;
  els.diffBtns[2].innerHTML = t.hard;
  
  els.navHome.textContent = t.navHome;
  els.navHistory.textContent = t.navHistory;
  els.navRanking.textContent = t.navRanking;

  // Update Scoreboard labels
  els.scoreBoard.querySelector('div:first-child span:first-child').textContent = t.score;
  els.scoreBoard.querySelector('div:last-child span:first-child').textContent = t.round;

  // About Section
  document.getElementById('t-aboutTitle').textContent = t.aboutTitle;
  document.getElementById('t-aboutP1').textContent = t.aboutP1;
  document.getElementById('t-aboutP2').textContent = t.aboutP2;
  
  // FAQ Section
  document.getElementById('t-faqTitle').textContent = t.faqTitle;
  document.getElementById('t-faqQ1').textContent = t.faqQ1;
  document.getElementById('t-faqA1').textContent = t.faqA1;
  document.getElementById('t-faqQ2').textContent = t.faqQ2;
  document.getElementById('t-faqA2').textContent = t.faqA2;

  document.getElementById('openTerms').textContent = t.terms;
  document.getElementById('openPrivacy').textContent = t.privacy;

  // Modals
  els.modalTerms.querySelector('h3').textContent = t.terms;
  els.modalTerms.querySelector('.modal-body').innerHTML = t.termsContent;
  els.modalPrivacy.querySelector('h3').textContent = t.privacy;
  els.modalPrivacy.querySelector('.modal-body').innerHTML = t.privacyContent;

  // Share buttons
  els.shareBtnStart.textContent = t.shareBtnStart;
  els.shareBtnEnd.textContent = t.shareBtnEnd;

  updateBGMText();

  // Highlight active lang btn
  els.langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
}

function updateBGMText() {
  const t = translations[state.lang];
  if (els.bgm.paused) {
    els.bgmToggle.textContent = t.bgmOff;
    els.bgmToggle.style.color = '#000';
  } else {
    els.bgmToggle.textContent = t.bgmOn;
    els.bgmToggle.style.color = 'var(--gb-button)';
  }
}

function stopEverything() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
  if (state.audio) {
    state.audio.pause();
    state.audio.oncanplaythrough = null;
    state.audio = null;
  }
}

function initBackgroundRows() {
  const ids = [1, 4, 7, 25, 39, 52, 94, 131, 133, 143, 150, 151, 172, 175, 252, 255, 258];
  els.bgRows.forEach(row => {
    if (!row) return;
    const sprites = Array(15).fill(0).map(() => {
      const id = ids[Math.floor(Math.random() * ids.length)];
      return `<img class="bg-sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">`;
    }).join('');
    row.innerHTML = sprites + sprites;
  });
}

function showScreen(id) {
  stopEverything();
  els.screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  els.startUI.classList.toggle('hidden', id !== 'screenStart');
  els.gameUI.classList.toggle('hidden', id !== 'screenGame');
  els.endUI.classList.toggle('hidden', id !== 'screenEnd');
  els.body.classList.toggle('game-started', id === 'screenGame');
  updateHeader();
}

async function startGame() {
  state = { ...state, currentRound: 0, score: 0, streak: 0, maxStreak: 0, correctCount: 0, usedIds: [], isAnswered: true, hintUsed: false };
  showScreen('screenGame');
  await loadRound();
}

async function loadRound() {
  stopEverything();
  state.isAnswered = true; 
  state.hintUsed = false;
  state.timeLeft = TIME_LIMIT;
  
  state.currentRound++;
  updateHeader();

  const t = translations[state.lang];
  els.timerBar.style.width = '100%';
  els.resultMsg.style.display = 'none';
  els.nextBtnWrap.classList.add('hidden');
  els.choices.innerHTML = `<div style="font-size:18px; width:100%; text-align:center; padding:20px;">${t.searching}</div>`;
  els.pokemonSprite.className = 'pokemon-sprite hidden-sprite';
  els.pokemonSprite.style.opacity = '0';
  els.unknownIcon.style.display = 'block';
  els.hintBtn.disabled = true;
  els.playCryBtn.disabled = true;

  try {
    const answerId = getUnusedId();
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${answerId}`);
    const data = await res.json();
    state.currentPokemon = data;
    
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();
    state.currentSpecies = speciesData;
    
    state.crySrc = data.cries.latest || data.cries.legacy;
    els.pokemonSprite.src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;

    const answerName = `${getPokemonName(speciesData)} (${data.name.toUpperCase()})`;
    const options = [answerName];
    
    while(options.length < 4) {
      const rid = Math.floor(Math.random() * state.maxId) + 1;
      if (state.usedIds.includes(rid)) continue;
      
      const rRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${rid}`);
      const rData = await rRes.json();
      const rsRes = await fetch(rData.species.url);
      const rsData = await rsRes.json();
      const rName = `${getPokemonName(rsData)} (${rData.name.toUpperCase()})`;
      if (!options.includes(rName)) options.push(rName);
    }
    options.sort(() => Math.random() - 0.5);

    els.choices.innerHTML = options.map(opt => `<button class="choice-btn" data-correct="${opt === answerName}">${opt}</button>`).join('');
    els.choices.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => handleAnswer(e.currentTarget, btn.dataset.correct === 'true'));
    });

    state.audio = new Audio(state.crySrc);
    state.audio.volume = 0.5;
    state.audio.oncanplaythrough = () => {
      if (state.isAnswered && state.timeLeft === TIME_LIMIT) {
        state.isAnswered = false; 
        els.hintBtn.disabled = false;
        els.playCryBtn.disabled = false;
        playCry();
        startTimer();
      }
    };

  } catch (err) {
    state.currentRound--;
    state.usedIds.pop();
    setTimeout(loadRound, 1000);
  }
}

function handleAnswer(btn, correct) {
  if (state.isAnswered) return;
  state.isAnswered = true;
  stopEverything();

  const t = translations[state.lang];
  if (correct) {
    const points = Math.round(state.timeLeft * 10);
    state.score += points;
    state.streak++;
    state.correctCount++;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    if(btn) btn.style.background = 'var(--primary)';
    els.resultMsg.textContent = t.correct;
    els.resultMsg.style.color = 'var(--gb-dark)';
  } else {
    state.streak = 0;
    if(btn) btn.style.background = 'var(--error)';
    els.resultMsg.textContent = t.wrong;
    els.resultMsg.style.color = 'var(--error)';
    highlightCorrect();
  }

  revealPokemon();
  updateHeader();
  els.resultMsg.style.display = 'block';
  els.nextBtnWrap.classList.remove('hidden');
  
  if (state.currentRound >= ROUNDS) {
    els.nextBtn.textContent = t.viewResults;
  } else {
    els.nextBtn.textContent = t.nextPokemon;
  }
}

function startTimer() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timeLeft = TIME_LIMIT;
  state.timerInterval = setInterval(() => {
    state.timeLeft -= 0.1;
    els.timerBar.style.width = (state.timeLeft / TIME_LIMIT) * 100 + '%';
    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      handleAnswer(null, false);
    }
  }, 100);
}

function playCry() {
  if (state.audio) {
    state.audio.currentTime = 0;
    state.audio.play().catch(() => {});
  }
}

function useHint() {
  if (state.isAnswered || state.hintUsed) return;
  state.hintUsed = true;
  state.score = Math.max(0, state.score - 50);
  updateHeader();
  els.pokemonSprite.style.opacity = '1';
  els.pokemonSprite.classList.add('hidden-sprite');
  els.unknownIcon.style.display = 'none';
  els.hintBtn.disabled = true;
}

function revealPokemon() {
  els.pokemonSprite.style.opacity = '1';
  els.pokemonSprite.classList.remove('hidden-sprite');
  els.unknownIcon.style.display = 'none';
}

function highlightCorrect() {
  const correctName = `${getPokemonName(state.currentSpecies)} (${state.currentPokemon.name.toUpperCase()})`;
  els.choices.querySelectorAll('.choice-btn').forEach(btn => {
    if (btn.textContent === correctName) btn.style.background = 'var(--primary)';
  });
}

function updateHeader() {
  els.headerScore.textContent = state.score;
  if (els.headerRound) {
    els.headerRound.textContent = `${state.currentRound}/${ROUNDS}`;
  }
}

function nextRound() {
  if (state.currentRound < ROUNDS) {
    loadRound();
  } else {
    endGame();
  }
}

function getPokemonName(species) {
  const langKey = state.lang;
  const nameObj = species.names.find(n => n.language.name === (langKey === 'ko' ? 'ko' : langKey === 'ja' ? 'ja-Hrkt' : 'en'));
  return nameObj ? nameObj.name : species.name;
}

function getUnusedId() {
  let id;
  do { id = Math.floor(Math.random() * state.maxId) + 1; }
  while (state.usedIds.includes(id));
  state.usedIds.push(id);
  return id;
}

function showHistory() {
  showScreen('screenHistory');
  const t = translations[state.lang];
  els.screens[3].querySelector('div').textContent = t.lastGames;
  const history = JSON.parse(localStorage.getItem('pokeHistory') || '[]');
  els.historyList.innerHTML = history.length ? history.map(h => 
    `<div style="margin-bottom:10px; border-bottom:1px solid rgba(0,0,0,0.1); padding-bottom:5px;">${h.date}: ${h.score} PTS</div>`
  ).join('') : t.noData;
}

function showRanking() {
  showScreen('screenRanking');
  const t = translations[state.lang];
  els.screens[4].querySelector('div').textContent = t.topTrainers;
  const ranking = JSON.parse(localStorage.getItem('pokeRanking') || '[]');
  els.rankingList.innerHTML = ranking.length ? ranking.map((r, i) => 
    `<div style="margin-bottom:10px;">${i+1}st: ${r.score} PTS (${r.date})</div>`
  ).join('') : t.noData;
}

function endGame() {
  const history = JSON.parse(localStorage.getItem('pokeHistory') || '[]');
  history.unshift({ date: new Date().toLocaleDateString(), score: state.score });
  localStorage.setItem('pokeHistory', JSON.stringify(history.slice(0, 10)));
  
  const ranking = JSON.parse(localStorage.getItem('pokeRanking') || '[]');
  ranking.push({ score: state.score, date: new Date().toLocaleDateString() });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem('pokeRanking', JSON.stringify(ranking.slice(0, 5)));

  showScreen('screenEnd');
  const t = translations[state.lang];
  els.finalScore.textContent = `${state.score} PTS`;
  els.statRank.previousElementSibling.textContent = t.rank;
  els.statStreak.previousElementSibling.textContent = t.combo;
  els.statRank.textContent = `TOP ${Math.floor(Math.random() * 15) + 1}%`;
  els.statStreak.textContent = state.maxStreak;
  const pct = state.correctCount / ROUNDS;
  els.finalGrade.textContent = pct >= 0.9 ? t.master : pct >= 0.7 ? t.ace : t.rookie;
}

function toggleBGM() {
  if (els.bgm.paused) {
    els.bgm.play();
  } else {
    els.bgm.pause();
  }
  updateBGMText();
}

async function shareGame(isResult) {
  const t = translations[state.lang];
  const url = "https://pokemongame.cc/";
  const text = isResult 
    ? t.shareResult.replace('{score}', state.score)
    : t.shareMessage;

  if (navigator.share) {
    try {
      await navigator.share({
        title: t.shareTitle,
        text: text,
        url: url
      });
    } catch (err) {}
  } else {
    // Fallback to clipboard
    const fullText = `${text}\n${url}`;
    try {
      await navigator.clipboard.writeText(fullText);
      alert(t.copySuccess);
    } catch (err) {
      // Manual fallback for old browsers
      const textArea = document.createElement("textarea");
      textArea.value = fullText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(t.copySuccess);
    }
  }
}

init();
