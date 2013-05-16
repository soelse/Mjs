Mjs
===
* Mjs JavaScript Library v0.1.0
* This javascript framework just for ie678 and not support the modern browser.
* Copyright 2013, Zhang Wang
* Released under the MIT, BSD and GPL Licenses.
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

Abstract
========
Nowadays, the MSIE between 6 to 8 just occupied less than 10% in the world. Sometimes, it seems need not to support the old browser. However, there were more than 40% users use these old browser in China. What's more, some embeded browser only support the very old MSIE core like IE6 and IE7. JQuery is an very excellent javascript frameworks, but I think that's too large and run not so fast in the IE6-8. So, I write this Mjs. M is my English name like Mond. 

This frameworks is very light, and choose the Sizzle as the selector.

There might be many problems in this tool. This is the first time I wrote an open source tool in github. I would like to hear propose from everyone for everything. Thank you.

Many syntax might like jQuery, but not so strong as jQuery.

API Document
============
Base(prototype)
----------------
* eq(index) 
	+ @return Object instance of Mjs.
	+ @usage The get an element as the position of index, the first index is 0 not 1.
	+ @eg _("li").eq(1)

* attr(name)
	+ @return String
	+ @usage Return the value of the attribute name with the first element.
	+ @eg _("a").attr("href")

* attr(name, val)
	+ @return Object instance of Mjs.
	+ @usage Set attribute for every element in this object.
	+ @eg _("img").attr("src", "http://example.com/img.jpg")

* prop(name)
	+ @return String
	+ @usage Get the property with the first element in this object.
	+ @eg _("img").prop("src")

* prop(name, val)
	+ @return Object instance of Mjs.
	+ @usage 

* removeAttr(name)
	+ @return Object instance of Mjs.
	+ @usage Remove attribute for every element in this object.
	+ @eg _("a").removeAttr("href")

* * * * * * * * *

Base(Mjs Object)
----------------
* gettype(val)
	+ @return String
	+ @usage The type of val, like "array", "string", "function".
	+ @eg _.gettype([]) // "array"

* inArray(needle, haystack)
	+ @return Boolean
	+ @usage Check if the needle in the array, if yes return true, else return false.
	+ @eg _.inArray("hello", ["hello", "world"]) // true

* isArray(val)
	+ @return Boolean
	+ @usage Return true when the val is an array, else return false.
	+ @eg _.isArray({}) // false

* isFunction(val)
	+ @return Boolean
	+ @usage Return true when val is a function pointer, else return false.
	+ @eg _.isFunction(window.alert) // true

* isMatchesSelector(DOMElement, selectorString)
	+ @return Boolean
	+ @usage Return true when target matches the selector, else return false.
	+ @eg _.isMatchesSelector(LINode, "li") // true

* isObject(val)
    + @return Boolean
    + @usage Just like isArray, return true when val is an object, else return false. However, arrays, functions etc. is an object in javascript, so it will return true when you appoint an array or any referer types else.
    + @eg _.isObject([]) // true

* noop
	+ @return undefined
	+ @usage Appoint an empty function pointer.
	+ @eg _.noop() // undefined

* trim(val)
	+ @return String
	+ @usage Remove the space chars at the beginning or end in val.
	+ @eg _.trim(" abcd efg    ") // "abcd efg"

* replaceAll(haystack, needle, target)
	+ @return String
	+ @usage Replace all the string equal needle from haystack replace to string equal target.
	+ @eg _.replace("aabbccddaabbccdd", "aa", "zz") // "zzbbccddzzbbccdd"

* string2Json(jsonString)
	+ @return Object
	+ @usage Return the object like jsonString.
	+ @eg _.string2Json("{a:1, b:['a','b','c']}") // {a:1, b:['a','b','c']}

* toCamelCase(string)
	+ @return String
	+ @usage Convert words split with "-" or "_" to camel case.
	+ @eg _.toCamelCase("today_is-a_fine-day") // "todayIsAFineDay"

* ucFirst(word)
	+ @return String
	+ @usage Upper case to the first letter at the word.
	+ @eg _.ucFirst("hello") // "Hello"