<a name="funcs"></a>

## funcs : <code>object</code>
Function wrappers and utilities for enhanced behavior.

**Kind**: global namespace  
**Author**: Sagie Gur-Ari  

* [funcs](#funcs) : <code>object</code>
    * [.noop()](#funcs.noop) ⇒ <code>undefined</code>
    * [.isFunction([fn])](#funcs.isFunction) ⇒ <code>Boolean</code>
    * [.ensure([fn])](#funcs.ensure) ⇒ <code>function</code>
    * [.maxTimes(fn, times)](#funcs.maxTimes) ⇒ <code>function</code>
    * [.once(fn)](#funcs.once) ⇒ <code>function</code>
    * [.delay(fn, [delay])](#funcs.delay) ⇒ <code>function</code>
    * [.async(fn)](#funcs.async) ⇒ <code>function</code>

<a name="funcs.noop"></a>

### funcs.noop() ⇒ <code>undefined</code>
Empty function.

**Returns**: <code>undefined</code> - Undefined  
**Access**: public  
<a name="funcs.isFunction"></a>

### funcs.isFunction([fn]) ⇒ <code>Boolean</code>
Returns true if the provided argument is a function.

**Returns**: <code>Boolean</code> - True if the provided argument is a function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [fn] | <code>function</code> | The function to check |

**Example**  
````js
var isFn = funcs.isFunction(myFunction);

funcs.isFunction(function () {}); //true
funcs.isFunction(); //false
funcs.isFunction(5); //false
funcs.isFunction(true); //false
````
<a name="funcs.ensure"></a>

### funcs.ensure([fn]) ⇒ <code>function</code>
Ensures a return function.<br>
If a function is provided, it will be returned, otherwise a noop function will be returned.

**Returns**: <code>function</code> - The original function if provided, or a noop  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| [fn] | <code>function</code> | The function to check |

**Example**  
````js
var handler = funcs.ensure(maybeHandler);
````
<a name="funcs.maxTimes"></a>

### funcs.maxTimes(fn, times) ⇒ <code>function</code>
Wraps the provided function and ensures it is invoked no more than the provided amount.<br>
This function output can be chained with other funcs apis.

**Returns**: <code>function</code> - The new wrapper function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to wrap |
| times | <code>Number</code> | The max times the provided function will be invoked |

**Example**  
````js
var onlyOnceCallback = funcs.maxTimes(callback, 1);

//can also chain
var delayedMaxTimesCallback = funcs.maxTimes(callback, 5).delay(500);
````
<a name="funcs.once"></a>

### funcs.once(fn) ⇒ <code>function</code>
Ensures the provided function is invoked only once.<br>
This is the same as calling funcs.times(fn, 1)<br>
This function output can be chained with other funcs apis.

**Returns**: <code>function</code> - The new wrapper function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to wrap |

**Example**  
````js
var onlyOnceCallback = funcs.once(callback);

//can also chain
var asyncOnceCallback = funcs.once(callback).async();
````
<a name="funcs.delay"></a>

### funcs.delay(fn, [delay]) ⇒ <code>function</code>
Trigger the actual function only after the provided delay.<br>
This function output can be chained with other funcs apis.

**Returns**: <code>function</code> - The new wrapper function  
**Access**: public  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | <code>function</code> |  | The function to wrap |
| [delay] | <code>Number</code> | <code>0</code> | The invocation delay in millies |

**Example**  
````js
var delayedCallback = funcs.delay(callback, 500);

//can also chain
var delayedMaxTimesCallback = funcs.delay(callback, 500).maxTimes(5);
````
<a name="funcs.async"></a>

### funcs.async(fn) ⇒ <code>function</code>
Ensures the function is invoked only in the next cycle.<br>
This is the same as calling funcs.delay(fn, 0)<br>
This function output can be chained with other funcs apis.

**Returns**: <code>function</code> - The new wrapper function  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to wrap |

**Example**  
````js
var asyncCallback = funcs.async(callback);

//can also chain
var asyncOnceCallback = funcs.async(callback).once();
````
