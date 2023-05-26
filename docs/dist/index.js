(function (Fa) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Fa__default = /*#__PURE__*/_interopDefaultLegacy(Fa);

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
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
      } else if (descriptors[key] && descriptors[key].set) {
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

  function set_input_value(input, value) {
    if (value != null || input.value) {
      input.value = value;
    }
  }

  function set_input_type(input, type) {
    try {
      input.type = type;
    } catch (e) {// do nothing
    }
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
      dirty: dirty
    };
    var ready = false;
    $$.ctx = instance ? instance(component, prop_values, function (i, ret, value) {
      if (value === void 0) {
        value = ret;
      }

      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if ($$.bound[i]) $$.bound[i](value);
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.l(children(options.target));
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

    _proto3.$set = function $set() {// overridden by instance, if it has props
    };

    return SvelteComponent;
  }();

  var faArrowsRotate={prefix:'fas',iconName:'arrows-rotate',icon:[512,512,[128472,"refresh","sync"],"f021","M464 16c-17.67 0-32 14.31-32 32v74.09C392.1 66.52 327.4 32 256 32C161.5 32 78.59 92.34 49.58 182.2c-5.438 16.81 3.797 34.88 20.61 40.28c16.89 5.5 34.88-3.812 40.3-20.59C130.9 138.5 189.4 96 256 96c50.5 0 96.26 24.55 124.4 64H336c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32V48C496 30.31 481.7 16 464 16zM441.8 289.6c-16.92-5.438-34.88 3.812-40.3 20.59C381.1 373.5 322.6 416 256 416c-50.5 0-96.25-24.55-124.4-64H176c17.67 0 32-14.31 32-32s-14.33-32-32-32h-128c-17.67 0-32 14.31-32 32v144c0 17.69 14.33 32 32 32s32-14.31 32-32v-74.09C119.9 445.5 184.6 480 255.1 480c94.45 0 177.4-60.34 206.4-150.2C467.9 313 458.6 294.1 441.8 289.6z"]};var faSync=faArrowsRotate;var faBook={prefix:'fas',iconName:'book',icon:[448,512,[128212],"f02d","M448 336v-288C448 21.49 426.5 0 400 0H96C42.98 0 0 42.98 0 96v320c0 53.02 42.98 96 96 96h320c17.67 0 32-14.33 32-31.1c0-11.72-6.607-21.52-16-27.1v-81.36C441.8 362.8 448 350.2 448 336zM143.1 128h192C344.8 128 352 135.2 352 144C352 152.8 344.8 160 336 160H143.1C135.2 160 128 152.8 128 144C128 135.2 135.2 128 143.1 128zM143.1 192h192C344.8 192 352 199.2 352 208C352 216.8 344.8 224 336 224H143.1C135.2 224 128 216.8 128 208C128 199.2 135.2 192 143.1 192zM384 448H96c-17.67 0-32-14.33-32-32c0-17.67 14.33-32 32-32h288V448z"]};var faBookmark={prefix:'fas',iconName:'bookmark',icon:[384,512,[61591,128278],"f02e","M384 48V512l-192-112L0 512V48C0 21.5 21.5 0 48 0h288C362.5 0 384 21.5 384 48z"]};var faCalendar={prefix:'fas',iconName:'calendar',icon:[448,512,[128198,128197],"f133","M96 32C96 14.33 110.3 0 128 0C145.7 0 160 14.33 160 32V64H288V32C288 14.33 302.3 0 320 0C337.7 0 352 14.33 352 32V64H400C426.5 64 448 85.49 448 112V160H0V112C0 85.49 21.49 64 48 64H96V32zM448 464C448 490.5 426.5 512 400 512H48C21.49 512 0 490.5 0 464V192H448V464z"]};var faCertificate={prefix:'fas',iconName:'certificate',icon:[512,512,[],"f0a3","M256 53.46L300.1 7.261C307 1.034 315.1-1.431 324.4 .8185C332.8 3.068 339.3 9.679 341.4 18.1L357.3 80.6L419.3 63.07C427.7 60.71 436.7 63.05 442.8 69.19C448.1 75.34 451.3 84.33 448.9 92.69L431.4 154.7L493.9 170.6C502.3 172.7 508.9 179.2 511.2 187.6C513.4 196 510.1 204.1 504.7 211L458.5 256L504.7 300.1C510.1 307 513.4 315.1 511.2 324.4C508.9 332.8 502.3 339.3 493.9 341.4L431.4 357.3L448.9 419.3C451.3 427.7 448.1 436.7 442.8 442.8C436.7 448.1 427.7 451.3 419.3 448.9L357.3 431.4L341.4 493.9C339.3 502.3 332.8 508.9 324.4 511.2C315.1 513.4 307 510.1 300.1 504.7L256 458.5L211 504.7C204.1 510.1 196 513.4 187.6 511.2C179.2 508.9 172.7 502.3 170.6 493.9L154.7 431.4L92.69 448.9C84.33 451.3 75.34 448.1 69.19 442.8C63.05 436.7 60.71 427.7 63.07 419.3L80.6 357.3L18.1 341.4C9.679 339.3 3.068 332.8 .8186 324.4C-1.431 315.1 1.034 307 7.261 300.1L53.46 256L7.261 211C1.034 204.1-1.431 196 .8186 187.6C3.068 179.2 9.679 172.7 18.1 170.6L80.6 154.7L63.07 92.69C60.71 84.33 63.05 75.34 69.19 69.19C75.34 63.05 84.33 60.71 92.69 63.07L154.7 80.6L170.6 18.1C172.7 9.679 179.2 3.068 187.6 .8185C196-1.431 204.1 1.034 211 7.261L256 53.46z"]};var faCircle={prefix:'fas',iconName:'circle',icon:[512,512,[128308,128309,128992,128993,128994,128995,128996,9898,9899,11044,61708,61915,9679],"f111","M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256z"]};var faCircleNotch={prefix:'fas',iconName:'circle-notch',icon:[512,512,[],"f1ce","M222.7 32.15C227.7 49.08 218.1 66.9 201.1 71.94C121.8 95.55 64 169.1 64 255.1C64 362 149.1 447.1 256 447.1C362 447.1 448 362 448 255.1C448 169.1 390.2 95.55 310.9 71.94C293.9 66.9 284.3 49.08 289.3 32.15C294.4 15.21 312.2 5.562 329.1 10.6C434.9 42.07 512 139.1 512 255.1C512 397.4 397.4 511.1 256 511.1C114.6 511.1 0 397.4 0 255.1C0 139.1 77.15 42.07 182.9 10.6C199.8 5.562 217.6 15.21 222.7 32.15V32.15z"]};var faEnvelope={prefix:'fas',iconName:'envelope',icon:[512,512,[128386,61443,9993],"f0e0","M464 64C490.5 64 512 85.49 512 112C512 127.1 504.9 141.3 492.8 150.4L275.2 313.6C263.8 322.1 248.2 322.1 236.8 313.6L19.2 150.4C7.113 141.3 0 127.1 0 112C0 85.49 21.49 64 48 64H464zM217.6 339.2C240.4 356.3 271.6 356.3 294.4 339.2L512 176V384C512 419.3 483.3 448 448 448H64C28.65 448 0 419.3 0 384V176L217.6 339.2z"]};var faFlag={prefix:'fas',iconName:'flag',icon:[512,512,[61725,127988],"f024","M64 496C64 504.8 56.75 512 48 512h-32C7.25 512 0 504.8 0 496V32c0-17.75 14.25-32 32-32s32 14.25 32 32V496zM476.3 0c-6.365 0-13.01 1.35-19.34 4.233c-45.69 20.86-79.56 27.94-107.8 27.94c-59.96 0-94.81-31.86-163.9-31.87C160.9 .3055 131.6 4.867 96 15.75v350.5c32-9.984 59.87-14.1 84.85-14.1c73.63 0 124.9 31.78 198.6 31.78c31.91 0 68.02-5.971 111.1-23.09C504.1 355.9 512 344.4 512 332.1V30.73C512 11.1 495.3 0 476.3 0z"]};var faGear={prefix:'fas',iconName:'gear',icon:[512,512,[9881,"cog"],"f013","M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"]};var faCog=faGear;var faHeart={prefix:'fas',iconName:'heart',icon:[512,512,[128153,128154,128155,128156,128420,129293,129294,129505,10084,61578,9829],"f004","M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"]};var faHouse={prefix:'fas',iconName:'house',icon:[576,512,[63498,63500,127968,"home","home-alt","home-lg-alt"],"f015","M575.8 255.5C575.8 273.5 560.8 287.6 543.8 287.6H511.8L512.5 447.7C512.5 450.5 512.3 453.1 512 455.8V472C512 494.1 494.1 512 472 512H456C454.9 512 453.8 511.1 452.7 511.9C451.3 511.1 449.9 512 448.5 512H392C369.9 512 352 494.1 352 472V384C352 366.3 337.7 352 320 352H256C238.3 352 224 366.3 224 384V472C224 494.1 206.1 512 184 512H128.1C126.6 512 125.1 511.9 123.6 511.8C122.4 511.9 121.2 512 120 512H104C81.91 512 64 494.1 64 472V360C64 359.1 64.03 358.1 64.09 357.2V287.6H32.05C14.02 287.6 0 273.5 0 255.5C0 246.5 3.004 238.5 10.01 231.5L266.4 8.016C273.4 1.002 281.4 0 288.4 0C295.4 0 303.4 2.004 309.5 7.014L564.8 231.5C572.8 238.5 576.9 246.5 575.8 255.5L575.8 255.5z"]};var faHome=faHouse;var faInfo={prefix:'fas',iconName:'info',icon:[192,512,[],"f129","M160 448h-32V224c0-17.69-14.33-32-32-32L32 192c-17.67 0-32 14.31-32 32s14.33 31.1 32 31.1h32v192H32c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32S177.7 448 160 448zM96 128c26.51 0 48-21.49 48-48S122.5 32.01 96 32.01s-48 21.49-48 48S69.49 128 96 128z"]};var faLink={prefix:'fas',iconName:'link',icon:[640,512,[128279,"chain"],"f0c1","M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"]};var faMoon={prefix:'fas',iconName:'moon',icon:[512,512,[127769,9214],"f186","M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z"]};var faPencil={prefix:'fas',iconName:'pencil',icon:[512,512,[61504,9999,"pencil-alt"],"f303","M421.7 220.3L188.5 453.4L154.6 419.5L158.1 416H112C103.2 416 96 408.8 96 400V353.9L92.51 357.4C87.78 362.2 84.31 368 82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3zM492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75z"]};var faPencilAlt=faPencil;var faPlay={prefix:'fas',iconName:'play',icon:[384,512,[9654],"f04b","M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z"]};var faQuoteLeft={prefix:'fas',iconName:'quote-left',icon:[448,512,[8220,"quote-left-alt"],"f10d","M96 224C84.72 224 74.05 226.3 64 229.9V224c0-35.3 28.7-64 64-64c17.67 0 32-14.33 32-32S145.7 96 128 96C57.42 96 0 153.4 0 224v96c0 53.02 42.98 96 96 96s96-42.98 96-96S149 224 96 224zM352 224c-11.28 0-21.95 2.305-32 5.879V224c0-35.3 28.7-64 64-64c17.67 0 32-14.33 32-32s-14.33-32-32-32c-70.58 0-128 57.42-128 128v96c0 53.02 42.98 96 96 96s96-42.98 96-96S405 224 352 224z"]};var faQuoteRight={prefix:'fas',iconName:'quote-right',icon:[448,512,[8221,"quote-right-alt"],"f10e","M96 96C42.98 96 0 138.1 0 192s42.98 96 96 96c11.28 0 21.95-2.305 32-5.879V288c0 35.3-28.7 64-64 64c-17.67 0-32 14.33-32 32s14.33 32 32 32c70.58 0 128-57.42 128-128V192C192 138.1 149 96 96 96zM448 192c0-53.02-42.98-96-96-96s-96 42.98-96 96s42.98 96 96 96c11.28 0 21.95-2.305 32-5.879V288c0 35.3-28.7 64-64 64c-17.67 0-32 14.33-32 32s14.33 32 32 32c70.58 0 128-57.42 128-128V192z"]};var faSeedling={prefix:'fas',iconName:'seedling',icon:[512,512,[127793,"sprout"],"f4d8","M64 95.1H0c0 123.8 100.3 224 224 224v128C224 465.6 238.4 480 255.1 480S288 465.6 288 448V320C288 196.3 187.7 95.1 64 95.1zM448 32c-84.25 0-157.4 46.5-195.8 115.3c27.75 30.12 48.25 66.88 59 107.5C424 243.1 512 147.9 512 32H448z"]};var faSpinner={prefix:'fas',iconName:'spinner',icon:[512,512,[],"f110","M304 48C304 74.51 282.5 96 256 96C229.5 96 208 74.51 208 48C208 21.49 229.5 0 256 0C282.5 0 304 21.49 304 48zM304 464C304 490.5 282.5 512 256 512C229.5 512 208 490.5 208 464C208 437.5 229.5 416 256 416C282.5 416 304 437.5 304 464zM0 256C0 229.5 21.49 208 48 208C74.51 208 96 229.5 96 256C96 282.5 74.51 304 48 304C21.49 304 0 282.5 0 256zM512 256C512 282.5 490.5 304 464 304C437.5 304 416 282.5 416 256C416 229.5 437.5 208 464 208C490.5 208 512 229.5 512 256zM74.98 437C56.23 418.3 56.23 387.9 74.98 369.1C93.73 350.4 124.1 350.4 142.9 369.1C161.6 387.9 161.6 418.3 142.9 437C124.1 455.8 93.73 455.8 74.98 437V437zM142.9 142.9C124.1 161.6 93.73 161.6 74.98 142.9C56.24 124.1 56.24 93.73 74.98 74.98C93.73 56.23 124.1 56.23 142.9 74.98C161.6 93.73 161.6 124.1 142.9 142.9zM369.1 369.1C387.9 350.4 418.3 350.4 437 369.1C455.8 387.9 455.8 418.3 437 437C418.3 455.8 387.9 455.8 369.1 437C350.4 418.3 350.4 387.9 369.1 369.1V369.1z"]};var faStar={prefix:'fas',iconName:'star',icon:[576,512,[61446,11088],"f005","M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"]};var faStroopwafel={prefix:'fas',iconName:'stroopwafel',icon:[512,512,[],"f551","M188.1 210.8l-45.25 45.25l45.25 45.25l45.25-45.25L188.1 210.8zM301.2 188.1l-45.25-45.25L210.7 188.1l45.25 45.25L301.2 188.1zM210.7 323.9l45.25 45.25l45.25-45.25L255.1 278.6L210.7 323.9zM256 16c-132.5 0-240 107.5-240 240s107.5 240 240 240s240-107.5 240-240S388.5 16 256 16zM442.6 295.6l-11.25 11.25c-3.125 3.125-8.25 3.125-11.38 0L391.8 278.6l-45.25 45.25l34 33.88l16.88-16.88c3.125-3.125 8.251-3.125 11.38 0l11.25 11.25c3.125 3.125 3.125 8.25 0 11.38l-16.88 16.88l16.88 17c3.125 3.125 3.125 8.25 0 11.38l-11.25 11.25c-3.125 3.125-8.251 3.125-11.38 0l-16.88-17l-17 17c-3.125 3.125-8.25 3.125-11.38 0l-11.25-11.25c-3.125-3.125-3.125-8.25 0-11.38l17-17l-34-33.88l-45.25 45.25l28.25 28.25c3.125 3.125 3.125 8.25 0 11.38l-11.25 11.25c-3.125 3.125-8.25 3.125-11.38 0l-28.25-28.25L227.7 442.6c-3.125 3.125-8.25 3.125-11.38 0l-11.25-11.25c-3.125-3.125-3.125-8.25 0-11.38l28.25-28.25l-45.25-45.25l-33.88 34l16.88 16.88c3.125 3.125 3.125 8.25 0 11.38l-11.25 11.25c-3.125 3.125-8.25 3.125-11.38 0L131.6 403.1l-16.1 16.88c-3.125 3.125-8.25 3.125-11.38 0l-11.25-11.25c-3.125-3.125-3.125-8.25 0-11.38l17-16.88l-17-17c-3.125-3.125-3.125-8.25 0-11.38l11.25-11.25c3.125-3.125 8.25-3.125 11.38 0l16.1 17l33.88-34L120.2 278.6l-28.25 28.25c-3.125 3.125-8.25 3.125-11.38 0L69.37 295.6c-3.125-3.125-3.125-8.25 0-11.38l28.25-28.25l-28.25-28.25c-3.125-3.125-3.125-8.25 0-11.38l11.25-11.25c3.125-3.125 8.25-3.125 11.38 0l28.25 28.25l45.25-45.25l-34-34l-16.88 17c-3.125 3.125-8.25 3.125-11.38 0l-11.25-11.25c-3.125-3.125-3.125-8.25 0-11.38l16.88-17l-16.88-16.88c-3.125-3.125-3.125-8.25 0-11.38l11.25-11.25c3.125-3.125 8.25-3.125 11.38 0l16.88 17l17-17c3.125-3.125 8.25-3.125 11.38 0l11.25 11.25c3.125 3.125 3.125 8.25 0 11.38l-17 16.88l34 34l45.25-45.25L205.1 92c-3.125-3.125-3.125-8.25 0-11.38l11.25-11.25c3.125-3.125 8.25-3.125 11.38 0l28.25 28.25l28.25-28.25c3.125-3.125 8.25-3.125 11.38 0l11.25 11.25c3.125 3.125 3.125 8.25 0 11.38l-28.25 28.25l45.25 45.25l34-34l-17-16.88c-3.125-3.125-3.125-8.25 0-11.38l11.25-11.25c3.125-3.125 8.25-3.125 11.38 0l17 16.88l16.88-16.88c3.125-3.125 8.251-3.125 11.38 0l11.25 11.25c3.125 3.125 3.125 8.25 0 11.38l-17 16.88l17 17c3.125 3.125 3.125 8.25 0 11.38l-11.25 11.25c-3.125 3.125-8.251 3.125-11.38 0l-16.88-17l-34 34l45.25 45.25l28.25-28.25c3.125-3.125 8.25-3.125 11.38 0l11.25 11.25c3.125 3.125 3.125 8.25 0 11.38l-28.25 28.25l28.25 28.25C445.7 287.4 445.7 292.5 442.6 295.6zM278.6 256l45.25 45.25l45.25-45.25l-45.25-45.25L278.6 256z"]};var faSun={prefix:'fas',iconName:'sun',icon:[512,512,[9728],"f185","M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1zM509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z"]};var faXmark={prefix:'fas',iconName:'xmark',icon:[320,512,[128473,10005,10006,10060,215,"close","multiply","remove","times"],"f00d","M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"]};var faTimes=faXmark;

  function add_css$2() {
    var style = element("style");
    style.id = "svelte-1a2mimh-style";
    style.textContent = ".hue.svelte-1a2mimh{color:#238ae6;animation:svelte-1a2mimh-hue 30s infinite linear}@keyframes svelte-1a2mimh-hue{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(-360deg)}}";
    append(document.head, style);
  }

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
    var dispose;

    function click_handler() {
      var _ctx;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (
        /*click_handler*/
        (_ctx = ctx)[7].apply(_ctx, [
        /*p*/
        ctx[16]].concat(args))
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
        dispose = listen(button, "click", click_handler);
        this.first = button;
      },
      m: function m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);
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
    var dispose;

    function click_handler_1() {
      var _ctx2;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (
        /*click_handler_1*/
        (_ctx2 = ctx)[8].apply(_ctx2, [
        /*f*/
        ctx[13]].concat(args))
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
        dispose = listen(button, "click", click_handler_1);
        this.first = button;
      },
      m: function m(target, anchor) {
        insert(target, button, anchor);
        append(button, t0);
        append(button, t1);
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
        dispose();
      }
    };
  } // (149:6) {#each icons as icon, name}


  function create_each_block(ctx) {
    var div;
    var t;
    var current;
    var fa = new Fa__default["default"]({
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

  function create_fragment$c(ctx) {
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

      var _key3 = get_key_1(_child_ctx);

      each1_lookup.set(_key3, each_blocks_1[_i] = create_each_block_1(_key3, _child_ctx));
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
        p0.innerHTML = "<a href=\"https://www.npmjs.com/package/svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/npm/v/svelte-fa.svg\" alt=\"npm version\"></a> \n        <a href=\"https://bundlephobia.com/result?p=svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/bundlephobia/minzip/svelte-fa.svg\" alt=\"bundle size\"></a> \n        <a href=\"https://github.com/Cweili/svelte-fa/blob/master/LICENSE\" target=\"_blank\"><img src=\"https://img.shields.io/npm/l/svelte-fa.svg\" alt=\"MIT licence\"></a> \n        <a href=\"https://www.npmjs.com/package/svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/npm/dt/svelte-fa.svg\" alt=\"npm downloads\"></a> \n        <a href=\"https://github.com/Cweili/svelte-fa\" target=\"_blank\"><img src=\"https://img.shields.io/github/issues/Cweili/svelte-fa.svg\" alt=\"github issues\"></a>";
        t6 = space();
        p1 = element("p");
        p1.innerHTML = "\n        Tiny <a class=\"hue svelte-1a2mimh\" href=\"https://fontawesome.com/\" target=\"_blank\">FontAwesome</a> component for <a class=\"hue svelte-1a2mimh\" href=\"https://svelte.dev/\" target=\"_blank\">Svelte</a>.\n      ";
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
        var each_value_2 =
        /*pull*/
        ctx[1];
        each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key, 1, ctx, each_value_2, each0_lookup, div5, destroy_block, create_each_block_2, null, get_each_context_2);
        var each_value_1 =
        /*flip*/
        ctx[2];
        each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_1, 1, ctx, each_value_1, each1_lookup, div8, destroy_block, create_each_block_1, null, get_each_context_1);

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
        run_all(dispose);
      }
    };
  }

  function instance$3($$self, $$props, $$invalidate) {
    var model = {
      size: 5,
      pull: undefined,
      flip: undefined,
      rotate: 0
    };
    var pull = ["None", "Left", "Right"];
    var flip = ["None", "Horizontal", "Vertical", "Both"];
    var icons = [faFlag, faHome, faCog, faSeedling];

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
      if (!document.getElementById("svelte-1a2mimh-style")) add_css$2();
      init(_assertThisInitialized(_this), options, instance$3, create_fragment$c, safe_not_equal, {});
      return _this;
    }

    return Showcase;
  }(SvelteComponent);

  var Showcase$1 = Showcase;

  function create_fragment$b(ctx) {
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

        ctx[4](code_1);
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

        ctx[4](null);
      }
    };
  }

  function instance$2($$self, $$props, $$invalidate) {
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
        $$invalidate(2, el = $$value);
      });
    }

    $$self.$set = function ($$props) {
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

    return [code, lang, el, highlight, code_1_binding];
  }

  var Docs_code = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Docs_code, _SvelteComponent);

    function Docs_code(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$2, create_fragment$b, safe_not_equal, {
        code: 0,
        lang: 1
      });
      return _this;
    }

    return Docs_code;
  }(SvelteComponent);

  var DocsCode = Docs_code;

  function add_css$1() {
    var style = element("style");
    style.id = "svelte-1yrtkpv-style";
    style.textContent = "a.svelte-1yrtkpv,a.svelte-1yrtkpv:visited{color:currentColor}small.svelte-1yrtkpv{visibility:hidden}a:hover+small.svelte-1yrtkpv{visibility:visible}";
    append(document.head, style);
  }

  function create_fragment$a(ctx) {
    var h4;
    var a;
    var t0;
    var a_href_value;
    var t1;
    var small;
    var h4_class_value;
    var current;
    var fa = new Fa__default["default"]({
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

  function instance$1($$self, $$props, $$invalidate) {
    var _$$props$level = $$props.level,
        level = _$$props$level === void 0 ? 2 : _$$props$level;
    var _$$props$title = $$props.title,
        title = _$$props$title === void 0 ? "" : _$$props$title;
    var id;

    $$self.$set = function ($$props) {
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
      if (!document.getElementById("svelte-1yrtkpv-style")) add_css$1();
      init(_assertThisInitialized(_this), options, instance$1, create_fragment$a, safe_not_equal, {
        level: 0,
        title: 1
      });
      return _this;
    }

    return Docs_title;
  }(SvelteComponent);

  var DocsTitle = Docs_title;

  var codes = {
    installation: ["npm install svelte-fa", "npm install @fortawesome/free-solid-svg-icons\nnpm install @fortawesome/free-brands-svg-icons", "npm install svelte-fa -D", "import Fa from 'svelte-fa/src/fa.svelte'\nimport { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons/index.es'", "// app.d.ts\ndeclare module '@fortawesome/pro-solid-svg-icons/index.es' {\n  export * from '@fortawesome/pro-solid-svg-icons';\n}"],
    basicUse: ["<script>\n  import Fa from 'svelte-fa'\n  import { faFlag } from '@fortawesome/free-solid-svg-icons'\n</script>\n\n<Fa icon={faFlag} /> Flag", "<div style=\"font-size: 3em; color: tomato\">\n  <Fa icon={faFlag} />\n</div>"],
    additionalStyling: ["<Fa icon={faFlag} size=\"xs\" />\n<Fa icon={faFlag} size=\"sm\" />\n<Fa icon={faFlag} size=\"lg\" />\n<Fa icon={faFlag} size=\"2x\" />\n<Fa icon={faFlag} size=\"2.5x\" />\n<Fa icon={faFlag} size=\"5x\" />\n<Fa icon={faFlag} size=\"7x\" />\n<Fa icon={faFlag} size=\"10x\" />", "<div>\n  <Fa icon={faHome} fw style=\"background: mistyrose\" /> Home\n</div>\n<div>\n  <Fa icon={faInfo} fw style=\"background: mistyrose\" /> Info\n</div>\n<div>\n  <Fa icon={faBook} fw style=\"background: mistyrose\" /> Library\n</div>\n<div>\n  <Fa icon={faPencilAlt} fw style=\"background: mistyrose\" /> Applications\n</div>\n<div>\n  <Fa icon={faCog} fw style=\"background: mistyrose\" /> Settings\n</div>", "<Fa icon={faQuoteLeft} pull=\"left\" size=\"2x\" />\n<Fa icon={faQuoteRight} pull=\"right\" size=\"2x\" />\nGatsby believed in the green light, the orgastic future that year by year recedes before us. It eluded us then, but that\u2019s no matter \u2014 tomorrow we will run faster, stretch our arms further... And one fine morning \u2014 So we beat on, boats against the current, borne back ceaselessly into the past."],
    animatingIcons: ["<Fa icon={faSpinner} size=\"3x\" spin />\n<Fa icon={faCircleNotch} size=\"3x\" spin />\n<Fa icon={faSync} size=\"3x\" spin />\n<Fa icon={faCog} size=\"3x\" spin />\n<Fa icon={faSpinner} size=\"3x\" pulse />\n<Fa icon={faStroopwafel} size=\"3x\" spin />"],
    powerTransforms: ["<Fa icon={faSeedling} size=\"4x\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} scale={0.5} size=\"4x\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} scale={1.2} size=\"4x\" style=\"background: mistyrose\" />", "<Fa icon={faSeedling} scale={0.5} size=\"4x\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} scale={0.5} translateX={0.2} size=\"4x\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} scale={0.5} translateX={-0.2} size=\"4x\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} scale={0.5} translateY={0.2} size=\"4x\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} scale={0.5} translateY={-0.2} size=\"4x\" style=\"background: mistyrose\" />", "<Fa icon={faSeedling} size=\"4x\" rotate={90} style=\"background: mistyrose\" />\n<Fa icon={faSeedling} size=\"4x\" rotate={180} style=\"background: mistyrose\" />\n<Fa icon={faSeedling} size=\"4x\" rotate=\"270\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} size=\"4x\" rotate=\"30\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} size=\"4x\" rotate=\"-30\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} size=\"4x\" flip=\"vertical\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} size=\"4x\" flip=\"horizontal\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} size=\"4x\" flip=\"both\" style=\"background: mistyrose\" />\n<Fa icon={faSeedling} size=\"4x\" flip=\"both\" style=\"background: mistyrose\" />"],
    layering: ["import Fa, {\n  FaLayers,\n  FaLayersText,\n} from 'svelte-fa';", "<FaLayers size=\"4x\" style=\"background: mistyrose\">\n  <Fa icon={faCircle} color=\"tomato\" />\n  <Fa icon={faTimes} scale={0.5} color=\"white\" />\n</FaLayers>\n<FaLayers size=\"4x\" style=\"background: mistyrose\">\n  <Fa icon={faBookmark} />\n  <Fa icon={faHeart} scale={0.4} translateY={-0.1} color=\"tomato\" />\n</FaLayers>\n<FaLayers size=\"4x\" style=\"background: mistyrose\">\n  <Fa icon={faPlay} scale={1.2} rotate={-90} />\n  <Fa icon={faSun} scale={0.35} translateY={-0.2} color=\"white\" />\n  <Fa icon={faMoon} scale={0.3} translateX={-0.25} translateY={0.25} color=\"white\" />\n  <Fa icon={faStar} scale={0.3} translateX={0.25} translateY={0.25} color=\"white\" />\n</FaLayers>\n<FaLayers size=\"4x\" style=\"background: mistyrose\">\n  <Fa icon={faCalendar} />\n  <FaLayersText scale={0.45} translateY={0.06} color=\"white\" style=\"font-weight: 900\">\n    27\n  </FaLayersText>\n</FaLayers>\n<FaLayers size=\"4x\" style=\"background: mistyrose\">\n  <Fa icon={faCertificate} />\n  <FaLayersText scale={0.25} rotate={-30} color=\"white\" style=\"font-weight: 900\">\n    NEW\n  </FaLayersText>\n</FaLayers>\n<FaLayers size=\"4x\" style=\"background: mistyrose\">\n  <Fa icon={faEnvelope} />\n  <FaLayersText scale={0.2} translateX={0.4} translateY={-0.4} color=\"white\" style=\"padding: 0 .2em; background: tomato; border-radius: 1em\">\n    1,419\n  </FaLayersText>\n</FaLayers>"],
    duotoneIcons: ["import {\n  faCamera,\n  faFireAlt,\n  faBusAlt,\n  faFillDrip,\n} from '@fortawesome/pro-duotone-svg-icons'", "<Fa icon={faCamera} size=\"3x\" />\n<Fa icon={faFireAlt} size=\"3x\" />\n<Fa icon={faBusAlt} size=\"3x\" />\n<Fa icon={faFillDrip} size=\"3x\" />", "<Fa icon={faCamera} size=\"3x\" />\n<Fa icon={faCamera} size=\"3x\" swapOpacity />\n<Fa icon={faFireAlt} size=\"3x\" />\n<Fa icon={faFireAlt} size=\"3x\" swapOpacity />\n<Fa icon={faBusAlt} size=\"3x\" />\n<Fa icon={faBusAlt} size=\"3x\" swapOpacity />\n<Fa icon={faFillDrip} size=\"3x\" />\n<Fa icon={faFillDrip} size=\"3x\" swapOpacity />", "<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.2} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.4} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.6} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={.8} />\n<Fa icon={faBusAlt} size=\"3x\" secondaryOpacity={1} />", "<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.2} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.4} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.6} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={.8} />\n<Fa icon={faBusAlt} size=\"3x\" primaryOpacity={1} />", "<Fa icon={faBusAlt} size=\"3x\" primaryColor=\"gold\" />\n<Fa icon={faBusAlt} size=\"3x\" primaryColor=\"orangered\" />\n<Fa icon={faFillDrip} size=\"3x\" secondaryColor=\"limegreen\" />\n<Fa icon={faFillDrip} size=\"3x\" secondaryColor=\"rebeccapurple\" />\n<Fa icon={faBatteryFull} size=\"3x\" primaryColor=\"limegreen\" secondaryColor=\"dimgray\" />\n<Fa icon={faBatteryQuarter} size=\"3x\" primaryColor=\"orange\" secondaryColor=\"dimgray\" />", "<Fa icon={faBook} size=\"3x\" secondaryOpacity={1} primaryColor=\"lightseagreen\" secondaryColor=\"linen\" />\n<Fa icon={faBookSpells} size=\"3x\" secondaryOpacity={1} primaryColor=\"mediumpurple\" secondaryColor=\"linen\" />\n<Fa icon={faBookMedical} size=\"3x\" secondaryOpacity={1} primaryColor=\"crimson\" secondaryColor=\"linen\" />\n<Fa icon={faBookUser} size=\"3x\" secondaryOpacity={1} primaryColor=\"peru\" secondaryColor=\"linen\" />\n<Fa icon={faToggleOff} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"gray\" />\n<Fa icon={faToggleOn} size=\"3x\" secondaryOpacity={1} primaryColor=\"dodgerblue\" secondaryColor=\"white\" />\n<Fa icon={faFilePlus} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"limegreen\" />\n<Fa icon={faFileExclamation} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"gold\" />\n<Fa icon={faFileTimes} size=\"3x\" secondaryOpacity={1} primaryColor=\"white\" secondaryColor=\"tomato\" />", "<Fa icon={faCrow} size=\"3x\" secondaryOpacity={1} primaryColor=\"dodgerblue\" secondaryColor=\"gold\" />\n<Fa icon={faCampfire} size=\"3x\" secondaryOpacity={1} primaryColor=\"sienna\" secondaryColor=\"red\" />\n<Fa icon={faBirthdayCake} size=\"3x\" secondaryOpacity={1} primaryColor=\"pink\" secondaryColor=\"palevioletred\" />\n<Fa icon={faEar} size=\"3x\" secondaryOpacity={1} primaryColor=\"sandybrown\" secondaryColor=\"bisque\" />\n<Fa icon={faCorn} size=\"3x\" secondaryOpacity={1} primaryColor=\"mediumseagreen\" secondaryColor=\"gold\" />\n<Fa icon={faCookieBite} size=\"3x\" secondaryOpacity={1} primaryColor=\"saddlebrown\" secondaryColor=\"burlywood\" />", "const themeRavenclaw = {\n  secondaryOpacity: 1,\n  primaryColor: '#0438a1',\n  secondaryColor: '#6c6c6c',\n}", "<Fa icon={faHatWizard} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faFlaskPotion} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faWandMagic} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faScarf} size=\"3x\" {...themeRavenclaw} />\n<Fa icon={faBookSpells} size=\"3x\" {...themeRavenclaw} />"]
  };
  var codes$1 = codes;

  function create_fragment$9(ctx) {
    var t0;
    var t1;
    var div0;
    var t2;
    var t3;
    var t4;
    var t5;
    var t6;
    var t7;
    var t8;
    var t9;
    var t10;
    var t11;
    var div6;
    var div1;
    var t12;
    var t13;
    var div2;
    var t14;
    var t15;
    var div3;
    var t16;
    var t17;
    var div4;
    var t18;
    var t19;
    var div5;
    var t20;
    var t21;
    var t22;
    var t23;
    var div7;
    var t24;
    var t25;
    var t26;
    var current;
    var docstitle0 = new DocsTitle({
      props: {
        title: "Additional Styling"
      }
    });
    var docstitle1 = new DocsTitle({
      props: {
        title: "Icon Sizes",
        level: 3
      }
    });
    var fa0 = new Fa__default["default"]({
      props: {
        icon: faFlag,
        size: "xs"
      }
    });
    var fa1 = new Fa__default["default"]({
      props: {
        icon: faFlag,
        size: "sm"
      }
    });
    var fa2 = new Fa__default["default"]({
      props: {
        icon: faFlag,
        size: "lg"
      }
    });
    var fa3 = new Fa__default["default"]({
      props: {
        icon: faFlag,
        size: "2x"
      }
    });
    var fa4 = new Fa__default["default"]({
      props: {
        icon: faFlag,
        size: "2.5x"
      }
    });
    var fa5 = new Fa__default["default"]({
      props: {
        icon: faFlag,
        size: "5x"
      }
    });
    var fa6 = new Fa__default["default"]({
      props: {
        icon: faFlag,
        size: "7x"
      }
    });
    var fa7 = new Fa__default["default"]({
      props: {
        icon: faFlag,
        size: "10x"
      }
    });
    var docscode0 = new DocsCode({
      props: {
        code: codes$1.additionalStyling[0]
      }
    });
    var docstitle2 = new DocsTitle({
      props: {
        title: "Fixed Width Icons",
        level: 3
      }
    });
    var fa8 = new Fa__default["default"]({
      props: {
        icon: faHome,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var fa9 = new Fa__default["default"]({
      props: {
        icon: faInfo,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var fa10 = new Fa__default["default"]({
      props: {
        icon: faBook,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var fa11 = new Fa__default["default"]({
      props: {
        icon: faPencilAlt,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var fa12 = new Fa__default["default"]({
      props: {
        icon: faCog,
        fw: true,
        style: "background: mistyrose"
      }
    });
    var docscode1 = new DocsCode({
      props: {
        code: codes$1.additionalStyling[1]
      }
    });
    var docstitle3 = new DocsTitle({
      props: {
        title: "Pulled Icons",
        level: 3
      }
    });
    var fa13 = new Fa__default["default"]({
      props: {
        icon: faQuoteLeft,
        pull: "left",
        size: "2x"
      }
    });
    var fa14 = new Fa__default["default"]({
      props: {
        icon: faQuoteRight,
        pull: "right",
        size: "2x"
      }
    });
    var docscode2 = new DocsCode({
      props: {
        code: codes$1.additionalStyling[2]
      }
    });
    return {
      c: function c() {
        create_component(docstitle0.$$.fragment);
        t0 = space();
        create_component(docstitle1.$$.fragment);
        t1 = space();
        div0 = element("div");
        create_component(fa0.$$.fragment);
        t2 = space();
        create_component(fa1.$$.fragment);
        t3 = space();
        create_component(fa2.$$.fragment);
        t4 = space();
        create_component(fa3.$$.fragment);
        t5 = space();
        create_component(fa4.$$.fragment);
        t6 = space();
        create_component(fa5.$$.fragment);
        t7 = space();
        create_component(fa6.$$.fragment);
        t8 = space();
        create_component(fa7.$$.fragment);
        t9 = space();
        create_component(docscode0.$$.fragment);
        t10 = space();
        create_component(docstitle2.$$.fragment);
        t11 = space();
        div6 = element("div");
        div1 = element("div");
        create_component(fa8.$$.fragment);
        t12 = text(" Home");
        t13 = space();
        div2 = element("div");
        create_component(fa9.$$.fragment);
        t14 = text(" Info");
        t15 = space();
        div3 = element("div");
        create_component(fa10.$$.fragment);
        t16 = text(" Library");
        t17 = space();
        div4 = element("div");
        create_component(fa11.$$.fragment);
        t18 = text(" Applications");
        t19 = space();
        div5 = element("div");
        create_component(fa12.$$.fragment);
        t20 = text(" Settings");
        t21 = space();
        create_component(docscode1.$$.fragment);
        t22 = space();
        create_component(docstitle3.$$.fragment);
        t23 = space();
        div7 = element("div");
        create_component(fa13.$$.fragment);
        t24 = space();
        create_component(fa14.$$.fragment);
        t25 = text("\n  Gatsby believed in the green light, the orgastic future that year by year recedes\n  before us. It eluded us then, but that’s no matter — tomorrow we will run faster,\n  stretch our arms further... And one fine morning — So we beat on, boats against\n  the current, borne back ceaselessly into the past.");
        t26 = space();
        create_component(docscode2.$$.fragment);
        attr(div0, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div6, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div7, "class", "shadow-sm p-3 mb-3 rounded clearfix");
      },
      m: function m(target, anchor) {
        mount_component(docstitle0, target, anchor);
        insert(target, t0, anchor);
        mount_component(docstitle1, target, anchor);
        insert(target, t1, anchor);
        insert(target, div0, anchor);
        mount_component(fa0, div0, null);
        append(div0, t2);
        mount_component(fa1, div0, null);
        append(div0, t3);
        mount_component(fa2, div0, null);
        append(div0, t4);
        mount_component(fa3, div0, null);
        append(div0, t5);
        mount_component(fa4, div0, null);
        append(div0, t6);
        mount_component(fa5, div0, null);
        append(div0, t7);
        mount_component(fa6, div0, null);
        append(div0, t8);
        mount_component(fa7, div0, null);
        insert(target, t9, anchor);
        mount_component(docscode0, target, anchor);
        insert(target, t10, anchor);
        mount_component(docstitle2, target, anchor);
        insert(target, t11, anchor);
        insert(target, div6, anchor);
        append(div6, div1);
        mount_component(fa8, div1, null);
        append(div1, t12);
        append(div6, t13);
        append(div6, div2);
        mount_component(fa9, div2, null);
        append(div2, t14);
        append(div6, t15);
        append(div6, div3);
        mount_component(fa10, div3, null);
        append(div3, t16);
        append(div6, t17);
        append(div6, div4);
        mount_component(fa11, div4, null);
        append(div4, t18);
        append(div6, t19);
        append(div6, div5);
        mount_component(fa12, div5, null);
        append(div5, t20);
        insert(target, t21, anchor);
        mount_component(docscode1, target, anchor);
        insert(target, t22, anchor);
        mount_component(docstitle3, target, anchor);
        insert(target, t23, anchor);
        insert(target, div7, anchor);
        mount_component(fa13, div7, null);
        append(div7, t24);
        mount_component(fa14, div7, null);
        append(div7, t25);
        insert(target, t26, anchor);
        mount_component(docscode2, target, anchor);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(docstitle0.$$.fragment, local);
        transition_in(docstitle1.$$.fragment, local);
        transition_in(fa0.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        transition_in(fa2.$$.fragment, local);
        transition_in(fa3.$$.fragment, local);
        transition_in(fa4.$$.fragment, local);
        transition_in(fa5.$$.fragment, local);
        transition_in(fa6.$$.fragment, local);
        transition_in(fa7.$$.fragment, local);
        transition_in(docscode0.$$.fragment, local);
        transition_in(docstitle2.$$.fragment, local);
        transition_in(fa8.$$.fragment, local);
        transition_in(fa9.$$.fragment, local);
        transition_in(fa10.$$.fragment, local);
        transition_in(fa11.$$.fragment, local);
        transition_in(fa12.$$.fragment, local);
        transition_in(docscode1.$$.fragment, local);
        transition_in(docstitle3.$$.fragment, local);
        transition_in(fa13.$$.fragment, local);
        transition_in(fa14.$$.fragment, local);
        transition_in(docscode2.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docstitle0.$$.fragment, local);
        transition_out(docstitle1.$$.fragment, local);
        transition_out(fa0.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        transition_out(fa2.$$.fragment, local);
        transition_out(fa3.$$.fragment, local);
        transition_out(fa4.$$.fragment, local);
        transition_out(fa5.$$.fragment, local);
        transition_out(fa6.$$.fragment, local);
        transition_out(fa7.$$.fragment, local);
        transition_out(docscode0.$$.fragment, local);
        transition_out(docstitle2.$$.fragment, local);
        transition_out(fa8.$$.fragment, local);
        transition_out(fa9.$$.fragment, local);
        transition_out(fa10.$$.fragment, local);
        transition_out(fa11.$$.fragment, local);
        transition_out(fa12.$$.fragment, local);
        transition_out(docscode1.$$.fragment, local);
        transition_out(docstitle3.$$.fragment, local);
        transition_out(fa13.$$.fragment, local);
        transition_out(fa14.$$.fragment, local);
        transition_out(docscode2.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(docstitle0, detaching);
        if (detaching) detach(t0);
        destroy_component(docstitle1, detaching);
        if (detaching) detach(t1);
        if (detaching) detach(div0);
        destroy_component(fa0);
        destroy_component(fa1);
        destroy_component(fa2);
        destroy_component(fa3);
        destroy_component(fa4);
        destroy_component(fa5);
        destroy_component(fa6);
        destroy_component(fa7);
        if (detaching) detach(t9);
        destroy_component(docscode0, detaching);
        if (detaching) detach(t10);
        destroy_component(docstitle2, detaching);
        if (detaching) detach(t11);
        if (detaching) detach(div6);
        destroy_component(fa8);
        destroy_component(fa9);
        destroy_component(fa10);
        destroy_component(fa11);
        destroy_component(fa12);
        if (detaching) detach(t21);
        destroy_component(docscode1, detaching);
        if (detaching) detach(t22);
        destroy_component(docstitle3, detaching);
        if (detaching) detach(t23);
        if (detaching) detach(div7);
        destroy_component(fa13);
        destroy_component(fa14);
        if (detaching) detach(t26);
        destroy_component(docscode2, detaching);
      }
    };
  }

  var Additional_styling = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Additional_styling, _SvelteComponent);

    function Additional_styling(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$9, safe_not_equal, {});
      return _this;
    }

    return Additional_styling;
  }(SvelteComponent);

  var AdditionalStyling = Additional_styling;

  function create_fragment$8(ctx) {
    var t0;
    var div;
    var t1;
    var t2;
    var t3;
    var t4;
    var t5;
    var t6;
    var current;
    var docstitle = new DocsTitle({
      props: {
        title: "Animating Icons"
      }
    });
    var fa0 = new Fa__default["default"]({
      props: {
        icon: faSpinner,
        size: "3x",
        spin: true
      }
    });
    var fa1 = new Fa__default["default"]({
      props: {
        icon: faCircleNotch,
        size: "3x",
        spin: true
      }
    });
    var fa2 = new Fa__default["default"]({
      props: {
        icon: faSync,
        size: "3x",
        spin: true
      }
    });
    var fa3 = new Fa__default["default"]({
      props: {
        icon: faCog,
        size: "3x",
        spin: true
      }
    });
    var fa4 = new Fa__default["default"]({
      props: {
        icon: faSpinner,
        size: "3x",
        pulse: true
      }
    });
    var fa5 = new Fa__default["default"]({
      props: {
        icon: faStroopwafel,
        size: "3x",
        spin: true
      }
    });
    var docscode = new DocsCode({
      props: {
        code: codes$1.animatingIcons[0]
      }
    });
    return {
      c: function c() {
        create_component(docstitle.$$.fragment);
        t0 = space();
        div = element("div");
        create_component(fa0.$$.fragment);
        t1 = space();
        create_component(fa1.$$.fragment);
        t2 = space();
        create_component(fa2.$$.fragment);
        t3 = space();
        create_component(fa3.$$.fragment);
        t4 = space();
        create_component(fa4.$$.fragment);
        t5 = space();
        create_component(fa5.$$.fragment);
        t6 = space();
        create_component(docscode.$$.fragment);
        attr(div, "class", "shadow-sm p-3 mb-3 rounded");
      },
      m: function m(target, anchor) {
        mount_component(docstitle, target, anchor);
        insert(target, t0, anchor);
        insert(target, div, anchor);
        mount_component(fa0, div, null);
        append(div, t1);
        mount_component(fa1, div, null);
        append(div, t2);
        mount_component(fa2, div, null);
        append(div, t3);
        mount_component(fa3, div, null);
        append(div, t4);
        mount_component(fa4, div, null);
        append(div, t5);
        mount_component(fa5, div, null);
        insert(target, t6, anchor);
        mount_component(docscode, target, anchor);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(docstitle.$$.fragment, local);
        transition_in(fa0.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        transition_in(fa2.$$.fragment, local);
        transition_in(fa3.$$.fragment, local);
        transition_in(fa4.$$.fragment, local);
        transition_in(fa5.$$.fragment, local);
        transition_in(docscode.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docstitle.$$.fragment, local);
        transition_out(fa0.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        transition_out(fa2.$$.fragment, local);
        transition_out(fa3.$$.fragment, local);
        transition_out(fa4.$$.fragment, local);
        transition_out(fa5.$$.fragment, local);
        transition_out(docscode.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(docstitle, detaching);
        if (detaching) detach(t0);
        if (detaching) detach(div);
        destroy_component(fa0);
        destroy_component(fa1);
        destroy_component(fa2);
        destroy_component(fa3);
        destroy_component(fa4);
        destroy_component(fa5);
        if (detaching) detach(t6);
        destroy_component(docscode, detaching);
      }
    };
  }

  var Animating_icons = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Animating_icons, _SvelteComponent);

    function Animating_icons(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$8, safe_not_equal, {});
      return _this;
    }

    return Animating_icons;
  }(SvelteComponent);

  var AnimatingIcons = Animating_icons;

  function create_fragment$7(ctx) {
    var t0;
    var div0;
    var t1;
    var t2;
    var t3;
    var div1;
    var t9;
    var div3;
    var div2;
    var t10;
    var current;
    var docstitle = new DocsTitle({
      props: {
        title: "Basic Use"
      }
    });
    var fa0 = new Fa__default["default"]({
      props: {
        icon: faFlag
      }
    });
    var docscode0 = new DocsCode({
      props: {
        code: codes$1.basicUse[0]
      }
    });
    var fa1 = new Fa__default["default"]({
      props: {
        icon: faFlag
      }
    });
    var docscode1 = new DocsCode({
      props: {
        code: codes$1.basicUse[1]
      }
    });
    return {
      c: function c() {
        create_component(docstitle.$$.fragment);
        t0 = space();
        div0 = element("div");
        create_component(fa0.$$.fragment);
        t1 = text(" Flag");
        t2 = space();
        create_component(docscode0.$$.fragment);
        t3 = space();
        div1 = element("div");
        div1.innerHTML = "\n  Icons import from <a href=\"https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons\" target=\"_blank\">FontAwesome packages</a>, for example: @fortawesome/free-solid-svg-icons.\n  <br>\n  Icons gallery:\n  <a href=\"https://fontawesome.com/icons\" target=\"_blank\">FontAwesome icons</a>";
        t9 = space();
        div3 = element("div");
        div2 = element("div");
        create_component(fa1.$$.fragment);
        t10 = space();
        create_component(docscode1.$$.fragment);
        attr(div0, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div1, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        set_style(div2, "font-size", "3em");
        set_style(div2, "color", "tomato");
        attr(div3, "class", "shadow-sm p-3 mb-3 rounded");
      },
      m: function m(target, anchor) {
        mount_component(docstitle, target, anchor);
        insert(target, t0, anchor);
        insert(target, div0, anchor);
        mount_component(fa0, div0, null);
        append(div0, t1);
        insert(target, t2, anchor);
        mount_component(docscode0, target, anchor);
        insert(target, t3, anchor);
        insert(target, div1, anchor);
        insert(target, t9, anchor);
        insert(target, div3, anchor);
        append(div3, div2);
        mount_component(fa1, div2, null);
        insert(target, t10, anchor);
        mount_component(docscode1, target, anchor);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(docstitle.$$.fragment, local);
        transition_in(fa0.$$.fragment, local);
        transition_in(docscode0.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        transition_in(docscode1.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docstitle.$$.fragment, local);
        transition_out(fa0.$$.fragment, local);
        transition_out(docscode0.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        transition_out(docscode1.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(docstitle, detaching);
        if (detaching) detach(t0);
        if (detaching) detach(div0);
        destroy_component(fa0);
        if (detaching) detach(t2);
        destroy_component(docscode0, detaching);
        if (detaching) detach(t3);
        if (detaching) detach(div1);
        if (detaching) detach(t9);
        if (detaching) detach(div3);
        destroy_component(fa1);
        if (detaching) detach(t10);
        destroy_component(docscode1, detaching);
      }
    };
  }

  var Basic_use = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Basic_use, _SvelteComponent);

    function Basic_use(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$7, safe_not_equal, {});
      return _this;
    }

    return Basic_use;
  }(SvelteComponent);

  var BasicUse = Basic_use;

  function add_css() {
    var style = element("style");
    style.id = "svelte-tdv3q3-style";
    style.textContent = "img.svelte-tdv3q3{max-width:100%;max-height:48px}small.svelte-tdv3q3{position:absolute;right:1rem;bottom:.1rem;color:#ddd;z-index:-1}";
    append(document.head, style);
  }

  function create_fragment$6(ctx) {
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
        set_attributes(img, get_spread_update(img_levels, [dirty &
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

  function instance($$self, $$props, $$invalidate) {
    $$self.$set = function ($$new_props) {
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
      if (!document.getElementById("svelte-tdv3q3-style")) add_css();
      init(_assertThisInitialized(_this), options, instance, create_fragment$6, safe_not_equal, {});
      return _this;
    }

    return Docs_img;
  }(SvelteComponent);

  var DocsImg = Docs_img;

  function create_fragment$5(ctx) {
    var t0;
    var t1;
    var t2;
    var t3;
    var t4;
    var t5;
    var t6;
    var t7;
    var t8;
    var t9;
    var t10;
    var t11;
    var t12;
    var t13;
    var t14;
    var t15;
    var t16;
    var t17;
    var t18;
    var t19;
    var t20;
    var t21;
    var t22;
    var current;
    var docstitle0 = new DocsTitle({
      props: {
        title: "Duotone Icons"
      }
    });
    var docstitle1 = new DocsTitle({
      props: {
        title: "Basic Use",
        level: 3
      }
    });
    var docsimg0 = new DocsImg({
      props: {
        src: "assets/duotone-0.png",
        alt: "duotone icons basic use"
      }
    });
    var docscode0 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[0],
        lang: "js"
      }
    });
    var docscode1 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[1]
      }
    });
    var docstitle2 = new DocsTitle({
      props: {
        title: "Swapping Layer Opacity",
        level: 3
      }
    });
    var docsimg1 = new DocsImg({
      props: {
        src: "assets/duotone-1.png",
        alt: "swapping duotone icons layer opacity"
      }
    });
    var docscode2 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[2]
      }
    });
    var docstitle3 = new DocsTitle({
      props: {
        title: "Changing Opacity",
        level: 3
      }
    });
    var docsimg2 = new DocsImg({
      props: {
        src: "assets/duotone-2.png",
        alt: "changing duotone icons opacity"
      }
    });
    var docscode3 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[3]
      }
    });
    var docsimg3 = new DocsImg({
      props: {
        src: "assets/duotone-3.png",
        alt: "changing duotone icons opacity"
      }
    });
    var docscode4 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[4]
      }
    });
    var docstitle4 = new DocsTitle({
      props: {
        title: "Coloring Duotone Icons",
        level: 3
      }
    });
    var docsimg4 = new DocsImg({
      props: {
        src: "assets/duotone-4.png",
        alt: "coloring duotone icons"
      }
    });
    var docscode5 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[5]
      }
    });
    var docstitle5 = new DocsTitle({
      props: {
        title: "Advanced Use",
        level: 3
      }
    });
    var docsimg5 = new DocsImg({
      props: {
        src: "assets/duotone-5.png",
        alt: "duotone icons advanced use"
      }
    });
    var docscode6 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[6]
      }
    });
    var docsimg6 = new DocsImg({
      props: {
        src: "assets/duotone-6.png",
        alt: "duotone icons advanced use"
      }
    });
    var docscode7 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[7]
      }
    });
    var docsimg7 = new DocsImg({
      props: {
        src: "assets/duotone-7.png",
        alt: "duotone icons advanced use"
      }
    });
    var docscode8 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[8],
        lang: "js"
      }
    });
    var docscode9 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[9]
      }
    });
    return {
      c: function c() {
        create_component(docstitle0.$$.fragment);
        t0 = space();
        create_component(docstitle1.$$.fragment);
        t1 = space();
        create_component(docsimg0.$$.fragment);
        t2 = space();
        create_component(docscode0.$$.fragment);
        t3 = space();
        create_component(docscode1.$$.fragment);
        t4 = space();
        create_component(docstitle2.$$.fragment);
        t5 = space();
        create_component(docsimg1.$$.fragment);
        t6 = space();
        create_component(docscode2.$$.fragment);
        t7 = space();
        create_component(docstitle3.$$.fragment);
        t8 = space();
        create_component(docsimg2.$$.fragment);
        t9 = space();
        create_component(docscode3.$$.fragment);
        t10 = space();
        create_component(docsimg3.$$.fragment);
        t11 = space();
        create_component(docscode4.$$.fragment);
        t12 = space();
        create_component(docstitle4.$$.fragment);
        t13 = space();
        create_component(docsimg4.$$.fragment);
        t14 = space();
        create_component(docscode5.$$.fragment);
        t15 = space();
        create_component(docstitle5.$$.fragment);
        t16 = space();
        create_component(docsimg5.$$.fragment);
        t17 = space();
        create_component(docscode6.$$.fragment);
        t18 = space();
        create_component(docsimg6.$$.fragment);
        t19 = space();
        create_component(docscode7.$$.fragment);
        t20 = space();
        create_component(docsimg7.$$.fragment);
        t21 = space();
        create_component(docscode8.$$.fragment);
        t22 = space();
        create_component(docscode9.$$.fragment);
      },
      m: function m(target, anchor) {
        mount_component(docstitle0, target, anchor);
        insert(target, t0, anchor);
        mount_component(docstitle1, target, anchor);
        insert(target, t1, anchor);
        mount_component(docsimg0, target, anchor);
        insert(target, t2, anchor);
        mount_component(docscode0, target, anchor);
        insert(target, t3, anchor);
        mount_component(docscode1, target, anchor);
        insert(target, t4, anchor);
        mount_component(docstitle2, target, anchor);
        insert(target, t5, anchor);
        mount_component(docsimg1, target, anchor);
        insert(target, t6, anchor);
        mount_component(docscode2, target, anchor);
        insert(target, t7, anchor);
        mount_component(docstitle3, target, anchor);
        insert(target, t8, anchor);
        mount_component(docsimg2, target, anchor);
        insert(target, t9, anchor);
        mount_component(docscode3, target, anchor);
        insert(target, t10, anchor);
        mount_component(docsimg3, target, anchor);
        insert(target, t11, anchor);
        mount_component(docscode4, target, anchor);
        insert(target, t12, anchor);
        mount_component(docstitle4, target, anchor);
        insert(target, t13, anchor);
        mount_component(docsimg4, target, anchor);
        insert(target, t14, anchor);
        mount_component(docscode5, target, anchor);
        insert(target, t15, anchor);
        mount_component(docstitle5, target, anchor);
        insert(target, t16, anchor);
        mount_component(docsimg5, target, anchor);
        insert(target, t17, anchor);
        mount_component(docscode6, target, anchor);
        insert(target, t18, anchor);
        mount_component(docsimg6, target, anchor);
        insert(target, t19, anchor);
        mount_component(docscode7, target, anchor);
        insert(target, t20, anchor);
        mount_component(docsimg7, target, anchor);
        insert(target, t21, anchor);
        mount_component(docscode8, target, anchor);
        insert(target, t22, anchor);
        mount_component(docscode9, target, anchor);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(docstitle0.$$.fragment, local);
        transition_in(docstitle1.$$.fragment, local);
        transition_in(docsimg0.$$.fragment, local);
        transition_in(docscode0.$$.fragment, local);
        transition_in(docscode1.$$.fragment, local);
        transition_in(docstitle2.$$.fragment, local);
        transition_in(docsimg1.$$.fragment, local);
        transition_in(docscode2.$$.fragment, local);
        transition_in(docstitle3.$$.fragment, local);
        transition_in(docsimg2.$$.fragment, local);
        transition_in(docscode3.$$.fragment, local);
        transition_in(docsimg3.$$.fragment, local);
        transition_in(docscode4.$$.fragment, local);
        transition_in(docstitle4.$$.fragment, local);
        transition_in(docsimg4.$$.fragment, local);
        transition_in(docscode5.$$.fragment, local);
        transition_in(docstitle5.$$.fragment, local);
        transition_in(docsimg5.$$.fragment, local);
        transition_in(docscode6.$$.fragment, local);
        transition_in(docsimg6.$$.fragment, local);
        transition_in(docscode7.$$.fragment, local);
        transition_in(docsimg7.$$.fragment, local);
        transition_in(docscode8.$$.fragment, local);
        transition_in(docscode9.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docstitle0.$$.fragment, local);
        transition_out(docstitle1.$$.fragment, local);
        transition_out(docsimg0.$$.fragment, local);
        transition_out(docscode0.$$.fragment, local);
        transition_out(docscode1.$$.fragment, local);
        transition_out(docstitle2.$$.fragment, local);
        transition_out(docsimg1.$$.fragment, local);
        transition_out(docscode2.$$.fragment, local);
        transition_out(docstitle3.$$.fragment, local);
        transition_out(docsimg2.$$.fragment, local);
        transition_out(docscode3.$$.fragment, local);
        transition_out(docsimg3.$$.fragment, local);
        transition_out(docscode4.$$.fragment, local);
        transition_out(docstitle4.$$.fragment, local);
        transition_out(docsimg4.$$.fragment, local);
        transition_out(docscode5.$$.fragment, local);
        transition_out(docstitle5.$$.fragment, local);
        transition_out(docsimg5.$$.fragment, local);
        transition_out(docscode6.$$.fragment, local);
        transition_out(docsimg6.$$.fragment, local);
        transition_out(docscode7.$$.fragment, local);
        transition_out(docsimg7.$$.fragment, local);
        transition_out(docscode8.$$.fragment, local);
        transition_out(docscode9.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(docstitle0, detaching);
        if (detaching) detach(t0);
        destroy_component(docstitle1, detaching);
        if (detaching) detach(t1);
        destroy_component(docsimg0, detaching);
        if (detaching) detach(t2);
        destroy_component(docscode0, detaching);
        if (detaching) detach(t3);
        destroy_component(docscode1, detaching);
        if (detaching) detach(t4);
        destroy_component(docstitle2, detaching);
        if (detaching) detach(t5);
        destroy_component(docsimg1, detaching);
        if (detaching) detach(t6);
        destroy_component(docscode2, detaching);
        if (detaching) detach(t7);
        destroy_component(docstitle3, detaching);
        if (detaching) detach(t8);
        destroy_component(docsimg2, detaching);
        if (detaching) detach(t9);
        destroy_component(docscode3, detaching);
        if (detaching) detach(t10);
        destroy_component(docsimg3, detaching);
        if (detaching) detach(t11);
        destroy_component(docscode4, detaching);
        if (detaching) detach(t12);
        destroy_component(docstitle4, detaching);
        if (detaching) detach(t13);
        destroy_component(docsimg4, detaching);
        if (detaching) detach(t14);
        destroy_component(docscode5, detaching);
        if (detaching) detach(t15);
        destroy_component(docstitle5, detaching);
        if (detaching) detach(t16);
        destroy_component(docsimg5, detaching);
        if (detaching) detach(t17);
        destroy_component(docscode6, detaching);
        if (detaching) detach(t18);
        destroy_component(docsimg6, detaching);
        if (detaching) detach(t19);
        destroy_component(docscode7, detaching);
        if (detaching) detach(t20);
        destroy_component(docsimg7, detaching);
        if (detaching) detach(t21);
        destroy_component(docscode8, detaching);
        if (detaching) detach(t22);
        destroy_component(docscode9, detaching);
      }
    };
  }

  var Duotone_icons = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Duotone_icons, _SvelteComponent);

    function Duotone_icons(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$5, safe_not_equal, {});
      return _this;
    }

    return Duotone_icons;
  }(SvelteComponent);

  var DuotoneIcons = Duotone_icons;

  function create_fragment$4(ctx) {
    var t0;
    var t1;
    var div0;
    var t5;
    var t6;
    var div1;
    var t11;
    var t12;
    var div2;
    var t19;
    var t20;
    var div3;
    var t22;
    var current;
    var docstitle = new DocsTitle({
      props: {
        title: "Installation"
      }
    });
    var docscode0 = new DocsCode({
      props: {
        code: codes$1.installation[0]
      }
    });
    var docscode1 = new DocsCode({
      props: {
        code: codes$1.installation[1]
      }
    });
    var docscode2 = new DocsCode({
      props: {
        code: codes$1.installation[2]
      }
    });
    var docscode3 = new DocsCode({
      props: {
        code: codes$1.installation[3],
        lang: "js"
      }
    });
    var docscode4 = new DocsCode({
      props: {
        code: codes$1.installation[4],
        lang: "js"
      }
    });
    return {
      c: function c() {
        create_component(docstitle.$$.fragment);
        t0 = space();
        create_component(docscode0.$$.fragment);
        t1 = space();
        div0 = element("div");
        div0.innerHTML = "\n  Install FontAwesome icons via <a href=\"https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons\" target=\"_blank\">official packages</a>, for example:\n";
        t5 = space();
        create_component(docscode1.$$.fragment);
        t6 = space();
        div1 = element("div");
        div1.innerHTML = "<strong>Notice for <a href=\"https://sapper.svelte.dev/\" target=\"_blank\">Sapper</a> user:</strong> You may need to install the component as a devDependency:\n";
        t11 = space();
        create_component(docscode2.$$.fragment);
        t12 = space();
        div2 = element("div");
        div2.innerHTML = "<strong>Notice for <a href=\"https://kit.svelte.dev/\" target=\"_blank\">SvelteKit</a>/<a href=\"https://www.npmjs.com/package/vite\" target=\"_blank\">Vite</a> user:</strong> You may need to import the component explicitly as below:\n";
        t19 = space();
        create_component(docscode3.$$.fragment);
        t20 = space();
        div3 = element("div");
        div3.textContent = "When using typescript with SvelteKit/Vite, you may also needed to add type\n  definitions that redirect to the non-index.es export:";
        t22 = space();
        create_component(docscode4.$$.fragment);
        attr(div0, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        attr(div1, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        attr(div2, "class", "shadow-sm p-3 mb-3 rounded clearfix");
        attr(div3, "class", "shadow-sm p-3 mb-3 rounded clearfix");
      },
      m: function m(target, anchor) {
        mount_component(docstitle, target, anchor);
        insert(target, t0, anchor);
        mount_component(docscode0, target, anchor);
        insert(target, t1, anchor);
        insert(target, div0, anchor);
        insert(target, t5, anchor);
        mount_component(docscode1, target, anchor);
        insert(target, t6, anchor);
        insert(target, div1, anchor);
        insert(target, t11, anchor);
        mount_component(docscode2, target, anchor);
        insert(target, t12, anchor);
        insert(target, div2, anchor);
        insert(target, t19, anchor);
        mount_component(docscode3, target, anchor);
        insert(target, t20, anchor);
        insert(target, div3, anchor);
        insert(target, t22, anchor);
        mount_component(docscode4, target, anchor);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(docstitle.$$.fragment, local);
        transition_in(docscode0.$$.fragment, local);
        transition_in(docscode1.$$.fragment, local);
        transition_in(docscode2.$$.fragment, local);
        transition_in(docscode3.$$.fragment, local);
        transition_in(docscode4.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docstitle.$$.fragment, local);
        transition_out(docscode0.$$.fragment, local);
        transition_out(docscode1.$$.fragment, local);
        transition_out(docscode2.$$.fragment, local);
        transition_out(docscode3.$$.fragment, local);
        transition_out(docscode4.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(docstitle, detaching);
        if (detaching) detach(t0);
        destroy_component(docscode0, detaching);
        if (detaching) detach(t1);
        if (detaching) detach(div0);
        if (detaching) detach(t5);
        destroy_component(docscode1, detaching);
        if (detaching) detach(t6);
        if (detaching) detach(div1);
        if (detaching) detach(t11);
        destroy_component(docscode2, detaching);
        if (detaching) detach(t12);
        if (detaching) detach(div2);
        if (detaching) detach(t19);
        destroy_component(docscode3, detaching);
        if (detaching) detach(t20);
        if (detaching) detach(div3);
        if (detaching) detach(t22);
        destroy_component(docscode4, detaching);
      }
    };
  }

  var Installation = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Installation, _SvelteComponent);

    function Installation(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$4, safe_not_equal, {});
      return _this;
    }

    return Installation;
  }(SvelteComponent);

  var Installation$1 = Installation;

  function create_default_slot_8(ctx) {
    var t;
    var current;
    var fa0 = new Fa__default["default"]({
      props: {
        icon: faCircle,
        color: "tomato"
      }
    });
    var fa1 = new Fa__default["default"]({
      props: {
        icon: faTimes,
        scale: 0.5,
        color: "white"
      }
    });
    return {
      c: function c() {
        create_component(fa0.$$.fragment);
        t = space();
        create_component(fa1.$$.fragment);
      },
      m: function m(target, anchor) {
        mount_component(fa0, target, anchor);
        insert(target, t, anchor);
        mount_component(fa1, target, anchor);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(fa0.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(fa0.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(fa0, detaching);
        if (detaching) detach(t);
        destroy_component(fa1, detaching);
      }
    };
  } // (29:2) <FaLayers size="4x" style="background: mistyrose">


  function create_default_slot_7(ctx) {
    var t;
    var current;
    var fa0 = new Fa__default["default"]({
      props: {
        icon: faBookmark
      }
    });
    var fa1 = new Fa__default["default"]({
      props: {
        icon: faHeart,
        scale: 0.4,
        translateY: -0.1,
        color: "tomato"
      }
    });
    return {
      c: function c() {
        create_component(fa0.$$.fragment);
        t = space();
        create_component(fa1.$$.fragment);
      },
      m: function m(target, anchor) {
        mount_component(fa0, target, anchor);
        insert(target, t, anchor);
        mount_component(fa1, target, anchor);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(fa0.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(fa0.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(fa0, detaching);
        if (detaching) detach(t);
        destroy_component(fa1, detaching);
      }
    };
  } // (33:2) <FaLayers size="4x" style="background: mistyrose">


  function create_default_slot_6(ctx) {
    var t0;
    var t1;
    var t2;
    var current;
    var fa0 = new Fa__default["default"]({
      props: {
        icon: faPlay,
        scale: 1.2,
        rotate: -90
      }
    });
    var fa1 = new Fa__default["default"]({
      props: {
        icon: faSun,
        scale: 0.35,
        translateY: -0.2,
        color: "white"
      }
    });
    var fa2 = new Fa__default["default"]({
      props: {
        icon: faMoon,
        scale: 0.3,
        translateX: -0.25,
        translateY: 0.25,
        color: "white"
      }
    });
    var fa3 = new Fa__default["default"]({
      props: {
        icon: faStar,
        scale: 0.3,
        translateX: 0.25,
        translateY: 0.25,
        color: "white"
      }
    });
    return {
      c: function c() {
        create_component(fa0.$$.fragment);
        t0 = space();
        create_component(fa1.$$.fragment);
        t1 = space();
        create_component(fa2.$$.fragment);
        t2 = space();
        create_component(fa3.$$.fragment);
      },
      m: function m(target, anchor) {
        mount_component(fa0, target, anchor);
        insert(target, t0, anchor);
        mount_component(fa1, target, anchor);
        insert(target, t1, anchor);
        mount_component(fa2, target, anchor);
        insert(target, t2, anchor);
        mount_component(fa3, target, anchor);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(fa0.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        transition_in(fa2.$$.fragment, local);
        transition_in(fa3.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(fa0.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        transition_out(fa2.$$.fragment, local);
        transition_out(fa3.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(fa0, detaching);
        if (detaching) detach(t0);
        destroy_component(fa1, detaching);
        if (detaching) detach(t1);
        destroy_component(fa2, detaching);
        if (detaching) detach(t2);
        destroy_component(fa3, detaching);
      }
    };
  } // (53:4) <FaLayersText       scale={0.45}       translateY={0.1}       color="white"       style="font-weight: 900"     >


  function create_default_slot_5(ctx) {
    var t;
    return {
      c: function c() {
        t = text("27");
      },
      m: function m(target, anchor) {
        insert(target, t, anchor);
      },
      d: function d(detaching) {
        if (detaching) detach(t);
      }
    };
  } // (51:2) <FaLayers size="4x" style="background: mistyrose">


  function create_default_slot_4(ctx) {
    var t;
    var current;
    var fa = new Fa__default["default"]({
      props: {
        icon: faCalendar
      }
    });
    var falayerstext = new Fa.FaLayersText({
      props: {
        scale: 0.45,
        translateY: 0.1,
        color: "white",
        style: "font-weight: 900",
        $$slots: {
          default: [create_default_slot_5]
        },
        $$scope: {
          ctx: ctx
        }
      }
    });
    return {
      c: function c() {
        create_component(fa.$$.fragment);
        t = space();
        create_component(falayerstext.$$.fragment);
      },
      m: function m(target, anchor) {
        mount_component(fa, target, anchor);
        insert(target, t, anchor);
        mount_component(falayerstext, target, anchor);
        current = true;
      },
      p: function p(ctx, dirty) {
        var falayerstext_changes = {};

        if (dirty &
        /*$$scope*/
        1) {
          falayerstext_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }

        falayerstext.$set(falayerstext_changes);
      },
      i: function i(local) {
        if (current) return;
        transition_in(fa.$$.fragment, local);
        transition_in(falayerstext.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(fa.$$.fragment, local);
        transition_out(falayerstext.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(fa, detaching);
        if (detaching) detach(t);
        destroy_component(falayerstext, detaching);
      }
    };
  } // (64:4) <FaLayersText       scale={0.25}       rotate={-30}       color="white"       style="font-weight: 900"     >


  function create_default_slot_3(ctx) {
    var t;
    return {
      c: function c() {
        t = text("NEW");
      },
      m: function m(target, anchor) {
        insert(target, t, anchor);
      },
      d: function d(detaching) {
        if (detaching) detach(t);
      }
    };
  } // (62:2) <FaLayers size="4x" style="background: mistyrose">


  function create_default_slot_2(ctx) {
    var t;
    var current;
    var fa = new Fa__default["default"]({
      props: {
        icon: faCertificate
      }
    });
    var falayerstext = new Fa.FaLayersText({
      props: {
        scale: 0.25,
        rotate: -30,
        color: "white",
        style: "font-weight: 900",
        $$slots: {
          default: [create_default_slot_3]
        },
        $$scope: {
          ctx: ctx
        }
      }
    });
    return {
      c: function c() {
        create_component(fa.$$.fragment);
        t = space();
        create_component(falayerstext.$$.fragment);
      },
      m: function m(target, anchor) {
        mount_component(fa, target, anchor);
        insert(target, t, anchor);
        mount_component(falayerstext, target, anchor);
        current = true;
      },
      p: function p(ctx, dirty) {
        var falayerstext_changes = {};

        if (dirty &
        /*$$scope*/
        1) {
          falayerstext_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }

        falayerstext.$set(falayerstext_changes);
      },
      i: function i(local) {
        if (current) return;
        transition_in(fa.$$.fragment, local);
        transition_in(falayerstext.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(fa.$$.fragment, local);
        transition_out(falayerstext.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(fa, detaching);
        if (detaching) detach(t);
        destroy_component(falayerstext, detaching);
      }
    };
  } // (75:4) <FaLayersText       scale={0.2}       translateX={0.4}       translateY={-0.4}       color="white"       style="padding: 0 .2em; background: tomato; border-radius: 1em"     >


  function create_default_slot_1(ctx) {
    var t;
    return {
      c: function c() {
        t = text("1,419");
      },
      m: function m(target, anchor) {
        insert(target, t, anchor);
      },
      d: function d(detaching) {
        if (detaching) detach(t);
      }
    };
  } // (73:2) <FaLayers size="4x" style="background: mistyrose">


  function create_default_slot(ctx) {
    var t;
    var current;
    var fa = new Fa__default["default"]({
      props: {
        icon: faEnvelope
      }
    });
    var falayerstext = new Fa.FaLayersText({
      props: {
        scale: 0.2,
        translateX: 0.4,
        translateY: -0.4,
        color: "white",
        style: "padding: 0 .2em; background: tomato; border-radius: 1em",
        $$slots: {
          default: [create_default_slot_1]
        },
        $$scope: {
          ctx: ctx
        }
      }
    });
    return {
      c: function c() {
        create_component(fa.$$.fragment);
        t = space();
        create_component(falayerstext.$$.fragment);
      },
      m: function m(target, anchor) {
        mount_component(fa, target, anchor);
        insert(target, t, anchor);
        mount_component(falayerstext, target, anchor);
        current = true;
      },
      p: function p(ctx, dirty) {
        var falayerstext_changes = {};

        if (dirty &
        /*$$scope*/
        1) {
          falayerstext_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }

        falayerstext.$set(falayerstext_changes);
      },
      i: function i(local) {
        if (current) return;
        transition_in(fa.$$.fragment, local);
        transition_in(falayerstext.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(fa.$$.fragment, local);
        transition_out(falayerstext.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(fa, detaching);
        if (detaching) detach(t);
        destroy_component(falayerstext, detaching);
      }
    };
  }

  function create_fragment$3(ctx) {
    var t0;
    var div;
    var t1;
    var t2;
    var t3;
    var t4;
    var t5;
    var t6;
    var t7;
    var current;
    var docstitle = new DocsTitle({
      props: {
        title: "Layering & Text"
      }
    });
    var falayers0 = new Fa.FaLayers({
      props: {
        size: "4x",
        style: "background: mistyrose",
        $$slots: {
          default: [create_default_slot_8]
        },
        $$scope: {
          ctx: ctx
        }
      }
    });
    var falayers1 = new Fa.FaLayers({
      props: {
        size: "4x",
        style: "background: mistyrose",
        $$slots: {
          default: [create_default_slot_7]
        },
        $$scope: {
          ctx: ctx
        }
      }
    });
    var falayers2 = new Fa.FaLayers({
      props: {
        size: "4x",
        style: "background: mistyrose",
        $$slots: {
          default: [create_default_slot_6]
        },
        $$scope: {
          ctx: ctx
        }
      }
    });
    var falayers3 = new Fa.FaLayers({
      props: {
        size: "4x",
        style: "background: mistyrose",
        $$slots: {
          default: [create_default_slot_4]
        },
        $$scope: {
          ctx: ctx
        }
      }
    });
    var falayers4 = new Fa.FaLayers({
      props: {
        size: "4x",
        style: "background: mistyrose",
        $$slots: {
          default: [create_default_slot_2]
        },
        $$scope: {
          ctx: ctx
        }
      }
    });
    var falayers5 = new Fa.FaLayers({
      props: {
        size: "4x",
        style: "background: mistyrose",
        $$slots: {
          default: [create_default_slot]
        },
        $$scope: {
          ctx: ctx
        }
      }
    });
    var docscode0 = new DocsCode({
      props: {
        code: codes$1.layering[0],
        lang: "js"
      }
    });
    var docscode1 = new DocsCode({
      props: {
        code: codes$1.layering[1]
      }
    });
    return {
      c: function c() {
        create_component(docstitle.$$.fragment);
        t0 = space();
        div = element("div");
        create_component(falayers0.$$.fragment);
        t1 = space();
        create_component(falayers1.$$.fragment);
        t2 = space();
        create_component(falayers2.$$.fragment);
        t3 = space();
        create_component(falayers3.$$.fragment);
        t4 = space();
        create_component(falayers4.$$.fragment);
        t5 = space();
        create_component(falayers5.$$.fragment);
        t6 = space();
        create_component(docscode0.$$.fragment);
        t7 = space();
        create_component(docscode1.$$.fragment);
        attr(div, "class", "shadow-sm p-3 mb-3 rounded");
      },
      m: function m(target, anchor) {
        mount_component(docstitle, target, anchor);
        insert(target, t0, anchor);
        insert(target, div, anchor);
        mount_component(falayers0, div, null);
        append(div, t1);
        mount_component(falayers1, div, null);
        append(div, t2);
        mount_component(falayers2, div, null);
        append(div, t3);
        mount_component(falayers3, div, null);
        append(div, t4);
        mount_component(falayers4, div, null);
        append(div, t5);
        mount_component(falayers5, div, null);
        insert(target, t6, anchor);
        mount_component(docscode0, target, anchor);
        insert(target, t7, anchor);
        mount_component(docscode1, target, anchor);
        current = true;
      },
      p: function p(ctx, _ref) {
        var dirty = _ref[0];
        var falayers0_changes = {};

        if (dirty &
        /*$$scope*/
        1) {
          falayers0_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }

        falayers0.$set(falayers0_changes);
        var falayers1_changes = {};

        if (dirty &
        /*$$scope*/
        1) {
          falayers1_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }

        falayers1.$set(falayers1_changes);
        var falayers2_changes = {};

        if (dirty &
        /*$$scope*/
        1) {
          falayers2_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }

        falayers2.$set(falayers2_changes);
        var falayers3_changes = {};

        if (dirty &
        /*$$scope*/
        1) {
          falayers3_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }

        falayers3.$set(falayers3_changes);
        var falayers4_changes = {};

        if (dirty &
        /*$$scope*/
        1) {
          falayers4_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }

        falayers4.$set(falayers4_changes);
        var falayers5_changes = {};

        if (dirty &
        /*$$scope*/
        1) {
          falayers5_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }

        falayers5.$set(falayers5_changes);
      },
      i: function i(local) {
        if (current) return;
        transition_in(docstitle.$$.fragment, local);
        transition_in(falayers0.$$.fragment, local);
        transition_in(falayers1.$$.fragment, local);
        transition_in(falayers2.$$.fragment, local);
        transition_in(falayers3.$$.fragment, local);
        transition_in(falayers4.$$.fragment, local);
        transition_in(falayers5.$$.fragment, local);
        transition_in(docscode0.$$.fragment, local);
        transition_in(docscode1.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docstitle.$$.fragment, local);
        transition_out(falayers0.$$.fragment, local);
        transition_out(falayers1.$$.fragment, local);
        transition_out(falayers2.$$.fragment, local);
        transition_out(falayers3.$$.fragment, local);
        transition_out(falayers4.$$.fragment, local);
        transition_out(falayers5.$$.fragment, local);
        transition_out(docscode0.$$.fragment, local);
        transition_out(docscode1.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(docstitle, detaching);
        if (detaching) detach(t0);
        if (detaching) detach(div);
        destroy_component(falayers0);
        destroy_component(falayers1);
        destroy_component(falayers2);
        destroy_component(falayers3);
        destroy_component(falayers4);
        destroy_component(falayers5);
        if (detaching) detach(t6);
        destroy_component(docscode0, detaching);
        if (detaching) detach(t7);
        destroy_component(docscode1, detaching);
      }
    };
  }

  var Layering_and_text = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Layering_and_text, _SvelteComponent);

    function Layering_and_text(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$3, safe_not_equal, {});
      return _this;
    }

    return Layering_and_text;
  }(SvelteComponent);

  var LayeringAndText = Layering_and_text;

  function create_fragment$2(ctx) {
    var t0;
    var t1;
    var div0;
    var t2;
    var t3;
    var t4;
    var t5;
    var t6;
    var div1;
    var t7;
    var t8;
    var t9;
    var t10;
    var t11;
    var t12;
    var t13;
    var div2;
    var t14;
    var t15;
    var t16;
    var t17;
    var t18;
    var t19;
    var t20;
    var t21;
    var t22;
    var current;
    var docstitle0 = new DocsTitle({
      props: {
        title: "Power Transforms"
      }
    });
    var docstitle1 = new DocsTitle({
      props: {
        title: "Scaling",
        level: 3
      }
    });
    var fa0 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa1 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        scale: 0.5,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa2 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        scale: 1.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var docscode0 = new DocsCode({
      props: {
        code: codes$1.powerTransforms[0]
      }
    });
    var docstitle2 = new DocsTitle({
      props: {
        title: "Positioning",
        level: 3
      }
    });
    var fa3 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        scale: 0.5,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa4 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        scale: 0.5,
        translateX: 0.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa5 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        scale: 0.5,
        translateX: -0.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa6 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        scale: 0.5,
        translateY: 0.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa7 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        scale: 0.5,
        translateY: -0.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var docscode1 = new DocsCode({
      props: {
        code: codes$1.powerTransforms[1]
      }
    });
    var docstitle3 = new DocsTitle({
      props: {
        title: "Rotating & Flipping",
        level: 3
      }
    });
    var fa8 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        rotate: 90,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa9 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        rotate: 180,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    var fa10 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        size: "4x",
        rotate: "270",
        style: "background: mistyrose"
      }
    });
    var fa11 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        size: "4x",
        rotate: "30",
        style: "background: mistyrose"
      }
    });
    var fa12 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        size: "4x",
        rotate: "-30",
        style: "background: mistyrose"
      }
    });
    var fa13 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        size: "4x",
        flip: "vertical",
        style: "background: mistyrose"
      }
    });
    var fa14 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        size: "4x",
        flip: "horizontal",
        style: "background: mistyrose"
      }
    });
    var fa15 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        size: "4x",
        flip: "both",
        style: "background: mistyrose"
      }
    });
    var fa16 = new Fa__default["default"]({
      props: {
        icon: faSeedling,
        size: "4x",
        flip: "both",
        rotate: "30",
        style: "background: mistyrose"
      }
    });
    var docscode2 = new DocsCode({
      props: {
        code: codes$1.powerTransforms[2]
      }
    });
    return {
      c: function c() {
        create_component(docstitle0.$$.fragment);
        t0 = space();
        create_component(docstitle1.$$.fragment);
        t1 = space();
        div0 = element("div");
        create_component(fa0.$$.fragment);
        t2 = space();
        create_component(fa1.$$.fragment);
        t3 = space();
        create_component(fa2.$$.fragment);
        t4 = space();
        create_component(docscode0.$$.fragment);
        t5 = space();
        create_component(docstitle2.$$.fragment);
        t6 = space();
        div1 = element("div");
        create_component(fa3.$$.fragment);
        t7 = space();
        create_component(fa4.$$.fragment);
        t8 = space();
        create_component(fa5.$$.fragment);
        t9 = space();
        create_component(fa6.$$.fragment);
        t10 = space();
        create_component(fa7.$$.fragment);
        t11 = space();
        create_component(docscode1.$$.fragment);
        t12 = space();
        create_component(docstitle3.$$.fragment);
        t13 = space();
        div2 = element("div");
        create_component(fa8.$$.fragment);
        t14 = space();
        create_component(fa9.$$.fragment);
        t15 = space();
        create_component(fa10.$$.fragment);
        t16 = space();
        create_component(fa11.$$.fragment);
        t17 = space();
        create_component(fa12.$$.fragment);
        t18 = space();
        create_component(fa13.$$.fragment);
        t19 = space();
        create_component(fa14.$$.fragment);
        t20 = space();
        create_component(fa15.$$.fragment);
        t21 = space();
        create_component(fa16.$$.fragment);
        t22 = space();
        create_component(docscode2.$$.fragment);
        attr(div0, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div1, "class", "shadow-sm p-3 mb-3 rounded");
        attr(div2, "class", "shadow-sm p-3 mb-3 rounded");
      },
      m: function m(target, anchor) {
        mount_component(docstitle0, target, anchor);
        insert(target, t0, anchor);
        mount_component(docstitle1, target, anchor);
        insert(target, t1, anchor);
        insert(target, div0, anchor);
        mount_component(fa0, div0, null);
        append(div0, t2);
        mount_component(fa1, div0, null);
        append(div0, t3);
        mount_component(fa2, div0, null);
        insert(target, t4, anchor);
        mount_component(docscode0, target, anchor);
        insert(target, t5, anchor);
        mount_component(docstitle2, target, anchor);
        insert(target, t6, anchor);
        insert(target, div1, anchor);
        mount_component(fa3, div1, null);
        append(div1, t7);
        mount_component(fa4, div1, null);
        append(div1, t8);
        mount_component(fa5, div1, null);
        append(div1, t9);
        mount_component(fa6, div1, null);
        append(div1, t10);
        mount_component(fa7, div1, null);
        insert(target, t11, anchor);
        mount_component(docscode1, target, anchor);
        insert(target, t12, anchor);
        mount_component(docstitle3, target, anchor);
        insert(target, t13, anchor);
        insert(target, div2, anchor);
        mount_component(fa8, div2, null);
        append(div2, t14);
        mount_component(fa9, div2, null);
        append(div2, t15);
        mount_component(fa10, div2, null);
        append(div2, t16);
        mount_component(fa11, div2, null);
        append(div2, t17);
        mount_component(fa12, div2, null);
        append(div2, t18);
        mount_component(fa13, div2, null);
        append(div2, t19);
        mount_component(fa14, div2, null);
        append(div2, t20);
        mount_component(fa15, div2, null);
        append(div2, t21);
        mount_component(fa16, div2, null);
        insert(target, t22, anchor);
        mount_component(docscode2, target, anchor);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(docstitle0.$$.fragment, local);
        transition_in(docstitle1.$$.fragment, local);
        transition_in(fa0.$$.fragment, local);
        transition_in(fa1.$$.fragment, local);
        transition_in(fa2.$$.fragment, local);
        transition_in(docscode0.$$.fragment, local);
        transition_in(docstitle2.$$.fragment, local);
        transition_in(fa3.$$.fragment, local);
        transition_in(fa4.$$.fragment, local);
        transition_in(fa5.$$.fragment, local);
        transition_in(fa6.$$.fragment, local);
        transition_in(fa7.$$.fragment, local);
        transition_in(docscode1.$$.fragment, local);
        transition_in(docstitle3.$$.fragment, local);
        transition_in(fa8.$$.fragment, local);
        transition_in(fa9.$$.fragment, local);
        transition_in(fa10.$$.fragment, local);
        transition_in(fa11.$$.fragment, local);
        transition_in(fa12.$$.fragment, local);
        transition_in(fa13.$$.fragment, local);
        transition_in(fa14.$$.fragment, local);
        transition_in(fa15.$$.fragment, local);
        transition_in(fa16.$$.fragment, local);
        transition_in(docscode2.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(docstitle0.$$.fragment, local);
        transition_out(docstitle1.$$.fragment, local);
        transition_out(fa0.$$.fragment, local);
        transition_out(fa1.$$.fragment, local);
        transition_out(fa2.$$.fragment, local);
        transition_out(docscode0.$$.fragment, local);
        transition_out(docstitle2.$$.fragment, local);
        transition_out(fa3.$$.fragment, local);
        transition_out(fa4.$$.fragment, local);
        transition_out(fa5.$$.fragment, local);
        transition_out(fa6.$$.fragment, local);
        transition_out(fa7.$$.fragment, local);
        transition_out(docscode1.$$.fragment, local);
        transition_out(docstitle3.$$.fragment, local);
        transition_out(fa8.$$.fragment, local);
        transition_out(fa9.$$.fragment, local);
        transition_out(fa10.$$.fragment, local);
        transition_out(fa11.$$.fragment, local);
        transition_out(fa12.$$.fragment, local);
        transition_out(fa13.$$.fragment, local);
        transition_out(fa14.$$.fragment, local);
        transition_out(fa15.$$.fragment, local);
        transition_out(fa16.$$.fragment, local);
        transition_out(docscode2.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        destroy_component(docstitle0, detaching);
        if (detaching) detach(t0);
        destroy_component(docstitle1, detaching);
        if (detaching) detach(t1);
        if (detaching) detach(div0);
        destroy_component(fa0);
        destroy_component(fa1);
        destroy_component(fa2);
        if (detaching) detach(t4);
        destroy_component(docscode0, detaching);
        if (detaching) detach(t5);
        destroy_component(docstitle2, detaching);
        if (detaching) detach(t6);
        if (detaching) detach(div1);
        destroy_component(fa3);
        destroy_component(fa4);
        destroy_component(fa5);
        destroy_component(fa6);
        destroy_component(fa7);
        if (detaching) detach(t11);
        destroy_component(docscode1, detaching);
        if (detaching) detach(t12);
        destroy_component(docstitle3, detaching);
        if (detaching) detach(t13);
        if (detaching) detach(div2);
        destroy_component(fa8);
        destroy_component(fa9);
        destroy_component(fa10);
        destroy_component(fa11);
        destroy_component(fa12);
        destroy_component(fa13);
        destroy_component(fa14);
        destroy_component(fa15);
        destroy_component(fa16);
        if (detaching) detach(t22);
        destroy_component(docscode2, detaching);
      }
    };
  }

  var Power_transforms = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Power_transforms, _SvelteComponent);

    function Power_transforms(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$2, safe_not_equal, {});
      return _this;
    }

    return Power_transforms;
  }(SvelteComponent);

  var PowerTransforms = Power_transforms;

  function create_fragment$1(ctx) {
    var div;
    var t0;
    var t1;
    var t2;
    var t3;
    var t4;
    var t5;
    var current;
    var installation = new Installation$1({});
    var basicuse = new BasicUse({});
    var additionalstyling = new AdditionalStyling({});
    var animatingicons = new AnimatingIcons({});
    var powertransforms = new PowerTransforms({});
    var layeringandtext = new LayeringAndText({});
    var duotoneicons = new DuotoneIcons({});
    return {
      c: function c() {
        div = element("div");
        create_component(installation.$$.fragment);
        t0 = space();
        create_component(basicuse.$$.fragment);
        t1 = space();
        create_component(additionalstyling.$$.fragment);
        t2 = space();
        create_component(animatingicons.$$.fragment);
        t3 = space();
        create_component(powertransforms.$$.fragment);
        t4 = space();
        create_component(layeringandtext.$$.fragment);
        t5 = space();
        create_component(duotoneicons.$$.fragment);
      },
      m: function m(target, anchor) {
        insert(target, div, anchor);
        mount_component(installation, div, null);
        append(div, t0);
        mount_component(basicuse, div, null);
        append(div, t1);
        mount_component(additionalstyling, div, null);
        append(div, t2);
        mount_component(animatingicons, div, null);
        append(div, t3);
        mount_component(powertransforms, div, null);
        append(div, t4);
        mount_component(layeringandtext, div, null);
        append(div, t5);
        mount_component(duotoneicons, div, null);
        current = true;
      },
      p: noop,
      i: function i(local) {
        if (current) return;
        transition_in(installation.$$.fragment, local);
        transition_in(basicuse.$$.fragment, local);
        transition_in(additionalstyling.$$.fragment, local);
        transition_in(animatingicons.$$.fragment, local);
        transition_in(powertransforms.$$.fragment, local);
        transition_in(layeringandtext.$$.fragment, local);
        transition_in(duotoneicons.$$.fragment, local);
        current = true;
      },
      o: function o(local) {
        transition_out(installation.$$.fragment, local);
        transition_out(basicuse.$$.fragment, local);
        transition_out(additionalstyling.$$.fragment, local);
        transition_out(animatingicons.$$.fragment, local);
        transition_out(powertransforms.$$.fragment, local);
        transition_out(layeringandtext.$$.fragment, local);
        transition_out(duotoneicons.$$.fragment, local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) detach(div);
        destroy_component(installation);
        destroy_component(basicuse);
        destroy_component(additionalstyling);
        destroy_component(animatingicons);
        destroy_component(powertransforms);
        destroy_component(layeringandtext);
        destroy_component(duotoneicons);
      }
    };
  }

  var Docs = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Docs, _SvelteComponent);

    function Docs(options) {
      var _this;

      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, null, create_fragment$1, safe_not_equal, {});
      return _this;
    }

    return Docs;
  }(SvelteComponent);

  var Docs$1 = Docs;

  function create_fragment(ctx) {
    var div;
    var t;
    var current;
    var showcase = new Showcase$1({});
    var docs = new Docs$1({});
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
      init(_assertThisInitialized(_this), options, null, create_fragment, safe_not_equal, {});
      return _this;
    }

    return App;
  }(SvelteComponent);

  var App$1 = App;

  new App$1({
    target: document.getElementById('app')
  });

})(SvelteFa);
