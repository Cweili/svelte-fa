(function (Fa) {
  'use strict';

  Fa = Fa && Fa.hasOwnProperty('default') ? Fa['default'] : Fa;

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function noop() {}

  function assign(tar, src) {
    // @ts-ignore
    for (var k in src) {
      tar[k] = src[k];
    }

    return tar;
  }

  function run(fn) {
    return fn();
  }

  function blank_object() {
    return Object.create(null);
  }

  function run_all(fns) {
    fns.forEach(run);
  }

  function is_function(thing) {
    return typeof thing === 'function';
  }

  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
  }

  function null_to_empty(value) {
    return value == null ? '' : value;
  }

  function append(target, node) {
    target.appendChild(node);
  }

  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }

  function detach(node) {
    node.parentNode.removeChild(node);
  }

  function destroy_each(iterations, detaching) {
    for (var i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detaching);
    }
  }

  function element(name) {
    return document.createElement(name);
  }

  function text(data) {
    return document.createTextNode(data);
  }

  function space() {
    return text(' ');
  }

  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return function () {
      return node.removeEventListener(event, handler, options);
    };
  }

  function prevent_default(fn) {
    return function (event) {
      event.preventDefault(); // @ts-ignore

      return fn.call(this, event);
    };
  }

  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);else node.setAttribute(attribute, value);
  }

  function to_number(value) {
    return value === '' ? undefined : +value;
  }

  function children(element) {
    return Array.from(element.childNodes);
  }

  function set_data(text, data) {
    data = '' + data;
    if (text.data !== data) text.data = data;
  }

  function set_input_type(input, type) {
    try {
      input.type = type;
    } catch (e) {// do nothing
    }
  }

  function set_style(node, key, value) {
    node.style.setProperty(key, value);
  }

  var current_component;

  function set_current_component(component) {
    current_component = component;
  }

  function get_current_component() {
    if (!current_component) throw new Error("Function called outside component initialization");
    return current_component;
  }

  function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
  }
  // shorthand events, or if we want to implement
  // a real bubbling mechanism


  function bubble(component, event) {
    var callbacks = component.$$.callbacks[event.type];

    if (callbacks) {
      callbacks.slice().forEach(function (fn) {
        return fn(event);
      });
    }
  }

  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;

  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }

  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }

  function flush() {
    var seen_callbacks = new Set();

    do {
      // first, call beforeUpdate functions
      // and update components
      while (dirty_components.length) {
        var component = dirty_components.shift();
        set_current_component(component);
        update(component.$$);
      }

      while (binding_callbacks.length) {
        binding_callbacks.pop()();
      } // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...


      for (var i = 0; i < render_callbacks.length; i += 1) {
        var callback = render_callbacks[i];

        if (!seen_callbacks.has(callback)) {
          callback(); // ...so guard against infinite loops

          seen_callbacks.add(callback);
        }
      }

      render_callbacks.length = 0;
    } while (dirty_components.length);

    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }

    update_scheduled = false;
  }

  function update($$) {
    if ($$.fragment) {
      $$.update($$.dirty);
      run_all($$.before_update);
      $$.fragment.p($$.dirty, $$.ctx);
      $$.dirty = null;
      $$.after_update.forEach(add_render_callback);
    }
  }

  var outroing = new Set();
  var outros;

  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros // parent group

    };
  }

  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }

    outros = outros.p;
  }

  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }

  function transition_out(block, local, detach, callback) {
    if (block && block.o) {
      if (outroing.has(block)) return;
      outroing.add(block);
      outros.c.push(function () {
        outroing.delete(block);

        if (callback) {
          if (detach) block.d(1);
          callback();
        }
      });
      block.o(local);
    }
  }

  function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
  }

  function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    var o = old_blocks.length;
    var n = list.length;
    var i = o;
    var old_indexes = {};

    while (i--) {
      old_indexes[old_blocks[i].key] = i;
    }

    var new_blocks = [];
    var new_lookup = new Map();
    var deltas = new Map();
    i = n;

    while (i--) {
      var child_ctx = get_context(ctx, list, i);
      var key = get_key(child_ctx);
      var block = lookup.get(key);

      if (!block) {
        block = create_each_block(key, child_ctx);
        block.c();
      } else if (dynamic) {
        block.p(changed, child_ctx);
      }

      new_lookup.set(key, new_blocks[i] = block);
      if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
    }

    var will_move = new Set();
    var did_move = new Set();

    function insert(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n--;
    }

    while (o && n) {
      var new_block = new_blocks[n - 1];
      var old_block = old_blocks[o - 1];
      var new_key = new_block.key;
      var old_key = old_block.key;

      if (new_block === old_block) {
        // do nothing
        next = new_block.first;
        o--;
        n--;
      } else if (!new_lookup.has(old_key)) {
        // remove old block
        destroy(old_block, lookup);
        o--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert(new_block);
      } else if (did_move.has(old_key)) {
        o--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert(new_block);
      } else {
        will_move.add(old_key);
        o--;
      }
    }

    while (o--) {
      var _old_block = old_blocks[o];
      if (!new_lookup.has(_old_block.key)) destroy(_old_block, lookup);
    }

    while (n) {
      insert(new_blocks[n - 1]);
    }

    return new_blocks;
  }

  function get_spread_update(levels, updates) {
    var update = {};
    var to_null_out = {};
    var accounted_for = {
      $$scope: 1
    };
    var i = levels.length;

    while (i--) {
      var o = levels[i];
      var n = updates[i];

      if (n) {
        for (var key in o) {
          if (!(key in n)) to_null_out[key] = 1;
        }

        for (var _key2 in n) {
          if (!accounted_for[_key2]) {
            update[_key2] = n[_key2];
            accounted_for[_key2] = 1;
          }
        }

        levels[i] = n;
      } else {
        for (var _key3 in o) {
          accounted_for[_key3] = 1;
        }
      }
    }

    for (var _key4 in to_null_out) {
      if (!(_key4 in update)) update[_key4] = undefined;
    }

    return update;
  }

  function mount_component(component, target, anchor) {
    var _component$$$ = component.$$,
        fragment = _component$$$.fragment,
        on_mount = _component$$$.on_mount,
        on_destroy = _component$$$.on_destroy,
        after_update = _component$$$.after_update;
    fragment.m(target, anchor); // onMount happens before the initial afterUpdate

    add_render_callback(function () {
      var new_on_destroy = on_mount.map(run).filter(is_function);

      if (on_destroy) {
        on_destroy.push.apply(on_destroy, new_on_destroy);
      } else {
        // Edge case - component was destroyed immediately,
        // most likely as a result of a binding initialising
        run_all(new_on_destroy);
      }

      component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
  }

  function destroy_component(component, detaching) {
    if (component.$$.fragment) {
      run_all(component.$$.on_destroy);
      component.$$.fragment.d(detaching); // TODO null out other refs, including component.$$ (but need to
      // preserve final state?)

      component.$$.on_destroy = component.$$.fragment = null;
      component.$$.ctx = {};
    }
  }

  function make_dirty(component, key) {
    if (!component.$$.dirty) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty = blank_object();
    }

    component.$$.dirty[key] = true;
  }

  function init(component, options, instance, create_fragment, not_equal, prop_names) {
    var parent_component = current_component;
    set_current_component(component);
    var props = options.props || {};
    var $$ = component.$$ = {
      fragment: null,
      ctx: null,
      // state
      props: prop_names,
      update: noop,
      not_equal: not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      before_update: [],
      after_update: [],
      context: new Map(parent_component ? parent_component.$$.context : []),
      // everything else
      callbacks: blank_object(),
      dirty: null
    };
    var ready = false;
    $$.ctx = instance ? instance(component, props, function (key, value) {
      if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
        if ($$.bound[key]) $$.bound[key](value);
        if (ready) make_dirty(component, key);
      }
    }) : props;
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment($$.ctx);

    if (options.target) {
      if (options.hydrate) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment.l(children(options.target));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment.c();
      }

      if (options.intro) transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      flush();
    }

    set_current_component(parent_component);
  }

  var SvelteElement;

  if (typeof HTMLElement !== 'undefined') {
    SvelteElement =
    /*#__PURE__*/
    function (_HTMLElement) {
      _inheritsLoose(SvelteElement, _HTMLElement);

      function SvelteElement() {
        var _this;

        _this = _HTMLElement.call(this) || this;

        _this.attachShadow({
          mode: 'open'
        });

        return _this;
      }

      var _proto = SvelteElement.prototype;

      _proto.connectedCallback = function connectedCallback() {
        // @ts-ignore todo: improve typings
        for (var key in this.$$.slotted) {
          // @ts-ignore todo: improve typings
          this.appendChild(this.$$.slotted[key]);
        }
      };

      _proto.attributeChangedCallback = function attributeChangedCallback(attr, _oldValue, newValue) {
        this[attr] = newValue;
      };

      _proto.$destroy = function $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      };

      _proto.$on = function $on(type, callback) {
        // TODO should this delegate to addEventListener?
        var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return function () {
          var index = callbacks.indexOf(callback);
          if (index !== -1) callbacks.splice(index, 1);
        };
      };

      _proto.$set = function $set() {// overridden by instance, if it has props
      };

      return SvelteElement;
    }(_wrapNativeSuper(HTMLElement));
  }

  var SvelteComponent =
  /*#__PURE__*/
  function () {
    function SvelteComponent() {}

    var _proto2 = SvelteComponent.prototype;

    _proto2.$destroy = function $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    };

    _proto2.$on = function $on(type, callback) {
      var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return function () {
        var index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    };

    _proto2.$set = function $set() {// overridden by instance, if it has props
    };

    return SvelteComponent;
  }();

  var faBatteryFull={prefix:"fad",iconName:"battery-full",icon:[640,512,[],"f240",["M616 160h-8v-16a48 48 0 0 0-48-48H48a48 48 0 0 0-48 48v224a48 48 0 0 0 48 48h512a48 48 0 0 0 48-48v-16h8a24 24 0 0 0 24-24V184a24 24 0 0 0-24-24zm-40 128h-32v64H64V160h480v64h32z","M512 320H96V192h416z"]]};var faBatteryQuarter={prefix:"fad",iconName:"battery-quarter",icon:[640,512,[],"f243",["M616 160h-8v-16a48 48 0 0 0-48-48H48a48 48 0 0 0-48 48v224a48 48 0 0 0 48 48h512a48 48 0 0 0 48-48v-16h8a24 24 0 0 0 24-24V184a24 24 0 0 0-24-24zm-40 128h-32v64H64V160h480v64h32z","M224 320H96V192h128z"]]};var faBirthdayCake={prefix:"fad",iconName:"birthday-cake",icon:[448,512,[],"f1fd",["M373.5 384c-28 0-31.39 32-74.75 32-43.55 0-46.6-32-74.75-32-27.28 0-31.66 32-74.5 32-43.5 0-46.8-32-74.75-32S43.36 416 0 416v96h448v-96c-43.25 0-47-32-74.5-32zM96 96c17.75 0 32-13.5 32-40S108 0 96 0c0 41-32 33-32 64a31.9 31.9 0 0 0 32 32zm128 0c17.75 0 32-13.5 32-40S236 0 224 0c0 41-32 33-32 64a31.9 31.9 0 0 0 32 32zm128 0c17.75 0 32-13.5 32-40S364 0 352 0c0 41-32 33-32 64a31.9 31.9 0 0 0 32 32z","M448 384c-28 0-31.26-32-74.5-32-43.43 0-46.83 32-74.75 32-27.7 0-31.45-32-74.75-32-42.84 0-47.22 32-74.5 32-28.15 0-31.2-32-74.75-32S28.1 384 0 384v-80a48 48 0 0 1 48-48h16V112h64v144h64V112h64v144h64V112h64v144h16a48 48 0 0 1 48 48z"]]};var faBook={prefix:"fad",iconName:"book",icon:[448,512,[],"f02d",["M96 448c-19.2 0-32-12.8-32-32s16-32 32-32h319.33c-1.93 16.24-1.76 48.38.53 64z","M96 384h328a24 24 0 0 0 24-24V32a32 32 0 0 0-32-32H96A96 96 0 0 0 0 96v320a96 96 0 0 0 96 96h328a24 24 0 0 0 24-24v-16a24 24 0 0 0-24-24H96c-19.2 0-32-12.8-32-32s16-32 32-32zm32-250a6 6 0 0 1 6-6h212a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H134a6 6 0 0 1-6-6zm0 64a6 6 0 0 1 6-6h212a6 6 0 0 1 6 6v20a6 6 0 0 1-6 6H134a6 6 0 0 1-6-6z"]]};var faBookMedical={prefix:"fad",iconName:"book-medical",icon:[448,512,[],"f7e6",["M96 448c-19.2 0-32-12.8-32-32s16-32 32-32h319.33c-1.93 16.24-1.76 48.38.53 64z","M96 384h328a24 24 0 0 0 24-24V32a32 32 0 0 0-32-32H96A96 96 0 0 0 0 96v320a96 96 0 0 0 96 96h328a24 24 0 0 0 24-24v-16a24 24 0 0 0-24-24H96c-19.2 0-32-12.8-32-32s16-32 32-32zm48-216a8 8 0 0 1 8-8h56v-56a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v56h56a8 8 0 0 1 8 8v48a8 8 0 0 1-8 8h-56v56a8 8 0 0 1-8 8h-48a8 8 0 0 1-8-8v-56h-56a8 8 0 0 1-8-8z"]]};var faBookSpells={prefix:"fad",iconName:"book-spells",icon:[448,512,[],"f6b8",["M96 448c-19.2 0-32-12.8-32-32s16-32 32-32h319.33c-1.93 16.24-1.76 48.38.53 64z","M96 384h328a24 24 0 0 0 24-24V32a32 32 0 0 0-32-32H96A96 96 0 0 0 0 96v320a96 96 0 0 0 96 96h328a24 24 0 0 0 24-24v-16a24 24 0 0 0-24-24H96c-19.2 0-32-12.8-32-32s16-32 32-32zm176-224l26.66 53.33L352 240l-53.34 26.67L272 320l-26.66-53.33L192 240l53.34-26.67zM160 96l16-32 16 32 32 16-32 16-16 32-16-32-32-16z"]]};var faBookUser={prefix:"fad",iconName:"book-user",icon:[448,512,[],"f7e7",["M96 448c-19.2 0-32-12.8-32-32s16-32 32-32h319.33c-1.93 16.24-1.76 48.38.53 64z","M96 384h328a24 24 0 0 0 24-24V32a32 32 0 0 0-32-32H96A96 96 0 0 0 0 96v320a96 96 0 0 0 96 96h328a24 24 0 0 0 24-24v-16a24 24 0 0 0-24-24H96c-19.2 0-32-12.8-32-32s16-32 32-32zM240 64a64 64 0 1 1-64 64 64 64 0 0 1 64-64zM128 281.6c0-31.81 30.09-57.6 67.2-57.6h5a103.22 103.22 0 0 0 79.7 0h5c37.11 0 67.2 25.79 67.2 57.6v19.2c0 10.61-10 19.2-22.4 19.2H150.4c-12.4 0-22.4-8.6-22.4-19.2z"]]};var faBusAlt={prefix:"fad",iconName:"bus-alt",icon:[512,512,[],"f55e",["M96 160v96a32 32 0 0 0 32 32h112V128H128a32 32 0 0 0-32 32zm320 96v-96a32 32 0 0 0-32-32H272v160h112a32 32 0 0 0 32-32zM64 480a32 32 0 0 0 32 32h32a32 32 0 0 0 32-32v-32H64zm288-32v32a32 32 0 0 0 32 32h32a32 32 0 0 0 32-32v-32z","M488 128h-8V80c0-44.8-99.2-80-224-80S32 35.2 32 80v48h-8a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24h8v160a32 32 0 0 0 32 32h384a32 32 0 0 0 32-32V256h8a24 24 0 0 0 24-24v-80a24 24 0 0 0-24-24zM112 400a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm128-112H128a32 32 0 0 1-32-32v-96a32 32 0 0 1 32-32h112zM168 96a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h176a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H168zm104 32h112a32 32 0 0 1 32 32v96a32 32 0 0 1-32 32H272zm128 272a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"]]};var faCamera={prefix:"fad",iconName:"camera",icon:[512,512,[],"f030",["M344 288a88 88 0 1 1-88-88 88.13 88.13 0 0 1 88 88z","M464 96h-88l-12.4-32.9A47.93 47.93 0 0 0 318.7 32H193.2a47.93 47.93 0 0 0-44.9 31.1L136 96H48a48 48 0 0 0-48 48v288a48 48 0 0 0 48 48h416a48 48 0 0 0 48-48V144a48 48 0 0 0-48-48zM256 408a120 120 0 1 1 120-120 120.1 120.1 0 0 1-120 120z"]]};var faCampfire={prefix:"fad",iconName:"campfire",icon:[512,512,[],"f6ba",["M320 32a377.71 377.71 0 0 0-36.14 37.48A489.51 489.51 0 0 0 220 0c-63.17 57-108 131.22-108 176a144 144 0 0 0 288 0c0-33.29-33.42-102-80-144zm-16.79 208.57A79.7 79.7 0 0 1 256 256c-44.11 0-80-30.49-80-80 0-24.66 14.86-46.39 44.5-83.52 4.23 5.09 60.42 80.06 60.42 80.06l35.84-42.72c2.53 4.37 4.83 8.65 6.89 12.76 16.71 33.33 9.66 75.99-20.44 97.99z","M511.28 470.21l-9.35 30.55a15.61 15.61 0 0 1-19.62 10.5L256 439 29.69 511.26a15.61 15.61 0 0 1-19.62-10.5L.72 470.21a16.06 16.06 0 0 1 10.28-20l140-44.68-140-44.72a16.06 16.06 0 0 1-10.28-20l9.35-30.55a15.61 15.61 0 0 1 19.62-10.5L256 372l226.31-72.24a15.61 15.61 0 0 1 19.62 10.5l9.35 30.55a16.06 16.06 0 0 1-10.28 20l-140 44.68 140 44.68a16.06 16.06 0 0 1 10.28 20.04z"]]};var faCog={prefix:"fad",iconName:"cog",icon:[512,512,[],"f013",["M487.75 315.6l-42.6-24.6a192.62 192.62 0 0 0 0-70.2l42.6-24.6a12.11 12.11 0 0 0 5.5-14 249.2 249.2 0 0 0-54.7-94.6 12 12 0 0 0-14.8-2.3l-42.6 24.6a188.83 188.83 0 0 0-60.8-35.1V25.7A12 12 0 0 0 311 14a251.43 251.43 0 0 0-109.2 0 12 12 0 0 0-9.4 11.7v49.2a194.59 194.59 0 0 0-60.8 35.1L89.05 85.4a11.88 11.88 0 0 0-14.8 2.3 247.66 247.66 0 0 0-54.7 94.6 12 12 0 0 0 5.5 14l42.6 24.6a192.62 192.62 0 0 0 0 70.2l-42.6 24.6a12.08 12.08 0 0 0-5.5 14 249 249 0 0 0 54.7 94.6 12 12 0 0 0 14.8 2.3l42.6-24.6a188.54 188.54 0 0 0 60.8 35.1v49.2a12 12 0 0 0 9.4 11.7 251.43 251.43 0 0 0 109.2 0 12 12 0 0 0 9.4-11.7v-49.2a194.7 194.7 0 0 0 60.8-35.1l42.6 24.6a11.89 11.89 0 0 0 14.8-2.3 247.52 247.52 0 0 0 54.7-94.6 12.36 12.36 0 0 0-5.6-14.1zm-231.4 36.2a95.9 95.9 0 1 1 95.9-95.9 95.89 95.89 0 0 1-95.9 95.9z","M256.35 319.8a63.9 63.9 0 1 1 63.9-63.9 63.9 63.9 0 0 1-63.9 63.9z"]]};var faCookieBite={prefix:"fad",iconName:"cookie-bite",icon:[512,512,[],"f564",["M510.52 255.81A127.93 127.93 0 0 1 384.05 128 127.92 127.92 0 0 1 256.19 1.51a132 132 0 0 0-79.72 12.81l-69.13 35.22a132.32 132.32 0 0 0-57.79 57.81l-35.1 68.88a132.64 132.64 0 0 0-12.82 81l12.08 76.27a132.56 132.56 0 0 0 37.16 73l54.77 54.76a132.1 132.1 0 0 0 72.71 37.06l76.71 12.15a131.92 131.92 0 0 0 80.53-12.76l69.13-35.21a132.32 132.32 0 0 0 57.79-57.81l35.1-68.88a132.59 132.59 0 0 0 12.91-80zM176 368a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm32-160a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm160 128a32 32 0 1 1 32-32 32 32 0 0 1-32 32z","M368 272a32 32 0 1 0 32 32 32 32 0 0 0-32-32zM208 144a32 32 0 1 0 32 32 32 32 0 0 0-32-32zm-32 160a32 32 0 1 0 32 32 32 32 0 0 0-32-32z"]]};var faCorn={prefix:"fad",iconName:"corn",icon:[512,512,[],"f6c7",["M206.68 111.08a39.13 39.13 0 0 1 45.42-13 40.21 40.21 0 0 1 57.28-32.95 39.86 39.86 0 0 1 61.13-26.57A40.07 40.07 0 0 1 398 11.7a39.12 39.12 0 0 1 38.41 9.6 40.13 40.13 0 0 1 75.51 20.8v3.2a40.51 40.51 0 0 1-22.1 34.53 40.33 40.33 0 0 1 9 38.41 41.29 41.29 0 0 1-27.2 27.19 39.49 39.49 0 0 1 2.88 37.77 40.2 40.2 0 0 1-30.08 23.05 39 39 0 0 1-1.59 37.44 39.79 39.79 0 0 1-31.69 19.85 39.15 39.15 0 0 1-4.79 36.8 39.86 39.86 0 0 1-4.87 5.31c-51.23-28.5-110.09-37.49-166.48-28.13a256.52 256.52 0 0 0-28.32-166.44z","M423.85 360c-88-76.52-221.49-72.92-305.21 10.79l-67.88 67.83L96 483.88a96 96 0 0 0 135.76 0l90.51-90.51 97.66-19.53c6.44-1.29 8.86-9.59 3.92-13.84zM201 284.85c15.42-67.76-.79-141.26-49-196.71-4.29-4.94-12.58-2.51-13.87 3.91l-19.54 97.68-90.47 90.51a96 96 0 0 0 0 135.77L96 348.12a254.29 254.29 0 0 1 105-63.27z"]]};var faCrow={prefix:"fad",iconName:"crow",icon:[640,512,[],"f520",["M447.27 487.67a12 12 0 0 1-7.17 15.38l-22.55 8.21a12 12 0 0 1-15.38-7.17l-44.65-120.17a192 192 0 0 0 48.73-7.7zM312.87 384H261l45.22 120.1a12 12 0 0 0 15.38 7.17l22.55-8.21a12 12 0 0 0 7.17-15.38zM640 96c0-35.35-43-64-96-64h-16a79.67 79.67 0 0 1 16 48v32z","M464 0a80 80 0 0 0-80 80v21L12.09 393.57a30.22 30.22 0 0 0 31.64 51.2L165.27 384H352c106 0 192-86 192-192V80a80 80 0 0 0-80-80zm0 104a24 24 0 1 1 24-24 24 24 0 0 1-24 24z"]]};var faEar={prefix:"fad",iconName:"ear",icon:[384,512,[],"f5f0",["M192 0C86 0 0 86 0 192v176a144 144 0 0 0 288 0v-9.9c57.33-33.21 96-95.1 96-166.1C384 86 298 0 192 0zm128 200a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8v-8a96 96 0 0 0-192 0 32 32 0 0 0 32 32h32a64 64 0 0 1 0 128h-8a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h8a32 32 0 0 0 0-64h-32a64.06 64.06 0 0 1-64-64 128 128 0 0 1 256 0z","M320 200a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8v-8a96 96 0 0 0-192 0 32 32 0 0 0 32 32h32a64 64 0 0 1 0 128h-8a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h8a32 32 0 0 0 0-64h-32a64.06 64.06 0 0 1-64-64 128 128 0 0 1 256 0z"]]};var faFileExclamation={prefix:"fad",iconName:"file-exclamation",icon:[384,512,[],"f31a",["M224 136V0H24A23.94 23.94 0 0 0 0 24v464a23.94 23.94 0 0 0 24 24h336a23.94 23.94 0 0 0 24-24V160H248a24.07 24.07 0 0 1-24-24zm153-31L279.1 7a24 24 0 0 0-17-7H256v128h128v-6.1a23.92 23.92 0 0 0-7-16.9z","M160 332.8a12 12 0 0 0 12 11.2h40a12 12 0 0 0 12-11.2l7.2-112a12 12 0 0 0-12-12.8h-54.4a12 12 0 0 0-12 12.8zm32 27.2a40 40 0 1 0 40 40 40 40 0 0 0-40-40z"]]};var faFilePlus={prefix:"fad",iconName:"file-plus",icon:[384,512,[],"f319",["M224 136V0H24A23.94 23.94 0 0 0 0 24v464a23.94 23.94 0 0 0 24 24h336a23.94 23.94 0 0 0 24-24V160H248a24.07 24.07 0 0 1-24-24zm153-31L279.1 7a24 24 0 0 0-17-7H256v128h128v-6.1a23.92 23.92 0 0 0-7-16.9z","M296 340a12 12 0 0 1-12 12h-60v60a12 12 0 0 1-12 12h-40a12 12 0 0 1-12-12v-60h-60a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h60v-60a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12v60h60a12 12 0 0 1 12 12z"]]};var faFileTimes={prefix:"fad",iconName:"file-times",icon:[384,512,[],"f317",["M224 136V0H24A23.94 23.94 0 0 0 0 24v464a23.94 23.94 0 0 0 24 24h336a23.94 23.94 0 0 0 24-24V160H248a24.07 24.07 0 0 1-24-24zm33.1 90.6l28.3 28.3a12 12 0 0 1 0 17L237.3 320l48.1 48.1a12 12 0 0 1 0 17l-28.3 28.3a12 12 0 0 1-17 0L192 365.3l-48.1 48.1a12 12 0 0 1-17 0l-28.3-28.3a12 12 0 0 1 0-17l48.1-48.1-48.1-48.1a12 12 0 0 1 0-17l28.3-28.3a12 12 0 0 1 17 0l48.1 48.1 48.1-48.1a12 12 0 0 1 17 0zM384 121.9v6.1H256V0h6.1a24 24 0 0 1 17 7l97.9 98a23.92 23.92 0 0 1 7 16.9z","M98.6 271.9a12 12 0 0 1 0-17l28.3-28.3a12 12 0 0 1 17 0l48.1 48.1 48.1-48.1a12 12 0 0 1 17 0l28.3 28.3a12 12 0 0 1 0 17L237.3 320l48.1 48.1a12 12 0 0 1 0 17l-28.3 28.3a12 12 0 0 1-17 0L192 365.3l-48.1 48.1a12 12 0 0 1-17 0l-28.3-28.3a12 12 0 0 1 0-17l48.1-48.1z"]]};var faFillDrip={prefix:"fad",iconName:"fill-drip",icon:[576,512,[],"f576",["M387.39 288L236.78 438.61a32 32 0 0 1-45.22 0L74.37 321.4A31.86 31.86 0 0 1 65 298.78 32.59 32.59 0 0 1 66.87 288zM512 320s-64 92.65-64 128a64 64 0 0 0 128 0c0-35.35-64-128-64-128z","M503.63 217L295.94 9.34a32 32 0 0 0-45.25 0l-81.58 81.58L82.93 4.73a16 16 0 0 0-22.62 0L37.69 27.35a16 16 0 0 0 0 22.62l86.19 86.18-94.76 94.76a96 96 0 0 0 0 135.75l117.19 117.19a96 96 0 0 0 135.74 0l221.57-221.57a32 32 0 0 0 .01-45.28zM236.78 438.61a32 32 0 0 1-45.22 0L74.37 321.4a32 32 0 0 1 0-45.24l94.75-94.74 58.6 58.58A32 32 0 0 0 273 194.77l-58.6-58.6 58.92-58.93 162.42 162.41z"]]};var faFireAlt={prefix:"fad",iconName:"fire-alt",icon:[448,512,[],"f7e4",["M323.56 51.2a597.38 597.38 0 0 0-56.22 60C240.08 73.62 206.28 35.53 168 0 69.74 91.17 0 210 0 281.6 0 408.85 100.29 512 224 512s224-103.15 224-230.4c0-53.27-52-163.14-124.44-230.4zm-1.12 366.87A165.81 165.81 0 0 1 226.86 448c-43.93 0-84.43-14.89-114.06-41.92a146.18 146.18 0 0 1-35.88-50.39C68.35 335.82 64 314 64 290.75c0-59.43 42.8-106.39 104.3-180.12 30 34.59 18.49 19.78 100.7 124.59l62-70.74c24.32 40.25 27.78 45.59 34.84 59.1a157.93 157.93 0 0 1 15 104.62c-7.49 36.85-28.24 68.8-58.4 89.87z","M304.09 391.85A134.39 134.39 0 0 1 226.86 416C154.71 416 96 368.26 96 290.75c0-38.61 24.31-72.63 72.79-130.75 6.93 8 98.83 125.34 98.83 125.34l58.63-66.88c4.14 6.85 7.91 13.55 11.27 20 27.35 52.19 15.81 119-33.43 153.42z"]]};var faFlag={prefix:"fad",iconName:"flag",icon:[512,512,[],"f024",["M512 91.33v277c0 11.31-7.1 21.88-18.5 26.47C317.7 465 281.7 331.25 96 416V102a56.57 56.57 0 0 0 14.64-15c194.19-74.48 184.75 58.25 352-20.08C485.2 56.31 512 68.26 512 91.33z","M120 56a55.93 55.93 0 0 1-24 46v388a22 22 0 0 1-22 22H54a22 22 0 0 1-22-22V102a56 56 0 1 1 88-46z"]]};var faFlaskPotion={prefix:"fad",iconName:"flask-potion",icon:[448,512,[],"f6e1",["M80 352a153.32 153.32 0 0 1 1.92-24.48c61.84-24.46 131.66-20.73 181 4 36.58 18.29 78.13 20.41 105 20.56v3.23a143.78 143.78 0 0 1-36.6 92.69 1.44 1.44 0 0 1-.34 0H116.7A143.57 143.57 0 0 1 80 352z","M320 169.05V96h-64v111.3c24.51 13.18 114.11 49.87 112 148a143.78 143.78 0 0 1-36.68 92.7 1.44 1.44 0 0 1-.34 0H116.7A143.57 143.57 0 0 1 80 352c0-99.51 88.32-132.74 112-145.13V96h-64v72.12C61.61 202.85 16 271.88 16 352a207.13 207.13 0 0 0 53.94 139.7c12 13.17 29.22 20.3 47 20.3H331a64 64 0 0 0 47.58-20.85A207.15 207.15 0 0 0 432 356.67c1.71-79.95-44.81-151.49-112-187.62zM112 64h224a16 16 0 0 0 16-16V16a16 16 0 0 0-16-16H112a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16z"]]};var faHatWizard={prefix:"fad",iconName:"hat-wizard",icon:[576,512,[],"f6e8",["M544 464v32a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16h480a16 16 0 0 1 16 16z","M272 416h208l-86.41-201.63a64 64 0 0 1-1.89-45.45L448 0 260.42 107.19A128 128 0 0 0 207 166.34L96 416h144l-16-32-64-32 64-32 32-64 32 64 64 32-64 32zm48-224l-16 32-16-32-32-16 32-16 16-32 16 32 32 16z"]]};var faHome={prefix:"fad",iconName:"home",icon:[576,512,[],"f015",["M336 463.59V368a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v95.71a16 16 0 0 1-15.92 16L112 480a16 16 0 0 1-16-16V300.06l184.39-151.85a12.19 12.19 0 0 1 15.3 0L480 300v164a16 16 0 0 1-16 16l-112-.31a16 16 0 0 1-16-16.1z","M573.32 268.35l-25.5 31a12 12 0 0 1-16.9 1.65L295.69 107.21a12.19 12.19 0 0 0-15.3 0L45.17 301a12 12 0 0 1-16.89-1.65l-25.5-31a12 12 0 0 1 1.61-16.89L257.49 43a48 48 0 0 1 61 0L408 116.61V44a12 12 0 0 1 12-12h56a12 12 0 0 1 12 12v138.51l83.6 68.91a12 12 0 0 1 1.72 16.93z"]]};var faMagic={prefix:"fad",iconName:"magic",icon:[512,512,[],"f0d0",["M80 0L53.34 53.33 0 80l53.34 26.67L80 160l26.66-53.33L160 80l-53.34-26.67zm192 48l-32-16-16-32-16 32-32 16 32 16 16 32 16-32zm186.66 293.33L432 288l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368zM399 243.07l86.6-86.55 17-17a32 32 0 0 0 0-45.26l-17-17-50.86-50.86-17-17a32 32 0 0 0-45.25 0l-17 17L269 112.94l-39.62 39.6 39.61 39.61 50.91 50.91 39.59 39.58zm-90.5-90.52L395.14 66l50.91 50.91-86.6 86.55z","M359.44 282.64l-220 220a32 32 0 0 1-45.25 0L9.38 417.77a32 32 0 0 1 0-45.25l220-220z"]]};var faScarf={prefix:"fad",iconName:"scarf",icon:[512,512,[],"f7c1",["M509.72 395.71l-117.39-117.1-22.61 22.6L487 418.31a8 8 0 0 0 11.3 0L509.62 407a7.92 7.92 0 0 0 .1-11.29zm-207.89-26.8l-22.61 22.6 117.4 117.2a8 8 0 0 0 11.3 0l11.3-11.3a8 8 0 0 0 0-11.3zM166 323.71L47.62 441.91a8 8 0 0 0 0 11.3l11.3 11.3a8 8 0 0 0 11.3 0l118.4-118.2zm-45.31-45.1L2.33 396.71a8 8 0 0 0 0 11.3l11.29 11.3a8 8 0 0 0 11.3 0l118.41-118.2zM347 323.71l-22.61 22.6 117.41 117.2a8 8 0 0 0 11.29 0l11.3-11.3a8 8 0 0 0 0-11.3zM92.92 487.11a8 8 0 0 0 0 11.3l11.3 11.3a8 8 0 0 0 11.31 0l118.39-118.2-22.59-22.6z","M279.12 120.51l19.5-19.4a185.4 185.4 0 0 0-84.4-.2L369.62 256 256.53 369.11l-135.1-140.7c-48.6-53.7-13-113.3-11.5-115.8l43.6-73.1a56.71 56.71 0 0 1 16.8-18c44-29.7 130.7-27.6 171.3-.1a56.71 56.71 0 0 1 16.8 18l43.7 73.4c7.2 12 33.4 65.6-13.2 117.3z"]]};var faToggleOff={prefix:"fad",iconName:"toggle-off",icon:[576,512,[],"f204",["M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zM192 384a128 128 0 1 1 128-128 127.93 127.93 0 0 1-128 128z","M192 384a128 128 0 1 1 128-128 127.93 127.93 0 0 1-128 128z"]]};var faToggleOn={prefix:"fad",iconName:"toggle-on",icon:[576,512,[],"f205",["M384 384a128 128 0 1 1 128-128 127.93 127.93 0 0 1-128 128z","M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320a128 128 0 1 1 128-128 127.93 127.93 0 0 1-128 128z"]]};var faWandMagic={prefix:"fad",iconName:"wand-magic",icon:[512,512,[],"f72b",["M416 176v-28l-39.65 44H400a16 16 0 0 0 16-16zm-288 96v36.87L186.6 256H144a16 16 0 0 0-16 16zM106.66 53.33L80 0 53.34 53.34 0 80l53.34 26.67L80 160l26.66-53.33L160 80zm352 288L432 288l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368zM224 0l-16 32-32 16 32 16 16 32 16-32 32-16-32-16z","M507.87 46.18L97.16 501.44A32 32 0 0 1 52 503.71q-.6-.54-1.17-1.11L9.37 461.17a32 32 0 0 1 0-45.25c.38-.38.77-.75 1.16-1.11L465.79 4.11a16 16 0 0 1 22 .55l19.48 19.47a16 16 0 0 1 .6 22.05z"]]};

  function add_css() {
    var style = element("style");
    style.id = 'svelte-1a2mimh-style';
    style.textContent = ".hue.svelte-1a2mimh{color:#238ae6;animation:svelte-1a2mimh-hue 30s infinite linear}@keyframes svelte-1a2mimh-hue{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(-360deg)}}";
    append(document.head, style);
  }

  function get_each_context(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.icon = list[i];
    child_ctx.name = i;
    return child_ctx;
  }

  function get_each_context_1(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.f = list[i];
    return child_ctx;
  }

  function get_each_context_2(ctx, list, i) {
    var child_ctx = Object.create(ctx);
    child_ctx.p = list[i];
    return child_ctx;
  } // (75:14) {#each pull as p (p)}


  function create_each_block_2(key_1, ctx) {
    var button,
        t0_value = ctx.p,
        t0,
        t1,
        button_class_value,
        dispose;

    function click_handler() {
      return ctx.click_handler(ctx);
    }

    return {
      key: key_1,
      first: null,
      c: function c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = space();
        attr(button, "class", button_class_value = "" + null_to_empty("btn btn-" + (ctx.model.pull == (ctx.p == 'None' ? ctx.undefined : ctx.p.toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh");
        attr(button, "type", "button");
        dispose = listen(button, "click", click_handler);
        this.first = button;
      },
      m: function m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);
      },
      p: function p(changed, new_ctx) {
        ctx = new_ctx;

        if (changed.model && button_class_value !== (button_class_value = "" + null_to_empty("btn btn-" + (ctx.model.pull == (ctx.p == 'None' ? ctx.undefined : ctx.p.toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh")) {
          attr(button, "class", button_class_value);
        }
      },
      d: function d(detaching) {
        if (detaching) {
          detach(button);
        }

        dispose();
      }
    };
  } // (95:14) {#each flip as f (f)}


  function create_each_block_1(key_1, ctx) {
    var button,
        t0_value = ctx.f,
        t0,
        t1,
        button_class_value,
        dispose;

    function click_handler_1() {
      return ctx.click_handler_1(ctx);
    }

    return {
      key: key_1,
      first: null,
      c: function c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = space();
        attr(button, "class", button_class_value = "" + null_to_empty("btn btn-" + (ctx.model.flip == (ctx.f == 'None' ? ctx.undefined : ctx.f.toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh");
        attr(button, "type", "button");
        dispose = listen(button, "click", click_handler_1);
        this.first = button;
      },
      m: function m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);
      },
      p: function p(changed, new_ctx) {
        ctx = new_ctx;

        if (changed.model && button_class_value !== (button_class_value = "" + null_to_empty("btn btn-" + (ctx.model.flip == (ctx.f == 'None' ? ctx.undefined : ctx.f.toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh")) {
          attr(button, "class", button_class_value);
        }
      },
      d: function d(detaching) {
        if (detaching) {
          detach(button);
        }

        dispose();
      }
    };
  } // (130:6) {#each icons as icon, name}


  function create_each_block(ctx) {
    var div, t, current;
    var fa = new Fa({
      props: {
        icon: ctx.icon,
        flip: ctx.model.flip,
        pull: ctx.model.pull,
        rotate: ctx.model.rotate,
        size: ctx.model.size + "x"
      }
    });
    return {
      c: function c() {
        div = element("div");
        fa.$$.fragment.c();
        t = space();
        attr(div, "class", "col text-center hue svelte-1a2mimh");
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        mount_component(fa, div, null);
        append(div, t);
        current = true;
      },
      p: function p(changed, ctx) {
        var fa_changes = {};
        if (changed.icons) fa_changes.icon = ctx.icon;
        if (changed.model) fa_changes.flip = ctx.model.flip;
        if (changed.model) fa_changes.pull = ctx.model.pull;
        if (changed.model) fa_changes.rotate = ctx.model.rotate;
        if (changed.model) fa_changes.size = ctx.model.size + "x";
        fa.$set(fa_changes);
      },
      i: function i(local) {
        if (current) return;
        transition_in(fa.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(fa.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) {
          detach(div);
        }

        destroy_component(fa);
      }
    };
  }

  function create_fragment(ctx) {
    var div19,
        div18,
        div16,
        h1,
        t1,
        p,
        t7,
        form,
        div4,
        label0,
        t9,
        div3,
        div0,
        input0,
        t10,
        div2,
        div1,
        t11_value = ctx.model.size,
        t11,
        t12,
        t13,
        div7,
        label1,
        t15,
        div6,
        div5,
        each_blocks_2 = [],
        each0_lookup = new Map(),
        t16,
        div10,
        label2,
        t18,
        div9,
        div8,
        each_blocks_1 = [],
        each1_lookup = new Map(),
        t19,
        div15,
        label3,
        t21,
        div14,
        div11,
        input1,
        t22,
        div13,
        div12,
        t23_value = ctx.model.rotate,
        t23,
        t24,
        t25,
        div17,
        current,
        dispose;
    var each_value_2 = ctx.pull;

    var get_key = function get_key(ctx) {
      return ctx.p;
    };

    for (var i = 0; i < each_value_2.length; i += 1) {
      var child_ctx = get_each_context_2(ctx, each_value_2, i);
      var key = get_key(child_ctx);
      each0_lookup.set(key, each_blocks_2[i] = create_each_block_2(key, child_ctx));
    }

    var each_value_1 = ctx.flip;

    var get_key_1 = function get_key_1(ctx) {
      return ctx.f;
    };

    for (var i = 0; i < each_value_1.length; i += 1) {
      var _child_ctx = get_each_context_1(ctx, each_value_1, i);

      var _key = get_key_1(_child_ctx);

      each1_lookup.set(_key, each_blocks_1[i] = create_each_block_1(_key, _child_ctx));
    }

    var each_value = ctx.icons;
    var each_blocks = [];

    for (var i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }

    var out = function out(i) {
      return transition_out(each_blocks[i], 1, 1, function () {
        each_blocks[i] = null;
      });
    };

    return {
      c: function c() {
        div19 = element("div");
        div18 = element("div");
        div16 = element("div");
        h1 = element("h1");
        h1.innerHTML = "<strong>svelte-fa</strong>";
        t1 = space();
        p = element("p");
        p.innerHTML = "\n\t\t\t        Tiny <a href=\"https://fontawesome.com/\" target=\"_blank\">FontAwesome 5</a> component for <a href=\"https://svelte.dev/\" target=\"_blank\">Svelte</a>.\n\t\t\t      ";
        t7 = space();
        form = element("form");
        div4 = element("div");
        label0 = element("label");
        label0.textContent = "Icon Sizes";
        t9 = space();
        div3 = element("div");
        div0 = element("div");
        input0 = element("input");
        t10 = space();
        div2 = element("div");
        div1 = element("div");
        t11 = text(t11_value);
        t12 = text("x");
        t13 = space();
        div7 = element("div");
        label1 = element("label");
        label1.textContent = "Pulled Icons";
        t15 = space();
        div6 = element("div");
        div5 = element("div");

        for (i = 0; i < each_blocks_2.length; i += 1) {
          each_blocks_2[i].c();
        }

        t16 = space();
        div10 = element("div");
        label2 = element("label");
        label2.textContent = "Flip";
        t18 = space();
        div9 = element("div");
        div8 = element("div");

        for (i = 0; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].c();
        }

        t19 = space();
        div15 = element("div");
        label3 = element("label");
        label3.textContent = "Rotate";
        t21 = space();
        div14 = element("div");
        div11 = element("div");
        input1 = element("input");
        t22 = space();
        div13 = element("div");
        div12 = element("div");
        t23 = text(t23_value);
        t24 = text("deg");
        t25 = space();
        div17 = element("div");

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        attr(h1, "class", "hue svelte-1a2mimh");
        attr(p, "class", "lead mb-5");
        attr(label0, "class", "col-sm-3 col-form-label");
        set_input_type(input0, "range");
        attr(input0, "class", "form-control-range");
        attr(input0, "min", "1");
        attr(input0, "max", "10");
        attr(input0, "step", "0.1");
        attr(div0, "class", "col-md-8 py-2");
        attr(div1, "class", "form-control text-center");
        attr(div2, "class", "col-md-4");
        attr(div3, "class", "col-sm-9 row");
        attr(div4, "class", "form-group row");
        attr(label1, "class", "col-sm-3 col-form-label");
        attr(div5, "class", "btn-group");
        attr(div5, "role", "group");
        attr(div5, "aria-label", "Basic example");
        attr(div6, "class", "col-sm-9");
        attr(div7, "class", "form-group row");
        attr(label2, "class", "col-sm-3 col-form-label");
        attr(div8, "class", "btn-group");
        attr(div8, "role", "group");
        attr(div8, "aria-label", "Basic example");
        attr(div9, "class", "col-sm-9");
        attr(div10, "class", "form-group row");
        attr(label3, "class", "col-sm-3 col-form-label");
        set_input_type(input1, "range");
        attr(input1, "class", "form-control-range");
        attr(input1, "min", "-360");
        attr(input1, "max", "360");
        attr(input1, "step", "1");
        attr(div11, "class", "col-md-8 py-2");
        attr(div12, "class", "form-control text-center");
        attr(div13, "class", "col-md-4");
        attr(div14, "class", "col-sm-9 row");
        attr(div15, "class", "form-group row");
        attr(div16, "class", "col-md");
        attr(div17, "class", "col-md row");
        attr(div18, "class", "row");
        attr(div19, "class", "jumbotron");
        dispose = [listen(input0, "change", ctx.input0_change_input_handler), listen(input0, "input", ctx.input0_change_input_handler), listen(input1, "change", ctx.input1_change_input_handler), listen(input1, "input", ctx.input1_change_input_handler), listen(form, "submit", prevent_default(ctx.submit_handler))];
      },
      m: function m(target, anchor) {
        insert(target, div19, anchor);
        append(div19, div18);
        append(div18, div16);
        append(div16, h1);
        append(div16, t1);
        append(div16, p);
        append(div16, t7);
        append(div16, form);
        append(form, div4);
        append(div4, label0);
        append(div4, t9);
        append(div4, div3);
        append(div3, div0);
        append(div0, input0);
        input0.value = ctx.model.size;
        append(div3, t10);
        append(div3, div2);
        append(div2, div1);
        append(div1, t11);
        append(div1, t12);
        append(form, t13);
        append(form, div7);
        append(div7, label1);
        append(div7, t15);
        append(div7, div6);
        append(div6, div5);

        for (i = 0; i < each_blocks_2.length; i += 1) {
          each_blocks_2[i].m(div5, null);
        }

        append(form, t16);
        append(form, div10);
        append(div10, label2);
        append(div10, t18);
        append(div10, div9);
        append(div9, div8);

        for (i = 0; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].m(div8, null);
        }

        append(form, t19);
        append(form, div15);
        append(div15, label3);
        append(div15, t21);
        append(div15, div14);
        append(div14, div11);
        append(div11, input1);
        input1.value = ctx.model.rotate;
        append(div14, t22);
        append(div14, div13);
        append(div13, div12);
        append(div12, t23);
        append(div12, t24);
        append(div18, t25);
        append(div18, div17);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div17, null);
        }

        current = true;
      },
      p: function p(changed, ctx) {
        if (changed.model) input0.value = ctx.model.size;

        if ((!current || changed.model) && t11_value !== (t11_value = ctx.model.size)) {
          set_data(t11, t11_value);
        }

        var each_value_2 = ctx.pull;
        each_blocks_2 = update_keyed_each(each_blocks_2, changed, get_key, 1, ctx, each_value_2, each0_lookup, div5, destroy_block, create_each_block_2, null, get_each_context_2);
        var each_value_1 = ctx.flip;
        each_blocks_1 = update_keyed_each(each_blocks_1, changed, get_key_1, 1, ctx, each_value_1, each1_lookup, div8, destroy_block, create_each_block_1, null, get_each_context_1);
        if (changed.model) input1.value = ctx.model.rotate;

        if ((!current || changed.model) && t23_value !== (t23_value = ctx.model.rotate)) {
          set_data(t23, t23_value);
        }

        if (changed.icons || changed.model) {
          each_value = ctx.icons;

          for (var i = 0; i < each_value.length; i += 1) {
            var _child_ctx2 = get_each_context(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(changed, _child_ctx2);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block(_child_ctx2);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(div17, null);
            }
          }

          group_outros();

          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }

          check_outros();
        }
      },
      i: function i(local) {
        if (current) return;

        for (var i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }

        current = true;
      },
      o: function o(local) {
        each_blocks = each_blocks.filter(Boolean);

        for (var _i = 0; _i < each_blocks.length; _i += 1) {
          transition_out(each_blocks[_i]);
        }

        current = false;
      },
      d: function d(detaching) {
        if (detaching) {
          detach(div19);
        }

        for (i = 0; i < each_blocks_2.length; i += 1) {
          each_blocks_2[i].d();
        }

        for (i = 0; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d();
        }

        destroy_each(each_blocks, detaching);
        run_all(dispose);
      }
    };
  }

  function instance($$self, $$props, $$invalidate) {
    var model = {
      size: 5,
      pull: undefined,
      flip: undefined,
      rotate: 0
    };
    var pull = ['None', 'Left', 'Right'];
    var flip = ['None', 'Horizontal', 'Vertical', 'Both'];
    var icons = [faFlag, faHome, faCog, faMagic];

    function setValue(prop, value) {
      model[prop] = value == 'None' ? undefined : value.toLowerCase();
      $$invalidate('model', model);
    }

    function submit_handler(event) {
      bubble($$self, event);
    }

    function input0_change_input_handler() {
      model.size = to_number(this.value);
      $$invalidate('model', model);
    }

    function click_handler(_ref) {
      var p = _ref.p;
      return setValue('pull', p);
    }

    function click_handler_1(_ref2) {
      var f = _ref2.f;
      return setValue('flip', f);
    }

    function input1_change_input_handler() {
      model.rotate = to_number(this.value);
      $$invalidate('model', model);
    }

    return {
      model: model,
      pull: pull,
      flip: flip,
      icons: icons,
      setValue: setValue,
      undefined: undefined,
      submit_handler: submit_handler,
      input0_change_input_handler: input0_change_input_handler,
      click_handler: click_handler,
      click_handler_1: click_handler_1,
      input1_change_input_handler: input1_change_input_handler
    };
  }

  var Showcase =
  /*#__PURE__*/
  function (_SvelteComponent) {
    _inheritsLoose(Showcase, _SvelteComponent);

    function Showcase(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      if (!document.getElementById("svelte-1a2mimh-style")) add_css();
      init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, []);
      return _this;
    }

    return Showcase;
  }(SvelteComponent);

  var faBook$1={prefix:'fas',iconName:'book',icon:[448,512,[],"f02d","M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"]};var faCog$1={prefix:'fas',iconName:'cog',icon:[512,512,[],"f013","M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"]};var faFlag$1={prefix:'fas',iconName:'flag',icon:[512,512,[],"f024","M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z"]};var faHome$1={prefix:'fas',iconName:'home',icon:[576,512,[],"f015","M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"]};var faInfo={prefix:'fas',iconName:'info',icon:[192,512,[],"f129","M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"]};var faMagic$1={prefix:'fas',iconName:'magic',icon:[512,512,[],"f0d0","M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z"]};var faPencilAlt={prefix:'fas',iconName:'pencil-alt',icon:[512,512,[],"f303","M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"]};var faQuoteLeft={prefix:'fas',iconName:'quote-left',icon:[512,512,[],"f10d","M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"]};var faQuoteRight={prefix:'fas',iconName:'quote-right',icon:[512,512,[],"f10e","M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"]};

  function create_fragment$1(ctx) {
    var div, pre, code_1, t, code_1_class_value;
    return {
      c: function c() {
        div = element("div");
        pre = element("pre");
        code_1 = element("code");
        t = text(ctx.code);
        attr(code_1, "class", code_1_class_value = "language-" + ctx.lang);
        attr(div, "class", "shadow-sm mb-3 rounded");
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        append(div, pre);
        append(pre, code_1);
        append(code_1, t);
        ctx.code_1_binding(code_1);
      },
      p: function p(changed, ctx) {
        if (changed.code) {
          set_data(t, ctx.code);
        }

        if (changed.lang && code_1_class_value !== (code_1_class_value = "language-" + ctx.lang)) {
          attr(code_1, "class", code_1_class_value);
        }
      },
      i: noop,
      o: noop,
      d: function d(detaching) {
        if (detaching) {
          detach(div);
        }

        ctx.code_1_binding(null);
      }
    };
  }

  function instance$1($$self, $$props, $$invalidate) {
    var code = $$props.code,
        _$$props$lang = $$props.lang,
        lang = _$$props$lang === void 0 ? 'html' : _$$props$lang;
    var el;

    function highlight() {
      Prism.highlightElement(el);
    }

    afterUpdate(highlight);

    function code_1_binding($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](function () {
        $$invalidate('el', el = $$value);
      });
    }

    $$self.$set = function ($$props) {
      if ('code' in $$props) $$invalidate('code', code = $$props.code);
      if ('lang' in $$props) $$invalidate('lang', lang = $$props.lang);
    };

    $$self.$$.update = function ($$dirty) {
      if ($$dirty === void 0) {
        $$dirty = {
          el: 1,
          code: 1
        };
      }

      if ($$dirty.el || $$dirty.code) {
        el && code && highlight();
      }
    };

    return {
      code: code,
      lang: lang,
      el: el,
      code_1_binding: code_1_binding
    };
  }

  var Docs_code =
  /*#__PURE__*/
  function (_SvelteComponent) {
    _inheritsLoose(Docs_code, _SvelteComponent);

    function Docs_code(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, safe_not_equal, ["code", "lang"]);
      return _this;
    }

    return Docs_code;
  }(SvelteComponent);

  function create_fragment$2(ctx) {
    var div20, h40, t1, t2, t3, h41, t5, div0, t6, t7, t8, div2, div1, t9, t10, h42, t12, h50, t14, div3, t15, t16, t17, t18, t19, t20, t21, t22, t23, h51, t25, div9, div4, t26, t27, div5, t28, t29, div6, t30, t31, div7, t32, t33, div8, t34, t35, t36, h52, t38, div10, t39, t40, t41, t42, h43, t44, h53, t46, div11, t47, t48, t49, t50, t51, t52, t53, t54, t55, t56, h44, t58, h54, t60, div12, t61, t62, t63, t64, t65, t66, h55, t68, div13, t69, t70, t71, t72, t73, t74, t75, t76, t77, h56, t79, div14, t80, t81, t82, t83, t84, t85, div15, t86, t87, t88, t89, t90, t91, h57, t93, div16, t94, t95, t96, t97, t98, t99, t100, h58, t102, div17, t103, t104, t105, t106, t107, t108, t109, t110, t111, t112, div18, t113, t114, t115, t116, t117, t118, t119, div19, t120, t121, t122, t123, t124, t125, current;
    var docscode0 = new Docs_code({
      props: {
        code: ctx.codes.installation[0]
      }
    });
    var docscode1 = new Docs_code({
      props: {
        code: ctx.codes.installation[1],
        lang: "js"
      }
    });
    var fa0 = new Fa({
      props: {
        icon: faFlag$1
      }
    });
    var docscode2 = new Docs_code({
      props: {
        code: ctx.codes.basicUse[0]
      }
    });
    var fa1 = new Fa({
      props: {
        icon: faFlag$1
      }
    });
    var docscode3 = new Docs_code({
      props: {
        code: ctx.codes.basicUse[1]
      }
    });
    var fa2 = new Fa({
      props: {
        icon: faFlag$1,
        size: "xs"
      }
    });
    var fa3 = new Fa({
      props: {
        icon: faFlag$1,
        size: "sm"
      }
    });
    var fa4 = new Fa({
      props: {
        icon: faFlag$1,
        size: "lg"
      }
    });
    var fa5 = new Fa({
      props: {
        icon: faFlag$1,
        size: "2x"
      }
    });
    var fa6 = new Fa({
      props: {
        icon: faFlag$1,
        size: "2.5x"
      }
    });
    var fa7 = new Fa({
      props: {
        icon: faFlag$1,
        size: "5x"
      }
    });
    var fa8 = new Fa({
      props: {
        icon: faFlag$1,
        size: "7x"
      }
    });
    var fa9 = new Fa({
      props: {
        icon: faFlag$1,
        size: "10x"
      }
    });
    var docscode4 = new Docs_code({
      props: {
        code: ctx.codes.additionalStyling[0]
      }
    });
    var fa10 = new Fa({
      props: {
        icon: faHome$1,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var fa11 = new Fa({
      props: {
        icon: faInfo,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var fa12 = new Fa({
      props: {
        icon: faBook$1,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var fa13 = new Fa({
      props: {
        icon: faPencilAlt,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var fa14 = new Fa({
      props: {
        icon: faCog$1,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var docscode5 = new Docs_code({
      props: {
        code: ctx.codes.additionalStyling[1]
      }
    });
    var fa15 = new Fa({
      props: {
        icon: faQuoteLeft,
        pull: "left",
        size: "2x"
      }
    });
    var fa16 = new Fa({
      props: {
        icon: faQuoteRight,
        pull: "right",
        size: "2x"
      }
    });
    var docscode6 = new Docs_code({
      props: {
        code: ctx.codes.additionalStyling[2]
      }
    });
    var fa17 = new Fa({
      props: {
        icon: faMagic$1,
        rotate: 90,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa18 = new Fa({
      props: {
        icon: faMagic$1,
        rotate: 180,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa19 = new Fa({
      props: {
        icon: faMagic$1,
        size: "4x",
        rotate: "270",
        style: "background: mistyrose"
      }
    });
    var fa20 = new Fa({
      props: {
        icon: faMagic$1,
        size: "4x",
        rotate: "30",
        style: "background: mistyrose"
      }
    });
    var fa21 = new Fa({
      props: {
        icon: faMagic$1,
        size: "4x",
        rotate: "-30",
        style: "background: mistyrose"
      }
    });
    var fa22 = new Fa({
      props: {
        icon: faMagic$1,
        size: "4x",
        flip: "vertical",
        style: "background: mistyrose"
      }
    });
    var fa23 = new Fa({
      props: {
        icon: faMagic$1,
        size: "4x",
        flip: "horizontal",
        style: "background: mistyrose"
      }
    });
    var fa24 = new Fa({
      props: {
        icon: faMagic$1,
        size: "4x",
        flip: "both",
        style: "background: mistyrose"
      }
    });
    var fa25 = new Fa({
      props: {
        icon: faMagic$1,
        size: "4x",
        flip: "both",
        rotate: "30",
        style: "background: mistyrose"
      }
    });
    var docscode7 = new Docs_code({
      props: {
        code: ctx.codes.powerTransforms[0]
      }
    });
    var fa26 = new Fa({
      props: {
        icon: faCamera,
        size: "3x"
      }
    });
    var fa27 = new Fa({
      props: {
        icon: faFireAlt,
        size: "3x"
      }
    });
    var fa28 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x"
      }
    });
    var fa29 = new Fa({
      props: {
        icon: faFillDrip,
        size: "3x"
      }
    });
    var docscode8 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[0],
        lang: "js"
      }
    });
    var docscode9 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[1]
      }
    });
    var fa30 = new Fa({
      props: {
        icon: faCamera,
        size: "3x"
      }
    });
    var fa31 = new Fa({
      props: {
        icon: faCamera,
        size: "3x",
        swapOpacity: true
      }
    });
    var fa32 = new Fa({
      props: {
        icon: faFireAlt,
        size: "3x"
      }
    });
    var fa33 = new Fa({
      props: {
        icon: faFireAlt,
        size: "3x",
        swapOpacity: true
      }
    });
    var fa34 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x"
      }
    });
    var fa35 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        swapOpacity: true
      }
    });
    var fa36 = new Fa({
      props: {
        icon: faFillDrip,
        size: "3x"
      }
    });
    var fa37 = new Fa({
      props: {
        icon: faFillDrip,
        size: "3x",
        swapOpacity: true
      }
    });
    var docscode10 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[2]
      }
    });
    var fa38 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        secondaryOpacity: .2
      }
    });
    var fa39 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        secondaryOpacity: .4
      }
    });
    var fa40 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        secondaryOpacity: .6
      }
    });
    var fa41 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        secondaryOpacity: .8
      }
    });
    var fa42 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        secondaryOpacity: 1
      }
    });
    var docscode11 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[3]
      }
    });
    var fa43 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        primaryOpacity: .2
      }
    });
    var fa44 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        primaryOpacity: .4
      }
    });
    var fa45 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        primaryOpacity: .6
      }
    });
    var fa46 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        primaryOpacity: .8
      }
    });
    var fa47 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        primaryOpacity: 1
      }
    });
    var docscode12 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[4]
      }
    });
    var fa48 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        primaryColor: "gold"
      }
    });
    var fa49 = new Fa({
      props: {
        icon: faBusAlt,
        size: "3x",
        primaryColor: "orangered"
      }
    });
    var fa50 = new Fa({
      props: {
        icon: faFillDrip,
        size: "3x",
        secondaryColor: "limegreen"
      }
    });
    var fa51 = new Fa({
      props: {
        icon: faFillDrip,
        size: "3x",
        secondaryColor: "rebeccapurple"
      }
    });
    var fa52 = new Fa({
      props: {
        icon: faBatteryFull,
        size: "3x",
        primaryColor: "limegreen",
        secondaryColor: "dimgray"
      }
    });
    var fa53 = new Fa({
      props: {
        icon: faBatteryQuarter,
        size: "3x",
        primaryColor: "orange",
        secondaryColor: "dimgray"
      }
    });
    var docscode13 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[5]
      }
    });
    var fa54 = new Fa({
      props: {
        icon: faBook,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "lightseagreen",
        secondaryColor: "linen"
      }
    });
    var fa55 = new Fa({
      props: {
        icon: faBookSpells,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "mediumpurple",
        secondaryColor: "linen"
      }
    });
    var fa56 = new Fa({
      props: {
        icon: faBookMedical,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "crimson",
        secondaryColor: "linen"
      }
    });
    var fa57 = new Fa({
      props: {
        icon: faBookUser,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "peru",
        secondaryColor: "linen"
      }
    });
    var fa58 = new Fa({
      props: {
        icon: faToggleOff,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "white",
        secondaryColor: "gray"
      }
    });
    var fa59 = new Fa({
      props: {
        icon: faToggleOn,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "dodgerblue",
        secondaryColor: "white"
      }
    });
    var fa60 = new Fa({
      props: {
        icon: faFilePlus,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "white",
        secondaryColor: "limegreen"
      }
    });
    var fa61 = new Fa({
      props: {
        icon: faFileExclamation,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "white",
        secondaryColor: "gold"
      }
    });
    var fa62 = new Fa({
      props: {
        icon: faFileTimes,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "white",
        secondaryColor: "tomato"
      }
    });
    var docscode14 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[6]
      }
    });
    var fa63 = new Fa({
      props: {
        icon: faCrow,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "dodgerblue",
        secondaryColor: "gold"
      }
    });
    var fa64 = new Fa({
      props: {
        icon: faCampfire,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "sienna",
        secondaryColor: "red"
      }
    });
    var fa65 = new Fa({
      props: {
        icon: faBirthdayCake,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "pink",
        secondaryColor: "palevioletred"
      }
    });
    var fa66 = new Fa({
      props: {
        icon: faEar,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "sandybrown",
        secondaryColor: "bisque"
      }
    });
    var fa67 = new Fa({
      props: {
        icon: faCorn,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "mediumseagreen",
        secondaryColor: "gold"
      }
    });
    var fa68 = new Fa({
      props: {
        icon: faCookieBite,
        size: "3x",
        secondaryOpacity: 1,
        primaryColor: "saddlebrown",
        secondaryColor: "burlywood"
      }
    });
    var docscode15 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[7]
      }
    });
    var fa69_spread_levels = [{
      icon: faHatWizard
    }, {
      size: "3x"
    }, ctx.themeRavenclaw];
    var fa69_props = {};

    for (var i = 0; i < fa69_spread_levels.length; i += 1) {
      fa69_props = assign(fa69_props, fa69_spread_levels[i]);
    }

    var fa69 = new Fa({
      props: fa69_props
    });
    var fa70_spread_levels = [{
      icon: faFlaskPotion
    }, {
      size: "3x"
    }, ctx.themeRavenclaw];
    var fa70_props = {};

    for (var i = 0; i < fa70_spread_levels.length; i += 1) {
      fa70_props = assign(fa70_props, fa70_spread_levels[i]);
    }

    var fa70 = new Fa({
      props: fa70_props
    });
    var fa71_spread_levels = [{
      icon: faWandMagic
    }, {
      size: "3x"
    }, ctx.themeRavenclaw];
    var fa71_props = {};

    for (var i = 0; i < fa71_spread_levels.length; i += 1) {
      fa71_props = assign(fa71_props, fa71_spread_levels[i]);
    }

    var fa71 = new Fa({
      props: fa71_props
    });
    var fa72_spread_levels = [{
      icon: faScarf
    }, {
      size: "3x"
    }, ctx.themeRavenclaw];
    var fa72_props = {};

    for (var i = 0; i < fa72_spread_levels.length; i += 1) {
      fa72_props = assign(fa72_props, fa72_spread_levels[i]);
    }

    var fa72 = new Fa({
      props: fa72_props
    });
    var fa73_spread_levels = [{
      icon: faBookSpells
    }, {
      size: "3x"
    }, ctx.themeRavenclaw];
    var fa73_props = {};

    for (var i = 0; i < fa73_spread_levels.length; i += 1) {
      fa73_props = assign(fa73_props, fa73_spread_levels[i]);
    }

    var fa73 = new Fa({
      props: fa73_props
    });
    var docscode16 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[8],
        lang: "js"
      }
    });
    var docscode17 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[9]
      }
    });
    return {
      c: function c() {
        div20 = element("div");
        h40 = element("h4");
        h40.textContent = "Installation";
        t1 = space();
        docscode0.$$.fragment.c();
        t2 = space();
        docscode1.$$.fragment.c();
        t3 = space();
        h41 = element("h4");
        h41.textContent = "Basic Use";
        t5 = space();
        div0 = element("div");
        fa0.$$.fragment.c();
        t6 = text(" Flag");
        t7 = space();
        docscode2.$$.fragment.c();
        t8 = space();
        div2 = element("div");
        div1 = element("div");
        fa1.$$.fragment.c();
        t9 = space();
        docscode3.$$.fragment.c();
        t10 = space();
        h42 = element("h4");
        h42.textContent = "Additional Styling";
        t12 = space();
        h50 = element("h5");
        h50.textContent = "Icon Sizes";
        t14 = space();
        div3 = element("div");
        fa2.$$.fragment.c();
        t15 = space();
        fa3.$$.fragment.c();
        t16 = space();
        fa4.$$.fragment.c();
        t17 = space();
        fa5.$$.fragment.c();
        t18 = space();
        fa6.$$.fragment.c();
        t19 = space();
        fa7.$$.fragment.c();
        t20 = space();
        fa8.$$.fragment.c();
        t21 = space();
        fa9.$$.fragment.c();
        t22 = space();
        docscode4.$$.fragment.c();
        t23 = space();
        h51 = element("h5");
        h51.textContent = "Fixed Width Icons";
        t25 = space();
        div9 = element("div");
        div4 = element("div");
        fa10.$$.fragment.c();
        t26 = text(" Home");
        t27 = space();
        div5 = element("div");
        fa11.$$.fragment.c();
        t28 = text(" Info");
        t29 = space();
        div6 = element("div");
        fa12.$$.fragment.c();
        t30 = text(" Library");
        t31 = space();
        div7 = element("div");
        fa13.$$.fragment.c();
        t32 = text(" Applications");
        t33 = space();
        div8 = element("div");
        fa14.$$.fragment.c();
        t34 = text(" Settins");
        t35 = space();
        docscode5.$$.fragment.c();
        t36 = space();
        h52 = element("h5");
        h52.textContent = "Pulled Icons";
        t38 = space();
        div10 = element("div");
        fa15.$$.fragment.c();
        t39 = space();
        fa16.$$.fragment.c();
        t40 = text("\n    Gatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that’s no matter — tomorrow we will run faster, stretch our arms further... And one fine morning — So we beat on, boats against the current, borne back ceaselessly into the past.");
        t41 = space();
        docscode6.$$.fragment.c();
        t42 = space();
        h43 = element("h4");
        h43.textContent = "Power Transforms";
        t44 = space();
        h53 = element("h5");
        h53.textContent = "Rotating & Flipping";
        t46 = space();
        div11 = element("div");
        fa17.$$.fragment.c();
        t47 = space();
        fa18.$$.fragment.c();
        t48 = space();
        fa19.$$.fragment.c();
        t49 = space();
        fa20.$$.fragment.c();
        t50 = space();
        fa21.$$.fragment.c();
        t51 = space();
        fa22.$$.fragment.c();
        t52 = space();
        fa23.$$.fragment.c();
        t53 = space();
        fa24.$$.fragment.c();
        t54 = space();
        fa25.$$.fragment.c();
        t55 = space();
        docscode7.$$.fragment.c();
        t56 = space();
        h44 = element("h4");
        h44.textContent = "Duotone Icons";
        t58 = space();
        h54 = element("h5");
        h54.textContent = "Basic Use";
        t60 = space();
        div12 = element("div");
        fa26.$$.fragment.c();
        t61 = space();
        fa27.$$.fragment.c();
        t62 = space();
        fa28.$$.fragment.c();
        t63 = space();
        fa29.$$.fragment.c();
        t64 = space();
        docscode8.$$.fragment.c();
        t65 = space();
        docscode9.$$.fragment.c();
        t66 = space();
        h55 = element("h5");
        h55.textContent = "Swapping Layer Opacity";
        t68 = space();
        div13 = element("div");
        fa30.$$.fragment.c();
        t69 = space();
        fa31.$$.fragment.c();
        t70 = space();
        fa32.$$.fragment.c();
        t71 = space();
        fa33.$$.fragment.c();
        t72 = space();
        fa34.$$.fragment.c();
        t73 = space();
        fa35.$$.fragment.c();
        t74 = space();
        fa36.$$.fragment.c();
        t75 = space();
        fa37.$$.fragment.c();
        t76 = space();
        docscode10.$$.fragment.c();
        t77 = space();
        h56 = element("h5");
        h56.textContent = "Changing Opacity";
        t79 = space();
        div14 = element("div");
        fa38.$$.fragment.c();
        t80 = space();
        fa39.$$.fragment.c();
        t81 = space();
        fa40.$$.fragment.c();
        t82 = space();
        fa41.$$.fragment.c();
        t83 = space();
        fa42.$$.fragment.c();
        t84 = space();
        docscode11.$$.fragment.c();
        t85 = space();
        div15 = element("div");
        fa43.$$.fragment.c();
        t86 = space();
        fa44.$$.fragment.c();
        t87 = space();
        fa45.$$.fragment.c();
        t88 = space();
        fa46.$$.fragment.c();
        t89 = space();
        fa47.$$.fragment.c();
        t90 = space();
        docscode12.$$.fragment.c();
        t91 = space();
        h57 = element("h5");
        h57.textContent = "Coloring Duotone Icons";
        t93 = space();
        div16 = element("div");
        fa48.$$.fragment.c();
        t94 = space();
        fa49.$$.fragment.c();
        t95 = space();
        fa50.$$.fragment.c();
        t96 = space();
        fa51.$$.fragment.c();
        t97 = space();
        fa52.$$.fragment.c();
        t98 = space();
        fa53.$$.fragment.c();
        t99 = space();
        docscode13.$$.fragment.c();
        t100 = space();
        h58 = element("h5");
        h58.textContent = "Advanced Use";
        t102 = space();
        div17 = element("div");
        fa54.$$.fragment.c();
        t103 = space();
        fa55.$$.fragment.c();
        t104 = space();
        fa56.$$.fragment.c();
        t105 = space();
        fa57.$$.fragment.c();
        t106 = space();
        fa58.$$.fragment.c();
        t107 = space();
        fa59.$$.fragment.c();
        t108 = space();
        fa60.$$.fragment.c();
        t109 = space();
        fa61.$$.fragment.c();
        t110 = space();
        fa62.$$.fragment.c();
        t111 = space();
        docscode14.$$.fragment.c();
        t112 = space();
        div18 = element("div");
        fa63.$$.fragment.c();
        t113 = space();
        fa64.$$.fragment.c();
        t114 = space();
        fa65.$$.fragment.c();
        t115 = space();
        fa66.$$.fragment.c();
        t116 = space();
        fa67.$$.fragment.c();
        t117 = space();
        fa68.$$.fragment.c();
        t118 = space();
        docscode15.$$.fragment.c();
        t119 = space();
        div19 = element("div");
        fa69.$$.fragment.c();
        t120 = space();
        fa70.$$.fragment.c();
        t121 = space();
        fa71.$$.fragment.c();
        t122 = space();
        fa72.$$.fragment.c();
        t123 = space();
        fa73.$$.fragment.c();
        t124 = space();
        docscode16.$$.fragment.c();
        t125 = space();
        docscode17.$$.fragment.c();
        attr(div0, "class", "shadow-sm p-3 mb-3 rounded");
        set_style(div1, "font-size", "3em");
        set_style(div1, "color", "tomato");
        attr(div2, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div3, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div9, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div10, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        attr(div11, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div12, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div13, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div14, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div15, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div16, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div17, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div18, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div19, "class", "shadow-sm p-3 mb-3 rounded");
      },
      m: function m(target, anchor) {
        insert(target, div20, anchor);
        append(div20, h40);
        append(div20, t1);
        mount_component(docscode0, div20, null);
        append(div20, t2);
        mount_component(docscode1, div20, null);
        append(div20, t3);
        append(div20, h41);
        append(div20, t5);
        append(div20, div0);
        mount_component(fa0, div0, null);
        append(div0, t6);
        append(div20, t7);
        mount_component(docscode2, div20, null);
        append(div20, t8);
        append(div20, div2);
        append(div2, div1);
        mount_component(fa1, div1, null);
        append(div20, t9);
        mount_component(docscode3, div20, null);
        append(div20, t10);
        append(div20, h42);
        append(div20, t12);
        append(div20, h50);
        append(div20, t14);
        append(div20, div3);
        mount_component(fa2, div3, null);
        append(div3, t15);
        mount_component(fa3, div3, null);
        append(div3, t16);
        mount_component(fa4, div3, null);
        append(div3, t17);
        mount_component(fa5, div3, null);
        append(div3, t18);
        mount_component(fa6, div3, null);
        append(div3, t19);
        mount_component(fa7, div3, null);
        append(div3, t20);
        mount_component(fa8, div3, null);
        append(div3, t21);
        mount_component(fa9, div3, null);
        append(div20, t22);
        mount_component(docscode4, div20, null);
        append(div20, t23);
        append(div20, h51);
        append(div20, t25);
        append(div20, div9);
        append(div9, div4);
        mount_component(fa10, div4, null);
        append(div4, t26);
        append(div9, t27);
        append(div9, div5);
        mount_component(fa11, div5, null);
        append(div5, t28);
        append(div9, t29);
        append(div9, div6);
        mount_component(fa12, div6, null);
        append(div6, t30);
        append(div9, t31);
        append(div9, div7);
        mount_component(fa13, div7, null);
        append(div7, t32);
        append(div9, t33);
        append(div9, div8);
        mount_component(fa14, div8, null);
        append(div8, t34);
        append(div20, t35);
        mount_component(docscode5, div20, null);
        append(div20, t36);
        append(div20, h52);
        append(div20, t38);
        append(div20, div10);
        mount_component(fa15, div10, null);
        append(div10, t39);
        mount_component(fa16, div10, null);
        append(div10, t40);
        append(div20, t41);
        mount_component(docscode6, div20, null);
        append(div20, t42);
        append(div20, h43);
        append(div20, t44);
        append(div20, h53);
        append(div20, t46);
        append(div20, div11);
        mount_component(fa17, div11, null);
        append(div11, t47);
        mount_component(fa18, div11, null);
        append(div11, t48);
        mount_component(fa19, div11, null);
        append(div11, t49);
        mount_component(fa20, div11, null);
        append(div11, t50);
        mount_component(fa21, div11, null);
        append(div11, t51);
        mount_component(fa22, div11, null);
        append(div11, t52);
        mount_component(fa23, div11, null);
        append(div11, t53);
        mount_component(fa24, div11, null);
        append(div11, t54);
        mount_component(fa25, div11, null);
        append(div20, t55);
        mount_component(docscode7, div20, null);
        append(div20, t56);
        append(div20, h44);
        append(div20, t58);
        append(div20, h54);
        append(div20, t60);
        append(div20, div12);
        mount_component(fa26, div12, null);
        append(div12, t61);
        mount_component(fa27, div12, null);
        append(div12, t62);
        mount_component(fa28, div12, null);
        append(div12, t63);
        mount_component(fa29, div12, null);
        append(div20, t64);
        mount_component(docscode8, div20, null);
        append(div20, t65);
        mount_component(docscode9, div20, null);
        append(div20, t66);
        append(div20, h55);
        append(div20, t68);
        append(div20, div13);
        mount_component(fa30, div13, null);
        append(div13, t69);
        mount_component(fa31, div13, null);
        append(div13, t70);
        mount_component(fa32, div13, null);
        append(div13, t71);
        mount_component(fa33, div13, null);
        append(div13, t72);
        mount_component(fa34, div13, null);
        append(div13, t73);
        mount_component(fa35, div13, null);
        append(div13, t74);
        mount_component(fa36, div13, null);
        append(div13, t75);
        mount_component(fa37, div13, null);
        append(div20, t76);
        mount_component(docscode10, div20, null);
        append(div20, t77);
        append(div20, h56);
        append(div20, t79);
        append(div20, div14);
        mount_component(fa38, div14, null);
        append(div14, t80);
        mount_component(fa39, div14, null);
        append(div14, t81);
        mount_component(fa40, div14, null);
        append(div14, t82);
        mount_component(fa41, div14, null);
        append(div14, t83);
        mount_component(fa42, div14, null);
        append(div20, t84);
        mount_component(docscode11, div20, null);
        append(div20, t85);
        append(div20, div15);
        mount_component(fa43, div15, null);
        append(div15, t86);
        mount_component(fa44, div15, null);
        append(div15, t87);
        mount_component(fa45, div15, null);
        append(div15, t88);
        mount_component(fa46, div15, null);
        append(div15, t89);
        mount_component(fa47, div15, null);
        append(div20, t90);
        mount_component(docscode12, div20, null);
        append(div20, t91);
        append(div20, h57);
        append(div20, t93);
        append(div20, div16);
        mount_component(fa48, div16, null);
        append(div16, t94);
        mount_component(fa49, div16, null);
        append(div16, t95);
        mount_component(fa50, div16, null);
        append(div16, t96);
        mount_component(fa51, div16, null);
        append(div16, t97);
        mount_component(fa52, div16, null);
        append(div16, t98);
        mount_component(fa53, div16, null);
        append(div20, t99);
        mount_component(docscode13, div20, null);
        append(div20, t100);
        append(div20, h58);
        append(div20, t102);
        append(div20, div17);
        mount_component(fa54, div17, null);
        append(div17, t103);
        mount_component(fa55, div17, null);
        append(div17, t104);
        mount_component(fa56, div17, null);
        append(div17, t105);
        mount_component(fa57, div17, null);
        append(div17, t106);
        mount_component(fa58, div17, null);
        append(div17, t107);
        mount_component(fa59, div17, null);
        append(div17, t108);
        mount_component(fa60, div17, null);
        append(div17, t109);
        mount_component(fa61, div17, null);
        append(div17, t110);
        mount_component(fa62, div17, null);
        append(div20, t111);
        mount_component(docscode14, div20, null);
        append(div20, t112);
        append(div20, div18);
        mount_component(fa63, div18, null);
        append(div18, t113);
        mount_component(fa64, div18, null);
        append(div18, t114);
        mount_component(fa65, div18, null);
        append(div18, t115);
        mount_component(fa66, div18, null);
        append(div18, t116);
        mount_component(fa67, div18, null);
        append(div18, t117);
        mount_component(fa68, div18, null);
        append(div20, t118);
        mount_component(docscode15, div20, null);
        append(div20, t119);
        append(div20, div19);
        mount_component(fa69, div19, null);
        append(div19, t120);
        mount_component(fa70, div19, null);
        append(div19, t121);
        mount_component(fa71, div19, null);
        append(div19, t122);
        mount_component(fa72, div19, null);
        append(div19, t123);
        mount_component(fa73, div19, null);
        append(div20, t124);
        mount_component(docscode16, div20, null);
        append(div20, t125);
        mount_component(docscode17, div20, null);
        current = true;
      },
      p: function p(changed, ctx) {
        var docscode0_changes = {};
        if (changed.codes) docscode0_changes.code = ctx.codes.installation[0];
        docscode0.$set(docscode0_changes);
        var docscode1_changes = {};
        if (changed.codes) docscode1_changes.code = ctx.codes.installation[1];
        docscode1.$set(docscode1_changes);
        var fa0_changes = {};
        if (changed.faFlag) fa0_changes.icon = faFlag$1;
        fa0.$set(fa0_changes);
        var docscode2_changes = {};
        if (changed.codes) docscode2_changes.code = ctx.codes.basicUse[0];
        docscode2.$set(docscode2_changes);
        var fa1_changes = {};
        if (changed.faFlag) fa1_changes.icon = faFlag$1;
        fa1.$set(fa1_changes);
        var docscode3_changes = {};
        if (changed.codes) docscode3_changes.code = ctx.codes.basicUse[1];
        docscode3.$set(docscode3_changes);
        var fa2_changes = {};
        if (changed.faFlag) fa2_changes.icon = faFlag$1;
        fa2.$set(fa2_changes);
        var fa3_changes = {};
        if (changed.faFlag) fa3_changes.icon = faFlag$1;
        fa3.$set(fa3_changes);
        var fa4_changes = {};
        if (changed.faFlag) fa4_changes.icon = faFlag$1;
        fa4.$set(fa4_changes);
        var fa5_changes = {};
        if (changed.faFlag) fa5_changes.icon = faFlag$1;
        fa5.$set(fa5_changes);
        var fa6_changes = {};
        if (changed.faFlag) fa6_changes.icon = faFlag$1;
        fa6.$set(fa6_changes);
        var fa7_changes = {};
        if (changed.faFlag) fa7_changes.icon = faFlag$1;
        fa7.$set(fa7_changes);
        var fa8_changes = {};
        if (changed.faFlag) fa8_changes.icon = faFlag$1;
        fa8.$set(fa8_changes);
        var fa9_changes = {};
        if (changed.faFlag) fa9_changes.icon = faFlag$1;
        fa9.$set(fa9_changes);
        var docscode4_changes = {};
        if (changed.codes) docscode4_changes.code = ctx.codes.additionalStyling[0];
        docscode4.$set(docscode4_changes);
        var fa10_changes = {};
        if (changed.faHome) fa10_changes.icon = faHome$1;
        fa10.$set(fa10_changes);
        var fa11_changes = {};
        if (changed.faInfo) fa11_changes.icon = faInfo;
        fa11.$set(fa11_changes);
        var fa12_changes = {};
        if (changed.faBook) fa12_changes.icon = faBook$1;
        fa12.$set(fa12_changes);
        var fa13_changes = {};
        if (changed.faPencilAlt) fa13_changes.icon = faPencilAlt;
        fa13.$set(fa13_changes);
        var fa14_changes = {};
        if (changed.faCog) fa14_changes.icon = faCog$1;
        fa14.$set(fa14_changes);
        var docscode5_changes = {};
        if (changed.codes) docscode5_changes.code = ctx.codes.additionalStyling[1];
        docscode5.$set(docscode5_changes);
        var fa15_changes = {};
        if (changed.faQuoteLeft) fa15_changes.icon = faQuoteLeft;
        fa15.$set(fa15_changes);
        var fa16_changes = {};
        if (changed.faQuoteRight) fa16_changes.icon = faQuoteRight;
        fa16.$set(fa16_changes);
        var docscode6_changes = {};
        if (changed.codes) docscode6_changes.code = ctx.codes.additionalStyling[2];
        docscode6.$set(docscode6_changes);
        var fa17_changes = {};
        if (changed.faMagic) fa17_changes.icon = faMagic$1;
        fa17.$set(fa17_changes);
        var fa18_changes = {};
        if (changed.faMagic) fa18_changes.icon = faMagic$1;
        fa18.$set(fa18_changes);
        var fa19_changes = {};
        if (changed.faMagic) fa19_changes.icon = faMagic$1;
        fa19.$set(fa19_changes);
        var fa20_changes = {};
        if (changed.faMagic) fa20_changes.icon = faMagic$1;
        fa20.$set(fa20_changes);
        var fa21_changes = {};
        if (changed.faMagic) fa21_changes.icon = faMagic$1;
        fa21.$set(fa21_changes);
        var fa22_changes = {};
        if (changed.faMagic) fa22_changes.icon = faMagic$1;
        fa22.$set(fa22_changes);
        var fa23_changes = {};
        if (changed.faMagic) fa23_changes.icon = faMagic$1;
        fa23.$set(fa23_changes);
        var fa24_changes = {};
        if (changed.faMagic) fa24_changes.icon = faMagic$1;
        fa24.$set(fa24_changes);
        var fa25_changes = {};
        if (changed.faMagic) fa25_changes.icon = faMagic$1;
        fa25.$set(fa25_changes);
        var docscode7_changes = {};
        if (changed.codes) docscode7_changes.code = ctx.codes.powerTransforms[0];
        docscode7.$set(docscode7_changes);
        var fa26_changes = {};
        if (changed.fadCamera) fa26_changes.icon = faCamera;
        fa26.$set(fa26_changes);
        var fa27_changes = {};
        if (changed.fadFireAlt) fa27_changes.icon = faFireAlt;
        fa27.$set(fa27_changes);
        var fa28_changes = {};
        if (changed.fadBusAlt) fa28_changes.icon = faBusAlt;
        fa28.$set(fa28_changes);
        var fa29_changes = {};
        if (changed.fadFillDrip) fa29_changes.icon = faFillDrip;
        fa29.$set(fa29_changes);
        var docscode8_changes = {};
        if (changed.codes) docscode8_changes.code = ctx.codes.duotoneIcons[0];
        docscode8.$set(docscode8_changes);
        var docscode9_changes = {};
        if (changed.codes) docscode9_changes.code = ctx.codes.duotoneIcons[1];
        docscode9.$set(docscode9_changes);
        var fa30_changes = {};
        if (changed.fadCamera) fa30_changes.icon = faCamera;
        fa30.$set(fa30_changes);
        var fa31_changes = {};
        if (changed.fadCamera) fa31_changes.icon = faCamera;
        fa31.$set(fa31_changes);
        var fa32_changes = {};
        if (changed.fadFireAlt) fa32_changes.icon = faFireAlt;
        fa32.$set(fa32_changes);
        var fa33_changes = {};
        if (changed.fadFireAlt) fa33_changes.icon = faFireAlt;
        fa33.$set(fa33_changes);
        var fa34_changes = {};
        if (changed.fadBusAlt) fa34_changes.icon = faBusAlt;
        fa34.$set(fa34_changes);
        var fa35_changes = {};
        if (changed.fadBusAlt) fa35_changes.icon = faBusAlt;
        fa35.$set(fa35_changes);
        var fa36_changes = {};
        if (changed.fadFillDrip) fa36_changes.icon = faFillDrip;
        fa36.$set(fa36_changes);
        var fa37_changes = {};
        if (changed.fadFillDrip) fa37_changes.icon = faFillDrip;
        fa37.$set(fa37_changes);
        var docscode10_changes = {};
        if (changed.codes) docscode10_changes.code = ctx.codes.duotoneIcons[2];
        docscode10.$set(docscode10_changes);
        var fa38_changes = {};
        if (changed.fadBusAlt) fa38_changes.icon = faBusAlt;
        fa38.$set(fa38_changes);
        var fa39_changes = {};
        if (changed.fadBusAlt) fa39_changes.icon = faBusAlt;
        fa39.$set(fa39_changes);
        var fa40_changes = {};
        if (changed.fadBusAlt) fa40_changes.icon = faBusAlt;
        fa40.$set(fa40_changes);
        var fa41_changes = {};
        if (changed.fadBusAlt) fa41_changes.icon = faBusAlt;
        fa41.$set(fa41_changes);
        var fa42_changes = {};
        if (changed.fadBusAlt) fa42_changes.icon = faBusAlt;
        fa42.$set(fa42_changes);
        var docscode11_changes = {};
        if (changed.codes) docscode11_changes.code = ctx.codes.duotoneIcons[3];
        docscode11.$set(docscode11_changes);
        var fa43_changes = {};
        if (changed.fadBusAlt) fa43_changes.icon = faBusAlt;
        fa43.$set(fa43_changes);
        var fa44_changes = {};
        if (changed.fadBusAlt) fa44_changes.icon = faBusAlt;
        fa44.$set(fa44_changes);
        var fa45_changes = {};
        if (changed.fadBusAlt) fa45_changes.icon = faBusAlt;
        fa45.$set(fa45_changes);
        var fa46_changes = {};
        if (changed.fadBusAlt) fa46_changes.icon = faBusAlt;
        fa46.$set(fa46_changes);
        var fa47_changes = {};
        if (changed.fadBusAlt) fa47_changes.icon = faBusAlt;
        fa47.$set(fa47_changes);
        var docscode12_changes = {};
        if (changed.codes) docscode12_changes.code = ctx.codes.duotoneIcons[4];
        docscode12.$set(docscode12_changes);
        var fa48_changes = {};
        if (changed.fadBusAlt) fa48_changes.icon = faBusAlt;
        fa48.$set(fa48_changes);
        var fa49_changes = {};
        if (changed.fadBusAlt) fa49_changes.icon = faBusAlt;
        fa49.$set(fa49_changes);
        var fa50_changes = {};
        if (changed.fadFillDrip) fa50_changes.icon = faFillDrip;
        fa50.$set(fa50_changes);
        var fa51_changes = {};
        if (changed.fadFillDrip) fa51_changes.icon = faFillDrip;
        fa51.$set(fa51_changes);
        var fa52_changes = {};
        if (changed.fadBatteryFull) fa52_changes.icon = faBatteryFull;
        fa52.$set(fa52_changes);
        var fa53_changes = {};
        if (changed.fadBatteryQuarter) fa53_changes.icon = faBatteryQuarter;
        fa53.$set(fa53_changes);
        var docscode13_changes = {};
        if (changed.codes) docscode13_changes.code = ctx.codes.duotoneIcons[5];
        docscode13.$set(docscode13_changes);
        var fa54_changes = {};
        if (changed.fadBook) fa54_changes.icon = faBook;
        fa54.$set(fa54_changes);
        var fa55_changes = {};
        if (changed.fadBookSpells) fa55_changes.icon = faBookSpells;
        fa55.$set(fa55_changes);
        var fa56_changes = {};
        if (changed.fadBookMedical) fa56_changes.icon = faBookMedical;
        fa56.$set(fa56_changes);
        var fa57_changes = {};
        if (changed.fadBookUser) fa57_changes.icon = faBookUser;
        fa57.$set(fa57_changes);
        var fa58_changes = {};
        if (changed.fadToggleOff) fa58_changes.icon = faToggleOff;
        fa58.$set(fa58_changes);
        var fa59_changes = {};
        if (changed.fadToggleOn) fa59_changes.icon = faToggleOn;
        fa59.$set(fa59_changes);
        var fa60_changes = {};
        if (changed.fadFilePlus) fa60_changes.icon = faFilePlus;
        fa60.$set(fa60_changes);
        var fa61_changes = {};
        if (changed.fadFileExclamation) fa61_changes.icon = faFileExclamation;
        fa61.$set(fa61_changes);
        var fa62_changes = {};
        if (changed.fadFileTimes) fa62_changes.icon = faFileTimes;
        fa62.$set(fa62_changes);
        var docscode14_changes = {};
        if (changed.codes) docscode14_changes.code = ctx.codes.duotoneIcons[6];
        docscode14.$set(docscode14_changes);
        var fa63_changes = {};
        if (changed.fadCrow) fa63_changes.icon = faCrow;
        fa63.$set(fa63_changes);
        var fa64_changes = {};
        if (changed.fadCampfire) fa64_changes.icon = faCampfire;
        fa64.$set(fa64_changes);
        var fa65_changes = {};
        if (changed.fadBirthdayCake) fa65_changes.icon = faBirthdayCake;
        fa65.$set(fa65_changes);
        var fa66_changes = {};
        if (changed.fadEar) fa66_changes.icon = faEar;
        fa66.$set(fa66_changes);
        var fa67_changes = {};
        if (changed.fadCorn) fa67_changes.icon = faCorn;
        fa67.$set(fa67_changes);
        var fa68_changes = {};
        if (changed.fadCookieBite) fa68_changes.icon = faCookieBite;
        fa68.$set(fa68_changes);
        var docscode15_changes = {};
        if (changed.codes) docscode15_changes.code = ctx.codes.duotoneIcons[7];
        docscode15.$set(docscode15_changes);
        var fa69_changes = changed.fadHatWizard || changed.themeRavenclaw ? get_spread_update(fa69_spread_levels, [changed.fadHatWizard && {
          icon: faHatWizard
        }, fa69_spread_levels[1], changed.themeRavenclaw && ctx.themeRavenclaw]) : {};
        fa69.$set(fa69_changes);
        var fa70_changes = changed.fadFlaskPotion || changed.themeRavenclaw ? get_spread_update(fa70_spread_levels, [changed.fadFlaskPotion && {
          icon: faFlaskPotion
        }, fa70_spread_levels[1], changed.themeRavenclaw && ctx.themeRavenclaw]) : {};
        fa70.$set(fa70_changes);
        var fa71_changes = changed.fadWandMagic || changed.themeRavenclaw ? get_spread_update(fa71_spread_levels, [changed.fadWandMagic && {
          icon: faWandMagic
        }, fa71_spread_levels[1], changed.themeRavenclaw && ctx.themeRavenclaw]) : {};
        fa71.$set(fa71_changes);
        var fa72_changes = changed.fadScarf || changed.themeRavenclaw ? get_spread_update(fa72_spread_levels, [changed.fadScarf && {
          icon: faScarf
        }, fa72_spread_levels[1], changed.themeRavenclaw && ctx.themeRavenclaw]) : {};
        fa72.$set(fa72_changes);
        var fa73_changes = changed.fadBookSpells || changed.themeRavenclaw ? get_spread_update(fa73_spread_levels, [changed.fadBookSpells && {
          icon: faBookSpells
        }, fa73_spread_levels[1], changed.themeRavenclaw && ctx.themeRavenclaw]) : {};
        fa73.$set(fa73_changes);
        var docscode16_changes = {};
        if (changed.codes) docscode16_changes.code = ctx.codes.duotoneIcons[8];
        docscode16.$set(docscode16_changes);
        var docscode17_changes = {};
        if (changed.codes) docscode17_changes.code = ctx.codes.duotoneIcons[9];
        docscode17.$set(docscode17_changes);
      },
      i: function i(local) {
        if (current) return;
        transition_in(docscode0.$$.fragment, local);
        transition_in(docscode1.$$.fragment, local);
        transition_in(fa0.$$.fragment, local);
        transition_in(docscode2.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        transition_in(docscode3.$$.fragment, local);
        transition_in(fa2.$$.fragment, local);
        transition_in(fa3.$$.fragment, local);
        transition_in(fa4.$$.fragment, local);
        transition_in(fa5.$$.fragment, local);
        transition_in(fa6.$$.fragment, local);
        transition_in(fa7.$$.fragment, local);
        transition_in(fa8.$$.fragment, local);
        transition_in(fa9.$$.fragment, local);
        transition_in(docscode4.$$.fragment, local);
        transition_in(fa10.$$.fragment, local);
        transition_in(fa11.$$.fragment, local);
        transition_in(fa12.$$.fragment, local);
        transition_in(fa13.$$.fragment, local);
        transition_in(fa14.$$.fragment, local);
        transition_in(docscode5.$$.fragment, local);
        transition_in(fa15.$$.fragment, local);
        transition_in(fa16.$$.fragment, local);
        transition_in(docscode6.$$.fragment, local);
        transition_in(fa17.$$.fragment, local);
        transition_in(fa18.$$.fragment, local);
        transition_in(fa19.$$.fragment, local);
        transition_in(fa20.$$.fragment, local);
        transition_in(fa21.$$.fragment, local);
        transition_in(fa22.$$.fragment, local);
        transition_in(fa23.$$.fragment, local);
        transition_in(fa24.$$.fragment, local);
        transition_in(fa25.$$.fragment, local);
        transition_in(docscode7.$$.fragment, local);
        transition_in(fa26.$$.fragment, local);
        transition_in(fa27.$$.fragment, local);
        transition_in(fa28.$$.fragment, local);
        transition_in(fa29.$$.fragment, local);
        transition_in(docscode8.$$.fragment, local);
        transition_in(docscode9.$$.fragment, local);
        transition_in(fa30.$$.fragment, local);
        transition_in(fa31.$$.fragment, local);
        transition_in(fa32.$$.fragment, local);
        transition_in(fa33.$$.fragment, local);
        transition_in(fa34.$$.fragment, local);
        transition_in(fa35.$$.fragment, local);
        transition_in(fa36.$$.fragment, local);
        transition_in(fa37.$$.fragment, local);
        transition_in(docscode10.$$.fragment, local);
        transition_in(fa38.$$.fragment, local);
        transition_in(fa39.$$.fragment, local);
        transition_in(fa40.$$.fragment, local);
        transition_in(fa41.$$.fragment, local);
        transition_in(fa42.$$.fragment, local);
        transition_in(docscode11.$$.fragment, local);
        transition_in(fa43.$$.fragment, local);
        transition_in(fa44.$$.fragment, local);
        transition_in(fa45.$$.fragment, local);
        transition_in(fa46.$$.fragment, local);
        transition_in(fa47.$$.fragment, local);
        transition_in(docscode12.$$.fragment, local);
        transition_in(fa48.$$.fragment, local);
        transition_in(fa49.$$.fragment, local);
        transition_in(fa50.$$.fragment, local);
        transition_in(fa51.$$.fragment, local);
        transition_in(fa52.$$.fragment, local);
        transition_in(fa53.$$.fragment, local);
        transition_in(docscode13.$$.fragment, local);
        transition_in(fa54.$$.fragment, local);
        transition_in(fa55.$$.fragment, local);
        transition_in(fa56.$$.fragment, local);
        transition_in(fa57.$$.fragment, local);
        transition_in(fa58.$$.fragment, local);
        transition_in(fa59.$$.fragment, local);
        transition_in(fa60.$$.fragment, local);
        transition_in(fa61.$$.fragment, local);
        transition_in(fa62.$$.fragment, local);
        transition_in(docscode14.$$.fragment, local);
        transition_in(fa63.$$.fragment, local);
        transition_in(fa64.$$.fragment, local);
        transition_in(fa65.$$.fragment, local);
        transition_in(fa66.$$.fragment, local);
        transition_in(fa67.$$.fragment, local);
        transition_in(fa68.$$.fragment, local);
        transition_in(docscode15.$$.fragment, local);
        transition_in(fa69.$$.fragment, local);
        transition_in(fa70.$$.fragment, local);
        transition_in(fa71.$$.fragment, local);
        transition_in(fa72.$$.fragment, local);
        transition_in(fa73.$$.fragment, local);
        transition_in(docscode16.$$.fragment, local);
        transition_in(docscode17.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docscode0.$$.fragment, local);
        transition_out(docscode1.$$.fragment, local);
        transition_out(fa0.$$.fragment, local);
        transition_out(docscode2.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        transition_out(docscode3.$$.fragment, local);
        transition_out(fa2.$$.fragment, local);
        transition_out(fa3.$$.fragment, local);
        transition_out(fa4.$$.fragment, local);
        transition_out(fa5.$$.fragment, local);
        transition_out(fa6.$$.fragment, local);
        transition_out(fa7.$$.fragment, local);
        transition_out(fa8.$$.fragment, local);
        transition_out(fa9.$$.fragment, local);
        transition_out(docscode4.$$.fragment, local);
        transition_out(fa10.$$.fragment, local);
        transition_out(fa11.$$.fragment, local);
        transition_out(fa12.$$.fragment, local);
        transition_out(fa13.$$.fragment, local);
        transition_out(fa14.$$.fragment, local);
        transition_out(docscode5.$$.fragment, local);
        transition_out(fa15.$$.fragment, local);
        transition_out(fa16.$$.fragment, local);
        transition_out(docscode6.$$.fragment, local);
        transition_out(fa17.$$.fragment, local);
        transition_out(fa18.$$.fragment, local);
        transition_out(fa19.$$.fragment, local);
        transition_out(fa20.$$.fragment, local);
        transition_out(fa21.$$.fragment, local);
        transition_out(fa22.$$.fragment, local);
        transition_out(fa23.$$.fragment, local);
        transition_out(fa24.$$.fragment, local);
        transition_out(fa25.$$.fragment, local);
        transition_out(docscode7.$$.fragment, local);
        transition_out(fa26.$$.fragment, local);
        transition_out(fa27.$$.fragment, local);
        transition_out(fa28.$$.fragment, local);
        transition_out(fa29.$$.fragment, local);
        transition_out(docscode8.$$.fragment, local);
        transition_out(docscode9.$$.fragment, local);
        transition_out(fa30.$$.fragment, local);
        transition_out(fa31.$$.fragment, local);
        transition_out(fa32.$$.fragment, local);
        transition_out(fa33.$$.fragment, local);
        transition_out(fa34.$$.fragment, local);
        transition_out(fa35.$$.fragment, local);
        transition_out(fa36.$$.fragment, local);
        transition_out(fa37.$$.fragment, local);
        transition_out(docscode10.$$.fragment, local);
        transition_out(fa38.$$.fragment, local);
        transition_out(fa39.$$.fragment, local);
        transition_out(fa40.$$.fragment, local);
        transition_out(fa41.$$.fragment, local);
        transition_out(fa42.$$.fragment, local);
        transition_out(docscode11.$$.fragment, local);
        transition_out(fa43.$$.fragment, local);
        transition_out(fa44.$$.fragment, local);
        transition_out(fa45.$$.fragment, local);
        transition_out(fa46.$$.fragment, local);
        transition_out(fa47.$$.fragment, local);
        transition_out(docscode12.$$.fragment, local);
        transition_out(fa48.$$.fragment, local);
        transition_out(fa49.$$.fragment, local);
        transition_out(fa50.$$.fragment, local);
        transition_out(fa51.$$.fragment, local);
        transition_out(fa52.$$.fragment, local);
        transition_out(fa53.$$.fragment, local);
        transition_out(docscode13.$$.fragment, local);
        transition_out(fa54.$$.fragment, local);
        transition_out(fa55.$$.fragment, local);
        transition_out(fa56.$$.fragment, local);
        transition_out(fa57.$$.fragment, local);
        transition_out(fa58.$$.fragment, local);
        transition_out(fa59.$$.fragment, local);
        transition_out(fa60.$$.fragment, local);
        transition_out(fa61.$$.fragment, local);
        transition_out(fa62.$$.fragment, local);
        transition_out(docscode14.$$.fragment, local);
        transition_out(fa63.$$.fragment, local);
        transition_out(fa64.$$.fragment, local);
        transition_out(fa65.$$.fragment, local);
        transition_out(fa66.$$.fragment, local);
        transition_out(fa67.$$.fragment, local);
        transition_out(fa68.$$.fragment, local);
        transition_out(docscode15.$$.fragment, local);
        transition_out(fa69.$$.fragment, local);
        transition_out(fa70.$$.fragment, local);
        transition_out(fa71.$$.fragment, local);
        transition_out(fa72.$$.fragment, local);
        transition_out(fa73.$$.fragment, local);
        transition_out(docscode16.$$.fragment, local);
        transition_out(docscode17.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) {
          detach(div20);
        }

        destroy_component(docscode0);
        destroy_component(docscode1);
        destroy_component(fa0);
        destroy_component(docscode2);
        destroy_component(fa1);
        destroy_component(docscode3);
        destroy_component(fa2);
        destroy_component(fa3);
        destroy_component(fa4);
        destroy_component(fa5);
        destroy_component(fa6);
        destroy_component(fa7);
        destroy_component(fa8);
        destroy_component(fa9);
        destroy_component(docscode4);
        destroy_component(fa10);
        destroy_component(fa11);
        destroy_component(fa12);
        destroy_component(fa13);
        destroy_component(fa14);
        destroy_component(docscode5);
        destroy_component(fa15);
        destroy_component(fa16);
        destroy_component(docscode6);
        destroy_component(fa17);
        destroy_component(fa18);
        destroy_component(fa19);
        destroy_component(fa20);
        destroy_component(fa21);
        destroy_component(fa22);
        destroy_component(fa23);
        destroy_component(fa24);
        destroy_component(fa25);
        destroy_component(docscode7);
        destroy_component(fa26);
        destroy_component(fa27);
        destroy_component(fa28);
        destroy_component(fa29);
        destroy_component(docscode8);
        destroy_component(docscode9);
        destroy_component(fa30);
        destroy_component(fa31);
        destroy_component(fa32);
        destroy_component(fa33);
        destroy_component(fa34);
        destroy_component(fa35);
        destroy_component(fa36);
        destroy_component(fa37);
        destroy_component(docscode10);
        destroy_component(fa38);
        destroy_component(fa39);
        destroy_component(fa40);
        destroy_component(fa41);
        destroy_component(fa42);
        destroy_component(docscode11);
        destroy_component(fa43);
        destroy_component(fa44);
        destroy_component(fa45);
        destroy_component(fa46);
        destroy_component(fa47);
        destroy_component(docscode12);
        destroy_component(fa48);
        destroy_component(fa49);
        destroy_component(fa50);
        destroy_component(fa51);
        destroy_component(fa52);
        destroy_component(fa53);
        destroy_component(docscode13);
        destroy_component(fa54);
        destroy_component(fa55);
        destroy_component(fa56);
        destroy_component(fa57);
        destroy_component(fa58);
        destroy_component(fa59);
        destroy_component(fa60);
        destroy_component(fa61);
        destroy_component(fa62);
        destroy_component(docscode14);
        destroy_component(fa63);
        destroy_component(fa64);
        destroy_component(fa65);
        destroy_component(fa66);
        destroy_component(fa67);
        destroy_component(fa68);
        destroy_component(docscode15);
        destroy_component(fa69);
        destroy_component(fa70);
        destroy_component(fa71);
        destroy_component(fa72);
        destroy_component(fa73);
        destroy_component(docscode16);
        destroy_component(docscode17);
      }
    };
  }

  function instance$2($$self) {
    var themeRavenclaw = {
      secondaryOpacity: 1,
      primaryColor: '#0438a1',
      secondaryColor: '#6c6c6c'
    };
    var codes = {
      installation: ['npm install svelte-fa --save', "import Fa from 'svelte-fa'\nimport { faFlag } from '@fortawesome/free-solid-svg-icons'"],
      basicUse: ['<Fa icon={faFlag} /> Flag', "<div style=\"font-size: 3em; color: tomato\">\n  <Fa icon={faFlag} />\n</div>"],
      additionalStyling: ["<Fa icon={faFlag} size=\"xs\" />\n<Fa icon={faFlag} size=\"sm\" />\n<Fa icon={faFlag} size=\"lg\" />\n<Fa icon={faFlag} size=\"2x\" />\n<Fa icon={faFlag} size=\"2.5x\" />\n<Fa icon={faFlag} size=\"5x\" />\n<Fa icon={faFlag} size=\"7x\" />\n<Fa icon={faFlag} size=\"10x\" />", "<div>\n  <Fa icon={faHome} fw style=\"background: mistyrose\" /> Home\n</div>\n<div>\n  <Fa icon={faInfo} fw style=\"background: mistyrose\" /> Info\n</div>\n<div>\n  <Fa icon={faBook} fw style=\"background: mistyrose\" /> Library\n</div>\n<div>\n  <Fa icon={faPencilAlt} fw style=\"background: mistyrose\" /> Applications\n</div>\n<div>\n  <Fa icon={faCog} fw style=\"background: mistyrose\" /> Settins\n</div>", "<Fa icon={faQuoteLeft} pull=\"left\" size=\"2x\" />\n<Fa icon={faQuoteRight} pull=\"right\" size=\"2x\" />\nGatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that\u2019s no matter \u2014 tomorrow we will run faster, stretch our arms further... And one fine morning \u2014 So we beat on, boats against the current, borne back ceaselessly into the past."],
      powerTransforms: ["<Fa icon={faMagic} size=\"4x\" rotate={90} style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate={180} style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"270\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"30\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"-30\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"vertical\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"horizontal\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"both\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"both\" style=\"background: mistyrose\"/>"],
      duotoneIcons: ["import {\n  faCamera,\n  faFireAlt,\n  faBusAlt,\n  faFillDrip,\n} from '@fortawesome/pro-duotone-svg-icons';", "<Fa icon={faCamera} size=\"3x\" />\n<Fa icon={faFireAlt} size=\"3x\" />\n<Fa icon={faBusAlt} size=\"3x\" />\n<Fa icon={faFillDrip} size=\"3x\" />", "<Fa icon={faCamera} size=\"3x\" />\n<Fa icon={faCamera} size=\"3x\" swapOpacity />\n<Fa icon={faFireAlt} size=\"3x\" />\n<Fa icon={faFireAlt} size=\"3x\" swapOpacity />\n<Fa icon={faBusAlt} size=\"3x\" />\n<Fa icon={faBusAlt} size=\"3x\" swapOpacity />\n<Fa icon={faFillDrip} size=\"3x\" />\n<Fa icon={faFillDrip} size=\"3x\" swapOpacity />", "<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.2} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.4} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.6} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.8} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={1} />", "<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.2} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.4} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.6} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.8} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={1} />", "<Fa icon={faBusAlt} size=\"3x\" primaryColor=\"gold\" />\n<Fa icon={faBusAlt} size=\"3x\" primaryColor=\"orangered\" />\n<Fa icon={faFillDrip} size=\"3x\" secondaryColor=\"limegreen\" />\n<Fa icon={faFillDrip} size=\"3x\" secondaryColor=\"rebeccapurple\" />\n<Fa icon={faBatteryFull} size=\"3x\" primaryColor=\"limegreen\" secondaryColor=\"dimgray\" />\n<Fa icon={faBatteryQuarter} size=\"3x\" primaryColor=\"orange\" secondaryColor=\"dimgray\" />", "<Fa icon={faBook} size=\"3x\" secondaryOpacity={1} primaryColor=\"lightseagreen\" secondaryColor=\"linen\" />\n<Fa icon={faBookSpells} size=\"3x\" secondaryOpacity={1} primaryColor=\"mediumpurple\" secondaryColor=\"linen\" />\n<Fa icon={faBookMedical} size=\"3x\" secondaryOpacity={1} primaryColor=\"crimson\" secondaryColor=\"linen\" />\n<Fa icon={faBookUser} size=\"3x\" secondaryOpacity={1} primaryColor=\"peru\" secondaryColor=\"linen\" />\n<Fa icon={faToggleOff} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"gray\" />\n<Fa icon={faToggleOn} size=\"3x\" secondaryOpacity={1} primaryColor=\"dodgerblue\" secondaryColor=\"white\" />\n<Fa icon={faFilePlus} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"limegreen\" />\n<Fa icon={faFileExclamation} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"gold\" />\n<Fa icon={faFileTimes} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"tomato\" />", "<Fa icon={faCrow} size=\"3x\" secondaryOpacity={1} primaryColor=\"dodgerblue\" secondaryColor=\"gold\" />\n<Fa icon={faCampfire} size=\"3x\" secondaryOpacity={1} primaryColor=\"sienna\" secondaryColor=\"red\" />\n<Fa icon={faBirthdayCake} size=\"3x\" secondaryOpacity={1} primaryColor=\"pink\" secondaryColor=\"palevioletred\" />\n<Fa icon={faEar} size=\"3x\" secondaryOpacity={1} primaryColor=\"sandybrown\" secondaryColor=\"bisque\" />\n<Fa icon={faCorn} size=\"3x\" secondaryOpacity={1} primaryColor=\"mediumseagreen\" secondaryColor=\"gold\" />\n<Fa icon={faCookieBite} size=\"3x\" secondaryOpacity={1} primaryColor=\"saddlebrown\" secondaryColor=\"burlywood\" />", "const themeRavenclaw = {\n  secondaryOpacity: 1,\n  primaryColor: '#0438a1',\n  secondaryColor: '#6c6c6c',\n};", "<Fa icon={faHatWizard} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faFlaskPotion} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faWandMagic} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faScarf} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faBookSpells} size=\"3x\" {...themeRavenclaw} />"]
    };
    return {
      themeRavenclaw: themeRavenclaw,
      codes: codes
    };
  }

  var Docs =
  /*#__PURE__*/
  function (_SvelteComponent) {
    _inheritsLoose(Docs, _SvelteComponent);

    function Docs(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$2, create_fragment$2, safe_not_equal, []);
      return _this;
    }

    return Docs;
  }(SvelteComponent);

  function create_fragment$3(ctx) {
    var div, t, current;
    var showcase = new Showcase({});
    var docs = new Docs({});
    return {
      c: function c() {
        div = element("div");
        showcase.$$.fragment.c();
        t = space();
        docs.$$.fragment.c();
        attr(div, "class", "container my-4");
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        mount_component(showcase, div, null);
        append(div, t);
        mount_component(docs, div, null);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(showcase.$$.fragment, local);
        transition_in(docs.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(showcase.$$.fragment, local);
        transition_out(docs.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) {
          detach(div);
        }

        destroy_component(showcase);
        destroy_component(docs);
      }
    };
  }

  var App =
  /*#__PURE__*/
  function (_SvelteComponent) {
    _inheritsLoose(App, _SvelteComponent);

    function App(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$3, safe_not_equal, []);
      return _this;
    }

    return App;
  }(SvelteComponent);

  new App({
    target: document.getElementById('app')
  });

}(SvelteFa));
