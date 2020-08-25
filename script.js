var imagebg = new Image();
var imagefg = new Image();
var canv1 = "canv1";
var canv2 = "canv2";
var canvRes = "canvRes";
var imgfg = "imgfg";
var imgbg = "imgbg";
var isBackground = true;
var isntBackground = false;
var hasResultImg = false;

//funcao para carregamento do arquivo no tipo imagem
function loadFile(event, idCanvas, isBackground) {
  if(isBackground){
    imagebg = new Image();
    imagebg.src = URL.createObjectURL(event.target.files[0]);
    imagebg.onload = function(){
      if(imagefg.src != ""){
        imagebg.width = imagefg.width;
        imagebg.height = imagefg.height;
      }
      loadOnCanvas(idCanvas, imagebg);
    };
  }else{
    imagefg = new Image();
    imagefg.src = URL.createObjectURL(event.target.files[0]);
    imagefg.onload = function(){
      if(imagebg.src != ""){
        imagefg.width = imagebg.width;
        imagefg.height = imagebg.height;
      }
      loadOnCanvas(idCanvas, imagefg);
    };    
  }
}

//funcao para carregamento da imagem no canvas
function loadOnCanvas(idCanvas, image){
  //canvas
  var canvas = document.getElementById(idCanvas);
  var ctx;
  //dim canvas = dim img
  canvas.width  = image.width;
  canvas.height = image.height;
  ctx = canvas.getContext("2d");
  if(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
}

//funcao para limpar canvas e inputfile
function clearCanvas(idCanvas, isBackground, idInputfile){
  clearOne(idCanvas);
  if(isBackground){
    imagebg = new Image();
    document.getElementById(idInputfile).value = "";
  }else{
    imagefg = new Image();
    document.getElementById(idInputfile).value = "";
  }
}

//funcao para substituir pixels verdes do foreground pelos pixels do background
function replaceGreenPixels(bg, fg){
  //iterando sobre pixels dos canvases
  var i;
  for(i=0; i<fg.data.length; i+=4){
    var RB = fg.data[i+0] + fg.data[i+2];
    var G = fg.data[i+1];
    var diff = RB - G;
    if(diff < 0){
      diff = 0;
    }
    //altera pixels em fg
    if((G>=100 && G>RB) || (G>=200 && diff<50)){
      var j;
      for(j=0; j<4; j++){
        fg.data[i+j] = bg.data[i+j];
      }
    }      
  }
  return fg;
}

//funcao para fazer o resultado
function result(idCanvas1, idCanvas2, idCanvRes){
  //se as imagens foram carregadas
  if(imagefg.src != "" && imagebg.src != ""){
    //contexto dos canvases
    var canvFG = document.getElementById(idCanvas1);
    ctxFG = canvFG.getContext('2d');
    var canvBG = document.getElementById(idCanvas2);
    ctxBG = canvBG.getContext('2d');  
    //imageData dos canvases para acessar pixels
    if(ctxFG && ctxBG){
      var fg = ctxFG.getImageData(0, 0, canvFG.width, canvFG.height);
      var bg = ctxBG.getImageData(0, 0, canvBG.width, canvBG.height);    
      //replacing green pixels
      fg = replaceGreenPixels(bg, fg);
      //coloca fg (modificado) em canvRes
      var canvRes = document.getElementById(idCanvRes);
      canvRes.width = canvFG.width;
      canvRes.height = canvFG.height;
      var ctxRes = canvRes.getContext('2d');
      if(ctxRes){
        ctxRes.putImageData(fg, 0, 0);
        hasResultImg = true;
      }
    }       
  }else{
    alert("Upload your foreground and background images above");
  }
}

//funcao para limpar um canvas
function clearOne(idCanv){
  var canvas = document.getElementById(idCanv);
  var ctx = canvas.getContext("2d");
  if(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 400;
    canvas.height = 200;
    ctx.fillStyle = "#333333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if(idCanv=="canvRes"){
    hasResultImg = false;
  }
}

//funcao para inicializar os canvases
function clearAll(){
  clearOne(canv1);
  clearOne(canv2);
  clearOne(canvRes);
}

//funcao ativada pelo download button
function downloadImage(){
  if(hasResultImg){
    var canv = document.getElementById(canvRes);
    var img = canv.toDataURL("image/png").replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = "image.png";
    link.href = img;
    link.click();
  }else{
    alert("No image available");
  }
}

/*function download(idCanvRes){
  var canvas = document.getElementById(idCanvRes);
  var img = canvas.toDataURL("image/png");
  document.write('<img src="'+img+'"/>');
}*/