(function () {
  var wrap = document.querySelector(".video");
  var target = document.querySelector("#player");
  var playButton = document.querySelector(".video-play");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var TITLE_DELAY = 600;
  var LOGO_DELAY = 1200;
  var SUBTITLE_DELAY = 2400;
  var REVEAL_DELAY = 4000;
  var textsRevealed = false;
  var playbackStarted = false;

  var scheduleTextReveal = function () {
    if (textsRevealed) return;
    textsRevealed = true;
    var title = document.querySelector(".landing h1");
    var logo = document.querySelector(".logo");
    var subtitles = document.querySelector(".subtitle-container");

    setTimeout(function () {
      if (title) title.classList.add("is-ready");
    }, TITLE_DELAY);

    setTimeout(function () {
      if (logo) logo.classList.add("is-ready");
    }, LOGO_DELAY);

    setTimeout(function () {
      if (subtitles) subtitles.classList.add("is-ready");
    }, SUBTITLE_DELAY);
  };

  var showPlayButton = function () {
    if (playbackStarted || !wrap) return;
    wrap.classList.add("is-waiting");
  };

  var hidePlayButton = function () {
    if (!wrap) return;
    wrap.classList.remove("is-waiting");
  };

  scheduleTextReveal();

  setTimeout(showPlayButton, reduceMotion ? 0 : REVEAL_DELAY);

  if (!wrap || !target || typeof Plyr === "undefined") return;

  var TZ = "Europe/Athens";
  var started = false;
  var revealed = false;
  var revealTimer;
  var manual = false;

  var player = new Plyr(target, {
    autoplay: !reduceMotion,
    muted: true,
    loop: { active: true },
    controls: [],
    clickToPlay: false,
    hideControls: true,
    resetOnEnd: false,
    captions: { active: false, update: false },
    fullscreen: { enabled: false, fallback: false },
    keyboard: { focused: false, global: false },
    youtube: {
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      customControls: true,
      noCookie: false,
      cc_load_policy: 0,
      loop: 1,
      playlist: "lFyqi_EfLNk"
    }
  });

  var secondsSinceMidnight = function () {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h23"
    }).formatToParts(new Date());
    var value = function (type) {
      var part = parts.filter(function (item) {
        return item.type === type;
      })[0];
      return part ? Number(part.value) : 0;
    };
    return value("hour") * 3600 + value("minute") * 60 + value("second");
  };

  var exhibitionTime = function (duration) {
    if (!duration || !isFinite(duration) || duration <= 0) return 0;
    return secondsSinceMidnight() % duration;
  };

  var durationOf = function () {
    var duration = player.duration;
    if (duration && isFinite(duration) && duration > 0) return duration;
    var embed = player.embed;
    if (embed && typeof embed.getDuration === "function") {
      duration = embed.getDuration();
      if (duration && isFinite(duration) && duration > 0) return duration;
    }
    return 0;
  };

  var seekTo = function (seconds) {
    var embed = player.embed;
    if (embed && typeof embed.seekTo === "function") {
      embed.seekTo(seconds, true);
      return;
    }
    player.currentTime = seconds;
  };

  var seekToExhibition = function () {
    var duration = durationOf();
    if (!duration) return false;
    seekTo(exhibitionTime(duration));
    return true;
  };

  var disableCaptions = function () {
    if (typeof player.toggleCaptions === "function") {
      player.toggleCaptions(false);
    }
    var embed = player.embed;
    if (embed && typeof embed.unloadModule === "function") {
      embed.unloadModule("captions");
      embed.unloadModule("cc");
    }
  };

  var playNow = function () {
    player.muted = true;
    disableCaptions();
    var embed = player.embed;
    if (embed && typeof embed.playVideo === "function") {
      embed.playVideo();
    }
    var play = player.play();
    if (play && typeof play.catch === "function") {
      play.catch(function () {
        showPlayButton();
      });
    }
  };

  var joinExhibition = function () {
    if (started || manual) return;
    if (!seekToExhibition()) {
      setTimeout(joinExhibition, 80);
      return;
    }
    started = true;
    if (!playbackStarted) playNow();
  };

  var scheduleVideoReveal = function (delay) {
    if (revealed || revealTimer) return;
    revealTimer = setTimeout(function () {
      revealed = true;
      wrap.classList.add("is-ready");
    }, delay);
  };

  player.on("ready", function () {
    player.muted = true;
    disableCaptions();
    if (!reduceMotion && !manual) joinExhibition();
  });

  player.on("playing", function () {
    if (playbackStarted) return;
    playbackStarted = true;
    started = true;
    disableCaptions();
    hidePlayButton();
    scheduleVideoReveal(manual || reduceMotion ? 400 : REVEAL_DELAY);
  });

  if (playButton) {
    playButton.addEventListener("click", function () {
      manual = true;
      playNow();
    });
  }
})();
