/****************************************** */
  //***矩阵格式化   * */  
 /****************************************** */
   var MatInt = (function matint() {           
  function constructor(data) {
     // 这里必须传一个二维数组，最好严格检验一下
      if(typeof data !== "object" || typeof data.length === "undefined" || !data) {
        throw new Error("data's type is error");
      }
      this.data = data;
      this.cols = data.length;
  }
  constructor.prototype ={
       constructor :constructor,
      
     };
  return constructor;
})(); 

exports.MatInt = MatInt;
 /****************************************** */
  //***矩阵计算   * */  
 /****************************************** */
   var Mat = (function mat() {           
  function constructor() {
    
  }
  constructor.prototype ={
       constructor :constructor,
       findByLocation: function(data, xIndex, yIndex) {
        if(data && data[xIndex]) {
          return data[xIndex][yIndex];
        }
      },
      // 矩阵乘积
      multiply: function(m, n) {
        if(!m instanceof MatInt && !n instanceof MatInt) {
          throw new Error("data's type is error");
        }
        var mData = m.data;
        var nData = n.data;
        if(mData.length == 0 || nData.length == 0) {
          return 0;
        }
        if(mData[0].length != nData.length) {
          throw new Error("the two martrix data is not allowed to dot");
        }
        var result = [];
        for(var i=0, len=mData.length; i<len; i++) {
          var mRow = mData[i];
          result[i] = [];
          for(var j=0, jLen=mRow.length; j<jLen; j++) {
            var resultRowCol = 0;
            // 如果n矩阵没有足够的列数相乘，转入m矩阵下一行
            if(typeof this.findByLocation(nData, 0, j) === "undefined") {
              break;
            }
            for(var k=0, kLen=jLen; k<kLen; k++) {
              resultRowCol += mRow[k]*this.findByLocation(nData, k, j);
            }
            result[i][j] = resultRowCol;
          }
        }
        return result;
      }
     };
  return constructor;
})(); 


exports.Mat = Mat;
  
  
  
  
  
    function log(msg) {
      console.log(msg);
    }
    /**
    * 可视化的打印出矩阵的数据
    */
    function printMatrixData(data) {
      console.log(data);
      if(!data) {
        return;
      }
      var numberSize = 5;
      for(var i=0, len=data.length; i<len; i++) {
        var row = data[i];
        var rowLog = "(";
        for(var j=0, jLen=row.length; j<jLen; j++) {
          rowLog += row[j];
          // 补齐空格
          rowLog += indent(numberSize - (row[j]+"").length);
        }
        rowLog+=")";
        console.log(rowLog);
      }
    }
    /**
    * 拼接指定长度的空格
    */
    function indent(length) {
      var empty = "";
      for(var i=0; i<length; i++) {
        empty += " ";
      }
      return empty;
    }
   
   
   
    var m = new MatInt([[2, -1], [-2, 1], [-1, 2]]);
    var n = new MatInt([[4, -3], [3, 5]]);
    var result = new Mat().multiply(m, n);
    printMatrixData(result);
    var m2 = new MatInt([[2, 3, 1], [5, 2, 4], [-3, 2, 0]]);
    var n2 = new MatInt([[11], [5], [8]]);
    var result2 = new Mat().multiply(m2, n2);
    printMatrixData(result2);
 
