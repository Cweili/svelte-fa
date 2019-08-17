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

  function exclude_internal_props(props) {
    var result = {};

    for (var k in props) {
      if (k[0] !== '$') result[k] = props[k];
    }

    return result;
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

  function set_attributes(node, attributes) {
    for (var key in attributes) {
      if (key === 'style') {
        node.style.cssText = attributes[key];
      } else if (key in node) {
        node[key] = attributes[key];
      } else {
        attr(node, key, attributes[key]);
      }
    }
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

      var _proto2 = SvelteElement.prototype;

      _proto2.connectedCallback = function connectedCallback() {
        // @ts-ignore todo: improve typings
        for (var key in this.$$.slotted) {
          // @ts-ignore todo: improve typings
          this.appendChild(this.$$.slotted[key]);
        }
      };

      _proto2.attributeChangedCallback = function attributeChangedCallback(attr, _oldValue, newValue) {
        this[attr] = newValue;
      };

      _proto2.$destroy = function $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      };

      _proto2.$on = function $on(type, callback) {
        // TODO should this delegate to addEventListener?
        var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return function () {
          var index = callbacks.indexOf(callback);
          if (index !== -1) callbacks.splice(index, 1);
        };
      };

      _proto2.$set = function $set() {// overridden by instance, if it has props
      };

      return SvelteElement;
    }(_wrapNativeSuper(HTMLElement));
  }

  var SvelteComponent =
  /*#__PURE__*/
  function () {
    function SvelteComponent() {}

    var _proto3 = SvelteComponent.prototype;

    _proto3.$destroy = function $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    };

    _proto3.$on = function $on(type, callback) {
      var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return function () {
        var index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    };

    _proto3.$set = function $set() {// overridden by instance, if it has props
    };

    return SvelteComponent;
  }();

  var faBook={prefix:'fas',iconName:'book',icon:[448,512,[],"f02d","M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"]};var faCog={prefix:'fas',iconName:'cog',icon:[512,512,[],"f013","M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"]};var faFlag={prefix:'fas',iconName:'flag',icon:[512,512,[],"f024","M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z"]};var faHome={prefix:'fas',iconName:'home',icon:[576,512,[],"f015","M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"]};var faInfo={prefix:'fas',iconName:'info',icon:[192,512,[],"f129","M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"]};var faLink={prefix:'fas',iconName:'link',icon:[512,512,[],"f0c1","M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"]};var faMagic={prefix:'fas',iconName:'magic',icon:[512,512,[],"f0d0","M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z"]};var faPencilAlt={prefix:'fas',iconName:'pencil-alt',icon:[512,512,[],"f303","M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"]};var faQuoteLeft={prefix:'fas',iconName:'quote-left',icon:[512,512,[],"f10d","M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"]};var faQuoteRight={prefix:'fas',iconName:'quote-right',icon:[512,512,[],"f10e","M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"]};

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
  } // (94:14) {#each pull as p (p)}


  function create_each_block_2(key_1, ctx) {
    var button,
        t0_value = ctx.p + "",
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
  } // (114:14) {#each flip as f (f)}


  function create_each_block_1(key_1, ctx) {
    var button,
        t0_value = ctx.f + "",
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
  } // (149:6) {#each icons as icon, name}


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
        p0,
        t6,
        p1,
        t12,
        form,
        div4,
        label0,
        t14,
        div3,
        div0,
        input0,
        t15,
        div2,
        div1,
        t16_value = ctx.model.size + "",
        t16,
        t17,
        t18,
        div7,
        label1,
        t20,
        div6,
        div5,
        each_blocks_2 = [],
        each0_lookup = new Map(),
        t21,
        div10,
        label2,
        t23,
        div9,
        div8,
        each_blocks_1 = [],
        each1_lookup = new Map(),
        t24,
        div15,
        label3,
        t26,
        div14,
        div11,
        input1,
        t27,
        div13,
        div12,
        t28_value = ctx.model.rotate + "",
        t28,
        t29,
        t30,
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
        h1.innerHTML = "<strong><a href=\"https://github.com/Cweili/svelte-fa\" target=\"_blank\">svelte-fa</a></strong>";
        t1 = space();
        p0 = element("p");
        p0.innerHTML = "<a href=\"https://www.npmjs.com/package/svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/npm/v/svelte-fa.svg\" alt=\"npm version\"></a> <a href=\"https://bundlephobia.com/result?p=svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/bundlephobia/minzip/svelte-fa.svg\" alt=\"bundle size\"></a> <a href=\"https://github.com/Cweili/svelte-fa/blob/master/LICENSE\" target=\"_blank\"><img src=\"https://img.shields.io/npm/l/svelte-fa.svg\" alt=\"MIT licence\"></a> <a href=\"https://www.npmjs.com/package/svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/npm/dt/svelte-fa.svg\" alt=\"npm downloads\"></a> <a href=\"https://github.com/Cweili/svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/github/issues/Cweili/svelte-fa.svg\" alt=\"github issues\"></a>";
        t6 = space();
        p1 = element("p");
        p1.innerHTML = "\n\t\t\t        Tiny <a class=\"hue svelte-1a2mimh\" href=\"https://fontawesome.com/\" target=\"_blank\">FontAwesome 5</a> component for <a class=\"hue svelte-1a2mimh\" href=\"https://svelte.dev/\" target=\"_blank\">Svelte</a>.\n\t\t\t      ";
        t12 = space();
        form = element("form");
        div4 = element("div");
        label0 = element("label");
        label0.textContent = "Icon Sizes";
        t14 = space();
        div3 = element("div");
        div0 = element("div");
        input0 = element("input");
        t15 = space();
        div2 = element("div");
        div1 = element("div");
        t16 = text(t16_value);
        t17 = text("x");
        t18 = space();
        div7 = element("div");
        label1 = element("label");
        label1.textContent = "Pulled Icons";
        t20 = space();
        div6 = element("div");
        div5 = element("div");

        for (i = 0; i < each_blocks_2.length; i += 1) {
          each_blocks_2[i].c();
        }

        t21 = space();
        div10 = element("div");
        label2 = element("label");
        label2.textContent = "Flip";
        t23 = space();
        div9 = element("div");
        div8 = element("div");

        for (i = 0; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].c();
        }

        t24 = space();
        div15 = element("div");
        label3 = element("label");
        label3.textContent = "Rotate";
        t26 = space();
        div14 = element("div");
        div11 = element("div");
        input1 = element("input");
        t27 = space();
        div13 = element("div");
        div12 = element("div");
        t28 = text(t28_value);
        t29 = text("deg");
        t30 = space();
        div17 = element("div");

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        attr(h1, "class", "hue svelte-1a2mimh");
        attr(p1, "class", "lead mb-5");
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
        append(div16, p0);
        append(div16, t6);
        append(div16, p1);
        append(div16, t12);
        append(div16, form);
        append(form, div4);
        append(div4, label0);
        append(div4, t14);
        append(div4, div3);
        append(div3, div0);
        append(div0, input0);
        input0.value = ctx.model.size;
        append(div3, t15);
        append(div3, div2);
        append(div2, div1);
        append(div1, t16);
        append(div1, t17);
        append(form, t18);
        append(form, div7);
        append(div7, label1);
        append(div7, t20);
        append(div7, div6);
        append(div6, div5);

        for (i = 0; i < each_blocks_2.length; i += 1) {
          each_blocks_2[i].m(div5, null);
        }

        append(form, t21);
        append(form, div10);
        append(div10, label2);
        append(div10, t23);
        append(div10, div9);
        append(div9, div8);

        for (i = 0; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].m(div8, null);
        }

        append(form, t24);
        append(form, div15);
        append(div15, label3);
        append(div15, t26);
        append(div15, div14);
        append(div14, div11);
        append(div11, input1);
        input1.value = ctx.model.rotate;
        append(div14, t27);
        append(div14, div13);
        append(div13, div12);
        append(div12, t28);
        append(div12, t29);
        append(div18, t30);
        append(div18, div17);

        for (var i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div17, null);
        }

        current = true;
      },
      p: function p(changed, ctx) {
        if (changed.model) input0.value = ctx.model.size;

        if ((!current || changed.model) && t16_value !== (t16_value = ctx.model.size + "")) {
          set_data(t16, t16_value);
        }

        var each_value_2 = ctx.pull;
        each_blocks_2 = update_keyed_each(each_blocks_2, changed, get_key, 1, ctx, each_value_2, each0_lookup, div5, destroy_block, create_each_block_2, null, get_each_context_2);
        var each_value_1 = ctx.flip;
        each_blocks_1 = update_keyed_each(each_blocks_1, changed, get_key_1, 1, ctx, each_value_1, each1_lookup, div8, destroy_block, create_each_block_1, null, get_each_context_1);
        if (changed.model) input1.value = ctx.model.rotate;

        if ((!current || changed.model) && t28_value !== (t28_value = ctx.model.rotate + "")) {
          set_data(t28, t28_value);
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

  function add_css$1() {
    var style = element("style");
    style.id = 'svelte-tdv3q3-style';
    style.textContent = "img.svelte-tdv3q3{max-width:100%;max-height:48px}small.svelte-tdv3q3{position:absolute;right:1rem;bottom:.1rem;color:#ddd;z-index:-1}";
    append(document.head, style);
  }

  function create_fragment$2(ctx) {
    var div, img, t, small;
    var img_levels = [ctx.$$props, {
      class: "svelte-tdv3q3"
    }];
    var img_data = {};

    for (var i = 0; i < img_levels.length; i += 1) {
      img_data = assign(img_data, img_levels[i]);
    }

    return {
      c: function c() {
        div = element("div");
        img = element("img");
        t = space();
        small = element("small");
        small.textContent = "images © fontawesome.com";
        set_attributes(img, img_data);
        attr(small, "class", "svelte-tdv3q3");
        attr(div, "class", "position-relative shadow-sm p-3 mb-3 rounded");
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
        append(div, t);
        append(div, small);
      },
      p: function p(changed, ctx) {
        set_attributes(img, get_spread_update(img_levels, [changed.$$props && ctx.$$props, {
          class: "svelte-tdv3q3"
        }]));
      },
      i: noop,
      o: noop,
      d: function d(detaching) {
        if (detaching) {
          detach(div);
        }
      }
    };
  }

  function instance$2($$self, $$props, $$invalidate) {
    var _ref;

    $$self.$set = function ($$new_props) {
      $$invalidate('$$props', $$props = assign(assign({}, $$props), $$new_props));
    };

    return _ref = {
      $$props: $$props
    }, _ref["$$props"] = $$props = exclude_internal_props($$props), _ref;
  }

  var Docs_img =
  /*#__PURE__*/
  function (_SvelteComponent) {
    _inheritsLoose(Docs_img, _SvelteComponent);

    function Docs_img(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      if (!document.getElementById("svelte-tdv3q3-style")) add_css$1();
      init(_assertThisInitialized(_this), options, instance$2, create_fragment$2, safe_not_equal, []);
      return _this;
    }

    return Docs_img;
  }(SvelteComponent);

  function add_css$2() {
    var style = element("style");
    style.id = 'svelte-163f8cm-style';
    style.textContent = "a.svelte-163f8cm,a.svelte-163f8cm:visited{color:currentColor\n}small.svelte-163f8cm{visibility:hidden}a:hover+small.svelte-163f8cm{visibility:visible}";
    append(document.head, style);
  }

  function create_fragment$3(ctx) {
    var h4, a, t0, a_href_value, t1, small, h4_class_value, current;
    var fa = new Fa({
      props: {
        icon: faLink
      }
    });
    return {
      c: function c() {
        h4 = element("h4");
        a = element("a");
        t0 = text(ctx.title);
        t1 = space();
        small = element("small");
        fa.$$.fragment.c();
        attr(a, "href", a_href_value = "#" + ctx.id);
        attr(a, "class", "svelte-163f8cm");
        attr(small, "class", "svelte-163f8cm");
        attr(h4, "id", ctx.id);
        attr(h4, "class", h4_class_value = "h" + ctx.level);
      },
      m: function m(target, anchor) {
        insert(target, h4, anchor);
        append(h4, a);
        append(a, t0);
        append(h4, t1);
        append(h4, small);
        mount_component(fa, small, null);
        current = true;
      },
      p: function p(changed, ctx) {
        if (!current || changed.title) {
          set_data(t0, ctx.title);
        }

        if ((!current || changed.id) && a_href_value !== (a_href_value = "#" + ctx.id)) {
          attr(a, "href", a_href_value);
        }

        var fa_changes = {};
        if (changed.faLink) fa_changes.icon = faLink;
        fa.$set(fa_changes);

        if (!current || changed.id) {
          attr(h4, "id", ctx.id);
        }

        if ((!current || changed.level) && h4_class_value !== (h4_class_value = "h" + ctx.level)) {
          attr(h4, "class", h4_class_value);
        }
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
          detach(h4);
        }

        destroy_component(fa);
      }
    };
  }

  function instance$3($$self, $$props, $$invalidate) {
    var _$$props$level = $$props.level,
        level = _$$props$level === void 0 ? 4 : _$$props$level,
        _$$props$title = $$props.title,
        title = _$$props$title === void 0 ? '' : _$$props$title;
    var id;

    $$self.$set = function ($$props) {
      if ('level' in $$props) $$invalidate('level', level = $$props.level);
      if ('title' in $$props) $$invalidate('title', title = $$props.title);
    };

    $$self.$$.update = function ($$dirty) {
      if ($$dirty === void 0) {
        $$dirty = {
          title: 1
        };
      }

      if ($$dirty.title) {
        $$invalidate('id', id = title.toLowerCase().replace(/[^\w]/g, '-'));
      }
    };

    return {
      level: level,
      title: title,
      id: id
    };
  }

  var Docs_title =
  /*#__PURE__*/
  function (_SvelteComponent) {
    _inheritsLoose(Docs_title, _SvelteComponent);

    function Docs_title(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      if (!document.getElementById("svelte-163f8cm-style")) add_css$2();
      init(_assertThisInitialized(_this), options, instance$3, create_fragment$3, safe_not_equal, ["level", "title"]);
      return _this;
    }

    return Docs_title;
  }(SvelteComponent);

  function create_fragment$4(ctx) {
    var div12, t0, t1, t2, t3, div0, t4, t5, t6, div2, div1, t7, t8, t9, t10, div3, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, div9, div4, t21, t22, div5, t23, t24, div6, t25, t26, div7, t27, t28, div8, t29, t30, t31, t32, div10, t33, t34, t35, t36, t37, t38, div11, t39, t40, t41, t42, t43, t44, t45, t46, t47, t48, t49, t50, t51, t52, t53, t54, t55, t56, t57, t58, t59, t60, t61, t62, t63, t64, t65, t66, t67, t68, t69, t70, t71, current;
    var docstitle0 = new Docs_title({
      props: {
        title: "Installation"
      }
    });
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
    var docstitle1 = new Docs_title({
      props: {
        title: "Basic Use"
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
    var docstitle2 = new Docs_title({
      props: {
        title: "Additional Styling"
      }
    });
    var docstitle3 = new Docs_title({
      props: {
        title: "Icon Sizes",
        level: 5
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
    var docstitle4 = new Docs_title({
      props: {
        title: "Fixed Width Icons",
        level: 5
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
    var docstitle5 = new Docs_title({
      props: {
        title: "Pulled Icons",
        level: 5
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
    var docstitle6 = new Docs_title({
      props: {
        title: "Power Transforms"
      }
    });
    var docstitle7 = new Docs_title({
      props: {
        title: "Rotating & Flipping",
        level: 5
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
    var docstitle8 = new Docs_title({
      props: {
        title: "Duotone Icons"
      }
    });
    var docstitle9 = new Docs_title({
      props: {
        title: "Basic Use",
        level: 5
      }
    });
    var docsimg0 = new Docs_img({
      props: {
        src: "/assets/duotone-0.png",
        alt: "duotone icons basic use"
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
    var docstitle10 = new Docs_title({
      props: {
        title: "Swapping Layer Opacity",
        level: 5
      }
    });
    var docsimg1 = new Docs_img({
      props: {
        src: "/assets/duotone-1.png",
        alt: "swapping duotone icons layer opacity"
      }
    });
    var docscode10 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[2]
      }
    });
    var docstitle11 = new Docs_title({
      props: {
        title: "Changing Opacity",
        level: 5
      }
    });
    var docsimg2 = new Docs_img({
      props: {
        src: "/assets/duotone-2.png",
        alt: "changing duotone icons opacity"
      }
    });
    var docscode11 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[3]
      }
    });
    var docsimg3 = new Docs_img({
      props: {
        src: "/assets/duotone-3.png",
        alt: "changing duotone icons opacity"
      }
    });
    var docscode12 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[4]
      }
    });
    var docstitle12 = new Docs_title({
      props: {
        title: "Coloring Duotone Icons",
        level: 5
      }
    });
    var docsimg4 = new Docs_img({
      props: {
        src: "/assets/duotone-4.png",
        alt: "coloring duotone icons"
      }
    });
    var docscode13 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[5]
      }
    });
    var docstitle13 = new Docs_title({
      props: {
        title: "Advanced Use",
        level: 5
      }
    });
    var docsimg5 = new Docs_img({
      props: {
        src: "/assets/duotone-5.png",
        alt: "duotone icons advanced use"
      }
    });
    var docscode14 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[6]
      }
    });
    var docsimg6 = new Docs_img({
      props: {
        src: "/assets/duotone-6.png",
        alt: "duotone icons advanced use"
      }
    });
    var docscode15 = new Docs_code({
      props: {
        code: ctx.codes.duotoneIcons[7]
      }
    });
    var docsimg7 = new Docs_img({
      props: {
        src: "/assets/duotone-7.png",
        alt: "duotone icons advanced use"
      }
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
        div12 = element("div");
        docstitle0.$$.fragment.c();
        t0 = space();
        docscode0.$$.fragment.c();
        t1 = space();
        docscode1.$$.fragment.c();
        t2 = space();
        docstitle1.$$.fragment.c();
        t3 = space();
        div0 = element("div");
        fa0.$$.fragment.c();
        t4 = text(" Flag");
        t5 = space();
        docscode2.$$.fragment.c();
        t6 = space();
        div2 = element("div");
        div1 = element("div");
        fa1.$$.fragment.c();
        t7 = space();
        docscode3.$$.fragment.c();
        t8 = space();
        docstitle2.$$.fragment.c();
        t9 = space();
        docstitle3.$$.fragment.c();
        t10 = space();
        div3 = element("div");
        fa2.$$.fragment.c();
        t11 = space();
        fa3.$$.fragment.c();
        t12 = space();
        fa4.$$.fragment.c();
        t13 = space();
        fa5.$$.fragment.c();
        t14 = space();
        fa6.$$.fragment.c();
        t15 = space();
        fa7.$$.fragment.c();
        t16 = space();
        fa8.$$.fragment.c();
        t17 = space();
        fa9.$$.fragment.c();
        t18 = space();
        docscode4.$$.fragment.c();
        t19 = space();
        docstitle4.$$.fragment.c();
        t20 = space();
        div9 = element("div");
        div4 = element("div");
        fa10.$$.fragment.c();
        t21 = text(" Home");
        t22 = space();
        div5 = element("div");
        fa11.$$.fragment.c();
        t23 = text(" Info");
        t24 = space();
        div6 = element("div");
        fa12.$$.fragment.c();
        t25 = text(" Library");
        t26 = space();
        div7 = element("div");
        fa13.$$.fragment.c();
        t27 = text(" Applications");
        t28 = space();
        div8 = element("div");
        fa14.$$.fragment.c();
        t29 = text(" Settins");
        t30 = space();
        docscode5.$$.fragment.c();
        t31 = space();
        docstitle5.$$.fragment.c();
        t32 = space();
        div10 = element("div");
        fa15.$$.fragment.c();
        t33 = space();
        fa16.$$.fragment.c();
        t34 = text("\n    Gatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that’s no matter — tomorrow we will run faster, stretch our arms further... And one fine morning — So we beat on, boats against the current, borne back ceaselessly into the past.");
        t35 = space();
        docscode6.$$.fragment.c();
        t36 = space();
        docstitle6.$$.fragment.c();
        t37 = space();
        docstitle7.$$.fragment.c();
        t38 = space();
        div11 = element("div");
        fa17.$$.fragment.c();
        t39 = space();
        fa18.$$.fragment.c();
        t40 = space();
        fa19.$$.fragment.c();
        t41 = space();
        fa20.$$.fragment.c();
        t42 = space();
        fa21.$$.fragment.c();
        t43 = space();
        fa22.$$.fragment.c();
        t44 = space();
        fa23.$$.fragment.c();
        t45 = space();
        fa24.$$.fragment.c();
        t46 = space();
        fa25.$$.fragment.c();
        t47 = space();
        docscode7.$$.fragment.c();
        t48 = space();
        docstitle8.$$.fragment.c();
        t49 = space();
        docstitle9.$$.fragment.c();
        t50 = space();
        docsimg0.$$.fragment.c();
        t51 = space();
        docscode8.$$.fragment.c();
        t52 = space();
        docscode9.$$.fragment.c();
        t53 = space();
        docstitle10.$$.fragment.c();
        t54 = space();
        docsimg1.$$.fragment.c();
        t55 = space();
        docscode10.$$.fragment.c();
        t56 = space();
        docstitle11.$$.fragment.c();
        t57 = space();
        docsimg2.$$.fragment.c();
        t58 = space();
        docscode11.$$.fragment.c();
        t59 = space();
        docsimg3.$$.fragment.c();
        t60 = space();
        docscode12.$$.fragment.c();
        t61 = space();
        docstitle12.$$.fragment.c();
        t62 = space();
        docsimg4.$$.fragment.c();
        t63 = space();
        docscode13.$$.fragment.c();
        t64 = space();
        docstitle13.$$.fragment.c();
        t65 = space();
        docsimg5.$$.fragment.c();
        t66 = space();
        docscode14.$$.fragment.c();
        t67 = space();
        docsimg6.$$.fragment.c();
        t68 = space();
        docscode15.$$.fragment.c();
        t69 = space();
        docsimg7.$$.fragment.c();
        t70 = space();
        docscode16.$$.fragment.c();
        t71 = space();
        docscode17.$$.fragment.c();
        attr(div0, "class", "shadow-sm p-3 mb-3 rounded");
        set_style(div1, "font-size", "3em");
        set_style(div1, "color", "tomato");
        attr(div2, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div3, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div9, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div10, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        attr(div11, "class", "shadow-sm p-3 mb-3 rounded");
      },
      m: function m(target, anchor) {
        insert(target, div12, anchor);
        mount_component(docstitle0, div12, null);
        append(div12, t0);
        mount_component(docscode0, div12, null);
        append(div12, t1);
        mount_component(docscode1, div12, null);
        append(div12, t2);
        mount_component(docstitle1, div12, null);
        append(div12, t3);
        append(div12, div0);
        mount_component(fa0, div0, null);
        append(div0, t4);
        append(div12, t5);
        mount_component(docscode2, div12, null);
        append(div12, t6);
        append(div12, div2);
        append(div2, div1);
        mount_component(fa1, div1, null);
        append(div12, t7);
        mount_component(docscode3, div12, null);
        append(div12, t8);
        mount_component(docstitle2, div12, null);
        append(div12, t9);
        mount_component(docstitle3, div12, null);
        append(div12, t10);
        append(div12, div3);
        mount_component(fa2, div3, null);
        append(div3, t11);
        mount_component(fa3, div3, null);
        append(div3, t12);
        mount_component(fa4, div3, null);
        append(div3, t13);
        mount_component(fa5, div3, null);
        append(div3, t14);
        mount_component(fa6, div3, null);
        append(div3, t15);
        mount_component(fa7, div3, null);
        append(div3, t16);
        mount_component(fa8, div3, null);
        append(div3, t17);
        mount_component(fa9, div3, null);
        append(div12, t18);
        mount_component(docscode4, div12, null);
        append(div12, t19);
        mount_component(docstitle4, div12, null);
        append(div12, t20);
        append(div12, div9);
        append(div9, div4);
        mount_component(fa10, div4, null);
        append(div4, t21);
        append(div9, t22);
        append(div9, div5);
        mount_component(fa11, div5, null);
        append(div5, t23);
        append(div9, t24);
        append(div9, div6);
        mount_component(fa12, div6, null);
        append(div6, t25);
        append(div9, t26);
        append(div9, div7);
        mount_component(fa13, div7, null);
        append(div7, t27);
        append(div9, t28);
        append(div9, div8);
        mount_component(fa14, div8, null);
        append(div8, t29);
        append(div12, t30);
        mount_component(docscode5, div12, null);
        append(div12, t31);
        mount_component(docstitle5, div12, null);
        append(div12, t32);
        append(div12, div10);
        mount_component(fa15, div10, null);
        append(div10, t33);
        mount_component(fa16, div10, null);
        append(div10, t34);
        append(div12, t35);
        mount_component(docscode6, div12, null);
        append(div12, t36);
        mount_component(docstitle6, div12, null);
        append(div12, t37);
        mount_component(docstitle7, div12, null);
        append(div12, t38);
        append(div12, div11);
        mount_component(fa17, div11, null);
        append(div11, t39);
        mount_component(fa18, div11, null);
        append(div11, t40);
        mount_component(fa19, div11, null);
        append(div11, t41);
        mount_component(fa20, div11, null);
        append(div11, t42);
        mount_component(fa21, div11, null);
        append(div11, t43);
        mount_component(fa22, div11, null);
        append(div11, t44);
        mount_component(fa23, div11, null);
        append(div11, t45);
        mount_component(fa24, div11, null);
        append(div11, t46);
        mount_component(fa25, div11, null);
        append(div12, t47);
        mount_component(docscode7, div12, null);
        append(div12, t48);
        mount_component(docstitle8, div12, null);
        append(div12, t49);
        mount_component(docstitle9, div12, null);
        append(div12, t50);
        mount_component(docsimg0, div12, null);
        append(div12, t51);
        mount_component(docscode8, div12, null);
        append(div12, t52);
        mount_component(docscode9, div12, null);
        append(div12, t53);
        mount_component(docstitle10, div12, null);
        append(div12, t54);
        mount_component(docsimg1, div12, null);
        append(div12, t55);
        mount_component(docscode10, div12, null);
        append(div12, t56);
        mount_component(docstitle11, div12, null);
        append(div12, t57);
        mount_component(docsimg2, div12, null);
        append(div12, t58);
        mount_component(docscode11, div12, null);
        append(div12, t59);
        mount_component(docsimg3, div12, null);
        append(div12, t60);
        mount_component(docscode12, div12, null);
        append(div12, t61);
        mount_component(docstitle12, div12, null);
        append(div12, t62);
        mount_component(docsimg4, div12, null);
        append(div12, t63);
        mount_component(docscode13, div12, null);
        append(div12, t64);
        mount_component(docstitle13, div12, null);
        append(div12, t65);
        mount_component(docsimg5, div12, null);
        append(div12, t66);
        mount_component(docscode14, div12, null);
        append(div12, t67);
        mount_component(docsimg6, div12, null);
        append(div12, t68);
        mount_component(docscode15, div12, null);
        append(div12, t69);
        mount_component(docsimg7, div12, null);
        append(div12, t70);
        mount_component(docscode16, div12, null);
        append(div12, t71);
        mount_component(docscode17, div12, null);
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
        var docscode8_changes = {};
        if (changed.codes) docscode8_changes.code = ctx.codes.duotoneIcons[0];
        docscode8.$set(docscode8_changes);
        var docscode9_changes = {};
        if (changed.codes) docscode9_changes.code = ctx.codes.duotoneIcons[1];
        docscode9.$set(docscode9_changes);
        var docscode10_changes = {};
        if (changed.codes) docscode10_changes.code = ctx.codes.duotoneIcons[2];
        docscode10.$set(docscode10_changes);
        var docscode11_changes = {};
        if (changed.codes) docscode11_changes.code = ctx.codes.duotoneIcons[3];
        docscode11.$set(docscode11_changes);
        var docscode12_changes = {};
        if (changed.codes) docscode12_changes.code = ctx.codes.duotoneIcons[4];
        docscode12.$set(docscode12_changes);
        var docscode13_changes = {};
        if (changed.codes) docscode13_changes.code = ctx.codes.duotoneIcons[5];
        docscode13.$set(docscode13_changes);
        var docscode14_changes = {};
        if (changed.codes) docscode14_changes.code = ctx.codes.duotoneIcons[6];
        docscode14.$set(docscode14_changes);
        var docscode15_changes = {};
        if (changed.codes) docscode15_changes.code = ctx.codes.duotoneIcons[7];
        docscode15.$set(docscode15_changes);
        var docscode16_changes = {};
        if (changed.codes) docscode16_changes.code = ctx.codes.duotoneIcons[8];
        docscode16.$set(docscode16_changes);
        var docscode17_changes = {};
        if (changed.codes) docscode17_changes.code = ctx.codes.duotoneIcons[9];
        docscode17.$set(docscode17_changes);
      },
      i: function i(local) {
        if (current) return;
        transition_in(docstitle0.$$.fragment, local);
        transition_in(docscode0.$$.fragment, local);
        transition_in(docscode1.$$.fragment, local);
        transition_in(docstitle1.$$.fragment, local);
        transition_in(fa0.$$.fragment, local);
        transition_in(docscode2.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        transition_in(docscode3.$$.fragment, local);
        transition_in(docstitle2.$$.fragment, local);
        transition_in(docstitle3.$$.fragment, local);
        transition_in(fa2.$$.fragment, local);
        transition_in(fa3.$$.fragment, local);
        transition_in(fa4.$$.fragment, local);
        transition_in(fa5.$$.fragment, local);
        transition_in(fa6.$$.fragment, local);
        transition_in(fa7.$$.fragment, local);
        transition_in(fa8.$$.fragment, local);
        transition_in(fa9.$$.fragment, local);
        transition_in(docscode4.$$.fragment, local);
        transition_in(docstitle4.$$.fragment, local);
        transition_in(fa10.$$.fragment, local);
        transition_in(fa11.$$.fragment, local);
        transition_in(fa12.$$.fragment, local);
        transition_in(fa13.$$.fragment, local);
        transition_in(fa14.$$.fragment, local);
        transition_in(docscode5.$$.fragment, local);
        transition_in(docstitle5.$$.fragment, local);
        transition_in(fa15.$$.fragment, local);
        transition_in(fa16.$$.fragment, local);
        transition_in(docscode6.$$.fragment, local);
        transition_in(docstitle6.$$.fragment, local);
        transition_in(docstitle7.$$.fragment, local);
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
        transition_in(docstitle8.$$.fragment, local);
        transition_in(docstitle9.$$.fragment, local);
        transition_in(docsimg0.$$.fragment, local);
        transition_in(docscode8.$$.fragment, local);
        transition_in(docscode9.$$.fragment, local);
        transition_in(docstitle10.$$.fragment, local);
        transition_in(docsimg1.$$.fragment, local);
        transition_in(docscode10.$$.fragment, local);
        transition_in(docstitle11.$$.fragment, local);
        transition_in(docsimg2.$$.fragment, local);
        transition_in(docscode11.$$.fragment, local);
        transition_in(docsimg3.$$.fragment, local);
        transition_in(docscode12.$$.fragment, local);
        transition_in(docstitle12.$$.fragment, local);
        transition_in(docsimg4.$$.fragment, local);
        transition_in(docscode13.$$.fragment, local);
        transition_in(docstitle13.$$.fragment, local);
        transition_in(docsimg5.$$.fragment, local);
        transition_in(docscode14.$$.fragment, local);
        transition_in(docsimg6.$$.fragment, local);
        transition_in(docscode15.$$.fragment, local);
        transition_in(docsimg7.$$.fragment, local);
        transition_in(docscode16.$$.fragment, local);
        transition_in(docscode17.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docstitle0.$$.fragment, local);
        transition_out(docscode0.$$.fragment, local);
        transition_out(docscode1.$$.fragment, local);
        transition_out(docstitle1.$$.fragment, local);
        transition_out(fa0.$$.fragment, local);
        transition_out(docscode2.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        transition_out(docscode3.$$.fragment, local);
        transition_out(docstitle2.$$.fragment, local);
        transition_out(docstitle3.$$.fragment, local);
        transition_out(fa2.$$.fragment, local);
        transition_out(fa3.$$.fragment, local);
        transition_out(fa4.$$.fragment, local);
        transition_out(fa5.$$.fragment, local);
        transition_out(fa6.$$.fragment, local);
        transition_out(fa7.$$.fragment, local);
        transition_out(fa8.$$.fragment, local);
        transition_out(fa9.$$.fragment, local);
        transition_out(docscode4.$$.fragment, local);
        transition_out(docstitle4.$$.fragment, local);
        transition_out(fa10.$$.fragment, local);
        transition_out(fa11.$$.fragment, local);
        transition_out(fa12.$$.fragment, local);
        transition_out(fa13.$$.fragment, local);
        transition_out(fa14.$$.fragment, local);
        transition_out(docscode5.$$.fragment, local);
        transition_out(docstitle5.$$.fragment, local);
        transition_out(fa15.$$.fragment, local);
        transition_out(fa16.$$.fragment, local);
        transition_out(docscode6.$$.fragment, local);
        transition_out(docstitle6.$$.fragment, local);
        transition_out(docstitle7.$$.fragment, local);
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
        transition_out(docstitle8.$$.fragment, local);
        transition_out(docstitle9.$$.fragment, local);
        transition_out(docsimg0.$$.fragment, local);
        transition_out(docscode8.$$.fragment, local);
        transition_out(docscode9.$$.fragment, local);
        transition_out(docstitle10.$$.fragment, local);
        transition_out(docsimg1.$$.fragment, local);
        transition_out(docscode10.$$.fragment, local);
        transition_out(docstitle11.$$.fragment, local);
        transition_out(docsimg2.$$.fragment, local);
        transition_out(docscode11.$$.fragment, local);
        transition_out(docsimg3.$$.fragment, local);
        transition_out(docscode12.$$.fragment, local);
        transition_out(docstitle12.$$.fragment, local);
        transition_out(docsimg4.$$.fragment, local);
        transition_out(docscode13.$$.fragment, local);
        transition_out(docstitle13.$$.fragment, local);
        transition_out(docsimg5.$$.fragment, local);
        transition_out(docscode14.$$.fragment, local);
        transition_out(docsimg6.$$.fragment, local);
        transition_out(docscode15.$$.fragment, local);
        transition_out(docsimg7.$$.fragment, local);
        transition_out(docscode16.$$.fragment, local);
        transition_out(docscode17.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) {
          detach(div12);
        }

        destroy_component(docstitle0);
        destroy_component(docscode0);
        destroy_component(docscode1);
        destroy_component(docstitle1);
        destroy_component(fa0);
        destroy_component(docscode2);
        destroy_component(fa1);
        destroy_component(docscode3);
        destroy_component(docstitle2);
        destroy_component(docstitle3);
        destroy_component(fa2);
        destroy_component(fa3);
        destroy_component(fa4);
        destroy_component(fa5);
        destroy_component(fa6);
        destroy_component(fa7);
        destroy_component(fa8);
        destroy_component(fa9);
        destroy_component(docscode4);
        destroy_component(docstitle4);
        destroy_component(fa10);
        destroy_component(fa11);
        destroy_component(fa12);
        destroy_component(fa13);
        destroy_component(fa14);
        destroy_component(docscode5);
        destroy_component(docstitle5);
        destroy_component(fa15);
        destroy_component(fa16);
        destroy_component(docscode6);
        destroy_component(docstitle6);
        destroy_component(docstitle7);
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
        destroy_component(docstitle8);
        destroy_component(docstitle9);
        destroy_component(docsimg0);
        destroy_component(docscode8);
        destroy_component(docscode9);
        destroy_component(docstitle10);
        destroy_component(docsimg1);
        destroy_component(docscode10);
        destroy_component(docstitle11);
        destroy_component(docsimg2);
        destroy_component(docscode11);
        destroy_component(docsimg3);
        destroy_component(docscode12);
        destroy_component(docstitle12);
        destroy_component(docsimg4);
        destroy_component(docscode13);
        destroy_component(docstitle13);
        destroy_component(docsimg5);
        destroy_component(docscode14);
        destroy_component(docsimg6);
        destroy_component(docscode15);
        destroy_component(docsimg7);
        destroy_component(docscode16);
        destroy_component(docscode17);
      }
    };
  }

  function instance$4($$self) {
    var codes = {
      installation: ['npm install svelte-fa --save', "import Fa from 'svelte-fa'\nimport { faFlag } from '@fortawesome/free-solid-svg-icons'"],
      basicUse: ['<Fa icon={faFlag} /> Flag', "<div style=\"font-size: 3em; color: tomato\">\n  <Fa icon={faFlag} />\n</div>"],
      additionalStyling: ["<Fa icon={faFlag} size=\"xs\" />\n<Fa icon={faFlag} size=\"sm\" />\n<Fa icon={faFlag} size=\"lg\" />\n<Fa icon={faFlag} size=\"2x\" />\n<Fa icon={faFlag} size=\"2.5x\" />\n<Fa icon={faFlag} size=\"5x\" />\n<Fa icon={faFlag} size=\"7x\" />\n<Fa icon={faFlag} size=\"10x\" />", "<div>\n  <Fa icon={faHome} fw style=\"background: mistyrose\" /> Home\n</div>\n<div>\n  <Fa icon={faInfo} fw style=\"background: mistyrose\" /> Info\n</div>\n<div>\n  <Fa icon={faBook} fw style=\"background: mistyrose\" /> Library\n</div>\n<div>\n  <Fa icon={faPencilAlt} fw style=\"background: mistyrose\" /> Applications\n</div>\n<div>\n  <Fa icon={faCog} fw style=\"background: mistyrose\" /> Settins\n</div>", "<Fa icon={faQuoteLeft} pull=\"left\" size=\"2x\" />\n<Fa icon={faQuoteRight} pull=\"right\" size=\"2x\" />\nGatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that\u2019s no matter \u2014 tomorrow we will run faster, stretch our arms further... And one fine morning \u2014 So we beat on, boats against the current, borne back ceaselessly into the past."],
      powerTransforms: ["<Fa icon={faMagic} size=\"4x\" rotate={90} style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate={180} style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"270\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"30\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"-30\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"vertical\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"horizontal\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"both\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"both\" style=\"background: mistyrose\"/>"],
      duotoneIcons: ["import {\n  faCamera,\n  faFireAlt,\n  faBusAlt,\n  faFillDrip,\n} from '@fortawesome/pro-duotone-svg-icons';", "<Fa icon={faCamera} size=\"3x\" />\n<Fa icon={faFireAlt} size=\"3x\" />\n<Fa icon={faBusAlt} size=\"3x\" />\n<Fa icon={faFillDrip} size=\"3x\" />", "<Fa icon={faCamera} size=\"3x\" />\n<Fa icon={faCamera} size=\"3x\" swapOpacity />\n<Fa icon={faFireAlt} size=\"3x\" />\n<Fa icon={faFireAlt} size=\"3x\" swapOpacity />\n<Fa icon={faBusAlt} size=\"3x\" />\n<Fa icon={faBusAlt} size=\"3x\" swapOpacity />\n<Fa icon={faFillDrip} size=\"3x\" />\n<Fa icon={faFillDrip} size=\"3x\" swapOpacity />", "<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.2} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.4} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.6} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.8} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={1} />", "<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.2} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.4} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.6} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.8} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={1} />", "<Fa icon={faBusAlt} size=\"3x\" primaryColor=\"gold\" />\n<Fa icon={faBusAlt} size=\"3x\" primaryColor=\"orangered\" />\n<Fa icon={faFillDrip} size=\"3x\" secondaryColor=\"limegreen\" />\n<Fa icon={faFillDrip} size=\"3x\" secondaryColor=\"rebeccapurple\" />\n<Fa icon={faBatteryFull} size=\"3x\" primaryColor=\"limegreen\" secondaryColor=\"dimgray\" />\n<Fa icon={faBatteryQuarter} size=\"3x\" primaryColor=\"orange\" secondaryColor=\"dimgray\" />", "<Fa icon={faBook} size=\"3x\" secondaryOpacity={1} primaryColor=\"lightseagreen\" secondaryColor=\"linen\" />\n<Fa icon={faBookSpells} size=\"3x\" secondaryOpacity={1} primaryColor=\"mediumpurple\" secondaryColor=\"linen\" />\n<Fa icon={faBookMedical} size=\"3x\" secondaryOpacity={1} primaryColor=\"crimson\" secondaryColor=\"linen\" />\n<Fa icon={faBookUser} size=\"3x\" secondaryOpacity={1} primaryColor=\"peru\" secondaryColor=\"linen\" />\n<Fa icon={faToggleOff} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"gray\" />\n<Fa icon={faToggleOn} size=\"3x\" secondaryOpacity={1} primaryColor=\"dodgerblue\" secondaryColor=\"white\" />\n<Fa icon={faFilePlus} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"limegreen\" />\n<Fa icon={faFileExclamation} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"gold\" />\n<Fa icon={faFileTimes} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"tomato\" />", "<Fa icon={faCrow} size=\"3x\" secondaryOpacity={1} primaryColor=\"dodgerblue\" secondaryColor=\"gold\" />\n<Fa icon={faCampfire} size=\"3x\" secondaryOpacity={1} primaryColor=\"sienna\" secondaryColor=\"red\" />\n<Fa icon={faBirthdayCake} size=\"3x\" secondaryOpacity={1} primaryColor=\"pink\" secondaryColor=\"palevioletred\" />\n<Fa icon={faEar} size=\"3x\" secondaryOpacity={1} primaryColor=\"sandybrown\" secondaryColor=\"bisque\" />\n<Fa icon={faCorn} size=\"3x\" secondaryOpacity={1} primaryColor=\"mediumseagreen\" secondaryColor=\"gold\" />\n<Fa icon={faCookieBite} size=\"3x\" secondaryOpacity={1} primaryColor=\"saddlebrown\" secondaryColor=\"burlywood\" />", "const themeRavenclaw = {\n  secondaryOpacity: 1,\n  primaryColor: '#0438a1',\n  secondaryColor: '#6c6c6c',\n};", "<Fa icon={faHatWizard} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faFlaskPotion} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faWandMagic} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faScarf} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faBookSpells} size=\"3x\" {...themeRavenclaw} />"]
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
      init(_assertThisInitialized(_this), options, instance$4, create_fragment$4, safe_not_equal, []);
      return _this;
    }

    return Docs;
  }(SvelteComponent);

  function create_fragment$5(ctx) {
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
      init(_assertThisInitialized(_this), options, null, create_fragment$5, safe_not_equal, []);
      return _this;
    }

    return App;
  }(SvelteComponent);

  new App({
    target: document.getElementById('app')
  });

}(SvelteFa));
