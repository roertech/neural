var Emitter = require('wildemitter');
var config=require('./ini.js');
var RandomClamped = require('./randomclamped.js');
var Iterator = require('./iterator.js');
var SNeuron = require('./sneuron.js');
var SNeuronLayer = require('./sneuronLayer.js');

/****************************************** */
  //***神经网络   * */  
 /****************************************** */
var CNeuralNet = (function cneuralnet() {           
  function constructor(NumInputs,NumOutputs,m_NumHiddenLayers,m_NeuronsPerHiddenLyr,LearningRate) {

    this.m_bSoftMax=false;
    this.m_NumInputs=NumInputs;//输入数目 
    this.m_NumOutputs=NumOutputs;//输出数目
    this.m_NumHiddenLayers=m_NumHiddenLayers;//隐藏层的数目 m_iNumHiddenLayers
    this.m_NeuronsPerHiddenLyr=m_NeuronsPerHiddenLyr;//每个隐藏层中神经细胞的个数
    this.m_vecLayers=new Array(); // 为每一层（包括输出层）存放所有神经细胞的存储器
    this.m_dLearningRate=LearningRate;//学习率
    this.m_dErrorSum;//所有误差总和(输出值和期望值)
    this.m_bTrained;//如果训练为真
    this.m_iNumEpochs;//迭代计数器
   this. CreateNet();
  }
  constructor.prototype ={
       constructor :constructor,
       InitializeNetwork:function(){
             //for each layer
	for (var i=0; i<this.m_NumHiddenLayers+1; i++)
	{
		//for each neuron
		for (var n=0; n<this.m_vecLayers[i].m_NumNeurons; n++)
		{
			//for each weight
			for (var k=0; k<this.m_vecLayers[i].m_vecNeurons[n].m_NumInputs; k++)
			{  
				this.m_vecLayers[i].m_vecNeurons[n].m_vecWeight[k] = new RandomClamped().get();
			}
		}
	}
  this.m_dErrorSum  = 9999;
  this.m_iNumEpochs = 0;
	return;
       },
       NetworkTrainingEpoch:function(setIn,SetOut){//输入值，//二维数组，目标输出值
          this.m_dErrorSum=0;
         var WeightUpdate=0;
                  //console.log(setIn.length);
          for (var vec=0;vec<setIn.length;vec++){//输入每次输入值
              ///=============//
             // console.log('训练模式次序'+vec);
           
               var outputs=this.Update(setIn[vec]);//一次输入所有训练值,通过UPdate方法计算出输出值（数组）
                
               if (outputs.length==0){
                 return false;
               }
               //遍历输出层每个细胞元
               
               // console.log(outputs)
               for(var op=0;op<this.m_NumOutputs; op++){
                //  console.log( '未调整权重值'+this.m_vecLayers[1].m_vecNeurons[0].m_vecWeight)
                   // console.log('处理第'+op+'个输出元');
                  ///--------------------------------------//

                      var err=(SetOut[vec][op]-outputs[op])*outputs[op]*(1-outputs[op]);//计算误差值
               // console.log(err);
                       this.m_vecLayers[1].m_vecNeurons[op].m_dError = err;
                  this.m_dErrorSum +=(SetOut[vec][op]-outputs[op])*(SetOut[vec][op]-outputs[op]);
                 

              var curWeight = new Iterator(this.m_vecLayers[1].m_vecNeurons[op].m_vecWeight);//创建输出层每个输入的权重，影藏层有多少个细胞就有多少个权重
              var curNrnHid = new Iterator(this.m_vecLayers[0].m_vecNeurons);//创建隐藏层的细胞数组的迭代
           var i=0;
        while(curWeight.hasNext(-1)){  //内部索引从0 到最后第二个  因为，最后一个创建细胞网的时候是【偏置值】
                var curNrnHidindex=curNrnHid.index;//隐藏层细胞索引
                var curWeightindex=curWeight.index;//输出层每个权重索引
                var value =curWeight.get(curWeightindex);
              
                

               
             //console.log('权重：'+value);
                       
               // console.log(curNrnHidindex);//显示隐藏层细胞索引
               // console.log(curWeightindex);//显示每个输入权重索引
               i++;
               WeightUpdate=err * this.m_dLearningRate * curNrnHid.get(curNrnHidindex).m_dActivation;  
               // console.log('修改每个元的'+i+'次');
                value += WeightUpdate + this.m_vecLayers[1].m_vecNeurons[op].m_vecPrevUpdate[i] *config.MOMENTUM;
                //console.log('修改后的权重：'+value);
                curWeight.set(value);//重置当前索引的值 
                curWeight.next();//内部索引向后移动一位
               curNrnHid.next();//隐藏层细胞索引部索引向后移动一位  
              // console.log( this.m_vecLayers[1].m_vecNeurons[op].m_vecWeight)
                  } 

                  //console.log('影藏层权重索引'+curWeight.index);
                  // curWeight.next();//获取最后一个元素的值
               var bia= curWeight.get(curWeight.index);//获取当前权重
             // console.log('影藏层权重权重'+bia);

             WeightUpdate = err*this.m_dLearningRate*config.BIAS;
                 bia +=WeightUpdate +this.m_vecLayers[1].m_vecNeurons[op].m_vecPrevUpdate[i] *config.MOMENTUM;
                // console.log(err);
//console.log('学习率'+this.m_dLearningRate);
//console.log('偏移值'+BIAS);
                 // console.log('影藏层权重权重'+bia);
                curWeight.set(bia);//重置当前索引的值 

                // this.m_vecLayers[1].m_vecNeurons[op].m_vecWeight=curWeight.getall();//重置输出层细胞内的权重
                ///----------------------------//
                this.m_vecLayers[1].m_vecNeurons[op].m_vecPrevUpdate[i] = WeightUpdate;
            }

           

             //update the error total. (when this value becomes lower than a
    //preset threshold we know the training is successful)
   /* var error = 0;

    if (!this.m_bSoftMax) //Use SSE
    {
      for (var o=0; o<this.m_NumOutputs; o++)
      {
       
        error += (SetOut[vec][o] - outputs[o]) *
                 (SetOut[vec][o] - outputs[o]);
      }
    }

    else  //use cross-entropy error
    {
      for (var o=0; o<this.m_NumOutputs; o++)
      {
        error += SetOut[vec][o] * Math.log(outputs[o]);
      }

      error = -error;
    }
     
    this.m_dErrorSum += error;*/



            curNrnHid = new Iterator(this.m_vecLayers[0].m_vecNeurons);//移到隐藏层
            //  console.log('处理隐藏层');
            var n=0;

  
            while(curNrnHid.hasNext(-1)){  //内部索引从0 到最后第二个  因为，最后一个创建细胞网的时候是【偏置值】
              var err=0; 
                 //  console.log('没有执行？');
              var curNrnHidindex=curNrnHid.index;//隐藏层细胞索引
             
              var curNrnOut = new Iterator(this.m_vecLayers[1].m_vecNeurons);//
                                
                    while(curNrnOut.hasNext(-1)){  //内部索引从0 到最后第二个  因为，最后一个创建细胞网的时候是【偏置值】
                                   //影藏层每个细胞元的输出,
                              var curNrnOutindex=curNrnOut.index; //输出层细胞每条输出当前索引
                             // console.log(curNrnOutindex);
                              var value=curNrnOut.get(curNrnOutindex);
                              //  console.log(value);

                              err +=value.m_dError * value.m_vecWeight[n];//算出输出值得误差，结果是X权重的的结果
                           //  console.log(err);
                              curNrnOut.next();//内部索引向后移动一位
                  } 
                    // console.log(curNrnHidindex);
                 // console.log(curNrnHid.get(curNrnHidindex).m_dActivation)
                              var dActivation=curNrnHid.get(curNrnHidindex).m_dActivation;
                err *= curNrnHid.get(curNrnHidindex).m_dActivation * (1 - dActivation);     
                   /////////下面继续20161020
                   this.m_vecLayers[0].m_vecNeurons[n].m_dError = err   //重新设定隐藏层当前神经输出误差 
                 // console.log('下面继续20161020？');
                 //for each weight in this neuron calculate the new weight based
      //on the error signal and the learning rate
      for (var w=0; w<this.m_NumInputs; w++)
      {

        WeightUpdate=err * this.m_dLearningRate * setIn[vec][w];
        //calculate the new weight based on the backprop rules
       curNrnHid.get(curNrnHidindex).m_vecWeight[w] +=  WeightUpdate+curNrnHid.get(curNrnHidindex).m_vecPrevUpdate[w]*config.MOMENTUM;
       curNrnHid.get(curNrnHidindex).m_vecPrevUpdate[w]=WeightUpdate;
      }
WeightUpdate=err * this.m_dLearningRate * config.BIAS;
      //and the bias
      curNrnHid.get(curNrnHidindex).m_vecWeight[this.m_NumInputs] += WeightUpdate + curNrnHid.get(curNrnHidindex).m_vecPrevUpdate[i]*config.MOMENTUM;
      curNrnHid.get(curNrnHidindex).m_vecPrevUpdate[i]=WeightUpdate;
        curNrnHid.next();
     // ++curNrnHid;
     n++;
   
           } 
                
 
  //=============//
          }
 return true;

       },
       Train:function(data){  //输入训练用的参数
         
             var SetIn=data.GetInputSet();
             var SetOut=data.GetOutputSet();
             
            //first make sure the training set is valid
   if ((SetIn.length     != SetOut.length)  || 
       (SetIn[0].length  != this.m_NumInputs)   ||
       (SetOut[0].length != this.m_NumOutputs))
   {
     alert("Inputs != Outputs ,Error");
    
     return false;
   }
  
   //initialize all the weights to small random values
   this.InitializeNetwork();
  
  // console.log('阀值为：'+ERROR_THRESHOLD)
   //train using backprop until the SSE is below the user defined
   //threshold
   while( this.m_dErrorSum > config.ERROR_THRESHOLD )
   {
     //return false if there are any problems
     if (!this.NetworkTrainingEpoch(SetIn, SetOut))
     {
       return false;
     }
    
     this.m_iNumEpochs++;
   //  console.log('当前误差:'+this.m_dErrorSum+'；训练中,次数为'+this.m_iNumEpochs)
	 //console.log(this.m_dErrorSum);
  //Emitter.emit('getAlldata',this.m_vecLayers);
      
     //console.log(this.getAlldata())
      
//console.log(this.m_iNumEpochs)
     //call the render routine to display the error sum
    //InvalidateRect(hwnd, NULL, TRUE);
//if (this.m_iNumEpochs>20000){

    //return false
  //}
		// UpdateWindow(hwnd);
   }

   m_bTrained = true;
   
   return true;
       },

       getAlldata:function(){
  this.m_dActivation=0;//该神经细胞的激励值
    this.m_dError=0;//误差值
    this.m_vecWeight=new Array();
    var data=new Array()
    
         for (var i=0; i<this.m_vecLayers.length; i++)
	{
   
  var vecLayers=new  Array();
   
		//for each neuron
		for (var n=0; n<this.m_vecLayers[i].m_NumNeurons; n++)
		{
    var vecNeurons={}
      var vecWeight=new Array();
			//for each weight
     
			for (var k=0; k<this.m_vecLayers[i].m_vecNeurons[n].m_NumInputs; k++)
			{
        
				vecWeight.push(this.m_vecLayers[i].m_vecNeurons[n].m_vecWeight[k]);
			}
        
        vecNeurons.Weight=vecWeight;
        vecLayers.push(vecNeurons);
		}
data.push(vecLayers)


	}

  return data;
       },
       CreateNet:function(){//创建神经网络
        
          if (this.m_NumHiddenLayers > 0)  // 创建网络的各个层
           {
                //创建第一个隐藏层
              this.m_vecLayers.push(new SNeuronLayer(this.m_NeuronsPerHiddenLyr,this.m_NumInputs));
                for(var i=0; i<this.m_NumHiddenLayers-1; i++)
                 {
                     this.m_vecLayers.push(new SNeuronLayer(this.m_NeuronsPerHiddenLyr,this.m_NeuronsPerHiddenLyr));
                 }
               //如果允许有多个隐藏层，则由接着for循环即能创建其余的隐藏层  
                 this.m_vecLayers.push(new SNeuronLayer(this.m_NumOutputs,this.m_NeuronsPerHiddenLyr));// 创建输出层
                  //console.log(this.m_vecLayers);
           }else //无隐藏层时，只需创建输出层
           {
              // 创建输出层
              console.log('只创建输出层');
                 this.m_vecLayers.push(new SNeuronLayer(this.m_NumOutputs, this.m_NumInputs));
           }
           console.log('创建神经网络完毕');
           
       },        
       GetWeights:function(){
	              var weights=new Array();//this will hold the weights
	             //遍历每个层
	           for (var i=0; i<this.m_NumHiddenLayers+1; i++)
	           {
		               for (var j=0; j<this.m_vecLayers[i].m_NumNeurons; j++)//遍历每个神经元
		              {
			                    for (var k=0; k<this.m_vecLayers[i].m_vecNeurons[j].m_NumInputs; k++)
			                     {
				                      weights.push(this.m_vecLayers[i].m_vecNeurons[j].m_vecWeight[k]);//遍历每个权重
			                     }
		              }
	            }
	            return weights;// 从神经网络得到（读出）权重
       }, 
      GetNumberOfInput:function(){
          return  this.m_NumInputs;//输入数目
      },
       GetNumberOfOutput:function(){
          return this.m_NumOutputs;//输出数目
       },
       GetNumberOfWeights:function(){
         var weights = 0;
	               //for each layer
	              for (var i=0; i<this.m_NumHiddenLayers+1; i++)
	                 {
		                    //for each neuron
		                    for (var j=0; j<this.m_vecLayers[i].m_NumNeurons; j++)
		                        {
			                            //for each weight
			                          for (var k=0; k<this.m_vecLayers[i].m_vecNeurons[j].m_NumInputs; k++) weights++;                 				
		                        }
	                 }
	              return weights; // 返回网络的权重的总数
       },
       // 用新的权重代替原有的权重, 这一函数所做的工作与函数GetWeights所做的正好相反。当遗传算法执行完一代时，新一代的权重必须重新插入神经网络。为我们完成这一任务的是PutWeight方法。
      PutWeights:function(weights){
             var cWeight = 0;
	//for each layer
	            for (var i=0; i<this.m_NumHiddenLayers+1;i++)
	            {
		//for each neuron
	               	for (var j=0; j<this.m_vecLayers[i].m_NumNeurons; j++)
		              {
			//for each weight
		                 	for (var k=0; k<this.m_vecLayers[i].m_vecNeurons[j].m_NumInputs; k++)
			                {
				                  this.m_vecLayers[i].m_vecNeurons[j].m_vecWeight[k] = weights[cWeight++];
			                }
		              }
	            }
               	return;
      },
	  tanh:function(x){
		  return Math.tanh(x);
		  
	  },
	  ReLU:function(x){
		  return Math.log(1+Math.exp(x));
		  
	  },
     // S形响应曲线
     Sigmoid:function(activation,response){
        return ( 1 / ( 1 + Math.exp(-activation / response)));  
     },
     //当已知一个神经细胞的所有输入*重量的乘积之和时，这一方法将它送入到S形的激励函数。
     // 根据一组输入，来计算输出
      Update:function(inputs){
     
       
           // 保存从每一层产生的输出
               var outputs=new Array();
               var cWeight = 0;  
     // 首先检查输入的个数是否正确 inputs为数组
     if (inputs.length != this.m_NumInputs)
      {
          // 如果不正确，就返回一个空向量
          console.log(inputs.length);
          return outputs;
      }

      //加入噪音
      // for (var k=0; k<inputs.length; k++)
     // {
    //inputs[k]+=new RandomClamped().get()* config.MAX_NOISE_TO_ADD;
      // }
     // 对每一层,...
     for (var i=0; i<this.m_NumHiddenLayers+1; i++)
     {
       if (i>0)
         {
            inputs = outputs;
         }//第一次循环计算隐藏层的输出值

    outputs=[];
    cWeight = 0;
    // 对每个神经细胞,求输入*对应权重乘积之总和。并将总和抛给S形函数,以计算输出
   for (var j=0; j<this.m_vecLayers[i].m_NumNeurons;j++)
        {
          var netinput = 0;
          this.NumInputs = this.m_vecLayers[i].m_vecNeurons[j].m_NumInputs;
         // 对每一个权重
         for (var k=0; k<this.NumInputs-1; k++)
         { 
            // 计算权重*输入的乘积的总和。
            netinput += this.m_vecLayers[i].m_vecNeurons[j].m_vecWeight[k] * inputs[cWeight++];  //权重*输入值然后累加　　　　      
         }
        // 加入偏移值
        netinput += this.m_vecLayers[i].m_vecNeurons[j].m_vecWeight[this.NumInputs-1] *config.BIAS;
 　　//别忘记每个神经细胞的权重向量的最后一个权重实际是偏移值，这我们已经说明过了，我们总是将它设置成为 –1的。我已经在ini文件中包含了偏移值，你可以围绕它来做文章，考察它对你创建的网络的功能有什么影响。不过，这个值通常是不应该改变的。
     // 每一层的输出，当我们产生了它们后，我们就要将它们保存起来。但用Σ累加在一起的
 //softmax on output layers
      if(this.m_bSoftMax && (i == this.m_NumHiddenLayers))
      {
        this.m_vecLayers[i].m_vecNeurons[j].m_dActivation = Math.exp(netinput);
        
      }

      else
      {
     this.m_vecLayers[i].m_vecNeurons[j].m_dActivation = this.Sigmoid(netinput, config.ACTIVATION_RESPONSE);

      }
     // 激励总值首先要通过S形函数的过滤，才能得到输出
           outputs.push(this.m_vecLayers[i].m_vecNeurons[j].m_dActivation);
            cWeight = 0;
    }
  }

/*   if (this.m_bSoftMax)
  {
    var  expTot = 0;

    //first calculate the exp for the sum of the outputs
    for (var o=0; o<outputs.length; o++)
    {
      expTot += outputs[o];
    }    

    //now adjust each output accordingly
    for (o=0; o<outputs.size(); ++o)
    {
      outputs[o] = outputs[o]/expTot;

      this.m_vecLayers[this.m_NumHiddenLayers].m_vecNeurons[o].m_dActivation = outputs[o];    
    }
  }*/
        return outputs;
       //对此Update函数函数我马上就会来进行注释的。  
      },
     CalculateSplitPoints: function()
    {
	       var SplitPoints=new Array();
         var WeightCounter = 0;
	//for each layer
	for (var i=0; i<this.m_NumHiddenLayers+1; i++)
	{
		//for each neuron
		for (var j=0; j<this.m_vecLayers[i].m_NumNeurons; j++)
		{
			//for each weight
			for (var k=0; k<this.m_vecLayers[i].m_vecNeurons[j].m_NumInputs; k++)
      {
				WeightCounter++;			
      }
      SplitPoints.push(WeightCounter - 1);
		}
	}
	return SplitPoints;
}
     };
  return constructor;
})();

module.exports=CNeuralNet;





   