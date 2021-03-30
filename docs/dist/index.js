(function (Fa) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Fa__default = /*#__PURE__*/_interopDefaultLegacy(Fa);

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
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

  function is_empty(obj) {
    return Object.keys(obj).length === 0;
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
    if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
  }

  function set_attributes(node, attributes) {
    // @ts-ignore
    var descriptors = Object.getOwnPropertyDescriptors(node.__proto__);

    for (var key in attributes) {
      if (attributes[key] == null) {
        node.removeAttribute(key);
      } else if (key === 'style') {
        node.style.cssText = attributes[key];
      } else if (key === '__value') {
        node.value = node[key] = attributes[key];
      } else if (descriptors[key] && descriptors[key].set) {
        node[key] = attributes[key];
      } else {
        attr(node, key, attributes[key]);
      }
    }
  }

  function to_number(value) {
    return value === '' ? null : +value;
  }

  function children(element) {
    return Array.from(element.childNodes);
  }

  function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data) text.data = data;
  }

  function set_input_value(input, value) {
    input.value = value == null ? '' : value;
  }

  function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
  }

  function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
  }

  var current_component;

  function set_current_component(component) {
    current_component = component;
  }

  function get_current_component() {
    if (!current_component) throw new Error('Function called outside component initialization');
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

  var flushing = false;
  var seen_callbacks = new Set();

  function flush() {
    if (flushing) return;
    flushing = true;

    do {
      // first, call beforeUpdate functions
      // and update components
      for (var i = 0; i < dirty_components.length; i += 1) {
        var component = dirty_components[i];
        set_current_component(component);
        update(component.$$);
      }

      set_current_component(null);
      dirty_components.length = 0;

      while (binding_callbacks.length) {
        binding_callbacks.pop()();
      } // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...


      for (var _i = 0; _i < render_callbacks.length; _i += 1) {
        var callback = render_callbacks[_i];

        if (!seen_callbacks.has(callback)) {
          // ...so guard against infinite loops
          seen_callbacks.add(callback);
          callback();
        }
      }

      render_callbacks.length = 0;
    } while (dirty_components.length);

    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }

    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
  }

  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      var dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
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

  function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
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
        block.p(child_ctx, dirty);
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

        for (var _key3 in n) {
          if (!accounted_for[_key3]) {
            update[_key3] = n[_key3];
            accounted_for[_key3] = 1;
          }
        }

        levels[i] = n;
      } else {
        for (var _key4 in o) {
          accounted_for[_key4] = 1;
        }
      }
    }

    for (var _key5 in to_null_out) {
      if (!(_key5 in update)) update[_key5] = undefined;
    }

    return update;
  }

  function create_component(block) {
    block && block.c();
  }

  function mount_component(component, target, anchor) {
    var _component$$$ = component.$$,
        fragment = _component$$$.fragment,
        on_mount = _component$$$.on_mount,
        on_destroy = _component$$$.on_destroy,
        after_update = _component$$$.after_update;
    fragment && fragment.m(target, anchor); // onMount happens before the initial afterUpdate

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
    var $$ = component.$$;

    if ($$.fragment !== null) {
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching); // TODO null out other refs, including component.$$ (but need to
      // preserve final state?)

      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }

  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }

    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }

  function init(component, options, instance, create_fragment, not_equal, props, dirty) {
    if (dirty === void 0) {
      dirty = [-1];
    }

    var parent_component = current_component;
    set_current_component(component);
    var prop_values = options.props || {};
    var $$ = component.$$ = {
      fragment: null,
      ctx: null,
      // state
      props: props,
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
      dirty: dirty,
      skip_bound: false
    };
    var ready = false;
    $$.ctx = instance ? instance(component, prop_values, function (i, ret) {
      var value = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? undefined : arguments[2] : ret;

      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
        if (ready) make_dirty(component, i);
      }

      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update); // `false` as a special case of no DOM component

    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;

    if (options.target) {
      if (options.hydrate) {
        var nodes = children(options.target); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c();
      }

      if (options.intro) transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor);
      flush();
    }

    set_current_component(parent_component);
  }

  var SvelteComponent = /*#__PURE__*/function () {
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

    _proto3.$set = function $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    };

    return SvelteComponent;
  }();

  var faBook={prefix:'fas',iconName:'book',icon:[448,512,[],"f02d","M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z"]};var faCog={prefix:'fas',iconName:'cog',icon:[512,512,[],"f013","M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"]};var faFlag={prefix:'fas',iconName:'flag',icon:[512,512,[],"f024","M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z"]};var faHome={prefix:'fas',iconName:'home',icon:[576,512,[],"f015","M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"]};var faInfo={prefix:'fas',iconName:'info',icon:[192,512,[],"f129","M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z"]};var faLink={prefix:'fas',iconName:'link',icon:[512,512,[],"f0c1","M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"]};var faMagic={prefix:'fas',iconName:'magic',icon:[512,512,[],"f0d0","M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zM80 160l26.66-53.33L160 80l-53.34-26.67L80 0 53.34 53.33 0 80l53.34 26.67L80 160zm352 128l-26.66 53.33L352 368l53.34 26.67L432 448l26.66-53.33L512 368l-53.34-26.67L432 288zm70.62-193.77L417.77 9.38C411.53 3.12 403.34 0 395.15 0c-8.19 0-16.38 3.12-22.63 9.38L9.38 372.52c-12.5 12.5-12.5 32.76 0 45.25l84.85 84.85c6.25 6.25 14.44 9.37 22.62 9.37 8.19 0 16.38-3.12 22.63-9.37l363.14-363.15c12.5-12.48 12.5-32.75 0-45.24zM359.45 203.46l-50.91-50.91 86.6-86.6 50.91 50.91-86.6 86.6z"]};var faPencilAlt={prefix:'fas',iconName:'pencil-alt',icon:[512,512,[],"f303","M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"]};var faQuoteLeft={prefix:'fas',iconName:'quote-left',icon:[512,512,[],"f10d","M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"]};var faQuoteRight={prefix:'fas',iconName:'quote-right',icon:[512,512,[],"f10e","M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z"]};

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
      return;
    }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".hue.svelte-1a2mimh{color:#238ae6;animation:svelte-1a2mimh-hue 30s infinite linear}@keyframes svelte-1a2mimh-hue{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(-360deg)}}";
  styleInject(css_248z);

  function get_each_context(ctx, list, i) {
    var child_ctx = ctx.slice();
    child_ctx[10] = list[i];
    child_ctx[12] = i;
    return child_ctx;
  }

  function get_each_context_1(ctx, list, i) {
    var child_ctx = ctx.slice();
    child_ctx[13] = list[i];
    return child_ctx;
  }

  function get_each_context_2(ctx, list, i) {
    var child_ctx = ctx.slice();
    child_ctx[16] = list[i];
    return child_ctx;
  } // (94:14) {#each pull as p (p)}


  function create_each_block_2(key_1, ctx) {
    var button;
    var t0_value =
    /*p*/
    ctx[16] + "";
    var t0;
    var t1;
    var button_class_value;
    var mounted;
    var dispose;

    function click_handler() {
      return (
        /*click_handler*/
        ctx[7](
        /*p*/
        ctx[16])
      );
    }

    return {
      key: key_1,
      first: null,
      c: function c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = space();
        attr(button, "class", button_class_value = "" + (null_to_empty("btn btn-" + (
        /*model*/
        ctx[0].pull == (
        /*p*/
        ctx[16] == "None" ? undefined :
        /*p*/
        ctx[16].toLowerCase()) ? "primary" : "secondary")) + " svelte-1a2mimh"));
        attr(button, "type", "button");
        this.first = button;
      },
      m: function m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);

        if (!mounted) {
          dispose = listen(button, "click", click_handler);
          mounted = true;
        }
      },
      p: function p(new_ctx, dirty) {
        ctx = new_ctx;

        if (dirty &
        /*model*/
        1 && button_class_value !== (button_class_value = "" + (null_to_empty("btn btn-" + (
        /*model*/
        ctx[0].pull == (
        /*p*/
        ctx[16] == "None" ? undefined :
        /*p*/
        ctx[16].toLowerCase()) ? "primary" : "secondary")) + " svelte-1a2mimh"))) {
          attr(button, "class", button_class_value);
        }
      },
      d: function d(detaching) {
        if (detaching) detach(button);
        mounted = false;
        dispose();
      }
    };
  } // (114:14) {#each flip as f (f)}


  function create_each_block_1(key_1, ctx) {
    var button;
    var t0_value =
    /*f*/
    ctx[13] + "";
    var t0;
    var t1;
    var button_class_value;
    var mounted;
    var dispose;

    function click_handler_1() {
      return (
        /*click_handler_1*/
        ctx[8](
        /*f*/
        ctx[13])
      );
    }

    return {
      key: key_1,
      first: null,
      c: function c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = space();
        attr(button, "class", button_class_value = "" + (null_to_empty("btn btn-" + (
        /*model*/
        ctx[0].flip == (
        /*f*/
        ctx[13] == "None" ? undefined :
        /*f*/
        ctx[13].toLowerCase()) ? "primary" : "secondary")) + " svelte-1a2mimh"));
        attr(button, "type", "button");
        this.first = button;
      },
      m: function m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);

        if (!mounted) {
          dispose = listen(button, "click", click_handler_1);
          mounted = true;
        }
      },
      p: function p(new_ctx, dirty) {
        ctx = new_ctx;

        if (dirty &
        /*model*/
        1 && button_class_value !== (button_class_value = "" + (null_to_empty("btn btn-" + (
        /*model*/
        ctx[0].flip == (
        /*f*/
        ctx[13] == "None" ? undefined :
        /*f*/
        ctx[13].toLowerCase()) ? "primary" : "secondary")) + " svelte-1a2mimh"))) {
          attr(button, "class", button_class_value);
        }
      },
      d: function d(detaching) {
        if (detaching) detach(button);
        mounted = false;
        dispose();
      }
    };
  } // (149:6) {#each icons as icon, name}


  function create_each_block(ctx) {
    var div;
    var fa;
    var t;
    var current;
    fa = new Fa__default['default']({
      props: {
        icon:
        /*icon*/
        ctx[10],
        flip:
        /*model*/
        ctx[0].flip,
        pull:
        /*model*/
        ctx[0].pull,
        rotate:
        /*model*/
        ctx[0].rotate,
        size:
        /*model*/
        ctx[0].size + "x"
      }
    });
    return {
      c: function c() {
        div = element("div");
        create_component(fa.$$.fragment);
        t = space();
        attr(div, "class", "col text-center hue svelte-1a2mimh");
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        mount_component(fa, div, null);
        append(div, t);
        current = true;
      },
      p: function p(ctx, dirty) {
        var fa_changes = {};
        if (dirty &
        /*model*/
        1) fa_changes.flip =
        /*model*/
        ctx[0].flip;
        if (dirty &
        /*model*/
        1) fa_changes.pull =
        /*model*/
        ctx[0].pull;
        if (dirty &
        /*model*/
        1) fa_changes.rotate =
        /*model*/
        ctx[0].rotate;
        if (dirty &
        /*model*/
        1) fa_changes.size =
        /*model*/
        ctx[0].size + "x";
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
        if (detaching) detach(div);
        destroy_component(fa);
      }
    };
  }

  function create_fragment(ctx) {
    var div19;
    var div18;
    var div16;
    var h1;
    var t1;
    var p0;
    var t6;
    var p1;
    var t12;
    var form;
    var div4;
    var label0;
    var t14;
    var div3;
    var div0;
    var input0;
    var t15;
    var div2;
    var div1;
    var t16_value =
    /*model*/
    ctx[0].size + "";
    var t16;
    var t17;
    var t18;
    var div7;
    var label1;
    var t20;
    var div6;
    var div5;
    var each_blocks_2 = [];
    var each0_lookup = new Map();
    var t21;
    var div10;
    var label2;
    var t23;
    var div9;
    var div8;
    var each_blocks_1 = [];
    var each1_lookup = new Map();
    var t24;
    var div15;
    var label3;
    var t26;
    var div14;
    var div11;
    var input1;
    var t27;
    var div13;
    var div12;
    var t28_value =
    /*model*/
    ctx[0].rotate + "";
    var t28;
    var t29;
    var t30;
    var div17;
    var current;
    var mounted;
    var dispose;
    var each_value_2 =
    /*pull*/
    ctx[1];

    var get_key = function get_key(ctx) {
      return (
        /*p*/
        ctx[16]
      );
    };

    for (var i = 0; i < each_value_2.length; i += 1) {
      var child_ctx = get_each_context_2(ctx, each_value_2, i);
      var key = get_key(child_ctx);
      each0_lookup.set(key, each_blocks_2[i] = create_each_block_2(key, child_ctx));
    }

    var each_value_1 =
    /*flip*/
    ctx[2];

    var get_key_1 = function get_key_1(ctx) {
      return (
        /*f*/
        ctx[13]
      );
    };

    for (var _i = 0; _i < each_value_1.length; _i += 1) {
      var _child_ctx = get_each_context_1(ctx, each_value_1, _i);

      var _key = get_key_1(_child_ctx);

      each1_lookup.set(_key, each_blocks_1[_i] = create_each_block_1(_key, _child_ctx));
    }

    var each_value =
    /*icons*/
    ctx[3];
    var each_blocks = [];

    for (var _i2 = 0; _i2 < each_value.length; _i2 += 1) {
      each_blocks[_i2] = create_each_block(get_each_context(ctx, each_value, _i2));
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
        p0.innerHTML = "<a href=\"https://www.npmjs.com/package/svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/npm/v/svelte-fa.svg\" alt=\"npm version\"/></a> \n        <a href=\"https://bundlephobia.com/result?p=svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/bundlephobia/minzip/svelte-fa.svg\" alt=\"bundle size\"/></a> \n        <a href=\"https://github.com/Cweili/svelte-fa/blob/master/LICENSE\" target=\"_blank\"><img src=\"https://img.shields.io/npm/l/svelte-fa.svg\" alt=\"MIT licence\"/></a> \n        <a href=\"https://www.npmjs.com/package/svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/npm/dt/svelte-fa.svg\" alt=\"npm downloads\"/></a> \n        <a href=\"https://github.com/Cweili/svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/github/issues/Cweili/svelte-fa.svg\" alt=\"github issues\"/></a>";
        t6 = space();
        p1 = element("p");
        p1.innerHTML = "Tiny <a class=\"hue svelte-1a2mimh\" href=\"https://fontawesome.com/\" target=\"_blank\">FontAwesome 5</a> component for <a class=\"hue svelte-1a2mimh\" href=\"https://svelte.dev/\" target=\"_blank\">Svelte</a>.";
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

        for (var _i3 = 0; _i3 < each_blocks_2.length; _i3 += 1) {
          each_blocks_2[_i3].c();
        }

        t21 = space();
        div10 = element("div");
        label2 = element("label");
        label2.textContent = "Flip";
        t23 = space();
        div9 = element("div");
        div8 = element("div");

        for (var _i4 = 0; _i4 < each_blocks_1.length; _i4 += 1) {
          each_blocks_1[_i4].c();
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

        for (var _i5 = 0; _i5 < each_blocks.length; _i5 += 1) {
          each_blocks[_i5].c();
        }

        attr(h1, "class", "hue svelte-1a2mimh");
        attr(p1, "class", "lead mb-5");
        attr(label0, "class", "col-sm-3 col-form-label");
        attr(input0, "type", "range");
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
        attr(input1, "type", "range");
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
        set_input_value(input0,
        /*model*/
        ctx[0].size);
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

        for (var _i6 = 0; _i6 < each_blocks_2.length; _i6 += 1) {
          each_blocks_2[_i6].m(div5, null);
        }

        append(form, t21);
        append(form, div10);
        append(div10, label2);
        append(div10, t23);
        append(div10, div9);
        append(div9, div8);

        for (var _i7 = 0; _i7 < each_blocks_1.length; _i7 += 1) {
          each_blocks_1[_i7].m(div8, null);
        }

        append(form, t24);
        append(form, div15);
        append(div15, label3);
        append(div15, t26);
        append(div15, div14);
        append(div14, div11);
        append(div11, input1);
        set_input_value(input1,
        /*model*/
        ctx[0].rotate);
        append(div14, t27);
        append(div14, div13);
        append(div13, div12);
        append(div12, t28);
        append(div12, t29);
        append(div18, t30);
        append(div18, div17);

        for (var _i8 = 0; _i8 < each_blocks.length; _i8 += 1) {
          each_blocks[_i8].m(div17, null);
        }

        current = true;

        if (!mounted) {
          dispose = [listen(input0, "change",
          /*input0_change_input_handler*/
          ctx[6]), listen(input0, "input",
          /*input0_change_input_handler*/
          ctx[6]), listen(input1, "change",
          /*input1_change_input_handler*/
          ctx[9]), listen(input1, "input",
          /*input1_change_input_handler*/
          ctx[9]), listen(form, "submit", prevent_default(
          /*submit_handler*/
          ctx[5]))];
          mounted = true;
        }
      },
      p: function p(ctx, _ref) {
        var dirty = _ref[0];

        if (dirty &
        /*model*/
        1) {
          set_input_value(input0,
          /*model*/
          ctx[0].size);
        }

        if ((!current || dirty &
        /*model*/
        1) && t16_value !== (t16_value =
        /*model*/
        ctx[0].size + "")) set_data(t16, t16_value);

        if (dirty &
        /*model, pull, undefined, setValue*/
        19) {
          var _each_value_ =
          /*pull*/
          ctx[1];
          each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key, 1, ctx, _each_value_, each0_lookup, div5, destroy_block, create_each_block_2, null, get_each_context_2);
        }

        if (dirty &
        /*model, flip, undefined, setValue*/
        21) {
          var _each_value_2 =
          /*flip*/
          ctx[2];
          each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_1, 1, ctx, _each_value_2, each1_lookup, div8, destroy_block, create_each_block_1, null, get_each_context_1);
        }

        if (dirty &
        /*model*/
        1) {
          set_input_value(input1,
          /*model*/
          ctx[0].rotate);
        }

        if ((!current || dirty &
        /*model*/
        1) && t28_value !== (t28_value =
        /*model*/
        ctx[0].rotate + "")) set_data(t28, t28_value);

        if (dirty &
        /*icons, model*/
        9) {
          each_value =
          /*icons*/
          ctx[3];

          var _i9;

          for (_i9 = 0; _i9 < each_value.length; _i9 += 1) {
            var _child_ctx2 = get_each_context(ctx, each_value, _i9);

            if (each_blocks[_i9]) {
              each_blocks[_i9].p(_child_ctx2, dirty);

              transition_in(each_blocks[_i9], 1);
            } else {
              each_blocks[_i9] = create_each_block(_child_ctx2);

              each_blocks[_i9].c();

              transition_in(each_blocks[_i9], 1);

              each_blocks[_i9].m(div17, null);
            }
          }

          group_outros();

          for (_i9 = each_value.length; _i9 < each_blocks.length; _i9 += 1) {
            out(_i9);
          }

          check_outros();
        }
      },
      i: function i(local) {
        if (current) return;

        for (var _i10 = 0; _i10 < each_value.length; _i10 += 1) {
          transition_in(each_blocks[_i10]);
        }

        current = true;
      },
      o: function o(local) {
        each_blocks = each_blocks.filter(Boolean);

        for (var _i11 = 0; _i11 < each_blocks.length; _i11 += 1) {
          transition_out(each_blocks[_i11]);
        }

        current = false;
      },
      d: function d(detaching) {
        if (detaching) detach(div19);

        for (var _i12 = 0; _i12 < each_blocks_2.length; _i12 += 1) {
          each_blocks_2[_i12].d();
        }

        for (var _i13 = 0; _i13 < each_blocks_1.length; _i13 += 1) {
          each_blocks_1[_i13].d();
        }

        destroy_each(each_blocks, detaching);
        mounted = false;
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
    var pull = ["None", "Left", "Right"];
    var flip = ["None", "Horizontal", "Vertical", "Both"];
    var icons = [faFlag, faHome, faCog, faMagic];

    function setValue(prop, value) {
      $$invalidate(0, model[prop] = value == "None" ? undefined : value.toLowerCase(), model);
    }

    function submit_handler(event) {
      bubble($$self, event);
    }

    function input0_change_input_handler() {
      model.size = to_number(this.value);
      $$invalidate(0, model);
    }

    var click_handler = function click_handler(p) {
      return setValue("pull", p);
    };

    var click_handler_1 = function click_handler_1(f) {
      return setValue("flip", f);
    };

    function input1_change_input_handler() {
      model.rotate = to_number(this.value);
      $$invalidate(0, model);
    }

    return [model, pull, flip, icons, setValue, submit_handler, input0_change_input_handler, click_handler, click_handler_1, input1_change_input_handler];
  }

  var Showcase = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Showcase, _SvelteComponent);

    function Showcase(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
      return _this;
    }

    return Showcase;
  }(SvelteComponent);

  function create_fragment$1(ctx) {
    var div;
    var pre;
    var code_1;
    var t;
    var code_1_class_value;
    return {
      c: function c() {
        div = element("div");
        pre = element("pre");
        code_1 = element("code");
        t = text(
        /*code*/
        ctx[0]);
        attr(code_1, "class", code_1_class_value = "language-" +
        /*lang*/
        ctx[1]);
        attr(div, "class", "shadow-sm mb-3 rounded");
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        append(div, pre);
        append(pre, code_1);
        append(code_1, t);
        /*code_1_binding*/

        ctx[3](code_1);
      },
      p: function p(ctx, _ref) {
        var dirty = _ref[0];
        if (dirty &
        /*code*/
        1) set_data(t,
        /*code*/
        ctx[0]);

        if (dirty &
        /*lang*/
        2 && code_1_class_value !== (code_1_class_value = "language-" +
        /*lang*/
        ctx[1])) {
          attr(code_1, "class", code_1_class_value);
        }
      },
      i: noop,
      o: noop,
      d: function d(detaching) {
        if (detaching) detach(div);
        /*code_1_binding*/

        ctx[3](null);
      }
    };
  }

  function instance$1($$self, $$props, $$invalidate) {
    var code = $$props.code;
    var _$$props$lang = $$props.lang,
        lang = _$$props$lang === void 0 ? "html" : _$$props$lang;
    var el;

    function highlight() {
      Prism.highlightElement(el);
    }

    afterUpdate(highlight);

    function code_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](function () {
        el = $$value;
        $$invalidate(2, el);
      });
    }

    $$self.$$set = function ($$props) {
      if ("code" in $$props) $$invalidate(0, code = $$props.code);
      if ("lang" in $$props) $$invalidate(1, lang = $$props.lang);
    };

    $$self.$$.update = function () {
      if ($$self.$$.dirty &
      /*el, code*/
      5) {
         el && code && highlight();
      }
    };

    return [code, lang, el, code_1_binding];
  }

  var Docs_code = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Docs_code, _SvelteComponent);

    function Docs_code(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, safe_not_equal, {
        code: 0,
        lang: 1
      });
      return _this;
    }

    return Docs_code;
  }(SvelteComponent);

  var css_248z$1 = "img.svelte-tdv3q3{max-width:100%;max-height:48px}small.svelte-tdv3q3{position:absolute;right:1rem;bottom:.1rem;color:#ddd;z-index:-1}";
  styleInject(css_248z$1);

  function create_fragment$2(ctx) {
    var div;
    var img;
    var t0;
    var small;
    var img_levels = [
    /*$$props*/
    ctx[0]];
    var img_data = {};

    for (var i = 0; i < img_levels.length; i += 1) {
      img_data = assign(img_data, img_levels[i]);
    }

    return {
      c: function c() {
        div = element("div");
        img = element("img");
        t0 = space();
        small = element("small");
        small.textContent = "images © fontawesome.com";
        set_attributes(img, img_data);
        toggle_class(img, "svelte-tdv3q3", true);
        attr(small, "class", "svelte-tdv3q3");
        attr(div, "class", "position-relative shadow-sm p-3 mb-3 rounded");
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        append(div, img);
        append(div, t0);
        append(div, small);
      },
      p: function p(ctx, _ref) {
        var dirty = _ref[0];
        set_attributes(img, img_data = get_spread_update(img_levels, [dirty &
        /*$$props*/
        1 &&
        /*$$props*/
        ctx[0]]));
        toggle_class(img, "svelte-tdv3q3", true);
      },
      i: noop,
      o: noop,
      d: function d(detaching) {
        if (detaching) detach(div);
      }
    };
  }

  function instance$2($$self, $$props, $$invalidate) {
    $$self.$$set = function ($$new_props) {
      $$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    };

    $$props = exclude_internal_props($$props);
    return [$$props];
  }

  var Docs_img = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Docs_img, _SvelteComponent);

    function Docs_img(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$2, create_fragment$2, safe_not_equal, {});
      return _this;
    }

    return Docs_img;
  }(SvelteComponent);

  var css_248z$2 = "a.svelte-1yrtkpv.svelte-1yrtkpv,a.svelte-1yrtkpv.svelte-1yrtkpv:visited{color:currentColor}small.svelte-1yrtkpv.svelte-1yrtkpv{visibility:hidden}a.svelte-1yrtkpv:hover+small.svelte-1yrtkpv{visibility:visible}";
  styleInject(css_248z$2);

  function create_fragment$3(ctx) {
    var h4;
    var a;
    var t0;
    var a_href_value;
    var t1;
    var small;
    var fa;
    var h4_class_value;
    var current;
    fa = new Fa__default['default']({
      props: {
        icon: faLink
      }
    });
    return {
      c: function c() {
        h4 = element("h4");
        a = element("a");
        t0 = text(
        /*title*/
        ctx[1]);
        t1 = space();
        small = element("small");
        create_component(fa.$$.fragment);
        attr(a, "href", a_href_value = "#" +
        /*id*/
        ctx[2]);
        attr(a, "class", "svelte-1yrtkpv");
        attr(small, "class", "svelte-1yrtkpv");
        attr(h4, "id",
        /*id*/
        ctx[2]);
        attr(h4, "class", h4_class_value = "h" +
        /*level*/
        ctx[0]);
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
      p: function p(ctx, _ref) {
        var dirty = _ref[0];
        if (!current || dirty &
        /*title*/
        2) set_data(t0,
        /*title*/
        ctx[1]);

        if (!current || dirty &
        /*id*/
        4 && a_href_value !== (a_href_value = "#" +
        /*id*/
        ctx[2])) {
          attr(a, "href", a_href_value);
        }

        if (!current || dirty &
        /*id*/
        4) {
          attr(h4, "id",
          /*id*/
          ctx[2]);
        }

        if (!current || dirty &
        /*level*/
        1 && h4_class_value !== (h4_class_value = "h" +
        /*level*/
        ctx[0])) {
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
        if (detaching) detach(h4);
        destroy_component(fa);
      }
    };
  }

  function instance$3($$self, $$props, $$invalidate) {
    var _$$props$level = $$props.level,
        level = _$$props$level === void 0 ? 4 : _$$props$level;
    var _$$props$title = $$props.title,
        title = _$$props$title === void 0 ? "" : _$$props$title;
    var id;

    $$self.$$set = function ($$props) {
      if ("level" in $$props) $$invalidate(0, level = $$props.level);
      if ("title" in $$props) $$invalidate(1, title = $$props.title);
    };

    $$self.$$.update = function () {
      if ($$self.$$.dirty &
      /*title*/
      2) {
         $$invalidate(2, id = title.toLowerCase().replace(/[^\w]/g, "-"));
      }
    };

    return [level, title, id];
  }

  var Docs_title = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Docs_title, _SvelteComponent);

    function Docs_title(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$3, create_fragment$3, safe_not_equal, {
        level: 0,
        title: 1
      });
      return _this;
    }

    return Docs_title;
  }(SvelteComponent);

  function create_fragment$4(ctx) {
    var div15;
    var docstitle0;
    var t0;
    var docscode0;
    var t1;
    var div0;
    var t5;
    var docscode1;
    var t6;
    var div1;
    var t11;
    var docscode2;
    var t12;
    var div2;
    var t17;
    var docscode3;
    var t18;
    var docstitle1;
    var t19;
    var div3;
    var fa0;
    var t20;
    var t21;
    var docscode4;
    var t22;
    var div5;
    var div4;
    var fa1;
    var t23;
    var docscode5;
    var t24;
    var docstitle2;
    var t25;
    var docstitle3;
    var t26;
    var div6;
    var fa2;
    var t27;
    var fa3;
    var t28;
    var fa4;
    var t29;
    var fa5;
    var t30;
    var fa6;
    var t31;
    var fa7;
    var t32;
    var fa8;
    var t33;
    var fa9;
    var t34;
    var docscode6;
    var t35;
    var docstitle4;
    var t36;
    var div12;
    var div7;
    var fa10;
    var t37;
    var t38;
    var div8;
    var fa11;
    var t39;
    var t40;
    var div9;
    var fa12;
    var t41;
    var t42;
    var div10;
    var fa13;
    var t43;
    var t44;
    var div11;
    var fa14;
    var t45;
    var t46;
    var docscode7;
    var t47;
    var docstitle5;
    var t48;
    var div13;
    var fa15;
    var t49;
    var fa16;
    var t50;
    var t51;
    var docscode8;
    var t52;
    var docstitle6;
    var t53;
    var docstitle7;
    var t54;
    var div14;
    var fa17;
    var t55;
    var fa18;
    var t56;
    var fa19;
    var t57;
    var fa20;
    var t58;
    var fa21;
    var t59;
    var fa22;
    var t60;
    var fa23;
    var t61;
    var fa24;
    var t62;
    var fa25;
    var t63;
    var docscode9;
    var t64;
    var docstitle8;
    var t65;
    var docstitle9;
    var t66;
    var docsimg0;
    var t67;
    var docscode10;
    var t68;
    var docscode11;
    var t69;
    var docstitle10;
    var t70;
    var docsimg1;
    var t71;
    var docscode12;
    var t72;
    var docstitle11;
    var t73;
    var docsimg2;
    var t74;
    var docscode13;
    var t75;
    var docsimg3;
    var t76;
    var docscode14;
    var t77;
    var docstitle12;
    var t78;
    var docsimg4;
    var t79;
    var docscode15;
    var t80;
    var docstitle13;
    var t81;
    var docsimg5;
    var t82;
    var docscode16;
    var t83;
    var docsimg6;
    var t84;
    var docscode17;
    var t85;
    var docsimg7;
    var t86;
    var docscode18;
    var t87;
    var docscode19;
    var current;
    docstitle0 = new Docs_title({
      props: {
        title: "Installation"
      }
    });
    docscode0 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].installation[0]
      }
    });
    docscode1 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].installation[1]
      }
    });
    docscode2 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].installation[2]
      }
    });
    docscode3 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].installation[3],
        lang: "js"
      }
    });
    docstitle1 = new Docs_title({
      props: {
        title: "Basic Use"
      }
    });
    fa0 = new Fa__default['default']({
      props: {
        icon: faFlag
      }
    });
    docscode4 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].basicUse[0]
      }
    });
    fa1 = new Fa__default['default']({
      props: {
        icon: faFlag
      }
    });
    docscode5 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].basicUse[1]
      }
    });
    docstitle2 = new Docs_title({
      props: {
        title: "Additional Styling"
      }
    });
    docstitle3 = new Docs_title({
      props: {
        title: "Icon Sizes",
        level: 5
      }
    });
    fa2 = new Fa__default['default']({
      props: {
        icon: faFlag,
        size: "xs"
      }
    });
    fa3 = new Fa__default['default']({
      props: {
        icon: faFlag,
        size: "sm"
      }
    });
    fa4 = new Fa__default['default']({
      props: {
        icon: faFlag,
        size: "lg"
      }
    });
    fa5 = new Fa__default['default']({
      props: {
        icon: faFlag,
        size: "2x"
      }
    });
    fa6 = new Fa__default['default']({
      props: {
        icon: faFlag,
        size: "2.5x"
      }
    });
    fa7 = new Fa__default['default']({
      props: {
        icon: faFlag,
        size: "5x"
      }
    });
    fa8 = new Fa__default['default']({
      props: {
        icon: faFlag,
        size: "7x"
      }
    });
    fa9 = new Fa__default['default']({
      props: {
        icon: faFlag,
        size: "10x"
      }
    });
    docscode6 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].additionalStyling[0]
      }
    });
    docstitle4 = new Docs_title({
      props: {
        title: "Fixed Width Icons",
        level: 5
      }
    });
    fa10 = new Fa__default['default']({
      props: {
        icon: faHome,
        fw: true,
        style: "background: mistyrose"
      }
    });
    fa11 = new Fa__default['default']({
      props: {
        icon: faInfo,
        fw: true,
        style: "background: mistyrose"
      }
    });
    fa12 = new Fa__default['default']({
      props: {
        icon: faBook,
        fw: true,
        style: "background: mistyrose"
      }
    });
    fa13 = new Fa__default['default']({
      props: {
        icon: faPencilAlt,
        fw: true,
        style: "background: mistyrose"
      }
    });
    fa14 = new Fa__default['default']({
      props: {
        icon: faCog,
        fw: true,
        style: "background: mistyrose"
      }
    });
    docscode7 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].additionalStyling[1]
      }
    });
    docstitle5 = new Docs_title({
      props: {
        title: "Pulled Icons",
        level: 5
      }
    });
    fa15 = new Fa__default['default']({
      props: {
        icon: faQuoteLeft,
        pull: "left",
        size: "2x"
      }
    });
    fa16 = new Fa__default['default']({
      props: {
        icon: faQuoteRight,
        pull: "right",
        size: "2x"
      }
    });
    docscode8 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].additionalStyling[2]
      }
    });
    docstitle6 = new Docs_title({
      props: {
        title: "Power Transforms"
      }
    });
    docstitle7 = new Docs_title({
      props: {
        title: "Rotating & Flipping",
        level: 5
      }
    });
    fa17 = new Fa__default['default']({
      props: {
        icon: faMagic,
        rotate: 90,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa18 = new Fa__default['default']({
      props: {
        icon: faMagic,
        rotate: 180,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa19 = new Fa__default['default']({
      props: {
        icon: faMagic,
        size: "4x",
        rotate: "270",
        style: "background: mistyrose"
      }
    });
    fa20 = new Fa__default['default']({
      props: {
        icon: faMagic,
        size: "4x",
        rotate: "30",
        style: "background: mistyrose"
      }
    });
    fa21 = new Fa__default['default']({
      props: {
        icon: faMagic,
        size: "4x",
        rotate: "-30",
        style: "background: mistyrose"
      }
    });
    fa22 = new Fa__default['default']({
      props: {
        icon: faMagic,
        size: "4x",
        flip: "vertical",
        style: "background: mistyrose"
      }
    });
    fa23 = new Fa__default['default']({
      props: {
        icon: faMagic,
        size: "4x",
        flip: "horizontal",
        style: "background: mistyrose"
      }
    });
    fa24 = new Fa__default['default']({
      props: {
        icon: faMagic,
        size: "4x",
        flip: "both",
        style: "background: mistyrose"
      }
    });
    fa25 = new Fa__default['default']({
      props: {
        icon: faMagic,
        size: "4x",
        flip: "both",
        rotate: "30",
        style: "background: mistyrose"
      }
    });
    docscode9 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].powerTransforms[0]
      }
    });
    docstitle8 = new Docs_title({
      props: {
        title: "Duotone Icons"
      }
    });
    docstitle9 = new Docs_title({
      props: {
        title: "Basic Use",
        level: 5
      }
    });
    docsimg0 = new Docs_img({
      props: {
        src: "assets/duotone-0.png",
        alt: "duotone icons basic use"
      }
    });
    docscode10 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[0],
        lang: "js"
      }
    });
    docscode11 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[1]
      }
    });
    docstitle10 = new Docs_title({
      props: {
        title: "Swapping Layer Opacity",
        level: 5
      }
    });
    docsimg1 = new Docs_img({
      props: {
        src: "assets/duotone-1.png",
        alt: "swapping duotone icons layer opacity"
      }
    });
    docscode12 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[2]
      }
    });
    docstitle11 = new Docs_title({
      props: {
        title: "Changing Opacity",
        level: 5
      }
    });
    docsimg2 = new Docs_img({
      props: {
        src: "assets/duotone-2.png",
        alt: "changing duotone icons opacity"
      }
    });
    docscode13 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[3]
      }
    });
    docsimg3 = new Docs_img({
      props: {
        src: "assets/duotone-3.png",
        alt: "changing duotone icons opacity"
      }
    });
    docscode14 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[4]
      }
    });
    docstitle12 = new Docs_title({
      props: {
        title: "Coloring Duotone Icons",
        level: 5
      }
    });
    docsimg4 = new Docs_img({
      props: {
        src: "assets/duotone-4.png",
        alt: "coloring duotone icons"
      }
    });
    docscode15 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[5]
      }
    });
    docstitle13 = new Docs_title({
      props: {
        title: "Advanced Use",
        level: 5
      }
    });
    docsimg5 = new Docs_img({
      props: {
        src: "assets/duotone-5.png",
        alt: "duotone icons advanced use"
      }
    });
    docscode16 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[6]
      }
    });
    docsimg6 = new Docs_img({
      props: {
        src: "assets/duotone-6.png",
        alt: "duotone icons advanced use"
      }
    });
    docscode17 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[7]
      }
    });
    docsimg7 = new Docs_img({
      props: {
        src: "assets/duotone-7.png",
        alt: "duotone icons advanced use"
      }
    });
    docscode18 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[8],
        lang: "js"
      }
    });
    docscode19 = new Docs_code({
      props: {
        code:
        /*codes*/
        ctx[0].duotoneIcons[9]
      }
    });
    return {
      c: function c() {
        div15 = element("div");
        create_component(docstitle0.$$.fragment);
        t0 = space();
        create_component(docscode0.$$.fragment);
        t1 = space();
        div0 = element("div");
        div0.innerHTML = "Install FontAwesome icons via <a href=\"https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons\" target=\"_blank\">official packages</a>, for example:";
        t5 = space();
        create_component(docscode1.$$.fragment);
        t6 = space();
        div1 = element("div");
        div1.innerHTML = "<strong>Notice for <a href=\"https://sapper.svelte.dev/\" target=\"_blank\">Sapper</a> user:</strong> You may need to install the component as a devDependency:";
        t11 = space();
        create_component(docscode2.$$.fragment);
        t12 = space();
        div2 = element("div");
        div2.innerHTML = "<strong>Notice for <a href=\"https://kit.svelte.dev/\" target=\"_blank\">Svelte Kit</a> user:</strong> You may need to import the component explicitly as below:";
        t17 = space();
        create_component(docscode3.$$.fragment);
        t18 = space();
        create_component(docstitle1.$$.fragment);
        t19 = space();
        div3 = element("div");
        create_component(fa0.$$.fragment);
        t20 = text(" Flag");
        t21 = space();
        create_component(docscode4.$$.fragment);
        t22 = space();
        div5 = element("div");
        div4 = element("div");
        create_component(fa1.$$.fragment);
        t23 = space();
        create_component(docscode5.$$.fragment);
        t24 = space();
        create_component(docstitle2.$$.fragment);
        t25 = space();
        create_component(docstitle3.$$.fragment);
        t26 = space();
        div6 = element("div");
        create_component(fa2.$$.fragment);
        t27 = space();
        create_component(fa3.$$.fragment);
        t28 = space();
        create_component(fa4.$$.fragment);
        t29 = space();
        create_component(fa5.$$.fragment);
        t30 = space();
        create_component(fa6.$$.fragment);
        t31 = space();
        create_component(fa7.$$.fragment);
        t32 = space();
        create_component(fa8.$$.fragment);
        t33 = space();
        create_component(fa9.$$.fragment);
        t34 = space();
        create_component(docscode6.$$.fragment);
        t35 = space();
        create_component(docstitle4.$$.fragment);
        t36 = space();
        div12 = element("div");
        div7 = element("div");
        create_component(fa10.$$.fragment);
        t37 = text(" Home");
        t38 = space();
        div8 = element("div");
        create_component(fa11.$$.fragment);
        t39 = text(" Info");
        t40 = space();
        div9 = element("div");
        create_component(fa12.$$.fragment);
        t41 = text(" Library");
        t42 = space();
        div10 = element("div");
        create_component(fa13.$$.fragment);
        t43 = text(" Applications");
        t44 = space();
        div11 = element("div");
        create_component(fa14.$$.fragment);
        t45 = text(" Settins");
        t46 = space();
        create_component(docscode7.$$.fragment);
        t47 = space();
        create_component(docstitle5.$$.fragment);
        t48 = space();
        div13 = element("div");
        create_component(fa15.$$.fragment);
        t49 = space();
        create_component(fa16.$$.fragment);
        t50 = text("\n    Gatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that’s no matter — tomorrow we will run faster, stretch our arms further... And one fine morning — So we beat on, boats against the current, borne back ceaselessly into the past.");
        t51 = space();
        create_component(docscode8.$$.fragment);
        t52 = space();
        create_component(docstitle6.$$.fragment);
        t53 = space();
        create_component(docstitle7.$$.fragment);
        t54 = space();
        div14 = element("div");
        create_component(fa17.$$.fragment);
        t55 = space();
        create_component(fa18.$$.fragment);
        t56 = space();
        create_component(fa19.$$.fragment);
        t57 = space();
        create_component(fa20.$$.fragment);
        t58 = space();
        create_component(fa21.$$.fragment);
        t59 = space();
        create_component(fa22.$$.fragment);
        t60 = space();
        create_component(fa23.$$.fragment);
        t61 = space();
        create_component(fa24.$$.fragment);
        t62 = space();
        create_component(fa25.$$.fragment);
        t63 = space();
        create_component(docscode9.$$.fragment);
        t64 = space();
        create_component(docstitle8.$$.fragment);
        t65 = space();
        create_component(docstitle9.$$.fragment);
        t66 = space();
        create_component(docsimg0.$$.fragment);
        t67 = space();
        create_component(docscode10.$$.fragment);
        t68 = space();
        create_component(docscode11.$$.fragment);
        t69 = space();
        create_component(docstitle10.$$.fragment);
        t70 = space();
        create_component(docsimg1.$$.fragment);
        t71 = space();
        create_component(docscode12.$$.fragment);
        t72 = space();
        create_component(docstitle11.$$.fragment);
        t73 = space();
        create_component(docsimg2.$$.fragment);
        t74 = space();
        create_component(docscode13.$$.fragment);
        t75 = space();
        create_component(docsimg3.$$.fragment);
        t76 = space();
        create_component(docscode14.$$.fragment);
        t77 = space();
        create_component(docstitle12.$$.fragment);
        t78 = space();
        create_component(docsimg4.$$.fragment);
        t79 = space();
        create_component(docscode15.$$.fragment);
        t80 = space();
        create_component(docstitle13.$$.fragment);
        t81 = space();
        create_component(docsimg5.$$.fragment);
        t82 = space();
        create_component(docscode16.$$.fragment);
        t83 = space();
        create_component(docsimg6.$$.fragment);
        t84 = space();
        create_component(docscode17.$$.fragment);
        t85 = space();
        create_component(docsimg7.$$.fragment);
        t86 = space();
        create_component(docscode18.$$.fragment);
        t87 = space();
        create_component(docscode19.$$.fragment);
        attr(div0, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        attr(div1, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        attr(div2, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        attr(div3, "class", "shadow-sm p-3 mb-3 rounded");
        set_style(div4, "font-size", "3em");
        set_style(div4, "color", "tomato");
        attr(div5, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div6, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div12, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div13, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        attr(div14, "class", "shadow-sm p-3 mb-3 rounded");
      },
      m: function m(target, anchor) {
        insert(target, div15, anchor);
        mount_component(docstitle0, div15, null);
        append(div15, t0);
        mount_component(docscode0, div15, null);
        append(div15, t1);
        append(div15, div0);
        append(div15, t5);
        mount_component(docscode1, div15, null);
        append(div15, t6);
        append(div15, div1);
        append(div15, t11);
        mount_component(docscode2, div15, null);
        append(div15, t12);
        append(div15, div2);
        append(div15, t17);
        mount_component(docscode3, div15, null);
        append(div15, t18);
        mount_component(docstitle1, div15, null);
        append(div15, t19);
        append(div15, div3);
        mount_component(fa0, div3, null);
        append(div3, t20);
        append(div15, t21);
        mount_component(docscode4, div15, null);
        append(div15, t22);
        append(div15, div5);
        append(div5, div4);
        mount_component(fa1, div4, null);
        append(div15, t23);
        mount_component(docscode5, div15, null);
        append(div15, t24);
        mount_component(docstitle2, div15, null);
        append(div15, t25);
        mount_component(docstitle3, div15, null);
        append(div15, t26);
        append(div15, div6);
        mount_component(fa2, div6, null);
        append(div6, t27);
        mount_component(fa3, div6, null);
        append(div6, t28);
        mount_component(fa4, div6, null);
        append(div6, t29);
        mount_component(fa5, div6, null);
        append(div6, t30);
        mount_component(fa6, div6, null);
        append(div6, t31);
        mount_component(fa7, div6, null);
        append(div6, t32);
        mount_component(fa8, div6, null);
        append(div6, t33);
        mount_component(fa9, div6, null);
        append(div15, t34);
        mount_component(docscode6, div15, null);
        append(div15, t35);
        mount_component(docstitle4, div15, null);
        append(div15, t36);
        append(div15, div12);
        append(div12, div7);
        mount_component(fa10, div7, null);
        append(div7, t37);
        append(div12, t38);
        append(div12, div8);
        mount_component(fa11, div8, null);
        append(div8, t39);
        append(div12, t40);
        append(div12, div9);
        mount_component(fa12, div9, null);
        append(div9, t41);
        append(div12, t42);
        append(div12, div10);
        mount_component(fa13, div10, null);
        append(div10, t43);
        append(div12, t44);
        append(div12, div11);
        mount_component(fa14, div11, null);
        append(div11, t45);
        append(div15, t46);
        mount_component(docscode7, div15, null);
        append(div15, t47);
        mount_component(docstitle5, div15, null);
        append(div15, t48);
        append(div15, div13);
        mount_component(fa15, div13, null);
        append(div13, t49);
        mount_component(fa16, div13, null);
        append(div13, t50);
        append(div15, t51);
        mount_component(docscode8, div15, null);
        append(div15, t52);
        mount_component(docstitle6, div15, null);
        append(div15, t53);
        mount_component(docstitle7, div15, null);
        append(div15, t54);
        append(div15, div14);
        mount_component(fa17, div14, null);
        append(div14, t55);
        mount_component(fa18, div14, null);
        append(div14, t56);
        mount_component(fa19, div14, null);
        append(div14, t57);
        mount_component(fa20, div14, null);
        append(div14, t58);
        mount_component(fa21, div14, null);
        append(div14, t59);
        mount_component(fa22, div14, null);
        append(div14, t60);
        mount_component(fa23, div14, null);
        append(div14, t61);
        mount_component(fa24, div14, null);
        append(div14, t62);
        mount_component(fa25, div14, null);
        append(div15, t63);
        mount_component(docscode9, div15, null);
        append(div15, t64);
        mount_component(docstitle8, div15, null);
        append(div15, t65);
        mount_component(docstitle9, div15, null);
        append(div15, t66);
        mount_component(docsimg0, div15, null);
        append(div15, t67);
        mount_component(docscode10, div15, null);
        append(div15, t68);
        mount_component(docscode11, div15, null);
        append(div15, t69);
        mount_component(docstitle10, div15, null);
        append(div15, t70);
        mount_component(docsimg1, div15, null);
        append(div15, t71);
        mount_component(docscode12, div15, null);
        append(div15, t72);
        mount_component(docstitle11, div15, null);
        append(div15, t73);
        mount_component(docsimg2, div15, null);
        append(div15, t74);
        mount_component(docscode13, div15, null);
        append(div15, t75);
        mount_component(docsimg3, div15, null);
        append(div15, t76);
        mount_component(docscode14, div15, null);
        append(div15, t77);
        mount_component(docstitle12, div15, null);
        append(div15, t78);
        mount_component(docsimg4, div15, null);
        append(div15, t79);
        mount_component(docscode15, div15, null);
        append(div15, t80);
        mount_component(docstitle13, div15, null);
        append(div15, t81);
        mount_component(docsimg5, div15, null);
        append(div15, t82);
        mount_component(docscode16, div15, null);
        append(div15, t83);
        mount_component(docsimg6, div15, null);
        append(div15, t84);
        mount_component(docscode17, div15, null);
        append(div15, t85);
        mount_component(docsimg7, div15, null);
        append(div15, t86);
        mount_component(docscode18, div15, null);
        append(div15, t87);
        mount_component(docscode19, div15, null);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(docstitle0.$$.fragment, local);
        transition_in(docscode0.$$.fragment, local);
        transition_in(docscode1.$$.fragment, local);
        transition_in(docscode2.$$.fragment, local);
        transition_in(docscode3.$$.fragment, local);
        transition_in(docstitle1.$$.fragment, local);
        transition_in(fa0.$$.fragment, local);
        transition_in(docscode4.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        transition_in(docscode5.$$.fragment, local);
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
        transition_in(docscode6.$$.fragment, local);
        transition_in(docstitle4.$$.fragment, local);
        transition_in(fa10.$$.fragment, local);
        transition_in(fa11.$$.fragment, local);
        transition_in(fa12.$$.fragment, local);
        transition_in(fa13.$$.fragment, local);
        transition_in(fa14.$$.fragment, local);
        transition_in(docscode7.$$.fragment, local);
        transition_in(docstitle5.$$.fragment, local);
        transition_in(fa15.$$.fragment, local);
        transition_in(fa16.$$.fragment, local);
        transition_in(docscode8.$$.fragment, local);
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
        transition_in(docscode9.$$.fragment, local);
        transition_in(docstitle8.$$.fragment, local);
        transition_in(docstitle9.$$.fragment, local);
        transition_in(docsimg0.$$.fragment, local);
        transition_in(docscode10.$$.fragment, local);
        transition_in(docscode11.$$.fragment, local);
        transition_in(docstitle10.$$.fragment, local);
        transition_in(docsimg1.$$.fragment, local);
        transition_in(docscode12.$$.fragment, local);
        transition_in(docstitle11.$$.fragment, local);
        transition_in(docsimg2.$$.fragment, local);
        transition_in(docscode13.$$.fragment, local);
        transition_in(docsimg3.$$.fragment, local);
        transition_in(docscode14.$$.fragment, local);
        transition_in(docstitle12.$$.fragment, local);
        transition_in(docsimg4.$$.fragment, local);
        transition_in(docscode15.$$.fragment, local);
        transition_in(docstitle13.$$.fragment, local);
        transition_in(docsimg5.$$.fragment, local);
        transition_in(docscode16.$$.fragment, local);
        transition_in(docsimg6.$$.fragment, local);
        transition_in(docscode17.$$.fragment, local);
        transition_in(docsimg7.$$.fragment, local);
        transition_in(docscode18.$$.fragment, local);
        transition_in(docscode19.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docstitle0.$$.fragment, local);
        transition_out(docscode0.$$.fragment, local);
        transition_out(docscode1.$$.fragment, local);
        transition_out(docscode2.$$.fragment, local);
        transition_out(docscode3.$$.fragment, local);
        transition_out(docstitle1.$$.fragment, local);
        transition_out(fa0.$$.fragment, local);
        transition_out(docscode4.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        transition_out(docscode5.$$.fragment, local);
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
        transition_out(docscode6.$$.fragment, local);
        transition_out(docstitle4.$$.fragment, local);
        transition_out(fa10.$$.fragment, local);
        transition_out(fa11.$$.fragment, local);
        transition_out(fa12.$$.fragment, local);
        transition_out(fa13.$$.fragment, local);
        transition_out(fa14.$$.fragment, local);
        transition_out(docscode7.$$.fragment, local);
        transition_out(docstitle5.$$.fragment, local);
        transition_out(fa15.$$.fragment, local);
        transition_out(fa16.$$.fragment, local);
        transition_out(docscode8.$$.fragment, local);
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
        transition_out(docscode9.$$.fragment, local);
        transition_out(docstitle8.$$.fragment, local);
        transition_out(docstitle9.$$.fragment, local);
        transition_out(docsimg0.$$.fragment, local);
        transition_out(docscode10.$$.fragment, local);
        transition_out(docscode11.$$.fragment, local);
        transition_out(docstitle10.$$.fragment, local);
        transition_out(docsimg1.$$.fragment, local);
        transition_out(docscode12.$$.fragment, local);
        transition_out(docstitle11.$$.fragment, local);
        transition_out(docsimg2.$$.fragment, local);
        transition_out(docscode13.$$.fragment, local);
        transition_out(docsimg3.$$.fragment, local);
        transition_out(docscode14.$$.fragment, local);
        transition_out(docstitle12.$$.fragment, local);
        transition_out(docsimg4.$$.fragment, local);
        transition_out(docscode15.$$.fragment, local);
        transition_out(docstitle13.$$.fragment, local);
        transition_out(docsimg5.$$.fragment, local);
        transition_out(docscode16.$$.fragment, local);
        transition_out(docsimg6.$$.fragment, local);
        transition_out(docscode17.$$.fragment, local);
        transition_out(docsimg7.$$.fragment, local);
        transition_out(docscode18.$$.fragment, local);
        transition_out(docscode19.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) detach(div15);
        destroy_component(docstitle0);
        destroy_component(docscode0);
        destroy_component(docscode1);
        destroy_component(docscode2);
        destroy_component(docscode3);
        destroy_component(docstitle1);
        destroy_component(fa0);
        destroy_component(docscode4);
        destroy_component(fa1);
        destroy_component(docscode5);
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
        destroy_component(docscode6);
        destroy_component(docstitle4);
        destroy_component(fa10);
        destroy_component(fa11);
        destroy_component(fa12);
        destroy_component(fa13);
        destroy_component(fa14);
        destroy_component(docscode7);
        destroy_component(docstitle5);
        destroy_component(fa15);
        destroy_component(fa16);
        destroy_component(docscode8);
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
        destroy_component(docscode9);
        destroy_component(docstitle8);
        destroy_component(docstitle9);
        destroy_component(docsimg0);
        destroy_component(docscode10);
        destroy_component(docscode11);
        destroy_component(docstitle10);
        destroy_component(docsimg1);
        destroy_component(docscode12);
        destroy_component(docstitle11);
        destroy_component(docsimg2);
        destroy_component(docscode13);
        destroy_component(docsimg3);
        destroy_component(docscode14);
        destroy_component(docstitle12);
        destroy_component(docsimg4);
        destroy_component(docscode15);
        destroy_component(docstitle13);
        destroy_component(docsimg5);
        destroy_component(docscode16);
        destroy_component(docsimg6);
        destroy_component(docscode17);
        destroy_component(docsimg7);
        destroy_component(docscode18);
        destroy_component(docscode19);
      }
    };
  }

  function instance$4($$self) {
    var codes = {
      installation: ["npm install svelte-fa", "npm install @fortawesome/free-solid-svg-icons", "npm install svelte-fa -D", "import Fa from 'svelte-fa/src/fa.svelte'"],
      basicUse: ["<script>\n  import Fa from 'svelte-fa'\n  import { faFlag } from '@fortawesome/free-solid-svg-icons'\n</script>\n\n<Fa icon={faFlag} /> Flag", "<div style=\"font-size: 3em; color: tomato\">\n  <Fa icon={faFlag} />\n</div>"],
      additionalStyling: ["<Fa icon={faFlag} size=\"xs\" />\n<Fa icon={faFlag} size=\"sm\" />\n<Fa icon={faFlag} size=\"lg\" />\n<Fa icon={faFlag} size=\"2x\" />\n<Fa icon={faFlag} size=\"2.5x\" />\n<Fa icon={faFlag} size=\"5x\" />\n<Fa icon={faFlag} size=\"7x\" />\n<Fa icon={faFlag} size=\"10x\" />", "<div>\n  <Fa icon={faHome} fw style=\"background: mistyrose\" /> Home\n</div>\n<div>\n  <Fa icon={faInfo} fw style=\"background: mistyrose\" /> Info\n</div>\n<div>\n  <Fa icon={faBook} fw style=\"background: mistyrose\" /> Library\n</div>\n<div>\n  <Fa icon={faPencilAlt} fw style=\"background: mistyrose\" /> Applications\n</div>\n<div>\n  <Fa icon={faCog} fw style=\"background: mistyrose\" /> Settins\n</div>", "<Fa icon={faQuoteLeft} pull=\"left\" size=\"2x\" />\n<Fa icon={faQuoteRight} pull=\"right\" size=\"2x\" />\nGatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that\u2019s no matter \u2014 tomorrow we will run faster, stretch our arms further... And one fine morning \u2014 So we beat on, boats against the current, borne back ceaselessly into the past."],
      powerTransforms: ["<Fa icon={faMagic} size=\"4x\" rotate={90} style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate={180} style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"270\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"30\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" rotate=\"-30\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"vertical\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"horizontal\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"both\" style=\"background: mistyrose\"/>\n<Fa icon={faMagic} size=\"4x\" flip=\"both\" style=\"background: mistyrose\"/>"],
      duotoneIcons: ["import {\n  faCamera,\n  faFireAlt,\n  faBusAlt,\n  faFillDrip,\n} from '@fortawesome/pro-duotone-svg-icons'", "<Fa icon={faCamera} size=\"3x\" />\n<Fa icon={faFireAlt} size=\"3x\" />\n<Fa icon={faBusAlt} size=\"3x\" />\n<Fa icon={faFillDrip} size=\"3x\" />", "<Fa icon={faCamera} size=\"3x\" />\n<Fa icon={faCamera} size=\"3x\" swapOpacity />\n<Fa icon={faFireAlt} size=\"3x\" />\n<Fa icon={faFireAlt} size=\"3x\" swapOpacity />\n<Fa icon={faBusAlt} size=\"3x\" />\n<Fa icon={faBusAlt} size=\"3x\" swapOpacity />\n<Fa icon={faFillDrip} size=\"3x\" />\n<Fa icon={faFillDrip} size=\"3x\" swapOpacity />", "<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.2} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.4} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.6} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.8} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={1} />", "<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.2} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.4} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.6} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.8} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={1} />", "<Fa icon={faBusAlt} size=\"3x\" primaryColor=\"gold\" />\n<Fa icon={faBusAlt} size=\"3x\" primaryColor=\"orangered\" />\n<Fa icon={faFillDrip} size=\"3x\" secondaryColor=\"limegreen\" />\n<Fa icon={faFillDrip} size=\"3x\" secondaryColor=\"rebeccapurple\" />\n<Fa icon={faBatteryFull} size=\"3x\" primaryColor=\"limegreen\" secondaryColor=\"dimgray\" />\n<Fa icon={faBatteryQuarter} size=\"3x\" primaryColor=\"orange\" secondaryColor=\"dimgray\" />", "<Fa icon={faBook} size=\"3x\" secondaryOpacity={1} primaryColor=\"lightseagreen\" secondaryColor=\"linen\" />\n<Fa icon={faBookSpells} size=\"3x\" secondaryOpacity={1} primaryColor=\"mediumpurple\" secondaryColor=\"linen\" />\n<Fa icon={faBookMedical} size=\"3x\" secondaryOpacity={1} primaryColor=\"crimson\" secondaryColor=\"linen\" />\n<Fa icon={faBookUser} size=\"3x\" secondaryOpacity={1} primaryColor=\"peru\" secondaryColor=\"linen\" />\n<Fa icon={faToggleOff} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"gray\" />\n<Fa icon={faToggleOn} size=\"3x\" secondaryOpacity={1} primaryColor=\"dodgerblue\" secondaryColor=\"white\" />\n<Fa icon={faFilePlus} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"limegreen\" />\n<Fa icon={faFileExclamation} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"gold\" />\n<Fa icon={faFileTimes} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"tomato\" />", "<Fa icon={faCrow} size=\"3x\" secondaryOpacity={1} primaryColor=\"dodgerblue\" secondaryColor=\"gold\" />\n<Fa icon={faCampfire} size=\"3x\" secondaryOpacity={1} primaryColor=\"sienna\" secondaryColor=\"red\" />\n<Fa icon={faBirthdayCake} size=\"3x\" secondaryOpacity={1} primaryColor=\"pink\" secondaryColor=\"palevioletred\" />\n<Fa icon={faEar} size=\"3x\" secondaryOpacity={1} primaryColor=\"sandybrown\" secondaryColor=\"bisque\" />\n<Fa icon={faCorn} size=\"3x\" secondaryOpacity={1} primaryColor=\"mediumseagreen\" secondaryColor=\"gold\" />\n<Fa icon={faCookieBite} size=\"3x\" secondaryOpacity={1} primaryColor=\"saddlebrown\" secondaryColor=\"burlywood\" />", "const themeRavenclaw = {\n  secondaryOpacity: 1,\n  primaryColor: '#0438a1',\n  secondaryColor: '#6c6c6c',\n}", "<Fa icon={faHatWizard} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faFlaskPotion} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faWandMagic} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faScarf} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faBookSpells} size=\"3x\" {...themeRavenclaw} />"]
    };
    return [codes];
  }

  var Docs = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Docs, _SvelteComponent);

    function Docs(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$4, create_fragment$4, safe_not_equal, {});
      return _this;
    }

    return Docs;
  }(SvelteComponent);

  function create_fragment$5(ctx) {
    var div;
    var showcase;
    var t;
    var docs;
    var current;
    showcase = new Showcase({});
    docs = new Docs({});
    return {
      c: function c() {
        div = element("div");
        create_component(showcase.$$.fragment);
        t = space();
        create_component(docs.$$.fragment);
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
        if (detaching) detach(div);
        destroy_component(showcase);
        destroy_component(docs);
      }
    };
  }

  var App = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(App, _SvelteComponent);

    function App(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$5, safe_not_equal, {});
      return _this;
    }

    return App;
  }(SvelteComponent);

  new App({
    target: document.getElementById('app')
  });

}(SvelteFa));
