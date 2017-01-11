var SNeuron = require('./sneuron.js');
  /****************************************** */
  //***神经层对象   * */  
 /****************************************** */

var SNeuronLayer = (function sneuronLayer() {           
  function constructor(m_NumNeurons,m_NumInputs) {
    this.m_NumNeurons=m_NumNeurons;// 本层使用的神经细胞数目
　  this.m_vecNeurons=new Array(); // 神经细胞的层
    this.init(m_NumInputs);
  }
  constructor.prototype ={
       constructor :constructor,
       init:function(m_NumInputs){
          for (var i=0;i<this.m_NumNeurons;i++) this.m_vecNeurons.push(new SNeuron(m_NumInputs));          
      }
     };
  return constructor;
})();
module.exports=SNeuronLayer;