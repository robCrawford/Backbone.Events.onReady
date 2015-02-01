
var _event = _.clone(Backbone.Events);

describe("Event tests", function(){

	it("Should run pending ready() callbacks when event is triggered", function(done){

		var callbacksCount = 0,
			triggerCount = 0;

		_event.onReady("testEvent0", function(count){
			callbacksCount++;
		});
		_event.onReady("testEvent0", function(count){
			callbacksCount++;
		});
		_event.onReady("testEvent0", function(count){
			expect(callbacksCount).toBe(2);
			expect(triggerCount).toBe(1);
			done();
		});
		_event.triggerReady("testEvent0", triggerCount++);

	});

	it("Should only run ready() callbacks first time event is triggered", function(done){

		var callbacksCount = 0;

		_event.onReady("testEvent1", function(count){
			callbacksCount++;
		});

		_event.triggerReady("testEvent1", 1);
		_event.triggerReady("testEvent1", 2);
		_event.triggerReady("testEvent1", 3);

		expect(callbacksCount).toEqual(1);
		done();

	});

	it("Should then run ready() callbacks immediately, with cached data", function(done){

		var callbacksCount = 0;

		_event.onReady("testEvent2", function(count){
			callbacksCount++;
			expect(count).toEqual(1);
		});

		_event.triggerReady("testEvent2", 1);

		_event.onReady("testEvent2", function(count){
			callbacksCount++;
			expect(count).toEqual(1);
		});

		_event.triggerReady("testEvent2", 7); //Should update response

		_event.onReady("testEvent2", function(count){
			callbacksCount++;
			expect(count).toEqual(7); //Should still be cached data
		});

		expect(callbacksCount).toEqual(3);
		done();

	});

	it("Should work with Backbone Model", function(done){

		var TestModel = Backbone.Model.extend({
				initialize: function(options){
					this.triggerReady("loaded");
				}
			});

		var testModel = new TestModel();
		testModel.onReady("loaded", done);

	});

	it("Should work with no eventName argument for Backbone Model", function(done){

		var TestModel = Backbone.Model.extend({
				initialize: function(options){
					this.triggerReady();
				}
			});

		var testModel = new TestModel();
		testModel.onReady(done);

	});

	it("Should work with Backbone View", function(done){

		var TestView = Backbone.View.extend({

				render: function(options){
					//Set ready listener
					this.triggerReady("rendered", {testKey: "testValue"});
				}

			});

		var testView = new TestView();

		testView.onReady("rendered", function(v){
			expect(v).toEqual({testKey: "testValue"});
		});
		testView.onReady("rendered", done);

		testView.render();
	});

	it("Should work with Backbone View and on('all', ...)", function(done){

		var TestView = Backbone.View.extend({

				render: function(options){
					//Set ready listener
					this.triggerReady({testKey: "testValue"});
				}

			});

		var testView = new TestView();

		testView.on("all", function(eventName, data){
			if(eventName == "ready"){
				expect(data).toEqual({testKey: "testValue"});
				done();
			}
		});

		testView.render();
	});

});
