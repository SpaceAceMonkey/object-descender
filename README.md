object-descender
----

Pretty much every programmer has written code that does what this library does. You want to retrieve something from n levels deep within some structure, but the language doesn't provide a native solution, or you don't like the native solution.

You can write this yourself in half an hour if you don't want any bells or whistles, but why should you? Use object-descender, instead, if it suits your purposes.

Installation
----

```npm install --save object-descender```

Usage
----

```
const Od = require('object-descender');
// Create descender with an existing object
const od = new Od({"a": "A's value", "b": {"b2": "B2's value", "child": {"key": "B2's child's key's value"}}});
// Retrieve the value of "a"
od.get('a'); // "A's value"
// Retrieve the value of "b2". Periods are used to indicate
// descent into the object, so b2 is at b.b2
od.get('b.b2'); // "B2's value"
// "d" doesn't exist, but we tell the object_descender to give
// us the default value of 2 when the key does not exist.
od.get("d", 2); // 2
// It doesn't matter what the value of a key is. Here, we return
// the entire object stored inside "b"
od.get('b'); // {"b2": "B2's value", "child": {"key": "B2's child's key's value"}}
// Go several levels deep
od.get('b.child.key'); // "B2's child's key's value"
// Attempt to retrieve a non-existent key without specifying a
// default return value
od.get('no_such_key'); // Returns an Error() object
```

There are more examples in the JSDoc annotation. See "Building the documentation," below, for more information.

Methods
----

> get(key, default_value)

Retrieves the value for the specified key.

**Parameters**

- key

  A dot-separated chain of properties, such as 'first_key.second_key.third_key.the_key_we_really_want'

- default_value

  The value to return if key is not found. If this is null, an Error object will be returned.

> throw(message)

Causes get() to throw an exception if the desired key is not found. Throw is only good for one call to get, and must be chained, as ```od.throw().get('a_key')```.

**Parameters**

- message

  The message to set on the thrown Error object. The string '%key%' in the message will be replaced with the key get() was attempting to locate.

Building the documentation
----

```npm run doc```

This will build the JSDoc documentation, and output it to /var/www/html/jsdoc/object_descender.