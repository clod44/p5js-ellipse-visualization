let canvas;
let cursor;

function setup() {
    frameRate(60);
    pixelDensity(1);
    canvasHolder = document.getElementById("sketch-canvas-container"); 
    canvas = createCanvas(canvasHolder.offsetWidth, canvasHolder.offsetHeight);
    canvas.parent(canvasHolder);
    canvas.style("display","block");
    canvas.style("width","100%");
    console.log("canvas holder size: ", canvasHolder.offsetWidth, ", ", canvasHolder.offsetHeight);
    console.log("canvas size: ", width,", ", height);

    background(20, 20, 30);
    cursor = new Cursor();

    document.getElementById("el-a").min = 0;
    document.getElementById("el-b").min = 0;
    document.getElementById("el-k").min = -width/2;
    document.getElementById("el-h").min = -width/2;
    document.getElementById("el-a").max = width;
    document.getElementById("el-b").max = width;
    document.getElementById("el-k").max = width/2;
    document.getElementById("el-h").max = width/2;

    document.getElementById("el-a").value = 410;
    document.getElementById("el-b").value = 295;
    document.getElementById("el-k").value = 0;
    document.getElementById("el-h").value = 0;

}

function draw(){
    background(20, 20, 30);
    drawGraph(50);
    drawEllipse();
    cursor.updateShow();
}


function drawGraph(scale){
    noFill();
    stroke(255);
    strokeWeight(2);
    line(width/2,0, width/2, height);
    line(0,height/2, width, height/2);

    stroke(255,100,100);
    strokeWeight(2);
    //top-left
    for (let x = width/2; x > -3; x-=scale) {
        for (let y = height/2; y > -3; y-=scale) {
            point(x,y);
        }
    }
    //top-right
    for (let x = width/2; x < width; x+=scale) {
        for (let y = height/2; y > -3; y-=scale) {
            point(x,y);
        }
    }
    //bottom-left
    for (let x = width/2; x > -3; x-=scale) {
        for (let y = height/2; y < height; y+=scale) {
            point(x,y);
        }
    }
    //top-right
    for (let x = width/2; x < width; x+=scale) {
        for (let y = height/2; y < height; y+=scale){
            point(x,y);
        }
    }
}

function drawEllipse(){
    const _a = parseFloat(document.getElementById("el-a").value);
    const _b = parseFloat(document.getElementById("el-b").value);
    const _k = width/2 - parseFloat(document.getElementById("el-k").value);
    const _h = parseFloat(document.getElementById("el-h").value)+height/2;
    stroke(200,200,255);
    strokeWeight(2);
    fill(0,0,255, 100);
    ellipse(_k,_h, _a, _b);
    drawEllipseFocuses(_a,_b,_k,_h);
}

function drawEllipseFocuses(a, b, k, h){
    let f, f1, f2;

    if(a > b){
        f = sqrt( a*a-b*b );
        f1 = createVector(f+k   ,   h);    //focus 1
        f2 = createVector(-(f-k),   h); //focus 2
    }else{
        f = sqrt( b*b-a*a );
        f1 = createVector(k     ,   f+h);    //focus 1
        f2 = createVector(k     ,   -(f-h)); //focus 2
    }
    
    stroke(255,255,0);
    strokeWeight(10);
    point(f1.x, f1.y);
    point(f2.x, f2.y);

    drawTexts(a, b, k, h, f1, f2);
}

function drawTexts(a, b, k, h, f1, f2){
    noStroke();
    textAlign(CENTER);
    
    //area of the ellipse
    const area = round(Math.PI*a*b);
    fill(200, 200, 255);
    text(`A: ${area}`,k,h-5);

    //Circumference of the ellipse
    const c = round(2 * Math.PI * sqrt((a*a + b*b) / 2));
    fill(255, 255, 255);
    text(`Circumference: ${c}`,k+a/2,h+b/2);

    //focus points
    fill(255, 255, 200);
    text(`F1: (${round(f1.x-width/2)}, ${round(height/2-f1.y)})`,f1.x,f1.y-20);
    text(`F2: (${round(f2.x-width/2)}, ${round(height/2-f2.y)})`,f2.x,f2.y+20);
}

class Cursor{
    constructor(){
        this.pos = createVector(0,0);
        this.dpos = createVector(0,0);
        this.interpolationK = 0.2;
    }
    updateShow(){
        this.dpos =  createVector(mouseX, mouseY);
        this.pos = createVector(
            lerp(this.pos.x, this.dpos.x, this.interpolationK),
            lerp(this.pos.y, this.dpos.y, this.interpolationK)
        );    
        stroke(255,255,255,100);
        strokeWeight(1);
        fill(0,0,0,50);
        rect(this.pos.x+20, this.pos.y+20, 90, 30, 0, 10, 10, 10);
        fill(255);
        textAlign(LEFT);
        text(`(${round(this.pos.x-width/2)}, ${round(-this.pos.y+height/2)})`,this.pos.x+25, this.pos.y+40);
    }
}
