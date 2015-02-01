Backbone.Events.onReady
=======================

Adds an `	onReady()` method to `Backbone.Events`, similar to `$.ready()`.  
Trigger using `triggerReady()`.  

**Behaviour:**  
> *Before event* - register callback.  
> *On event* - run all pending callbacks.  
> *After event* - run callback immediately with cached argument values.  

###Use case examples

- You want to log messages to a console View at many different async points, without knowing whether the View is ready yet.  
  Place each call in a `View.onReady()` callback, and call `this.triggerReady()` in the View's `render()` method.  
  ```javascript
  var ConsoleView = Backbone.View.extend({

    render: function(options){
      ...
      this.triggerReady();
    },
    ...
  });

  console.onReady(function(){
    this.log("Message 1");
  });
  ```
  Pending messages will be logged in order, once the View has rendered. Any later messages will be logged immediately.

- You have a `getUser()` method in your JavaScript API, that could be called at any time, but the data may not be ready.  
  Subscribe all callbacks from the API calls to a custom event i.e.  
  `onReady("api:user", callback)`.  
  When the data is ready, `triggerReady("api:user", {id: ...})` will pass the data to all callbacks.
  ```javascript
  var events = _.clone(Backbone.Events);
  var api = {
  		getUser: function(callback){
  			events.onReady("api:user", callback);
  		}
  	}
  ```
  After the first response, callbacks always run immediately with cached data.

###Notes

- Calling `triggerReady()` more than once will update the arguments to future callbacks, but after the first time the event is triggered, no more callbacks can be pending as they run immediately.

- onReady() events can also be listened for via the usual `"all"` Backbone syntax.  
  If an `eventName` was specified, it is *prefixed with* `"ready:"` i.e. `"ready:api:user"`.  
  If no `eventName` was specified i.e. when using `view.onReady()`, it is just `"ready"`.  
  ```javascript
  events.on("all", function(eventName, data){
      if(eventName === "ready"){
        console.log(eventName, data);
      }
    });
  ```
