/* Copyright (c) 2019 Arseniy Tomkevich */

"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WhackMole =
/*#__PURE__*/
function () {
  function WhackMole(startButton, moles, scoreOut, gameDuration, options) {
    _classCallCheck(this, WhackMole);

    this.btnStart = startButton;
    this.moles = moles;
    this.scoreOut = scoreOut;
    this.avaliableScores = 0;
    this.avaliableScoresOut = options.allScoresBtn;
    this.gameTime = gameDuration;
    this.minmeowTime = options.meowMinTime != null ? options.meowMinTime : 1000;
    this.maxmeowTime = options.meowMaxTime != null ? options.meowMaxTime : 3000;
    this.afterEveryMeowInterval = options.afterEveryMeowInterval != null ? options.afterEveryMeowInterval : 1000;
    this.speedUpAfterEveryMeowInterval = this.afterEveryMeowInterval;
    this.numOfMoles = this.moles.length;
    this.numKeyPad = options.numKeyPad != null ? options.numKeyPad : true;
    this.meowAfterMeow = options.meowAfterMeow != null ? options.meowAfterMeow : false;
    this.prevMoleNumber = null;
    this.timeUp = false;
    this.score = 0;
    this.gameTimer = null;
    this.meowTimer = {};
    this.intervalTimer = null;
    this.currentMolesPos = {};
    this.defoultCat = './images/mole_01.png';
    this.halfClippedCat = './images/mole_02.png';
    this.clippedCat = './images/mole_03.png';
    this.beginPos = 120;
    this.endPos = -10;
    this.speedUpTime = 0;
  }

  _createClass(WhackMole, [{
    key: "init",
    value: function init() {
      var _this = this;

      this.scoreOut.innerHTML = this.score;
      this.timeUp = false;
      this.prevMoleNumber = null;
      this.btnStart.classList.remove('start');
      this.btnStart.classList.add('finish');
      this.meow();
      this.intervalTimer = setInterval(function () {
        if (_this.timeUp === false) {
          _this.meow();
        } else {
          _this.stop();
        }
      }, this.speedUpAfterEveryMeowInterval);
      this.numKeyPadActive();
      this.gameTimer = setTimeout(function () {
        _this.stop();
      }, this.gameTime);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.btnStart.classList.remove('finish');
      this.btnStart.classList.add('start');
      this.timeUp = true;

      for (var i = 0; i < this.moles.length; i++) {
        this.clickd(this.moles[i]);
      }

      var timers = Object.keys(this.meowTimer);

      for (var _i = 0; _i < timers.length; _i++) {
        cancelAnimationFrame(this.meowTimer[timers[_i]]);
      }

      clearInterval(this.gameTimer);
      clearInterval(this.intervalTimer);
    }
  }, {
    key: "resetApp",
    value: function resetApp() {
      this.speedUpTime = 0;
      this.scoreOut.innerHTML = this.score = 0;
      this.avaliableScoresOut.innerHTML = this.avaliableScores = 0;
      this.speedUpAfterEveryMeowInterval = this.afterEveryMeowInterval;
      this.stop();
    }
  }, {
    key: "meow",
    value: function meow() {
      var time = this._randomTime(this.minmeowTime, this.maxmeowTime) - this.speedUpTime,
          upDirection = true,
          localEndPos = this.endPos,
          currentPos = this.beginPos,
          self = this,
          fakeMeowChance = Math.random().toFixed(2);

      var mole = this._randomMole(this.moles),
          beginTime = Date.now();

      if (fakeMeowChance < 0.2) {
        localEndPos = 75;
        time = 400;
        mole.classList.add('faked');
      }

      if (time < 400) {
        time = 400;
      }

      mole.classList.add('visible');
      cancelAnimationFrame(this.meowTimer[mole.id]);
      this.meowTimer[mole.id] = requestAnimationFrame(function animateMole() {
        var duration = Date.now() - beginTime;

        if (currentPos > 57 && currentPos <= 63 && upDirection === true) {
          self.avaliableScoresOut.innerHTML = ++self.avaliableScores;
        }

        if (currentPos <= self.beginPos && currentPos >= localEndPos && upDirection === true) {
          currentPos -= 5;
        } else if (currentPos <= self.beginPos && upDirection === false) {
          currentPos += 5;
        } else if (currentPos > self.beginPos && upDirection === false) {
          cancelAnimationFrame(self.meowTimer[mole.id]);
          mole.classList.remove('visible');
          mole.classList.remove('faked');
        }

        mole.style.transform = "translate3d(0, ".concat(currentPos, "px, 0)");
        self.currentMolesPos[mole.id] = currentPos;

        if (duration > time) {
          upDirection = false;
        }

        self.meowTimer[mole.id] = requestAnimationFrame(animateMole);
      });
    }
  }, {
    key: "clickd",
    value: function clickd(mole) {
      var _this2 = this;

      if (!mole.classList.contains('clicked') && !mole.classList.contains('faked')) {
        var currentPos = this.currentMolesPos[mole.id];
        mole.classList.add('clicked');
        cancelAnimationFrame(this.meowTimer[mole.id]);
        var endAnimTimer = requestAnimationFrame(function endAnimation() {
          currentPos += 10;
          mole.style.transform = "translate3d(0, ".concat(currentPos, "px, 0)");
          endAnimTimer = requestAnimationFrame(endAnimation);

          if (currentPos > _this2.beginPos) {
            cancelAnimationFrame(endAnimTimer);
            _this2.currentMolesPos[mole.id] = _this2.beginPos;
          }
        });
        mole.classList.remove('visible');

        if (this.timeUp === false && currentPos < 75) {
          mole.setAttribute('src', this.halfClippedCat);
          setTimeout(function () {
            mole.setAttribute('src', _this2.clippedCat);
            setTimeout(function () {
              mole.setAttribute('src', _this2.defoultCat);
            }, 100);
          }, 100);
          this.score++;
          this.scoreOut.innerHTML = this.score;

          if (this.speedUpTime < this.minmeowTime) {
            this.speedUpTime += 10;
          }

          if (this.speedUpAfterEveryMeowInterval > 300) {
            this.speedUpAfterEveryMeowInterval -= 5;
          }

          if (this.meowAfterMeow === true) {
            this.meow();
          }
        }

        setTimeout(function () {
          mole.classList.remove('clicked');
        }, 1000);
      }
    }
  }, {
    key: "_randomTime",
    value: function _randomTime(min, max) {
      return Math.round(Math.random() * (max - min) + min);
    }
  }, {
    key: "_randomMole",
    value: function _randomMole(moles) {
      var idx = Math.floor(Math.random() * this.numOfMoles);
      var mole = moles[idx];

      if (idx === this.prevMoleNumber) {
        return this._randomMole(moles);
      }

      this.prevMoleNumber = idx;
      return mole;
    }
  }, {
    key: "numKeyPadActive",
    value: function numKeyPadActive() {
      if (this.numKeyPad === true) {
        var mol1 = this.moles[0],
            mol2 = this.moles[1],
            mol3 = this.moles[2],
            mol4 = this.moles[3],
            mol5 = this.moles[4],
            mol6 = this.moles[5],
            mol7 = this.moles[6],
            mol8 = this.moles[7],
            mol9 = this.moles[8],
            self = this;
        document.addEventListener('keydown', function (event) {
          switch (event.keyCode) {
            case 103:
            case 71:
              if (!mol1.classList.contains('clicked') && mol1.classList.contains('visible')) {
                self.clickd(mol1);
              }

              break;

            case 104:
            case 72:
              if (!mol2.classList.contains('clicked') && mol2.classList.contains('visible')) {
                self.clickd(mol2);
              }

              break;

            case 105:
            case 73:
              if (!mol3.classList.contains('clicked') && mol3.classList.contains('visible')) {
                self.clickd(mol3);
              }

              break;

            case 100:
            case 68:
              if (!mol4.classList.contains('clicked') && mol4.classList.contains('visible')) {
                self.clickd(mol4);
              }

              break;

            case 101:
            case 69:
              if (!mol5.classList.contains('clicked') && mol5.classList.contains('visible')) {
                self.clickd(mol5);
              }

              break;

            case 102:
            case 70:
              if (!mol6.classList.contains('clicked') && mol6.classList.contains('visible')) {
                self.clickd(mol6);
              }

              break;

            case 97:
            case 65:
              if (!mol7.classList.contains('clicked') && mol7.classList.contains('visible')) {
                self.clickd(mol7);
              }

              break;

            case 98:
            case 66:
              if (!mol8.classList.contains('clicked') && mol8.classList.contains('visible')) {
                self.clickd(mol8);
              }

              break;

            case 99:
            case 67:
              if (!mol9.classList.contains('clicked') && mol9.classList.contains('visible')) {
                self.clickd(mol9);
              }

              break;

            default:
              break;
          }
        });
      }
    }
  }, {
    key: "setMinmeowTime",
    value: function setMinmeowTime(time) {
      if (typeof time === 'number' && time != undefined) {
        this.minmeowTime = time;
      }
    }
  }, {
    key: "setMaxMeowTime",
    value: function setMaxMeowTime(time) {
      if (typeof time === 'number' && time != undefined) {
        this.maxmeowTime = time;
      }
    }
  }, {
    key: "setGameDuration",
    value: function setGameDuration(time) {
      if (typeof time === 'number' && time != undefined) {
        this.gameTime = time;
      }
    }
  }, {
    key: "setMeowAfterMeowTime",
    value: function setMeowAfterMeowTime(time) {
      if (typeof time === 'number' && time != undefined) {
        this.afterEveryMeowInterval = time;
      }
    }
  }, {
    key: "setMeowAfterMeow",
    value: function setMeowAfterMeow(meowAfterMeow) {
      if (typeof meowAfterMeow === 'boolean' && meowAfterMeow != undefined) {
        this.meowAfterMeow = meowAfterMeow;
      }
    }
  }]);

  return WhackMole;
}();

var startBtn = document.getElementById('control-btn'),
    moles = document.querySelectorAll('.mole-pic'),
    scoreOut = document.getElementById('score'),
    resetBtn = document.getElementById('reset'),
    allScoresBtn = document.getElementById('avaliable-score');
var wam = new WhackMole(startBtn, moles, scoreOut, 60000, {
  numKeyPad: true,
  allScoresBtn: allScoresBtn,
  meowMinTime: 1000,
  meowMaxTime: 2000,
  afterEveryMeowInterval: 1000,
  meowAfterMeow: false
});
wam.btnStart.addEventListener('click', function (event) {
  if (wam.btnStart.classList.contains('start')) {
    wam.init();
  } else {
    wam.stop();
  }
});

for (var i = 0; i < wam.moles.length; i++) {
  wam.moles[i].addEventListener('click', function (event) {
    wam.clickd(event.target);
  });
  wam.moles[i].addEventListener('mousedown', function (event) {
    event.preventDefault();
  });
}

resetBtn.addEventListener('click', function () {
  wam.resetApp();
});
var openMoreSetBtn = document.getElementById('open-more-settings'),
    moreSettingsPanel = document.getElementById('more-settings-panel'),
    gameDurationControl = document.getElementById('game-duration'),
    minDisplayCatTimeControl = document.getElementById('min-meow-time'),
    maxDisplayCatTimeControl = document.getElementById('max-meow-time'),
    catAfterCatIntervalControler = document.getElementById('meow-after-meow-time'),
    catAfterCatControl = document.getElementById('cat-after-cat');
var beginPos = -300;
openMoreSetBtn.addEventListener('click', function () {
  if (moreSettingsPanel.classList.contains('closed')) {
    moreSettingsPanel.classList.remove('closed');
    moreSettingsPanel.classList.add('open');
    var openTimer = requestAnimationFrame(function openSett() {
      beginPos += 20;
      moreSettingsPanel.style.left = "".concat(beginPos, "px");
      openTimer = requestAnimationFrame(openSett);

      if (beginPos > 0) {
        beginPos = 0;
        moreSettingsPanel.style.left = "".concat(beginPos, "px");
        cancelAnimationFrame(openTimer);
      }
    });
  } else if (moreSettingsPanel.classList.contains('open')) {
    var closeTimer = requestAnimationFrame(function closeSett() {
      beginPos -= 20;
      moreSettingsPanel.style.left = "".concat(beginPos, "px");
      closeTimer = requestAnimationFrame(closeSett);

      if (beginPos < -300) {
        beginPos = -300;
        moreSettingsPanel.style.left = "".concat(beginPos, "px");
        cancelAnimationFrame(closeTimer);
      }
    });
    moreSettingsPanel.classList.remove('open');
    moreSettingsPanel.classList.add('closed');
  }
});
gameDurationControl.addEventListener('change', function (event) {
  if (+event.target.value < +event.target.min || isNaN(event.target.value)) {
    event.target.value = event.target.min;
  }

  wam.setGameDuration(+event.target.value * 1000);
});
minDisplayCatTimeControl.addEventListener('change', function (event) {
  if (+event.target.value < +event.target.min || isNaN(event.target.value)) {
    event.target.value = event.target.min;
  }

  if (+event.target.value >= maxDisplayCatTimeControl.value) {
    maxDisplayCatTimeControl.value = (+event.target.value + +maxDisplayCatTimeControl.step).toFixed(1);
  }

  wam.setMinmeowTime(+event.target.value * 1000);
});
maxDisplayCatTimeControl.addEventListener('change', function (event) {
  if (+event.target.value < +event.target.min || isNaN(event.target.value)) {
    event.target.value = event.target.min;
  }

  if (+event.target.value <= minDisplayCatTimeControl.value) {
    minDisplayCatTimeControl.value = (+event.target.value - +minDisplayCatTimeControl.step).toFixed(1);
  }

  wam.setMaxMeowTime(+event.target.value * 1000);
});
catAfterCatIntervalControler.addEventListener('change', function (event) {
  if (+event.target.value < +event.target.min || isNaN(event.target.value)) {
    event.target.value = event.target.min;
  }

  wam.setMeowAfterMeowTime(+event.target.value * 1000);
});
catAfterCatControl.addEventListener('change', function (event) {
  wam.setMeowAfterMeow(event.target.checked);
});