System.registerDynamic("angular2-contextmenu/src/contextMenu.options", ["@angular/core"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var core_1 = $__require('@angular/core');
  exports.CONTEXT_MENU_OPTIONS = new core_1.OpaqueToken('CONTEXT_MENU_OPTIONS');
  return module.exports;
});

System.registerDynamic("angular2-contextmenu/src/contextMenu.component", ["./contextMenu.item.directive", "./contextMenu.options", "./contextMenu.service", "@angular/core"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var contextMenu_item_directive_1 = $__require('./contextMenu.item.directive');
  var contextMenu_options_1 = $__require('./contextMenu.options');
  var contextMenu_service_1 = $__require('./contextMenu.service');
  var core_1 = $__require('@angular/core');
  var ContextMenuComponent = (function() {
    function ContextMenuComponent(_contextMenuService, changeDetector, elementRef, options) {
      var _this = this;
      this._contextMenuService = _contextMenuService;
      this.changeDetector = changeDetector;
      this.elementRef = elementRef;
      this.options = options;
      this.useBootstrap4 = false;
      this.close = new core_1.EventEmitter();
      this.visibleMenuItems = [];
      this.links = [];
      this.isShown = false;
      this.isOpening = false;
      this.mouseLocation = {
        left: '0px',
        top: '0px'
      };
      if (options) {
        this.useBootstrap4 = options.useBootstrap4;
      }
      _contextMenuService.show.subscribe(function(menuEvent) {
        return _this.onMenuEvent(menuEvent);
      });
    }
    ContextMenuComponent.prototype.stopEvent = function($event) {
      $event.stopPropagation();
    };
    Object.defineProperty(ContextMenuComponent.prototype, "locationCss", {
      get: function() {
        return {
          'position': 'fixed',
          'display': this.isShown ? 'block' : 'none',
          left: this.mouseLocation.left,
          marginLeft: this.mouseLocation.marginLeft,
          marginTop: this.mouseLocation.marginTop,
          top: this.mouseLocation.top
        };
      },
      enumerable: true,
      configurable: true
    });
    ContextMenuComponent.prototype.clickedOutside = function() {
      if (!this.isOpening) {
        this.hideMenu();
      }
    };
    ContextMenuComponent.prototype.ngAfterContentInit = function() {
      var _this = this;
      this.menuItems.forEach(function(menuItem) {
        menuItem.execute.subscribe(function() {
          return _this.hideMenu();
        });
      });
    };
    ContextMenuComponent.prototype.isMenuItemEnabled = function(menuItem) {
      return this.evaluateIfFunction(menuItem.enabled);
    };
    ContextMenuComponent.prototype.isMenuItemVisible = function(menuItem) {
      return this.evaluateIfFunction(menuItem.visible);
    };
    ContextMenuComponent.prototype.evaluateIfFunction = function(value) {
      if (value instanceof Function) {
        return value(this.item);
      }
      return value;
    };
    ContextMenuComponent.prototype.isDisabled = function(link) {
      return link.enabled && !link.enabled(this.item);
    };
    ContextMenuComponent.prototype.execute = function(link, $event) {
      if (this.isDisabled(link)) {
        return;
      }
      this.hideMenu();
      link.click(this.item, $event);
    };
    ContextMenuComponent.prototype.onMenuEvent = function(menuEvent) {
      var _this = this;
      var actions = menuEvent.actions,
          contextMenu = menuEvent.contextMenu,
          event = menuEvent.event,
          item = menuEvent.item;
      if (contextMenu && contextMenu !== this) {
        this.hideMenu();
        return;
      }
      this.isOpening = true;
      setTimeout(function() {
        return _this.isOpening = false;
      }, 400);
      if (actions) {
        if (console && console.warn) {
          console.warn("actions configuration object is deprecated and will be removed in version 1.x.\n        See https://github.com/isaacplmann/angular2-contextmenu for the new declarative syntax.");
        }
      }
      if (actions && actions.length > 0) {
        this.setVisibleMenuItems();
        this.showMenu();
      } else if (this.menuItems) {
        setTimeout(function() {
          _this.setVisibleMenuItems();
          if (_this.visibleMenuItems.length > 0) {
            _this.showMenu();
          } else {
            _this.hideMenu();
          }
          setTimeout(function() {
            var menuWidth = _this.menuElement ? _this.menuElement.nativeElement.clientWidth : 100;
            var menuHeight = _this.menuElement ? _this.menuElement.nativeElement.clientHeight : 100;
            var bodyWidth = event.view.document.body.clientWidth;
            var bodyHeight = event.view.document.body.clientHeight;
            var distanceFromRight = bodyWidth - (event.clientX + menuWidth);
            var distanceFromBottom = bodyHeight - (event.clientY + menuHeight);
            var isMenuOutsideBody = false;
            if (distanceFromRight < 0 && event.clientX > bodyWidth / 2) {
              _this.mouseLocation.marginLeft = '-' + menuWidth + 'px';
              isMenuOutsideBody = true;
            }
            if (distanceFromBottom < 0 && event.clientY > bodyHeight / 2) {
              _this.mouseLocation.marginTop = '-' + menuHeight + 'px';
              isMenuOutsideBody = true;
            }
            if (isMenuOutsideBody) {
              _this.showMenu();
            }
          });
        });
      } else {
        this.hideMenu();
      }
      this.links = actions;
      this.item = item;
      var adjustX = 0;
      var adjustY = 0;
      var offsetParent = this.elementRef.nativeElement.offsetParent;
      if (offsetParent && offsetParent.tagName !== 'BODY') {
        var position = event.view.getComputedStyle(offsetParent).position;
        if (position !== 'absolute' && position !== 'fixed' && this.locationCss.position !== 'fixed') {
          var _a = offsetParent.getBoundingClientRect(),
              left = _a.left,
              top_1 = _a.top;
          adjustX = -left;
          adjustY = -top_1;
        }
      }
      this.mouseLocation = {
        left: event.clientX + adjustX + 'px',
        top: event.clientY + adjustY + 'px'
      };
    };
    ContextMenuComponent.prototype.setVisibleMenuItems = function() {
      var _this = this;
      this.visibleMenuItems = this.menuItems.filter(function(menuItem) {
        return _this.isMenuItemVisible(menuItem);
      });
    };
    ContextMenuComponent.prototype.showMenu = function() {
      this.isShown = true;
      this.changeDetector.markForCheck();
    };
    ContextMenuComponent.prototype.hideMenu = function(event) {
      if (event && (event.keyCode && event.keyCode !== 27 || event.key && event.key !== 'Escape')) {
        return;
      }
      if (this.isShown === true) {
        this.close.emit({});
      }
      this.isShown = false;
      this.changeDetector.markForCheck();
    };
    ContextMenuComponent.decorators = [{
      type: core_1.Component,
      args: [{
        selector: 'context-menu',
        styles: [".passive {\n       display: block;\n       padding: 3px 20px;\n       clear: both;\n       font-weight: normal;\n       line-height: @line-height-base;\n       white-space: nowrap;\n     }"],
        template: "<div class=\"dropdown angular2-contextmenu\">\n      <ul *ngIf=\"item\" #menu [ngStyle]=\"locationCss\" class=\"dropdown-menu\">\n        <!-- Imperative context menu -->\n        <li *ngFor=\"let link of links\" [class.disabled]=\"isDisabled(link)\">\n          <a href [class.dropdown-item]=\"useBootstrap4\" [class.disabled]=\"useBootstrap4 && isDisabled(link)\"\n            (click)=\"execute(link, $event); $event.preventDefault();\"\n            innerHTML=\"{{link.html ? link.html(item) : ''}}\"></a>\n        </li>\n        <!-- Declarative context menu -->\n        <li *ngFor=\"let menuItem of visibleMenuItems\" [class.disabled]=\"!isMenuItemEnabled(menuItem)\"\n            [class.divider]=\"menuItem.divider\" [class.dropdown-divider]=\"useBootstrap4 && menuItem.divider\"\n            [attr.role]=\"menuItem.divider ? 'separator' : undefined\">\n          <div *ngIf=\"!menuItem.divider && !menuItem.passive\" href [class.dropdown-item]=\"useBootstrap4\"\n            [class.disabled]=\"useBootstrap4 && !isMenuItemEnabled(menuItem)\"\n            (click)=\"menuItem.triggerExecute(item, $event); $event.preventDefault();\">\n            <template [ngTemplateOutlet]=\"menuItem.template\" [ngOutletContext]=\"{ $implicit: item }\"></template>\n          </div>\n\n          <span (click)=\"stopEvent($event)\" (contextmenu)=\"stopEvent($event)\" class=\"passive\"\n                *ngIf=\"!menuItem.divider && menuItem.passive\" [class.dropdown-item]=\"useBootstrap4\"\n                [class.disabled]=\"useBootstrap4 && !isMenuItemEnabled(menuItem)\">\n            <template [ngTemplateOutlet]=\"menuItem.template\" [ngOutletContext]=\"{ $implicit: item }\"></template>\n          </span>\n        </li>\n      </ul>\n    </div>\n  "
      }]
    }];
    ContextMenuComponent.ctorParameters = function() {
      return [{type: contextMenu_service_1.ContextMenuService}, {type: core_1.ChangeDetectorRef}, {type: core_1.ElementRef}, {
        type: undefined,
        decorators: [{type: core_1.Optional}, {
          type: core_1.Inject,
          args: [contextMenu_options_1.CONTEXT_MENU_OPTIONS]
        }]
      }];
    };
    ContextMenuComponent.propDecorators = {
      'useBootstrap4': [{type: core_1.Input}],
      'close': [{type: core_1.Output}],
      'menuItems': [{
        type: core_1.ContentChildren,
        args: [contextMenu_item_directive_1.ContextMenuItemDirective]
      }],
      'menuElement': [{
        type: core_1.ViewChild,
        args: ['menu']
      }],
      'clickedOutside': [{
        type: core_1.HostListener,
        args: ['document:click']
      }, {
        type: core_1.HostListener,
        args: ['document:contextmenu']
      }],
      'hideMenu': [{
        type: core_1.HostListener,
        args: ['window:scroll']
      }, {
        type: core_1.HostListener,
        args: ['document:keydown', ['$event']]
      }]
    };
    return ContextMenuComponent;
  }());
  exports.ContextMenuComponent = ContextMenuComponent;
  return module.exports;
});

System.registerDynamic("angular2-contextmenu/src/contextMenu.item.directive", ["@angular/core"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var core_1 = $__require('@angular/core');
  var ContextMenuItemDirective = (function() {
    function ContextMenuItemDirective(template) {
      this.template = template;
      this.divider = false;
      this.passive = false;
      this.enabled = true;
      this.visible = true;
      this.execute = new core_1.EventEmitter();
    }
    ContextMenuItemDirective.prototype.evaluateIfFunction = function(value, item) {
      if (value instanceof Function) {
        return value(item);
      }
      return value;
    };
    ContextMenuItemDirective.prototype.triggerExecute = function(item, $event) {
      if (!this.evaluateIfFunction(this.enabled, item)) {
        return;
      }
      this.execute.emit({
        event: $event,
        item: item
      });
    };
    ContextMenuItemDirective.decorators = [{
      type: core_1.Directive,
      args: [{selector: 'template[contextMenuItem]'}]
    }];
    ContextMenuItemDirective.ctorParameters = function() {
      return [{type: core_1.TemplateRef}];
    };
    ContextMenuItemDirective.propDecorators = {
      'divider': [{type: core_1.Input}],
      'passive': [{type: core_1.Input}],
      'enabled': [{type: core_1.Input}],
      'visible': [{type: core_1.Input}],
      'execute': [{type: core_1.Output}]
    };
    return ContextMenuItemDirective;
  }());
  exports.ContextMenuItemDirective = ContextMenuItemDirective;
  return module.exports;
});

System.registerDynamic("angular2-contextmenu/src/contextMenu.service", ["@angular/core", "rxjs/Rx"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var core_1 = $__require('@angular/core');
  var Rx_1 = $__require('rxjs/Rx');
  var ContextMenuService = (function() {
    function ContextMenuService() {
      this.show = new Rx_1.Subject();
    }
    ContextMenuService.decorators = [{type: core_1.Injectable}];
    ContextMenuService.ctorParameters = function() {
      return [];
    };
    return ContextMenuService;
  }());
  exports.ContextMenuService = ContextMenuService;
  return module.exports;
});

System.registerDynamic("angular2-contextmenu/src/contextMenu.attach.directive", ["./contextMenu.service", "@angular/core"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  var contextMenu_service_1 = $__require('./contextMenu.service');
  var core_1 = $__require('@angular/core');
  var ContextMenuAttachDirective = (function() {
    function ContextMenuAttachDirective(contextMenuService) {
      this.contextMenuService = contextMenuService;
    }
    ContextMenuAttachDirective.prototype.onContextMenu = function(event) {
      this.contextMenuService.show.next({
        contextMenu: this.contextMenu,
        event: event,
        item: this.contextMenuSubject
      });
      event.preventDefault();
      event.stopPropagation();
    };
    ContextMenuAttachDirective.decorators = [{
      type: core_1.Directive,
      args: [{selector: '[contextMenu]'}]
    }];
    ContextMenuAttachDirective.ctorParameters = function() {
      return [{type: contextMenu_service_1.ContextMenuService}];
    };
    ContextMenuAttachDirective.propDecorators = {
      'contextMenuSubject': [{type: core_1.Input}],
      'contextMenu': [{type: core_1.Input}],
      'onContextMenu': [{
        type: core_1.HostListener,
        args: ['contextmenu', ['$event']]
      }]
    };
    return ContextMenuAttachDirective;
  }());
  exports.ContextMenuAttachDirective = ContextMenuAttachDirective;
  return module.exports;
});

System.registerDynamic("angular2-contextmenu/angular2-contextmenu", ["./src/contextMenu.options", "@angular/core", "@angular/common", "./src/contextMenu.component", "./src/contextMenu.item.directive", "./src/contextMenu.service", "./src/contextMenu.attach.directive"], true, function($__require, exports, module) {
  "use strict";
  ;
  var define,
      global = this,
      GLOBAL = this;
  function __export(m) {
    for (var p in m)
      if (!exports.hasOwnProperty(p))
        exports[p] = m[p];
  }
  var contextMenu_options_1 = $__require('./src/contextMenu.options');
  var core_1 = $__require('@angular/core');
  var common_1 = $__require('@angular/common');
  var contextMenu_component_1 = $__require('./src/contextMenu.component');
  var contextMenu_item_directive_1 = $__require('./src/contextMenu.item.directive');
  var contextMenu_service_1 = $__require('./src/contextMenu.service');
  var contextMenu_attach_directive_1 = $__require('./src/contextMenu.attach.directive');
  __export($__require('./src/contextMenu.component'));
  __export($__require('./src/contextMenu.service'));
  var ContextMenuModule = (function() {
    function ContextMenuModule() {}
    ContextMenuModule.forRoot = function(options) {
      return {
        ngModule: ContextMenuModule,
        providers: [{
          provide: contextMenu_options_1.CONTEXT_MENU_OPTIONS,
          useValue: options
        }]
      };
    };
    ContextMenuModule.decorators = [{
      type: core_1.NgModule,
      args: [{
        declarations: [contextMenu_attach_directive_1.ContextMenuAttachDirective, contextMenu_component_1.ContextMenuComponent, contextMenu_item_directive_1.ContextMenuItemDirective],
        exports: [contextMenu_attach_directive_1.ContextMenuAttachDirective, contextMenu_component_1.ContextMenuComponent, contextMenu_item_directive_1.ContextMenuItemDirective],
        imports: [common_1.CommonModule],
        providers: [contextMenu_service_1.ContextMenuService]
      }]
    }];
    ContextMenuModule.ctorParameters = function() {
      return [];
    };
    return ContextMenuModule;
  }());
  exports.ContextMenuModule = ContextMenuModule;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.default = ContextMenuModule;
  return module.exports;
});

//# sourceMappingURL=angular2-contextmenu.js.map