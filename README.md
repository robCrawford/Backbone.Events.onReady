Backbone.Events.onReady
=======================

Add `onReady()` method to `Backbone.Events`, similar to `$.ready()`.  
Trigger using `triggerReady()`.  

**Behaviour:**  
- Before event: register callback (same as `Events.once()`).  
- On event: run all pending callbacks.  
- After event: run callback immediately with cached arguments.  

NOTE:  
Calling `triggerReady()` again will update the arguments to future callbacks, but do nothing else.
