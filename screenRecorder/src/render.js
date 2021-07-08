

//Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');

const {desktopCapturer,remote} = require('electron');
const {Menu,dialog} = remote;
const {writeFile} = require('fs')

//instance to capture footage
let mediaRecorder
const recorderChunks = []


//obtain available video sources

videoSelectBtn.onclick = getVideoSources;
async function getVideoSources(){
    const inputSources = await desktopCapturer.getSources({
        types: ['window','screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name,
                click: () => selectSource(source)
            };
        })
    );

    videoOptionsMenu.popup();
}

//change videoSource window to record
async function selectSource(source){
    videoSelectBtn.innerText = source.name;

    const configuration = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };

    //create stream
    const stream = await navigator.mediaDevices.getUserMedia(configuration)


    //preview source in video
    videoElement.srcObject = stream
    videoElement.play()

    //create media recorder
    const options = {mimeType: 'video/webm; codecs=vp9'}
    mediaRecorder = new MediaRecorder(stream,options)

    //register event handlers
    mediaRecorder.ondataavailable = handleDataAvailable
    mediaRecorder.onstop = handleStop
}

//captures all recorded chunks
function handleDataAvailable(e){
    recorderChunks.push(e.data)
}

//saves video file on stop
async function handleStop(e){
    const blob = new Blob(recorderChunks,{
        type: 'video/webm; codecs=vp9'
    });

    const buffer = Buffer.from(await blob.arrayBuffer())

    const {filePath} = await dialog.showSaveDialog({
        buttonLabel: 'Save video',
        defaultPath: `video_${Date.now()}.webm`
    })

    writeFile(filePath,buffer,()=>console.log('video saved succesfully'))
}


//start recording from button
startBtn.onclick = e => {
    mediaRecorder.start()
    startBtn.classList.add('is-danger')
    startBtn.innerText='Recording'
}


//stop recording from button
stopBtn.onclick = e => {
    mediaRecorder.stop()
    startBtn.classList.remove('is-danger')
    startBtn.innerText = 'Start'
}