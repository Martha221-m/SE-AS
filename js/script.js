import { HandLandmarker, FilesetResolver }
   from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.mjs";

console.log ("¿Señas Conecta esta funcionando!");

let detectorManos;
let ultimoTiempoDeteccion = 0;


async function crearDetectorManos() {
    const recursosVision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );
    detectorManos = await HandLandmarker.createFromOptions(recursosVision, {
        baseOptions:{
            modelAssetPath:"../models/hand_landmarker.task",
            delegate:"GPU"
        },
        runningMode:"VIDEO",
        numHands:1

    });
    console.log("¡MediaPipe está listo!");
}

crearDetectorManos();

const botonCamara = document.getElementById("btnCamara");
const videoCamara = document.getElementById("videoCamara");

const canvasManos = document.getElementById("canvasManos");
const contextoCanvas = canvasManos.getContext("2d");

function ajustarTamañoCanvas(){
    canvasManos.width =videoCamara.clientWidth;
    canvasManos.height =videoCamara.clientHeight;
}

function dibujarPuntoMano(x,y){
    contextoCanvas.beginPath();
    contextoCanvas.arc(x,y,5,0,2 * Math.PI);
    contextoCanvas.fill();
}

function dibujarLineaMano(x1,y1,x2,y2){
    contextoCanvas.beginPath();
    contextoCanvas.moveTo(x1,y1);
    contextoCanvas.lineTo(x2,y2);
    contextoCanvas.stroke();
}
const conexionesMano = [
    [0,1],
    [1,2],
    [2,3],
    [3,4],

    [0,5],
    [5,6],
    [6,7],
    [7,8],

    [0,9],
    [9,10],
    [10,11],
    [11,12],

    [0,13],
    [13,14],
    [14,15],
    [15,16],

    [0,17],
    [17,18],
    [18,19],
    [19,20],

    [5,9],
    [9,13],
    [13,17]
    
];


async function detectarManos() {
    if(!detectorManos){
        return;
    }
    const tiempoActual = performance.now();

    if(tiempoActual - ultimoTiempoDeteccion <33) {
        requestAnimationFrame(detectarManos);
        return;
    }
    ultimoTiempoDeteccion = tiempoActual;
    

    const resultadosManos = detectorManos.detectForVideo(
        videoCamara,
        tiempoActual
    );
    contextoCanvas.clearRect(
        0,
        0,
        canvasManos.width,
        canvasManos.height
    );

    for(const puntosMano of resultadosManos.landmarks) {

        for(const [puntoInicio,puntoFinal] of conexionesMano) {

            const xInicio = puntosMano [puntoInicio].x * canvasManos.width;
            const yInicio = puntosMano [puntoInicio].y * canvasManos.height;

            const xFinal = puntosMano [puntoFinal].x * canvasManos.width;
            const yFinal = puntosMano [puntoFinal].y * canvasManos.height;

            dibujarLineaMano(xInicio,yInicio,xFinal,yFinal);

        }
        for(const punto of puntosMano) {
            const x = punto.x * canvasManos.width;
            const y = punto.y * canvasManos.height;
            dibujarPuntoMano(x, y);

        }

    }
    
    requestAnimationFrame(detectarManos);
}

botonCamara.addEventListener("click",async function(){

try{
    const flujoCamara = await navigator.mediaDevices.getUserMedia({
        video: {
            width:640,
            height:480
        }
    });
    
    videoCamara.srcObject = flujoCamara;

    videoCamara.addEventListener("loadeddata", ()=> {
        ajustarTamañoCanvas();
        detectarManos();

    })

}catch (error) {

    console.log("No se puede acceder a la cámara: ", error);
    }

});
