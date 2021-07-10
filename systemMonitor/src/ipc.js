const {ipcRenderer} = require('electron')
      
     
      ipcRenderer.on('memory-usage',(event,data)=>{
        console.log('Memory usage %: ' + data);
      })
      ipcRenderer.on('total-memory',(event,data)=>{
        console.log('Total memory (GB): ' + data);
      })
      ipcRenderer.on('cpu',(event,data)=>{
        console.log('CPU %: ' + data);
      })