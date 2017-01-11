var RandomClamped = require('./randomclamped.js');
   /****************************************** */
  //***神经元对象   * */  
 /****************************************** */
var SNeuron = (function sneuron() {           
  function constructor(m_NumInputs) {
    this.m_NumInputs=m_NumInputs;
    this.m_dActivation=0;//该神经细胞的激励值
    this.m_dError=0;//误差值
    this.m_vecWeight=new Array();
    this.init();
  }
  constructor.prototype ={
       constructor :constructor,
       init :function(){
          for (var i=0;i<this.m_NumInputs+1;i++) this.m_vecWeight.push(new RandomClamped().get());   
       }
     };
  return constructor;
})();


module.exports=SNeuron;
