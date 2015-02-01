
(function(_, Backbone){

    var readyDispatcher = {

        readyFlags: {},
        readyResponses: {},

        onReady: function(eventName, callback, context){
            //If first argument is a callback, reshuffle values
            if(typeof eventName === "function"){
                context = callback; //1 back
                callback = eventName; //1 back
                eventName = ""; //Updated by getReadyLabel() below
            }
            //Process label
            eventName = getReadyLabel(eventName);

            //Ready flag exists - run callback with cached response
            if(this.readyFlags[eventName]){
                callback.apply(context, this.readyResponses[eventName]);
            }
            //Event hasn't been triggered yet, subscribe once
            else this.once.apply(this, [eventName, callback, context]);
        },

        triggerReady: function(/* arguments */){
            var eventName = "", //May be first argument or may be omitted
                argsSplitPos = 0; //Where data arguments begin

            //If first argument is a string, assume it is eventName
            if(typeof arguments[0] === "string"){
                eventName = arguments[0];
                argsSplitPos = 1;
            }
            //Process label
            eventName = getReadyLabel(eventName);

            //Get data arguments, passed on to callbacks
            var dataArgs = _.toArray(arguments).slice(argsSplitPos);

            //Create ready entries
            this.readyFlags[eventName] = true;
            this.readyResponses[eventName] = dataArgs;

            //Run any pending callbacks
            this.trigger.apply(this, [eventName].concat(dataArgs));
        }

    }

    //Merge into Backbone.Events
    _.extend(Backbone.Events, readyDispatcher);

    //Merge in to all Backbone member prototypes where _.extend(..., Events) was applied
    _.each([
        "Model", "Collection", "View" //, "Router", "History"
        ],
        function(p){
            _.extend(Backbone[p].prototype, readyDispatcher);
        }
    );

    /*
      Utils
    */
    function getReadyLabel(eventName){
    //Prefix event label with 'ready:' to keep separate from on() events
    //If no eventName is supplied then the eventName is just "ready"
        return "ready" + (eventName ? ":" + eventName : "");
    }

})(_, Backbone);
