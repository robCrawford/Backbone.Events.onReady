Backbone.Events.onready
=======================

Add `onready()` method to `Backbone.Events`, similar to `$.ready()`.  

**Behaviour:**  
- Before event: register callback (same as `event.once()`).  
- On event: run all pending callbacks.  
- After event: run callback immediately with cached arguments.  

NOTE:  
Calling `trigger()` again will just update the arguments for any future callbacks.  
