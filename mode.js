    /****************************************** */
  //***4种状态   * */  
 /****************************************** */

var Mode = (function mode() {           
  function constructor() {
    this.value='';
  }
  constructor.prototype ={
       constructor :constructor,
       set:function(v){
            this.value=v;
      },
      get:function(){
           return this.value;
      }
     };
  return constructor;
})();


module.exports=Mode;