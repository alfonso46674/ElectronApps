const {ipcRenderer} = require('electron')
      
     
      ipcRenderer.on('memory-usage',(event,data)=>{
        document.getElementById('memFree').innerHTML = data.toFixed(2)
      })
      ipcRenderer.on('total-memory',(event,data)=>{
        document.getElementById('memTotal').innerHTML = data.toFixed(2)
      })
      ipcRenderer.on('cpu',(event,data)=>{
        document.getElementById('cpu').innerHTML = data.toFixed(2)
      })