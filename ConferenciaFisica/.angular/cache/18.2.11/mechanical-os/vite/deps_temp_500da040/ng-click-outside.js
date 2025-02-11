import {
  isPlatformBrowser
} from "./chunk-M3QBU4KS.js";
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  NgZone,
  Output,
  PLATFORM_ID,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject
} from "./chunk-XZCMO2WH.js";
import "./chunk-4N4GOYJH.js";
import "./chunk-5OPE3T2R.js";
import "./chunk-FHTVLBLO.js";
import "./chunk-3OV72XIM.js";

// node_modules/ng-click-outside/lib_esmodule/click-outside.directive.js
var ClickOutsideDirective = function() {
  function ClickOutsideDirective2(_el, _ngZone, platformId) {
    this._el = _el;
    this._ngZone = _ngZone;
    this.platformId = platformId;
    this.clickOutsideEnabled = true;
    this.attachOutsideOnClick = false;
    this.delayClickOutsideInit = false;
    this.emitOnBlur = false;
    this.exclude = "";
    this.excludeBeforeClick = false;
    this.clickOutsideEvents = "";
    this.clickOutside = new EventEmitter();
    this._nodesExcluded = [];
    this._events = ["click"];
    this._initOnClickBody = this._initOnClickBody.bind(this);
    this._onClickBody = this._onClickBody.bind(this);
    this._onWindowBlur = this._onWindowBlur.bind(this);
  }
  ClickOutsideDirective2.prototype.ngOnInit = function() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this._init();
  };
  ClickOutsideDirective2.prototype.ngOnDestroy = function() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this._removeClickOutsideListener();
    this._removeAttachOutsideOnClickListener();
    this._removeWindowBlurListener();
  };
  ClickOutsideDirective2.prototype.ngOnChanges = function(changes) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (changes["attachOutsideOnClick"] || changes["exclude"] || changes["emitOnBlur"]) {
      this._init();
    }
  };
  ClickOutsideDirective2.prototype._init = function() {
    if (this.clickOutsideEvents !== "") {
      this._events = this.clickOutsideEvents.split(",").map(function(e) {
        return e.trim();
      });
    }
    this._excludeCheck();
    if (this.attachOutsideOnClick) {
      this._initAttachOutsideOnClickListener();
    } else {
      this._initOnClickBody();
    }
    if (this.emitOnBlur) {
      this._initWindowBlurListener();
    }
  };
  ClickOutsideDirective2.prototype._initOnClickBody = function() {
    if (this.delayClickOutsideInit) {
      setTimeout(this._initClickOutsideListener.bind(this));
    } else {
      this._initClickOutsideListener();
    }
  };
  ClickOutsideDirective2.prototype._excludeCheck = function() {
    if (this.exclude) {
      try {
        var nodes = Array.from(document.querySelectorAll(this.exclude));
        if (nodes) {
          this._nodesExcluded = nodes;
        }
      } catch (err) {
        console.error("[ng-click-outside] Check your exclude selector syntax.", err);
      }
    }
  };
  ClickOutsideDirective2.prototype._onClickBody = function(ev) {
    if (!this.clickOutsideEnabled) {
      return;
    }
    if (this.excludeBeforeClick) {
      this._excludeCheck();
    }
    if (!this._el.nativeElement.contains(ev.target) && !this._shouldExclude(ev.target)) {
      this._emit(ev);
      if (this.attachOutsideOnClick) {
        this._removeClickOutsideListener();
      }
    }
  };
  ClickOutsideDirective2.prototype._onWindowBlur = function(ev) {
    var _this = this;
    setTimeout(function() {
      if (!document.hidden) {
        _this._emit(ev);
      }
    });
  };
  ClickOutsideDirective2.prototype._emit = function(ev) {
    var _this = this;
    if (!this.clickOutsideEnabled) {
      return;
    }
    this._ngZone.run(function() {
      return _this.clickOutside.emit(ev);
    });
  };
  ClickOutsideDirective2.prototype._shouldExclude = function(target) {
    for (var _i = 0, _a = this._nodesExcluded; _i < _a.length; _i++) {
      var excludedNode = _a[_i];
      if (excludedNode.contains(target)) {
        return true;
      }
    }
    return false;
  };
  ClickOutsideDirective2.prototype._initClickOutsideListener = function() {
    var _this = this;
    this._ngZone.runOutsideAngular(function() {
      _this._events.forEach(function(e) {
        return document.addEventListener(e, _this._onClickBody);
      });
    });
  };
  ClickOutsideDirective2.prototype._removeClickOutsideListener = function() {
    var _this = this;
    this._ngZone.runOutsideAngular(function() {
      _this._events.forEach(function(e) {
        return document.removeEventListener(e, _this._onClickBody);
      });
    });
  };
  ClickOutsideDirective2.prototype._initAttachOutsideOnClickListener = function() {
    var _this = this;
    this._ngZone.runOutsideAngular(function() {
      _this._events.forEach(function(e) {
        return _this._el.nativeElement.addEventListener(e, _this._initOnClickBody);
      });
    });
  };
  ClickOutsideDirective2.prototype._removeAttachOutsideOnClickListener = function() {
    var _this = this;
    this._ngZone.runOutsideAngular(function() {
      _this._events.forEach(function(e) {
        return _this._el.nativeElement.removeEventListener(e, _this._initOnClickBody);
      });
    });
  };
  ClickOutsideDirective2.prototype._initWindowBlurListener = function() {
    var _this = this;
    this._ngZone.runOutsideAngular(function() {
      window.addEventListener("blur", _this._onWindowBlur);
    });
  };
  ClickOutsideDirective2.prototype._removeWindowBlurListener = function() {
    var _this = this;
    this._ngZone.runOutsideAngular(function() {
      window.removeEventListener("blur", _this._onWindowBlur);
    });
  };
  ClickOutsideDirective2.ɵfac = function ClickOutsideDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ClickOutsideDirective2)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(PLATFORM_ID));
  };
  ClickOutsideDirective2.ɵdir = ɵɵdefineDirective({
    type: ClickOutsideDirective2,
    selectors: [["", "clickOutside", ""]],
    inputs: {
      clickOutsideEnabled: "clickOutsideEnabled",
      attachOutsideOnClick: "attachOutsideOnClick",
      delayClickOutsideInit: "delayClickOutsideInit",
      emitOnBlur: "emitOnBlur",
      exclude: "exclude",
      excludeBeforeClick: "excludeBeforeClick",
      clickOutsideEvents: "clickOutsideEvents"
    },
    outputs: {
      clickOutside: "clickOutside"
    },
    features: [ɵɵNgOnChangesFeature]
  });
  return ClickOutsideDirective2;
}();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClickOutsideDirective, [{
    type: Directive,
    args: [{
      selector: "[clickOutside]"
    }]
  }], function() {
    return [{
      type: ElementRef
    }, {
      type: NgZone
    }, {
      type: Object,
      decorators: [{
        type: Inject,
        args: [PLATFORM_ID]
      }]
    }];
  }, {
    clickOutsideEnabled: [{
      type: Input
    }],
    attachOutsideOnClick: [{
      type: Input
    }],
    delayClickOutsideInit: [{
      type: Input
    }],
    emitOnBlur: [{
      type: Input
    }],
    exclude: [{
      type: Input
    }],
    excludeBeforeClick: [{
      type: Input
    }],
    clickOutsideEvents: [{
      type: Input
    }],
    clickOutside: [{
      type: Output
    }]
  });
})();

// node_modules/ng-click-outside/lib_esmodule/click-outside.module.js
var ClickOutsideModule = function() {
  function ClickOutsideModule2() {
  }
  ClickOutsideModule2.ɵfac = function ClickOutsideModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ClickOutsideModule2)();
  };
  ClickOutsideModule2.ɵmod = ɵɵdefineNgModule({
    type: ClickOutsideModule2,
    declarations: [ClickOutsideDirective],
    exports: [ClickOutsideDirective]
  });
  ClickOutsideModule2.ɵinj = ɵɵdefineInjector({});
  return ClickOutsideModule2;
}();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClickOutsideModule, [{
    type: NgModule,
    args: [{
      declarations: [ClickOutsideDirective],
      exports: [ClickOutsideDirective]
    }]
  }], null, null);
})();
export {
  ClickOutsideDirective,
  ClickOutsideModule
};
//# sourceMappingURL=ng-click-outside.js.map
