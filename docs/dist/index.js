(function () {
  'use strict';

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
    for (var k in src) tar[k] = src[k];
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
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      var slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      var lets = definition[2](fn(dirty));
      if ($$scope.dirty === undefined) {
        return lets;
      }
      if (typeof lets === 'object') {
        var merged = [];
        var len = Math.max($$scope.dirty.length, lets.length);
        for (var i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      var slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      var dirty = [];
      var length = $$scope.ctx.length / 32;
      for (var i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function exclude_internal_props(props) {
    var result = {};
    for (var k in props) if (k[0] !== '$') result[k] = props[k];
    return result;
  }
  function null_to_empty(value) {
    return value == null ? '' : value;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function append_styles(target, style_sheet_id, styles) {
    var append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
      var style = element('style');
      style.id = style_sheet_id;
      style.textContent = styles;
      append_stylesheet(append_styles_to, style);
    }
  }
  function get_root_for_style(node) {
    if (!node) return document;
    var root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
      return root;
    }
    return node.ownerDocument;
  }
  function append_stylesheet(node, style) {
    append(node.head || node, style);
    return style.sheet;
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (var i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(' ');
  }
  function empty() {
    return text('');
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return function () {
      return node.removeEventListener(event, handler, options);
    };
  }
  function prevent_default(fn) {
    return function (event) {
      event.preventDefault();
      // @ts-ignore
      return fn.call(this, event);
    };
  }
  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
  }
  /**
   * List of attributes that should always be set through the attr method,
   * because updating them through the property setter doesn't work reliably.
   * In the example of `width`/`height`, the problem is that the setter only
   * accepts numeric values, but the attribute can also be set to a string like `50%`.
   * If this list becomes too big, rethink this approach.
   */
  var always_set_through_set_attribute = ['width', 'height'];
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
      } else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
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
    if (text.data === data) return;
    text.data = data;
  }
  function set_input_value(input, value) {
    input.value = value == null ? '' : value;
  }
  function set_input_type(input, type) {
    try {
      input.type = type;
    } catch (e) {
      // do nothing
    }
  }
  function set_style(node, key, value, important) {
    if (value == null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? 'important' : '');
    }
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
  /**
   * Schedules a callback to run immediately after the component has been updated.
   *
   * The first time the callback runs will be after the initial `onMount`
   */
  function afterUpdate(fn) {
    get_current_component().$$.after_update.push(fn);
  }
  // TODO figure out if we still want to support
  // shorthand events, or if we want to implement
  // a real bubbling mechanism
  function bubble(component, event) {
    var _this4 = this;
    var callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
      // @ts-ignore
      callbacks.slice().forEach(function (fn) {
        return fn.call(_this4, event);
      });
    }
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = /* @__PURE__ */Promise.resolve();
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
  // flush() calls callbacks in this order:
  // 1. All beforeUpdate callbacks, in order: parents before children
  // 2. All bind:this callbacks, in reverse order: children before parents.
  // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
  //    for afterUpdates called during the initial onMount, which are called in
  //    reverse order: children before parents.
  // Since callbacks might update component values, which could trigger another
  // call to flush(), the following steps guard against this:
  // 1. During beforeUpdate, any updated components will be added to the
  //    dirty_components array and will cause a reentrant call to flush(). Because
  //    the flush index is kept outside the function, the reentrant call will pick
  //    up where the earlier call left off and go through all dirty components. The
  //    current_component value is saved and restored so that the reentrant call will
  //    not interfere with the "parent" flush() call.
  // 2. bind:this callbacks cannot trigger new flush() calls.
  // 3. During afterUpdate, any updated components will NOT have their afterUpdate
  //    callback called a second time; the seen_callbacks set, outside the flush()
  //    function, guarantees this behavior.
  var seen_callbacks = new Set();
  var flushidx = 0; // Do *not* move this inside the flush() function
  function flush() {
    // Do not reenter flush while dirty components are updated, as this can
    // result in an infinite loop. Instead, let the inner flush handle it.
    // Reentrancy is ok afterwards for bindings etc.
    if (flushidx !== 0) {
      return;
    }
    var saved_component = current_component;
    do {
      // first, call beforeUpdate functions
      // and update components
      try {
        while (flushidx < dirty_components.length) {
          var component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        // reset dirty state to not end up in a deadlocked state and then rethrow
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length) binding_callbacks.pop()();
      // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...
      for (var i = 0; i < render_callbacks.length; i += 1) {
        var callback = render_callbacks[i];
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
    seen_callbacks.clear();
    set_current_component(saved_component);
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
  /**
   * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
   */
  function flush_render_callbacks(fns) {
    var filtered = [];
    var targets = [];
    render_callbacks.forEach(function (c) {
      return fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c);
    });
    targets.forEach(function (c) {
      return c();
    });
    render_callbacks = filtered;
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
    } else if (callback) {
      callback();
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
    while (i--) old_indexes[old_blocks[i].key] = i;
    var new_blocks = [];
    var new_lookup = new Map();
    var deltas = new Map();
    var updates = [];
    i = n;
    var _loop = function _loop() {
      var child_ctx = get_context(ctx, list, i);
      var key = get_key(child_ctx);
      var block = lookup.get(key);
      if (!block) {
        block = create_each_block(key, child_ctx);
        block.c();
      } else if (dynamic) {
        // defer updates until all the DOM shuffling is done
        updates.push(function () {
          return block.p(child_ctx, dirty);
        });
      }
      new_lookup.set(key, new_blocks[i] = block);
      if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
    };
    while (i--) {
      _loop();
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
    while (n) insert(new_blocks[n - 1]);
    run_all(updates);
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
        for (var _key5 in n) {
          if (!accounted_for[_key5]) {
            update[_key5] = n[_key5];
            accounted_for[_key5] = 1;
          }
        }
        levels[i] = n;
      } else {
        for (var _key6 in o) {
          accounted_for[_key6] = 1;
        }
      }
    }
    for (var _key7 in to_null_out) {
      if (!(_key7 in update)) update[_key7] = undefined;
    }
    return update;
  }
  var _boolean_attributes = ['allowfullscreen', 'allowpaymentrequest', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'defer', 'disabled', 'formnovalidate', 'hidden', 'inert', 'ismap', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'selected'];
  /**
   * List of HTML boolean attributes (e.g. `<input disabled>`).
   * Source: https://html.spec.whatwg.org/multipage/indices.html
   */
  new Set([].concat(_boolean_attributes));
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    var _component$$$ = component.$$,
      fragment = _component$$$.fragment,
      after_update = _component$$$.after_update;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      // onMount happens before the initial afterUpdate
      add_render_callback(function () {
        var new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
        // if the component was destroyed immediately
        // it will update the `$$.on_destroy` reference to `null`.
        // the destructured on_destroy may still reference to the old array
        if (component.$$.on_destroy) {
          var _component$$$$on_dest;
          (_component$$$$on_dest = component.$$.on_destroy).push.apply(_component$$$$on_dest, new_on_destroy);
        } else {
          // Edge case - component was destroyed immediately,
          // most likely as a result of a binding initialising
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    var $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      // TODO null out other refs, including component.$$ (but need to
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
  function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty) {
    if (dirty === void 0) {
      dirty = [-1];
    }
    var parent_component = current_component;
    set_current_component(component);
    var $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props: props,
      update: noop,
      not_equal: not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty: dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    var ready = false;
    $$.ctx = instance ? instance(component, options.props || {}, function (i, ret) {
      var value = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? undefined : arguments[2] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
        if (ready) make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        var nodes = children(options.target);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c();
      }
      if (options.intro) transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      flush();
    }
    set_current_component(parent_component);
  }
  /**
   * Base class for Svelte components. Used when dev=false.
   */
  var SvelteComponent = /*#__PURE__*/function () {
    function SvelteComponent() {}
    var _proto5 = SvelteComponent.prototype;
    _proto5.$destroy = function $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    };
    _proto5.$on = function $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return function () {
        var index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    };
    _proto5.$set = function $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    };
    return SvelteComponent;
  }();

  var parseNumber = parseFloat;
  function joinCss(obj, separator) {
    if (separator === void 0) {
      separator = ';';
    }
    var texts;
    if (Array.isArray(obj)) {
      texts = obj.filter(function (text) {
        return text;
      });
    } else {
      texts = [];
      for (var prop in obj) {
        if (obj[prop]) {
          texts.push(prop + ":" + obj[prop]);
        }
      }
    }
    return texts.join(separator);
  }
  function getStyles(style, size, pull, fw) {
    var float;
    var width;
    var height = '1em';
    var lineHeight;
    var fontSize;
    var textAlign;
    var verticalAlign = '-.125em';
    var overflow = 'visible';
    if (fw) {
      textAlign = 'center';
      width = '1.25em';
    }
    if (pull) {
      float = pull;
    }
    if (size) {
      if (size == 'lg') {
        fontSize = '1.33333em';
        lineHeight = '.75em';
        verticalAlign = '-.225em';
      } else if (size == 'xs') {
        fontSize = '.75em';
      } else if (size == 'sm') {
        fontSize = '.875em';
      } else {
        fontSize = size.replace('x', 'em');
      }
    }
    return joinCss([joinCss({
      float: float,
      width: width,
      height: height,
      'line-height': lineHeight,
      'font-size': fontSize,
      'text-align': textAlign,
      'vertical-align': verticalAlign,
      'transform-origin': 'center',
      overflow: overflow
    }), style]);
  }
  function getTransform(scale, translateX, translateY, rotate, flip, translateTimes, translateUnit, rotateUnit) {
    if (translateTimes === void 0) {
      translateTimes = 1;
    }
    if (translateUnit === void 0) {
      translateUnit = '';
    }
    if (rotateUnit === void 0) {
      rotateUnit = '';
    }
    var flipX = 1;
    var flipY = 1;
    if (flip) {
      if (flip == 'horizontal') {
        flipX = -1;
      } else if (flip == 'vertical') {
        flipY = -1;
      } else {
        flipX = flipY = -1;
      }
    }
    return joinCss(["translate(" + parseNumber(translateX) * translateTimes + translateUnit + "," + parseNumber(translateY) * translateTimes + translateUnit + ")", "scale(" + flipX * parseNumber(scale) + "," + flipY * parseNumber(scale) + ")", rotate && "rotate(" + rotate + rotateUnit + ")"], ' ');
  }

  function add_css$4(target) {
    append_styles(target, "svelte-1cj2gr0", ".spin.svelte-1cj2gr0{animation:svelte-1cj2gr0-spin 2s 0s infinite linear}.pulse.svelte-1cj2gr0{animation:svelte-1cj2gr0-spin 1s infinite steps(8)}@keyframes svelte-1cj2gr0-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}");
  }

  // (66:0) {#if i[4]}
  function create_if_block(ctx) {
    var svg;
    var g1;
    var g0;
    var g1_transform_value;
    var g1_transform_origin_value;
    var svg_id_value;
    var svg_class_value;
    var svg_viewBox_value;
    function select_block_type(ctx, dirty) {
      if (typeof /*i*/ctx[10][4] == 'string') return create_if_block_1;
      return create_else_block;
    }
    var current_block_type = select_block_type(ctx);
    var if_block = current_block_type(ctx);
    return {
      c: function c() {
        svg = svg_element("svg");
        g1 = svg_element("g");
        g0 = svg_element("g");
        if_block.c();
        attr(g0, "transform", /*transform*/ctx[12]);
        attr(g1, "transform", g1_transform_value = "translate(" + /*i*/ctx[10][0] / 2 + " " + /*i*/ctx[10][1] / 2 + ")");
        attr(g1, "transform-origin", g1_transform_origin_value = "" + ( /*i*/ctx[10][0] / 4 + " 0"));
        attr(svg, "id", svg_id_value = /*id*/ctx[1] || undefined);
        attr(svg, "class", svg_class_value = "svelte-fa " + /*clazz*/ctx[0] + " svelte-1cj2gr0");
        attr(svg, "style", /*s*/ctx[11]);
        attr(svg, "viewBox", svg_viewBox_value = "0 0 " + /*i*/ctx[10][0] + " " + /*i*/ctx[10][1]);
        attr(svg, "aria-hidden", "true");
        attr(svg, "role", "img");
        attr(svg, "xmlns", "http://www.w3.org/2000/svg");
        toggle_class(svg, "pulse", /*pulse*/ctx[4]);
        toggle_class(svg, "spin", /*spin*/ctx[3]);
      },
      m: function m(target, anchor) {
        insert(target, svg, anchor);
        append(svg, g1);
        append(g1, g0);
        if_block.m(g0, null);
      },
      p: function p(ctx, dirty) {
        if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block.d(1);
          if_block = current_block_type(ctx);
          if (if_block) {
            if_block.c();
            if_block.m(g0, null);
          }
        }
        if (dirty & /*transform*/4096) {
          attr(g0, "transform", /*transform*/ctx[12]);
        }
        if (dirty & /*i*/1024 && g1_transform_value !== (g1_transform_value = "translate(" + /*i*/ctx[10][0] / 2 + " " + /*i*/ctx[10][1] / 2 + ")")) {
          attr(g1, "transform", g1_transform_value);
        }
        if (dirty & /*i*/1024 && g1_transform_origin_value !== (g1_transform_origin_value = "" + ( /*i*/ctx[10][0] / 4 + " 0"))) {
          attr(g1, "transform-origin", g1_transform_origin_value);
        }
        if (dirty & /*id*/2 && svg_id_value !== (svg_id_value = /*id*/ctx[1] || undefined)) {
          attr(svg, "id", svg_id_value);
        }
        if (dirty & /*clazz*/1 && svg_class_value !== (svg_class_value = "svelte-fa " + /*clazz*/ctx[0] + " svelte-1cj2gr0")) {
          attr(svg, "class", svg_class_value);
        }
        if (dirty & /*s*/2048) {
          attr(svg, "style", /*s*/ctx[11]);
        }
        if (dirty & /*i*/1024 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*i*/ctx[10][0] + " " + /*i*/ctx[10][1])) {
          attr(svg, "viewBox", svg_viewBox_value);
        }
        if (dirty & /*clazz, pulse*/17) {
          toggle_class(svg, "pulse", /*pulse*/ctx[4]);
        }
        if (dirty & /*clazz, spin*/9) {
          toggle_class(svg, "spin", /*spin*/ctx[3]);
        }
      },
      d: function d(detaching) {
        if (detaching) detach(svg);
        if_block.d();
      }
    };
  }

  // (89:8) {:else}
  function create_else_block(ctx) {
    var path0;
    var path0_d_value;
    var path0_fill_value;
    var path0_fill_opacity_value;
    var path0_transform_value;
    var path1;
    var path1_d_value;
    var path1_fill_value;
    var path1_fill_opacity_value;
    var path1_transform_value;
    return {
      c: function c() {
        path0 = svg_element("path");
        path1 = svg_element("path");
        attr(path0, "d", path0_d_value = /*i*/ctx[10][4][0]);
        attr(path0, "fill", path0_fill_value = /*secondaryColor*/ctx[6] || /*color*/ctx[2] || 'currentColor');
        attr(path0, "fill-opacity", path0_fill_opacity_value = /*swapOpacity*/ctx[9] != false ? /*primaryOpacity*/ctx[7] : /*secondaryOpacity*/ctx[8]);
        attr(path0, "transform", path0_transform_value = "translate(" + /*i*/ctx[10][0] / -2 + " " + /*i*/ctx[10][1] / -2 + ")");
        attr(path1, "d", path1_d_value = /*i*/ctx[10][4][1]);
        attr(path1, "fill", path1_fill_value = /*primaryColor*/ctx[5] || /*color*/ctx[2] || 'currentColor');
        attr(path1, "fill-opacity", path1_fill_opacity_value = /*swapOpacity*/ctx[9] != false ? /*secondaryOpacity*/ctx[8] : /*primaryOpacity*/ctx[7]);
        attr(path1, "transform", path1_transform_value = "translate(" + /*i*/ctx[10][0] / -2 + " " + /*i*/ctx[10][1] / -2 + ")");
      },
      m: function m(target, anchor) {
        insert(target, path0, anchor);
        insert(target, path1, anchor);
      },
      p: function p(ctx, dirty) {
        if (dirty & /*i*/1024 && path0_d_value !== (path0_d_value = /*i*/ctx[10][4][0])) {
          attr(path0, "d", path0_d_value);
        }
        if (dirty & /*secondaryColor, color*/68 && path0_fill_value !== (path0_fill_value = /*secondaryColor*/ctx[6] || /*color*/ctx[2] || 'currentColor')) {
          attr(path0, "fill", path0_fill_value);
        }
        if (dirty & /*swapOpacity, primaryOpacity, secondaryOpacity*/896 && path0_fill_opacity_value !== (path0_fill_opacity_value = /*swapOpacity*/ctx[9] != false ? /*primaryOpacity*/ctx[7] : /*secondaryOpacity*/ctx[8])) {
          attr(path0, "fill-opacity", path0_fill_opacity_value);
        }
        if (dirty & /*i*/1024 && path0_transform_value !== (path0_transform_value = "translate(" + /*i*/ctx[10][0] / -2 + " " + /*i*/ctx[10][1] / -2 + ")")) {
          attr(path0, "transform", path0_transform_value);
        }
        if (dirty & /*i*/1024 && path1_d_value !== (path1_d_value = /*i*/ctx[10][4][1])) {
          attr(path1, "d", path1_d_value);
        }
        if (dirty & /*primaryColor, color*/36 && path1_fill_value !== (path1_fill_value = /*primaryColor*/ctx[5] || /*color*/ctx[2] || 'currentColor')) {
          attr(path1, "fill", path1_fill_value);
        }
        if (dirty & /*swapOpacity, secondaryOpacity, primaryOpacity*/896 && path1_fill_opacity_value !== (path1_fill_opacity_value = /*swapOpacity*/ctx[9] != false ? /*secondaryOpacity*/ctx[8] : /*primaryOpacity*/ctx[7])) {
          attr(path1, "fill-opacity", path1_fill_opacity_value);
        }
        if (dirty & /*i*/1024 && path1_transform_value !== (path1_transform_value = "translate(" + /*i*/ctx[10][0] / -2 + " " + /*i*/ctx[10][1] / -2 + ")")) {
          attr(path1, "transform", path1_transform_value);
        }
      },
      d: function d(detaching) {
        if (detaching) detach(path0);
        if (detaching) detach(path1);
      }
    };
  }

  // (83:8) {#if typeof i[4] == 'string'}
  function create_if_block_1(ctx) {
    var path;
    var path_d_value;
    var path_fill_value;
    var path_transform_value;
    return {
      c: function c() {
        path = svg_element("path");
        attr(path, "d", path_d_value = /*i*/ctx[10][4]);
        attr(path, "fill", path_fill_value = /*color*/ctx[2] || /*primaryColor*/ctx[5] || 'currentColor');
        attr(path, "transform", path_transform_value = "translate(" + /*i*/ctx[10][0] / -2 + " " + /*i*/ctx[10][1] / -2 + ")");
      },
      m: function m(target, anchor) {
        insert(target, path, anchor);
      },
      p: function p(ctx, dirty) {
        if (dirty & /*i*/1024 && path_d_value !== (path_d_value = /*i*/ctx[10][4])) {
          attr(path, "d", path_d_value);
        }
        if (dirty & /*color, primaryColor*/36 && path_fill_value !== (path_fill_value = /*color*/ctx[2] || /*primaryColor*/ctx[5] || 'currentColor')) {
          attr(path, "fill", path_fill_value);
        }
        if (dirty & /*i*/1024 && path_transform_value !== (path_transform_value = "translate(" + /*i*/ctx[10][0] / -2 + " " + /*i*/ctx[10][1] / -2 + ")")) {
          attr(path, "transform", path_transform_value);
        }
      },
      d: function d(detaching) {
        if (detaching) detach(path);
      }
    };
  }
  function create_fragment$f(ctx) {
    var if_block_anchor;
    var if_block = /*i*/ctx[10][4] && create_if_block(ctx);
    return {
      c: function c() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      m: function m(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
      },
      p: function p(ctx, _ref) {
        var dirty = _ref[0];
        if ( /*i*/ctx[10][4]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block(ctx);
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      i: noop,
      o: noop,
      d: function d(detaching) {
        if (if_block) if_block.d(detaching);
        if (detaching) detach(if_block_anchor);
      }
    };
  }
  function instance$6($$self, $$props, $$invalidate) {
    var _$$props$class = $$props.class,
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
    var _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
    var _$$props$style = $$props.style,
      style = _$$props$style === void 0 ? '' : _$$props$style;
    var icon = $$props.icon;
    var _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size;
    var _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? '' : _$$props$color;
    var _$$props$fw = $$props.fw,
      fw = _$$props$fw === void 0 ? false : _$$props$fw;
    var _$$props$pull = $$props.pull,
      pull = _$$props$pull === void 0 ? '' : _$$props$pull;
    var _$$props$scale = $$props.scale,
      scale = _$$props$scale === void 0 ? 1 : _$$props$scale;
    var _$$props$translateX = $$props.translateX,
      translateX = _$$props$translateX === void 0 ? 0 : _$$props$translateX;
    var _$$props$translateY = $$props.translateY,
      translateY = _$$props$translateY === void 0 ? 0 : _$$props$translateY;
    var _$$props$rotate = $$props.rotate,
      rotate = _$$props$rotate === void 0 ? '' : _$$props$rotate;
    var _$$props$flip = $$props.flip,
      flip = _$$props$flip === void 0 ? false : _$$props$flip;
    var _$$props$spin = $$props.spin,
      spin = _$$props$spin === void 0 ? false : _$$props$spin;
    var _$$props$pulse = $$props.pulse,
      pulse = _$$props$pulse === void 0 ? false : _$$props$pulse;
    var _$$props$primaryColor = $$props.primaryColor,
      primaryColor = _$$props$primaryColor === void 0 ? '' : _$$props$primaryColor;
    var _$$props$secondaryCol = $$props.secondaryColor,
      secondaryColor = _$$props$secondaryCol === void 0 ? '' : _$$props$secondaryCol;
    var _$$props$primaryOpaci = $$props.primaryOpacity,
      primaryOpacity = _$$props$primaryOpaci === void 0 ? 1 : _$$props$primaryOpaci;
    var _$$props$secondaryOpa = $$props.secondaryOpacity,
      secondaryOpacity = _$$props$secondaryOpa === void 0 ? 0.4 : _$$props$secondaryOpa;
    var _$$props$swapOpacity = $$props.swapOpacity,
      swapOpacity = _$$props$swapOpacity === void 0 ? false : _$$props$swapOpacity;
    var i;
    var s;
    var transform;
    $$self.$$set = function ($$props) {
      if ('class' in $$props) $$invalidate(0, clazz = $$props.class);
      if ('id' in $$props) $$invalidate(1, id = $$props.id);
      if ('style' in $$props) $$invalidate(13, style = $$props.style);
      if ('icon' in $$props) $$invalidate(14, icon = $$props.icon);
      if ('size' in $$props) $$invalidate(15, size = $$props.size);
      if ('color' in $$props) $$invalidate(2, color = $$props.color);
      if ('fw' in $$props) $$invalidate(16, fw = $$props.fw);
      if ('pull' in $$props) $$invalidate(17, pull = $$props.pull);
      if ('scale' in $$props) $$invalidate(18, scale = $$props.scale);
      if ('translateX' in $$props) $$invalidate(19, translateX = $$props.translateX);
      if ('translateY' in $$props) $$invalidate(20, translateY = $$props.translateY);
      if ('rotate' in $$props) $$invalidate(21, rotate = $$props.rotate);
      if ('flip' in $$props) $$invalidate(22, flip = $$props.flip);
      if ('spin' in $$props) $$invalidate(3, spin = $$props.spin);
      if ('pulse' in $$props) $$invalidate(4, pulse = $$props.pulse);
      if ('primaryColor' in $$props) $$invalidate(5, primaryColor = $$props.primaryColor);
      if ('secondaryColor' in $$props) $$invalidate(6, secondaryColor = $$props.secondaryColor);
      if ('primaryOpacity' in $$props) $$invalidate(7, primaryOpacity = $$props.primaryOpacity);
      if ('secondaryOpacity' in $$props) $$invalidate(8, secondaryOpacity = $$props.secondaryOpacity);
      if ('swapOpacity' in $$props) $$invalidate(9, swapOpacity = $$props.swapOpacity);
    };
    $$self.$$.update = function () {
      if ($$self.$$.dirty & /*icon*/16384) {
        $$invalidate(10, i = icon && icon.icon || [0, 0, '', [], '']);
      }
      if ($$self.$$.dirty & /*style, size, pull, fw*/237568) {
        $$invalidate(11, s = getStyles(style, size, pull, fw));
      }
      if ($$self.$$.dirty & /*scale, translateX, translateY, rotate, flip*/8126464) {
        $$invalidate(12, transform = getTransform(scale, translateX, translateY, rotate, flip, 512));
      }
    };
    return [clazz, id, color, spin, pulse, primaryColor, secondaryColor, primaryOpacity, secondaryOpacity, swapOpacity, i, s, transform, style, icon, size, fw, pull, scale, translateX, translateY, rotate, flip];
  }
  var Fa = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Fa, _SvelteComponent);
    function Fa(options) {
      var _this;
      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$6, create_fragment$f, safe_not_equal, {
        class: 0,
        id: 1,
        style: 13,
        icon: 14,
        size: 15,
        color: 2,
        fw: 16,
        pull: 17,
        scale: 18,
        translateX: 19,
        translateY: 20,
        rotate: 21,
        flip: 22,
        spin: 3,
        pulse: 4,
        primaryColor: 5,
        secondaryColor: 6,
        primaryOpacity: 7,
        secondaryOpacity: 8,
        swapOpacity: 9
      }, add_css$4);
      return _this;
    }
    return Fa;
  }(SvelteComponent);
  var Fa$1 = Fa;

  var faInfo={prefix:'fas',iconName:'info',icon:[192,512,[],"f129","M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"]};var faPencil={prefix:'fas',iconName:'pencil',icon:[512,512,[9999,61504,"pencil-alt"],"f303","M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"]};var faPencilAlt=faPencil;var faCircleNotch={prefix:'fas',iconName:'circle-notch',icon:[512,512,[],"f1ce","M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"]};var faFlag={prefix:'fas',iconName:'flag',icon:[448,512,[127988,61725],"f024","M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"]};var faBookmark={prefix:'fas',iconName:'bookmark',icon:[384,512,[128278,61591],"f02e","M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"]};var faStar={prefix:'fas',iconName:'star',icon:[576,512,[11088,61446],"f005","M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"]};var faStroopwafel={prefix:'fas',iconName:'stroopwafel',icon:[512,512,[],"f551","M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM312.6 63.7c-6.2-6.2-16.4-6.2-22.6 0L256 97.6 222.1 63.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l33.9 33.9-45.3 45.3-56.6-56.6c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l56.6 56.6-45.3 45.3L86.3 199.4c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L97.6 256 63.7 289.9c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l33.9-33.9 45.3 45.3-56.6 56.6c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l56.6-56.6 45.3 45.3-33.9 33.9c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L256 414.4l33.9 33.9c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-33.9-33.9 45.3-45.3 56.6 56.6c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6l-56.6-56.6 45.3-45.3 33.9 33.9c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L414.4 256l33.9-33.9c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-33.9 33.9-45.3-45.3 56.6-56.6c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-56.6 56.6-45.3-45.3 33.9-33.9c6.2-6.2 6.2-16.4 0-22.6zM142.9 256l45.3-45.3L233.4 256l-45.3 45.3L142.9 256zm67.9 67.9L256 278.6l45.3 45.3L256 369.1l-45.3-45.3zM278.6 256l45.3-45.3L369.1 256l-45.3 45.3L278.6 256zm22.6-67.9L256 233.4l-45.3-45.3L256 142.9l45.3 45.3z"]};var faCertificate={prefix:'fas',iconName:'certificate',icon:[512,512,[],"f0a3","M211 7.3C205 1 196-1.4 187.6 .8s-14.9 8.9-17.1 17.3L154.7 80.6l-62-17.5c-8.4-2.4-17.4 0-23.5 6.1s-8.5 15.1-6.1 23.5l17.5 62L18.1 170.6c-8.4 2.1-15 8.7-17.3 17.1S1 205 7.3 211l46.2 45L7.3 301C1 307-1.4 316 .8 324.4s8.9 14.9 17.3 17.1l62.5 15.8-17.5 62c-2.4 8.4 0 17.4 6.1 23.5s15.1 8.5 23.5 6.1l62-17.5 15.8 62.5c2.1 8.4 8.7 15 17.1 17.3s17.3-.2 23.4-6.4l45-46.2 45 46.2c6.1 6.2 15 8.7 23.4 6.4s14.9-8.9 17.1-17.3l15.8-62.5 62 17.5c8.4 2.4 17.4 0 23.5-6.1s8.5-15.1 6.1-23.5l-17.5-62 62.5-15.8c8.4-2.1 15-8.7 17.3-17.1s-.2-17.3-6.4-23.4l-46.2-45 46.2-45c6.2-6.1 8.7-15 6.4-23.4s-8.9-14.9-17.3-17.1l-62.5-15.8 17.5-62c2.4-8.4 0-17.4-6.1-23.5s-15.1-8.5-23.5-6.1l-62 17.5L341.4 18.1c-2.1-8.4-8.7-15-17.1-17.3S307 1 301 7.3L256 53.5 211 7.3z"]};var faSeedling={prefix:'fas',iconName:'seedling',icon:[512,512,[127793,"sprout"],"f4d8","M512 32c0 113.6-84.6 207.5-194.2 222c-7.1-53.4-30.6-101.6-65.3-139.3C290.8 46.3 364 0 448 0h32c17.7 0 32 14.3 32 32zM0 96C0 78.3 14.3 64 32 64H64c123.7 0 224 100.3 224 224v32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V320C100.3 320 0 219.7 0 96z"]};var faArrowsRotate={prefix:'fas',iconName:'arrows-rotate',icon:[512,512,[128472,"refresh","sync"],"f021","M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"]};var faSync=faArrowsRotate;var faHeart={prefix:'fas',iconName:'heart',icon:[512,512,[128153,128154,128155,128156,128420,129293,129294,129505,9829,10084,61578],"f004","M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"]};var faCircle={prefix:'fas',iconName:'circle',icon:[512,512,[128308,128309,128992,128993,128994,128995,128996,9679,9898,9899,11044,61708,61915],"f111","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"]};var faQuoteRight={prefix:'fas',iconName:'quote-right',icon:[448,512,[8221,"quote-right-alt"],"f10e","M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72z"]};var faEnvelope={prefix:'fas',iconName:'envelope',icon:[512,512,[128386,9993,61443],"f0e0","M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"]};var faGear={prefix:'fas',iconName:'gear',icon:[512,512,[9881,"cog"],"f013","M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"]};var faCog=faGear;var faHouse={prefix:'fas',iconName:'house',icon:[576,512,[127968,63498,63500,"home","home-alt","home-lg-alt"],"f015","M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"]};var faHome=faHouse;var faSun={prefix:'fas',iconName:'sun',icon:[512,512,[9728],"f185","M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z"]};var faLink={prefix:'fas',iconName:'link',icon:[640,512,[128279,"chain"],"f0c1","M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"]};var faPlay={prefix:'fas',iconName:'play',icon:[384,512,[9654],"f04b","M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"]};var faXmark={prefix:'fas',iconName:'xmark',icon:[384,512,[128473,10005,10006,10060,215,"close","multiply","remove","times"],"f00d","M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"]};var faTimes=faXmark;var faQuoteLeft={prefix:'fas',iconName:'quote-left',icon:[448,512,[8220,"quote-left-alt"],"f10d","M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z"]};var faSpinner={prefix:'fas',iconName:'spinner',icon:[512,512,[],"f110","M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"]};var faMoon={prefix:'fas',iconName:'moon',icon:[384,512,[127769,9214],"f186","M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"]};var faCalendar={prefix:'fas',iconName:'calendar',icon:[448,512,[128197,128198],"f133","M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z"]};var faBook={prefix:'fas',iconName:'book',icon:[448,512,[128212],"f02d","M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"]};

  function add_css$3(target) {
    append_styles(target, "svelte-1a2mimh", ".hue.svelte-1a2mimh{color:#238ae6;animation:svelte-1a2mimh-hue 30s infinite linear}@keyframes svelte-1a2mimh-hue{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(-360deg)}}");
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
  }

  // (94:14) {#each pull as p (p)}
  function create_each_block_2(key_1, ctx) {
    var button;
    var t0_value = /*p*/ctx[16] + "";
    var t0;
    var t1;
    var button_class_value;
    var mounted;
    var dispose;
    function click_handler() {
      return (/*click_handler*/ctx[7]( /*p*/ctx[16])
      );
    }
    return {
      key: key_1,
      first: null,
      c: function c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = space();
        attr(button, "class", button_class_value = "" + (null_to_empty("btn btn-" + ( /*model*/ctx[0].pull == ( /*p*/ctx[16] == 'None' ? undefined : /*p*/ctx[16].toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh"));
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
        if (dirty & /*model*/1 && button_class_value !== (button_class_value = "" + (null_to_empty("btn btn-" + ( /*model*/ctx[0].pull == ( /*p*/ctx[16] == 'None' ? undefined : /*p*/ctx[16].toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh"))) {
          attr(button, "class", button_class_value);
        }
      },
      d: function d(detaching) {
        if (detaching) detach(button);
        mounted = false;
        dispose();
      }
    };
  }

  // (114:14) {#each flip as f (f)}
  function create_each_block_1(key_1, ctx) {
    var button;
    var t0_value = /*f*/ctx[13] + "";
    var t0;
    var t1;
    var button_class_value;
    var mounted;
    var dispose;
    function click_handler_1() {
      return (/*click_handler_1*/ctx[8]( /*f*/ctx[13])
      );
    }
    return {
      key: key_1,
      first: null,
      c: function c() {
        button = element("button");
        t0 = text(t0_value);
        t1 = space();
        attr(button, "class", button_class_value = "" + (null_to_empty("btn btn-" + ( /*model*/ctx[0].flip == ( /*f*/ctx[13] == 'None' ? undefined : /*f*/ctx[13].toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh"));
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
        if (dirty & /*model*/1 && button_class_value !== (button_class_value = "" + (null_to_empty("btn btn-" + ( /*model*/ctx[0].flip == ( /*f*/ctx[13] == 'None' ? undefined : /*f*/ctx[13].toLowerCase()) ? 'primary' : 'secondary')) + " svelte-1a2mimh"))) {
          attr(button, "class", button_class_value);
        }
      },
      d: function d(detaching) {
        if (detaching) detach(button);
        mounted = false;
        dispose();
      }
    };
  }

  // (149:6) {#each icons as icon, name}
  function create_each_block(ctx) {
    var div;
    var fa;
    var t;
    var current;
    fa = new Fa$1({
      props: {
        icon: /*icon*/ctx[10],
        flip: /*model*/ctx[0].flip,
        pull: /*model*/ctx[0].pull,
        rotate: /*model*/ctx[0].rotate,
        size: /*model*/ctx[0].size + "x"
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
        if (dirty & /*model*/1) fa_changes.flip = /*model*/ctx[0].flip;
        if (dirty & /*model*/1) fa_changes.pull = /*model*/ctx[0].pull;
        if (dirty & /*model*/1) fa_changes.rotate = /*model*/ctx[0].rotate;
        if (dirty & /*model*/1) fa_changes.size = /*model*/ctx[0].size + "x";
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
  function create_fragment$e(ctx) {
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
    var t16_value = /*model*/ctx[0].size + "";
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
    var t28_value = /*model*/ctx[0].rotate + "";
    var t28;
    var t29;
    var t30;
    var div17;
    var current;
    var mounted;
    var dispose;
    var each_value_2 = /*pull*/ctx[1];
    var get_key = function get_key(ctx) {
      return (/*p*/ctx[16]
      );
    };
    for (var i = 0; i < each_value_2.length; i += 1) {
      var child_ctx = get_each_context_2(ctx, each_value_2, i);
      var key = get_key(child_ctx);
      each0_lookup.set(key, each_blocks_2[i] = create_each_block_2(key, child_ctx));
    }
    var each_value_1 = /*flip*/ctx[2];
    var get_key_1 = function get_key_1(ctx) {
      return (/*f*/ctx[13]
      );
    };
    for (var _i = 0; _i < each_value_1.length; _i += 1) {
      var _child_ctx = get_each_context_1(ctx, each_value_1, _i);
      var _key = get_key_1(_child_ctx);
      each1_lookup.set(_key, each_blocks_1[_i] = create_each_block_1(_key, _child_ctx));
    }
    var each_value = /*icons*/ctx[3];
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
        p1.innerHTML = "Tiny <a class=\"hue svelte-1a2mimh\" href=\"https://fontawesome.com/\" target=\"_blank\">FontAwesome</a> component for <a class=\"hue svelte-1a2mimh\" href=\"https://svelte.dev/\" target=\"_blank\">Svelte</a>.";
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
        set_input_value(input0, /*model*/ctx[0].size);
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
          if (each_blocks_2[_i6]) {
            each_blocks_2[_i6].m(div5, null);
          }
        }
        append(form, t21);
        append(form, div10);
        append(div10, label2);
        append(div10, t23);
        append(div10, div9);
        append(div9, div8);
        for (var _i7 = 0; _i7 < each_blocks_1.length; _i7 += 1) {
          if (each_blocks_1[_i7]) {
            each_blocks_1[_i7].m(div8, null);
          }
        }
        append(form, t24);
        append(form, div15);
        append(div15, label3);
        append(div15, t26);
        append(div15, div14);
        append(div14, div11);
        append(div11, input1);
        set_input_value(input1, /*model*/ctx[0].rotate);
        append(div14, t27);
        append(div14, div13);
        append(div13, div12);
        append(div12, t28);
        append(div12, t29);
        append(div18, t30);
        append(div18, div17);
        for (var _i8 = 0; _i8 < each_blocks.length; _i8 += 1) {
          if (each_blocks[_i8]) {
            each_blocks[_i8].m(div17, null);
          }
        }
        current = true;
        if (!mounted) {
          dispose = [listen(input0, "change", /*input0_change_input_handler*/ctx[6]), listen(input0, "input", /*input0_change_input_handler*/ctx[6]), listen(input1, "change", /*input1_change_input_handler*/ctx[9]), listen(input1, "input", /*input1_change_input_handler*/ctx[9]), listen(form, "submit", prevent_default( /*submit_handler*/ctx[5]))];
          mounted = true;
        }
      },
      p: function p(ctx, _ref) {
        var dirty = _ref[0];
        if (dirty & /*model*/1) {
          set_input_value(input0, /*model*/ctx[0].size);
        }
        if ((!current || dirty & /*model*/1) && t16_value !== (t16_value = /*model*/ctx[0].size + "")) set_data(t16, t16_value);
        if (dirty & /*model, pull, undefined, setValue*/19) {
          each_value_2 = /*pull*/ctx[1];
          each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key, 1, ctx, each_value_2, each0_lookup, div5, destroy_block, create_each_block_2, null, get_each_context_2);
        }
        if (dirty & /*model, flip, undefined, setValue*/21) {
          each_value_1 = /*flip*/ctx[2];
          each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_1, 1, ctx, each_value_1, each1_lookup, div8, destroy_block, create_each_block_1, null, get_each_context_1);
        }
        if (dirty & /*model*/1) {
          set_input_value(input1, /*model*/ctx[0].rotate);
        }
        if ((!current || dirty & /*model*/1) && t28_value !== (t28_value = /*model*/ctx[0].rotate + "")) set_data(t28, t28_value);
        if (dirty & /*icons, model*/9) {
          each_value = /*icons*/ctx[3];
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
  function instance$5($$self, $$props, $$invalidate) {
    var model = {
      size: 5,
      pull: undefined,
      flip: undefined,
      rotate: 0
    };
    var pull = ['None', 'Left', 'Right'];
    var flip = ['None', 'Horizontal', 'Vertical', 'Both'];
    var icons = [faFlag, faHome, faCog, faSeedling];
    function setValue(prop, value) {
      $$invalidate(0, model[prop] = value == 'None' ? undefined : value.toLowerCase(), model);
    }
    function submit_handler(event) {
      bubble.call(this, $$self, event);
    }
    function input0_change_input_handler() {
      model.size = to_number(this.value);
      $$invalidate(0, model);
    }
    var click_handler = function click_handler(p) {
      return setValue('pull', p);
    };
    var click_handler_1 = function click_handler_1(f) {
      return setValue('flip', f);
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
      init(_assertThisInitialized(_this), options, instance$5, create_fragment$e, safe_not_equal, {}, add_css$3);
      return _this;
    }
    return Showcase;
  }(SvelteComponent);
  var Showcase$1 = Showcase;

  function create_fragment$d(ctx) {
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
        t = text( /*code*/ctx[0]);
        attr(code_1, "class", code_1_class_value = "language-" + /*lang*/ctx[1]);
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
        if (dirty & /*code*/1) set_data(t, /*code*/ctx[0]);
        if (dirty & /*lang*/2 && code_1_class_value !== (code_1_class_value = "language-" + /*lang*/ctx[1])) {
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
  function instance$4($$self, $$props, $$invalidate) {
    var code = $$props.code;
    var _$$props$lang = $$props.lang,
      lang = _$$props$lang === void 0 ? 'html' : _$$props$lang;
    var el;
    function highlight() {
      Prism.highlightElement(el);
    }
    afterUpdate(highlight);
    function code_1_binding($$value) {
      binding_callbacks[$$value ? 'unshift' : 'push'](function () {
        el = $$value;
        $$invalidate(2, el);
      });
    }
    $$self.$$set = function ($$props) {
      if ('code' in $$props) $$invalidate(0, code = $$props.code);
      if ('lang' in $$props) $$invalidate(1, lang = $$props.lang);
    };
    $$self.$$.update = function () {
      if ($$self.$$.dirty & /*el, code*/5) {
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
      init(_assertThisInitialized(_this), options, instance$4, create_fragment$d, safe_not_equal, {
        code: 0,
        lang: 1
      });
      return _this;
    }
    return Docs_code;
  }(SvelteComponent);
  var DocsCode = Docs_code;

  function add_css$2(target) {
    append_styles(target, "svelte-1yrtkpv", "a.svelte-1yrtkpv.svelte-1yrtkpv,a.svelte-1yrtkpv.svelte-1yrtkpv:visited{color:currentColor}small.svelte-1yrtkpv.svelte-1yrtkpv{visibility:hidden}a.svelte-1yrtkpv:hover+small.svelte-1yrtkpv{visibility:visible}");
  }
  function create_fragment$c(ctx) {
    var h4;
    var a;
    var t0;
    var a_href_value;
    var t1;
    var small;
    var fa;
    var h4_class_value;
    var current;
    fa = new Fa$1({
      props: {
        icon: faLink
      }
    });
    return {
      c: function c() {
        h4 = element("h4");
        a = element("a");
        t0 = text( /*title*/ctx[1]);
        t1 = space();
        small = element("small");
        create_component(fa.$$.fragment);
        attr(a, "href", a_href_value = "#" + /*id*/ctx[2]);
        attr(a, "class", "svelte-1yrtkpv");
        attr(small, "class", "svelte-1yrtkpv");
        attr(h4, "id", /*id*/ctx[2]);
        attr(h4, "class", h4_class_value = "h" + /*level*/ctx[0]);
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
        if (!current || dirty & /*title*/2) set_data(t0, /*title*/ctx[1]);
        if (!current || dirty & /*id*/4 && a_href_value !== (a_href_value = "#" + /*id*/ctx[2])) {
          attr(a, "href", a_href_value);
        }
        if (!current || dirty & /*id*/4) {
          attr(h4, "id", /*id*/ctx[2]);
        }
        if (!current || dirty & /*level*/1 && h4_class_value !== (h4_class_value = "h" + /*level*/ctx[0])) {
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
      level = _$$props$level === void 0 ? 2 : _$$props$level;
    var _$$props$title = $$props.title,
      title = _$$props$title === void 0 ? '' : _$$props$title;
    var id;
    $$self.$$set = function ($$props) {
      if ('level' in $$props) $$invalidate(0, level = $$props.level);
      if ('title' in $$props) $$invalidate(1, title = $$props.title);
    };
    $$self.$$.update = function () {
      if ($$self.$$.dirty & /*title*/2) {
        $$invalidate(2, id = title.toLowerCase().replace(/[^\w]/g, '-'));
      }
    };
    return [level, title, id];
  }
  var Docs_title = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Docs_title, _SvelteComponent);
    function Docs_title(options) {
      var _this;
      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$3, create_fragment$c, safe_not_equal, {
        level: 0,
        title: 1
      }, add_css$2);
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

  function create_fragment$b(ctx) {
    var docstitle0;
    var t0;
    var docstitle1;
    var t1;
    var div0;
    var fa0;
    var t2;
    var fa1;
    var t3;
    var fa2;
    var t4;
    var fa3;
    var t5;
    var fa4;
    var t6;
    var fa5;
    var t7;
    var fa6;
    var t8;
    var fa7;
    var t9;
    var docscode0;
    var t10;
    var docstitle2;
    var t11;
    var div6;
    var div1;
    var fa8;
    var t12;
    var t13;
    var div2;
    var fa9;
    var t14;
    var t15;
    var div3;
    var fa10;
    var t16;
    var t17;
    var div4;
    var fa11;
    var t18;
    var t19;
    var div5;
    var fa12;
    var t20;
    var t21;
    var docscode1;
    var t22;
    var docstitle3;
    var t23;
    var div7;
    var fa13;
    var t24;
    var fa14;
    var t25;
    var t26;
    var docscode2;
    var current;
    docstitle0 = new DocsTitle({
      props: {
        title: "Additional Styling"
      }
    });
    docstitle1 = new DocsTitle({
      props: {
        title: "Icon Sizes",
        level: 3
      }
    });
    fa0 = new Fa$1({
      props: {
        icon: faFlag,
        size: "xs"
      }
    });
    fa1 = new Fa$1({
      props: {
        icon: faFlag,
        size: "sm"
      }
    });
    fa2 = new Fa$1({
      props: {
        icon: faFlag,
        size: "lg"
      }
    });
    fa3 = new Fa$1({
      props: {
        icon: faFlag,
        size: "2x"
      }
    });
    fa4 = new Fa$1({
      props: {
        icon: faFlag,
        size: "2.5x"
      }
    });
    fa5 = new Fa$1({
      props: {
        icon: faFlag,
        size: "5x"
      }
    });
    fa6 = new Fa$1({
      props: {
        icon: faFlag,
        size: "7x"
      }
    });
    fa7 = new Fa$1({
      props: {
        icon: faFlag,
        size: "10x"
      }
    });
    docscode0 = new DocsCode({
      props: {
        code: codes$1.additionalStyling[0]
      }
    });
    docstitle2 = new DocsTitle({
      props: {
        title: "Fixed Width Icons",
        level: 3
      }
    });
    fa8 = new Fa$1({
      props: {
        icon: faHome,
        fw: true,
        style: "background: mistyrose"
      }
    });
    fa9 = new Fa$1({
      props: {
        icon: faInfo,
        fw: true,
        style: "background: mistyrose"
      }
    });
    fa10 = new Fa$1({
      props: {
        icon: faBook,
        fw: true,
        style: "background: mistyrose"
      }
    });
    fa11 = new Fa$1({
      props: {
        icon: faPencilAlt,
        fw: true,
        style: "background: mistyrose"
      }
    });
    fa12 = new Fa$1({
      props: {
        icon: faCog,
        fw: true,
        style: "background: mistyrose"
      }
    });
    docscode1 = new DocsCode({
      props: {
        code: codes$1.additionalStyling[1]
      }
    });
    docstitle3 = new DocsTitle({
      props: {
        title: "Pulled Icons",
        level: 3
      }
    });
    fa13 = new Fa$1({
      props: {
        icon: faQuoteLeft,
        pull: "left",
        size: "2x"
      }
    });
    fa14 = new Fa$1({
      props: {
        icon: faQuoteRight,
        pull: "right",
        size: "2x"
      }
    });
    docscode2 = new DocsCode({
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
      init(_assertThisInitialized(_this), options, null, create_fragment$b, safe_not_equal, {});
      return _this;
    }
    return Additional_styling;
  }(SvelteComponent);
  var AdditionalStyling = Additional_styling;

  function create_fragment$a(ctx) {
    var docstitle;
    var t0;
    var div;
    var fa0;
    var t1;
    var fa1;
    var t2;
    var fa2;
    var t3;
    var fa3;
    var t4;
    var fa4;
    var t5;
    var fa5;
    var t6;
    var docscode;
    var current;
    docstitle = new DocsTitle({
      props: {
        title: "Animating Icons"
      }
    });
    fa0 = new Fa$1({
      props: {
        icon: faSpinner,
        size: "3x",
        spin: true
      }
    });
    fa1 = new Fa$1({
      props: {
        icon: faCircleNotch,
        size: "3x",
        spin: true
      }
    });
    fa2 = new Fa$1({
      props: {
        icon: faSync,
        size: "3x",
        spin: true
      }
    });
    fa3 = new Fa$1({
      props: {
        icon: faCog,
        size: "3x",
        spin: true
      }
    });
    fa4 = new Fa$1({
      props: {
        icon: faSpinner,
        size: "3x",
        pulse: true
      }
    });
    fa5 = new Fa$1({
      props: {
        icon: faStroopwafel,
        size: "3x",
        spin: true
      }
    });
    docscode = new DocsCode({
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
      init(_assertThisInitialized(_this), options, null, create_fragment$a, safe_not_equal, {});
      return _this;
    }
    return Animating_icons;
  }(SvelteComponent);
  var AnimatingIcons = Animating_icons;

  function create_fragment$9(ctx) {
    var docstitle;
    var t0;
    var div0;
    var fa0;
    var t1;
    var t2;
    var docscode0;
    var t3;
    var div1;
    var t9;
    var div3;
    var div2;
    var fa1;
    var t10;
    var docscode1;
    var current;
    docstitle = new DocsTitle({
      props: {
        title: "Basic Use"
      }
    });
    fa0 = new Fa$1({
      props: {
        icon: faFlag
      }
    });
    docscode0 = new DocsCode({
      props: {
        code: codes$1.basicUse[0]
      }
    });
    fa1 = new Fa$1({
      props: {
        icon: faFlag
      }
    });
    docscode1 = new DocsCode({
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
        div1.innerHTML = "Icons import from <a href=\"https://www.npmjs.com/search?q=%40fortawesome%20svg%20icons\" target=\"_blank\">FontAwesome packages</a>, for example: @fortawesome/free-solid-svg-icons.\n  <br/>\n  Icons gallery:\n  <a href=\"https://fontawesome.com/icons\" target=\"_blank\">FontAwesome icons</a>";
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
      init(_assertThisInitialized(_this), options, null, create_fragment$9, safe_not_equal, {});
      return _this;
    }
    return Basic_use;
  }(SvelteComponent);
  var BasicUse = Basic_use;

  function add_css$1(target) {
    append_styles(target, "svelte-tdv3q3", "img.svelte-tdv3q3{max-width:100%;max-height:48px}small.svelte-tdv3q3{position:absolute;right:1rem;bottom:.1rem;color:#ddd;z-index:-1}");
  }
  function create_fragment$8(ctx) {
    var div;
    var img;
    var t0;
    var small;
    var img_levels = [/*$$props*/ctx[0]];
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
        set_attributes(img, img_data = get_spread_update(img_levels, [dirty & /*$$props*/1 && /*$$props*/ctx[0]]));
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
      init(_assertThisInitialized(_this), options, instance$2, create_fragment$8, safe_not_equal, {}, add_css$1);
      return _this;
    }
    return Docs_img;
  }(SvelteComponent);
  var DocsImg = Docs_img;

  function create_fragment$7(ctx) {
    var docstitle0;
    var t0;
    var docstitle1;
    var t1;
    var docsimg0;
    var t2;
    var docscode0;
    var t3;
    var docscode1;
    var t4;
    var docstitle2;
    var t5;
    var docsimg1;
    var t6;
    var docscode2;
    var t7;
    var docstitle3;
    var t8;
    var docsimg2;
    var t9;
    var docscode3;
    var t10;
    var docsimg3;
    var t11;
    var docscode4;
    var t12;
    var docstitle4;
    var t13;
    var docsimg4;
    var t14;
    var docscode5;
    var t15;
    var docstitle5;
    var t16;
    var docsimg5;
    var t17;
    var docscode6;
    var t18;
    var docsimg6;
    var t19;
    var docscode7;
    var t20;
    var docsimg7;
    var t21;
    var docscode8;
    var t22;
    var docscode9;
    var current;
    docstitle0 = new DocsTitle({
      props: {
        title: "Duotone Icons"
      }
    });
    docstitle1 = new DocsTitle({
      props: {
        title: "Basic Use",
        level: 3
      }
    });
    docsimg0 = new DocsImg({
      props: {
        src: "assets/duotone-0.png",
        alt: "duotone icons basic use"
      }
    });
    docscode0 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[0],
        lang: "js"
      }
    });
    docscode1 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[1]
      }
    });
    docstitle2 = new DocsTitle({
      props: {
        title: "Swapping Layer Opacity",
        level: 3
      }
    });
    docsimg1 = new DocsImg({
      props: {
        src: "assets/duotone-1.png",
        alt: "swapping duotone icons layer opacity"
      }
    });
    docscode2 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[2]
      }
    });
    docstitle3 = new DocsTitle({
      props: {
        title: "Changing Opacity",
        level: 3
      }
    });
    docsimg2 = new DocsImg({
      props: {
        src: "assets/duotone-2.png",
        alt: "changing duotone icons opacity"
      }
    });
    docscode3 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[3]
      }
    });
    docsimg3 = new DocsImg({
      props: {
        src: "assets/duotone-3.png",
        alt: "changing duotone icons opacity"
      }
    });
    docscode4 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[4]
      }
    });
    docstitle4 = new DocsTitle({
      props: {
        title: "Coloring Duotone Icons",
        level: 3
      }
    });
    docsimg4 = new DocsImg({
      props: {
        src: "assets/duotone-4.png",
        alt: "coloring duotone icons"
      }
    });
    docscode5 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[5]
      }
    });
    docstitle5 = new DocsTitle({
      props: {
        title: "Advanced Use",
        level: 3
      }
    });
    docsimg5 = new DocsImg({
      props: {
        src: "assets/duotone-5.png",
        alt: "duotone icons advanced use"
      }
    });
    docscode6 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[6]
      }
    });
    docsimg6 = new DocsImg({
      props: {
        src: "assets/duotone-6.png",
        alt: "duotone icons advanced use"
      }
    });
    docscode7 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[7]
      }
    });
    docsimg7 = new DocsImg({
      props: {
        src: "assets/duotone-7.png",
        alt: "duotone icons advanced use"
      }
    });
    docscode8 = new DocsCode({
      props: {
        code: codes$1.duotoneIcons[8],
        lang: "js"
      }
    });
    docscode9 = new DocsCode({
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
      init(_assertThisInitialized(_this), options, null, create_fragment$7, safe_not_equal, {});
      return _this;
    }
    return Duotone_icons;
  }(SvelteComponent);
  var DuotoneIcons = Duotone_icons;

  function create_fragment$6(ctx) {
    var docstitle;
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
    var t19;
    var docscode3;
    var t20;
    var div3;
    var t22;
    var docscode4;
    var current;
    docstitle = new DocsTitle({
      props: {
        title: "Installation"
      }
    });
    docscode0 = new DocsCode({
      props: {
        code: codes$1.installation[0]
      }
    });
    docscode1 = new DocsCode({
      props: {
        code: codes$1.installation[1]
      }
    });
    docscode2 = new DocsCode({
      props: {
        code: codes$1.installation[2]
      }
    });
    docscode3 = new DocsCode({
      props: {
        code: codes$1.installation[3],
        lang: "js"
      }
    });
    docscode4 = new DocsCode({
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
        div2.innerHTML = "<strong>Notice for <a href=\"https://kit.svelte.dev/\" target=\"_blank\">SvelteKit</a>/<a href=\"https://www.npmjs.com/package/vite\" target=\"_blank\">Vite</a> user:</strong> You may need to import the component explicitly as below:";
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
      init(_assertThisInitialized(_this), options, null, create_fragment$6, safe_not_equal, {});
      return _this;
    }
    return Installation;
  }(SvelteComponent);
  var Installation$1 = Installation;

  function add_css(target) {
    append_styles(target, "svelte-66hu08", ".svelte-fa-layers.svelte-66hu08{display:inline-block;position:relative}.svelte-fa-layers.svelte-66hu08 .svelte-fa{position:absolute;bottom:0;left:0;right:0;top:0;margin:auto;text-align:center}.svelte-fa-layers.svelte-66hu08 .svelte-fa-layers-text{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%)}.svelte-fa-layers.svelte-66hu08 .svelte-fa-layers-text span{display:inline-block}");
  }
  function create_fragment$5(ctx) {
    var span;
    var span_class_value;
    var current;
    var default_slot_template = /*#slots*/ctx[7].default;
    var default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ctx[6], null);
    return {
      c: function c() {
        span = element("span");
        if (default_slot) default_slot.c();
        attr(span, "id", /*id*/ctx[1]);
        attr(span, "class", span_class_value = "svelte-fa-layers " + /*clazz*/ctx[0] + " svelte-66hu08");
        attr(span, "style", /*s*/ctx[2]);
      },
      m: function m(target, anchor) {
        insert(target, span, anchor);
        if (default_slot) {
          default_slot.m(span, null);
        }
        current = true;
      },
      p: function p(ctx, _ref) {
        var dirty = _ref[0];
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/64)) {
            update_slot_base(default_slot, default_slot_template, ctx, /*$$scope*/ctx[6], !current ? get_all_dirty_from_scope( /*$$scope*/ctx[6]) : get_slot_changes(default_slot_template, /*$$scope*/ctx[6], dirty, null), null);
          }
        }
        if (!current || dirty & /*id*/2) {
          attr(span, "id", /*id*/ctx[1]);
        }
        if (!current || dirty & /*clazz*/1 && span_class_value !== (span_class_value = "svelte-fa-layers " + /*clazz*/ctx[0] + " svelte-66hu08")) {
          attr(span, "class", span_class_value);
        }
        if (!current || dirty & /*s*/4) {
          attr(span, "style", /*s*/ctx[2]);
        }
      },
      i: function i(local) {
        if (current) return;
        transition_in(default_slot, local);
        current = true;
      },
      o: function o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) detach(span);
        if (default_slot) default_slot.d(detaching);
      }
    };
  }
  function instance$1($$self, $$props, $$invalidate) {
    var _$$props$$$slots = $$props.$$slots,
      slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;
    var _$$props$class = $$props.class,
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
    var _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
    var _$$props$style = $$props.style,
      style = _$$props$style === void 0 ? '' : _$$props$style;
    var _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size;
    var _$$props$pull = $$props.pull,
      pull = _$$props$pull === void 0 ? '' : _$$props$pull;
    var s;
    $$self.$$set = function ($$props) {
      if ('class' in $$props) $$invalidate(0, clazz = $$props.class);
      if ('id' in $$props) $$invalidate(1, id = $$props.id);
      if ('style' in $$props) $$invalidate(3, style = $$props.style);
      if ('size' in $$props) $$invalidate(4, size = $$props.size);
      if ('pull' in $$props) $$invalidate(5, pull = $$props.pull);
      if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    };
    $$self.$$.update = function () {
      if ($$self.$$.dirty & /*style, size, pull*/56) {
        $$invalidate(2, s = getStyles(style, size, pull, true));
      }
    };
    return [clazz, id, s, style, size, pull, $$scope, slots];
  }
  var Fa_layers = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Fa_layers, _SvelteComponent);
    function Fa_layers(options) {
      var _this;
      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance$1, create_fragment$5, safe_not_equal, {
        class: 0,
        id: 1,
        style: 3,
        size: 4,
        pull: 5
      }, add_css);
      return _this;
    }
    return Fa_layers;
  }(SvelteComponent);
  var FaLayers = Fa_layers;

  function create_fragment$4(ctx) {
    var span1;
    var span0;
    var span1_class_value;
    var current;
    var default_slot_template = /*#slots*/ctx[12].default;
    var default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ctx[11], null);
    return {
      c: function c() {
        span1 = element("span");
        span0 = element("span");
        if (default_slot) default_slot.c();
        attr(span0, "style", /*s*/ctx[2]);
        attr(span1, "id", /*id*/ctx[1]);
        attr(span1, "class", span1_class_value = "svelte-fa-layers-text " + /*clazz*/ctx[0]);
      },
      m: function m(target, anchor) {
        insert(target, span1, anchor);
        append(span1, span0);
        if (default_slot) {
          default_slot.m(span0, null);
        }
        current = true;
      },
      p: function p(ctx, _ref) {
        var dirty = _ref[0];
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/2048)) {
            update_slot_base(default_slot, default_slot_template, ctx, /*$$scope*/ctx[11], !current ? get_all_dirty_from_scope( /*$$scope*/ctx[11]) : get_slot_changes(default_slot_template, /*$$scope*/ctx[11], dirty, null), null);
          }
        }
        if (!current || dirty & /*s*/4) {
          attr(span0, "style", /*s*/ctx[2]);
        }
        if (!current || dirty & /*id*/2) {
          attr(span1, "id", /*id*/ctx[1]);
        }
        if (!current || dirty & /*clazz*/1 && span1_class_value !== (span1_class_value = "svelte-fa-layers-text " + /*clazz*/ctx[0])) {
          attr(span1, "class", span1_class_value);
        }
      },
      i: function i(local) {
        if (current) return;
        transition_in(default_slot, local);
        current = true;
      },
      o: function o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d: function d(detaching) {
        if (detaching) detach(span1);
        if (default_slot) default_slot.d(detaching);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    var _$$props$$$slots = $$props.$$slots,
      slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;
    var _$$props$class = $$props.class,
      clazz = _$$props$class === void 0 ? '' : _$$props$class;
    var _$$props$id = $$props.id,
      id = _$$props$id === void 0 ? '' : _$$props$id;
    var _$$props$style = $$props.style,
      style = _$$props$style === void 0 ? '' : _$$props$style;
    var _$$props$size = $$props.size,
      size = _$$props$size === void 0 ? '' : _$$props$size;
    var _$$props$color = $$props.color,
      color = _$$props$color === void 0 ? '' : _$$props$color;
    var _$$props$scale = $$props.scale,
      scale = _$$props$scale === void 0 ? 1 : _$$props$scale;
    var _$$props$translateX = $$props.translateX,
      translateX = _$$props$translateX === void 0 ? 0 : _$$props$translateX;
    var _$$props$translateY = $$props.translateY,
      translateY = _$$props$translateY === void 0 ? 0 : _$$props$translateY;
    var _$$props$rotate = $$props.rotate,
      rotate = _$$props$rotate === void 0 ? '' : _$$props$rotate;
    var _$$props$flip = $$props.flip,
      flip = _$$props$flip === void 0 ? false : _$$props$flip;
    var s;
    $$self.$$set = function ($$props) {
      if ('class' in $$props) $$invalidate(0, clazz = $$props.class);
      if ('id' in $$props) $$invalidate(1, id = $$props.id);
      if ('style' in $$props) $$invalidate(3, style = $$props.style);
      if ('size' in $$props) $$invalidate(4, size = $$props.size);
      if ('color' in $$props) $$invalidate(5, color = $$props.color);
      if ('scale' in $$props) $$invalidate(6, scale = $$props.scale);
      if ('translateX' in $$props) $$invalidate(7, translateX = $$props.translateX);
      if ('translateY' in $$props) $$invalidate(8, translateY = $$props.translateY);
      if ('rotate' in $$props) $$invalidate(9, rotate = $$props.rotate);
      if ('flip' in $$props) $$invalidate(10, flip = $$props.flip);
      if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    };
    $$self.$$.update = function () {
      if ($$self.$$.dirty & /*color, scale, translateX, translateY, rotate, flip, style, size*/2040) {
        $$invalidate(2, s = getStyles(joinCss([joinCss({
          color: color,
          display: 'inline-block',
          height: 'auto',
          transform: getTransform(scale, translateX, translateY, rotate, flip, undefined, 'em', 'deg')
        }), style]), size));
      }
    };
    return [clazz, id, s, style, size, color, scale, translateX, translateY, rotate, flip, $$scope, slots];
  }
  var Fa_layers_text = /*#__PURE__*/function (_SvelteComponent) {
    _inheritsLoose(Fa_layers_text, _SvelteComponent);
    function Fa_layers_text(options) {
      var _this;
      _this = _SvelteComponent.call(this) || this;
      init(_assertThisInitialized(_this), options, instance, create_fragment$4, safe_not_equal, {
        class: 0,
        id: 1,
        style: 3,
        size: 4,
        color: 5,
        scale: 6,
        translateX: 7,
        translateY: 8,
        rotate: 9,
        flip: 10
      });
      return _this;
    }
    return Fa_layers_text;
  }(SvelteComponent);
  var FaLayersText = Fa_layers_text;

  function create_default_slot_8(ctx) {
    var fa0;
    var t;
    var fa1;
    var current;
    fa0 = new Fa$1({
      props: {
        icon: faCircle,
        color: "tomato"
      }
    });
    fa1 = new Fa$1({
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
  }

  // (31:2) <FaLayers size="4x" style="background: mistyrose">
  function create_default_slot_7(ctx) {
    var fa0;
    var t;
    var fa1;
    var current;
    fa0 = new Fa$1({
      props: {
        icon: faBookmark
      }
    });
    fa1 = new Fa$1({
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
  }

  // (35:2) <FaLayers size="4x" style="background: mistyrose">
  function create_default_slot_6(ctx) {
    var fa0;
    var t0;
    var fa1;
    var t1;
    var fa2;
    var t2;
    var fa3;
    var current;
    fa0 = new Fa$1({
      props: {
        icon: faPlay,
        scale: 1.2,
        rotate: -90
      }
    });
    fa1 = new Fa$1({
      props: {
        icon: faSun,
        scale: 0.35,
        translateY: -0.2,
        color: "white"
      }
    });
    fa2 = new Fa$1({
      props: {
        icon: faMoon,
        scale: 0.3,
        translateX: -0.25,
        translateY: 0.25,
        color: "white"
      }
    });
    fa3 = new Fa$1({
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
  }

  // (55:4) <FaLayersText       scale={0.45}       translateY={0.1}       color="white"       style="font-weight: 900"     >
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
  }

  // (53:2) <FaLayers size="4x" style="background: mistyrose">
  function create_default_slot_4(ctx) {
    var fa;
    var t;
    var falayerstext;
    var current;
    fa = new Fa$1({
      props: {
        icon: faCalendar
      }
    });
    falayerstext = new FaLayersText({
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
        if (dirty & /*$$scope*/1) {
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

  // (66:4) <FaLayersText       scale={0.25}       rotate={-30}       color="white"       style="font-weight: 900"     >
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
  }

  // (64:2) <FaLayers size="4x" style="background: mistyrose">
  function create_default_slot_2(ctx) {
    var fa;
    var t;
    var falayerstext;
    var current;
    fa = new Fa$1({
      props: {
        icon: faCertificate
      }
    });
    falayerstext = new FaLayersText({
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
        if (dirty & /*$$scope*/1) {
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

  // (77:4) <FaLayersText       scale={0.2}       translateX={0.4}       translateY={-0.4}       color="white"       style="padding: 0 .2em; background: tomato; border-radius: 1em"     >
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
  }

  // (75:2) <FaLayers size="4x" style="background: mistyrose">
  function create_default_slot(ctx) {
    var fa;
    var t;
    var falayerstext;
    var current;
    fa = new Fa$1({
      props: {
        icon: faEnvelope
      }
    });
    falayerstext = new FaLayersText({
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
        if (dirty & /*$$scope*/1) {
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
    var docstitle;
    var t0;
    var div;
    var falayers0;
    var t1;
    var falayers1;
    var t2;
    var falayers2;
    var t3;
    var falayers3;
    var t4;
    var falayers4;
    var t5;
    var falayers5;
    var t6;
    var docscode0;
    var t7;
    var docscode1;
    var current;
    docstitle = new DocsTitle({
      props: {
        title: "Layering & Text"
      }
    });
    falayers0 = new FaLayers({
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
    falayers1 = new FaLayers({
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
    falayers2 = new FaLayers({
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
    falayers3 = new FaLayers({
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
    falayers4 = new FaLayers({
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
    falayers5 = new FaLayers({
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
    docscode0 = new DocsCode({
      props: {
        code: codes$1.layering[0],
        lang: "js"
      }
    });
    docscode1 = new DocsCode({
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
        if (dirty & /*$$scope*/1) {
          falayers0_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }
        falayers0.$set(falayers0_changes);
        var falayers1_changes = {};
        if (dirty & /*$$scope*/1) {
          falayers1_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }
        falayers1.$set(falayers1_changes);
        var falayers2_changes = {};
        if (dirty & /*$$scope*/1) {
          falayers2_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }
        falayers2.$set(falayers2_changes);
        var falayers3_changes = {};
        if (dirty & /*$$scope*/1) {
          falayers3_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }
        falayers3.$set(falayers3_changes);
        var falayers4_changes = {};
        if (dirty & /*$$scope*/1) {
          falayers4_changes.$$scope = {
            dirty: dirty,
            ctx: ctx
          };
        }
        falayers4.$set(falayers4_changes);
        var falayers5_changes = {};
        if (dirty & /*$$scope*/1) {
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
    var docstitle0;
    var t0;
    var docstitle1;
    var t1;
    var div0;
    var fa0;
    var t2;
    var fa1;
    var t3;
    var fa2;
    var t4;
    var docscode0;
    var t5;
    var docstitle2;
    var t6;
    var div1;
    var fa3;
    var t7;
    var fa4;
    var t8;
    var fa5;
    var t9;
    var fa6;
    var t10;
    var fa7;
    var t11;
    var docscode1;
    var t12;
    var docstitle3;
    var t13;
    var div2;
    var fa8;
    var t14;
    var fa9;
    var t15;
    var fa10;
    var t16;
    var fa11;
    var t17;
    var fa12;
    var t18;
    var fa13;
    var t19;
    var fa14;
    var t20;
    var fa15;
    var t21;
    var fa16;
    var t22;
    var docscode2;
    var current;
    docstitle0 = new DocsTitle({
      props: {
        title: "Power Transforms"
      }
    });
    docstitle1 = new DocsTitle({
      props: {
        title: "Scaling",
        level: 3
      }
    });
    fa0 = new Fa$1({
      props: {
        icon: faSeedling,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa1 = new Fa$1({
      props: {
        icon: faSeedling,
        scale: 0.5,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa2 = new Fa$1({
      props: {
        icon: faSeedling,
        scale: 1.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    docscode0 = new DocsCode({
      props: {
        code: codes$1.powerTransforms[0]
      }
    });
    docstitle2 = new DocsTitle({
      props: {
        title: "Positioning",
        level: 3
      }
    });
    fa3 = new Fa$1({
      props: {
        icon: faSeedling,
        scale: 0.5,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa4 = new Fa$1({
      props: {
        icon: faSeedling,
        scale: 0.5,
        translateX: 0.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa5 = new Fa$1({
      props: {
        icon: faSeedling,
        scale: 0.5,
        translateX: -0.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa6 = new Fa$1({
      props: {
        icon: faSeedling,
        scale: 0.5,
        translateY: 0.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa7 = new Fa$1({
      props: {
        icon: faSeedling,
        scale: 0.5,
        translateY: -0.2,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    docscode1 = new DocsCode({
      props: {
        code: codes$1.powerTransforms[1]
      }
    });
    docstitle3 = new DocsTitle({
      props: {
        title: "Rotating & Flipping",
        level: 3
      }
    });
    fa8 = new Fa$1({
      props: {
        icon: faSeedling,
        rotate: 90,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa9 = new Fa$1({
      props: {
        icon: faSeedling,
        rotate: 180,
        size: "4x",
        style: "background: mistyrose"
      }
    });
    fa10 = new Fa$1({
      props: {
        icon: faSeedling,
        size: "4x",
        rotate: "270",
        style: "background: mistyrose"
      }
    });
    fa11 = new Fa$1({
      props: {
        icon: faSeedling,
        size: "4x",
        rotate: "30",
        style: "background: mistyrose"
      }
    });
    fa12 = new Fa$1({
      props: {
        icon: faSeedling,
        size: "4x",
        rotate: "-30",
        style: "background: mistyrose"
      }
    });
    fa13 = new Fa$1({
      props: {
        icon: faSeedling,
        size: "4x",
        flip: "vertical",
        style: "background: mistyrose"
      }
    });
    fa14 = new Fa$1({
      props: {
        icon: faSeedling,
        size: "4x",
        flip: "horizontal",
        style: "background: mistyrose"
      }
    });
    fa15 = new Fa$1({
      props: {
        icon: faSeedling,
        size: "4x",
        flip: "both",
        style: "background: mistyrose"
      }
    });
    fa16 = new Fa$1({
      props: {
        icon: faSeedling,
        size: "4x",
        flip: "both",
        rotate: "30",
        style: "background: mistyrose"
      }
    });
    docscode2 = new DocsCode({
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
    var installation;
    var t0;
    var basicuse;
    var t1;
    var additionalstyling;
    var t2;
    var animatingicons;
    var t3;
    var powertransforms;
    var t4;
    var layeringandtext;
    var t5;
    var duotoneicons;
    var current;
    installation = new Installation$1({});
    basicuse = new BasicUse({});
    additionalstyling = new AdditionalStyling({});
    animatingicons = new AnimatingIcons({});
    powertransforms = new PowerTransforms({});
    layeringandtext = new LayeringAndText({});
    duotoneicons = new DuotoneIcons({});
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
    var showcase;
    var t;
    var docs;
    var current;
    showcase = new Showcase$1({});
    docs = new Docs$1({});
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

})();
