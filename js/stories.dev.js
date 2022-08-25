"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Stories =
/*#__PURE__*/
function () {
  function Stories(element, options) {
    _classCallCheck(this, Stories);

    this.element = element;
    this.options = options;
  }

  _createClass(Stories, [{
    key: "initializeStructure",
    value: function initializeStructure() {
      this.options.stories.forEach(function (story) {
        var storyElement = document.createElement('div');
        storyElement.appendChild();
      });
    }
  }]);

  return Stories;
}();