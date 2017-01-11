   /****************************************** */
  //***产生随机数  * */  
 /****************************************** */
 var RandomClamped = (function randomclamped() {           
  function constructor() {
    this.arr=Math.round(((Math.random())*2-1)*100)/100; 
  }
  constructor.prototype ={
       constructor :constructor,
         get:function(){ return this.arr;}
     };
  return constructor;
})(); 

module.exports=RandomClamped;
   