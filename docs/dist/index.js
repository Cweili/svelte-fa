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
    get_current_component().$$.after_render.push(fn);
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
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];

  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }

  function add_binding_callback(fn) {
    binding_callbacks.push(fn);
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
        binding_callbacks.shift()();
      } // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...


      while (render_callbacks.length) {
        var callback = render_callbacks.pop();

        if (!seen_callbacks.has(callback)) {
          callback(); // ...so guard against infinite loops

          seen_callbacks.add(callback);
        }
      }
    } while (dirty_components.length);

    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }

    update_scheduled = false;
  }

  function update($$) {
    if ($$.fragment) {
      $$.update($$.dirty);
      run_all($$.before_render);
      $$.fragment.p($$.dirty, $$.ctx);
      $$.dirty = null;
      $$.after_render.forEach(add_render_callback);
    }
  }

  var outros;

  function group_outros() {
    outros = {
      remaining: 0,
      callbacks: []
    };
  }

  function check_outros() {
    if (!outros.remaining) {
      run_all(outros.callbacks);
    }
  }

  function on_outro(callback) {
    outros.callbacks.push(callback);
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
      if (block.i) block.i(1);
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

  function mount_component(component, target, anchor) {
    var _component$$$ = component.$$,
        fragment = _component$$$.fragment,
        on_mount = _component$$$.on_mount,
        on_destroy = _component$$$.on_destroy,
        after_render = _component$$$.after_render;
    fragment.m(target, anchor); // onMount happens after the initial afterUpdate. Because
    // afterUpdate callbacks happen in reverse order (inner first)
    // we schedule onMount callbacks before afterUpdate callbacks

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
    after_render.forEach(add_render_callback);
  }

  function destroy(component, detaching) {
    if (component.$$) {
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

  function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
    var parent_component = current_component;
    set_current_component(component);
    var props = options.props || {};
    var $$ = component.$$ = {
      fragment: null,
      ctx: null,
      // state
      props: prop_names,
      update: noop,
      not_equal: not_equal$$1,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      before_render: [],
      after_render: [],
      context: new Map(parent_component ? parent_component.$$.context : []),
      // everything else
      callbacks: blank_object(),
      dirty: null
    };
    var ready = false;
    $$.ctx = instance ? instance(component, props, function (key, value) {
      if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
        if ($$.bound[key]) $$.bound[key](value);
        if (ready) make_dirty(component, key);
      }
    }) : props;
    $$.update();
    ready = true;
    run_all($$.before_render);
    $$.fragment = create_fragment($$.ctx);

    if (options.target) {
      if (options.hydrate) {
        $$.fragment.l(children(options.target));
      } else {
        $$.fragment.c();
      }

      if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
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

      _proto.attributeChangedCallback = function attributeChangedCallback(attr$$1, oldValue, newValue) {
        this[attr$$1] = newValue;
      };

      _proto.$destroy = function $destroy() {
        destroy(this, true);
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
      destroy(this, true);
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

  var faBook={prefix:'fas',iconName:'book',icon:[448,512,[],"f02d","M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"]};var faCog={prefix:'fas',iconName:'cog',icon:[512,512,[],"f013","M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"]};var faFlag={prefix:'fas',iconName:'flag',icon:[512,512,[],"f024","M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z"]};var faHome={prefix:'fas',iconName:'home',icon:[576,512,[],"f015","M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"]};var faInfo={prefix:'fas',iconName:'info',icon:[192,512,[],"f129","M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"]};var faMagic={prefix:'fas',iconName:'magic',icon:[512,512,[],"f0d0","M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z"]};var faPencilAlt={prefix:'fas',iconName:'pencil-alt',icon:[512,512,[],"f303","M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"]};var faQuoteLeft={prefix:'fas',iconName:'quote-left',icon:[512,512,[],"f10d","M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"]};var faQuoteRight={prefix:'fas',iconName:'quote-right',icon:[512,512,[],"f10e","M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"]};

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
        t_value = ctx.p,
        t,
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
        t = text(t_value);
        button.className = button_class_value = "" + ("btn btn-" + (ctx.model.pull == (ctx.p == 'None' ? ctx.undefined : ctx.p.toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh";
        button.type = "button";
        dispose = listen(button, "click", click_handler);
        this.first = button;
      },
      m: function m(target, anchor) {
        insert(target, button, anchor);
        append(button, t);
      },
      p: function p(changed, new_ctx) {
        ctx = new_ctx;

        if (changed.model && button_class_value !== (button_class_value = "" + ("btn btn-" + (ctx.model.pull == (ctx.p == 'None' ? ctx.undefined : ctx.p.toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh")) {
          button.className = button_class_value;
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
        t_value = ctx.f,
        t,
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
        t = text(t_value);
        button.className = button_class_value = "" + ("btn btn-" + (ctx.model.flip == (ctx.f == 'None' ? ctx.undefined : ctx.f.toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh";
        button.type = "button";
        dispose = listen(button, "click", click_handler_1);
        this.first = button;
      },
      m: function m(target, anchor) {
        insert(target, button, anchor);
        append(button, t);
      },
      p: function p(changed, new_ctx) {
        ctx = new_ctx;

        if (changed.model && button_class_value !== (button_class_value = "" + ("btn btn-" + (ctx.model.flip == (ctx.f == 'None' ? ctx.undefined : ctx.f.toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh")) {
          button.className = button_class_value;
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
        div.className = "col text-center hue svelte-1a2mimh";
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
        fa.$$.fragment.i(local);
        current = true;
      },
      o: function o(local) {
        fa.$$.fragment.o(local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) {
          detach(div);
        }

        fa.$destroy();
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

    function outro_block(i, detaching, local) {
      if (each_blocks[i]) {
        if (detaching) {
          on_outro(function () {
            each_blocks[i].d(detaching);
            each_blocks[i] = null;
          });
        }

        each_blocks[i].o(local);
      }
    }

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

        h1.className = "hue svelte-1a2mimh";
        p.className = "lead mb-5";
        label0.className = "col-sm-3 col-form-label";
        set_input_type(input0, "range");
        input0.className = "form-control-range";
        input0.min = "1";
        input0.max = "10";
        input0.step = "0.1";
        div0.className = "col-md-8 py-2";
        div1.className = "form-control text-center";
        div2.className = "col-md-4";
        div3.className = "col-sm-9 row";
        div4.className = "form-group row";
        label1.className = "col-sm-3 col-form-label";
        div5.className = "btn-group";
        attr(div5, "role", "group");
        attr(div5, "aria-label", "Basic example");
        div6.className = "col-sm-9";
        div7.className = "form-group row";
        label2.className = "col-sm-3 col-form-label";
        div8.className = "btn-group";
        attr(div8, "role", "group");
        attr(div8, "aria-label", "Basic example");
        div9.className = "col-sm-9";
        div10.className = "form-group row";
        label3.className = "col-sm-3 col-form-label";
        set_input_type(input1, "range");
        input1.className = "form-control-range";
        input1.min = "-360";
        input1.max = "360";
        input1.step = "1";
        div11.className = "col-md-8 py-2";
        div12.className = "form-control text-center";
        div13.className = "col-md-4";
        div14.className = "col-sm-9 row";
        div15.className = "form-group row";
        div16.className = "col-md";
        div17.className = "col-md row";
        div18.className = "row";
        div19.className = "jumbotron";
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
              each_blocks[i].i(1);
            } else {
              each_blocks[i] = create_each_block(_child_ctx2);
              each_blocks[i].c();
              each_blocks[i].i(1);
              each_blocks[i].m(div17, null);
            }
          }

          group_outros();

          for (; i < each_blocks.length; i += 1) {
            outro_block(i, 1, 1);
          }

          check_outros();
        }
      },
      i: function i(local) {
        if (current) return;

        for (var i = 0; i < each_value.length; i += 1) {
          each_blocks[i].i();
        }

        current = true;
      },
      o: function o(local) {
        each_blocks = each_blocks.filter(Boolean);

        for (var _i = 0; _i < each_blocks.length; _i += 1) {
          outro_block(_i, 0);
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

  function create_fragment$1(ctx) {
    var div, pre, code_1, t, code_1_class_value;
    return {
      c: function c() {
        div = element("div");
        pre = element("pre");
        code_1 = element("code");
        t = text(ctx.code);
        code_1.className = code_1_class_value = "language-" + ctx.lang;
        div.className = "shadow-sm mb-3 rounded";
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        append(div, pre);
        append(pre, code_1);
        append(code_1, t);
        add_binding_callback(function () {
          return ctx.code_1_binding(code_1, null);
        });
      },
      p: function p(changed, ctx) {
        if (changed.code) {
          set_data(t, ctx.code);
        }

        if (changed.items) {
          ctx.code_1_binding(null, code_1);
          ctx.code_1_binding(code_1, null);
        }

        if (changed.lang && code_1_class_value !== (code_1_class_value = "language-" + ctx.lang)) {
          code_1.className = code_1_class_value;
        }
      },
      i: noop,
      o: noop,
      d: function d(detaching) {
        if (detaching) {
          detach(div);
        }

        ctx.code_1_binding(null, code_1);
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

    function code_1_binding($$node, check) {
      el = $$node;
      $$invalidate('el', el);
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
    var div12, h40, t1, t2, t3, h41, t5, div0, t6, t7, t8, div2, div1, t9, t10, h42, t12, h50, t14, div3, t15, t16, t17, t18, t19, t20, t21, t22, t23, h51, t25, div9, div4, t26, t27, div5, t28, t29, div6, t30, t31, div7, t32, t33, div8, t34, t35, t36, h52, t38, div10, t39, t40, t41, t42, h43, t44, h53, t46, div11, t47, t48, t49, t50, t51, t52, t53, t54, t55, current;
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
        icon: faFlag
      }
    });
    var docscode2 = new Docs_code({
      props: {
        code: ctx.codes.basicUse[0]
      }
    });
    var fa1 = new Fa({
      props: {
        icon: faFlag
      }
    });
    var docscode3 = new Docs_code({
      props: {
        code: ctx.codes.basicUse[1]
      }
    });
    var fa2 = new Fa({
      props: {
        icon: faFlag,
        size: "xs"
      }
    });
    var fa3 = new Fa({
      props: {
        icon: faFlag,
        size: "sm"
      }
    });
    var fa4 = new Fa({
      props: {
        icon: faFlag,
        size: "lg"
      }
    });
    var fa5 = new Fa({
      props: {
        icon: faFlag,
        size: "2x"
      }
    });
    var fa6 = new Fa({
      props: {
        icon: faFlag,
        size: "2.5x"
      }
    });
    var fa7 = new Fa({
      props: {
        icon: faFlag,
        size: "5x"
      }
    });
    var fa8 = new Fa({
      props: {
        icon: faFlag,
        size: "7x"
      }
    });
    var fa9 = new Fa({
      props: {
        icon: faFlag,
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
        icon: faHome,
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
        icon: faBook,
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
        icon: faCog,
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
        icon: faMagic,
        rotate: 90,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa18 = new Fa({
      props: {
        icon: faMagic,
        rotate: 180,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa19 = new Fa({
      props: {
        icon: faMagic,
        size: "4x",
        rotate: "270",
        style: "background: mistyrose"
      }
    });
    var fa20 = new Fa({
      props: {
        icon: faMagic,
        size: "4x",
        rotate: "30",
        style: "background: mistyrose"
      }
    });
    var fa21 = new Fa({
      props: {
        icon: faMagic,
        size: "4x",
        rotate: "-30",
        style: "background: mistyrose"
      }
    });
    var fa22 = new Fa({
      props: {
        icon: faMagic,
        size: "4x",
        flip: "vertical",
        style: "background: mistyrose"
      }
    });
    var fa23 = new Fa({
      props: {
        icon: faMagic,
        size: "4x",
        flip: "horizontal",
        style: "background: mistyrose"
      }
    });
    var fa24 = new Fa({
      props: {
        icon: faMagic,
        size: "4x",
        flip: "both",
        style: "background: mistyrose"
      }
    });
    var fa25 = new Fa({
      props: {
        icon: faMagic,
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
    return {
      c: function c() {
        div12 = element("div");
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
        div0.className = "shadow-sm p-3 mb-3 rounded";
        set_style(div1, "font-size", "3em");
        set_style(div1, "color", "tomato");
        div2.className = "shadow-sm p-3 mb-3 rounded";
        div3.className = "shadow-sm p-3 mb-3 rounded";
        div9.className = "shadow-sm p-3 mb-3 rounded";
        div10.className = "shadow-sm p-3 mb-3 rounded clearfix";
        div11.className = "shadow-sm p-3 mb-3 rounded";
      },
      m: function m(target, anchor) {
        insert(target, div12, anchor);
        append(div12, h40);
        append(div12, t1);
        mount_component(docscode0, div12, null);
        append(div12, t2);
        mount_component(docscode1, div12, null);
        append(div12, t3);
        append(div12, h41);
        append(div12, t5);
        append(div12, div0);
        mount_component(fa0, div0, null);
        append(div0, t6);
        append(div12, t7);
        mount_component(docscode2, div12, null);
        append(div12, t8);
        append(div12, div2);
        append(div2, div1);
        mount_component(fa1, div1, null);
        append(div12, t9);
        mount_component(docscode3, div12, null);
        append(div12, t10);
        append(div12, h42);
        append(div12, t12);
        append(div12, h50);
        append(div12, t14);
        append(div12, div3);
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
        append(div12, t22);
        mount_component(docscode4, div12, null);
        append(div12, t23);
        append(div12, h51);
        append(div12, t25);
        append(div12, div9);
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
        append(div12, t35);
        mount_component(docscode5, div12, null);
        append(div12, t36);
        append(div12, h52);
        append(div12, t38);
        append(div12, div10);
        mount_component(fa15, div10, null);
        append(div10, t39);
        mount_component(fa16, div10, null);
        append(div10, t40);
        append(div12, t41);
        mount_component(docscode6, div12, null);
        append(div12, t42);
        append(div12, h43);
        append(div12, t44);
        append(div12, h53);
        append(div12, t46);
        append(div12, div11);
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
        append(div12, t55);
        mount_component(docscode7, div12, null);
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
        if (changed.faFlag) fa0_changes.icon = faFlag;
        fa0.$set(fa0_changes);
        var docscode2_changes = {};
        if (changed.codes) docscode2_changes.code = ctx.codes.basicUse[0];
        docscode2.$set(docscode2_changes);
        var fa1_changes = {};
        if (changed.faFlag) fa1_changes.icon = faFlag;
        fa1.$set(fa1_changes);
        var docscode3_changes = {};
        if (changed.codes) docscode3_changes.code = ctx.codes.basicUse[1];
        docscode3.$set(docscode3_changes);
        var fa2_changes = {};
        if (changed.faFlag) fa2_changes.icon = faFlag;
        fa2.$set(fa2_changes);
        var fa3_changes = {};
        if (changed.faFlag) fa3_changes.icon = faFlag;
        fa3.$set(fa3_changes);
        var fa4_changes = {};
        if (changed.faFlag) fa4_changes.icon = faFlag;
        fa4.$set(fa4_changes);
        var fa5_changes = {};
        if (changed.faFlag) fa5_changes.icon = faFlag;
        fa5.$set(fa5_changes);
        var fa6_changes = {};
        if (changed.faFlag) fa6_changes.icon = faFlag;
        fa6.$set(fa6_changes);
        var fa7_changes = {};
        if (changed.faFlag) fa7_changes.icon = faFlag;
        fa7.$set(fa7_changes);
        var fa8_changes = {};
        if (changed.faFlag) fa8_changes.icon = faFlag;
        fa8.$set(fa8_changes);
        var fa9_changes = {};
        if (changed.faFlag) fa9_changes.icon = faFlag;
        fa9.$set(fa9_changes);
        var docscode4_changes = {};
        if (changed.codes) docscode4_changes.code = ctx.codes.additionalStyling[0];
        docscode4.$set(docscode4_changes);
        var fa10_changes = {};
        if (changed.faHome) fa10_changes.icon = faHome;
        fa10.$set(fa10_changes);
        var fa11_changes = {};
        if (changed.faInfo) fa11_changes.icon = faInfo;
        fa11.$set(fa11_changes);
        var fa12_changes = {};
        if (changed.faBook) fa12_changes.icon = faBook;
        fa12.$set(fa12_changes);
        var fa13_changes = {};
        if (changed.faPencilAlt) fa13_changes.icon = faPencilAlt;
        fa13.$set(fa13_changes);
        var fa14_changes = {};
        if (changed.faCog) fa14_changes.icon = faCog;
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
        if (changed.faMagic) fa17_changes.icon = faMagic;
        fa17.$set(fa17_changes);
        var fa18_changes = {};
        if (changed.faMagic) fa18_changes.icon = faMagic;
        fa18.$set(fa18_changes);
        var fa19_changes = {};
        if (changed.faMagic) fa19_changes.icon = faMagic;
        fa19.$set(fa19_changes);
        var fa20_changes = {};
        if (changed.faMagic) fa20_changes.icon = faMagic;
        fa20.$set(fa20_changes);
        var fa21_changes = {};
        if (changed.faMagic) fa21_changes.icon = faMagic;
        fa21.$set(fa21_changes);
        var fa22_changes = {};
        if (changed.faMagic) fa22_changes.icon = faMagic;
        fa22.$set(fa22_changes);
        var fa23_changes = {};
        if (changed.faMagic) fa23_changes.icon = faMagic;
        fa23.$set(fa23_changes);
        var fa24_changes = {};
        if (changed.faMagic) fa24_changes.icon = faMagic;
        fa24.$set(fa24_changes);
        var fa25_changes = {};
        if (changed.faMagic) fa25_changes.icon = faMagic;
        fa25.$set(fa25_changes);
        var docscode7_changes = {};
        if (changed.codes) docscode7_changes.code = ctx.codes.powerTransforms[0];
        docscode7.$set(docscode7_changes);
      },
      i: function i(local) {
        if (current) return;
        docscode0.$$.fragment.i(local);
        docscode1.$$.fragment.i(local);
        fa0.$$.fragment.i(local);
        docscode2.$$.fragment.i(local);
        fa1.$$.fragment.i(local);
        docscode3.$$.fragment.i(local);
        fa2.$$.fragment.i(local);
        fa3.$$.fragment.i(local);
        fa4.$$.fragment.i(local);
        fa5.$$.fragment.i(local);
        fa6.$$.fragment.i(local);
        fa7.$$.fragment.i(local);
        fa8.$$.fragment.i(local);
        fa9.$$.fragment.i(local);
        docscode4.$$.fragment.i(local);
        fa10.$$.fragment.i(local);
        fa11.$$.fragment.i(local);
        fa12.$$.fragment.i(local);
        fa13.$$.fragment.i(local);
        fa14.$$.fragment.i(local);
        docscode5.$$.fragment.i(local);
        fa15.$$.fragment.i(local);
        fa16.$$.fragment.i(local);
        docscode6.$$.fragment.i(local);
        fa17.$$.fragment.i(local);
        fa18.$$.fragment.i(local);
        fa19.$$.fragment.i(local);
        fa20.$$.fragment.i(local);
        fa21.$$.fragment.i(local);
        fa22.$$.fragment.i(local);
        fa23.$$.fragment.i(local);
        fa24.$$.fragment.i(local);
        fa25.$$.fragment.i(local);
        docscode7.$$.fragment.i(local);
        current = true;
      },
      o: function o(local) {
        docscode0.$$.fragment.o(local);
        docscode1.$$.fragment.o(local);
        fa0.$$.fragment.o(local);
        docscode2.$$.fragment.o(local);
        fa1.$$.fragment.o(local);
        docscode3.$$.fragment.o(local);
        fa2.$$.fragment.o(local);
        fa3.$$.fragment.o(local);
        fa4.$$.fragment.o(local);
        fa5.$$.fragment.o(local);
        fa6.$$.fragment.o(local);
        fa7.$$.fragment.o(local);
        fa8.$$.fragment.o(local);
        fa9.$$.fragment.o(local);
        docscode4.$$.fragment.o(local);
        fa10.$$.fragment.o(local);
        fa11.$$.fragment.o(local);
        fa12.$$.fragment.o(local);
        fa13.$$.fragment.o(local);
        fa14.$$.fragment.o(local);
        docscode5.$$.fragment.o(local);
        fa15.$$.fragment.o(local);
        fa16.$$.fragment.o(local);
        docscode6.$$.fragment.o(local);
        fa17.$$.fragment.o(local);
        fa18.$$.fragment.o(local);
        fa19.$$.fragment.o(local);
        fa20.$$.fragment.o(local);
        fa21.$$.fragment.o(local);
        fa22.$$.fragment.o(local);
        fa23.$$.fragment.o(local);
        fa24.$$.fragment.o(local);
        fa25.$$.fragment.o(local);
        docscode7.$$.fragment.o(local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) {
          detach(div12);
        }

        docscode0.$destroy();
        docscode1.$destroy();
        fa0.$destroy();
        docscode2.$destroy();
        fa1.$destroy();
        docscode3.$destroy();
        fa2.$destroy();
        fa3.$destroy();
        fa4.$destroy();
        fa5.$destroy();
        fa6.$destroy();
        fa7.$destroy();
        fa8.$destroy();
        fa9.$destroy();
        docscode4.$destroy();
        fa10.$destroy();
        fa11.$destroy();
        fa12.$destroy();
        fa13.$destroy();
        fa14.$destroy();
        docscode5.$destroy();
        fa15.$destroy();
        fa16.$destroy();
        docscode6.$destroy();
        fa17.$destroy();
        fa18.$destroy();
        fa19.$destroy();
        fa20.$destroy();
        fa21.$destroy();
        fa22.$destroy();
        fa23.$destroy();
        fa24.$destroy();
        fa25.$destroy();
        docscode7.$destroy();
      }
    };
  }

  function instance$2($$self) {
    var codes = {
      installation: ['npm install svelte-fa --save', "import Fa from 'svelte-fa'\nimport { faFlag } from '@fortawesome/free-solid-svg-icons'"],
      basicUse: ['<Fa icon={faFlag} /> Flag', "<div style=\"font-size: 3em; color: tomato\">\n  <Fa icon={faFlag} />\n</div>"],
      additionalStyling: ["<Fa icon={faFlag} size=\"xs\" />\n<Fa icon={faFlag} size=\"sm\" />\n<Fa icon={faFlag} size=\"lg\" />\n<Fa icon={faFlag} size=\"2x\" />\n<Fa icon={faFlag} size=\"2.5x\" />\n<Fa icon={faFlag} size=\"5x\" />\n<Fa icon={faFlag} size=\"7x\" />\n<Fa icon={faFlag} size=\"10x\" />", "<div>\n  <Fa icon={faHome} fw style=\"background: mistyrose\" /> Home\n</div>\n<div>\n  <Fa icon={faInfo} fw style=\"background: mistyrose\" /> Info\n</div>\n<div>\n  <Fa icon={faBook} fw style=\"background: mistyrose\" /> Library\n</div>\n<div>\n  <Fa icon={faPencilAlt} fw style=\"background: mistyrose\" /> Applications\n</div>\n<div>\n  <Fa icon={faCog} fw style=\"background: mistyrose\" /> Settins\n</div>", "<Fa icon={faQuoteLeft} pull=\"left\" size=\"2x\" />\n<Fa icon={faQuoteRight} pull=\"right\" size=\"2x\" />\nGatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that\u2019s no matter \u2014 tomorrow we will run faster, stretch our arms further... And one fine morning \u2014 So we beat on, boats against the current, borne back ceaselessly into the past."],
      powerTransforms: ["<Fa icon={faMagic} size=\"4x\" rotate={90} style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate={180} style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"270\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"30\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"-30\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"vertical\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"horizontal\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"both\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"both\" style=\"background: mistyrose\"/>"]
    };
    return {
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
        div.className = "container my-4";
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
        showcase.$$.fragment.i(local);
        docs.$$.fragment.i(local);
        current = true;
      },
      o: function o(local) {
        showcase.$$.fragment.o(local);
        docs.$$.fragment.o(local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) {
          detach(div);
        }

        showcase.$destroy();
        docs.$destroy();
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
