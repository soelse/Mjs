/** 
 * Mjs JavaScript Library v0.1.0
 * Base on sizzle.
 * 
 * This javascript framework just for ie678 and not support the modern browser.
 * Copyright 2013, Zhang Wang
 * Released under the MIT Licenses.
 *
 *
 *
 * Sizzle CSS Selector Engine v@VERSION
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: @DATE
 */

;(function (window, undefined) {

	var document = window.document;
	var navigator = window.document;
	var location = window.location;

	var Mjs = (function () {
		var Mjs = function (selector, context) {
			return new Mjs.fn.init(selector, context);
		},

		_Mjs = window.Mjs,

		__ = window._;

		Mjs.fn = Mjs.prototype = {
			constructor: Mjs,

			init: function (selector, context) {

				// Handle _(""), _(null), _(undefined)
				if (!selector) {
					this.length = 0;
					return this;
				} else if (Mjs.gettype(selector) === "string"){
					selector = Mjs.trim(selector);
				}

				// Handle _(DOMElement)
				if (selector.nodeType) {
					this.elements = [selector];
					this.length = 1;
					return this;
				}

				// Handle _(NodeList)
				if (Mjs.isObject(selector) && selector[0] && selector[0].nodeType) {
					this.elements = [];
					for (var i = selector.length - 1; i >= 0; i--) {
						this.elements[i] = selector[i];
					}
					this.length = selector.length;
					return this;
				}

				// Handle _(expr) && _("<div>xxx</div>")
				if (typeof selector === "string") {
					if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">") {
						var newNode = Mjs.string2DOMElement(selector),
							i;
						this.elements = [];
						if (newNode.length) {
							for (i = newNode.length - 1; i >= 0; i--) {
								this.elements[i] = newNode[i];
							}
							this.length = newNode.length;
							return this;
						} else {
							this.elements[0] = newNode;
							this.length = 1;
							return this;
						}
					} else {
						this.selector = selector;
						this.elements = Mjs.Sizzle(selector, context);
						this.length = this.elements.length;
						return this;
					}
				}
			},

			// Return the index of this object.
			eq: function (index) {
				var ret = this.constructor();
				index = +index;
				ret.elements = this.elements.slice(index, index + 1);
				ret.length = ret.elements.length;
				return ret;
			},

			Mjs: "0.1.0"
		};

		Mjs.fn.init.prototype = Mjs.fn;

		Mjs.extend = Mjs.fn.extend = function (obj) {
			var prop = "";
			for (prop in obj) {
				this[prop] = obj[prop];
			}
		};

		return Mjs;
	})();

	// Base function extension.
	// 基础函数扩展
	Mjs.extend({

		// Return the type of val.
		gettype: function (val) {
			var type = Object.prototype.toString.call(val).split(" ")[1].toLowerCase();
			return type.substr(0, type.length - 1);
		},

		// Check if the needle in the array, if yes return true, else return false.
		inArray: function (needle, haystack) {
			if (Mjs.isArray(haystack)) {
				return false;
			} else {
				var i;
				for (i = haystack.length - 1; i >= 0; i--) {
					if (needle === haystack[i]) {
						return true;
					}
				}
				return false;
			}
		},

		// Judge if val is an array.
		isArray: function (val) {
			return Mjs.gettype(val) === "array";
		},

		// Judge if val is a function pointer.
		isFunction: function (val) {
			return Mjs.gettype(val) === "function";
		},

		// Judge if val is an object.
		isObject: function (val) {
			return typeof val === "object";
		},

		// Empty function.
		noop: function () {},

		// Remove the space chars at the beginning or end in val.
		trim: function (val) {
			return val.replace(/^\s+|\s+$/g, "");
		},

		// Replace all the string equal needle from haystack replace to string equal target.
		replaceAll: function (haystack, needle, target) {
			var replaceMent = new RegExp(needle, "g");
			return haystack.replace(replaceMent, target);
		},

		// Upper case to the first letter at the word.
		ucFirst: function (word) {
			return word.substr(0, 1).toUpperCase() + word.substr(1, word.length - 1);
		},

		// Convert words split with "-" or "_" to camel case.
		toCamelCase: function (string) {
			var words = string.split(/[\-_]/),
				i = words.length;
			for (; --i > 0; ) {
				words[i] = Mjs.ucFirst(words[i].toLowerCase());
			}
			words[0] = words[0].toLowerCase();
			return words.join("");
		},

		// Return true when target matches the selector, else return false.
		isMatchesSelector: function (target, selector) {

			// Judge DOMElement - node.
			if (target.nodeType) {
				return Mjs.Sizzle.matchesSelector(target, selector);

			// Judge Mjs instance.
			} else if (target instanceof Mjs) {
				var output = true,
					i = target.length - 1;
				for (; i >= 0; i--) {
					if (!Mjs.Sizzle.matchesSelector(target.elements[i], selector)) {
						output = false;
						break;
					}
				}
				return output;

			// Judge NodeList.
			} else if (target.length) {
				var output = true,
					i = target.length - 1;
				for (; i >= 0; i--) {
					if (!Mjs.Sizzle.matchesSelector(target[i], selector)) {
						output = false;
						break;
					}
				}
				return output;

			// Other
			} else {
				return false;
			}
		},

		// Return the object like jsonString.
		string2Json: function (jsonstring) {
			window.eval("window.tmp = " + jsonstring);
			var json = window.tmp;
			window.tmp = null;
			return json;
		}

	});

	// Special private method extension.
	Mjs.extend({
		liveEvent: function (eventType, target, event) {
			var i = Mjs.LiveEvent[eventType].length - 1;
			for (; i >= 0; i--) {
				if (Mjs.isMatchesSelector(target, this.selector)) {
					Mjs.LiveEvent[eventType][i].fn.call(target, event);
				}
			}
		}
	});

	// Extension for Dom.
	// The method before the underline "_" means only support in IE678.
	// DOM操作扩展
	Mjs.prototype.extend({
		// Set attribute for every element in this object OR return the value of the attribute name with the first element.
		attr: function (name, val) {
			if (val == null) {
				return this.elements[0].getAttribute(name);
			} else {
				for (var i = 0; i < this.length; i++) {
					this.elements[i].setAttribute(name, val);
				}
				return this;
			}
		},

		// Remove attribute for every element in this object.
		removeAttr: function (name) {
			for (var i = 0; i < this.length; i++) {
				this.elements[i].removeAttribute(name);
			}
			return this;
		},

		// Get the property with the first element in this object OR set the property for every element in this object.
		prop: function (name, val) {
			if (val === undefined) {
				return this.elements[0][name];
			} else {
				for (var i = 0; i < this.length; i++) {
					this.elements[i][name] = val;
				}
				return this;
			}
		},

		// Return the value of the form element.
		val: function (val) {
			if (val === undefined) {
				return this.elements[0].value;
			} else {
				for (var i = 0; i < this.length; i++) {
					this.elements[i].value = val;
				}
				return this;
			}
		},

		// Append an class to a Mjs object.
		addClass: function (className) {
			var oldClassName, newClassName;
			for (var i = 0; i < this.length; i++) {
				oldClassName = this.elements[i].className;
				newClassName = Mjs.trim(oldClassName + " " + className);
				this.elements[i].className = newClassName;
			}
			return this;
		},

		// Remove a class from a Mjs object.
		removeClass: function (className) {
			var oldClassName, newClassName;
			for (var i = 0; i < this.length; i++) {
				oldClassName = this.elements[i].className + " ";
				newClassName = Mjs.replaceAll(oldClassName, className + " ", "");
				this.elements[i].className = newClassName;
			}
			return this;
		},

		// Judge if a Mjs object has the class, if not append it else remove it.
		toggleClass: function (className) {
			if (this.hasClass(className)) {
				this.removeClass(className);
			} else {
				this.addClass(className);
			}
		},

		// Set the css style with this object.
		css: function (name, val) {
			var obj = {},
				prop;
			if (!Mjs.isObject(name)) {
				obj[name] = val;
			} else {
				obj = name;
			}
			for (var i = this.length - 1; i >= 0; i--) {
				for (prop in obj) {
					this.elements[i].style[Mjs.toCamelCase(prop)] = obj[prop];
				}
			}
			return this;
		},

		// One of the elements has the className will return true, else return false.
		hasClass: function (className) {
			var oldClassName;
			for (var i = 0; i < this.length; i++) {
				oldClassName = this.elements[i].className + " ";
				if (oldClassName.indexOf(className + " ") === -1) {
					continue;
				} else {
					return true;
				}
			}
			return false;
		},

		// Insert this before 0 of the mjsInstance.
		insertBefore: function (mjsInstance) {
			if (mjsInstance.length > 0) {
				for (var i = 0; i < this.length; i++) {
					mjsInstance.elements[0].parentNode.insertBefore(this.elements[i], mjsInstance.elements[0]);
				}
			}
		},

		// Insert this after 0 of the mjsInstance.
		insertAfter: function (mjsInstance) {
			if (mjsInstance.length > 0) {
				for (var i = 0; i < this.length; i++) {
					mjsInstance.elements[0].insertBefore(this.elements[i]);
				}
			}
		},

		// Remove this element from the DOM.
		remove: function () {
			this.removeData();
			this.unbind();
			this.undelegate();
			for (var i = 0; i < this.length; i++) {
				this.elements[i].parentNode.removeChild(this.elements[i]);
				this.elements[i] = null;
			}
			this.elements = [];
			this.length = 0;
			return this;
		},

		// IE8 in the innerHTML bug of the selector - options, so you should use the private method like _html.
		html: function (val) {
			if (val === undefined) {
				return this.elements[0].innerHTML;
			} else {
				for (var i = 0; i < this.length; i++) {
					this.elements[i].innerHTML = val;
				}
				return this;
			}
		},

		// Cache val on the Node Object.
		data: function (name, val) {
			if (val === undefined) {
				var uuid = this.elements[0].expando;
				return Mjs.cache[uuid][name];
			} else {
				var rand,uuid;
				for (var i = 0; i < this.length; i++) {
					if (this.elements[i].expando == null) {
						uuid = Math.random();
						this.elements[i].expando = uuid;
						Mjs.cache[uuid] = {};
					} else {
						uuid = this.elements[i].expando;
					}
					Mjs.cache[uuid][name] = val;
				}
				return this;
			}
		},

		// Remove the val on the Node Object.
		removeData: function () {
			var uuid, i;
			for (i = this.length - 1; i >= 0; i--) {
				uuid = this.elements[i].expando;
				// this.elements[i].expando = null;
				Mjs.cache[uuid] = null;
			}
			return this;
		},

		// Bind an event to a DOMElement.
		// Use the Mjs.BindEvent[expando][event] = [func, funcE];
		bind: function (type, func) {
			var that = this,
				i, expando, length;
			if (Mjs.BindEvent == null) {
				Mjs.BindEvent = {};
			}
			for (i = this.length - 1; i >= 0; i--) {
				if (this.elements[i].expando) {
					expando = this.elements[i].expando;
				} else {
					expando = Math.random();
					this.elements[i].expando = expando;
				}
				if (Mjs.BindEvent[expando] == null) {
					Mjs.BindEvent[expando] = {};
				}
				if (Mjs.BindEvent[expando][type] == null) {
					Mjs.BindEvent[expando][type] = [];
				}

				(function (i, that) {
					Mjs.BindEvent[expando][type].push({fn: func, exec: function () {
						func.call(that.elements[i]);
					}});
				})(i, this);
				length = Mjs.BindEvent[expando][type].length;
				this.elements[i].attachEvent("on" + type, Mjs.BindEvent[expando][type][length - 1].exec);
			}
			return this;
		},

		// Unbind an event to a DOMElement.
		unbind: function (type, func) {
			var uuid,
				i = this.length - 1,
				expando,
				j,
				tmpArray;
			for (; i >= 0; i--) {
				if (this.elements[i].expando == null) {
					continue;
				} else {
					expando = this.elements[i].expando;
					for (eventName in Mjs.BindEvent[expando]) {
						if (type == null || eventName === type) {
							tmpArray = Mjs.BindEvent[expando][eventName];
							for (j = 0; j < tmpArray.length; j++) {
								if (func == null || func === tmpArray[j].fn) {
									this.elements[i].detachEvent("on" + eventName, tmpArray[j].exec);
									tmpArray.splice(j, 1);
									j--;
								}
							}
						}
					}
				}
			}
		},

		// Attach events to the DOMElements.
		live: function (event, fn) {
			if (!this.selector) {
				return this;
			} else {
				if ("click|mousemove|dblclick|mouseenter|mouseleave|mouseover|mousedown|mouseup|keydown|keyup|keypress|".indexOf(event + "|") === -1) {
					return this;
				}
				if (Mjs.LiveEvent == null) {
					Mjs.LiveEvent = {};
				}
				if (Mjs.LiveEvent[event] == null) {
					Mjs.LiveEvent[event] = [];
					var that = this;
					document.attachEvent("on" + event, function () {
						event = window.event;
						Mjs.liveEvent.call(that, event.type, event.srcElement, event);
					});
				}
				Mjs.LiveEvent[event].push({
					selector: this.selector,
					fn: fn
				});
			}
			return this;
		},

		// Detach an event to an DOMElement.
		die: function (event) {
			if (!this.selector) {
				return this;
			} else {
				if ("click|mousemove|dblclick|mouseenter|mouseleave|mouseover|mousedown|mouseup|keydown|keyup|keypress|".indexOf(event + "|") === -1) {
					return this;
				}
				if (Mjs.LiveEvent == null) {
					return this;
				} else if (Mjs.LiveEvent[event] == null) {
					return this;
				}
				var i = 0,
					total = Mjs.LiveEvent[event].length;
				for (; i < total; i++) {
					if (Mjs.LiveEvent[event][i].selector === this.selector) {
						Mjs.LiveEvent[event].splice(i, 1);
						i--;
						total--;
					}
				}
			}
			return this;
		},

		// Delegate the event to this object.
		delegate: function (selector, eventType, fn) {
			var i,
				expando,
				length;
			if (Mjs.DelegateEvent == null) {
				Mjs.DelegateEvent = {};
			}
			for (i = this.length - 1; i >= 0; i--) {
				if (this.elements[i].expando == null) {
					expando = Math.random();
					this.elements[i].expando = expando;
				} else {
					expando = this.elements[i].expando;
				}
				if (Mjs.DelegateEvent[expando] == null) {
					Mjs.DelegateEvent[expando] = {};
				}
				if (Mjs.DelegateEvent[expando][eventType] == null) {
					Mjs.DelegateEvent[expando][eventType] = [];
				}
				(function (i, that, selector, fn) {
					Mjs.DelegateEvent[expando][eventType].push({
						selector: selector,
						fn: fn,
						exec: function () {
							var event = window.event;
							if (Mjs.isMatchesSelector(event.srcElement, selector)) {
								fn.call(event.srcElement);
							}
						}
					});
				})(i, this, selector, fn);
				length = Mjs.DelegateEvent[expando][eventType].length;
				this.elements[i].attachEvent("on" + eventType, Mjs.DelegateEvent[expando][eventType][length - 1].exec);
			}
			return this;
		},

		// Undelegate the event to this object.
		undelegate: function (selector, eventType, fn) {
			var i,
				expando,
				eventName,
				j,
				tmpArray;
			for (i = 0; i < this.length; i++) {
				if (this.elements[i].expando == null) {
					continue;
				} else {
					expando = this.elements[i].expando;
				}
				for (eventName in Mjs.DelegateEvent[expando]) {
					if (eventType == null || eventType === eventName) {
						tmpArray = Mjs.DelegateEvent[expando][eventName];
						for (j = 0; j < tmpArray.length; j++) {
							if (selector == null || selector === tmpArray[j].selector) {
								if (fn == null || fn === tmpArray[j].fn) {
									this.elements[i].detachEvent("on" + eventName, tmpArray[j].exec);
									tmpArray.splice(j, 1);
									j--;
								}
							}
						}
					}
				}
			}
			return this;
		},

		// Special for the select in IE, other DOM please the html method.
		_html: function (val) {
			if (val === undefined) {
				return this.elements[0].innerHTML;
			} else {
				var selectHTML,
					beginPattern = /^<[^>]+>/,
					endPattern = /<[^>]+>$/,
					node = [],
					newNode;
				
				for (var i = 0; i < this.length; i++) {
					selectHTML = Mjs.DOMElement2String(this.elements[i]);
					node[0] = beginPattern.exec(selectHTML)[0];
					node[1] = endPattern.exec(selectHTML)[0];
					newNode = Mjs.string2DOMElement(node[0] + val + node[1])[0];
					// Only for IE.
					this.elements[i].replaceNode(newNode);
					this.elements[i] = newNode;
				}
				return this;
			}
		}
	});

	// Extensions of the DOM.
	Mjs.extend({
		string2DOMElement: function (string) {
			var parentDom = document.createElement("div");
			parentDom.innerHTML = string;
			return parentDom.childNodes;
		},

		DOMElement2String: function (node) {
			var newNode = node.cloneNode(false);
			var parentDom = document.createElement("div");
			parentDom.appendChild(newNode);
			return parentDom.innerHTML;
		}
	});

	// Advance extensions about the Mjs object.
	Mjs.extend({
		cache: {},

		jsonpCounter: 0,

		// Use the ActiveXObject, so cannot run in webkit core browser.
		ajax: function (url, options, success, failed) {
			var successCallback = success || options.success,
				failedCallback = failed || options.failed;
			if (options === undefined) {
				options = {};
				options.type = "GET";
				options.dataType = "text";
			} else {
				if (options.type === undefined) {
					options.type = "GET";
				}
				if (options.dataType === undefined) {
					options.dataType = "text";
				}
			}

			var ajax = new window.ActiveXObject("Microsoft.XMLHTTP");
			ajax.open(options.type, url, true);
			ajax.onreadystatechange = function () {
				if (ajax.readyState === 4) {
					if (ajax.status === 200) {
						if (Mjs.isFunction(options.success)) {
							successCallback.call(Mjs, [ajax.responseText]);
						}
					} else {
						if (Mjs.isFunction(options.failed)) {
							failedCallback.call(Mjs, [ajax.responseText]);
						}
					}
				}
			};
			if (options.data == null) {
				ajax.send(null);
			} else {
				ajax.send(options.data)
			}
		},

		// Because of onreadystatechange, so just support in IE. If more than 30s not return anything, will call failed.
		jsonp: function (url, success, failed) {
			var callbackField,
				callbackFunc = "jsonp" + Mjs.jsonpCounter++;
			if (url.charAt(url.length - 1) === "?" && url.charAt(url.length - 2) === "=") {
				// Appoint the callback field.
				var nameBeginPos;
				nameBeginPos = url.lastIndexOf("&");
				if (nameBeginPos === -1) {
					nameBeginPos = url.lastIndexOf("?");
				}
				if (nameBeginPos === -1) {
					// Failed TODO
					return ;
				} else {
					callbackField = url.substr(nameBeginPos, url.length - 1 - nameBeginPos);
				}
				url = url.substr(0, url.length - 1) + callbackFunc;
			} else {
				// Donot appoint the callback field. 
				callbackField = "callback";
				if (url.indexOf("?") !== -1) {
					url += "&callback=" + callbackFunc;
				} else {
					url += "?callback=" + callbackFunc;
				}
			}
			var jsonpNode = document.createElement("script"),
				timer;
			jsonpNode.src = url;
			window[callbackFunc] = function () {
				success.apply(window, arguments)
			};

			timer = setTimeout(function () {
				jsonpNode.onreadystatechange = null;
				jsonpNode.parentNode.removeChild(jsonpNode);
				jsonpNode = null;
				window[callbackFunc] = null;
				if (failed !== undefined && Mjs.isFunction(failed)) {
					failed.call(window);
				}
			}, 30000);

			jsonpNode.onreadystatechange = function () {
				if (jsonpNode.readyState === "complete" || jsonpNode.readyState === "loaded") {
					jsonpNode.onreadystatechange = null;
					jsonpNode.parentNode.removeChild(jsonpNode);
					jsonpNode = null;
					window[callbackFunc] = null;
					clearTimeout(timer);
				}
			};

			document.getElementsByTagName("body")[0].appendChild(jsonpNode);
		},

		// Dynamic append the script file into the document.
		script: function (url, success, failed) {
			var scriptNode = document.createElement("script"),
				timer;
			scriptNode.src = url;

			timer = setTimeout(function () {
				scriptNode.onreadystatechange = null;
				scriptNode.parentNode.removeChild(scriptNode);
				scriptNode = null;
				if (failed !== undefined && Mjs.isFunction(failed)) {
					failed.apply(window);
					failed = null;
				}
			}, 30000);

			window.func = success;

			scriptNode.onreadystatechange = function () {
				if (scriptNode.readyState === "complete" || scriptNode.readyState === "loaded") {
					scriptNode.onreadystatechange = null;
					scriptNode.parentNode.removeChild(scriptNode);
					scriptNode = null;
					if (success !== undefined && Mjs.isFunction(success)) {
						success.apply(window);
						success = null;
					}
					clearTimeout(timer);
				}
			};

			document.getElementsByTagName("body")[0].appendChild(scriptNode);
		}
	});


	/*!
	 * Sizzle CSS Selector Engine v@VERSION
	 * http://sizzlejs.com/
	 *
	 * Copyright 2013 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: @DATE
	 */
	(function(scope, undefined) {

	var i,
		cachedruns,
		Expr,
		getText,
		isXML,
		compile,
		outermostContext,
		sortInput,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + -(new Date()),
		preferredDoc = window.document,
		support = {},
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		hasDuplicate = false,
		sortOrder = function() { return 0; },

		// General-purpose constants
		strundefined = typeof undefined,
		MAX_NEGATIVE = 1 << 31,

		// Instance methods
		hasOwn = support.hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf if we can't use a native one
		indexOf = arr.indexOf || function( elem ) {
			var i = 0,
				len = this.length;
			for ( ; i < len; i++ ) {
				if ( this[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
		// http://www.w3.org/TR/css3-syntax/#characters
		characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

		// Loosely modeled on CSS identifier characters
		// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
		// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = characterEncoding.replace( "w", "w#" ),

		// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
			"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

		// Prefer arguments quoted,
		//   then not containing pseudos/brackets,
		//   then attribute selectors/non-parenthetical expressions,
		//   then anything else
		// These preferences are here to reduce the number of selectors
		//   needing tokenize in the PSEUDO preFilter
		pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rsibling = new RegExp( whitespace + "*[+~]" ),
		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + characterEncoding + ")" ),
			"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
			"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rescape = /'|\\/g,

		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
		funescape = function( _, escaped ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			return high !== high ?
				escaped :
				// BMP codepoint
				high < 0 ?
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		};

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	/**
	 * For feature detection
	 * @param {Function} fn The function to test for native support
	 */
	function isNative( fn ) {
		return rnative.test( fn + "" );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var cache,
			keys = [];

		return (cache = function( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key += " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key ] = value);
		});
	}

	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");

		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}

	function Sizzle( selector, context, results, seed ) {
		var match, elem, m, nodeType,
			// QSA vars
			i, groups, old, nid, newContext, newSelector;

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}

		context = context || document;
		results = results || [];

		if ( !selector || typeof selector !== "string" ) {
			return results;
		}

		if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
			return [];
		}

		if ( documentIsHTML && !seed ) {

			// Shortcuts
			if ( (match = rquickExpr.exec( selector )) ) {
				// Speed-up: Sizzle("#ID")
				if ( (m = match[1]) ) {
					if ( nodeType === 9 ) {
						elem = context.getElementById( m );
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE, Opera, and Webkit return items
							// by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}
					} else {
						// Context is not a document
						if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
							contains( context, elem ) && elem.id === m ) {
							results.push( elem );
							return results;
						}
					}

				// Speed-up: Sizzle("TAG")
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Speed-up: Sizzle(".CLASS")
				} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// QSA path
			if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				nid = old = expando;
				newContext = context;
				newSelector = nodeType === 9 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + toSelector( groups[i] );
					}
					newContext = rsibling.test( selector ) && context.parentNode || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Detect xml
	 * @param {Element|Object} elem An element or a document
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var doc = node ? node.ownerDocument || node : preferredDoc;

		// If no document and documentElement is available, return
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Set our document
		document = doc;
		docElem = doc.documentElement;

		// Support tests
		documentIsHTML = !isXML( doc );

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( doc.createComment("") );
			return !div.getElementsByTagName("*").length;
		});

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});

		// Check if getElementsByClassName can be trusted
		support.getElementsByClassName = assert(function( div ) {
			div.innerHTML = "<div class='a'></div><div class='a i'></div>";

			// Support: Safari<4
			// Catch class over-caching
			div.firstChild.className = "i";
			// Support: Opera<10
			// Catch gEBCN failure to find non-leading classes
			return div.getElementsByClassName("i").length === 2;
		});

		// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
		// Detached nodes confoundingly follow *each other*
		support.sortDetached = assert(function( div1 ) {
			// Should return 1, but returns 4 (following)
			return div1.compareDocumentPosition( doc.createElement("div") ) & 1;
		});

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
		});

		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
					var m = context.getElementById( id );

					return m ?
						m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
							[m] :
							undefined :
						[];
				}
			};
			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				div.innerHTML = "<select><option selected=''></option></select>";

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
			});

			assert(function( div ) {

				// Support: Opera 10-12/IE8
				// ^= $= *= and empty values
				// Should not select anything
				// Support: Windows 8 Native Apps
				// The type attribute is restricted during .innerHTML assignment
				var input = doc.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "t", "" );

				if ( div.querySelectorAll("[t^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = isNative( (matches = docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		// Element contains another
		// Purposefully does not implement inclusive descendent
		// As in, an element does not contain itself
		contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		// Document order sorting
		sortOrder = docElem.compareDocumentPosition ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

			if ( compare ) {
				// Disconnected nodes
				if ( compare & 1 ||
					(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

					// Choose the first element that is related to our preferred document
					if ( a === doc || contains(preferredDoc, a) ) {
						return -1;
					}
					if ( b === doc || contains(preferredDoc, b) ) {
						return 1;
					}

					// Maintain original order
					return sortInput ?
						( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
						0;
				}

				return compare & 4 ? -1 : 1;
			}

			// Not directly comparable, sort on existence of method
			return a.compareDocumentPosition ? -1 : 1;
		} :
		function( a, b ) {
			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;

			// Parentless nodes are either documents or disconnected
			} else if ( !aup || !bup ) {
				return a === doc ? -1 :
					b === doc ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return doc;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch(e) {}
		}

		return Sizzle( expr, document, null, [elem] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && ( hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined );

		return val === undefined ?
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null :
			val;
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	// Document sorting and removing duplicates
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		return results;
	};

	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns Returns -1 if a precedes b, 1 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	// Fetches boolean attributes by node
	function boolHandler( elem, name, isXML ) {
		var val;
		return isXML ?
			undefined :
			(val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
	}

	// Fetches attributes without interpolation
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	function interpolationHandler( elem, name, isXML ) {
		var val;
		return isXML ?
			undefined :
			(val = elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 ));
	}

	// Returns a function to use in pseudos for input types
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	// Returns a function to use in pseudos for buttons
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	// Returns a function to use in pseudos for positionals
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			for ( ; (node = elem[i]); i++ ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[5] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[4] ) {
					match[2] = match[4];

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, outerCache, node, diff, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
								// Seek `elem` from a previously-cached index
								outerCache = parent[ expando ] || (parent[ expando ] = {});
								cache = outerCache[ type ] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = cache[0] === dirruns && cache[2];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										outerCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							// Use previously-cached element index if available
							} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
								diff = cache[1];

							// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
							} else {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
										// Cache the index of each encountered element
										if ( useCache ) {
											(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf.call( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},

			"disabled": function( elem ) {
				return elem.disabled === true;
			},

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
				//   not comment, processing instructions, or others
				// Thanks to Diego Perini for the nodeName shortcut
				//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
				// use getAttribute instead to test this case
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	function tokenize( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( tokens = [] );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				} );
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push( {
						value: matched,
						type: type,
						matches: match
					} );
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	}

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var data, cache, outerCache,
					dirkey = dirruns + " " + doneName;

				// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
							if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
								if ( (data = cache[1]) === true || data === cachedruns ) {
									return data === true;
								}
							} else {
								cache = outerCache[ dir ] = [ dirkey ];
								cache[1] = matcher( elem, context, xml ) || cachedruns;
								if ( cache[1] === true ) {
									return true;
								}
							}
						}
					}
				}
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf.call( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		// A counter to specify which element is currently being matched
		var matcherCachedRuns = 0,
			bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, expandContext ) {
				var elem, j, matcher,
					setMatched = [],
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					outermost = expandContext != null,
					contextBackup = outermostContext,
					// We must always have either seed elements or context
					elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

				if ( outermost ) {
					outermostContext = context !== document && context;
					cachedruns = matcherCachedRuns;
				}

				// Add elements passing elementMatchers directly to results
				// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
				for ( ; (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context, xml ) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
							cachedruns = ++matcherCachedRuns;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// Apply set filters to unmatched elements
				matchedCount += i;
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !group ) {
				group = tokenize( selector );
			}
			i = group.length;
			while ( i-- ) {
				cached = matcherFromTokens( group[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
		}
		return cached;
	};

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function select( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			match = tokenize( selector );

		if ( !seed ) {
			// Try to minimize operations if there is only one group
			if ( match.length === 1 ) {

				// Take a shortcut and set the context if the root selector is an ID
				tokens = match[0] = match[0].slice( 0 );
				if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
						context.nodeType === 9 && documentIsHTML &&
						Expr.relative[ tokens[1].type ] ) {

					context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
					if ( !context ) {
						return results;
					}

					selector = selector.slice( tokens.shift().value.length );
				}

				// Fetch a seed set for right-to-left matching
				i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
				while ( i-- ) {
					token = tokens[i];

					// Abort if we hit a combinator
					if ( Expr.relative[ (type = token.type) ] ) {
						break;
					}
					if ( (find = Expr.find[ type ]) ) {
						// Search, expanding context for leading sibling combinators
						if ( (seed = find(
							token.matches[0].replace( runescape, funescape ),
							rsibling.test( tokens[0].type ) && context.parentNode || context
						)) ) {

							// If seed is empty or no tokens remain, we can return early
							tokens.splice( i, 1 );
							selector = seed.length && toSelector( tokens );
							if ( !selector ) {
								push.apply( results, seed );
								return results;
							}

							break;
						}
					}
				}
			}
		}

		// Compile and execute a filtering function
		// Provide `match` to avoid retokenization if we modified the selector above
		compile( selector, match )(
			seed,
			context,
			!documentIsHTML,
			results,
			rsibling.test( selector )
		);
		return results;
	}

	// Deprecated
	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Initialize against the default document
	setDocument();

	// Support: Chrome<<14
	// Always assume duplicates if they aren't passed to the comparison function
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		if ( div.firstChild.getAttribute("href") !== "#" ) {
			var attrs = "type|href|height|width".split("|"),
				i = attrs.length;
			while ( i-- ) {
				Expr.attrHandle[ attrs[i] ] = interpolationHandler;
			}
		}
	});

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	assert(function( div ) {
		if ( div.getAttribute("disabled") != null ) {
			var attrs = booleans.split("|"),
				i = attrs.length;
			while ( i-- ) {
				Expr.attrHandle[ attrs[i] ] = boolHandler;
			}
		}
	});

	// EXPOSE
	if ( typeof define === "function" && define.amd ) {
		define(function() { return Sizzle; });
	} else {
		scope.Sizzle = Sizzle;
	}
	// EXPOSE

	})( Mjs );


	window.Mjs = window._ = Mjs;

})(window);