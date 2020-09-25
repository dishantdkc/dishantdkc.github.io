// Variables
var tooltype = 'pen';
var toolWidth = 1;
var penColor = '#000';
var highlighterColor = 'rgba(255,255,0,0.5)';
var canvasColor = 'white';
var isDrawing = false;
var last_mousex = 0;
var last_mousey = 0;
var mousex = 0;
var mousey = 0;
var canvasx = 0;
var canvasy = 0;
var canvas = null;
var ctx = null;
var canvasBeforeHighlighting = null;

setUpCanvas = () => {
  // values
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  ctx.fillStyle = canvasColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvasx = canvas.offsetLeft;
  canvasy = canvas.offsetTop;
  // events
  canvas.addEventListener("mousedown", startDrawing);
  document.addEventListener('mouseup', endDrawing);
  canvas.addEventListener('mousemove', draw);
}

const startDrawing = e => {
  var isRestoring = false;
  if(canvasBeforeHighlighting) {
    isRestoring = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var canvasImage = new Image;
    canvasImage.src= new String(canvasBeforeHighlighting);
    if(tooltype !== 'highlighter'){   
      canvasBeforeHighlighting = null;
    }
    canvasImage.onload = () => {
      ctx.globalAlpha = 1;
      ctx.drawImage(canvasImage,0,0,canvas.width,canvas.height);
    }
  }

  if(tooltype === 'highlighter' && !isRestoring) {
    console.log(' saving');
    canvasBeforeHighlighting  = canvas.toDataURL("image/png");
  }

  last_mousex = mousex = parseInt(e.clientX-canvasx);
  last_mousey = mousey = parseInt(e.clientY-canvasy);
  isDrawing = true;
}

const endDrawing = () => {
  isDrawing = false;
}

const draw = e => {
  if(isDrawing) {
    mousex = parseInt(e.clientX-canvasx);
    mousey = parseInt(e.clientY-canvasy);
    ctx.beginPath();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.lineWidth = toolWidth;
    switch(tooltype) {
      case 'pen': 
        ctx.strokeStyle = penColor;
        break;
      case 'eraser':
        ctx.strokeStyle = canvasColor;
        break;
      case 'highlighter':
        ctx.strokeStyle = highlighterColor;
        ctx.globalAlpha = 0.5;
        break;
    }
    ctx.moveTo(last_mousex,last_mousey);
    ctx.lineTo(mousex,mousey);
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.stroke();
  }
  last_mousex = mousex;
  last_mousey = mousey;
}

const reset = () => {
  ctx.fillStyle = canvasColor;
  ctx.globalAlpha = 1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canvasBeforeHighlighting = null;
  // selectTool(1)
}

const selectTool = (tool) => {
  unselectAllTools();
  switch(tool) {
    case 1:
      toolWidth = 1;
      tooltype = 'pen';
      document.getElementById('tool1').classList.add("selectedTool");
      break;
    case 2:
      toolWidth = 3;
      tooltype = 'pen';
      document.getElementById('tool2').classList.add("selectedTool");
      break;
    case 3:
      toolWidth = 5;
      tooltype = 'pen';
      document.getElementById('tool3').classList.add("selectedTool");
      break;
    case 4:
      tooltype = 'eraser'
      toolWidth = 10;
      document.getElementById('tool4').classList.add("selectedTool");
      break;
    case 5:
      tooltype = 'highlighter'
      toolWidth = 5;
      document.getElementById('tool5').classList.add("selectedTool");
      break;
    
  }
}

const unselectAllTools = () => {
  Array.prototype.forEach.call(
    document.getElementsByClassName('tool'),
    (tool)=>{
      tool.classList.remove("selectedTool");
    }
  )
}