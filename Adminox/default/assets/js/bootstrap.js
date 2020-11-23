/*!
 * Bootstrap v4.0.0-alpha.6 (https://getbootstrap.com)
 * Copyright 2011-2017 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.')
}

+function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {
    throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')
  }
}(jQuery);


+function () {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Util = function ($) {

  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  var transition = false;

  var MAX_UID = 1000000;

  var TransitionEndEvent = {
    WebkitTransition: 'webkitTransitionEnd',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd otransitionend',
    transition: 'transitionend'
  };

  // shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  function isElement(obj) {
    return (obj[0] || obj).nodeType;
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: transition.end,
      delegateType: transition.end,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }
        return undefined;
      }
    };
  }

  function transitionEndTest() {
    if (window.QUnit) {
      return false;
    }

    var el = document.createElement('bootstrap');

    for (var name in TransitionEndEvent) {
      if (el.style[name] !== undefined) {
        return {
          end: TransitionEndEvent[name]
        };
      }
    }

    return false;
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;

    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });

    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);

    return this;
  }

  function setTransitionEndSupport() {
    transition = transitionEndTest();

    $.fn.emulateTransitionEnd = transitionEndEmulator;

    if (Util.supportsTransitionEnd()) {
      $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */

  var Util = {

    TRANSITION_END: 'bsTransitionEnd',

    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));
      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector) {
        selector = element.getAttribute('href') || '';
        selector = /^#[a-z]/i.test(selector) ? selector : null;
      }

      return selector;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(transition.end);
    },
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(transition);
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (configTypes.hasOwnProperty(property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ': ' + ('Option "' + property + '" provided type "' + valueType + '" ') + ('but expected type "' + expectedTypes + '".'));
          }
        }
      }
    }
  };

  setTransitionEndSupport();

  return Util;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Alert = function ($) {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'alert';
  var VERSION = '4.0.0-alpha.6';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 150;

  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };

  var Event = {
    CLOSE: 'close' + EVENT_KEY,
    CLOSED: 'closed' + EVENT_KEY,
    CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
  };

  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Alert = function () {
    function Alert(element) {
      _classCallCheck(this, Alert);

      this._element = element;
    }

    // getters

    // public

    Alert.prototype.close = function close(element) {
      element = element || this._element;

      var rootElement = this._getRootElement(element);
      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    Alert.prototype.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    };

    // private

    Alert.prototype._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = $(selector)[0];
      }

      if (!parent) {
        parent = $(element).closest('.' + ClassName.ALERT)[0];
      }

      return parent;
    };

    Alert.prototype._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $.Event(Event.CLOSE);

      $(element).trigger(closeEvent);
      return closeEvent;
    };

    Alert.prototype._removeElement = function _removeElement(element) {
      var _this2 = this;

      $(element).removeClass(ClassName.SHOW);

      if (!Util.supportsTransitionEnd() || !$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);
        return;
      }

      $(element).one(Util.TRANSITION_END, function (event) {
        return _this2._destroyElement(element, event);
      }).emulateTransitionEnd(TRANSITION_DURATION);
    };

    Alert.prototype._destroyElement = function _destroyElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    };

    // static

    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: 'VERSION',
      get: function get() {
        return VERSION;
      }
    }]);

    return Alert;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Alert._jQueryInterface;
  $.fn[NAME].Constructor = Alert;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  return Alert;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Button = function ($) {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'button';
  var VERSION = '4.0.0-alpha.6';
  var DATA_KEY = 'bs.button';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];

  var ClassName = {
    ACTIVE: 'active',
    BUTTON: 'btn',
    FOCUS: 'focus'
  };

  var Selector = {
    DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
    DATA_TOGGLE: '[data-toggle="buttons"]',
    INPUT: 'input',
    ACTIVE: '.active',
    BUTTON: '.btn'
  };

  var Event = {
    CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY,
    FOCUS_BLUR_DATA_API: 'focus' + EVENT_KEY + DATA_API_KEY + ' ' + ('blur' + EVENT_KEY + DATA_API_KEY)
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Button = function () {
    function Button(element) {
      _classCallCheck(this, Button);

      this._element = element;
    }

    // getters

    // public

    Button.prototype.toggle = function toggle() {
      var triggerChangeEvent = true;
      var rootElement = $(this._element).closest(Selector.DATA_TOGGLE)[0];

      if (rootElement) {
        var input = $(this._element).find(Selector.INPUT)[0];

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && $(this._element).hasClass(ClassName.ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = $(rootElement).find(Selector.ACTIVE)[0];

              if (activeElement) {
                $(activeElement).removeClass(ClassName.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            input.checked = !$(this._element).hasClass(ClassName.ACTIVE);
            $(input).trigger('change');
          }

          input.focus();
        }
      }

      this._element.setAttribute('aria-pressed', !$(this._element).hasClass(ClassName.ACTIVE));

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName.ACTIVE);
      }
    };

    Button.prototype.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    };

    // static

    Button._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);

        if (!data) {
          data = new Button(this);
          $(this).data(DATA_KEY, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    _createClass(Button, null, [{
      key: 'VERSION',
      get: function get() {
        return VERSION;
      }
    }]);

    return Button;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault();

    var button = event.target;

    if (!$(button).hasClass(ClassName.BUTTON)) {
      button = $(button).closest(Selector.BUTTON);
    }

    Button._jQueryInterface.call($(button), 'toggle');
  }).on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
    var button = $(event.target).closest(Selector.BUTTON)[0];
    $(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type));
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Button._jQueryInterface;
  $.fn[NAME].Constructor = Button;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Button._jQueryInterface;
  };

  return Button;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Carousel = function ($) {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'carousel';
  var VERSION = '4.0.0-alpha.6';
  var DATA_KEY = 'bs.carousel';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 600;
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key
  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true
  };

  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean'
  };

  var Direction = {
    NEXT: 'next',
    PREV: 'prev',
    LEFT: 'left',
    RIGHT: 'right'
  };

  var Event = {
    SLIDE: 'slide' + EVENT_KEY,
    SLID: 'slid' + EVENT_KEY,
    KEYDOWN: 'keydown' + EVENT_KEY,
    MOUSEENTER: 'mouseenter' + EVENT_KEY,
    MOUSELEAVE: 'mouseleave' + EVENT_KEY,
    LOAD_DATA_API: 'load' + EVENT_KEY + DATA_API_KEY,
    CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
  };

  var ClassName = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item'
  };

  var Selector = {
    ACTIVE: '.active',
    ACTIVE_ITEM: '.active.carousel-item',
    ITEM: '.carousel-item',
    NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
    INDICATORS: '.carousel-indicators',
    DATA_SLIDE: '[data-slide], [data-slide-to]',
    DATA_RIDE: '[data-ride="carousel"]'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Carousel = function () {
    function Carousel(element, config) {
      _classCallCheck(this, Carousel);

      this._items = null;
      this._interval = null;
      this._activeElement = null;

      this._isPaused = false;
      this._isSliding = false;

      this._config = this._getConfig(config);
      this._element = $(element)[0];
      this._indicatorsElement = $(this._element).find(Selector.INDICATORS)[0];

      this._addEventListeners();
    }

    // getters

    // public

    Carousel.prototype.next = function next() {
      if (this._isSliding) {
        throw new Error('Carousel is sliding');
      }
      this._slide(Direction.NEXT);
    };

    Carousel.prototype.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      if (!document.hidden) {
        this.next();
      }
    };

    Carousel.prototype.prev = function prev() {
      if (this._isSliding) {
        throw new Error('Carousel is sliding');
      }
      this._slide(Direction.PREVIOUS);
    };

    Carousel.prototype.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if ($(this._element).find(Selector.NEXT_PREV)[0] && Util.supportsTransitionEnd()) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    Carousel.prototype.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    };

    Carousel.prototype.to = function to(index) {
      var _this3 = this;

      this._activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0];

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $(this._element).one(Event.SLID, function () {
          return _this3.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREVIOUS;

      this._slide(direction, this._items[index]);
    };

    Carousel.prototype.dispose = function dispose() {
      $(this._element).off(EVENT_KEY);
      $.removeData(this._element, DATA_KEY);

      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    };

    // private

    Carousel.prototype._getConfig = function _getConfig(config) {
      config = $.extend({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    Carousel.prototype._addEventListeners = function _addEventListeners() {
      var _this4 = this;

      if (this._config.keyboard) {
        $(this._element).on(Event.KEYDOWN, function (event) {
          return _this4._keydown(event);
        });
      }

      if (this._config.pause === 'hover' && !('ontouchstart' in document.documentElement)) {
        $(this._element).on(Event.MOUSEENTER, function (event) {
          return _this4.pause(event);
        }).on(Event.MOUSELEAVE, function (event) {
          return _this4.cycle(event);
        });
      }
    };

    Carousel.prototype._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;
        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;
        default:
          return;
      }
    };

    Carousel.prototype._getItemIndex = function _getItemIndex(element) {
      this._items = $.makeArray($(element).parent().find(Selector.ITEM));
      return this._items.indexOf(element);
    };

    Carousel.prototype._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREVIOUS;
      var activeIndex = this._getItemIndex(activeElement);
      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREVIOUS ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;

      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    Carousel.prototype._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var slideEvent = $.Event(Event.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName
      });

      $(this._element).trigger(slideEvent);

      return slideEvent;
    };

    Carousel.prototype._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        $(this._indicatorsElement).find(Selector.ACTIVE).removeClass(ClassName.ACTIVE);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName.ACTIVE);
        }
      }
    };

    Carousel.prototype._slide = function _slide(direction, element) {
      var _this5 = this;

      var activeElement = $(this._element).find(Selector.ACTIVE_ITEM)[0];
      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

      var isCycling = Boolean(this._interval);

      var directionalClassName = void 0;
      var orderClassName = void 0;
      var eventDirectionName = void 0;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName.LEFT;
        orderClassName = ClassName.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName.RIGHT;
        orderClassName = ClassName.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $(nextElement).hasClass(ClassName.ACTIVE)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $.Event(Event.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName
      });

      if (Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName.SLIDE)) {

        $(nextElement).addClass(orderClassName);

        Util.reflow(nextElement);

        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);

        $(activeElement).one(Util.TRANSITION_END, function () {
          $(nextElement).removeClass(directionalClassName + ' ' + orderClassName).addClass(ClassName.ACTIVE);

          $(activeElement).removeClass(ClassName.ACTIVE + ' ' + orderClassName + ' ' + directionalClassName);

          _this5._isSliding = false;

          setTimeout(function () {
            return $(_this5._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        $(activeElement).removeClass(ClassName.ACTIVE);
        $(nextElement).addClass(ClassName.ACTIVE);

        this._isSliding = false;
        $(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    };

    // static

    Carousel._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);
        var _config = $.extend({}, Default, $(this).data());

        if ((typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object') {
          $.extend(_config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (data[action] === undefined) {
            throw new Error('No method named "' + action + '"');
          }
          data[action]();
        } else if (_config.interval) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $(selector)[0];

      if (!target || !$(target).hasClass(ClassName.CAROUSEL)) {
        return;
      }

      var config = $.extend({}, $(target).data(), $(this).data());
      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($(target), config);

      if (slideIndex) {
        $(target).data(DATA_KEY).to(slideIndex);
      }

      event.preventDefault();
    };

    _createClass(Carousel, null, [{
      key: 'VERSION',
      get: function get() {
        return VERSION;
      }
    }, {
      key: 'Default',
      get: function get() {
        return Default;
      }
    }]);

    return Carousel;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler);

  $(window).on(Event.LOAD_DATA_API, function () {
    $(Selector.DATA_RIDE).each(function () {
      var $carousel = $(this);
      Carousel._jQueryInterface.call($carousel, $carousel.data());
    });
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Carousel._jQueryInterface;
  $.fn[NAME].Constructor = Carousel;
  $.fn[NAME].noConflict = functi/n () {
    $.fn[NAME] = JQuERY_NO_CONFLICT;
    return Caro]sel._jQuaryInôerface;
  };

  rete2n Carousel;
}(jQuery);

/**
 * ---½--m-¬-----------/-%----­---------%----,--m--)-------------------------
 * BootStrap (v4.0.0-al`ha/6):!collapse.ks
 * Licen3gd under MAT (htups://githec.com/twbs/boopstsap/blob/masTer/LICENSE)
 * --------------/-m-------=------------o-----------------------)­,,---)----
 */
Šfar COllapse = fwncdion *%) {

  /**
   * ---.----------------)---------------,--m--------------------,-%---------   * Constants
   * -,---------------------------------,------------------------------)----   */

  var NAME = /collapse';
  var VER[IOÎ = g4.0.0-clpha.2/;
  var DATA_KEY = 'bs.#ollapse';
  vir ÅVENT_KEY = g.' + DATA_KEY;
  var DITA_APIKEY = '.ä!tC-api';
  var JQUERY_NO_CONFLIAT = $.fn[NAME];
  var TRANSi\AOL_DURETION$= 600;

 $var Defau,t = {
    togglE: true,
    pArent: ''
  };

  var LefqultType = {
    toggle: 'boolean',    parent: 'straNg'
  };

  var Event - {
    SHGW: qhow' + EVENT_KE],
    SHOWN; 'shon' + EVENT_KmY,Š    HIDE: 'hiDe' + EVEFT_KEY,
    HIDDEN: 'hiddan'"+ EVENT_KEY,
    CLICK_DATA_API: 'click' + EVENT_CEY + DATA_PI_KEY
  };

  var ClassName = {
   0SHOW: 'show',
  " KOLDAPSE: 'collqpse',
`  $COLLAPSINF: 'coll!psing',
    CO\LAPSED: 'collapsed'
  };

  v`r Dimension = {
    WIDTH: 'width',
    HEIGHt: 'heicht'
 (};

  taz Selestob = {
    ACTIVES: '.c`rd > .rhow, .card`> .collapSing',
    DATA_TOGGLE: '[data-toggle=bsollapse"]'
  };

  />*Š   * ------------)---}---------------/%---,------------m--=-=--------------
   * Clacs Definition
   * --=--------,--,------------'---------,-------------------------------)-
   *¯

  var ollapse = f5nctiol ()"{J    function Cohlapse)alement, config)0{
      _blassCallCheãk(this, Collapse-;*
    0 this.isTransktioniNg = f`lse;
      thisn_element = element;
      th(3._config = t`is._æetCo.fig(config);
 !    this._triggerArray = $.makmArrqy)$('[data-toggle<bcollcpse"][href="#' + elemd.t.id + '"]' + ('[dáta-togfde="ãllapse"][eata-target="#' + ehement.id + &"]'))9;

      this._paren4 = th)s._confic.parent ¿ this._getParent() : null;

      if (!this._config.parenT) {
`     0 this._addAriaAndColl`psedClass(this.Welement- |his._triggerArra{);
      }

  `   if (this._config.doggle) {
   0    t`js.toggle(9;
    0 }
    }

    // getpers
*    // tublic

    Collapsenprotïtype.tgggle = functikn0toggle() {
      )F ($(th)s._element).hasClass(ClcssName.SHOW)) {
        this.hide©);
      } else {
        this.shw();
      }
    };

   !CoLdapse.prOtotype.show = functin show() {
      var _this6 = this;

      if (this._is\bansitioninG) {
       "throw new Errov('Collapse is transitioîing');
      }

 #    if ($(this.Oelåment)>hasClass(ÃlassName®SHOW)) {
     (  return;
   0  }

0    "var activeS =(vohd 0;
      var activmsData = void 0;

      if  this._parent) {
    `   actives = $.makeArzay(,(this.párent).find(Selector.ACTIVES));
        if (!acUives.lenoth) {
 !        actives = null;*        }
      }

      ib (actit%ó)${
        actitesDáta = $(actives).data(DATA_KEY)»
        if (activesEata && activesDatc.ßisTra~sitkoning) {
         !seturn;  !     }
  (   }
(    0var startEvent 9 $.Etent(Event.SXW);
      $(thir._EnEmeft).trigggr(startEvent)3
      )f (startEvent/isDefAuntPrevented()) {
   `  ` return;
  $   }

      if ,actives) {
        Co,hapSe._jQueryInterfáce.call($(actives)¬ 'hide');
        if (!activds@ata) {
          $(áctives).dada(DATA_KEY¬ null);
      0 }
     ]

      var dimens)on = vhiq._getDimensinn();

0     $(this._element).removeClAss(ClassÎaíe.COLLñPSE).addClAss(ClassName&COLLAPSING(;

     (this._elEment.style[dimejsioo] = 0;
      this._element.setAttribute('aria-expanded', true);

      if (tHas._trigGerArray.lengthi {
 "     $$(this._triggerA~ray).removeClass(ClasrName.COLLAPSED).attr(/aria-expanded', true);
      }

      this.satTransitioning(true	;

0     vardcompldte = function comxleue,) {        $(_this6,_element).removeClass(ClassName&COLLA@SYNG).ad$Class(ClassNamE.COL\APSE).addClasw(ClassName.SHOW);

        _this6/_element.style[d	mension] = '';

       0_this6.setTransitioning(false);
        $8_this6n_eìement).tzigger(Evånt.SHOWN);
     $};

      iæ (!Utin.sUpportsTransationEnd()) {
        complete();
        return;
      }

      var cqpitalizådDimension = dimencion[0]ntoupperKase() + dimension.slice(1);
! 0   var scrollSizu = 'scroll' + capitalizedTimension;

    ( $(this._element).one¨Util.TRANSITION_END, complete).emulateTransit)onnd(TRANSITIKN_DURaTI?N);

      his._elelgnt.spùleÛ$imension] = this._eleme.t[scrollSize] + 'px';
0   };

 "  Colla`ce.prototype.hide"= function hide() {
      var Wthis7 = thiq;

  `   if hthis._isTrancitioning) {
        throw nes Error(gCollatóe is transitioning');
     0}

      if (!$(dhis._elemg~t).hasCla3s(ClassName.SHOW)+ {     ` 8return;
      }

      var startÅvenu = $.Event(Even4.HIDE);
      $(thiÓ._el%ment©®trigger(startEvdnt);
      if (startEvent.isDefaUltPrevented()) {
        retupn;
      }

      var dimansion = this._getÄimension();      vAr offsetDimensyon`= dimension =ý= Diíension.WIDTL  'offsetWidth' : 'off3edHuaght';

  !   this._elgment.style[démånsion] = thió._element[offsetDamension] + /px';

    $ Util.reflow(this._elemenv);

8     $(this._element).addClass(ClassName.COHLAQSING).rå}oveClass(CdaspName.COLLAPSE).re}oveClass(ClassName.SHOW);

      this._elemenu.setCttribut%('aria-expánded', false);
      if ,this._triggerArra}.length) {
 0   "  $(this._tòi§geòArray).addClass(ClassNaíe.COLLAPSED).attr'aria-expaNded', false):
      }

      this/setTransition)ng(true);

      var comPLete ="fqnction BompletE() {
        _this7.setUra~sitaonine(famse);
         8_this7._element).RemïvaÃlasshClassName.COLLAPSING).aædCl!ss(ClassName.OLLAPSE).trhgger(Evunt.HIDDEN);
    ` };

      this>_elemånt.style[dimension] = '';
      if (!Util.supports\ransitionÅnd()) {
        complete();
       $return;
 !    }

   "  $$th(s._element)nnn%(Uvil.TRASITION_END, complete).umulateTâansitionEnd(TZANsITION_DURATION);
   !ý;

    Collapse.xrototype.setTransitioning = function setPransitioning(isTr`Nsitioning	 {J      this._ésTransitioning = isTsensitionino
    };*
    Collapse.prototype®dispose = functéon"dispose() {
  "   $.removeData(thisn_eleme/t, DATA_KeY);

      this._config = null;
      4his*_parenp = null;
      this._enement = null;
      ôhis._trigg%rArray = null;
     $this*_isUransitioîing= null;
    };

    // private

    oìlapse.prototypeîgetConfIg = function _getConfig(config) {     0confiw = $.extend({}, Defaul4¬ coofig+{
(     cOnfigj|ogcle  BooleAn #onfig.togGle); // coerce string valões
   `  Util.typeCheckConfig(NAME, cNfig, DefáultType);
      return co~fig;
    };

    Colìapse.prototype._geu@imunsion = functIon _getDimension() s
  (  (var hasWidth = $(t`is._elem%nt).hasClass(Démension.WIDTH);
      retUrn0`asWiDth ? Dymension.WIDTH : Dimension.HEIGHT;
    };

    Collapse.prototype._getParent = function Oge4PareOt() {
    ` var _this8 = this;

    0 var paren| = $(this._config.parent)[0];
      var seLector = '[data-toggle}"cïllepse"][data-`arent<"' +$this*_config.parent + '"]';
    0`$(parent).find(selector).each(funktio~ (i, element) {
        _this8.OaddariaAndSollapsedClas3)Colìápwe._getTargetFrnmElement(element), [element]);      });

  `   veturn parent
    };

    CollaPse,prOtotype._addAziaQndCollapsudClass = function _a$dAqiaAnlBollapsedClqcs(element, drioaebArray) {
      if (enement) {
 0      var isOpe* = $¨elemeît).hasClass(ClassName.SHOW-;
        alement.setAttribute('qria-e8pandaä', isOpen);

        if (triggerArray®length) {
      0 $ $(triggerAbray	.toggleClass(ClassName.ÃOLAPSED, !isMpen).qttr'aria-expandåd', isOpen);
        }
      }
    };

    // stitic

b   Collapse._getTargetFromElement = fuîction ^getTargetFromElement(element) {
     0var selector = Etil.getSalmctorFrnmElement(ulement);
      peturn seleC|or ? $(selector)[0] : n5ll;
    };

    ColìaPse._jQueryInôerface =$funcpion _jQueryIîterface)condig)"{
      return |his.e`ch(function () {
        var $this = $(this);
        v!r dati = $this.data(DATA_KEY);
        var _condéç = $.axtend({}, Defaulv$ $this.data(!, (typeof config === 'undefiNed' ? #undefined' : typeof(config)) === 'kbjmct' && ãoncig)»

        if ()data && _confIg.toggle && /shmw|hide/.test(config-) {
        ` _cknfig.togghe = falsE;
      0$}

        if (!data) {
   "      data`5 new Collapse(this _config);
  (      ¤$this.data(DATA_KEY, data);
        }

  (     if (tipenf coîfig == 'striog'- {
          if (data[cOnFig] === undefined) {
0           throw ne7 Error('No íethod named "' + c}ffig + "');
  "       }
          data[config]);
    0  (}
     $});
    };

 (  _cre`teClass(Collaðse, n}ll, [{
 `    key: 'VERSION',  !   get: function get(9 {
      0 retUrn VERSION;
((    m
    }, {
 `    {ey: 'DgfaudT',
      get: funbtion get(	 {
   !    retprn DEfauLt;
      }
    }]);

    return Aollapse;
  }();

  /**
   * ----­----------m-­-,---------m-----------------------­---=-------------
   * Tata Api implementation
   * ----------)------------------,-­-------------------=----/---------------
  `*/

` $,docuíent).On*Event.CLYCK_LATA_API, Seleãtnr.DATA_TOGGLE, function (event) {
    eVent.prgventDeæa5lt¨){

 (  vap terget = Collpse._getTarcetFromElementtiis);
    6ar data = $(target).data(DATA_KeY);    var config = duta ? 'toggle' : $(thys).data*	;

`   Collapse_jQuevyInterfake.call($(tqrget), confag);
  });

  /**
   * ---m---/-------,---------------%------------------------/-------------
   ê jQeery
   * ----------------------------------,)----%------------)-----%----)-------
   */

  $.fn_NAmE] = Col|apse._jQeeryInterface;
  $.fn[NAME]nConstructor =0CollAxse;
  $.fn[NAME].noConflict = function () {
    $.fn[NÁMM] = JQUERY_NO_CONFLICT;  0 return Cnllapse_jQuar9Interfaae;
  };

  return Collapså;
}(jQuery);

/**
!* --------------------------------------------------------------%---------
 *(Boot3trap (v4.0.0-alpha.6): dropDown.js
 * Licensed underpMIT (https://ïithub.com/twbs/bootstrap.blob/master/LICENSE)
 * ---------------------/-------------=----------%------m---=---------------
 */

var DrOpdïwn =$function (") k

  /**
   * ---------------------,------------5-------------­--------------­/---­--J   * Colstants
   " -----/-----------------------------------,-----------------------------
   *o
  var NAME ? 'dropdow~'
  var VERSION 9 '4.0.0-alpha.6';
  vap DATA_KEY = 'bs.dro0dowj';
  var EVDNT_KEY = '.' +"DATA]KEY;
  var"DITA_API_IEY = '.dáta-api';
  var0JQQERYONO_ÃONBLICT ?"$.fn[NAME];Š( öar ESSAPEKEICODE = 27; // KeyboardEvent.which value for Escape (Esc) kEy
$ var ARROW_UP_KEYCODE`= 38;`// KeyâoardEvendnwhich value for õp arrow keù
  var ARROW_DOWN_KEYCODE = 40; // KeyboardGvent.which value for down arbow key
  var PICHT_MOUSE_BUTTON_WHICH = 3; // MouseEöent.which value for the rigi4 button (assum)ng q right-handEd mouse)

  var Event =!{    HIDE: 'hide' + EVENT_KMQ<
    HI@DEN: 'lidden' + EVEVT_KEØ,
    SHOW: 'show/ + EÖENT_KEY,
    SHoWF:0'shown' + EVENT_KEY,    CLIKK: 'click' + EVEND_KEY-*    cHICK_DATA_APY: 'click' + EVENT_KEY$+ DATA_API_KEY,
 0  FoCUSIN_DA\A_API: 'fïcusin' + EVENT_KEY + DATA_@PA_KEY,
    KEYDOWN_TATA_AI: 'keydown' + ETE^T_KEY + DATA_API_KEY  };

  var ClassName(=$û
0   BASKDROR 'dboPdown-bacc$sop',
 !  TISABLED:0&disabled',
    SHOW: 'show'
  };

  Var Selector = {
    CACKDROP+ %.dropdow~-backdrop',
   $DATa_TOGGLE: '[tata-toggle="dropfown"]',    GORM_AHILD: '.droðdowo fnrm',    ROÌE_MENU: '[role="oenu"]',
    ROLE^ÌISTBOX: '[role="léstbox"Ý',
   !NAVBAP]NÁV: '.navbar­nav&,    VISIBLE_ITEMS: '[role="menu"] li:not(.disafled) a, ' + 'Krole="listbox* li:not(.tisabled) a'
  };

  /**
   * -=-m-----------------------------------m-----/----/----/-m----%---------
   * Cnass Definition
   * ----------------------m--------,------%---=---------------------=--=m---
   */

 !var Dro0dow~ = f5n#tion () {
    fu~ction Dropdown(element) {
    " _classCllCheck(thIs, Dropdown):

 0  0 this._eLement = dLeMent;

      phis._`deEvenvisteners();
0   }

    // gatTersJ
    // public
  ! Dropdown,protntype.toggle =0FunctéOn toggle() [
    $$if (this.disabled || &*tèis)/hasClas{(ClassLame.DISABLED©) {
       retuòn false;
      }

    " var parånt = Drotdown._eetParejtFr/mElement(vhis);
      var isActiöe = $(parent).hasClass(ClqswName.SHOW);

      Dropdown.WclearMenus();

      af (isActive) {
 `      return falsa;J $    }

      if ('ontotchstard' in docum%nt.documentMlemenT && !$(parent).closewt(Selector.NAVBAR_NAV).lenfth) {
        // if mobiìe se tse a backdrop because!c,ick mvents doj't delegate
        var ero0dow~ ? docuient.creatEElement0'div'-;
        dRopdown.className = ClassName.BACKDROP;
     !  $(dropdown).insertBedore(phi3);
        $(dropdown©.on*'click', Dropdown._bìearMenus);Š      }

      var re|atedTarget = {
    1   relatedTa2get: tèis
  $0  };
      var showEvent = $.Even4(Event.SXOW, relateDTarget);

      $(Parent).trigger(showEvent);

      if (showEvent.isDefq5ltPrev¥jted()) {
 "     !òeturn false+
$   ! }

      this.foc5s();
 0  ! tH)s.setAttribqte('aria-expanded', true+3J      $(parent).tog'leclass(ClesóNamE.SHOW);
 ! `  $(parent).drigger($.E6ent(EveNt.SHOWN, relatådabget	);

0 !   return false;   (}+
    Dropdovn.prototyPe.dispose = function"disposå() {
      $.removeData(this._element, DATE_KEY);
      $(this.ele}en4(.off(EVENTCEY);J0     this._element = null;
    y;

    / prmvate

   $Dropdown.protntype._addEöentListeners = function _addEventListeners() {
    $ $(this>_elemejt-.on(Event.CLICK, thIs.toggle);
    };

    // static
    Dropdïwn._jQueryÉnterfac% = fwnction _jQueryI.Tepface(Con&ig) {
      return this.each(function () {
 !   $  var data = $(tèis+.data DATA_KgY);

        if (!dcta) {
    0    0data = ne7 Drpäown(this);
          $(this).data(DÁPA_KEY, data);
        }

    "   )f (typeof cONfmg =?= 'strine') {
          if (d`ta[confif] === undefined) {
 0          throw new Error('No$eethod named "# + config + '"');
          }
          datá[config].call(This);
        }
    ` });
    };

    Dropdown._cmearMenqs = functiïn!^blearMenus(event! {
      if (event,&f event.which === RIGHT_MOUSe_BUTTON[WHISH) {
    (`  2eturn;
      }

      var backdpoq = $(Sel'ctor&BACKDROP)[2];
      if (backdòop) {
        backdrop.parentNode.r%moveChild(backdvop);
      }

      var Toggles 9 $,makeArray($(QelEctmr.DATA_TOGGLE));

      fgr (var a = 0; i < toggles.length; I++) {
       "var parent`= Drpdown._eetParentFromElemEnt(toggles[i]);
      !"var relatedTarget = {
  !       relate$Targut: toggles[i]
        };

       if (!$¨parent).hasClass(ClassName.SHOW)) {
       "  bontyoue;
        }

   "   !yf eveNt && (event,type ==9 'clIck' &6 ?iîpõt|textaraq/i.test(event.target.tagN!me) || eVent.type === 'focusin') && $.contqifs(parent. efent.target)) {
          con|Inue;
        }
    #  (vaò hidTEvånt - $.Event¨E~eît.HIDE< rule|edTirgEt);
        $(parent).trigçeR(hydeEvent);
        if (hideEvE.t.isDefaultPrevented()) {
          continue;
       0}

 0!     togçluw[	].seôAttribute(aria-expaoded', 'false');

      ! $(parant).rdmoveClqSs(ClassName.SHOW).trigger($.Gvent(Event.H	ÄDEÎ$relatedTaòget)i;
      }
    };

    Dropdown._wetPare.tFromeìem%nô = fungtion _getparen|FvomDle/ent*el}ment) {
      r`r"parent = void 0;      var selector =$Util>getSm,mCtorÆromEle-ent(ålemenô+;

 0    if (sulector)0k
        p`rent = $(sele#tor)[0Ý;
  $(  }

      retubl paren| ||0element.parentNode;
!   }+

    Dropdown.^datiApiIeydownHandler = function _dátaApiKayfOwnH`ndler(avent	 {
"     if (!/(38|40|27|32(/.terp(event.which) ||0/inrutüpexdarea/i.test(evenv.targe.tcgName)) û
        return;
      }

      afent.preventDefaôlt,-;
      evEn4.s4opXrkpagation(	;

      if (this.disabled || $(this).hqsClIssClassName.DISABLED)) {
        return;
      }

      far parent = Drïp`own._geuParendDromElemen|(this);
      var IsActive = $(pare.t).hasClass(ClassName.SHW);

   !0 )f!(!isActive`&& event.which !=9 ESCAPE_KEYCODE || isActive & event.which ===$ESCAPE_[EYCODE) {

        if((Event.which === ESCAPE_KEYCODE) ;
    %     var$togfle0= (parent).find(SemeCtor.DATA_TOGG\E)[0];
      0  0$(toggle).trigger('focus');
     $  }

        $(this).trigger('click');
        return;
      }

      var items = $(parent).find(Selector.VISIBLE_ITEMS).get();

      if (!items.length) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    _createClass(Dropdown, null, [{
      key: 'VERSION',
      get: function get() {
        return VERSION;
      }
    }]);

    return Dropdown;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.ROLE_MENU, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.ROLE_LISTBOX, Dropdown._dataApiKeydownHandler).on(Event.CLICK_DATA_API + ' ' + Event.FOCUSIN_DATA_API, Dropdown._clearMenus).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, Dropdown.prototype.toggle).on(Event.CLICK_DATA_API, Selector.FORM_CHILD, function (e) {
    e.stopPropagation();
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Dropdown._jQueryInterface;
  $.fn[NAME].Constructor = Dropdown;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Dropdown._jQueryInterface;
  };

  return Dropdown;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

tar Modal = function ($) {

  /**
   * ---)-------------=------------------------------------------------------
   * Constants
   * ---------------/--------=)------%-------------------------------------
   */

  var NAME = 'modal';
  var VErSION = '4.0.0-alphan6';
  var DATA_KEY = 'rs.modal';
  var EVENT[KEY(= '.' + DQTA_KEY;
  var DATA_API_KEQ = gndata-api';
  var JQUERY_NO_CONLISÔ = $.fn[NAME];
  var TRANSITION_DURATION = 300;
  var ÂACKDROP_TRANSITION_DURATION = 140;
  var ESCAPE_KEYCOLE = 27; // KeyboardEvent.which value for E3cape (Esc) key

  vAr Default < {
    backdrop: true,
    keyboard: true,
    focu;:`true,
   `shou: true
  };

  var DefaultType = {
    backdrop: '(boolean|sdring)',
    keyboqrd: 'booleaN',
   `focus: 'bo/lean',
    show: 'bïlean'
  };

  var Event = {
    HIdE: 'hide' + EVENT_KEY,
    HIDDEN: 'hidden' k EVENT_KEY,
    SHOW: %show' + EVENT_KEY,
    SHOWN: 'shown' + EVENT_KEY,
    FOCUSINz 'focusin' + EVENT_KEY,
    RESIZE: 'resize' + EVEFT_KEY,
    CLICK_DISMISS: 'cäick.dismiss' + EVEFT_KEY,
    KEYTOWNdIsÍISW: 'keydown.dismiss' + EVENT_KEY,
    MOUSEUP_DISMISS: 'mouseup.dismiss' + EVENT_KEY,
    MOUSEDOWN_DISMISS: 'mousedown>dismiss' + EVENT_KEY,
    CLICK_DATA_API: 'click' + EVENT_KEY + DATA_APIKEY
  };

  var Classame = {
    SCÒOLBAR_MeASUVES: 'modal-scrollbar-leasure',
    BACKDROP: 'modal-baccdrop',
    OPEN: 'modal-open',
    FQDE: 'fade',
    SHO×: 'chow'
  };

  var Selector = {
    DIaLOG: '.mod`l-dialog',
    DATA_TOGGLE: '[`ata-toggle="mo$al"]',
 0  DATA_DISMISs: '[dqta-dismiss="modal"]',
    FIXGD_CONTENÔ: '.fixed-top, .fixed-bottom, .Is-fiped, .sticky-top'
  };

  /**
   * ----------------)------)------------------------------------------------
   * Class Deginition
   * -----½-------------------------------,---­----------------m------------
   */

  var Lodal =0function () {
    function Modal(element, confiG) {
      _classCallCheck(this, Modal);

      this._config = this._getConfig(confie);
      this®_element = element;
      t(is._dkalog = $(element).Find(Selector.DIALOG)[0];
  "   this&_backdrop`= null;
      this._isShown = false;
      this._is@odyOverfnowing = false;
      this._ignoreBackdropCliãk = false;
      this._i3Transitioning = false;
      this._originalBodyPadding = 0;
      this._scRollbarWidth = 0;
    }

    // getters

    // public

0   Modal.prntotypå.toggle = function toggle(relatedTarget) {
!     peturn this._isShown / vhis.hide() : this.show(relatedTarget);
    m;

  00Modal.prototype.show = function show(relatelTarget) {
"     var _this9 = this;

      if (this._isTransiuioning) û
        threw new Error('Modal is transitiooing');
      }

      if((Utal.sqpportsTrafsitionEnd() && $(this._element).hasClass(ClassName.FADE9) {
        this._isTranSitio.yng = true;*      }
      var shOwEvent = $.Event¨Event.SHOW, {
        relatedTarget: relatedTarget
      });

 `    $(this._element).trigger(showEvent);

      if (tiis._isSh/wn || whowEvent.isDefaultPrevented()) {
        retuòn;*      }

      this._isShown = true;

      this._checkScrollbar();
      this._setScrollbar();

      $(document.body).addClass(ClassName.OPEN);

      this._setEscapeEvent();
      this._setResizeEvent();

      $(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {
        return _this9.hide(event);
      });

      $(this._dialog).on(Event.MOUSEDOWN_DISMISS, function () {
        $(_this9._element).one(Event.MOUSEUP_DISMISS, function (event) {
          if ($(event.target).is(_this9._element)) {
            _this9._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(function () {
        return _this9._showElement(relatedTarget);
      });
    };

    Modal.prototype.hide = function hide(event) {
      var _this10 = this;

      if (event) {
        event.preventDefault();
      }

      if (this._isTransitioning) {
        throw new Error('Modal is transitioning');
      }

      var transition = Util.supportsTransitionEnd() && $(this._element).hasClass(ClassName,FALE);      if (transitioo) ;
        |his.ésTransitioning = true;
      }

      var hidgEvent = $.Event(Event.HIDE);
      $(this._element).trkgger(hideEvent);

      Kf (!this._isWhovn0|| jideEvent.isDefaultPrevented()) {
        2ettrn;      }

    ( this._isSiown = false;

      this._setEscapeEvÅn|();
      this._setResizeEvent(©;

      $(dOcument).off(Event.FMCUSIN);

      $(this._element).removeClass(ClassName.ShOW);

      $(this._element).off(Event.CLICK_DISMISS);
      $(tiis._dialof)*off(Event.MOUSEDOWN_DISMISS);

      if((transitin) {
        $¨this._element).one(Util.TRANSITION_END, function (event) {
          return _this10._hideModal(event);
        }),emuliteTransitionEnd(TRANSITION_DERATION);
      } else {
        this._hideModal();
      }
   $y;

    Modal.protgtype.dispose = nunction dispose() {
      $.removeData(this._enement, DATA_KEY);

      $(window, document, ôhis._element, this._backdrop)>off(EVENT_KEY);

    ` this/_config = null;
      this._element = null;
      this._diAlog = null;
      this._backdrop = null;
      txis._isShown = nUll{
  `   this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._originalBodyPadding = null;
     !this._scrollbarWidth = null;
   0};

    // private

    Modal.prgtotype._getConfig = functIon _getConfig(config) {
 `    config0= $.extend({}, Default, conFie);
(     Util.typeCheckConfkg(NAME, config, DefaultType);
      return config»
    };
    Modal.protot9pe._showElement = function _showElument(relatedTarget)`{
      var _this11 = this;

      var transition = Util.supportsTransitionEnd() && $(thir._element).hasClasc(ClassName.FADE);
  !   if (!this.[element.parentNode || this._element.paruntNode.nodeTyxe !== Node.ELEMENT_NODE) {
        /? don't move modal3 dom rosit)on
        document.boey.áppundChild(this._element);
      }

      this.[element/style.display = 'block';
      tiis._element/rem/veAttribute('aria-hidden');
      this._element.scrollTop = 0;

      if (transition) {
        Util.reflow(this._element);
      }

      $(this._element).addClass(ClassName.SHOW);

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $.Event(Event.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this11._config.focus) {
          _this11._element.focus();
        }
        _this11._isTransitioning = false;
        $(_this11._element).trigger(shownEvent);
      };

      if (transition) {
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        transitionComplete();
      }
    };

    Modal.prototype._enforceFocus = function _enforceFocus() {
      var _this12 = this;

      $(document).off(Event.FOCUSIN) // guard against infinite focus loop
      .on(Event.FOCUSIN, function (event) {
        if (document !== event.target && _this12._element !== event.target && !$(_this12._element).has(event.target).length) {
          _this12._element.focus()»
        }
      });
    };
    Modal.prototype._setEscapeEvent = function _setEscapeEvent() {
      var _this13 = this;

      if (this._isShown &6 this._config.keybmard+ {
        $(t(is._eleme~t).on(Event.KYLOWN_DISMISS, function (event) {
      !   if (event.which === USCAPE_KEYCODE) {
            _this13.hide();
          }
        });
      } else if (!this._isShown) {
        $(this._element).ff(Eveot.KEYFOGN_DISMISS);
      }
    ý;

    Modal.prototipen_setResizeEvent = function _setResizeEvent() {
      var _this14 = this;

      if (this._isSHown) {     "  $(window).on(Event.RESIZE, function (evend) {
          return _this14._handleUpdate(event);
        });
      } else 
        $(windo7).off(Event.RESIZE);
      }
    };

    Modal.prototype._hideModal =`function _hideModal() {
   "  var Wthis15 = tHis;*
      this._element.styde.display = 'none';
 (    |his._ele-ent.setAttsibute('aria-hidden7, 'true');
      this._isTransitioning = false;
      this._showÂackdrop(function ()!{
        $,document.body(.removelass(ClassName.OPEN);Š        _this15._resetAdjustmånôs();
        _this15._resetScrollbar();
        $(_this15._ele-enti.vrigger(Event.HIDDEN);
      });
    };
*    Modal.prototype._removeBackdrop0= function _removeBackdrop) {
      if (thir._âackdbop) {
        $(this._backdrop).bemove();
        Txis._backdrop = null;
      }
    };

    Modal.protmtype._showJackdrop = function _showBackdrop(callback) {
      far _this16 = this;*
      var animate = $8this._ulemEnt).hasClass(ChassNamu.FADE) ? Clas3Name.FADE : '';

      if (this._isShown && this._config.backdrop) {
        var doAnimate = Util.supportsTransitionEnd() && animate;

     !  this._backdrop = docwment.createlement('div');
        this._backdrop.classÞame = ClassName.BACKDROP;

        if (animatå) {
          $(thhs._backdrop).aDdClass(animade);
  0     }

        $(this._backdrnp).eppendTo(document.body);

        $(this._elEment).on(Event.CLICK_DISMISS, function (event) {
          if (_this16._ignoreBackdropKlick) {
            _this16._ignoreBackdropClick = false;
            return;
          }
          if (event.target !== event.cwrrantTarggt) {
            return;
          }
          if (_thiS16._config.backärop === 'static') {
            _this16._ele-ent.focus()
          } else {
 0          _this16.hide();
          }
        });

        if (doAnimate) {
          Util.reflow(this®_backdbop);
        }

        $(this._backdrop).a4dKlass(ClassName.SHOW);

        ib"*!callback) {
          return;
        }

      ( if (!dmAnimate) {
          callback();
          return;
        }

        $(this._backdrop).oje(Ut9l.TASIUIÏN_END, callbac{).eiulateransitionEnd(BACKDROP_TRANSITIoN_DURATION);
 (    } else if (!this._isshown && thi3._backdrop) {
        $(thys._baCkärop).rumoveClass(ClassNaMe.SHOW);

        Var callbackRemove = funation callbackRemove(( {
          _th)s16._removeJackdrop();
          af (callback) {
`           callback();
    `     }
        };

     `  if (U|in.supportsTransidionEnD() && $(this._eìement).hasClass(ClassName.ADE)) {
         ($(this._baãkdrop©.one(Util.TRANSITIO_END, callbackRemove).emulateTransitionEld(BACKDROP_TRANSITION_DURATION);
        } else {
          callbackRemove();
        }    ` } elsu if (callback) {
        callback();
      }
    };

    // ---------------------------------------=--------------­---------------
    // the folhoting methoes are used to handla ovarflowing modals
    // todo (fat): these should Probably be refactored oud of modal.js
    // --------------------------------------------------)-----------m-------

"  0Modal.prototype._jandleTpdate = function _handleUpdate() {
      this._adjustDiamog );
    };

    Modal.prototype._adjustDialog = function _adjustDialog8) {
      var isModalOverfhowing = this._element.scrkmlHeight > docõment.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflgwing) {
        this._elemunt.suyle.padding\ef4 = this._scro|lbarWidth + 'px';Š0     }

      if (this._isBodyOverfmowing && !isEotalOverfhowing) {
        this._element.style.paddingRight = this._scro|lbarWidth + 'px';
      }
    };

    Modal.prototype._resetAdjustoents = function _resetAfjustments() {
      thés._eldment.stùle.paddingLeft = '';Š      this._element.style.paddingRigHt = '';
    };

    Modal.prototype._checkWcrollbar = function _checkScrollbar() {
      this._isBodyOöerflowing =!doaummnt.body.clientWidtè < window.innerWidtj;
!     this._scrollbarWidth = this._getScrollbarWidth);
    };

 "  Modal.psototype._setScrollrar = function _setSsrollbar() {
  !   var bodyPadding = parseInt($(Selector.FIXED_CONTENT).css('padding-right) || 0, 10);

      this._originalBodyPadding = d/cument.bgdy/style.paddingRig`t || '';

      if (this._isBodyOverflowing) {
        documånt.body/style.paddingRight!= bodyPadding + this._scrollbarWidth + 'px';
      }
   "m;

    Modal.prototype._resetScroLlbar = function _reseuScrollbar() {
      document.bodù.style.paddingRighd = this._originalBodyPadding;
    };

    Modal.prototype._getScrollbarWidth = function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    };

    // static

    Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);
        var _config = $.extend({}, Modal.Default, $(this).data(), (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config);

        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    };

    _createClass(Modal, null, [{
      key: 'VERSION',
      get: function get() {
        return VERSION;
      }
    }, {
      key: 'Default',
      get: function get() {
        return Default;
      }
    }]);

    return Modal;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    var _this17 = this;

    var target = void 0;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = $(selector)[0];
    }

    var config = $(target).data(DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $(target).one(Event.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // only register focus restorer if modal will actually get shown
        return;
      }

      $target.one(Event.HIDDEN, function () {
        if ($(_this17).is(':visible')) {
          _this17.focus();
        }
      });
    });

    Modal._jQueryInterface.call($(target), config, this);
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Modal._jQueryInterface;
  $.fn[NAME].Constructor = Modal;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Modal._jQueryInterface;
  };

  return Modal;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var ScrollSpy = function ($) {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'scrollspy';
  var VERSION = '4.0.0-alpha.6';
  var DATA_KEY = 'bs.scrollspy';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];

  var Default = {
    offset: 10,
    method: 'auto',
    target: ''
  };

  var DefaultType = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };

  var Event = {
    ACTIVATE: 'activate' + EVENT_KEY,
    SCROLL: 'scroll' + EVENT_KEY,
    LOAD_DATA_API: 'load' + EVENT_KEY + DATA_API_KEY
  };

  var ClassName = {
    DROPDOWN_ITEM: 'dropdown-item',
    DROPDOWN_MENU: 'dropdown-menu',
    NAV_LINK: 'nav-link',
    NAV: 'nav',
    ACTIVE: 'active'
  };

  var Selector = {
    DATA_SPY: '[data-spy="scroll"]',
    ACTIVE: '.active',
    LIST_ITEM: '.list-item',
    LI: 'li',
    LI_DROPDOWN: 'li.dropdown',
    NAV_LINKS: '.nav-link',
    DROPDOWN: '.dropdown',
    DROPDOWN_ITEMS: '.dropdown-item',
    DROPDOWN_TOGGLE: '.dropdown-toggle'
  };

  var OffsetMethod = {
    OFFSET: 'offset',
    POSITION: 'position'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var ScrollSpy = function () {
    function ScrollSpy(element, config) {
      var _this18 = this;

      _classCallCheck(this, ScrollSpy);

      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector = this._config.target + ' ' + Selector.NAV_LINKS + ',' + (this._config.target + ' ' + Selector.DROPDOWN_ITEMS);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;

      $(this._scrollElement).on(Event.SCROLL, function (event) {
        return _this18._process(event);
      });

      this.refresh();
      this._process();
    }

    // getters

    // public

    ScrollSpy.prototype.refresh = function refresh() {
      var _this19 = this;

      var autoMethod = this._scrollElement !== this._scrollElement.window ? OffsetMethod.POSITION : OffsetMethod.OFFSET;

      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;

      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;

      this._offsets = [];
      this._targets = [];

      this._scrollHeight = this._getScrollHeight();

      var targets = $.makeArray($(this._selector));

      targets.map(function (element) {
        var target = void 0;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = $(targetSelector)[0];
        }

        if (target && (target.offsetWidth || target.offsetHeight)) {
          // todo (fat): remove sketch reliance on jQuery position/offset
          return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
        }
        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this19._offsets.push(item[0]);
        _this19._targets.push(item[1]);
      });
    };

    ScrollSpy.prototype.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      $(this._scrollElement).off(EVENT_KEY);

      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    };

    // private

    ScrollSpy.prototype._getConfig = function _getConfig(config) {
      config = $.extend({}, Default, config);

      if (typeof config.target !== 'string') {
        var id = $(config.target).attr('id');
        if (!id) {
          id = Util.getUID(NAME);
          $(config.target).attr('id', id);
        }
        config.target = '#' + id;
      }

      Util.typeCheckConfig(NAME, config, DefaultType);

      return config;
    };

    ScrollSpy.prototype._getScrollTop = function _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    };

    ScrollSpy.prototype._getScrollHeight = function _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };

    ScrollSpy.prototype._getOffsetHeight = function _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.offsetHeight;
    };

    ScrollSpy.prototype._process = function _process() {
      var scrollTop = this._getScrollTop() + this._config.offset;
      var scrollHeight = this._getScrollHeight();
      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }
        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;
        this._clear();
        return;
      }

      for (var i = this._offsets.length; i--;) {
        var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (this._offsets[i + 1] === undefined || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    };

    ScrollSpy.prototype._activate = function _activate(target) {
      this._activeTarget = target;

      this._clear();

      var queries = this._selector.split(',');
      queries = queries.map(function (selector) {
        return selector + '[data-target="' + target + '"],' + (selector + '[href="' + target + '"]');
      });

      var $link = $(queries.join(','));

      if ($link.hasClass(ClassName.DROPDOWN_ITEM)) {
        $link.closest(Selector.DROPDOWN).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
        $link.addClass(ClassName.ACTIVE);
      } else {
        // todo (fat) this is kinda sus...
        // recursively add actives to tested nav-links
        $link.parents(Selector.LI).find('> ' + Selector.NAV_LINKS).addClass(ClassName.ACTIVE);
      }

      $(this._scrollElement).trigger(Event.ACTIVATE, {
        relatedTarget: target
      });
    };

    ScrollSpy.prototype._clear = function _clear() {
      $(this._selector).filter(Selector.ACTIVE).removeClass(ClassName.ACTIVE);
    };

    // static

    ScrollSpy._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);
        var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    };

    _createClass(ScrollSpy, null, [{
      key: 'VERSION',
      get: function get() {
        return VERSION;
      }
    }, {
      key: 'Default',
      get: function get() {
        return Default;
      }
    }]);

    return ScrollSpy;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(window).on(Event.LOAD_DATA_API, function () {
    var scrollSpys = $.makeArray($(Selector.DATA_SPY));

    for (var i = scrollSpys.length; i--;) {
      var $spy = $(scrollSpys[i]);
      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = ScrollSpy._jQueryInterface;
  $.fn[NAME].Constructor = ScrollSpy;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return ScrollSpy._jQueryInterface;
  };

  return ScrollSpy;
}(jQuery);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Tab = function ($) {

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'tab';
  var VERSION = '4.0.0-alpha.6';
  var DATA_KEY = 'bs.tab';
  var EVENT_KEY = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 150;

  var Event = {
    HIDE: 'hide' + EVENT_KEY,
    HIDDEN: 'hidden' + EVENT_KEY,
    SHOW: 'show' + EVENT_KEY,
    SHOWN: 'shown' + EVENT_KEY,
    CLICK_DATA_API: 'click' + EVENT_KEY + DATA_API_KEY
  };

  var ClassName = {
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };

  var Selector = {
    A: 'a',
    LI: 'li',
    DROPDOWN: '.dropdown',
    LIST: 'ul:not(.dropdown-menu), ol:not(.dropdown-menu), nav:not(.dropdown-menu)',
    FADE_CHILD: '> .nav-item .fade, > .fade',
    ACTIVE: '.active',
    ACTIVE_CHILD: '> .nav-item > .active, > .active',
    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"]',
    DROPDOWN_TOGGLE: '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Tab = function () {
    function Tab(element) {
      _classCallCheck(this, Tab);

      this._element = element;
    }

    // getters

    // public

    Tab.prototype.show = function show() {
      var _this20 = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName.ACTIVE) || $(this._element).hasClass(ClassName.DISABLED)) {
        return;
      }

      var target = void 0;
      var previous = void 0;
      var listElement = $(this._element).closest(Selector.LIST)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        previous = $.makeArray($(listElement).find(Selector.ACTIVE));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(Event.HIDE, {
        relatedTarget: this._element
      });

      var showEvent = $.Event(Event.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = $(selector)[0];
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(Event.HIDDEN, {
          relatedTarget: _this20._element
        });

        var shownEvent = $.Event(Event.SHOWN, {
          relatedTarget: previous
        });

        $(previous).trigger(hiddenEvent);
        $(_this20._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    Tab.prototype.dispose = function dispose() {
      $.removeClass(this._element, DATA_KEY);
      this._element = null;
    };

    // private

    Tab.prototype._activate = function _activate(element, container, callback) {
      var _this21 = this;

      var active = $(container).find(Selector.ACTIVE_CHILD)[0];
      var isTransitioning = callback && Util.supportsTransitionEnd() && (active && $(active).hasClass(ClassName.FADE) || Boolean($(container).find(Selector.FADE_CHILD)[0]));

      var complete = function complete() {
        return _this21._transitionComplete(element, active, isTransitioning, callback);
      };

      if (active && isTransitioning) {
        $(active).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        complete();
      }

      if (active) {
        $(active).removeClass(ClassName.SHOW);
      }
    };

    Tab.prototype._transitionComplete = function _transitionComplete(element, active, isTransitioning, callback) {
      if (active) {
        $(active).removeClass(ClassName.ACTIVE);

        var dropdownChild = $(active.parentNode).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName.ACTIVE);
        }

        active.setAttribute('aria-expanded', false);
      }

      $(element).addClass(ClassName.ACTIVE);
      element.setAttribute('aria-expanded', true);

      if (isTransitioning) {
        Util.reflow(element);
        $(element).addClass(ClassName.SHOW);
      } else {
        $(element).removeClass(ClassName.FADE);
      }

      if (element.parentNode && $(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {

        var dropdownElement = $(element).closest(Selector.DROPDOWN)[0];
        if (dropdownElement) {
          $(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    };

    // static

    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: 'VERSION',
      get: function get() {
        return VERSION;
      }
    }]);

    return Tab;
  }();

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault();
    Tab._jQueryInterface.call($(this), 'show');
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Tab._jQueryInterface;
  $.fn[NAME].Constructor = Tab;
  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Tab._jQueryInterface;
  };

  return Tab;
}(jQuery);

/* global Tether */

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Tooltip = function ($) {

  /**
   * Check for Tether dependency
   * Tether - http://tether.io/
   */
  if (typeof Tether === 'undefined') {
    throw new Error('Bootstrap tooltips require Tether (http://tether.io/)');
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'tooltip';
  var VERSION = '4.0.0-alpha.6';
  var DATA_KEY = 'bs.tooltip';
  var EVENT_KEY = '.' + DATA_KEY;
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var TRANSITION_DURATION = 150;
  var CLASS_PREFIX = 'bs-tether';

  var Default = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: '0 0',
    constraints: [],
    container: false
  };

  var DefaultType = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: 'string',
    constraints: 'array',
    container: '(string|element|boolean)'
  };

  var AttachmentMap = {
    TOP: 'bottom center',
    RIGHT: 'middle left',
    BOTTOM: 'top center',
    LEFT: 'middle right'
  };

  var HoverState = {
    SHOW: 'show',
    OUT: 'out'
  };

  var Event = {
    HIDE: 'hide' + EVENT_KEY,
    HIDDEN: 'hidden' + EVENT_KEY,
    SHOW: 'show' + EVENT_KEY,
    SHOWN: 'shown' + EVENT_KEY,
    INSERTED: 'inserted' + EVENT_KEY,
    CLICK: 'click' + EVENT_KEY,
    FOCUSIN: 'focusin' + EVENT_KEY,
    FOCUSOUT: 'focusout' + EVENT_KEY,
    MOUSEENTER: 'mouseenter' + EVENT_KEY,
    MOUSELEAVE: 'mouseleave' + EVENT_KEY
  };

  var ClassName = {
    FADE: 'fade',
    SHOW: 'show'
  };

  var Selector = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner'
  };

  var TetherClass = {
    element: false,
    enabled: false
  };

  var Trigger = {
    HOVER: 'hover',
    FOCUS: 'focus',
    CLICK: 'click',
    MANUAL: 'manual'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Tooltip = function () {
    function Tooltip(element, config) {
      _classCallCheck(this, Tooltip);

      // private
      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._isTransitioning = false;
      this._tether = null;

      // protected
      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    }

    // getters

    // public

    Tooltip.prototype.enable = function enable() {
      this._isEnabled = true;
    };

    Tooltip.prototype.disable = function disable() {
      this._isEnabled = false;
    };

    Tooltip.prototype.toggleEnabled = function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    };

    Tooltip.prototype.toggle = function toggle(event) {
      if (event) {
        var dataKey = this.constructor.DATA_KEY;
        var context = $(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {

        if ($(this.getTipElement()).hasClass(ClassName.SHOW)) {
          this._leave(null, this);
          return;
        }

        this._enter(null, this);
      }
    };

    Tooltip.prototype.dispose = function dispose() {
      clearTimeout(this._timeout);

      this.cleanupTether();

      $.removeData(this.element, this.constructor.DATA_KEY);

      $(this.element).off(this.constructor.EVENT_KEY);
      $(this.element).closest('.modal').off('hide.bs.modal');

      if (this.tip) {
        $(this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;
      this._tether = null;

      this.element = null;
      this.config = null;
      this.tip = null;
    };

    Tooltip.prototype.show = function show() {
      var _this22 = this;

      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $.Event(this.constructor.Event.SHOW);
      if (this.isWithContent() && this._isEnabled) {
        if (this._isTransitioning) {
          throw new Error('Tooltip is transitioning');
        }
        $(this.element).trigger(showEvent);

        var isInTheDom = $.contains(this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);

        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);

        this.setContent();

        if (this.config.animation) {
          $(tip).addClass(ClassName.FADE);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this._getAttachment(placement);

        var container = this.config.container === false ? document.body : $(this.config.container);

        $(tip).data(this.constructor.DATA_KEY, this).appendTo(container);

        $(this.element).trigger(this.constructor.Event.INSERTED);

        this._tether = new Tether({
          attachment: attachment,
          element: tip,
          target: this.element,
          classes: TetherClass,
          classPrefix: CLASS_PREFIX,
          offset: this.config.offset,
          constraints: this.config.constraints,
          addTargetClasses: false
        });

        Util.reflow(tip);
        this._tether.position();

        $(tip).addClass(ClassName.SHOW);

        var complete = function complete() {
          var prevHoverState = _this22._hoverState;
          _this22._hoverState = null;
          _this22._isTransitioning = false;

          $(_this22.element).trigger(_this22.constructor.Event.SHOWN);

          if (prevHoverState === HoverState.OUT) {
            _this22._leave(null, _this22);
          }
        };

        if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
          this._isTransitioning = true;
          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION);
          return;
        }

        complete();
      }
    };

    Tooltip.prototype.hide = function hide(callback) {
      var _this23 = this;

      var tip = this.getTipElement();
      var hideEvent = $.Event(this.constructor.Event.HIDE);
      if (this._isTransitioning) {
        throw new Error('Tooltip is transitioning');
      }
      var complete = function complete() {
        if (_this23._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this23.element.removeAttribute('aria-describedby');
        $(_this23.element).trigger(_this23.constructor.Event.HIDDEN);
        _this23._isTransitioning = false;
        _this23.cleanupTether();

        if (callback) {
          callback();
        }
      };

      $(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(tip).removeClass(ClassName.SHOW);

      this._activeTrigger[Trigger.CLICK] = false;
      this._activeTrigger[Trigger.FOCUS] = false;
      this._activeTrigger[Trigger.HOVER] = false;

      if (Util.supportsTransitionEnd() && $(this.tip).hasClass(ClassName.FADE)) {
        this._isTransitioning = true;
        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        complete();
      }

      this._hoverState = '';
    };

    // protected

    Tooltip.prototype.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    Tooltip.prototype.getTipElement = function getTipElement() {
      return this.tip = this.tip || $(this.config.template)[0];
    };

    Tooltip.prototype.setContent = function setContent() {
      var $tip = $(this.getTipElement());

      this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle());

      $tip.removeClass(ClassName.FADE + ' ' + ClassName.SHOW);

      this.cleanupTether();
    };

    Tooltip.prototype.setElementContent = function setElementContent($element, content) {
      var html = this.config.html;
      if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object' && (content.nodeType || content.jquery)) {
        // content is a DOM node or a jQuery
        if (html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }
      } else {
        $element[html ? 'html' : 'text'](content);
      }
    };

    Tooltip.prototype.getTitle = function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    };

    Tooltip.prototype.cleanupTether = function cleanupTether() {
      if (this._tether) {
        this._tether.destroy();
      }
    };

    // private

    Tooltip.prototype._getAttachment = function _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    };

    Tooltip.prototype._setListeners = function _setListeners() {
      var _this24 = this;

      var triggers = this.config.trigger.split(' ');

      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $(_this24.element).on(_this24.constructor.Event.CLICK, _this24.config.selector, function (event) {
            return _this24.toggle(event);
          });
        } else if (trigger !== Trigger.MANUAL) {
          var eventIn = trigger === Trigger.HOVER ? _this24.constructor.Event.MOUSEENTER : _this24.constructor.Event.FOCUSIN;
          var eventOut = trigger === Trigger.HOVER ? _this24.constructor.Event.MOUSELEAVE : _this24.constructor.Event.FOCUSOUT;

          $(_this24.element).on(eventIn, _this24.config.selector, function (event) {
            return _this24._enter(event);
          }).on(eventOut, _this24.config.selector, function (event) {
            return _this24._leave(event);
          });
        }

        $(_this24.element).closest('.modal').on('hide.bs.modal', function () {
          return _this24.hide();
        });
      });

      if (this.config.selector) {
        this.config = $.extend({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this._fixTitle();
      }
    };

    Tooltip.prototype._fixTitle = function _fixTitle() {
      var titleType = _typeof(this.element.getAttribute('data-original-title'));
      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    Tooltip.prototype._enter = function _enter(event, context) {
      var dataKey = this.constructor.DATA_KEY;

      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
      }

      if ($(context.getTipElement()).hasClass(ClassName.SHOW) || context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW;
        return;
      }

      clearTimeout(context._timeout);

      context._hoverState = HoverState.SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    Tooltip.prototype._leave = function _leave(event, context) {
      var dataKey = this.constructor.DATA_KEY;

      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);

      context._hoverState = HoverState.OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    Tooltip.prototype._isWithActiveTrigger = function _isWithActiveTrigger() {
      for (var trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    Tooltip.prototype._getConfig = function _getConfig(config) {
      config = $.extend({}, this.constructor.Default, $(this.element).data(), config);

      if (config.delay && typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);

      return config;
    };

    Tooltip.prototype._getDelegateConfig = function _getDelegateConfig() {
      var config = {};

      if (this.config) {
        for (var key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config;
    };

    // static

    Tooltip._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY);
        var _config = (typeof config === 'undefined' ? 'undefined' : _typeof(config)) === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (data[config] === undefined) {
            throw new Error('No method named "' + config + '"');
          }
          data[config]();
        }
      });
    };

    _createClass(Tooltip, null, [{
      key: 'VERSION',
      get: function get() {
        return VERSION;
      }
    }, {
      key: 'Default',
      get: function get() {
        return Default;
      }
    }, {
      key: 'NAME',
      get: function get() {
        return NAME;
      }
    }, {
      key: 'DADA_KEY',      get: fuîctiïn gåv,) {
     !  retupn DCTA_KEY»
      }
    }, {    " je}: 'EVent',"     ggt: function wet() {
  `¡ "  retern Event;
` `   }
    },0{
      key: 'EVET_KEY',
      fdt:$fun`tion 'et() z
   `    revqrf EVE^T_KAY?
      
    }, {
      ke9ú ¯DefaudtType',
"     get: fun#timn get() {
      ` return DefaultTyðe;
  ((  }
    ]]);
   (rettrn!Tooìtip;
  ý8);

  /**:   * ------%-­-­-------m----­----------------=------)----------m-----,--=%
 ( * jQuery
   * ---¯--m)------/---------------------------=---=-----(----------------J   ./
  $.fn[FEMU]  Tooltir.ßjQuer{Interface;
  $.gn[NAME].Constructor = Tooltip;
  $.fn[FAMÝ.noConflIct =$fuo#tion () {
    $.fn[NAME] = JQUEVY_NOßCONFLICT;*    veturn Tooltip.jQue2yIntgrfsce;
  };

  rgturnàDool4ip;
}(kYueryi;

/**
 * --m----=---/----------------)-<-----------­---------,-----)-----m----,--
 * Boo|strap (v4/0.0­alpha.6): ppover.js
 * Ìicensed ulder MIt (ittps:/'github.comtwbs/bootstrap/nlïb/mqstEr/ÌIcENSE)
 * --m----%------------l<!---+--%----<M-m/-------=--?-))-m=---,--/---%---- 
/
6ar°Pcðovpr -"&unsdion 00) 
 !++

   * --,$------//­-%-m--/-,-%--------)---m---­/--­----,-%­-----­-==-­/-m--Š   *(Sonstends p * '------,­'--%-------=----%-­=--,/m-­­-'-)----%--$%-?------­---)l----*   k
Ê  veb!NAEE =h'pmqoôer§:*  vap$VERSMON0<`'4& .-alðia.66;
` tar@DAUAIE[ 5 ¯"{,tï`over'9
"!var EVGZT]kE[ = '.'8+$AT@_JaY; !vañJQUERØ^NK_CïFFLIT = $.fnNAME]+

` wab Dá&auìt!= .E8teîhÒ=,*Fooldip>@dvault z
   (ðmice]u~ô: 'zigL5e,
    t iegev2 'cnick',
 0  cgntenv:(7',    |empla4e² ‡=biv0clA2S1"Poòmbex"prole=.uo/l4q0>' ;0'h3 cmAs3-#popover-t+ÅL%"><è3>'  '$lmv"cìass-âtopNvgr-c/n0íng*>$/tev:<+div>'
 ,ý);
 (var"Dåf`õt4type = $.Exteäd({y(`oolT]p.Def#7ltTyXõl0ÿ    con|ånt: '(strin'\eleole<fvîc}ion)'
  ])?JŠ var Bma3rNaEe`½ ûŽ$   FATM:`/fadå',‚0 $ ShW: wlou'
0 };

 $v`r Cmlåk4gr õ0{Š¡   THTA: 7.`opoer=tùtle/,
   "CONPEnT §.popover­gont'nt‡
 };

$ 6-r Event`=`{
  0"HADE: §hidu$k EVET_Cu]<Š`  (HIFDCN: '(idt`n'(+ eVENT_IGy,
    ÓHOW: 'qhow' + EVeT_KY,
    ShOWN: 'sjown' + EVENT_KEY,
    )NsERTEL; 'inser|ed' + EVENT_KEY,
    CLICK: 'cDick'$+ EFENT_KEY,
0   ÆOCUSIN: focusing + EVENT_KEY,
    FOCUSOUT: 'focusout7 + EVEN_IEY,
   "MOUSEENTER: 'mouseenter' + EVENTWKY,
   !MOUELEA: 'museluave' + EVNT]KEY
  };
  /.j
   * --------m------)------}--------%---------/--------)-------------------Š   *"C,ass DåfinItion:   * -=--­-----m-------------­------­--)-)----%---=-------------------------
   */

  var Popovev 9 æuncTion (_TooLtip) y
    _inherIus8Popover, _Tooltip);

    Function Pkpover() {      _classCállCheck(thks, Popover);

      2eturn _poswirleSonstructorREttrn(thi{, _Tooltip.apply(this crguments)-;
    }

 $` // ovírrides

    popoveb.ðrgtotxpe.iqWithïntent = function isWh|hContent() {
      return thmsnget\itle(9 ü| this._guuCo.tdnu,);
    };

    Popover.prototype.gmtTipEla-eît =`Functiol gatTiqElemunt() ;
   `" return this.tip = this.tip(|| $(this.config.demplate)Z0];
  ( ý;

    Ðopover.prodotyPe.weTCoîôent = funãtion setConteot() {
      var $ôip - $(thir.getTiplement());Š
      // we use`append for html objects to0maintain`js events
      this.setMlemuntContent($tip.fInd(SelectorŽTK\LE), thys*getTitle());
      thissetElemen4ContentH$tip.find8Selmc|or.COÎENT), this._ggpCont}nt()©;

  ! ` $tip.removmÃlaqs(CléssName.FADE0k ' ' /`ClassName.SHOW);

  !   this.cleanupTether9;
    |

    // private

    Popofer.prot/ty0e._GetontEnt } nuncôion _geuoftånt() {
      reuurn0tjis.e,emEnt.getAturmbute(gdata-Content') |ü (typewf pHis.coNfig&cont%tt!=== #functãon' ? tlis.confiç.contmnt.calh(tHis.eLEmmn\) : Dhis.config.condent)
 (2 };

    // stathc*
    Rmqover._jQueryI~tErface = fufctIon _jQugryInterfaa8aonfig) {
      re|urn this.aach(fun#tion 8) {
   "   bvar data = ,(dHys).data(DATA_KEY);*  ! !   7ar _config = ¨ôù1egF so.fig === 'undefiîed'p¯ 'undefined' : _typeof(co~figi) === 'object' ? confiç : .ully

     `  if (!data8&& /dEstry|hide.ueSt(config)) û
          return;
    `   }

        if *!dqtá) 
 `"     ( data ="lew<Popover(this, _confég+;          $(this).datá(DATA_KY, dAta);        }J
        if0htyp%of confkg`==½ strino') y
   $ `  ! if (data[connig] === undefined) {
  0         throw ne7 rrr('no"method named b' + config +!'"/);
    !  `( u
      €   data[con~ig]();
   0    }
   `  });
   !ý;

    ßcrea|eClass(Popover, nell, [;  (   Key: 'VRSIO^',


      // gedters

      get> function gft() 
        return VERSÉOÞ;
      }
h   }, {
      key: 'Emfault%,
     0get functin get() {
      ( return Dådáult;
  (   ]
  !!}, {
 "    key: /NAEE',
  H(  get; fuîkti/n gep() {
 $      òeôurn NAME;
      }
   !}, {
@     key:"'DATAßKEY',Š ! 0  get: func4hon get()({
        ruturn DATA_KEY»
     }
    }, {
   $  key: 'Event',
      cet: f}nctign"get8) y    0   return Evunt;
    !!}
!   }, {
      kuq: 'ÅVENT_KEY',
 0    get: fenction$gat(! {
     "  rettrn EVENT_KUI;
      }
`   ], {
      key: 'Defa}ltType§,
      get: fuìcTion Gmt() [
       0beturo D}faultType{
 6    }
    }]);

  $ return POpOvev;
  }(ooLtip);

  /**
@  +"---%m-----m­-5-%-­--/-­-­%-m!-½,?-----­%-,-¡¬/-----m--)-m-=-=,a=-
 ("* jQwery  "* --/m---/'%Í-='-	-/­)-'--m--m%-)--­=å¯,,-%-------­­----=---)-/--,-)----
  b(/
( $>fnSNEIE] % opnver._jÑueRiI.ter&ake?
  ,.f.VOMMUnAmnsvbuctob = Popgväò;
 8$.ä~[NAM].noCOnbliat = fa.ctio~ ) {
  ("4?nnYNGEEY =¡JQUEVYONOßC_NDIC;
   "reTuwn Pnðover._jQuaryI~terfi`e¿
$ };
H (zettrn0Popmöer;
}(jR5EPy©9B}(+;