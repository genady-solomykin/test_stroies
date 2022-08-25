"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var storiesCircleArr = [];
var swiper;
var timer;
var allSlides = 5;
var storiesCircleElm = document.querySelectorAll('.stories-cirle-wrapper__circle');
storiesCircleElm.forEach(function (item, index) {
  storiesCircleArr.push(item);
  item.id = index;
  item.addEventListener('click', function () {
    document.querySelector('.slider-none').style.display = 'block';

    if (!swiper) {
      initSwiper(index);
    } else {
      swiper.slideTo(index);
      activateAll(swiper.slides[index]);
      runInterval(index, 5, 1);
    }
  });
});

function initSwiper(initIndex) {
  swiper = new Swiper(".stories-swiper", {
    slidesPerView: allSlides,
    spaceBetween: 30,
    centeredSlides: true,
    noSwiping: true,
    noSwipingClass: 'swiper-slide',
    lazyLoad: true,
    on: {
      init: function init() {
        this.slideTo(initIndex);
        activateAll(this.slides[initIndex]);
        runInterval(initIndex, 5, 1);
      }
    }
  });
  var storiesMainElement = document.querySelector('.stories-swiper');
  document.querySelector('.slider-close').addEventListener('click', function () {
    document.querySelector('.slider').style.display = 'none';
    clearInterval(timer);
    deactivateAll(swiper.slides[swiper.activeIndex]);
  });
  storiesMainElement.querySelectorAll('.swiper-slide').forEach(function (element, index) {
    element.addEventListener('click', function () {
      swiper.slideTo(index);
    });
  });
  swiper.on('slideChange', function () {
    var curSlide = swiper.slides[swiper.activeIndex];
    var prevSlide = storiesMainElement.querySelector('.story-current-slide');

    if (prevSlide) {
      deactivateAll(prevSlide);
    }

    activateAll(curSlide);
    clearInterval(timer);
    runInterval(swiper.activeIndex, 5, 1);
  });
}

function activateAll(element) {
  element.classList.add('story-current-slide');
  element.querySelector('.player-chunk-prev').addEventListener('click', prev);
  element.querySelector('.player-chunk-next').addEventListener('click', next);
}

function deactivateAll(element) {
  element.classList.remove('story-current-slide');
  element.querySelector('.player-chunk-prev').removeEventListener('click', prev);
  element.querySelector('.player-chunk-next').removeEventListener('click', next);
  var activeTimeline = element.querySelector('.timeline-chunk-active').querySelector('.timeline-chunk-inner');
  activeTimeline.style.width = 0;
}

var moveClass = function moveClass(el, className, method, pred) {
  var active = el.querySelector('.' + className),
      next = active[method];

  if (pred && !pred(active)) {
    return null;
  }

  if (next) {
    active.classList.remove(className);
    next.classList.add(className);
    return active;
  }

  return null;
};

function prev(e) {
  var target = e.target.closest('.player');
  console.log(target);
  moveClass(target, 'player-chunk-active', 'previousElementSibling');
  var hasPrev = moveClass(target, 'timeline-chunk-active', 'previousElementSibling', function (el) {
    var inner = el.querySelector('.timeline-chunk-inner'),
        width = parseFloat(inner.style.width) || 0;
    el.querySelector('.timeline-chunk-inner').style.width = '';
    return width <= 100;
  });

  if (!hasPrev) {
    swiper.slidePrev();
  }

  e.stopPropagation();
}

function next(e) {
  var target = e.target.closest('.player');
  moveClass(target, 'player-chunk-active', 'nextElementSibling');
  var el = moveClass(target, 'timeline-chunk-active', 'nextElementSibling');

  if (el) {
    el.querySelector('.timeline-chunk-inner').style.width = '';
  } else {
    swiper.slideNext();
  }

  if (e.stopPropagation) {
    e.stopPropagation();
  }
} // Авто прееключение сладеров по TimeLine...


function runInterval(elIndex, time, step) {
  clearInterval(timer);
  timer = setInterval(function () {
    var main = document.querySelectorAll('.swiper-slide')[elIndex];
    var active = main.querySelector('.timeline-chunk-active').querySelector('.timeline-chunk-inner');
    var allStories = main.querySelectorAll('.player-chunk');

    var activeStoryIndex = _toConsumableArray(allStories).findIndex(function (story) {
      return story.classList.contains('player-chunk-active');
    });

    var width = parseFloat(active.style.width) || 0;

    if (width === 100) {
      if (activeStoryIndex !== allStories.length - 1) {
        next({
          target: active
        });
      } else {
        swiper.slideNext();
      }

      return;
    }

    active.style.width = String(width + step) + '%';
  }, time * 1000 * step / 100);
}