// DATA ASET — daftar karakter, ekspresi, latar, dan audio.
// File ini dibuat dari isi folder assets/. Jika Anda menambah/mengganti file, edit daftar di sini.
// Semua path RELATIF terhadap index.html (huruf besar/kecil harus sama persis).
(function () {
  const SR = window.SR = window.SR || {};
  SR.data = SR.data || {};

  // portrait = jendela wajah (x = tepi kiri, w = lebar, pecahan lebar gambar; mulai dari atas gambar) untuk kotak potret persegi.
  // ar = lebar/tinggi sprite, hf = tinggi sprite / tinggi kanvas asli (3000 px) -> menjaga skala antar karakter.
  SR.data.characters = {
    rena: { name: 'Rena', role: 'Detektif', color: '#e58aa8', dir: 'assets/characters/rena/', ar: 0.5807, hf: 0.9460, portrait: { x: 0.225, w: 0.55 }, default: 'normal',
      expressions: ['angry', 'angry2', 'awkward', 'blushing', 'calm', 'cheerful', 'concerned', 'confident', 'disappointed', 'displeased', 'embarrassed', 'eyes_closed_laugh', 'eyes_closed_smile', 'flustered', 'frustrated', 'grinning', 'happy', 'irritated', 'laughing', 'neutral', 'normal', 'sad', 'serious', 'serious2', 'shy', 'skeptical', 'smile', 'smug', 'surprised', 'teasing', 'thinking', 'tired', 'upset', 'worried'] },
    pia: { name: 'Pia', role: 'Kurir Surat', color: '#6fa3e8', dir: 'assets/characters/pia/', ar: 0.4901, hf: 0.9813, portrait: { x: 0.17, w: 0.56 }, default: 'normal',
      expressions: ['angry', 'angry2', 'angry3', 'angry4', 'confused', 'confused2', 'cry_laugh', 'crying', 'eyes_closed', 'eyes_closed2', 'grin', 'grin2', 'normal', 'normal2', 'oops', 'pale', 'sad', 'sad2', 'sad3', 'sad4', 'smile', 'smile2', 'smug', 'smug2', 'smug3', 'sparkle', 'sparkle2', 'squeeze', 'surprised', 'surprised2', 'troubled', 'unamused', 'unamused2', 'wry', 'wry2'] },
    sera: { name: 'Sera', role: 'Ketua Klub Elektronika', color: '#b9a7e6', dir: 'assets/characters/sera/', ar: 0.4170, hf: 0.9863, portrait: { x: 0.13, w: 0.70 }, default: 'normal',
      expressions: ['angry', 'angry2', 'angry3', 'beaming', 'beaming2', 'cold', 'eh', 'exasperated', 'eyes_closed', 'frustrated_cry', 'hah', 'heart_eyes', 'heart_eyes2', 'hmm', 'huh', 'normal', 'normal2', 'puzzled', 'puzzled2', 'puzzled3', 'recoil', 'recoil2', 'sad', 'sad2', 'smile', 'smile2', 'tch', 'tch2', 'tears', 'tears2', 'tears3', 'wry', 'wry2'] },
    kamu: { name: 'Kamu', color: '#9bd1ff', sprite: false }   // pemain: hanya nameplate, tanpa sprite
  };

  SR.data.backgrounds = {
    back_street: 'assets/backgrounds/back_street.webp',
    blackboard: 'assets/backgrounds/blackboard.webp',
    bus_stop: 'assets/backgrounds/bus_stop.webp',
    city_crossing: 'assets/backgrounds/city_crossing.webp',
    city_street: 'assets/backgrounds/city_street.webp',
    classroom_back: 'assets/backgrounds/classroom_back.webp',
    classroom_front: 'assets/backgrounds/classroom_front.webp',
    coffee_shop: 'assets/backgrounds/coffee_shop.webp',
    country_road: 'assets/backgrounds/country_road.webp',
    hallway: 'assets/backgrounds/hallway.webp',
    library: 'assets/backgrounds/library.webp',
    park_gazebo: 'assets/backgrounds/park_gazebo.webp',
    railway_road: 'assets/backgrounds/railway_road.webp',
    residential: 'assets/backgrounds/residential.webp',
    school_entrance: 'assets/backgrounds/school_entrance.webp',
    school_ground: 'assets/backgrounds/school_ground.webp',
    school_spring: 'assets/backgrounds/school_spring.webp',
    train: 'assets/backgrounds/train.webp',
  };

  SR.data.audio = {
    bgm: {  // musik latar (loop)
      evening_road: { file: 'assets/audio/bgm/evening_road.mp3', title: "The Evening Road" },
      everyday_life: { file: 'assets/audio/bgm/everyday_life.mp3', title: "A Story of Everyday Life" },
      happy_days: { file: 'assets/audio/bgm/happy_days.mp3', title: "Happy Days" },
      im_off: { file: 'assets/audio/bgm/im_off.mp3', title: "I'm Off!" },
      lively_time: { file: 'assets/audio/bgm/lively_time.mp3', title: "Lively Time" },
      looking_wonderful: { file: 'assets/audio/bgm/looking_wonderful.mp3', title: "Looking for Something Wonderful" },
      morning: { file: 'assets/audio/bgm/morning.mp3', title: "Getting Ready in the Morning" },
      peaceful: { file: 'assets/audio/bgm/peaceful.mp3', title: "Peaceful" },
      relaxing_time: { file: 'assets/audio/bgm/relaxing_time.mp3', title: "Relaxing Time" },
      snowmelt: { file: 'assets/audio/bgm/snowmelt.mp3', title: "Snowmelt" },
      wonderful_happening: { file: 'assets/audio/bgm/wonderful_happening.mp3', title: "A Wonderful Happening" },
    },
    sfx: {  // efek suara
      ambient_cicada: 'assets/audio/sfx/ambient_cicada.mp3',
      ambient_street: 'assets/audio/sfx/ambient_street.mp3',
      ambient_wind: 'assets/audio/sfx/ambient_wind.mp3',
      appear: 'assets/audio/sfx/appear.mp3',
      blink: 'assets/audio/sfx/blink.mp3',
      cute_action: 'assets/audio/sfx/cute_action.mp3',
      cute_sit: 'assets/audio/sfx/cute_sit.mp3',
      door_close: 'assets/audio/sfx/door_close.mp3',
      door_open: 'assets/audio/sfx/door_open.mp3',
      droop: 'assets/audio/sfx/droop.mp3',
      goofy1: 'assets/audio/sfx/goofy1.mp3',
      goofy3: 'assets/audio/sfx/goofy3.mp3',
      goofy4: 'assets/audio/sfx/goofy4.mp3',
      goofy5: 'assets/audio/sfx/goofy5.mp3',
      heartbeat: 'assets/audio/sfx/heartbeat.mp3',
      idea: 'assets/audio/sfx/idea.mp3',
      kiran: 'assets/audio/sfx/kiran.mp3',
      power_up: 'assets/audio/sfx/power_up.mp3',
      quiz_correct: 'assets/audio/sfx/quiz_correct.mp3',
      quiz_wrong: 'assets/audio/sfx/quiz_wrong.mp3',
      scene_change: 'assets/audio/sfx/scene_change.mp3',
      shock: 'assets/audio/sfx/shock.mp3',
      sparkle_shine: 'assets/audio/sfx/sparkle_shine.mp3',
      sting: 'assets/audio/sfx/sting.mp3',
      surprise: 'assets/audio/sfx/surprise.mp3',
      switch: 'assets/audio/sfx/switch.mp3',
      tremble: 'assets/audio/sfx/tremble.mp3',
      tsukkomi1: 'assets/audio/sfx/tsukkomi1.mp3',
      tsukkomi2: 'assets/audio/sfx/tsukkomi2.mp3',
      tsukkomi3: 'assets/audio/sfx/tsukkomi3.mp3',
      twinkle: 'assets/audio/sfx/twinkle.mp3',
      ui_confirm: 'assets/audio/sfx/ui_confirm.mp3',
      walk_grass: 'assets/audio/sfx/walk_grass.mp3',
      walk_hallway: 'assets/audio/sfx/walk_hallway.mp3',
      walk_shoes: 'assets/audio/sfx/walk_shoes.mp3',
    },
    // Suara antarmuka -> id efek di atas
    ui: { click: 'ui_confirm', toggle: 'switch', correct: 'quiz_correct', wrong: 'quiz_wrong', scene: 'scene_change', unlock: 'door_open' },
    // Skala volume khusus suara latar (ambience) relatif terhadap volume efek
    ambientGain: 0.5
  };
})();
