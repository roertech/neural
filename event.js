 /****************************************** */
  //***事件器  * */  
 /****************************************** */
   var Emitter = (function emitter() {           
  function constructor() {
       this.initEmitter();
  }
  constructor.prototype ={
       constructor :constructor,
         initEmitter : function() {
              this.callbacks = {};
             },
	     emit:function(eventName) {
             var callbacks = this.callbacks[eventName];
             if (!callbacks) {
                  console.log('No valid callback specified.');
                 return;
             }
               var args = [].slice.call(arguments)
               // Eliminate the first param (the callback).
               args.shift();
                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i].apply(this, args);
               }
          },
		  on :function(eventName, callback) {
                 if (eventName in this.callbacks) {
                      var cbs = this.callbacks[eventName]
                 if (cbs.indexOf(callback) == -1) {
                     cbs.push(callback);
                 }
             } else {
                this.callbacks[eventName] = [callback];
               }
          },
         removeListener :function(eventName, callback) {
              if (!(eventName in this.callbacks)) {
                 return;
               }
             var cbs = this.callbacks[eventName];
             var ind = cbs.indexOf(callback);
              if (ind == -1) {
               console.warn('No matching callback found');
              return;
              }
           cbs.splice(ind, 1);
            }
        };
     return constructor;
})(); 
module.exports=Emitter;
