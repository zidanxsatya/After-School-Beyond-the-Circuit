// PROGRES PEMAIN (sederhana, di localStorage).
(function () {
  const SR = window.SR = window.SR || {};
  const KEY = 'sirkuitrahasia.progress.v1';
  const fresh = () => ({ checkpoint: null, storyDone: false, materials: {}, sims: {}, quiz: { attempts: 0, best: null, last: null } });
  let data = Object.assign(fresh(), SR.Store.get(KEY, {}));
  const save = () => SR.Store.set(KEY, data);

  SR.Progress = {
    get: () => data,
    setCheckpoint(scene, line) { data.checkpoint = { scene, line }; save(); },
    clearCheckpoint() { data.checkpoint = null; save(); },
    finishStory() { data.storyDone = true; data.checkpoint = null; save(); },
    markMaterial(id) { data.materials[id] = true; save(); },
    markSim(gate) { data.sims[gate] = true; save(); },
    saveQuiz(r) {
      data.quiz.attempts += 1; data.quiz.last = r;
      if (!data.quiz.best || r.score > data.quiz.best.score) data.quiz.best = { score: r.score, total: r.total };
      save();
    },
    reset() { data = fresh(); save(); }
  };
})();
