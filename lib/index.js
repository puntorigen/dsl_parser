(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.npmPackageES6DSLparser = factory());
}(this, (function () { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var runtime = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	!(function(global) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  var inModule = 'object' === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  runtime.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  runtime.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        if (delegate.iterator.return) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[toStringTagSymbol] = "Generator";

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined;
	      }

	      return ContinueSentinel;
	    }
	  };
	})(
	  // In sloppy mode, unbound `this` refers to the global object, fallback to
	  // Function constructor if we're in global strict mode. That is sadly a form
	  // of indirect eval which violates Content Security Policy.
	  (function() { return this })() || Function("return this")()
	);
	});

	var runtime$1 = /*#__PURE__*/Object.freeze({
		default: runtime,
		__moduleExports: runtime
	});

	var require$$0 = ( runtime$1 && runtime ) || runtime$1;

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	// This method of obtaining a reference to the global object needs to be
	// kept identical to the way it is obtained in runtime.js
	var g = (function() { return this })() || Function("return this")();

	// Use `getOwnPropertyNames` because not all browsers support calling
	// `hasOwnProperty` on the global `self` object in a worker. See #183.
	var hadRuntime = g.regeneratorRuntime &&
	  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

	// Save the old regeneratorRuntime in case it needs to be restored later.
	var oldRuntime = hadRuntime && g.regeneratorRuntime;

	// Force reevalutation of runtime.js.
	g.regeneratorRuntime = undefined;

	var runtimeModule = require$$0;

	if (hadRuntime) {
	  // Restore the original runtime.
	  g.regeneratorRuntime = oldRuntime;
	} else {
	  // Remove the global property added by runtime.js.
	  try {
	    delete g.regeneratorRuntime;
	  } catch(e) {
	    g.regeneratorRuntime = undefined;
	  }
	}

	var runtimeModule$1 = /*#__PURE__*/Object.freeze({
		default: runtimeModule,
		__moduleExports: runtimeModule
	});

	var require$$0$1 = ( runtimeModule$1 && runtimeModule ) || runtimeModule$1;

	var regenerator = require$$0$1;

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	var _toInteger$1 = /*#__PURE__*/Object.freeze({
		default: _toInteger,
		__moduleExports: _toInteger
	});

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	var _defined$1 = /*#__PURE__*/Object.freeze({
		default: _defined,
		__moduleExports: _defined
	});

	var toInteger = ( _toInteger$1 && _toInteger ) || _toInteger$1;

	var defined = ( _defined$1 && _defined ) || _defined$1;

	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that));
	    var i = toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var _stringAt$1 = /*#__PURE__*/Object.freeze({
		default: _stringAt,
		__moduleExports: _stringAt
	});

	var _library = true;

	var _library$1 = /*#__PURE__*/Object.freeze({
		default: _library,
		__moduleExports: _library
	});

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _global$1 = /*#__PURE__*/Object.freeze({
		default: _global,
		__moduleExports: _global
	});

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.5.5' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _core$1 = /*#__PURE__*/Object.freeze({
		default: _core,
		__moduleExports: _core,
		version: _core_1
	});

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	var _aFunction$1 = /*#__PURE__*/Object.freeze({
		default: _aFunction,
		__moduleExports: _aFunction
	});

	var aFunction = ( _aFunction$1 && _aFunction ) || _aFunction$1;

	// optional / simple context binding

	var _ctx = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var _ctx$1 = /*#__PURE__*/Object.freeze({
		default: _ctx,
		__moduleExports: _ctx
	});

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _isObject$1 = /*#__PURE__*/Object.freeze({
		default: _isObject,
		__moduleExports: _isObject
	});

	var isObject = ( _isObject$1 && _isObject ) || _isObject$1;

	var _anObject = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _anObject$1 = /*#__PURE__*/Object.freeze({
		default: _anObject,
		__moduleExports: _anObject
	});

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	var _fails$1 = /*#__PURE__*/Object.freeze({
		default: _fails,
		__moduleExports: _fails
	});

	var require$$1 = ( _fails$1 && _fails ) || _fails$1;

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !require$$1(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var _descriptors$1 = /*#__PURE__*/Object.freeze({
		default: _descriptors,
		__moduleExports: _descriptors
	});

	var require$$0$2 = ( _global$1 && _global ) || _global$1;

	var document$1 = require$$0$2.document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document$1) && isObject(document$1.createElement);
	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _domCreate$1 = /*#__PURE__*/Object.freeze({
		default: _domCreate,
		__moduleExports: _domCreate
	});

	var require$$0$3 = ( _descriptors$1 && _descriptors ) || _descriptors$1;

	var require$$1$1 = ( _domCreate$1 && _domCreate ) || _domCreate$1;

	var _ie8DomDefine = !require$$0$3 && !require$$1(function () {
	  return Object.defineProperty(require$$1$1('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	var _ie8DomDefine$1 = /*#__PURE__*/Object.freeze({
		default: _ie8DomDefine,
		__moduleExports: _ie8DomDefine
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var _toPrimitive$1 = /*#__PURE__*/Object.freeze({
		default: _toPrimitive,
		__moduleExports: _toPrimitive
	});

	var anObject = ( _anObject$1 && _anObject ) || _anObject$1;

	var IE8_DOM_DEFINE = ( _ie8DomDefine$1 && _ie8DomDefine ) || _ie8DomDefine$1;

	var toPrimitive = ( _toPrimitive$1 && _toPrimitive ) || _toPrimitive$1;

	var dP = Object.defineProperty;

	var f = require$$0$3 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _objectDp$1 = /*#__PURE__*/Object.freeze({
		default: _objectDp,
		__moduleExports: _objectDp,
		f: f
	});

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _propertyDesc$1 = /*#__PURE__*/Object.freeze({
		default: _propertyDesc,
		__moduleExports: _propertyDesc
	});

	var dP$1 = ( _objectDp$1 && _objectDp ) || _objectDp$1;

	var descriptor = ( _propertyDesc$1 && _propertyDesc ) || _propertyDesc$1;

	var _hide = require$$0$3 ? function (object, key, value) {
	  return dP$1.f(object, key, descriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var _hide$1 = /*#__PURE__*/Object.freeze({
		default: _hide,
		__moduleExports: _hide
	});

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var _has$1 = /*#__PURE__*/Object.freeze({
		default: _has,
		__moduleExports: _has
	});

	var require$$1$2 = ( _core$1 && _core ) || _core$1;

	var ctx = ( _ctx$1 && _ctx ) || _ctx$1;

	var require$$0$4 = ( _hide$1 && _hide ) || _hide$1;

	var has = ( _has$1 && _has ) || _has$1;

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? require$$1$2 : require$$1$2[name] || (require$$1$2[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? require$$0$2 : IS_STATIC ? require$$0$2[name] : (require$$0$2[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && has(exports, key)) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, require$$0$2)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) require$$0$4(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	var _export$1 = /*#__PURE__*/Object.freeze({
		default: _export,
		__moduleExports: _export
	});

	var _redefine = require$$0$4;

	var _redefine$1 = /*#__PURE__*/Object.freeze({
		default: _redefine,
		__moduleExports: _redefine
	});

	var _iterators = {};

	var _iterators$1 = /*#__PURE__*/Object.freeze({
		default: _iterators,
		__moduleExports: _iterators
	});

	var toString = {}.toString;

	var _cof = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var _cof$1 = /*#__PURE__*/Object.freeze({
		default: _cof,
		__moduleExports: _cof
	});

	var cof = ( _cof$1 && _cof ) || _cof$1;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	// eslint-disable-next-line no-prototype-builtins
	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

	var _iobject$1 = /*#__PURE__*/Object.freeze({
		default: _iobject,
		__moduleExports: _iobject
	});

	var IObject = ( _iobject$1 && _iobject ) || _iobject$1;

	// to indexed object, toObject with fallback for non-array-like ES3 strings


	var _toIobject = function (it) {
	  return IObject(defined(it));
	};

	var _toIobject$1 = /*#__PURE__*/Object.freeze({
		default: _toIobject,
		__moduleExports: _toIobject
	});

	// 7.1.15 ToLength

	var min = Math.min;
	var _toLength = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var _toLength$1 = /*#__PURE__*/Object.freeze({
		default: _toLength,
		__moduleExports: _toLength
	});

	var max = Math.max;
	var min$1 = Math.min;
	var _toAbsoluteIndex = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	var _toAbsoluteIndex$1 = /*#__PURE__*/Object.freeze({
		default: _toAbsoluteIndex,
		__moduleExports: _toAbsoluteIndex
	});

	var toIObject = ( _toIobject$1 && _toIobject ) || _toIobject$1;

	var toLength = ( _toLength$1 && _toLength ) || _toLength$1;

	var toAbsoluteIndex = ( _toAbsoluteIndex$1 && _toAbsoluteIndex ) || _toAbsoluteIndex$1;

	// false -> Array#indexOf
	// true  -> Array#includes



	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var _arrayIncludes$1 = /*#__PURE__*/Object.freeze({
		default: _arrayIncludes,
		__moduleExports: _arrayIncludes
	});

	var SHARED = '__core-js_shared__';
	var store = require$$0$2[SHARED] || (require$$0$2[SHARED] = {});
	var _shared = function (key) {
	  return store[key] || (store[key] = {});
	};

	var _shared$1 = /*#__PURE__*/Object.freeze({
		default: _shared,
		__moduleExports: _shared
	});

	var id = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _uid$1 = /*#__PURE__*/Object.freeze({
		default: _uid,
		__moduleExports: _uid
	});

	var require$$0$5 = ( _shared$1 && _shared ) || _shared$1;

	var uid = ( _uid$1 && _uid ) || _uid$1;

	var shared = require$$0$5('keys');

	var _sharedKey = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};

	var _sharedKey$1 = /*#__PURE__*/Object.freeze({
		default: _sharedKey,
		__moduleExports: _sharedKey
	});

	var require$$0$6 = ( _arrayIncludes$1 && _arrayIncludes ) || _arrayIncludes$1;

	var require$$1$3 = ( _sharedKey$1 && _sharedKey ) || _sharedKey$1;

	var arrayIndexOf = require$$0$6(false);
	var IE_PROTO = require$$1$3('IE_PROTO');

	var _objectKeysInternal = function (object, names) {
	  var O = toIObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	var _objectKeysInternal$1 = /*#__PURE__*/Object.freeze({
		default: _objectKeysInternal,
		__moduleExports: _objectKeysInternal
	});

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	var _enumBugKeys$1 = /*#__PURE__*/Object.freeze({
		default: _enumBugKeys,
		__moduleExports: _enumBugKeys
	});

	var $keys = ( _objectKeysInternal$1 && _objectKeysInternal ) || _objectKeysInternal$1;

	var enumBugKeys = ( _enumBugKeys$1 && _enumBugKeys ) || _enumBugKeys$1;

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)



	var _objectKeys = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};

	var _objectKeys$1 = /*#__PURE__*/Object.freeze({
		default: _objectKeys,
		__moduleExports: _objectKeys
	});

	var getKeys = ( _objectKeys$1 && _objectKeys ) || _objectKeys$1;

	var _objectDps = require$$0$3 ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP$1.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var _objectDps$1 = /*#__PURE__*/Object.freeze({
		default: _objectDps,
		__moduleExports: _objectDps
	});

	var document$2 = require$$0$2.document;
	var _html = document$2 && document$2.documentElement;

	var _html$1 = /*#__PURE__*/Object.freeze({
		default: _html,
		__moduleExports: _html
	});

	var dPs = ( _objectDps$1 && _objectDps ) || _objectDps$1;

	var require$$2 = ( _html$1 && _html ) || _html$1;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



	var IE_PROTO$1 = require$$1$3('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE$1 = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = require$$1$1('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  require$$2.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE$1][enumBugKeys[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE$1] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

	var _objectCreate$1 = /*#__PURE__*/Object.freeze({
		default: _objectCreate,
		__moduleExports: _objectCreate
	});

	var _wks = createCommonjsModule(function (module) {
	var store = require$$0$5('wks');

	var Symbol = require$$0$2.Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;
	});

	var _wks$1 = /*#__PURE__*/Object.freeze({
		default: _wks,
		__moduleExports: _wks
	});

	var require$$0$7 = ( _wks$1 && _wks ) || _wks$1;

	var def = dP$1.f;

	var TAG = require$$0$7('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

	var _setToStringTag$1 = /*#__PURE__*/Object.freeze({
		default: _setToStringTag,
		__moduleExports: _setToStringTag
	});

	var create = ( _objectCreate$1 && _objectCreate ) || _objectCreate$1;

	var setToStringTag = ( _setToStringTag$1 && _setToStringTag ) || _setToStringTag$1;

	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	require$$0$4(IteratorPrototype, require$$0$7('iterator'), function () { return this; });

	var _iterCreate = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

	var _iterCreate$1 = /*#__PURE__*/Object.freeze({
		default: _iterCreate,
		__moduleExports: _iterCreate
	});

	// 7.1.13 ToObject(argument)

	var _toObject = function (it) {
	  return Object(defined(it));
	};

	var _toObject$1 = /*#__PURE__*/Object.freeze({
		default: _toObject,
		__moduleExports: _toObject
	});

	var toObject = ( _toObject$1 && _toObject ) || _toObject$1;

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


	var IE_PROTO$2 = require$$1$3('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$2)) return O[IE_PROTO$2];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	var _objectGpo$1 = /*#__PURE__*/Object.freeze({
		default: _objectGpo,
		__moduleExports: _objectGpo
	});

	var LIBRARY = ( _library$1 && _library ) || _library$1;

	var $export$1 = ( _export$1 && _export ) || _export$1;

	var redefine = ( _redefine$1 && _redefine ) || _redefine$1;

	var Iterators = ( _iterators$1 && _iterators ) || _iterators$1;

	var $iterCreate = ( _iterCreate$1 && _iterCreate ) || _iterCreate$1;

	var getPrototypeOf = ( _objectGpo$1 && _objectGpo ) || _objectGpo$1;

	var ITERATOR = require$$0$7('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') require$$0$4(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    require$$0$4(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export$1($export$1.P + $export$1.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	var _iterDefine$1 = /*#__PURE__*/Object.freeze({
		default: _iterDefine,
		__moduleExports: _iterDefine
	});

	var require$$0$8 = ( _stringAt$1 && _stringAt ) || _stringAt$1;

	var require$$0$9 = ( _iterDefine$1 && _iterDefine ) || _iterDefine$1;

	var $at = require$$0$8(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	require$$0$9(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

	var _addToUnscopables = function () { /* empty */ };

	var _addToUnscopables$1 = /*#__PURE__*/Object.freeze({
		default: _addToUnscopables,
		__moduleExports: _addToUnscopables
	});

	var _iterStep = function (done, value) {
	  return { value: value, done: !!done };
	};

	var _iterStep$1 = /*#__PURE__*/Object.freeze({
		default: _iterStep,
		__moduleExports: _iterStep
	});

	var addToUnscopables = ( _addToUnscopables$1 && _addToUnscopables ) || _addToUnscopables$1;

	var step = ( _iterStep$1 && _iterStep ) || _iterStep$1;

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	var es6_array_iterator = require$$0$9(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var TO_STRING_TAG = require$$0$7('toStringTag');

	var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
	  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
	  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
	  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
	  'TextTrackList,TouchList').split(',');

	for (var i = 0; i < DOMIterables.length; i++) {
	  var NAME = DOMIterables[i];
	  var Collection = require$$0$2[NAME];
	  var proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) require$$0$4(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

	// getting tag from 19.1.3.6 Object.prototype.toString()

	var TAG$1 = require$$0$7('toStringTag');
	// ES3 wrong here
	var ARG = cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var _classof$1 = /*#__PURE__*/Object.freeze({
		default: _classof,
		__moduleExports: _classof
	});

	var _anInstance = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

	var _anInstance$1 = /*#__PURE__*/Object.freeze({
		default: _anInstance,
		__moduleExports: _anInstance
	});

	// call something on iterator step with safe closing on error

	var _iterCall = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject(ret.call(iterator));
	    throw e;
	  }
	};

	var _iterCall$1 = /*#__PURE__*/Object.freeze({
		default: _iterCall,
		__moduleExports: _iterCall
	});

	// check on default Array iterator

	var ITERATOR$1 = require$$0$7('iterator');
	var ArrayProto = Array.prototype;

	var _isArrayIter = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR$1] === it);
	};

	var _isArrayIter$1 = /*#__PURE__*/Object.freeze({
		default: _isArrayIter,
		__moduleExports: _isArrayIter
	});

	var classof = ( _classof$1 && _classof ) || _classof$1;

	var ITERATOR$2 = require$$0$7('iterator');

	var core_getIteratorMethod = require$$1$2.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$2]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

	var core_getIteratorMethod$1 = /*#__PURE__*/Object.freeze({
		default: core_getIteratorMethod,
		__moduleExports: core_getIteratorMethod
	});

	var call = ( _iterCall$1 && _iterCall ) || _iterCall$1;

	var isArrayIter = ( _isArrayIter$1 && _isArrayIter ) || _isArrayIter$1;

	var getIterFn = ( core_getIteratorMethod$1 && core_getIteratorMethod ) || core_getIteratorMethod$1;

	var _forOf = createCommonjsModule(function (module) {
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
	  var f = ctx(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = call(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;
	});

	var _forOf$1 = /*#__PURE__*/Object.freeze({
		default: _forOf,
		__moduleExports: _forOf
	});

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)


	var SPECIES = require$$0$7('species');
	var _speciesConstructor = function (O, D) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

	var _speciesConstructor$1 = /*#__PURE__*/Object.freeze({
		default: _speciesConstructor,
		__moduleExports: _speciesConstructor
	});

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	var _invoke = function (fn, args, that) {
	  var un = that === undefined;
	  switch (args.length) {
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return fn.apply(that, args);
	};

	var _invoke$1 = /*#__PURE__*/Object.freeze({
		default: _invoke,
		__moduleExports: _invoke
	});

	var invoke = ( _invoke$1 && _invoke ) || _invoke$1;

	var process = require$$0$2.process;
	var setTask = require$$0$2.setImmediate;
	var clearTask = require$$0$2.clearImmediate;
	var MessageChannel = require$$0$2.MessageChannel;
	var Dispatch = require$$0$2.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;
	var run = function () {
	  var id = +this;
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function (event) {
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (cof(process) == 'process') {
	    defer = function (id) {
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (require$$0$2.addEventListener && typeof postMessage == 'function' && !require$$0$2.importScripts) {
	    defer = function (id) {
	      require$$0$2.postMessage(id + '', '*');
	    };
	    require$$0$2.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in require$$1$1('script')) {
	    defer = function (id) {
	      require$$2.appendChild(require$$1$1('script'))[ONREADYSTATECHANGE] = function () {
	        require$$2.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	var _task = {
	  set: setTask,
	  clear: clearTask
	};
	var _task_1 = _task.set;
	var _task_2 = _task.clear;

	var _task$1 = /*#__PURE__*/Object.freeze({
		default: _task,
		__moduleExports: _task,
		set: _task_1,
		clear: _task_2
	});

	var require$$0$10 = ( _task$1 && _task ) || _task$1;

	var macrotask = require$$0$10.set;
	var Observer = require$$0$2.MutationObserver || require$$0$2.WebKitMutationObserver;
	var process$1 = require$$0$2.process;
	var Promise$1 = require$$0$2.Promise;
	var isNode = cof(process$1) == 'process';

	var _microtask = function () {
	  var head, last, notify;

	  var flush = function () {
	    var parent, fn;
	    if (isNode && (parent = process$1.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (e) {
	        if (head) notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (isNode) {
	    notify = function () {
	      process$1.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
	  } else if (Observer && !(require$$0$2.navigator && require$$0$2.navigator.standalone)) {
	    var toggle = true;
	    var node = document.createTextNode('');
	    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    var promise = Promise$1.resolve();
	    notify = function () {
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(require$$0$2, flush);
	    };
	  }

	  return function (fn) {
	    var task = { fn: fn, next: undefined };
	    if (last) last.next = task;
	    if (!head) {
	      head = task;
	      notify();
	    } last = task;
	  };
	};

	var _microtask$1 = /*#__PURE__*/Object.freeze({
		default: _microtask,
		__moduleExports: _microtask
	});

	// 25.4.1.5 NewPromiseCapability(C)


	function PromiseCapability(C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject = aFunction(reject);
	}

	var f$1 = function (C) {
	  return new PromiseCapability(C);
	};

	var _newPromiseCapability = {
		f: f$1
	};

	var _newPromiseCapability$1 = /*#__PURE__*/Object.freeze({
		default: _newPromiseCapability,
		__moduleExports: _newPromiseCapability,
		f: f$1
	});

	var _perform = function (exec) {
	  try {
	    return { e: false, v: exec() };
	  } catch (e) {
	    return { e: true, v: e };
	  }
	};

	var _perform$1 = /*#__PURE__*/Object.freeze({
		default: _perform,
		__moduleExports: _perform
	});

	var newPromiseCapability = ( _newPromiseCapability$1 && _newPromiseCapability ) || _newPromiseCapability$1;

	var _promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var _promiseResolve$1 = /*#__PURE__*/Object.freeze({
		default: _promiseResolve,
		__moduleExports: _promiseResolve
	});

	var _redefineAll = function (target, src, safe) {
	  for (var key in src) {
	    if (safe && target[key]) target[key] = src[key];
	    else require$$0$4(target, key, src[key]);
	  } return target;
	};

	var _redefineAll$1 = /*#__PURE__*/Object.freeze({
		default: _redefineAll,
		__moduleExports: _redefineAll
	});

	var SPECIES$1 = require$$0$7('species');

	var _setSpecies = function (KEY) {
	  var C = typeof require$$1$2[KEY] == 'function' ? require$$1$2[KEY] : require$$0$2[KEY];
	  if (require$$0$3 && C && !C[SPECIES$1]) dP$1.f(C, SPECIES$1, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};

	var _setSpecies$1 = /*#__PURE__*/Object.freeze({
		default: _setSpecies,
		__moduleExports: _setSpecies
	});

	var ITERATOR$3 = require$$0$7('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$3]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	} catch (e) { /* empty */ }

	var _iterDetect = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR$3]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR$3] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};

	var _iterDetect$1 = /*#__PURE__*/Object.freeze({
		default: _iterDetect,
		__moduleExports: _iterDetect
	});

	var anInstance = ( _anInstance$1 && _anInstance ) || _anInstance$1;

	var forOf = ( _forOf$1 && _forOf ) || _forOf$1;

	var speciesConstructor = ( _speciesConstructor$1 && _speciesConstructor ) || _speciesConstructor$1;

	var require$$1$4 = ( _microtask$1 && _microtask ) || _microtask$1;

	var perform = ( _perform$1 && _perform ) || _perform$1;

	var promiseResolve = ( _promiseResolve$1 && _promiseResolve ) || _promiseResolve$1;

	var require$$3 = ( _redefineAll$1 && _redefineAll ) || _redefineAll$1;

	var require$$5 = ( _setSpecies$1 && _setSpecies ) || _setSpecies$1;

	var require$$7 = ( _iterDetect$1 && _iterDetect ) || _iterDetect$1;

	var task = require$$0$10.set;
	var microtask = require$$1$4();



	var PROMISE = 'Promise';
	var TypeError$1 = require$$0$2.TypeError;
	var process$2 = require$$0$2.process;
	var $Promise = require$$0$2[PROMISE];
	var isNode$1 = classof(process$2) == 'process';
	var empty = function () { /* empty */ };
	var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
	var newPromiseCapability$1 = newGenericPromiseCapability = newPromiseCapability.f;

	var USE_NATIVE = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1);
	    var FakePromise = (promise.constructor = {})[require$$0$7('species')] = function (exec) {
	      exec(empty, empty);
	    };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode$1 || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch (e) { /* empty */ }
	}();

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function (promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v;
	    var ok = promise._s == 1;
	    var i = 0;
	    var run = function (reaction) {
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (promise._h == 2) onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // may throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (e) {
	        if (domain && !exited) domain.exit();
	        reject(e);
	      }
	    };
	    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};
	var onUnhandled = function (promise) {
	  task.call(require$$0$2, function () {
	    var value = promise._v;
	    var unhandled = isUnhandled(promise);
	    var result, handler, console;
	    if (unhandled) {
	      result = perform(function () {
	        if (isNode$1) {
	          process$2.emit('unhandledRejection', value, promise);
	        } else if (handler = require$$0$2.onunhandledrejection) {
	          handler({ promise: promise, reason: value });
	        } else if ((console = require$$0$2.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if (unhandled && result.e) throw result.v;
	  });
	};
	var isUnhandled = function (promise) {
	  return promise._h !== 1 && (promise._a || promise._c).length === 0;
	};
	var onHandleUnhandled = function (promise) {
	  task.call(require$$0$2, function () {
	    var handler;
	    if (isNode$1) {
	      process$2.emit('rejectionHandled', promise);
	    } else if (handler = require$$0$2.onrejectionhandled) {
	      handler({ promise: promise, reason: promise._v });
	    }
	  });
	};
	var $reject = function (value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function (value) {
	  var promise = this;
	  var then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = { _w: promise, _d: false }; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch (e) {
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch (e) {
	    $reject.call({ _w: promise, _d: false }, e); // wrap
	  }
	};

	// constructor polyfill
	if (!USE_NATIVE) {
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor) {
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch (err) {
	      $reject.call(this, err);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = require$$3($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected) {
	      var reaction = newPromiseCapability$1(speciesConstructor(this, $Promise));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode$1 ? process$2.domain : undefined;
	      this._c.push(reaction);
	      if (this._a) this._a.push(reaction);
	      if (this._s) notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject = ctx($reject, promise, 1);
	  };
	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === $Promise || C === Wrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };
	}

	$export$1($export$1.G + $export$1.W + $export$1.F * !USE_NATIVE, { Promise: $Promise });
	setToStringTag($Promise, PROMISE);
	require$$5(PROMISE);
	Wrapper = require$$1$2[PROMISE];

	// statics
	$export$1($export$1.S + $export$1.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    var $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export$1($export$1.S + $export$1.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
	  }
	});
	$export$1($export$1.S + $export$1.F * !(USE_NATIVE && require$$7(function (iter) {
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var values = [];
	      var index = 0;
	      var remaining = 1;
	      forOf(iterable, false, function (promise) {
	        var $index = index++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      forOf(iterable, false, function (promise) {
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  }
	});

	$export$1($export$1.P + $export$1.R, 'Promise', { 'finally': function (onFinally) {
	  var C = speciesConstructor(this, require$$1$2.Promise || require$$0$2.Promise);
	  var isFunction = typeof onFinally == 'function';
	  return this.then(
	    isFunction ? function (x) {
	      return promiseResolve(C, onFinally()).then(function () { return x; });
	    } : onFinally,
	    isFunction ? function (e) {
	      return promiseResolve(C, onFinally()).then(function () { throw e; });
	    } : onFinally
	  );
	} });

	// https://github.com/tc39/proposal-promise-try




	$export$1($export$1.S, 'Promise', { 'try': function (callbackfn) {
	  var promiseCapability = newPromiseCapability.f(this);
	  var result = perform(callbackfn);
	  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
	  return promiseCapability.promise;
	} });

	var promise = require$$1$2.Promise;

	var promise$1 = /*#__PURE__*/Object.freeze({
		default: promise,
		__moduleExports: promise
	});

	var require$$0$11 = ( promise$1 && promise ) || promise$1;

	var promise$2 = createCommonjsModule(function (module) {
	module.exports = { "default": require$$0$11, __esModule: true };
	});

	var promise$3 = unwrapExports(promise$2);

	var promise$4 = /*#__PURE__*/Object.freeze({
		default: promise$3,
		__moduleExports: promise$2
	});

	var _promise = ( promise$4 && promise$3 ) || promise$4;

	var asyncToGenerator = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;



	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (fn) {
	  return function () {
	    var gen = fn.apply(this, arguments);
	    return new _promise2.default(function (resolve, reject) {
	      function step(key, arg) {
	        try {
	          var info = gen[key](arg);
	          var value = info.value;
	        } catch (error) {
	          reject(error);
	          return;
	        }

	        if (info.done) {
	          resolve(value);
	        } else {
	          return _promise2.default.resolve(value).then(function (value) {
	            step("next", value);
	          }, function (err) {
	            step("throw", err);
	          });
	        }
	      }

	      return step("next");
	    });
	  };
	};
	});

	var _asyncToGenerator = unwrapExports(asyncToGenerator);

	var f$2 = Object.getOwnPropertySymbols;

	var _objectGops = {
		f: f$2
	};

	var _objectGops$1 = /*#__PURE__*/Object.freeze({
		default: _objectGops,
		__moduleExports: _objectGops,
		f: f$2
	});

	var f$3 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$3
	};

	var _objectPie$1 = /*#__PURE__*/Object.freeze({
		default: _objectPie,
		__moduleExports: _objectPie,
		f: f$3
	});

	var gOPS = ( _objectGops$1 && _objectGops ) || _objectGops$1;

	var pIE = ( _objectPie$1 && _objectPie ) || _objectPie$1;

	// 19.1.2.1 Object.assign(target, source, ...)





	var $assign = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	var _objectAssign = !$assign || require$$1(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;

	var _objectAssign$1 = /*#__PURE__*/Object.freeze({
		default: _objectAssign,
		__moduleExports: _objectAssign
	});

	var require$$0$12 = ( _objectAssign$1 && _objectAssign ) || _objectAssign$1;

	// 19.1.3.1 Object.assign(target, source)


	$export$1($export$1.S + $export$1.F, 'Object', { assign: require$$0$12 });

	var assign = require$$1$2.Object.assign;

	var assign$1 = /*#__PURE__*/Object.freeze({
		default: assign,
		__moduleExports: assign
	});

	var require$$0$13 = ( assign$1 && assign ) || assign$1;

	var assign$2 = createCommonjsModule(function (module) {
	module.exports = { "default": require$$0$13, __esModule: true };
	});

	var assign$3 = unwrapExports(assign$2);

	var assign$4 = /*#__PURE__*/Object.freeze({
		default: assign$3,
		__moduleExports: assign$2
	});

	var _assign = ( assign$4 && assign$3 ) || assign$4;

	var _extends = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;



	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};
	});

	var _extends$1 = unwrapExports(_extends);

	var classCallCheck = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	});

	var _classCallCheck = unwrapExports(classCallCheck);

	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export$1($export$1.S + $export$1.F * !require$$0$3, 'Object', { defineProperty: dP$1.f });

	var $Object = require$$1$2.Object;
	var defineProperty = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};

	var defineProperty$1 = /*#__PURE__*/Object.freeze({
		default: defineProperty,
		__moduleExports: defineProperty
	});

	var require$$0$14 = ( defineProperty$1 && defineProperty ) || defineProperty$1;

	var defineProperty$2 = createCommonjsModule(function (module) {
	module.exports = { "default": require$$0$14, __esModule: true };
	});

	var defineProperty$3 = unwrapExports(defineProperty$2);

	var defineProperty$4 = /*#__PURE__*/Object.freeze({
		default: defineProperty$3,
		__moduleExports: defineProperty$2
	});

	var _defineProperty = ( defineProperty$4 && defineProperty$3 ) || defineProperty$4;

	var createClass = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;



	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();
	});

	var _createClass = unwrapExports(createClass);

	var colors_ = require('colors');

	var helper = function () {
		function helper() {
			var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { debug: true };

			_classCallCheck(this, helper);

			this.config = config;
		}

		_createClass(helper, [{
			key: 'title',
			value: function title(_title) {
				var _t = '***\ ' + _title + '\ ***';
				var _l = this.repeat('*', _t.length);
				console.log(_l.green);
				console.log(_t.green);
				console.log(_l.green);
			}
		}, {
			key: 'repeat',
			value: function repeat(string, count) {
				if (count < 1) return '';
				var result = '',
				    pattern = string.valueOf();
				while (count > 1) {
					if (count & 1) result += pattern;
					count >>>= 1, pattern += pattern;
				}
				return result + pattern;
			}
		}, {
			key: 'fixAccents',
			value: function fixAccents(text) {
				var ctext = text;
				var from = '';
				var table = {
					'C1': 'A',
					'E1': 'á',
					'C9': 'E',
					'E9': 'é',
					'CD': 'I',
					'ED': 'í',
					'D1': 'Ñ',
					'F1': 'ñ',
					'D3': 'O',
					'F3': 'ó',
					'DA': 'U',
					'FA': 'ú',
					'DC': 'U',
					'FC': 'ü',
					'AB': '«',
					'BB': '»',
					'BF': '¿',
					'A1': '¡',
					'80': '€',
					'20A7': 'Pts'
				};
				for (from in table) {
					ctext.replace('&#x' + from, table[from]);
				}
				return ctext;
			}
		}]);

		return helper;
	}();

	var dsl_parser = function () {
		function dsl_parser(thefile, config) {
			_classCallCheck(this, dsl_parser);

			var def_config = {
				cancelled: false,
				debug: true
			};
			this.file = thefile;
			this.config = _extends$1({}, config, def_config);
			this.help = new helper();
			this.$ = null;
		}

		_createClass(dsl_parser, [{
			key: 'process',
			value: function () {
				var _ref = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee() {
					var cheerio, path, fs, data;
					return regenerator.wrap(function _callee$(_context) {
						while (1) {
							switch (_context.prev = _context.next) {
								case 0:
									if (!(this.file != '')) {
										_context.next = 14;
										break;
									}

									this.help.title('DSL Parser for ' + this.file);
									if (this.config.debug) console.time('process');
									cheerio = require('cheerio'), path = require('path');
									fs = require('fs').promises;
									data = '';
									_context.next = 8;
									return fs.readFile(this.file, 'utf-8');

								case 8:
									data = _context.sent;

									// fix accents -> unicode to latin chars
									if (this.config.debug) console.log('fixing accents');
									data = this.help.fixAccents(data);
									// parse XML 
									this.$ = cheerio.load(data, { ignoreWhitespace: false, xmlMode: true, decodeEntities: false });
									// remove cancelled nodes if requested
									if (!this.config.cancelled) {
										if (this.config.debug) console.log('removing cancelled nodes from tree');
										this.$('icon[BUILTIN*=button_cancel]').parent().remove();
									}
									if (this.config.debug) console.timeEnd('process');
									//if (this.config.debug) console.log('dsl dump',this.$('*').html());

								case 14:
								case 'end':
									return _context.stop();
							}
						}
					}, _callee, this);
				}));

				function process() {
					return _ref.apply(this, arguments);
				}

				return process;
			}()
		}, {
			key: 'getParser',
			value: function getParser() {
				return this.$;
			}
		}, {
			key: 'getNodes',
			value: function () {
				var _ref2 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3() {
					var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
					    text = _ref3.text,
					    attribute = _ref3.attribute,
					    attribute_value = _ref3.attribute_value,
					    icon = _ref3.icon,
					    level = _ref3.level,
					    link = _ref3.link,
					    _ref3$recurse = _ref3.recurse,
					    recurse = _ref3$recurse === undefined ? true : _ref3$recurse;

					var resp, nodes, me, tmp, _tmp, _tmp2, _tmp3, _tmp4;

					return regenerator.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									resp = [], nodes = null, me = this;

									if (text) {
										tmp = text.toString().replace(/ /g, '\\ ');

										nodes = this.$('node[text*=' + tmp + ']');
									} else if (attribute) {
										_tmp = attribute.replace(/ /g, '\\ ');

										nodes = this.$('attribute[name*=' + _tmp + ']').parent('node');
									} else if (attribute_value) {
										_tmp2 = attribute_value.replace(/ /g, '\\ ');

										nodes = this.$('attribute[value*=' + _tmp2 + ']').parent('node');
									} else if (icon) {
										_tmp3 = icon.replace(/ /g, '\\ ');

										nodes = this.$('icon[builtin*=' + _tmp3 + ']').parent('node');
									} else if (level) {
										nodes = this.$('node').filter(function (i, elem) {
											var padres = -1;
											try {
												padres = me.$(elem).parents('node').length + 1;
											} catch (ee) {}
											return padres === level;
										});
									} else if (link) {
										_tmp4 = link.replace(/ /g, '\\ ');

										nodes = this.$('node[link*=' + _tmp4 + ']');
									} else {
										nodes = this.$('node');
									}
									// iterate nodes and build resp array
									if (nodes != null) {
										nodes.map(function () {
											var _ref4 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(i, elem) {
												var cur, _tmp5;

												return regenerator.wrap(function _callee2$(_context2) {
													while (1) {
														switch (_context2.prev = _context2.next) {
															case 0:
																cur = me.$(elem);

																if (!(typeof cur.attr('ID') != 'undefined')) {
																	_context2.next = 6;
																	break;
																}

																_context2.next = 4;
																return me.getNode({ id: cur.attr('ID'), recurse: recurse });

															case 4:
																_tmp5 = _context2.sent;

																resp.push(_tmp5);

															case 6:
															case 'end':
																return _context2.stop();
														}
													}
												}, _callee2, this);
											}));

											return function (_x2, _x3) {
												return _ref4.apply(this, arguments);
											};
										}());
									}
									return _context3.abrupt('return', resp);

								case 4:
								case 'end':
									return _context3.stop();
							}
						}
					}, _callee3, this);
				}));

				function getNodes() {
					return _ref2.apply(this, arguments);
				}

				return getNodes;
			}()
		}, {
			key: 'getNode',
			value: function () {
				var _ref5 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee6() {
					var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
					    _ref6$id = _ref6.id,
					    id = _ref6$id === undefined ? this.throwIfMissing('id') : _ref6$id,
					    _ref6$recurse = _ref6.recurse,
					    recurse = _ref6$recurse === undefined ? true : _ref6$recurse,
					    justlevel = _ref6.justlevel,
					    _ref6$dates = _ref6.dates,
					    dates = _ref6$dates === undefined ? true : _ref6$dates;

					var me, resp, nodes;
					return regenerator.wrap(function _callee6$(_context6) {
						while (1) {
							switch (_context6.prev = _context6.next) {
								case 0:
									if (!(this.$ === null)) {
										_context6.next = 2;
										break;
									}

									throw new Error('call process() first!');

								case 2:
									me = this;
									resp = { level: -1, text: '', text_rich: '', text_node: '', image: '',
										cloud: { used: false, bgcolor: '' },
										arrows: [], nodes: [],
										font: { face: 'SansSerif', size: 12, bold: false, italic: false },
										style: '', color: '', bgcolor: '', link: '', position: '',
										attributes: [], icons: [],
										date_modified: new Date(),
										date_created: new Date(),
										valid: true
									};
									nodes = me.$('node[ID=' + id + ']').each(function () {
										var _ref7 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(i, elem) {
											var cur, pa_ac;
											return regenerator.wrap(function _callee5$(_context5) {
												while (1) {
													switch (_context5.prev = _context5.next) {
														case 0:
															cur = me.$(elem), pa_ac = -1;

															resp.id = cur.attr('ID');
															resp.level = cur.parents('node').length + 1;
															// limit level if defined

															if (!(justlevel && resp.level != justlevel)) {
																_context5.next = 6;
																break;
															}

															resp.valid = false;
															return _context5.abrupt('return', false);

														case 6:
															//
															if (typeof cur.attr('LINK') != 'undefined') resp.link = cur.attr('LINK').split('#').join('');
															if (typeof cur.attr('POSITION') != 'undefined') resp.position = cur.attr('POSITION');
															if (typeof cur.attr('COLOR') != 'undefined') resp.color = cur.attr('COLOR');
															if (typeof cur.attr('BACKGROUND_COLOR') != 'undefined') resp.bgcolor = cur.attr('BACKGROUND_COLOR');
															if (typeof cur.attr('STYLE') != 'undefined') resp.style = cur.attr('STYLE');
															if (typeof cur.attr('TEXT') != 'undefined') resp.text = cur.attr('TEXT');
															// dates parsing
															if (dates) {
																if (typeof cur.attr('CREATED') != 'undefined') {
																	resp.date_created = new Date(parseFloat(cur.attr('CREATED')));
																}
																if (typeof cur.attr('MODIFIED') != 'undefined') {
																	resp.date_modified = new Date(parseFloat(cur.attr('MODIFIED')));
																}
															}
															// attributes
															cur.find('node[ID=' + resp.id + '] > attribute').map(function (a, a_elem) {
																var tmp_fila = {},
																    _fila = me.$(a_elem);
																tmp_fila[_fila.attr('NAME')] = _fila.attr('VALUE');
																resp.attributes.push(tmp_fila);
															});
															// icons
															cur.find('node[ID=' + resp.id + '] > icon').map(function (a, a_elem) {
																resp.icons.push(me.$(a_elem).attr('BUILTIN'));
															});
															// fonts definition
															cur.find('node[ID=' + resp.id + '] > font').map(function (a, a_elem) {
																var _fila = me.$(a_elem);
																resp.font.face = _fila.attr('NAME');
																resp.font.size = _fila.attr('SIZE');
																if (typeof _fila.attr('BOLD') != 'undefined') {
																	resp.font.bold = _fila.attr('BOLD');
																}
																if (typeof _fila.attr('ITALIC') != 'undefined') {
																	resp.font.italic = _fila.attr('ITALIC');
																}
															});
															// cloud definition
															cur.find('node[ID=' + resp.id + '] > cloud').map(function (a, a_elem) {
																var _fila = me.$(a_elem);
																resp.cloud.used = true;
																if (typeof _fila.attr('COLOR') != 'undefined') {
																	resp.cloud.bgcolor = _fila.attr('COLOR');
																}
															});
															// get image if any on node
															cur.find('node[ID=' + resp.id + '] > richcontent[TYPE=NODE] body').map(function (a, a_elem) {
																resp.text_rich = me.$(a_elem).html();
																me.$(a_elem).find('img[src]').map(function (i, i_elem) {
																	resp.image = me.$(i_elem).attr('src');
																});
															});
															// get notes on node if any
															cur.find('node[ID=' + resp.id + '] > richcontent[TYPE=NOTE] body').map(function (a, a_elem) {
																resp.text_node = me.$(a_elem).text();
															});
															// get defined arrows on node if any
															cur.find('node[ID=' + resp.id + '] > arrowlink').map(function (a, a_elem) {
																var _fila = me.$(a_elem),
																    _tmp_f = { target: '', color: '', style: '' },
																    _tmpa = {};
																_tmp_f.target = _fila.attr('DESTINATION');
																if (typeof _fila.attr('COLOR') != 'undefined') {
																	_tmp_f.color = _fila.attr('COLOR');
																}
																_tmpa.type = _fila.attr('STARTARROW') + '-' + _fila.attr('ENDARROW');
																if (_tmpa.type.indexOf('None-Default') != -1) {
																	_tmp_f.style = 'source-to-target';
																} else if (_tmpa.type.indexOf('Default-None') != -1) {
																	_tmp_f.style = 'target-to-source';
																} else {
																	_tmp_f.style = 'both-ways';
																}
																resp.arrows.push(_tmp_f);
															});
															// get children nodes .. (using myself for each child)
															if (recurse == true) {
																cur.find('node').map(function () {
																	var _ref8 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(a, a_elem) {
																		var _nodo, hijo;

																		return regenerator.wrap(function _callee4$(_context4) {
																			while (1) {
																				switch (_context4.prev = _context4.next) {
																					case 0:
																						_nodo = me.$(a_elem);
																						_context4.next = 3;
																						return me.getNode({ id: _nodo.attr('ID'), recurse: recurse, justlevel: resp.level + 1 });

																					case 3:
																						hijo = _context4.sent;

																						if (hijo.valid) {
																							delete hijo.valid;
																							resp.nodes.push(hijo);
																						}

																					case 5:
																					case 'end':
																						return _context4.stop();
																				}
																			}
																		}, _callee4, this);
																	}));

																	return function (_x7, _x8) {
																		return _ref8.apply(this, arguments);
																	};
																}());
															}
															// break loop
															return _context5.abrupt('return', false);

														case 22:
														case 'end':
															return _context5.stop();
													}
												}
											}, _callee5, this);
										}));

										return function (_x5, _x6) {
											return _ref7.apply(this, arguments);
										};
									}());
									// remove 'valid' key if justLevel is not defined

									if (!justlevel) delete resp.valid;
									// reply
									return _context6.abrupt('return', resp);

								case 7:
								case 'end':
									return _context6.stop();
							}
						}
					}, _callee6, this);
				}));

				function getNode() {
					return _ref5.apply(this, arguments);
				}

				return getNode;
			}()
		}, {
			key: 'getParentNode',
			value: function () {
				var _ref9 = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee7() {
					var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
					    _ref10$id = _ref10.id,
					    id = _ref10$id === undefined ? this.throwIfMissing('id') : _ref10$id;

					var padre, resp, me;
					return regenerator.wrap(function _callee7$(_context7) {
						while (1) {
							switch (_context7.prev = _context7.next) {
								case 0:
									if (!(this.$ === null)) {
										_context7.next = 2;
										break;
									}

									throw new Error('call process() first!');

								case 2:
									padre = this.$('node[ID=' + id + ']').parent('node');
									resp = {}, me = this;

									if (!(typeof padre.attr('ID') != 'undefined')) {
										_context7.next = 8;
										break;
									}

									_context7.next = 7;
									return me.getNode({ id: padre.attr('ID'), recurse: false });

								case 7:
									resp = _context7.sent;

								case 8:
									return _context7.abrupt('return', resp);

								case 9:
								case 'end':
									return _context7.stop();
							}
						}
					}, _callee7, this);
				}));

				function getParentNode() {
					return _ref9.apply(this, arguments);
				}

				return getParentNode;
			}()

			// ********************
			// private methods
			// ********************

		}, {
			key: 'throwIfMissing',
			value: function throwIfMissing(name) {
				throw new Error('Missing ' + name + ' parameter!');
			}
		}, {
			key: 'showme',
			value: function showme() {
				this.help.title('TEST');
				console.log('debug test', { thefile: this.file, config: this.config });
			}
		}]);

		return dsl_parser;
	}();

	return dsl_parser;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCIuLi9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLW1vZHVsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL3JlZ2VuZXJhdG9yL2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zdHJpbmctYXQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29yZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHAuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hhcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tYWJzb2x1dGUtaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLWtleS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtY3JlYXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hZGQtdG8tdW5zY29wYWJsZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4taW5zdGFuY2UuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW52b2tlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190YXNrLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX25ldy1wcm9taXNlLWNhcGFiaWxpdHkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3BlcmZvcm0uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb21pc2UtcmVzb2x2ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZXRlY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnByb21pc2UuZmluYWxseS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcucHJvbWlzZS50cnkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvYXNzaWduLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9leHRlbmRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanMiLCIuLi9zcmMvaGVscGVyLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuIShmdW5jdGlvbihnbG9iYWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICB2YXIgaW5Nb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiO1xuICB2YXIgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIGlmIChydW50aW1lKSB7XG4gICAgaWYgKGluTW9kdWxlKSB7XG4gICAgICAvLyBJZiByZWdlbmVyYXRvclJ1bnRpbWUgaXMgZGVmaW5lZCBnbG9iYWxseSBhbmQgd2UncmUgaW4gYSBtb2R1bGUsXG4gICAgICAvLyBtYWtlIHRoZSBleHBvcnRzIG9iamVjdCBpZGVudGljYWwgdG8gcmVnZW5lcmF0b3JSdW50aW1lLlxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBydW50aW1lO1xuICAgIH1cbiAgICAvLyBEb24ndCBib3RoZXIgZXZhbHVhdGluZyB0aGUgcmVzdCBvZiB0aGlzIGZpbGUgaWYgdGhlIHJ1bnRpbWUgd2FzXG4gICAgLy8gYWxyZWFkeSBkZWZpbmVkIGdsb2JhbGx5LlxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERlZmluZSB0aGUgcnVudGltZSBnbG9iYWxseSAoYXMgZXhwZWN0ZWQgYnkgZ2VuZXJhdGVkIGNvZGUpIGFzIGVpdGhlclxuICAvLyBtb2R1bGUuZXhwb3J0cyAoaWYgd2UncmUgaW4gYSBtb2R1bGUpIG9yIGEgbmV3LCBlbXB0eSBvYmplY3QuXG4gIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lID0gaW5Nb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA6IHt9O1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgcnVudGltZS5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIHJ1bnRpbWUuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG4gICAgICAgICAgLy8gcmVzdWx0IGZvciB0aGlzIGl0ZXJhdGlvbiB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHNhbWVcbiAgICAgICAgICAvLyByZWFzb24uIE5vdGUgdGhhdCByZWplY3Rpb25zIG9mIHlpZWxkZWQgUHJvbWlzZXMgYXJlIG5vdFxuICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2VcbiAgICAgICAgICAvLyB3aGVuIGFuIGF3YWl0ZWQgUHJvbWlzZSBpcyByZWplY3RlZC4gVGhpcyBkaWZmZXJlbmNlIGluXG4gICAgICAgICAgLy8gYmVoYXZpb3IgYmV0d2VlbiB5aWVsZCBhbmQgYXdhaXQgaXMgaW1wb3J0YW50LCBiZWNhdXNlIGl0XG4gICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIChzd2FsbG93IGl0IGFuZCBjb250aW51ZSwgbWFudWFsbHkgLnRocm93IGl0IGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBnZW5lcmF0b3IsIGFiYW5kb24gaXRlcmF0aW9uLCB3aGF0ZXZlcikuIFdpdGhcbiAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG4gICAgICAgICAgLy8gcmVqZWN0aW9uIHJlYXNvbiBvdXRzaWRlIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIHNvIHRoZVxuICAgICAgICAgIC8vIG9ubHkgb3B0aW9uIGlzIHRvIHRocm93IGl0IGZyb20gdGhlIGF3YWl0IGV4cHJlc3Npb24sIGFuZFxuICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZXZpb3VzUHJvbWlzZSA9XG4gICAgICAgIC8vIElmIGVucXVldWUgaGFzIGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiB3ZSB3YW50IHRvIHdhaXQgdW50aWxcbiAgICAgICAgLy8gYWxsIHByZXZpb3VzIFByb21pc2VzIGhhdmUgYmVlbiByZXNvbHZlZCBiZWZvcmUgY2FsbGluZyBpbnZva2UsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVzdWx0cyBhcmUgYWx3YXlzIGRlbGl2ZXJlZCBpbiB0aGUgY29ycmVjdCBvcmRlci4gSWZcbiAgICAgICAgLy8gZW5xdWV1ZSBoYXMgbm90IGJlZW4gY2FsbGVkIGJlZm9yZSwgdGhlbiBpdCBpcyBpbXBvcnRhbnQgdG9cbiAgICAgICAgLy8gY2FsbCBpbnZva2UgaW1tZWRpYXRlbHksIHdpdGhvdXQgd2FpdGluZyBvbiBhIGNhbGxiYWNrIHRvIGZpcmUsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIGFzeW5jIGdlbmVyYXRvciBmdW5jdGlvbiBoYXMgdGhlIG9wcG9ydHVuaXR5IHRvIGRvXG4gICAgICAgIC8vIGFueSBuZWNlc3Nhcnkgc2V0dXAgaW4gYSBwcmVkaWN0YWJsZSB3YXkuIFRoaXMgcHJlZGljdGFiaWxpdHlcbiAgICAgICAgLy8gaXMgd2h5IHRoZSBQcm9taXNlIGNvbnN0cnVjdG9yIHN5bmNocm9ub3VzbHkgaW52b2tlcyBpdHNcbiAgICAgICAgLy8gZXhlY3V0b3IgY2FsbGJhY2ssIGFuZCB3aHkgYXN5bmMgZnVuY3Rpb25zIHN5bmNocm9ub3VzbHlcbiAgICAgICAgLy8gZXhlY3V0ZSBjb2RlIGJlZm9yZSB0aGUgZmlyc3QgYXdhaXQuIFNpbmNlIHdlIGltcGxlbWVudCBzaW1wbGVcbiAgICAgICAgLy8gYXN5bmMgZnVuY3Rpb25zIGluIHRlcm1zIG9mIGFzeW5jIGdlbmVyYXRvcnMsIGl0IGlzIGVzcGVjaWFsbHlcbiAgICAgICAgLy8gaW1wb3J0YW50IHRvIGdldCB0aGlzIHJpZ2h0LCBldmVuIHRob3VnaCBpdCByZXF1aXJlcyBjYXJlLlxuICAgICAgICBwcmV2aW91c1Byb21pc2UgPyBwcmV2aW91c1Byb21pc2UudGhlbihcbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZyxcbiAgICAgICAgICAvLyBBdm9pZCBwcm9wYWdhdGluZyBmYWlsdXJlcyB0byBQcm9taXNlcyByZXR1cm5lZCBieSBsYXRlclxuICAgICAgICAgIC8vIGludm9jYXRpb25zIG9mIHRoZSBpdGVyYXRvci5cbiAgICAgICAgICBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZ1xuICAgICAgICApIDogY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgdGhlIHVuaWZpZWQgaGVscGVyIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gaW1wbGVtZW50IC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gKHNlZSBkZWZpbmVJdGVyYXRvck1ldGhvZHMpLlxuICAgIHRoaXMuX2ludm9rZSA9IGVucXVldWU7XG4gIH1cblxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoQXN5bmNJdGVyYXRvci5wcm90b3R5cGUpO1xuICBBc3luY0l0ZXJhdG9yLnByb3RvdHlwZVthc3luY0l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcnVudGltZS5Bc3luY0l0ZXJhdG9yID0gQXN5bmNJdGVyYXRvcjtcblxuICAvLyBOb3RlIHRoYXQgc2ltcGxlIGFzeW5jIGZ1bmN0aW9ucyBhcmUgaW1wbGVtZW50ZWQgb24gdG9wIG9mXG4gIC8vIEFzeW5jSXRlcmF0b3Igb2JqZWN0czsgdGhleSBqdXN0IHJldHVybiBhIFByb21pc2UgZm9yIHRoZSB2YWx1ZSBvZlxuICAvLyB0aGUgZmluYWwgcmVzdWx0IHByb2R1Y2VkIGJ5IHRoZSBpdGVyYXRvci5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpXG4gICAgKTtcblxuICAgIHJldHVybiBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24ob3V0ZXJGbilcbiAgICAgID8gaXRlciAvLyBJZiBvdXRlckZuIGlzIGEgZ2VuZXJhdG9yLCByZXR1cm4gdGhlIGZ1bGwgaXRlcmF0b3IuXG4gICAgICA6IGl0ZXIubmV4dCgpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5kb25lID8gcmVzdWx0LnZhbHVlIDogaXRlci5uZXh0KCk7XG4gICAgICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCkge1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlRXhlY3V0aW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IHJ1bm5pbmdcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVDb21wbGV0ZWQpIHtcbiAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQmUgZm9yZ2l2aW5nLCBwZXIgMjUuMy4zLjMuMyBvZiB0aGUgc3BlYzpcbiAgICAgICAgLy8gaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLWdlbmVyYXRvcnJlc3VtZVxuICAgICAgICByZXR1cm4gZG9uZVJlc3VsdCgpO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIGNvbnRleHQuYXJnID0gYXJnO1xuXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgZGVsZWdhdGUgPSBjb250ZXh0LmRlbGVnYXRlO1xuICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICB2YXIgZGVsZWdhdGVSZXN1bHQgPSBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KTtcbiAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCA9PT0gQ29udGludWVTZW50aW5lbCkgY29udGludWU7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGVSZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAgIC8vIFNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICAgICAgY29udGV4dC5zZW50ID0gY29udGV4dC5fc2VudCA9IGNvbnRleHQuYXJnO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydCkge1xuICAgICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAgIHRocm93IGNvbnRleHQuYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGV4dC5tZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBjb250ZXh0LmFyZyk7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZSA9IEdlblN0YXRlRXhlY3V0aW5nO1xuXG4gICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChpbm5lckZuLCBzZWxmLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiKSB7XG4gICAgICAgICAgLy8gSWYgYW4gZXhjZXB0aW9uIGlzIHRocm93biBmcm9tIGlubmVyRm4sIHdlIGxlYXZlIHN0YXRlID09PVxuICAgICAgICAgIC8vIEdlblN0YXRlRXhlY3V0aW5nIGFuZCBsb29wIGJhY2sgZm9yIGFub3RoZXIgaW52b2NhdGlvbi5cbiAgICAgICAgICBzdGF0ZSA9IGNvbnRleHQuZG9uZVxuICAgICAgICAgICAgPyBHZW5TdGF0ZUNvbXBsZXRlZFxuICAgICAgICAgICAgOiBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkO1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB2YWx1ZTogcmVjb3JkLmFyZyxcbiAgICAgICAgICAgIGRvbmU6IGNvbnRleHQuZG9uZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZykgY2FsbCBhYm92ZS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gQ2FsbCBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF0oY29udGV4dC5hcmcpIGFuZCBoYW5kbGUgdGhlXG4gIC8vIHJlc3VsdCwgZWl0aGVyIGJ5IHJldHVybmluZyBhIHsgdmFsdWUsIGRvbmUgfSByZXN1bHQgZnJvbSB0aGVcbiAgLy8gZGVsZWdhdGUgaXRlcmF0b3IsIG9yIGJ5IG1vZGlmeWluZyBjb250ZXh0Lm1ldGhvZCBhbmQgY29udGV4dC5hcmcsXG4gIC8vIHNldHRpbmcgY29udGV4dC5kZWxlZ2F0ZSB0byBudWxsLCBhbmQgcmV0dXJuaW5nIHRoZSBDb250aW51ZVNlbnRpbmVsLlxuICBmdW5jdGlvbiBtYXliZUludm9rZURlbGVnYXRlKGRlbGVnYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIG1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIEEgLnRocm93IG9yIC5yZXR1cm4gd2hlbiB0aGUgZGVsZWdhdGUgaXRlcmF0b3IgaGFzIG5vIC50aHJvd1xuICAgICAgLy8gbWV0aG9kIGFsd2F5cyB0ZXJtaW5hdGVzIHRoZSB5aWVsZCogbG9vcC5cbiAgICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICBpZiAoZGVsZWdhdGUuaXRlcmF0b3IucmV0dXJuKSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgIC8vIGNoYW5jZSB0byBjbGVhbiB1cC5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG5cbiAgICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgLy8gSWYgbWF5YmVJbnZva2VEZWxlZ2F0ZShjb250ZXh0KSBjaGFuZ2VkIGNvbnRleHQubWV0aG9kIGZyb21cbiAgICAgICAgICAgIC8vIFwicmV0dXJuXCIgdG8gXCJ0aHJvd1wiLCBsZXQgdGhhdCBvdmVycmlkZSB0aGUgVHlwZUVycm9yIGJlbG93LlxuICAgICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcIlRoZSBpdGVyYXRvciBkb2VzIG5vdCBwcm92aWRlIGEgJ3Rocm93JyBtZXRob2RcIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChtZXRob2QsIGRlbGVnYXRlLml0ZXJhdG9yLCBjb250ZXh0LmFyZyk7XG5cbiAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICBjb250ZXh0LmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIHZhciBpbmZvID0gcmVjb3JkLmFyZztcblxuICAgIGlmICghIGluZm8pIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSBuZXcgVHlwZUVycm9yKFwiaXRlcmF0b3IgcmVzdWx0IGlzIG5vdCBhbiBvYmplY3RcIik7XG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cblxuICAgIGlmIChpbmZvLmRvbmUpIHtcbiAgICAgIC8vIEFzc2lnbiB0aGUgcmVzdWx0IG9mIHRoZSBmaW5pc2hlZCBkZWxlZ2F0ZSB0byB0aGUgdGVtcG9yYXJ5XG4gICAgICAvLyB2YXJpYWJsZSBzcGVjaWZpZWQgYnkgZGVsZWdhdGUucmVzdWx0TmFtZSAoc2VlIGRlbGVnYXRlWWllbGQpLlxuICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG5cbiAgICAgIC8vIFJlc3VtZSBleGVjdXRpb24gYXQgdGhlIGRlc2lyZWQgbG9jYXRpb24gKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHQubmV4dCA9IGRlbGVnYXRlLm5leHRMb2M7XG5cbiAgICAgIC8vIElmIGNvbnRleHQubWV0aG9kIHdhcyBcInRocm93XCIgYnV0IHRoZSBkZWxlZ2F0ZSBoYW5kbGVkIHRoZVxuICAgICAgLy8gZXhjZXB0aW9uLCBsZXQgdGhlIG91dGVyIGdlbmVyYXRvciBwcm9jZWVkIG5vcm1hbGx5LiBJZlxuICAgICAgLy8gY29udGV4dC5tZXRob2Qgd2FzIFwibmV4dFwiLCBmb3JnZXQgY29udGV4dC5hcmcgc2luY2UgaXQgaGFzIGJlZW5cbiAgICAgIC8vIFwiY29uc3VtZWRcIiBieSB0aGUgZGVsZWdhdGUgaXRlcmF0b3IuIElmIGNvbnRleHQubWV0aG9kIHdhc1xuICAgICAgLy8gXCJyZXR1cm5cIiwgYWxsb3cgdGhlIG9yaWdpbmFsIC5yZXR1cm4gY2FsbCB0byBjb250aW51ZSBpbiB0aGVcbiAgICAgIC8vIG91dGVyIGdlbmVyYXRvci5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCAhPT0gXCJyZXR1cm5cIikge1xuICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZS15aWVsZCB0aGUgcmVzdWx0IHJldHVybmVkIGJ5IHRoZSBkZWxlZ2F0ZSBtZXRob2QuXG4gICAgICByZXR1cm4gaW5mbztcbiAgICB9XG5cbiAgICAvLyBUaGUgZGVsZWdhdGUgaXRlcmF0b3IgaXMgZmluaXNoZWQsIHNvIGZvcmdldCBpdCBhbmQgY29udGludWUgd2l0aFxuICAgIC8vIHRoZSBvdXRlciBnZW5lcmF0b3IuXG4gICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gIH1cblxuICAvLyBEZWZpbmUgR2VuZXJhdG9yLnByb3RvdHlwZS57bmV4dCx0aHJvdyxyZXR1cm59IGluIHRlcm1zIG9mIHRoZVxuICAvLyB1bmlmaWVkIC5faW52b2tlIGhlbHBlciBtZXRob2QuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhHcCk7XG5cbiAgR3BbdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JcIjtcblxuICAvLyBBIEdlbmVyYXRvciBzaG91bGQgYWx3YXlzIHJldHVybiBpdHNlbGYgYXMgdGhlIGl0ZXJhdG9yIG9iamVjdCB3aGVuIHRoZVxuICAvLyBAQGl0ZXJhdG9yIGZ1bmN0aW9uIGlzIGNhbGxlZCBvbiBpdC4gU29tZSBicm93c2VycycgaW1wbGVtZW50YXRpb25zIG9mIHRoZVxuICAvLyBpdGVyYXRvciBwcm90b3R5cGUgY2hhaW4gaW5jb3JyZWN0bHkgaW1wbGVtZW50IHRoaXMsIGNhdXNpbmcgdGhlIEdlbmVyYXRvclxuICAvLyBvYmplY3QgdG8gbm90IGJlIHJldHVybmVkIGZyb20gdGhpcyBjYWxsLiBUaGlzIGVuc3VyZXMgdGhhdCBkb2Vzbid0IGhhcHBlbi5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWdlbmVyYXRvci9pc3N1ZXMvMjc0IGZvciBtb3JlIGRldGFpbHMuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIC8vIFJlc2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgdGhpcy5zZW50ID0gdGhpcy5fc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcblxuICAgICAgdGhpcy50cnlFbnRyaWVzLmZvckVhY2gocmVzZXRUcnlFbnRyeSk7XG5cbiAgICAgIGlmICghc2tpcFRlbXBSZXNldCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMpIHtcbiAgICAgICAgICAvLyBOb3Qgc3VyZSBhYm91dCB0aGUgb3B0aW1hbCBvcmRlciBvZiB0aGVzZSBjb25kaXRpb25zOlxuICAgICAgICAgIGlmIChuYW1lLmNoYXJBdCgwKSA9PT0gXCJ0XCIgJiZcbiAgICAgICAgICAgICAgaGFzT3duLmNhbGwodGhpcywgbmFtZSkgJiZcbiAgICAgICAgICAgICAgIWlzTmFOKCtuYW1lLnNsaWNlKDEpKSkge1xuICAgICAgICAgICAgdGhpc1tuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcDogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmRvbmUgPSB0cnVlO1xuXG4gICAgICB2YXIgcm9vdEVudHJ5ID0gdGhpcy50cnlFbnRyaWVzWzBdO1xuICAgICAgdmFyIHJvb3RSZWNvcmQgPSByb290RW50cnkuY29tcGxldGlvbjtcbiAgICAgIGlmIChyb290UmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByb290UmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucnZhbDtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2hFeGNlcHRpb246IGZ1bmN0aW9uKGV4Y2VwdGlvbikge1xuICAgICAgaWYgKHRoaXMuZG9uZSkge1xuICAgICAgICB0aHJvdyBleGNlcHRpb247XG4gICAgICB9XG5cbiAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZShsb2MsIGNhdWdodCkge1xuICAgICAgICByZWNvcmQudHlwZSA9IFwidGhyb3dcIjtcbiAgICAgICAgcmVjb3JkLmFyZyA9IGV4Y2VwdGlvbjtcbiAgICAgICAgY29udGV4dC5uZXh0ID0gbG9jO1xuXG4gICAgICAgIGlmIChjYXVnaHQpIHtcbiAgICAgICAgICAvLyBJZiB0aGUgZGlzcGF0Y2hlZCBleGNlcHRpb24gd2FzIGNhdWdodCBieSBhIGNhdGNoIGJsb2NrLFxuICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBjb250ZXh0LmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhISBjYXVnaHQ7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSBcInJvb3RcIikge1xuICAgICAgICAgIC8vIEV4Y2VwdGlvbiB0aHJvd24gb3V0c2lkZSBvZiBhbnkgdHJ5IGJsb2NrIHRoYXQgY291bGQgaGFuZGxlXG4gICAgICAgICAgLy8gaXQsIHNvIHNldCB0aGUgY29tcGxldGlvbiB2YWx1ZSBvZiB0aGUgZW50aXJlIGZ1bmN0aW9uIHRvXG4gICAgICAgICAgLy8gdGhyb3cgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXR1cm4gaGFuZGxlKFwiZW5kXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYpIHtcbiAgICAgICAgICB2YXIgaGFzQ2F0Y2ggPSBoYXNPd24uY2FsbChlbnRyeSwgXCJjYXRjaExvY1wiKTtcbiAgICAgICAgICB2YXIgaGFzRmluYWxseSA9IGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIik7XG5cbiAgICAgICAgICBpZiAoaGFzQ2F0Y2ggJiYgaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0NhdGNoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuZmluYWxseUxvYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJ5IHN0YXRlbWVudCB3aXRob3V0IGNhdGNoIG9yIGZpbmFsbHlcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIGFicnVwdDogZnVuY3Rpb24odHlwZSwgYXJnKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA8PSB0aGlzLnByZXYgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKGVudHJ5LCBcImZpbmFsbHlMb2NcIikgJiZcbiAgICAgICAgICAgIHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB2YXIgZmluYWxseUVudHJ5ID0gZW50cnk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSAmJlxuICAgICAgICAgICh0eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICAgdHlwZSA9PT0gXCJjb250aW51ZVwiKSAmJlxuICAgICAgICAgIGZpbmFsbHlFbnRyeS50cnlMb2MgPD0gYXJnICYmXG4gICAgICAgICAgYXJnIDw9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgIC8vIElnbm9yZSB0aGUgZmluYWxseSBlbnRyeSBpZiBjb250cm9sIGlzIG5vdCBqdW1waW5nIHRvIGFcbiAgICAgICAgLy8gbG9jYXRpb24gb3V0c2lkZSB0aGUgdHJ5L2NhdGNoIGJsb2NrLlxuICAgICAgICBmaW5hbGx5RW50cnkgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVjb3JkID0gZmluYWxseUVudHJ5ID8gZmluYWxseUVudHJ5LmNvbXBsZXRpb24gOiB7fTtcbiAgICAgIHJlY29yZC50eXBlID0gdHlwZTtcbiAgICAgIHJlY29yZC5hcmcgPSBhcmc7XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkpIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2M7XG4gICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgIH0sXG5cbiAgICBjb21wbGV0ZTogZnVuY3Rpb24ocmVjb3JkLCBhZnRlckxvYykge1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcmVjb3JkLmFyZztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcImJyZWFrXCIgfHxcbiAgICAgICAgICByZWNvcmQudHlwZSA9PT0gXCJjb250aW51ZVwiKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IHJlY29yZC5hcmc7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInJldHVyblwiKSB7XG4gICAgICAgIHRoaXMucnZhbCA9IHRoaXMuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgdGhpcy5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgdGhpcy5jb21wbGV0ZShlbnRyeS5jb21wbGV0aW9uLCBlbnRyeS5hZnRlckxvYyk7XG4gICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgXCJjYXRjaFwiOiBmdW5jdGlvbih0cnlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jID09PSB0cnlMb2MpIHtcbiAgICAgICAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbjtcbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgdmFyIHRocm93biA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRocm93bjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGUgY29udGV4dC5jYXRjaCBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgbG9jYXRpb25cbiAgICAgIC8vIGFyZ3VtZW50IHRoYXQgY29ycmVzcG9uZHMgdG8gYSBrbm93biBjYXRjaCBibG9jay5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImlsbGVnYWwgY2F0Y2ggYXR0ZW1wdFwiKTtcbiAgICB9LFxuXG4gICAgZGVsZWdhdGVZaWVsZDogZnVuY3Rpb24oaXRlcmFibGUsIHJlc3VsdE5hbWUsIG5leHRMb2MpIHtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSB7XG4gICAgICAgIGl0ZXJhdG9yOiB2YWx1ZXMoaXRlcmFibGUpLFxuICAgICAgICByZXN1bHROYW1lOiByZXN1bHROYW1lLFxuICAgICAgICBuZXh0TG9jOiBuZXh0TG9jXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuICAvLyBJbiBzbG9wcHkgbW9kZSwgdW5ib3VuZCBgdGhpc2AgcmVmZXJzIHRvIHRoZSBnbG9iYWwgb2JqZWN0LCBmYWxsYmFjayB0b1xuICAvLyBGdW5jdGlvbiBjb25zdHJ1Y3RvciBpZiB3ZSdyZSBpbiBnbG9iYWwgc3RyaWN0IG1vZGUuIFRoYXQgaXMgc2FkbHkgYSBmb3JtXG4gIC8vIG9mIGluZGlyZWN0IGV2YWwgd2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kuXG4gIChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKClcbik7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9IChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG5cbi8vIFVzZSBgZ2V0T3duUHJvcGVydHlOYW1lc2AgYmVjYXVzZSBub3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgY2FsbGluZ1xuLy8gYGhhc093blByb3BlcnR5YCBvbiB0aGUgZ2xvYmFsIGBzZWxmYCBvYmplY3QgaW4gYSB3b3JrZXIuIFNlZSAjMTgzLlxudmFyIGhhZFJ1bnRpbWUgPSBnLnJlZ2VuZXJhdG9yUnVudGltZSAmJlxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhnKS5pbmRleE9mKFwicmVnZW5lcmF0b3JSdW50aW1lXCIpID49IDA7XG5cbi8vIFNhdmUgdGhlIG9sZCByZWdlbmVyYXRvclJ1bnRpbWUgaW4gY2FzZSBpdCBuZWVkcyB0byBiZSByZXN0b3JlZCBsYXRlci5cbnZhciBvbGRSdW50aW1lID0gaGFkUnVudGltZSAmJiBnLnJlZ2VuZXJhdG9yUnVudGltZTtcblxuLy8gRm9yY2UgcmVldmFsdXRhdGlvbiBvZiBydW50aW1lLmpzLlxuZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vcnVudGltZVwiKTtcblxuaWYgKGhhZFJ1bnRpbWUpIHtcbiAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgcnVudGltZS5cbiAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBvbGRSdW50aW1lO1xufSBlbHNlIHtcbiAgLy8gUmVtb3ZlIHRoZSBnbG9iYWwgcHJvcGVydHkgYWRkZWQgYnkgcnVudGltZS5qcy5cbiAgdHJ5IHtcbiAgICBkZWxldGUgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIH0gY2F0Y2goZSkge1xuICAgIGcucmVnZW5lcmF0b3JSdW50aW1lID0gdW5kZWZpbmVkO1xuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRPX1NUUklORykge1xuICByZXR1cm4gZnVuY3Rpb24gKHRoYXQsIHBvcykge1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpO1xuICAgIHZhciBpID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIGwgPSBzLmxlbmd0aDtcbiAgICB2YXIgYSwgYjtcbiAgICBpZiAoaSA8IDAgfHwgaSA+PSBsKSByZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjUuNScgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIElTX1dSQVAgPSB0eXBlICYgJGV4cG9ydC5XO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV07XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIga2V5LCBvd24sIG91dDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZiAob3duICYmIGhhcyhleHBvcnRzLCBrZXkpKSBjb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uIChDKSB7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgQykge1xuICAgICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEMoKTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYgKElTX1BST1RPKSB7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYgKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0pIGhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRvbmUsIHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKTtcbnZhciBzdGVwID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIga2luZCA9IHRoaXMuX2s7XG4gIHZhciBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYgKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKSB7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTtcbiIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbnZhciBET01JdGVyYWJsZXMgPSAoJ0NTU1J1bGVMaXN0LENTU1N0eWxlRGVjbGFyYXRpb24sQ1NTVmFsdWVMaXN0LENsaWVudFJlY3RMaXN0LERPTVJlY3RMaXN0LERPTVN0cmluZ0xpc3QsJyArXG4gICdET01Ub2tlbkxpc3QsRGF0YVRyYW5zZmVySXRlbUxpc3QsRmlsZUxpc3QsSFRNTEFsbENvbGxlY3Rpb24sSFRNTENvbGxlY3Rpb24sSFRNTEZvcm1FbGVtZW50LEhUTUxTZWxlY3RFbGVtZW50LCcgK1xuICAnTWVkaWFMaXN0LE1pbWVUeXBlQXJyYXksTmFtZWROb2RlTWFwLE5vZGVMaXN0LFBhaW50UmVxdWVzdExpc3QsUGx1Z2luLFBsdWdpbkFycmF5LFNWR0xlbmd0aExpc3QsU1ZHTnVtYmVyTGlzdCwnICtcbiAgJ1NWR1BhdGhTZWdMaXN0LFNWR1BvaW50TGlzdCxTVkdTdHJpbmdMaXN0LFNWR1RyYW5zZm9ybUxpc3QsU291cmNlQnVmZmVyTGlzdCxTdHlsZVNoZWV0TGlzdCxUZXh0VHJhY2tDdWVMaXN0LCcgK1xuICAnVGV4dFRyYWNrTGlzdCxUb3VjaExpc3QnKS5zcGxpdCgnLCcpO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IERPTUl0ZXJhYmxlcy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IERPTUl0ZXJhYmxlc1tpXTtcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV07XG4gIHZhciBwcm90byA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmIChwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10pIGhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgQ29uc3RydWN0b3IsIG5hbWUsIGZvcmJpZGRlbkZpZWxkKSB7XG4gIGlmICghKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSkge1xuICAgIHRocm93IFR5cGVFcnJvcihuYW1lICsgJzogaW5jb3JyZWN0IGludm9jYXRpb24hJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsInZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG52YXIgQlJFQUsgPSB7fTtcbnZhciBSRVRVUk4gPSB7fTtcbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUikge1xuICB2YXIgaXRlckZuID0gSVRFUkFUT1IgPyBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSk7XG4gIHZhciBmID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvciwgcmVzdWx0O1xuICBpZiAodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmIChpc0FycmF5SXRlcihpdGVyRm4pKSBmb3IgKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgcmVzdWx0ID0gZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICAgIGlmIChyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKSByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2UgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOykge1xuICAgIHJlc3VsdCA9IGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICAgIGlmIChyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKSByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuZXhwb3J0cy5CUkVBSyA9IEJSRUFLO1xuZXhwb3J0cy5SRVRVUk4gPSBSRVRVUk47XG4iLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIEQpIHtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvcjtcbiAgdmFyIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCBhcmdzLCB0aGF0KSB7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaW52b2tlID0gcmVxdWlyZSgnLi9faW52b2tlJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4vX2h0bWwnKTtcbnZhciBjZWwgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIHNldFRhc2sgPSBnbG9iYWwuc2V0SW1tZWRpYXRlO1xudmFyIGNsZWFyVGFzayA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZTtcbnZhciBNZXNzYWdlQ2hhbm5lbCA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbDtcbnZhciBEaXNwYXRjaCA9IGdsb2JhbC5EaXNwYXRjaDtcbnZhciBjb3VudGVyID0gMDtcbnZhciBxdWV1ZSA9IHt9O1xudmFyIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xudmFyIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgaWYgKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYgKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spIHtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbikge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIGkgPSAxO1xuICAgIHdoaWxlIChhcmd1bWVudHMubGVuZ3RoID4gaSkgYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpIHtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYgKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gU3BoZXJlIChKUyBnYW1lIGVuZ2luZSkgRGlzcGF0Y2ggQVBJXG4gIH0gZWxzZSBpZiAoRGlzcGF0Y2ggJiYgRGlzcGF0Y2gubm93KSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIERpc3BhdGNoLm5vdyhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmIChNZXNzYWdlQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICBwb3J0ID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmIChPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSkge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgbWFjcm90YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldDtcbnZhciBPYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG52YXIgaXNOb2RlID0gcmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGhlYWQsIGxhc3QsIG5vdGlmeTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhcmVudCwgZm47XG4gICAgaWYgKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKSBwYXJlbnQuZXhpdCgpO1xuICAgIHdoaWxlIChoZWFkKSB7XG4gICAgICBmbiA9IGhlYWQuZm47XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGhlYWQpIG5vdGlmeSgpO1xuICAgICAgICBlbHNlIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgIGlmIChwYXJlbnQpIHBhcmVudC5lbnRlcigpO1xuICB9O1xuXG4gIC8vIE5vZGUuanNcbiAgaWYgKGlzTm9kZSkge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIC8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlciwgZXhjZXB0IGlPUyBTYWZhcmkgLSBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMzM5XG4gIH0gZWxzZSBpZiAoT2JzZXJ2ZXIgJiYgIShnbG9iYWwubmF2aWdhdG9yICYmIGdsb2JhbC5uYXZpZ2F0b3Iuc3RhbmRhbG9uZSkpIHtcbiAgICB2YXIgdG9nZ2xlID0gdHJ1ZTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmIChQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSkge1xuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgdGFzayA9IHsgZm46IGZuLCBuZXh0OiB1bmRlZmluZWQgfTtcbiAgICBpZiAobGFzdCkgbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZiAoIWhlYWQpIHtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAyNS40LjEuNSBOZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcblxuZnVuY3Rpb24gUHJvbWlzZUNhcGFiaWxpdHkoQykge1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbiAoJCRyZXNvbHZlLCAkJHJlamVjdCkge1xuICAgIGlmIChyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCA9IGFGdW5jdGlvbihyZWplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gKEMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHsgZTogZmFsc2UsIHY6IGV4ZWMoKSB9O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgZTogdHJ1ZSwgdjogZSB9O1xuICB9XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQywgeCkge1xuICBhbk9iamVjdChDKTtcbiAgaWYgKGlzT2JqZWN0KHgpICYmIHguY29uc3RydWN0b3IgPT09IEMpIHJldHVybiB4O1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKEMpO1xuICB2YXIgcmVzb2x2ZSA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gIHJlc29sdmUoeCk7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufTtcbiIsInZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIHNhZmUpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIGlmIChzYWZlICYmIHRhcmdldFtrZXldKSB0YXJnZXRba2V5XSA9IHNyY1trZXldO1xuICAgIGVsc2UgaGlkZSh0YXJnZXQsIGtleSwgc3JjW2tleV0pO1xuICB9IHJldHVybiB0YXJnZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgQyA9IHR5cGVvZiBjb3JlW0tFWV0gPT0gJ2Z1bmN0aW9uJyA/IGNvcmVbS0VZXSA6IGdsb2JhbFtLRVldO1xuICBpZiAoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkgZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgbWljcm90YXNrID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi9fcGVyZm9ybScpO1xudmFyIHByb21pc2VSZXNvbHZlID0gcmVxdWlyZSgnLi9fcHJvbWlzZS1yZXNvbHZlJyk7XG52YXIgUFJPTUlTRSA9ICdQcm9taXNlJztcbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciAkUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFXTtcbnZhciBpc05vZGUgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJztcbnZhciBlbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBJbnRlcm5hbCwgbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBPd25Qcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmY7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgPSAkUHJvbWlzZS5yZXNvbHZlKDEpO1xuICAgIHZhciBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgICAgIGV4ZWMoZW1wdHksIGVtcHR5KTtcbiAgICB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpICYmIHByb21pc2UudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBGYWtlUHJvbWlzZTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uIChwcm9taXNlLCBpc1JlamVjdCkge1xuICBpZiAocHJvbWlzZS5fbikgcmV0dXJuO1xuICBwcm9taXNlLl9uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYztcbiAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92O1xuICAgIHZhciBvayA9IHByb21pc2UuX3MgPT0gMTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbDtcbiAgICAgIHZhciByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZTtcbiAgICAgIHZhciByZWplY3QgPSByZWFjdGlvbi5yZWplY3Q7XG4gICAgICB2YXIgZG9tYWluID0gcmVhY3Rpb24uZG9tYWluO1xuICAgICAgdmFyIHJlc3VsdCwgdGhlbiwgZXhpdGVkO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICBpZiAocHJvbWlzZS5faCA9PSAyKSBvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFuZGxlciA9PT0gdHJ1ZSkgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoZG9tYWluKSBkb21haW4uZW50ZXIoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpOyAvLyBtYXkgdGhyb3dcbiAgICAgICAgICAgIGlmIChkb21haW4pIHtcbiAgICAgICAgICAgICAgZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICAgICAgZXhpdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSkge1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChkb21haW4gJiYgIWV4aXRlZCkgZG9tYWluLmV4aXQoKTtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUgKGNoYWluLmxlbmd0aCA+IGkpIHJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBwcm9taXNlLl9jID0gW107XG4gICAgcHJvbWlzZS5fbiA9IGZhbHNlO1xuICAgIGlmIChpc1JlamVjdCAmJiAhcHJvbWlzZS5faCkgb25VbmhhbmRsZWQocHJvbWlzZSk7XG4gIH0pO1xufTtcbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92O1xuICAgIHZhciB1bmhhbmRsZWQgPSBpc1VuaGFuZGxlZChwcm9taXNlKTtcbiAgICB2YXIgcmVzdWx0LCBoYW5kbGVyLCBjb25zb2xlO1xuICAgIGlmICh1bmhhbmRsZWQpIHtcbiAgICAgIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbikge1xuICAgICAgICAgIGhhbmRsZXIoeyBwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIG5vdCB0cmlnZ2VyIGByZWplY3Rpb25IYW5kbGVkYCBldmVudCBpZiBpdCB3YXMgaGFuZGxlZCBoZXJlLCBOb2RlSlMgLSBzaG91bGRcbiAgICAgIHByb21pc2UuX2ggPSBpc05vZGUgfHwgaXNVbmhhbmRsZWQocHJvbWlzZSkgPyAyIDogMTtcbiAgICB9IHByb21pc2UuX2EgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHVuaGFuZGxlZCAmJiByZXN1bHQuZSkgdGhyb3cgcmVzdWx0LnY7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHJldHVybiBwcm9taXNlLl9oICE9PSAxICYmIChwcm9taXNlLl9hIHx8IHByb21pc2UuX2MpLmxlbmd0aCA9PT0gMDtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYgKGlzTm9kZSkge1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCkge1xuICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdiB9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICBwcm9taXNlLl92ID0gdmFsdWU7XG4gIHByb21pc2UuX3MgPSAyO1xuICBpZiAoIXByb21pc2UuX2EpIHByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICB2YXIgdGhlbjtcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkgdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAkcmVqZWN0LmNhbGwoeyBfdzogcHJvbWlzZSwgX2Q6IGZhbHNlIH0sIGUpOyAvLyB3cmFwXG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZiAoIVVTRV9OQVRJVkUpIHtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkUHJvbWlzZSwgUFJPTUlTRSwgJ19oJyk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHRoaXMsIDEpLCBjdHgoJHJlamVjdCwgdGhpcywgMSkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgSW50ZXJuYWwgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYgKHRoaXMuX2EpIHRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fcykgbm90aWZ5KHRoaXMsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbiAob25SZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIE93blByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9taXNlID0gbmV3IEludGVybmFsKCk7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xuICBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZS5mID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoQykge1xuICAgIHJldHVybiBDID09PSAkUHJvbWlzZSB8fCBDID09PSBXcmFwcGVyXG4gICAgICA/IG5ldyBPd25Qcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgOiBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgUHJvbWlzZTogJFByb21pc2UgfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpIHtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpO1xuICAgIHZhciAkJHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCkge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShMSUJSQVJZICYmIHRoaXMgPT09IFdyYXBwZXIgPyAkUHJvbWlzZSA6IHRoaXMsIHgpO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVzb2x2ZSA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciByZW1haW5pbmcgPSAxO1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICB2YXIgJGluZGV4ID0gaW5kZXgrKztcbiAgICAgICAgdmFyIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIGlmIChhbHJlYWR5Q2FsbGVkKSByZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgdmFsdWVzWyRpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKSB7XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gICAgdmFyIHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lKSByZWplY3QocmVzdWx0LnYpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtcHJvbWlzZS1maW5hbGx5XG4ndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xudmFyIHByb21pc2VSZXNvbHZlID0gcmVxdWlyZSgnLi9fcHJvbWlzZS1yZXNvbHZlJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5SLCAnUHJvbWlzZScsIHsgJ2ZpbmFsbHknOiBmdW5jdGlvbiAob25GaW5hbGx5KSB7XG4gIHZhciBDID0gc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIGNvcmUuUHJvbWlzZSB8fCBnbG9iYWwuUHJvbWlzZSk7XG4gIHZhciBpc0Z1bmN0aW9uID0gdHlwZW9mIG9uRmluYWxseSA9PSAnZnVuY3Rpb24nO1xuICByZXR1cm4gdGhpcy50aGVuKFxuICAgIGlzRnVuY3Rpb24gPyBmdW5jdGlvbiAoeCkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKEMsIG9uRmluYWxseSgpKS50aGVuKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHg7IH0pO1xuICAgIH0gOiBvbkZpbmFsbHksXG4gICAgaXNGdW5jdGlvbiA/IGZ1bmN0aW9uIChlKSB7XG4gICAgICByZXR1cm4gcHJvbWlzZVJlc29sdmUoQywgb25GaW5hbGx5KCkpLnRoZW4oZnVuY3Rpb24gKCkgeyB0aHJvdyBlOyB9KTtcbiAgICB9IDogb25GaW5hbGx5XG4gICk7XG59IH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtcHJvbWlzZS10cnlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSByZXF1aXJlKCcuL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5Jyk7XG52YXIgcGVyZm9ybSA9IHJlcXVpcmUoJy4vX3BlcmZvcm0nKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdQcm9taXNlJywgeyAndHJ5JzogZnVuY3Rpb24gKGNhbGxiYWNrZm4pIHtcbiAgdmFyIHByb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkuZih0aGlzKTtcbiAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oY2FsbGJhY2tmbik7XG4gIChyZXN1bHQuZSA/IHByb21pc2VDYXBhYmlsaXR5LnJlamVjdCA6IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmUpKHJlc3VsdC52KTtcbiAgcmV0dXJuIHByb21pc2VDYXBhYmlsaXR5LnByb21pc2U7XG59IH0pO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3LnByb21pc2UuZmluYWxseScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcucHJvbWlzZS50cnknKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlByb21pc2U7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3Byb21pc2UgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9wcm9taXNlXCIpO1xuXG52YXIgX3Byb21pc2UyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcHJvbWlzZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBnZW4gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHJldHVybiBuZXcgX3Byb21pc2UyLmRlZmF1bHQoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZnVuY3Rpb24gc3RlcChrZXksIGFyZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBfcHJvbWlzZTIuZGVmYXVsdC5yZXNvbHZlKHZhbHVlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgc3RlcChcIm5leHRcIiwgdmFsdWUpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgIHN0ZXAoXCJ0aHJvd1wiLCBlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdGVwKFwibmV4dFwiKTtcbiAgICB9KTtcbiAgfTtcbn07IiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgJGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBTID0gU3ltYm9sKCk7XG4gIHZhciBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGspIHsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDE7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICB2YXIgaXNFbnVtID0gcElFLmY7XG4gIHdoaWxlIChhTGVuID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IElPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBqKSBpZiAoaXNFbnVtLmNhbGwoUywga2V5ID0ga2V5c1tqKytdKSkgVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247XG4iLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYsICdPYmplY3QnLCB7IGFzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpIH0pO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfYXNzaWduID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2Fzc2lnblwiKTtcblxudmFyIF9hc3NpZ24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYXNzaWduKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gX2Fzc2lnbjIuZGVmYXVsdCB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59OyIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSwgJ09iamVjdCcsIHsgZGVmaW5lUHJvcGVydHk6IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmYgfSk7XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2MpIHtcbiAgcmV0dXJuICRPYmplY3QuZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIik7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmaW5lUHJvcGVydHkpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgKDAsIF9kZWZpbmVQcm9wZXJ0eTIuZGVmYXVsdCkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0oKTsiLCJ2YXIgY29sb3JzXyA9IHJlcXVpcmUoJ2NvbG9ycycpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGhlbHBlciB7XG5cblx0Y29uc3RydWN0b3IoY29uZmlnPXsgZGVidWc6dHJ1ZSB9KSB7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdH1cblxuXHR0aXRsZSh0aXRsZSkge1xuXHRcdGxldCBfdCA9ICcqKipcXCAnK3RpdGxlKydcXCAqKionO1xuXHRcdGxldCBfbCA9IHRoaXMucmVwZWF0KCcqJyxfdC5sZW5ndGgpO1xuXHRcdGNvbnNvbGUubG9nKF9sLmdyZWVuKTtcblx0XHRjb25zb2xlLmxvZyhfdC5ncmVlbik7XG5cdFx0Y29uc29sZS5sb2coX2wuZ3JlZW4pO1xuXHR9XG5cblx0cmVwZWF0KHN0cmluZyxjb3VudCkge1xuXHRcdGlmIChjb3VudDwxKSByZXR1cm4gJyc7XG5cdFx0bGV0IHJlc3VsdD0nJywgcGF0dGVybiA9IHN0cmluZy52YWx1ZU9mKCk7XG5cdFx0d2hpbGUgKGNvdW50PjEpIHtcblx0XHRcdGlmIChjb3VudCAmIDEpIHJlc3VsdCArPSBwYXR0ZXJuO1xuXHRcdCAgICBjb3VudCA+Pj49IDEsIHBhdHRlcm4gKz0gcGF0dGVybjtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdCArIHBhdHRlcm47XG5cdH1cblxuXHRmaXhBY2NlbnRzKHRleHQpIHtcblx0XHRsZXQgY3RleHQgPSB0ZXh0O1xuXHRcdGxldCBmcm9tID0gJyc7XG5cdFx0Y29uc3QgdGFibGUgPSB7XG5cdFx0XHQnQzEnXHQ6XHQnQScsXG5cdFx0XHQnRTEnXHQ6XHQnw6EnLFxuXHRcdFx0J0M5J1x0Olx0J0UnLFxuXHRcdFx0J0U5J1x0Olx0J8OpJyxcblx0XHRcdCdDRCdcdDpcdCdJJyxcblx0XHRcdCdFRCdcdDpcdCfDrScsXG5cdFx0XHQnRDEnXHQ6XHQnw5EnLFxuXHRcdFx0J0YxJ1x0Olx0J8OxJyxcblx0XHRcdCdEMydcdDpcdCdPJyxcblx0XHRcdCdGMydcdDpcdCfDsycsXG5cdFx0XHQnREEnXHQ6XHQnVScsXG5cdFx0XHQnRkEnXHQ6XHQnw7onLFxuXHRcdFx0J0RDJ1x0Olx0J1UnLFxuXHRcdFx0J0ZDJ1x0Olx0J8O8Jyxcblx0XHRcdCdBQidcdDpcdCfCqycsXG5cdFx0XHQnQkInXHQ6XHQnwrsnLFxuXHRcdFx0J0JGJ1x0Olx0J8K/Jyxcblx0XHRcdCdBMSdcdDpcdCfCoScsXG5cdFx0XHQnODAnXHQ6XHQn4oKsJyxcblx0XHRcdCcyMEE3J1x0Olx0J1B0cydcblx0XHR9O1xuXHRcdGZvciAoZnJvbSBpbiB0YWJsZSkge1xuXHRcdFx0Y3RleHQucmVwbGFjZSgnJiN4Jytmcm9tLHRhYmxlW2Zyb21dKTtcblx0XHR9XG5cdFx0cmV0dXJuIGN0ZXh0O1xuXHR9IFxuXG59IiwiaW1wb3J0IGhlbHBlciBmcm9tICdoZWxwZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGRzbF9wYXJzZXIge1xuXG5cdGNvbnN0cnVjdG9yKHRoZWZpbGUsIGNvbmZpZykge1xuXHRcdGxldCBkZWZfY29uZmlnID0ge1xuXHRcdFx0Y2FuY2VsbGVkOmZhbHNlLFxuXHRcdFx0ZGVidWc6dHJ1ZVxuXHRcdH07XG5cdFx0dGhpcy5maWxlID0gdGhlZmlsZTtcblx0XHR0aGlzLmNvbmZpZyA9IHsuLi5jb25maWcsIC4uLmRlZl9jb25maWd9O1xuXHRcdHRoaXMuaGVscCA9IG5ldyBoZWxwZXIoKTtcblx0XHR0aGlzLiQgPSBudWxsO1xuXHR9XG5cblx0YXN5bmMgcHJvY2VzcygpIHtcblx0XHRpZiAodGhpcy5maWxlIT0nJykge1xuXHRcdFx0dGhpcy5oZWxwLnRpdGxlKCdEU0wgUGFyc2VyIGZvciAnK3RoaXMuZmlsZSk7XG5cdFx0XHRpZiAodGhpcy5jb25maWcuZGVidWcpIGNvbnNvbGUudGltZSgncHJvY2VzcycpO1xuXHRcdFx0bGV0IGNoZWVyaW8gPSByZXF1aXJlKCdjaGVlcmlvJyksIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cdFx0XHRsZXQgZnMgPSByZXF1aXJlKCdmcycpLnByb21pc2VzO1xuXHRcdFx0bGV0IGZpbGVFeGlzdHMgPSBmYWxzZSwgZGF0YT0nJztcblx0XHRcdGRhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZSh0aGlzLmZpbGUsJ3V0Zi04Jyk7XG5cdFx0XHQvLyBmaXggYWNjZW50cyAtPiB1bmljb2RlIHRvIGxhdGluIGNoYXJzXG5cdFx0XHRpZiAodGhpcy5jb25maWcuZGVidWcpIGNvbnNvbGUubG9nKCdmaXhpbmcgYWNjZW50cycpO1xuXHRcdFx0ZGF0YSA9IHRoaXMuaGVscC5maXhBY2NlbnRzKGRhdGEpO1xuXHRcdFx0Ly8gcGFyc2UgWE1MIFxuXHRcdFx0dGhpcy4kID0gY2hlZXJpby5sb2FkKGRhdGEsIHsgaWdub3JlV2hpdGVzcGFjZTogZmFsc2UsIHhtbE1vZGU6IHRydWUsIGRlY29kZUVudGl0aWVzOmZhbHNlIH0pO1xuXHRcdFx0Ly8gcmVtb3ZlIGNhbmNlbGxlZCBub2RlcyBpZiByZXF1ZXN0ZWRcblx0XHRcdGlmICghdGhpcy5jb25maWcuY2FuY2VsbGVkKSB7XG5cdFx0XHRcdGlmICh0aGlzLmNvbmZpZy5kZWJ1ZykgY29uc29sZS5sb2coJ3JlbW92aW5nIGNhbmNlbGxlZCBub2RlcyBmcm9tIHRyZWUnKTtcblx0XHRcdFx0dGhpcy4kKCdpY29uW0JVSUxUSU4qPWJ1dHRvbl9jYW5jZWxdJykucGFyZW50KCkucmVtb3ZlKCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5jb25maWcuZGVidWcpIGNvbnNvbGUudGltZUVuZCgncHJvY2VzcycpO1xuXHRcdFx0Ly9pZiAodGhpcy5jb25maWcuZGVidWcpIGNvbnNvbGUubG9nKCdkc2wgZHVtcCcsdGhpcy4kKCcqJykuaHRtbCgpKTtcblx0XHR9XG5cdH1cblxuXHRnZXRQYXJzZXIoKSB7XG5cdFx0cmV0dXJuIHRoaXMuJDtcblx0fVxuXG5cdGFzeW5jIGdldE5vZGVzKHt0ZXh0LGF0dHJpYnV0ZSxhdHRyaWJ1dGVfdmFsdWUsaWNvbixsZXZlbCxsaW5rLHJlY3Vyc2U9dHJ1ZX09e30pIHtcblx0XHRsZXQgcmVzcCA9IFtdLCBub2Rlcz1udWxsLCBtZT10aGlzO1xuXHRcdGlmICh0ZXh0KSB7XG5cdFx0XHRsZXQgdG1wID0gdGV4dC50b1N0cmluZygpLnJlcGxhY2UoLyAvZywnXFxcXCAnKTtcblx0XHRcdG5vZGVzID0gdGhpcy4kKGBub2RlW3RleHQqPSR7dG1wfV1gKTtcblx0XHR9IGVsc2UgaWYgKGF0dHJpYnV0ZSkge1xuXHRcdFx0bGV0IHRtcCA9IGF0dHJpYnV0ZS5yZXBsYWNlKC8gL2csJ1xcXFwgJyk7XG5cdFx0XHRub2RlcyA9IHRoaXMuJChgYXR0cmlidXRlW25hbWUqPSR7dG1wfV1gKS5wYXJlbnQoJ25vZGUnKTtcblx0XHR9IGVsc2UgaWYgKGF0dHJpYnV0ZV92YWx1ZSkge1xuXHRcdFx0bGV0IHRtcCA9IGF0dHJpYnV0ZV92YWx1ZS5yZXBsYWNlKC8gL2csJ1xcXFwgJyk7XG5cdFx0XHRub2RlcyA9IHRoaXMuJChgYXR0cmlidXRlW3ZhbHVlKj0ke3RtcH1dYCkucGFyZW50KCdub2RlJyk7XG5cdFx0fSBlbHNlIGlmIChpY29uKSB7XG5cdFx0XHRsZXQgdG1wID0gaWNvbi5yZXBsYWNlKC8gL2csJ1xcXFwgJyk7XG5cdFx0XHRub2RlcyA9IHRoaXMuJChgaWNvbltidWlsdGluKj0ke3RtcH1dYCkucGFyZW50KCdub2RlJyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCkge1xuXHRcdFx0bm9kZXMgPSB0aGlzLiQoYG5vZGVgKS5maWx0ZXIoZnVuY3Rpb24oaSxlbGVtKSB7XG5cdFx0XHRcdGxldCBwYWRyZXMgPSAtMTtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRwYWRyZXMgPSBtZS4kKGVsZW0pLnBhcmVudHMoJ25vZGUnKS5sZW5ndGgrMTtcblx0XHRcdFx0fSBjYXRjaChlZSkge31cblx0XHRcdFx0cmV0dXJuIHBhZHJlcz09PWxldmVsO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIGlmIChsaW5rKSB7XG5cdFx0XHRsZXQgdG1wID0gbGluay5yZXBsYWNlKC8gL2csJ1xcXFwgJyk7XG5cdFx0XHRub2RlcyA9IHRoaXMuJChgbm9kZVtsaW5rKj0ke3RtcH1dYCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG5vZGVzID0gdGhpcy4kKGBub2RlYCk7XG5cdFx0fVxuXHRcdC8vIGl0ZXJhdGUgbm9kZXMgYW5kIGJ1aWxkIHJlc3AgYXJyYXlcblx0XHRpZiAobm9kZXMhPW51bGwpIHtcblx0XHRcdG5vZGVzLm1hcChhc3luYyBmdW5jdGlvbihpLGVsZW0pIHtcblx0XHRcdFx0bGV0IGN1ciA9IG1lLiQoZWxlbSk7XG5cdFx0XHRcdGlmICh0eXBlb2YgY3VyLmF0dHIoJ0lEJykgIT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRsZXQgdG1wID0gYXdhaXQgbWUuZ2V0Tm9kZSh7IGlkOmN1ci5hdHRyKCdJRCcpLCByZWN1cnNlOnJlY3Vyc2UgfSk7XG5cdFx0XHRcdFx0cmVzcC5wdXNoKHRtcCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzcDtcblx0fVxuXG5cdGFzeW5jIGdldE5vZGUoe2lkPXRoaXMudGhyb3dJZk1pc3NpbmcoJ2lkJyksIHJlY3Vyc2U9dHJ1ZSwganVzdGxldmVsLCBkYXRlcz10cnVlfT17fSkge1xuXHRcdGlmICh0aGlzLiQ9PT1udWxsKSB0aHJvdyBuZXcgRXJyb3IoJ2NhbGwgcHJvY2VzcygpIGZpcnN0IScpO1xuXHRcdGxldCBtZSA9IHRoaXM7XG5cdFx0bGV0IHJlc3AgPSB7IFx0bGV2ZWw6LTEsXHR0ZXh0OicnLFx0dGV4dF9yaWNoOicnLFx0dGV4dF9ub2RlOicnLFx0aW1hZ2U6JycsXG5cdFx0XHRcdFx0XHRjbG91ZDpcblx0XHRcdFx0XHRcdFx0eyB1c2VkOmZhbHNlLCBiZ2NvbG9yOicnIH0sXHRcblx0XHRcdFx0XHRcdGFycm93czpbXSwgXHRub2RlczpbXSxcblx0XHRcdFx0XHRcdGZvbnQ6XG5cdFx0XHRcdFx0XHRcdHsgZmFjZTonU2Fuc1NlcmlmJywgc2l6ZToxMiwgYm9sZDpmYWxzZSwgaXRhbGljOmZhbHNlIH0sXG5cdFx0XHRcdFx0XHRzdHlsZTonJyxcdFx0Y29sb3I6ICcnLFx0Ymdjb2xvcjogJycsXHRsaW5rOicnLFx0cG9zaXRpb246JycsXG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzOiBbXSxcdGljb25zOiBbXSxcdFxuXHRcdFx0XHRcdFx0ZGF0ZV9tb2RpZmllZDogbmV3IERhdGUoKSxcdFxuXHRcdFx0XHRcdFx0ZGF0ZV9jcmVhdGVkOiBuZXcgRGF0ZSgpLFxuXHRcdFx0XHRcdFx0dmFsaWQ6IHRydWVcblx0XHRcdFx0XHR9O1xuXHRcdGxldCBub2RlcyA9IG1lLiQoJ25vZGVbSUQ9JytpZCsnXScpLmVhY2goYXN5bmMgZnVuY3Rpb24oaSxlbGVtKSB7XG5cdFx0XHRsZXQgY3VyID0gbWUuJChlbGVtKSwgcGFfYWMgPSAtMTtcblx0XHRcdHJlc3AuaWQgPSBjdXIuYXR0cignSUQnKTtcblx0XHRcdHJlc3AubGV2ZWwgPSBjdXIucGFyZW50cygnbm9kZScpLmxlbmd0aCsxO1xuXHRcdFx0Ly8gbGltaXQgbGV2ZWwgaWYgZGVmaW5lZFxuXHRcdFx0aWYgKGp1c3RsZXZlbCAmJiByZXNwLmxldmVsIT1qdXN0bGV2ZWwpIHtcblx0XHRcdFx0cmVzcC52YWxpZD1mYWxzZTtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0Ly9cblx0XHRcdGlmICh0eXBlb2YgY3VyLmF0dHIoJ0xJTksnKSAhPSAndW5kZWZpbmVkJykgcmVzcC5saW5rID0gY3VyLmF0dHIoJ0xJTksnKS5zcGxpdCgnIycpLmpvaW4oJycpO1xuXHRcdFx0aWYgKHR5cGVvZiBjdXIuYXR0cignUE9TSVRJT04nKSAhPSAndW5kZWZpbmVkJykgcmVzcC5wb3NpdGlvbiA9IGN1ci5hdHRyKCdQT1NJVElPTicpO1xuXHRcdFx0aWYgKHR5cGVvZiBjdXIuYXR0cignQ09MT1InKSAhPSAndW5kZWZpbmVkJykgcmVzcC5jb2xvciA9IGN1ci5hdHRyKCdDT0xPUicpO1xuXHRcdFx0aWYgKHR5cGVvZiBjdXIuYXR0cignQkFDS0dST1VORF9DT0xPUicpICE9ICd1bmRlZmluZWQnKSByZXNwLmJnY29sb3IgPSBjdXIuYXR0cignQkFDS0dST1VORF9DT0xPUicpO1xuXHRcdFx0aWYgKHR5cGVvZiBjdXIuYXR0cignU1RZTEUnKSAhPSAndW5kZWZpbmVkJykgcmVzcC5zdHlsZSA9IGN1ci5hdHRyKCdTVFlMRScpO1xuXHRcdFx0aWYgKHR5cGVvZiBjdXIuYXR0cignVEVYVCcpICE9ICd1bmRlZmluZWQnKSByZXNwLnRleHQgPSBjdXIuYXR0cignVEVYVCcpO1xuXHRcdFx0Ly8gZGF0ZXMgcGFyc2luZ1xuXHRcdFx0aWYgKGRhdGVzKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgY3VyLmF0dHIoJ0NSRUFURUQnKSAhPSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdHJlc3AuZGF0ZV9jcmVhdGVkID0gbmV3IERhdGUocGFyc2VGbG9hdChjdXIuYXR0cignQ1JFQVRFRCcpKSk7XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0eXBlb2YgY3VyLmF0dHIoJ01PRElGSUVEJykgIT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRyZXNwLmRhdGVfbW9kaWZpZWQgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGN1ci5hdHRyKCdNT0RJRklFRCcpKSk7XHRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly8gYXR0cmlidXRlc1xuXHRcdFx0Y3VyLmZpbmQoJ25vZGVbSUQ9JytyZXNwLmlkKyddID4gYXR0cmlidXRlJykubWFwKGZ1bmN0aW9uKGEsYV9lbGVtKSB7XG5cdFx0XHRcdGxldCB0bXBfZmlsYSA9IHt9LCBfZmlsYSA9IG1lLiQoYV9lbGVtKTtcblx0XHRcdFx0dG1wX2ZpbGFbX2ZpbGEuYXR0cignTkFNRScpXSA9IF9maWxhLmF0dHIoJ1ZBTFVFJyk7XG5cdFx0XHRcdHJlc3AuYXR0cmlidXRlcy5wdXNoKHRtcF9maWxhKTtcblx0XHRcdH0pO1xuXHRcdFx0Ly8gaWNvbnNcblx0XHRcdGN1ci5maW5kKCdub2RlW0lEPScrcmVzcC5pZCsnXSA+IGljb24nKS5tYXAoZnVuY3Rpb24oYSxhX2VsZW0pIHtcblx0XHRcdFx0cmVzcC5pY29ucy5wdXNoKG1lLiQoYV9lbGVtKS5hdHRyKCdCVUlMVElOJykpO1xuXHRcdFx0fSk7XG5cdFx0XHQvLyBmb250cyBkZWZpbml0aW9uXG5cdFx0XHRjdXIuZmluZCgnbm9kZVtJRD0nK3Jlc3AuaWQrJ10gPiBmb250JykubWFwKGZ1bmN0aW9uKGEsYV9lbGVtKSB7XG5cdFx0XHRcdGxldCBfZmlsYSA9IG1lLiQoYV9lbGVtKTtcblx0XHRcdFx0cmVzcC5mb250LmZhY2UgPSBfZmlsYS5hdHRyKCdOQU1FJyk7XG5cdFx0XHRcdHJlc3AuZm9udC5zaXplID0gX2ZpbGEuYXR0cignU0laRScpO1xuXHRcdFx0XHRpZiAodHlwZW9mIF9maWxhLmF0dHIoJ0JPTEQnKSAhPSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdHJlc3AuZm9udC5ib2xkID0gX2ZpbGEuYXR0cignQk9MRCcpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0eXBlb2YgX2ZpbGEuYXR0cignSVRBTElDJykgIT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRyZXNwLmZvbnQuaXRhbGljID0gX2ZpbGEuYXR0cignSVRBTElDJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Ly8gY2xvdWQgZGVmaW5pdGlvblxuXHRcdFx0Y3VyLmZpbmQoJ25vZGVbSUQ9JytyZXNwLmlkKyddID4gY2xvdWQnKS5tYXAoZnVuY3Rpb24oYSxhX2VsZW0pIHtcblx0XHRcdFx0bGV0IF9maWxhID0gbWUuJChhX2VsZW0pO1xuXHRcdFx0XHRyZXNwLmNsb3VkLnVzZWQgPSB0cnVlO1xuXHRcdFx0XHRpZiAodHlwZW9mIF9maWxhLmF0dHIoJ0NPTE9SJykgIT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0XHRyZXNwLmNsb3VkLmJnY29sb3IgPSBfZmlsYS5hdHRyKCdDT0xPUicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdC8vIGdldCBpbWFnZSBpZiBhbnkgb24gbm9kZVxuXHRcdFx0Y3VyLmZpbmQoJ25vZGVbSUQ9JytyZXNwLmlkKyddID4gcmljaGNvbnRlbnRbVFlQRT1OT0RFXSBib2R5JykubWFwKGZ1bmN0aW9uKGEsYV9lbGVtKSB7XG5cdFx0XHRcdHJlc3AudGV4dF9yaWNoID0gbWUuJChhX2VsZW0pLmh0bWwoKTtcblx0XHRcdFx0bWUuJChhX2VsZW0pLmZpbmQoJ2ltZ1tzcmNdJykubWFwKGZ1bmN0aW9uKGksaV9lbGVtKSB7XG5cdFx0XHRcdFx0cmVzcC5pbWFnZSA9IG1lLiQoaV9lbGVtKS5hdHRyKCdzcmMnKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdC8vIGdldCBub3RlcyBvbiBub2RlIGlmIGFueVxuXHRcdFx0Y3VyLmZpbmQoJ25vZGVbSUQ9JytyZXNwLmlkKyddID4gcmljaGNvbnRlbnRbVFlQRT1OT1RFXSBib2R5JykubWFwKGZ1bmN0aW9uKGEsYV9lbGVtKSB7XG5cdFx0XHRcdHJlc3AudGV4dF9ub2RlID0gbWUuJChhX2VsZW0pLnRleHQoKTtcblx0XHRcdH0pO1xuXHRcdFx0Ly8gZ2V0IGRlZmluZWQgYXJyb3dzIG9uIG5vZGUgaWYgYW55XG5cdFx0XHRjdXIuZmluZCgnbm9kZVtJRD0nK3Jlc3AuaWQrJ10gPiBhcnJvd2xpbmsnKS5tYXAoZnVuY3Rpb24oYSxhX2VsZW0pIHtcblx0XHRcdFx0bGV0IF9maWxhID0gbWUuJChhX2VsZW0pLCBfdG1wX2Y9eyB0YXJnZXQ6JycsIGNvbG9yOicnLCBzdHlsZTonJyB9LCBfdG1wYT17fTtcblx0XHRcdFx0X3RtcF9mLnRhcmdldCA9IF9maWxhLmF0dHIoJ0RFU1RJTkFUSU9OJyk7XG5cdFx0XHRcdGlmICh0eXBlb2YgX2ZpbGEuYXR0cignQ09MT1InKSAhPSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRcdF90bXBfZi5jb2xvciA9IF9maWxhLmF0dHIoJ0NPTE9SJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3RtcGEudHlwZSA9IF9maWxhLmF0dHIoJ1NUQVJUQVJST1cnKSArICctJyArIF9maWxhLmF0dHIoJ0VOREFSUk9XJyk7XG5cdFx0XHRcdGlmIChfdG1wYS50eXBlLmluZGV4T2YoJ05vbmUtRGVmYXVsdCcpIT0tMSkge1xuXHRcdFx0XHRcdF90bXBfZi5zdHlsZSA9ICdzb3VyY2UtdG8tdGFyZ2V0Jztcblx0XHRcdFx0fSBlbHNlIGlmIChfdG1wYS50eXBlLmluZGV4T2YoJ0RlZmF1bHQtTm9uZScpIT0tMSkge1xuXHRcdFx0XHRcdF90bXBfZi5zdHlsZSA9ICd0YXJnZXQtdG8tc291cmNlJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfdG1wX2Yuc3R5bGUgPSAnYm90aC13YXlzJztcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXNwLmFycm93cy5wdXNoKF90bXBfZik7XG5cdFx0XHR9KTtcblx0XHRcdC8vIGdldCBjaGlsZHJlbiBub2RlcyAuLiAodXNpbmcgbXlzZWxmIGZvciBlYWNoIGNoaWxkKVxuXHRcdFx0aWYgKHJlY3Vyc2U9PXRydWUpIHtcblx0XHRcdFx0Y3VyLmZpbmQoJ25vZGUnKS5tYXAoYXN5bmMgZnVuY3Rpb24oYSxhX2VsZW0pIHtcblx0XHRcdFx0XHRsZXQgX25vZG8gPSBtZS4kKGFfZWxlbSk7XG5cdFx0XHRcdFx0bGV0IGhpam8gPSBhd2FpdCBtZS5nZXROb2RlKHsgaWQ6X25vZG8uYXR0cignSUQnKSwgcmVjdXJzZTpyZWN1cnNlLCBqdXN0bGV2ZWw6cmVzcC5sZXZlbCsxIH0pO1xuXHRcdFx0XHRcdGlmIChoaWpvLnZhbGlkKSB7XG5cdFx0XHRcdFx0XHRkZWxldGUgaGlqby52YWxpZDtcblx0XHRcdFx0XHRcdHJlc3Aubm9kZXMucHVzaChoaWpvKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0Ly8gYnJlYWsgbG9vcFxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0pO1xuXHRcdC8vIHJlbW92ZSAndmFsaWQnIGtleSBpZiBqdXN0TGV2ZWwgaXMgbm90IGRlZmluZWRcblx0XHRpZiAoIWp1c3RsZXZlbCkgZGVsZXRlIHJlc3AudmFsaWQ7XG5cdFx0Ly8gcmVwbHlcblx0XHRyZXR1cm4gcmVzcDtcblx0fVxuXG5cdGFzeW5jIGdldFBhcmVudE5vZGUoe2lkPXRoaXMudGhyb3dJZk1pc3NpbmcoJ2lkJyl9PXt9KSB7XG5cdFx0aWYgKHRoaXMuJD09PW51bGwpIHRocm93IG5ldyBFcnJvcignY2FsbCBwcm9jZXNzKCkgZmlyc3QhJyk7XG5cdFx0bGV0IHBhZHJlID0gdGhpcy4kKGBub2RlW0lEPSR7aWR9XWApLnBhcmVudCgnbm9kZScpO1xuXHRcdGxldCByZXNwID0ge30sIG1lID0gdGhpcztcblx0XHRpZiAodHlwZW9mIHBhZHJlLmF0dHIoJ0lEJykgIT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHJlc3AgPSBhd2FpdCBtZS5nZXROb2RlKHsgaWQ6cGFkcmUuYXR0cignSUQnKSwgcmVjdXJzZTpmYWxzZSB9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHJlc3A7XG5cdH1cblxuXG5cdC8vICoqKioqKioqKioqKioqKioqKioqXG5cdC8vIHByaXZhdGUgbWV0aG9kc1xuXHQvLyAqKioqKioqKioqKioqKioqKioqKlxuXG5cdHRocm93SWZNaXNzaW5nKG5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nICcrbmFtZSsnIHBhcmFtZXRlciEnKTtcbiAgICB9XG5cblx0c2hvd21lKCkge1xuXHRcdHRoaXMuaGVscC50aXRsZSgnVEVTVCcpO1xuXHRcdGNvbnNvbGUubG9nKCdkZWJ1ZyB0ZXN0Jyx7IHRoZWZpbGU6dGhpcy5maWxlLCBjb25maWc6dGhpcy5jb25maWcgfSk7XG5cdH1cblxufVxuIl0sIm5hbWVzIjpbInJlcXVpcmUkJDAiLCJkb2N1bWVudCIsInJlcXVpcmUkJDIiLCJkUCIsImNyZWF0ZURlc2MiLCJjb3JlIiwiZ2xvYmFsIiwiaGlkZSIsIm1pbiIsInJlcXVpcmUkJDEiLCJJRV9QUk9UTyIsIlBST1RPVFlQRSIsIiRleHBvcnQiLCJUQUciLCJJVEVSQVRPUiIsImNlbCIsImh0bWwiLCJwcm9jZXNzIiwiUHJvbWlzZSIsIlNQRUNJRVMiLCJERVNDUklQVE9SUyIsIlR5cGVFcnJvciIsImlzTm9kZSIsIm5ld1Byb21pc2VDYXBhYmlsaXR5IiwibmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUiLCJyZXF1aXJlJCQ0IiwicmVxdWlyZSQkNiIsImNvbG9yc18iLCJyZXF1aXJlIiwiaGVscGVyIiwiY29uZmlnIiwiZGVidWciLCJ0aXRsZSIsIl90IiwiX2wiLCJyZXBlYXQiLCJsZW5ndGgiLCJjb25zb2xlIiwibG9nIiwiZ3JlZW4iLCJzdHJpbmciLCJjb3VudCIsInJlc3VsdCIsInBhdHRlcm4iLCJ2YWx1ZU9mIiwidGV4dCIsImN0ZXh0IiwiZnJvbSIsInRhYmxlIiwicmVwbGFjZSIsImRzbF9wYXJzZXIiLCJ0aGVmaWxlIiwiZGVmX2NvbmZpZyIsImNhbmNlbGxlZCIsImZpbGUiLCJoZWxwIiwiJCIsInRpbWUiLCJjaGVlcmlvIiwicGF0aCIsImZzIiwicHJvbWlzZXMiLCJmaWxlRXhpc3RzIiwiZGF0YSIsInJlYWRGaWxlIiwiZml4QWNjZW50cyIsImxvYWQiLCJpZ25vcmVXaGl0ZXNwYWNlIiwieG1sTW9kZSIsImRlY29kZUVudGl0aWVzIiwicGFyZW50IiwicmVtb3ZlIiwidGltZUVuZCIsImF0dHJpYnV0ZSIsImF0dHJpYnV0ZV92YWx1ZSIsImljb24iLCJsZXZlbCIsImxpbmsiLCJyZWN1cnNlIiwicmVzcCIsIm5vZGVzIiwibWUiLCJ0bXAiLCJ0b1N0cmluZyIsImZpbHRlciIsImkiLCJlbGVtIiwicGFkcmVzIiwicGFyZW50cyIsImVlIiwibWFwIiwiY3VyIiwiYXR0ciIsImdldE5vZGUiLCJpZCIsInB1c2giLCJ0aHJvd0lmTWlzc2luZyIsImp1c3RsZXZlbCIsImRhdGVzIiwiRXJyb3IiLCJ0ZXh0X3JpY2giLCJ0ZXh0X25vZGUiLCJpbWFnZSIsImNsb3VkIiwidXNlZCIsImJnY29sb3IiLCJhcnJvd3MiLCJmb250IiwiZmFjZSIsInNpemUiLCJib2xkIiwiaXRhbGljIiwic3R5bGUiLCJjb2xvciIsInBvc2l0aW9uIiwiYXR0cmlidXRlcyIsImljb25zIiwiZGF0ZV9tb2RpZmllZCIsIkRhdGUiLCJkYXRlX2NyZWF0ZWQiLCJ2YWxpZCIsImVhY2giLCJwYV9hYyIsInNwbGl0Iiwiam9pbiIsInBhcnNlRmxvYXQiLCJmaW5kIiwiYSIsImFfZWxlbSIsInRtcF9maWxhIiwiX2ZpbGEiLCJpX2VsZW0iLCJfdG1wX2YiLCJ0YXJnZXQiLCJfdG1wYSIsInR5cGUiLCJpbmRleE9mIiwiX25vZG8iLCJoaWpvIiwicGFkcmUiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Q0FBQTs7Ozs7OztDQU9BLENBQUMsQ0FBQyxTQUFTLE1BQU0sRUFBRTs7R0FHakIsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztHQUMxQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO0dBQy9CLElBQUksU0FBUyxDQUFDO0dBQ2QsSUFBSSxPQUFPLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDekQsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUM7R0FDdEQsSUFBSSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsYUFBYSxJQUFJLGlCQUFpQixDQUFDO0dBQ3JFLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFdBQVcsSUFBSSxlQUFlLENBQUM7O0dBRS9ELElBQUksUUFBUSxHQUFHLFFBQWEsS0FBSyxRQUFRLENBQUM7R0FDMUMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDO0dBQ3hDLElBQUksT0FBTyxFQUFFO0tBQ1gsSUFBSSxRQUFRLEVBQUU7OztPQUdaLGNBQWMsR0FBRyxPQUFPLENBQUM7TUFDMUI7OztLQUdELE9BQU87SUFDUjs7OztHQUlELE9BQU8sR0FBRyxNQUFNLENBQUMsa0JBQWtCLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztHQUVyRSxTQUFTLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7O0tBRWpELElBQUksY0FBYyxHQUFHLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxZQUFZLFNBQVMsR0FBRyxPQUFPLEdBQUcsU0FBUyxDQUFDO0tBQzdGLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3hELElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQzs7OztLQUk3QyxTQUFTLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7O0tBRTdELE9BQU8sU0FBUyxDQUFDO0lBQ2xCO0dBQ0QsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7OztHQVlwQixTQUFTLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtLQUM5QixJQUFJO09BQ0YsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7TUFDbkQsQ0FBQyxPQUFPLEdBQUcsRUFBRTtPQUNaLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztNQUNwQztJQUNGOztHQUVELElBQUksc0JBQXNCLEdBQUcsZ0JBQWdCLENBQUM7R0FDOUMsSUFBSSxzQkFBc0IsR0FBRyxnQkFBZ0IsQ0FBQztHQUM5QyxJQUFJLGlCQUFpQixHQUFHLFdBQVcsQ0FBQztHQUNwQyxJQUFJLGlCQUFpQixHQUFHLFdBQVcsQ0FBQzs7OztHQUlwQyxJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQzs7Ozs7O0dBTTFCLFNBQVMsU0FBUyxHQUFHLEVBQUU7R0FDdkIsU0FBUyxpQkFBaUIsR0FBRyxFQUFFO0dBQy9CLFNBQVMsMEJBQTBCLEdBQUcsRUFBRTs7OztHQUl4QyxJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztHQUMzQixpQkFBaUIsQ0FBQyxjQUFjLENBQUMsR0FBRyxZQUFZO0tBQzlDLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQzs7R0FFRixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO0dBQ3JDLElBQUksdUJBQXVCLEdBQUcsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUN6RSxJQUFJLHVCQUF1QjtPQUN2Qix1QkFBdUIsS0FBSyxFQUFFO09BQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsY0FBYyxDQUFDLEVBQUU7OztLQUd4RCxpQkFBaUIsR0FBRyx1QkFBdUIsQ0FBQztJQUM3Qzs7R0FFRCxJQUFJLEVBQUUsR0FBRywwQkFBMEIsQ0FBQyxTQUFTO0tBQzNDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0dBQ3pELGlCQUFpQixDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsV0FBVyxHQUFHLDBCQUEwQixDQUFDO0dBQzFFLDBCQUEwQixDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQztHQUMzRCwwQkFBMEIsQ0FBQyxpQkFBaUIsQ0FBQztLQUMzQyxpQkFBaUIsQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUM7Ozs7R0FJdEQsU0FBUyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUU7S0FDeEMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLE1BQU0sRUFBRTtPQUNuRCxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsU0FBUyxHQUFHLEVBQUU7U0FDaEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNsQyxDQUFDO01BQ0gsQ0FBQyxDQUFDO0lBQ0o7O0dBRUQsT0FBTyxDQUFDLG1CQUFtQixHQUFHLFNBQVMsTUFBTSxFQUFFO0tBQzdDLElBQUksSUFBSSxHQUFHLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDO0tBQzlELE9BQU8sSUFBSTtTQUNQLElBQUksS0FBSyxpQkFBaUI7OztTQUcxQixDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLElBQUksTUFBTSxtQkFBbUI7U0FDdkQsS0FBSyxDQUFDO0lBQ1gsQ0FBQzs7R0FFRixPQUFPLENBQUMsSUFBSSxHQUFHLFNBQVMsTUFBTSxFQUFFO0tBQzlCLElBQUksTUFBTSxDQUFDLGNBQWMsRUFBRTtPQUN6QixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO01BQzNELE1BQU07T0FDTCxNQUFNLENBQUMsU0FBUyxHQUFHLDBCQUEwQixDQUFDO09BQzlDLElBQUksRUFBRSxpQkFBaUIsSUFBSSxNQUFNLENBQUMsRUFBRTtTQUNsQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxtQkFBbUIsQ0FBQztRQUNqRDtNQUNGO0tBQ0QsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3JDLE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQzs7Ozs7O0dBTUYsT0FBTyxDQUFDLEtBQUssR0FBRyxTQUFTLEdBQUcsRUFBRTtLQUM1QixPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7O0dBRUYsU0FBUyxhQUFhLENBQUMsU0FBUyxFQUFFO0tBQ2hDLFNBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtPQUM1QyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztPQUN6RCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO1NBQzNCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsTUFBTTtTQUNMLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7U0FDeEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUN6QixJQUFJLEtBQUs7YUFDTCxPQUFPLEtBQUssS0FBSyxRQUFRO2FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUFFO1dBQ2pDLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxFQUFFO2FBQ3pELE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN4QyxFQUFFLFNBQVMsR0FBRyxFQUFFO2FBQ2YsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQztVQUNKOztTQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxTQUFTLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7V0FnQnJELE1BQU0sQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1dBQ3pCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUNqQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ1o7TUFDRjs7S0FFRCxJQUFJLGVBQWUsQ0FBQzs7S0FFcEIsU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtPQUM1QixTQUFTLDBCQUEwQixHQUFHO1NBQ3BDLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO1dBQzNDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztVQUN0QyxDQUFDLENBQUM7UUFDSjs7T0FFRCxPQUFPLGVBQWU7Ozs7Ozs7Ozs7Ozs7U0FhcEIsZUFBZSxHQUFHLGVBQWUsQ0FBQyxJQUFJO1dBQ3BDLDBCQUEwQjs7O1dBRzFCLDBCQUEwQjtVQUMzQixHQUFHLDBCQUEwQixFQUFFLENBQUM7TUFDcEM7Ozs7S0FJRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN4Qjs7R0FFRCxxQkFBcUIsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDL0MsYUFBYSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLFlBQVk7S0FDekQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0dBQ0YsT0FBTyxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7Ozs7O0dBS3RDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsU0FBUyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7S0FDNUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxhQUFhO09BQzFCLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUM7TUFDMUMsQ0FBQzs7S0FFRixPQUFPLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUM7U0FDdkMsSUFBSTtTQUNKLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxNQUFNLEVBQUU7V0FDaEMsT0FBTyxNQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1VBQ2pELENBQUMsQ0FBQztJQUNSLENBQUM7O0dBRUYsU0FBUyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtLQUNoRCxJQUFJLEtBQUssR0FBRyxzQkFBc0IsQ0FBQzs7S0FFbkMsT0FBTyxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO09BQ2xDLElBQUksS0FBSyxLQUFLLGlCQUFpQixFQUFFO1NBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUNqRDs7T0FFRCxJQUFJLEtBQUssS0FBSyxpQkFBaUIsRUFBRTtTQUMvQixJQUFJLE1BQU0sS0FBSyxPQUFPLEVBQUU7V0FDdEIsTUFBTSxHQUFHLENBQUM7VUFDWDs7OztTQUlELE9BQU8sVUFBVSxFQUFFLENBQUM7UUFDckI7O09BRUQsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7T0FDeEIsT0FBTyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7O09BRWxCLE9BQU8sSUFBSSxFQUFFO1NBQ1gsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUNoQyxJQUFJLFFBQVEsRUFBRTtXQUNaLElBQUksY0FBYyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztXQUM1RCxJQUFJLGNBQWMsRUFBRTthQUNsQixJQUFJLGNBQWMsS0FBSyxnQkFBZ0IsRUFBRSxTQUFTO2FBQ2xELE9BQU8sY0FBYyxDQUFDO1lBQ3ZCO1VBQ0Y7O1NBRUQsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTs7O1dBRzdCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDOztVQUU1QyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxPQUFPLEVBQUU7V0FDckMsSUFBSSxLQUFLLEtBQUssc0JBQXNCLEVBQUU7YUFDcEMsS0FBSyxHQUFHLGlCQUFpQixDQUFDO2FBQzFCLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUNuQjs7V0FFRCxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztVQUV4QyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUU7V0FDdEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1VBQ3ZDOztTQUVELEtBQUssR0FBRyxpQkFBaUIsQ0FBQzs7U0FFMUIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDOUMsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTs7O1dBRzVCLEtBQUssR0FBRyxPQUFPLENBQUMsSUFBSTtlQUNoQixpQkFBaUI7ZUFDakIsc0JBQXNCLENBQUM7O1dBRTNCLElBQUksTUFBTSxDQUFDLEdBQUcsS0FBSyxnQkFBZ0IsRUFBRTthQUNuQyxTQUFTO1lBQ1Y7O1dBRUQsT0FBTzthQUNMLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRzthQUNqQixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbkIsQ0FBQzs7VUFFSCxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7V0FDbEMsS0FBSyxHQUFHLGlCQUFpQixDQUFDOzs7V0FHMUIsT0FBTyxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7V0FDekIsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1VBQzFCO1FBQ0Y7TUFDRixDQUFDO0lBQ0g7Ozs7OztHQU1ELFNBQVMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtLQUM5QyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7OztPQUd4QixPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7T0FFeEIsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLE9BQU8sRUFBRTtTQUM5QixJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFOzs7V0FHNUIsT0FBTyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7V0FDMUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUM7V0FDeEIsbUJBQW1CLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztXQUV2QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFOzs7YUFHOUIsT0FBTyxnQkFBZ0IsQ0FBQztZQUN6QjtVQUNGOztTQUVELE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1NBQ3pCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsSUFBSSxTQUFTO1dBQ3pCLGdEQUFnRCxDQUFDLENBQUM7UUFDckQ7O09BRUQsT0FBTyxnQkFBZ0IsQ0FBQztNQUN6Qjs7S0FFRCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztLQUU5RCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFO09BQzNCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO09BQ3pCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztPQUN6QixPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztPQUN4QixPQUFPLGdCQUFnQixDQUFDO01BQ3pCOztLQUVELElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7O0tBRXRCLElBQUksRUFBRSxJQUFJLEVBQUU7T0FDVixPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztPQUN6QixPQUFPLENBQUMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7T0FDaEUsT0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7T0FDeEIsT0FBTyxnQkFBZ0IsQ0FBQztNQUN6Qjs7S0FFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7OztPQUdiLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7O09BRzFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQzs7Ozs7Ozs7T0FRaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRTtTQUMvQixPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztTQUN4QixPQUFPLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQztRQUN6Qjs7TUFFRixNQUFNOztPQUVMLE9BQU8sSUFBSSxDQUFDO01BQ2I7Ozs7S0FJRCxPQUFPLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztLQUN4QixPQUFPLGdCQUFnQixDQUFDO0lBQ3pCOzs7O0dBSUQscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUM7O0dBRTFCLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFdBQVcsQ0FBQzs7Ozs7OztHQU9wQyxFQUFFLENBQUMsY0FBYyxDQUFDLEdBQUcsV0FBVztLQUM5QixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7O0dBRUYsRUFBRSxDQUFDLFFBQVEsR0FBRyxXQUFXO0tBQ3ZCLE9BQU8sb0JBQW9CLENBQUM7SUFDN0IsQ0FBQzs7R0FFRixTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7S0FDMUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7O0tBRWhDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtPQUNiLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzFCOztLQUVELElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtPQUNiLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQzNCLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzFCOztLQUVELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCOztHQUVELFNBQVMsYUFBYSxDQUFDLEtBQUssRUFBRTtLQUM1QixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQztLQUNwQyxNQUFNLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztLQUN2QixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUM7S0FDbEIsS0FBSyxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7SUFDM0I7O0dBRUQsU0FBUyxPQUFPLENBQUMsV0FBVyxFQUFFOzs7O0tBSTVCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZDLFdBQVcsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEI7O0dBRUQsT0FBTyxDQUFDLElBQUksR0FBRyxTQUFTLE1BQU0sRUFBRTtLQUM5QixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7S0FDZCxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtPQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2hCO0tBQ0QsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDOzs7O0tBSWYsT0FBTyxTQUFTLElBQUksR0FBRztPQUNyQixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUU7U0FDbEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ3JCLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtXQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztXQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztXQUNsQixPQUFPLElBQUksQ0FBQztVQUNiO1FBQ0Y7Ozs7O09BS0QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7T0FDakIsT0FBTyxJQUFJLENBQUM7TUFDYixDQUFDO0lBQ0gsQ0FBQzs7R0FFRixTQUFTLE1BQU0sQ0FBQyxRQUFRLEVBQUU7S0FDeEIsSUFBSSxRQUFRLEVBQUU7T0FDWixJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7T0FDOUMsSUFBSSxjQUFjLEVBQUU7U0FDbEIsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDOztPQUVELElBQUksT0FBTyxRQUFRLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtTQUN2QyxPQUFPLFFBQVEsQ0FBQztRQUNqQjs7T0FFRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtTQUMzQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEdBQUcsU0FBUyxJQUFJLEdBQUc7V0FDakMsT0FBTyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFO2FBQzVCLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUU7ZUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7ZUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7ZUFDbEIsT0FBTyxJQUFJLENBQUM7Y0FDYjtZQUNGOztXQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1dBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztXQUVqQixPQUFPLElBQUksQ0FBQztVQUNiLENBQUM7O1NBRUYsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUN6QjtNQUNGOzs7S0FHRCxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDO0lBQzdCO0dBQ0QsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0dBRXhCLFNBQVMsVUFBVSxHQUFHO0tBQ3BCLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUN6Qzs7R0FFRCxPQUFPLENBQUMsU0FBUyxHQUFHO0tBQ2xCLFdBQVcsRUFBRSxPQUFPOztLQUVwQixLQUFLLEVBQUUsU0FBUyxhQUFhLEVBQUU7T0FDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7T0FDZCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzs7O09BR2QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztPQUNuQyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztPQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7T0FFckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7T0FDckIsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUM7O09BRXJCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztPQUV2QyxJQUFJLENBQUMsYUFBYSxFQUFFO1NBQ2xCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFOztXQUVyQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRztlQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7ZUFDdkIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7YUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQztZQUN4QjtVQUNGO1FBQ0Y7TUFDRjs7S0FFRCxJQUFJLEVBQUUsV0FBVztPQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOztPQUVqQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ25DLElBQUksVUFBVSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUM7T0FDdEMsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtTQUMvQixNQUFNLFVBQVUsQ0FBQyxHQUFHLENBQUM7UUFDdEI7O09BRUQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ2xCOztLQUVELGlCQUFpQixFQUFFLFNBQVMsU0FBUyxFQUFFO09BQ3JDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtTQUNiLE1BQU0sU0FBUyxDQUFDO1FBQ2pCOztPQUVELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztPQUNuQixTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFO1NBQzNCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1NBQ3RCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO1NBQ3ZCLE9BQU8sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDOztTQUVuQixJQUFJLE1BQU0sRUFBRTs7O1dBR1YsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7V0FDeEIsT0FBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUM7VUFDekI7O1NBRUQsT0FBTyxDQUFDLEVBQUUsTUFBTSxDQUFDO1FBQ2xCOztPQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7U0FDcEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMvQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDOztTQUU5QixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFOzs7O1dBSTNCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1VBQ3RCOztTQUVELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1dBQzdCLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1dBQzlDLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDOztXQUVsRCxJQUFJLFFBQVEsSUFBSSxVQUFVLEVBQUU7YUFDMUIsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUU7ZUFDOUIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztjQUNyQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFO2VBQ3ZDLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztjQUNqQzs7WUFFRixNQUFNLElBQUksUUFBUSxFQUFFO2FBQ25CLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFO2VBQzlCLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Y0FDckM7O1lBRUYsTUFBTSxJQUFJLFVBQVUsRUFBRTthQUNyQixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRTtlQUNoQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7Y0FDakM7O1lBRUYsTUFBTTthQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUMzRDtVQUNGO1FBQ0Y7TUFDRjs7S0FFRCxNQUFNLEVBQUUsU0FBUyxJQUFJLEVBQUUsR0FBRyxFQUFFO09BQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7U0FDcEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMvQixJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUk7YUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDO2FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRTtXQUNoQyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7V0FDekIsTUFBTTtVQUNQO1FBQ0Y7O09BRUQsSUFBSSxZQUFZO1lBQ1gsSUFBSSxLQUFLLE9BQU87WUFDaEIsSUFBSSxLQUFLLFVBQVUsQ0FBQztXQUNyQixZQUFZLENBQUMsTUFBTSxJQUFJLEdBQUc7V0FDMUIsR0FBRyxJQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUU7OztTQUdsQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3JCOztPQUVELElBQUksTUFBTSxHQUFHLFlBQVksR0FBRyxZQUFZLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztPQUN6RCxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztPQUNuQixNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7T0FFakIsSUFBSSxZQUFZLEVBQUU7U0FDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDckIsSUFBSSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO1NBQ3BDLE9BQU8sZ0JBQWdCLENBQUM7UUFDekI7O09BRUQsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQzlCOztLQUVELFFBQVEsRUFBRSxTQUFTLE1BQU0sRUFBRSxRQUFRLEVBQUU7T0FDbkMsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtTQUMzQixNQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDbEI7O09BRUQsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLE9BQU87V0FDdkIsTUFBTSxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7U0FDOUIsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3hCLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtTQUNuQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztTQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztTQUN2QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNuQixNQUFNLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksUUFBUSxFQUFFO1NBQy9DLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ3RCOztPQUVELE9BQU8sZ0JBQWdCLENBQUM7TUFDekI7O0tBRUQsTUFBTSxFQUFFLFNBQVMsVUFBVSxFQUFFO09BQzNCLEtBQUssSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7U0FDcEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMvQixJQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO1dBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7V0FDaEQsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1dBQ3JCLE9BQU8sZ0JBQWdCLENBQUM7VUFDekI7UUFDRjtNQUNGOztLQUVELE9BQU8sRUFBRSxTQUFTLE1BQU0sRUFBRTtPQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1NBQ3BELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDL0IsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTtXQUMzQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1dBQzlCLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7YUFDM0IsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUN4QixhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEI7V0FDRCxPQUFPLE1BQU0sQ0FBQztVQUNmO1FBQ0Y7Ozs7T0FJRCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7TUFDMUM7O0tBRUQsYUFBYSxFQUFFLFNBQVMsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUU7T0FDckQsSUFBSSxDQUFDLFFBQVEsR0FBRztTQUNkLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQzFCLFVBQVUsRUFBRSxVQUFVO1NBQ3RCLE9BQU8sRUFBRSxPQUFPO1FBQ2pCLENBQUM7O09BRUYsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBRTs7O1NBRzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO1FBQ3RCOztPQUVELE9BQU8sZ0JBQWdCLENBQUM7TUFDekI7SUFDRixDQUFDO0VBQ0g7Ozs7R0FJQyxDQUFDLFdBQVcsRUFBRSxPQUFPLElBQUksRUFBRSxHQUFHLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0VBQzVELENBQUM7Ozs7Ozs7Ozs7Q0N0dEJGOzs7Ozs7Ozs7Q0FTQSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxPQUFPLElBQUksRUFBRSxHQUFHLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7Ozs7Q0FJcEUsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQjtHQUNuQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDOzs7Q0FHbkUsSUFBSSxVQUFVLEdBQUcsVUFBVSxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQzs7O0NBR3BELENBQUMsQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUM7O0NBRWpDLGlCQUFjLEdBQUcsVUFBb0IsQ0FBQzs7Q0FFdEMsSUFBSSxVQUFVLEVBQUU7O0dBRWQsQ0FBQyxDQUFDLGtCQUFrQixHQUFHLFVBQVUsQ0FBQztFQUNuQyxNQUFNOztHQUVMLElBQUk7S0FDRixPQUFPLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztJQUM3QixDQUFDLE1BQU0sQ0FBQyxFQUFFO0tBQ1QsQ0FBQyxDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztJQUNsQztFQUNGOzs7Ozs7Ozs7Q0NsQ0QsZUFBYyxHQUFHQSxZQUE4QixDQUFDOztDQ0FoRDtDQUNBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Q0FDckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztDQUN2QixjQUFjLEdBQUcsVUFBVSxFQUFFLEVBQUU7R0FDN0IsT0FBTyxLQUFLLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQzFELENBQUM7Ozs7Ozs7Q0NMRjtDQUNBLFlBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRTtHQUM3QixJQUFJLEVBQUUsSUFBSSxTQUFTLEVBQUUsTUFBTSxTQUFTLENBQUMsd0JBQXdCLEdBQUcsRUFBRSxDQUFDLENBQUM7R0FDcEUsT0FBTyxFQUFFLENBQUM7RUFDWCxDQUFDOzs7Ozs7Ozs7OztDQ0ZGOztDQUVBLGFBQWMsR0FBRyxVQUFVLFNBQVMsRUFBRTtHQUNwQyxPQUFPLFVBQVUsSUFBSSxFQUFFLEdBQUcsRUFBRTtLQUMxQixJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDOUIsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7S0FDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxTQUFTLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQztLQUN2RCxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQixPQUFPLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksQ0FBQyxHQUFHLE1BQU07U0FDOUYsU0FBUyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUMzQixTQUFTLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxFQUFFLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQztJQUNqRixDQUFDO0VBQ0gsQ0FBQzs7Ozs7OztDQ2hCRixZQUFjLEdBQUcsSUFBSSxDQUFDOzs7Ozs7OztDQ0F0QjtDQUNBLElBQUksTUFBTSxHQUFHLGNBQWMsR0FBRyxPQUFPLE1BQU0sSUFBSSxXQUFXLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJO0tBQzdFLE1BQU0sR0FBRyxPQUFPLElBQUksSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSTs7S0FFL0QsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7Q0FDOUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLEVBQUUsR0FBRyxHQUFHLE1BQU0sQ0FBQzs7Ozs7Ozs7O0NDTHpDLElBQUksSUFBSSxHQUFHLGNBQWMsR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQztDQUNqRCxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDOzs7Ozs7Ozs7O0NDRHZDLGNBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRTtHQUM3QixJQUFJLE9BQU8sRUFBRSxJQUFJLFVBQVUsRUFBRSxNQUFNLFNBQVMsQ0FBQyxFQUFFLEdBQUcscUJBQXFCLENBQUMsQ0FBQztHQUN6RSxPQUFPLEVBQUUsQ0FBQztFQUNYLENBQUM7Ozs7Ozs7OztDQ0hGOztDQUVBLFFBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0dBQzNDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztHQUNkLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQztHQUNsQyxRQUFRLE1BQU07S0FDWixLQUFLLENBQUMsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFO09BQzFCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDekIsQ0FBQztLQUNGLEtBQUssQ0FBQyxFQUFFLE9BQU8sVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO09BQzdCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQzVCLENBQUM7S0FDRixLQUFLLENBQUMsRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7T0FDaEMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQy9CLENBQUM7SUFDSDtHQUNELE9BQU8seUJBQXlCO0tBQzlCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEMsQ0FBQztFQUNILENBQUM7Ozs7Ozs7Q0NuQkYsYUFBYyxHQUFHLFVBQVUsRUFBRSxFQUFFO0dBQzdCLE9BQU8sT0FBTyxFQUFFLEtBQUssUUFBUSxHQUFHLEVBQUUsS0FBSyxJQUFJLEdBQUcsT0FBTyxFQUFFLEtBQUssVUFBVSxDQUFDO0VBQ3hFLENBQUM7Ozs7Ozs7OztDQ0RGLGFBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRTtHQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sU0FBUyxDQUFDLEVBQUUsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO0dBQzlELE9BQU8sRUFBRSxDQUFDO0VBQ1gsQ0FBQzs7Ozs7OztDQ0pGLFVBQWMsR0FBRyxVQUFVLElBQUksRUFBRTtHQUMvQixJQUFJO0tBQ0YsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakIsQ0FBQyxPQUFPLENBQUMsRUFBRTtLQUNWLE9BQU8sSUFBSSxDQUFDO0lBQ2I7RUFDRixDQUFDOzs7Ozs7Ozs7Q0NORjtDQUNBLGdCQUFjLEdBQUcsQ0FBQ0EsVUFBbUIsQ0FBQyxZQUFZO0dBQ2hELE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDbEYsQ0FBQyxDQUFDOzs7Ozs7Ozs7Q0NGSCxJQUFJQyxVQUFRLEdBQUdELFlBQW9CLENBQUMsUUFBUSxDQUFDOztDQUU3QyxJQUFJLEVBQUUsR0FBRyxRQUFRLENBQUNDLFVBQVEsQ0FBQyxJQUFJLFFBQVEsQ0FBQ0EsVUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0NBQ2hFLGNBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRTtHQUM3QixPQUFPLEVBQUUsR0FBR0EsVUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7RUFDN0MsQ0FBQzs7Ozs7Ozs7Ozs7Q0NORixpQkFBYyxHQUFHLENBQUNELFlBQXlCLElBQUksQ0FBQyxVQUFtQixDQUFDLFlBQVk7R0FDOUUsT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDRSxZQUF3QixDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQy9HLENBQUMsQ0FBQzs7Ozs7OztDQ0ZIOzs7O0NBSUEsZ0JBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUU7R0FDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQztHQUM3QixJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUM7R0FDWixJQUFJLENBQUMsSUFBSSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksVUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUM7R0FDN0YsSUFBSSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksVUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUM7R0FDdkYsSUFBSSxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksVUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUM7R0FDOUYsTUFBTSxTQUFTLENBQUMseUNBQXlDLENBQUMsQ0FBQztFQUM1RCxDQUFDOzs7Ozs7Ozs7Ozs7O0NDUkYsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQzs7Q0FFL0IsS0FBUyxHQUFHRixZQUF5QixHQUFHLE1BQU0sQ0FBQyxjQUFjLEdBQUcsU0FBUyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUU7R0FDeEcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ1osQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDekIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQ3JCLElBQUksY0FBYyxFQUFFLElBQUk7S0FDdEIsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM3QixDQUFDLE9BQU8sQ0FBQyxFQUFFLGVBQWU7R0FDM0IsSUFBSSxLQUFLLElBQUksVUFBVSxJQUFJLEtBQUssSUFBSSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQztHQUM1RixJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7R0FDbkQsT0FBTyxDQUFDLENBQUM7RUFDVixDQUFDOzs7Ozs7Ozs7Ozs7Q0NmRixpQkFBYyxHQUFHLFVBQVUsTUFBTSxFQUFFLEtBQUssRUFBRTtHQUN4QyxPQUFPO0tBQ0wsVUFBVSxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUN6QixZQUFZLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQzNCLFFBQVEsRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDdkIsS0FBSyxFQUFFLEtBQUs7SUFDYixDQUFDO0VBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Q0NMRixTQUFjLEdBQUdBLFlBQXlCLEdBQUcsVUFBVSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtHQUN6RSxPQUFPRyxJQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUVDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztFQUNoRCxHQUFHLFVBQVUsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7R0FDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztHQUNwQixPQUFPLE1BQU0sQ0FBQztFQUNmLENBQUM7Ozs7Ozs7Q0NQRixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDO0NBQ3ZDLFFBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUU7R0FDbEMsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztFQUNyQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Q0NFRixJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUM7O0NBRTVCLElBQUksT0FBTyxHQUFHLFVBQVUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7R0FDMUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDakMsSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDakMsSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDakMsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDaEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDL0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7R0FDL0IsSUFBSSxPQUFPLEdBQUcsU0FBUyxHQUFHQyxZQUFJLEdBQUdBLFlBQUksQ0FBQyxJQUFJLENBQUMsS0FBS0EsWUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0dBQ2pFLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUNsQyxJQUFJLE1BQU0sR0FBRyxTQUFTLEdBQUdDLFlBQU0sR0FBRyxTQUFTLEdBQUdBLFlBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDQSxZQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0dBQzdGLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7R0FDbEIsSUFBSSxTQUFTLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQztHQUM3QixLQUFLLEdBQUcsSUFBSSxNQUFNLEVBQUU7O0tBRWxCLEdBQUcsR0FBRyxDQUFDLFNBQVMsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQztLQUN4RCxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFNBQVM7O0tBRXZDLEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7S0FFdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsSUFBSSxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQzs7T0FFeEUsT0FBTyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFQSxZQUFNLENBQUM7O09BRWpDLE9BQU8sSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUU7T0FDOUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtTQUN6QixJQUFJLElBQUksWUFBWSxDQUFDLEVBQUU7V0FDckIsUUFBUSxTQUFTLENBQUMsTUFBTTthQUN0QixLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7YUFDdkIsS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4QixLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QixDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztVQUN6QixDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkMsQ0FBQztPQUNGLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDNUIsT0FBTyxDQUFDLENBQUM7O01BRVYsRUFBRSxHQUFHLENBQUMsR0FBRyxRQUFRLElBQUksT0FBTyxHQUFHLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQzs7S0FFL0UsSUFBSSxRQUFRLEVBQUU7T0FDWixDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7O09BRXZELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLElBQUksUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFQyxZQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztNQUM5RTtJQUNGO0VBQ0YsQ0FBQzs7Q0FFRixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNkLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ2QsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDZCxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNkLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0NBQ2YsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FDZixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNmLE9BQU8sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0NBQ2hCLFdBQWMsR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Q0M3RHpCLGFBQWMsR0FBR1AsWUFBa0IsQ0FBQzs7Ozs7OztDQ0FwQyxjQUFjLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0NDQXBCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUM7O0NBRTNCLFFBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRTtHQUM3QixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3ZDLENBQUM7Ozs7Ozs7OztDQ0pGOzs7Q0FHQSxZQUFjLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxVQUFVLEVBQUUsRUFBRTtHQUM1RSxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDeEQsQ0FBQzs7Ozs7Ozs7O0NDTEY7OztDQUdBLGNBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRTtHQUM3QixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUM3QixDQUFDOzs7Ozs7O0NDTEY7O0NBRUEsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztDQUNuQixhQUFjLEdBQUcsVUFBVSxFQUFFLEVBQUU7R0FDN0IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDMUQsQ0FBQzs7Ozs7OztDQ0pGLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7Q0FDbkIsSUFBSVEsS0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7Q0FDbkIsb0JBQWMsR0FBRyxVQUFVLEtBQUssRUFBRSxNQUFNLEVBQUU7R0FDeEMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN6QixPQUFPLEtBQUssR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUdBLEtBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7RUFDaEUsQ0FBQzs7Ozs7Ozs7Ozs7OztDQ05GOzs7OztDQUtBLGtCQUFjLEdBQUcsVUFBVSxXQUFXLEVBQUU7R0FDdEMsT0FBTyxVQUFVLEtBQUssRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFO0tBQ3JDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN6QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2hDLElBQUksS0FBSyxHQUFHLGVBQWUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDL0MsSUFBSSxLQUFLLENBQUM7OztLQUdWLElBQUksV0FBVyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxNQUFNLEdBQUcsS0FBSyxFQUFFO09BQ2xELEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQzs7T0FFbkIsSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFLE9BQU8sSUFBSSxDQUFDOztNQUVqQyxNQUFNLE1BQU0sTUFBTSxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLFdBQVcsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO09BQ25FLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLFdBQVcsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO01BQ3ZELENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0VBQ0gsQ0FBQzs7Ozs7OztDQ3JCRixJQUFJLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQztDQUNsQyxJQUFJLEtBQUssR0FBR0YsWUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLQSxZQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Q0FDcEQsV0FBYyxHQUFHLFVBQVUsR0FBRyxFQUFFO0dBQzlCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztFQUN4QyxDQUFDOzs7Ozs7O0NDTEYsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0NBQ1gsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0NBQ3ZCLFFBQWMsR0FBRyxVQUFVLEdBQUcsRUFBRTtHQUM5QixPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxLQUFLLFNBQVMsR0FBRyxFQUFFLEdBQUcsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztFQUN2RixDQUFDOzs7Ozs7Ozs7OztDQ0pGLElBQUksTUFBTSxHQUFHTixZQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDOztDQUUxQyxjQUFjLEdBQUcsVUFBVSxHQUFHLEVBQUU7R0FDOUIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0VBQ2hELENBQUM7Ozs7Ozs7Ozs7O0NDRkYsSUFBSSxZQUFZLEdBQUdBLFlBQTRCLENBQUMsS0FBSyxDQUFDLENBQUM7Q0FDdkQsSUFBSSxRQUFRLEdBQUdTLFlBQXdCLENBQUMsVUFBVSxDQUFDLENBQUM7O0NBRXBELHVCQUFjLEdBQUcsVUFBVSxNQUFNLEVBQUUsS0FBSyxFQUFFO0dBQ3hDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDVixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7R0FDaEIsSUFBSSxHQUFHLENBQUM7R0FDUixLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7R0FFcEUsT0FBTyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7S0FDckQsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQ7R0FDRCxPQUFPLE1BQU0sQ0FBQztFQUNmLENBQUM7Ozs7Ozs7Q0NoQkY7Q0FDQSxnQkFBYyxHQUFHO0dBQ2YsK0ZBQStGO0dBQy9GLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Q0NIYjs7OztDQUlBLGVBQWMsR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtHQUMvQyxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7RUFDOUIsQ0FBQzs7Ozs7Ozs7O0NDRkYsY0FBYyxHQUFHVCxZQUF5QixHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLGdCQUFnQixDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUU7R0FDOUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ1osSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQy9CLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7R0FDekIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ1YsSUFBSSxDQUFDLENBQUM7R0FDTixPQUFPLE1BQU0sR0FBRyxDQUFDLEVBQUVHLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUN6RCxPQUFPLENBQUMsQ0FBQztFQUNWLENBQUM7Ozs7Ozs7Q0NaRixJQUFJRixVQUFRLEdBQUdELFlBQW9CLENBQUMsUUFBUSxDQUFDO0NBQzdDLFNBQWMsR0FBR0MsVUFBUSxJQUFJQSxVQUFRLENBQUMsZUFBZSxDQUFDOzs7Ozs7Ozs7OztDQ0R0RDs7OztDQUlBLElBQUlTLFVBQVEsR0FBR1YsWUFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztDQUNwRCxJQUFJLEtBQUssR0FBRyxZQUFZLGVBQWUsQ0FBQztDQUN4QyxJQUFJVyxXQUFTLEdBQUcsV0FBVyxDQUFDOzs7Q0FHNUIsSUFBSSxVQUFVLEdBQUcsWUFBWTs7R0FFM0IsSUFBSSxNQUFNLEdBQUdGLFlBQXdCLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDaEQsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztHQUMzQixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUM7R0FDYixJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUM7R0FDYixJQUFJLGNBQWMsQ0FBQztHQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7R0FDOUIsVUFBa0IsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDdkMsTUFBTSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUM7OztHQUczQixjQUFjLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7R0FDL0MsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ3RCLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLFFBQVEsR0FBRyxFQUFFLEdBQUcsbUJBQW1CLEdBQUcsRUFBRSxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztHQUNyRixjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDdkIsVUFBVSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUM7R0FDOUIsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQ0UsV0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDekQsT0FBTyxVQUFVLEVBQUUsQ0FBQztFQUNyQixDQUFDOztDQUVGLGlCQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFO0dBQy9ELElBQUksTUFBTSxDQUFDO0dBQ1gsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0tBQ2QsS0FBSyxDQUFDQSxXQUFTLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0IsTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7S0FDckIsS0FBSyxDQUFDQSxXQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7O0tBRXhCLE1BQU0sQ0FBQ0QsVUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLE1BQU0sTUFBTSxHQUFHLFVBQVUsRUFBRSxDQUFDO0dBQzdCLE9BQU8sVUFBVSxLQUFLLFNBQVMsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztFQUNwRSxDQUFDOzs7Ozs7OztDQ3hDRixJQUFJLEtBQUssR0FBR1YsWUFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7Q0FFeEMsSUFBSSxNQUFNLEdBQUdTLFlBQW9CLENBQUMsTUFBTSxDQUFDO0NBQ3pDLElBQUksVUFBVSxHQUFHLE9BQU8sTUFBTSxJQUFJLFVBQVUsQ0FBQzs7Q0FFN0MsSUFBSSxRQUFRLEdBQUcsY0FBYyxHQUFHLFVBQVUsSUFBSSxFQUFFO0dBQzlDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUM7S0FDaEMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLEdBQUcsR0FBRyxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0VBQ2hGLENBQUM7O0NBRUYsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Ozs7Ozs7Ozs7Q0NWdkIsSUFBSSxHQUFHLEdBQUdULElBQXVCLENBQUMsQ0FBQyxDQUFDOztDQUVwQyxJQUFJLEdBQUcsR0FBR1MsWUFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7Q0FFM0MsbUJBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO0dBQ3hDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0VBQ3RHLENBQUM7Ozs7Ozs7Ozs7O0NDRkYsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7OztBQUczQlQsYUFBa0IsQ0FBQyxpQkFBaUIsRUFBRVMsWUFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRSxZQUFZLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7O0NBRW5HLGVBQWMsR0FBRyxVQUFVLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0dBQ2xELFdBQVcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ2pGLGNBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDO0VBQ2pELENBQUM7Ozs7Ozs7Q0NaRjs7Q0FFQSxhQUFjLEdBQUcsVUFBVSxFQUFFLEVBQUU7R0FDN0IsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7RUFDNUIsQ0FBQzs7Ozs7Ozs7O0NDSkY7OztDQUdBLElBQUlDLFVBQVEsR0FBR1YsWUFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztDQUNwRCxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDOztDQUVuQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsSUFBSSxVQUFVLENBQUMsRUFBRTtHQUNyRCxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ2hCLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRVUsVUFBUSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUNBLFVBQVEsQ0FBQyxDQUFDO0dBQ3pDLElBQUksT0FBTyxDQUFDLENBQUMsV0FBVyxJQUFJLFVBQVUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRTtLQUNwRSxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO0lBQ2hDLENBQUMsT0FBTyxDQUFDLFlBQVksTUFBTSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUM7RUFDbkQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQ0hGLElBQUksUUFBUSxHQUFHVixZQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0NBQzdDLElBQUksS0FBSyxHQUFHLEVBQUUsRUFBRSxDQUFDLElBQUksSUFBSSxNQUFNLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Q0FDOUMsSUFBSSxXQUFXLEdBQUcsWUFBWSxDQUFDO0NBQy9CLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQztDQUNsQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7O0NBRXRCLElBQUksVUFBVSxHQUFHLFlBQVksRUFBRSxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7O0NBRTlDLGVBQWMsR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtHQUNqRixXQUFXLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztHQUNyQyxJQUFJLFNBQVMsR0FBRyxVQUFVLElBQUksRUFBRTtLQUM5QixJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEQsUUFBUSxJQUFJO09BQ1YsS0FBSyxJQUFJLEVBQUUsT0FBTyxTQUFTLElBQUksR0FBRyxFQUFFLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztPQUMxRSxLQUFLLE1BQU0sRUFBRSxPQUFPLFNBQVMsTUFBTSxHQUFHLEVBQUUsT0FBTyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO01BQy9FLENBQUMsT0FBTyxTQUFTLE9BQU8sR0FBRyxFQUFFLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNyRSxDQUFDO0dBQ0YsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLFdBQVcsQ0FBQztHQUM3QixJQUFJLFVBQVUsR0FBRyxPQUFPLElBQUksTUFBTSxDQUFDO0dBQ25DLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztHQUN2QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0dBQzNCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNqRixJQUFJLFFBQVEsR0FBRyxPQUFPLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQzdDLElBQUksUUFBUSxHQUFHLE9BQU8sR0FBRyxDQUFDLFVBQVUsR0FBRyxRQUFRLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztHQUNuRixJQUFJLFVBQVUsR0FBRyxJQUFJLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQztHQUN0RSxJQUFJLE9BQU8sRUFBRSxHQUFHLEVBQUUsaUJBQWlCLENBQUM7O0dBRXBDLElBQUksVUFBVSxFQUFFO0tBQ2QsaUJBQWlCLEdBQUcsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDaEUsSUFBSSxpQkFBaUIsS0FBSyxNQUFNLENBQUMsU0FBUyxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRTs7T0FFcEUsY0FBYyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQzs7T0FFN0MsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLFVBQVUsRUFBRU8sWUFBSSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztNQUNqSDtJQUNGOztHQUVELElBQUksVUFBVSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtLQUNwRCxVQUFVLEdBQUcsSUFBSSxDQUFDO0tBQ2xCLFFBQVEsR0FBRyxTQUFTLE1BQU0sR0FBRyxFQUFFLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDN0Q7O0dBRUQsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLE1BQU0sTUFBTSxLQUFLLElBQUksVUFBVSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7S0FDckVBLFlBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDOztHQUVELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUM7R0FDM0IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQztHQUM1QixJQUFJLE9BQU8sRUFBRTtLQUNYLE9BQU8sR0FBRztPQUNSLE1BQU0sRUFBRSxVQUFVLEdBQUcsUUFBUSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7T0FDakQsSUFBSSxFQUFFLE1BQU0sR0FBRyxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztPQUN6QyxPQUFPLEVBQUUsUUFBUTtNQUNsQixDQUFDO0tBQ0YsSUFBSSxNQUFNLEVBQUUsS0FBSyxHQUFHLElBQUksT0FBTyxFQUFFO09BQy9CLElBQUksRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDekQsTUFBTUssU0FBTyxDQUFDQSxTQUFPLENBQUMsQ0FBQyxHQUFHQSxTQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUU7R0FDRCxPQUFPLE9BQU8sQ0FBQztFQUNoQixDQUFDOzs7Ozs7Ozs7OztDQ25FRixJQUFJLEdBQUcsR0FBR1osWUFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7O0FBR3hDUyxhQUF5QixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxRQUFRLEVBQUU7R0FDOUQsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDM0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7O0VBRWIsRUFBRSxZQUFZO0dBQ2IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztHQUNoQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0dBQ3BCLElBQUksS0FBSyxDQUFDO0dBQ1YsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7R0FDL0QsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FDdEIsSUFBSSxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDO0dBQ3hCLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztFQUN0QyxDQUFDLENBQUM7O0NDaEJILHFCQUFjLEdBQUcsWUFBWSxlQUFlLENBQUM7Ozs7Ozs7Q0NBN0MsYUFBYyxHQUFHLFVBQVUsSUFBSSxFQUFFLEtBQUssRUFBRTtHQUN0QyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ3ZDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztDQ1FGLHNCQUFjLEdBQUdULFlBQXlCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxVQUFVLFFBQVEsRUFBRSxJQUFJLEVBQUU7R0FDbkYsSUFBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDOUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7R0FDWixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQzs7RUFFaEIsRUFBRSxZQUFZO0dBQ2IsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztHQUNoQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0dBQ25CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztHQUN0QixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO0tBQzNCLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO0tBQ3BCLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hCO0dBQ0QsSUFBSSxJQUFJLElBQUksTUFBTSxFQUFFLE9BQU8sSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUMxQyxJQUFJLElBQUksSUFBSSxRQUFRLEVBQUUsT0FBTyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0dBQy9DLE9BQU8sSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ25DLEVBQUUsUUFBUSxDQUFDLENBQUM7OztDQUdiLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQzs7Q0FFdEMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FDekIsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDM0IsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7O0NDN0I1QixJQUFJLGFBQWEsR0FBR1MsWUFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7Q0FFckQsSUFBSSxZQUFZLEdBQUcsQ0FBQyx3RkFBd0Y7R0FDMUcsZ0hBQWdIO0dBQ2hILGdIQUFnSDtHQUNoSCw4R0FBOEc7R0FDOUcseUJBQXlCLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztDQUV4QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtHQUM1QyxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDM0IsSUFBSSxVQUFVLEdBQUdILFlBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5QixJQUFJLEtBQUssR0FBRyxVQUFVLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQztHQUMvQyxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRUMsWUFBSSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDckUsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7RUFDbkM7O0NDbEJEOztDQUVBLElBQUlNLEtBQUcsR0FBR2IsWUFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7Q0FFM0MsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksRUFBRSxPQUFPLFNBQVMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLFdBQVcsQ0FBQzs7O0NBR2xFLElBQUksTUFBTSxHQUFHLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRTtHQUM5QixJQUFJO0tBQ0YsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEIsQ0FBQyxPQUFPLENBQUMsRUFBRSxlQUFlO0VBQzVCLENBQUM7O0NBRUYsWUFBYyxHQUFHLFVBQVUsRUFBRSxFQUFFO0dBQzdCLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7R0FDWixPQUFPLEVBQUUsS0FBSyxTQUFTLEdBQUcsV0FBVyxHQUFHLEVBQUUsS0FBSyxJQUFJLEdBQUcsTUFBTTs7T0FFeEQsUUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUVhLEtBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxHQUFHLENBQUM7O09BRXhELEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDOztPQUVaLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLFVBQVUsR0FBRyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0VBQ2pGLENBQUM7Ozs7Ozs7Q0N0QkYsZUFBYyxHQUFHLFVBQVUsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFO0dBQ2hFLElBQUksRUFBRSxFQUFFLFlBQVksV0FBVyxDQUFDLEtBQUssY0FBYyxLQUFLLFNBQVMsSUFBSSxjQUFjLElBQUksRUFBRSxDQUFDLEVBQUU7S0FDMUYsTUFBTSxTQUFTLENBQUMsSUFBSSxHQUFHLHlCQUF5QixDQUFDLENBQUM7SUFDbkQsQ0FBQyxPQUFPLEVBQUUsQ0FBQztFQUNiLENBQUM7Ozs7Ozs7Q0NKRjs7Q0FFQSxhQUFjLEdBQUcsVUFBVSxRQUFRLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7R0FDdkQsSUFBSTtLQUNGLE9BQU8sT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUUvRCxDQUFDLE9BQU8sQ0FBQyxFQUFFO0tBQ1YsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzdCLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0tBQ3BELE1BQU0sQ0FBQyxDQUFDO0lBQ1Q7RUFDRixDQUFDOzs7Ozs7O0NDWEY7O0NBRUEsSUFBSUMsVUFBUSxHQUFHZCxZQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0NBQzdDLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7O0NBRWpDLGdCQUFjLEdBQUcsVUFBVSxFQUFFLEVBQUU7R0FDN0IsT0FBTyxFQUFFLEtBQUssU0FBUyxLQUFLLFNBQVMsQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLFVBQVUsQ0FBQ2MsVUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7RUFDcEYsQ0FBQzs7Ozs7Ozs7O0NDTkYsSUFBSUEsVUFBUSxHQUFHZCxZQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDOztDQUU3QywwQkFBYyxHQUFHUyxZQUFrQixDQUFDLGlCQUFpQixHQUFHLFVBQVUsRUFBRSxFQUFFO0dBQ3BFLElBQUksRUFBRSxJQUFJLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQ0ssVUFBUSxDQUFDO1FBQ25DLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDaEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0VBQzdCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0NDREYsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0NBQ2YsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0NBQ2hCLElBQUksT0FBTyxHQUFHLGNBQWMsR0FBRyxVQUFVLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7R0FDOUUsSUFBSSxNQUFNLEdBQUcsUUFBUSxHQUFHLFlBQVksRUFBRSxPQUFPLFFBQVEsQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQy9FLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDdkMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0dBQ2QsSUFBSSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7R0FDbkMsSUFBSSxPQUFPLE1BQU0sSUFBSSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUMsUUFBUSxHQUFHLG1CQUFtQixDQUFDLENBQUM7O0dBRWpGLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtLQUN6RixNQUFNLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUN4RixJQUFJLE1BQU0sS0FBSyxLQUFLLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRSxPQUFPLE1BQU0sQ0FBQztJQUMxRCxNQUFNLEtBQUssUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxHQUFHO0tBQzdFLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2hELElBQUksTUFBTSxLQUFLLEtBQUssSUFBSSxNQUFNLEtBQUssTUFBTSxFQUFFLE9BQU8sTUFBTSxDQUFDO0lBQzFEO0VBQ0YsQ0FBQztDQUNGLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0NBQ3RCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOzs7Ozs7OztDQ3hCeEI7OztDQUdBLElBQUksT0FBTyxHQUFHZCxZQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0NBQzNDLHVCQUFjLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0dBQy9CLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7R0FDaEMsSUFBSSxDQUFDLENBQUM7R0FDTixPQUFPLENBQUMsS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3RGLENBQUM7Ozs7Ozs7Q0NSRjtDQUNBLFdBQWMsR0FBRyxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO0dBQ3pDLElBQUksRUFBRSxHQUFHLElBQUksS0FBSyxTQUFTLENBQUM7R0FDNUIsUUFBUSxJQUFJLENBQUMsTUFBTTtLQUNqQixLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUU7eUJBQ0osRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQyxLQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNYLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNDLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNwQixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEQsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUM3QixFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdELEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7eUJBQ3RDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztFQUMvQixDQUFDOzs7Ozs7Ozs7Q0NWRixJQUFJLE9BQU8s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
