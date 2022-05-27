let jobBlip = null;
let jobCheckpoint = null;  
let jobsBrowser = null;
let indexJobTD = null;
let indexJobInfo = null; 
let jobIndexWorks = null; 

//Key E fisherman job
mp.keys.bind(0x45, true, function() {

    //case 0 - fisherman job 
    if(isChatActive() == false) mp.events.callRemote("accesingJobKey");	
});

//ATTACH TRAILER TO CAMION
mp.keys.bind(0x12, true, function() 
{ 
    mp.events.callRemote("auto_attach_trailer");	 
});

mp.events.add('job:attachTrailer', (truck, trailer) => {

    const player = mp.players.local;
 
    if(isChatActive() == false && player.vehicle)
    {  
        if(player.vehicle.isAttachedToTrailer() == true)
            return; 
 
        mp.vehicles.forEachInRange(player.position, 15, (x) => {

            if(x == trailer && player.vehicle == truck)
            {  
                player.vehicle.attachToTrailer(trailer.handle, 100); 
                mp.events.call("showNotification", ['Your trailer is now attached to vehicle.']);	 
            }
        }); 
    }
});

mp.events.add('attach_triler', (truck, trailer) => {

    const player = mp.players.local;

    if(player.vehicle == truck)
    {  
        player.vehicle.attachToTrailer(trailer.handle, 100);  
    }
});
  
mp.events.add('job_setBlip', (title, x,y,z) => {

    jobBlip = mp.blips.new(1, new mp.Vector3(x, y, z), { name:  title, scale: 1, color: 66, alpha: 255, shortRange: false, dimension: 0 });
    jobBlip.setRoute(true);
});
 
mp.events.add('job_setCheckpoint', (x, y, z, range) => {

    jobCheckpoint = mp.checkpoints.new(4, new mp.Vector3(x, y, z - 1.0), range, { direction: new mp.Vector3(0, 0, 75), color: [ 225, 177, 44, 100 ], visible: true, dimension: 0 });
});
 
mp.events.add("playerEnterCheckpoint", (checkpoint) => {

    const player = mp.players.local;
    
    if(jobCheckpoint != null && checkpoint == jobCheckpoint &&  player.vehicle) 
    {
        mp.events.callRemote("onJobCheckpointEntered", player.vehicle.isAttachedToTrailer());
    }
});
 
  
mp.events.add('job_destroyCheckpoint', () => {
   
    if(jobCheckpoint != null) 
    { 
        jobCheckpoint.destroy();
        jobCheckpoint = null;
    }
});
  
mp.events.add('job_destroyBlip', () => {
  
    if(jobBlip != null && jobBlip) 
    {
        jobBlip.setRoute(false);
        jobBlip.destroy();
        jobBlip = null;
    }
});  
 
mp.events.add('onJobSelected', (job) => {  
    if(indexJobTD == null) indexJobTD = mp.browsers.new("package://CEF/jobs/job_trucker_routes.html"); 
 
    mp.gui.cursor.show(true, true); 
    return;
});
   
mp.events.add('closeJobTimer', () => {

    if(indexJobInfo != null) 
    {
        indexJobInfo.destroy();
        indexJobInfo = null; 
    } 

    if(indexJobTD != null)
    {
        indexJobTD.destroy();
        indexJobTD = null;
    } 
    return;
});
 
//Jobs sistem 
mp.events.add('showJobsBrowser', (text) => {

    if(jobsBrowser == null) jobsBrowser = mp.browsers.new("package://CEF/jobs/job_view_count.html"); 
    mp.gui.cursor.visible = true; 
 
    jobsBrowser.execute(`document.getElementById('jobHolder-placeholder').innerHTML = '${text}'`);  
    return;
});
 
mp.events.add('showJobWorksInfo', (player, jobInformations, jobName, jobWorkers, moneyCollect, plantCollected) => {
 
    if(jobIndexWorks == null) 
    {
        jobIndexWorks = mp.browsers.new("package://CEF/jobs/job_work_menu.html");  
        mp.gui.cursor.visible = true;
    } 

    if(jobIndexWorks != null)
    { 
        jobIndexWorks.execute(`document.getElementById('jobWorksInfo-placeholder').innerHTML = '<i>${jobInformations}</i>'`);   
        jobIndexWorks.execute(`document.getElementById('jobMenu-placeholder').innerHTML = '${jobName}'`);    
         
        //Duty
        jobIndexWorks.execute(`document.getElementById('jobDutyStatus-placeholder').innerHTML = '${(player.getVariable("playerStartedWork") == false) ? ('<button class = "btn btn-block btn-outline-info btn-sm" id = "jobDutyStatus-placeholder" onclick="sendJobInformations(7);">Go on duty <i class="fa fa-toggle-on" aria-hidden="true"></i></button>') : ('<button class = "btn btn-block btn-outline-warning btn-sm" id = "jobDutyStatus-placeholder" onclick="sendJobInformations(7);">Go off duty <i class="fa fa-toggle-off" aria-hidden="true"></i></button>')}'`);  
     
        //Work button
        jobIndexWorks.execute(`document.getElementById('workButton-placeholder').innerHTML = '${moneyCollect == 0 ? ('<button class = "btn btn-block btn-outline-success btn-sm" onclick = "sendJobInformations(8);">Start Work <i class="fa fa-check-circle" aria-hidden="true"></i></button>') : ('<button class = "btn btn-block btn-outline-success btn-sm" onclick = "sendJobInformations(8);">Get your money <i class="fa fa-money" aria-hidden="true"></i></button>')}'`);  
 
        //Informations
        jobIndexWorks.execute(`document.getElementById('jobWorkers-placeholder').innerHTML = '<span class="badge badge-pill badge-warning">${jobWorkers}</span>'`);     
        jobIndexWorks.execute(`document.getElementById('moneyCollect-placeholder').innerHTML = '<span class="badge badge-pill badge-success">${moneyCollect == 0 ? ('you didn`t plant') : (`${moneyCollect}$`)}</span>'`);    
        jobIndexWorks.execute(`document.getElementById('plantCollected-placeholder').innerHTML = '<span class="badge badge-pill badge-info">${plantCollected}</span>'`);    
    } 
});
 
  
mp.events.add("loadButtonInformations", (handle, jobID) => { 
  
    //Call events from server-side  
    if(handle == 0 || handle == 1 || handle == 2 || handle == 3 || handle == 5 || handle == 7 || handle == 8)
    {  
        let player = mp.players.local;
  
        mp.events.callRemote("playerPressJobButton", handle, jobID);
 
        if(handle == 7)
        { 
            if(jobIndexWorks != null)
            {    
                //Duty
                jobIndexWorks.execute(`document.getElementById('jobDutyStatus-placeholder').innerHTML = '${(player.getVariable("playerStartedWork") == false) ? ('<button class = "btn btn-block btn-outline-warning btn-sm" id = "jobDutyStatus-placeholder" onclick="sendJobInformations(7);">Go off duty <i class="fa fa-toggle-off" aria-hidden="true"></i></button>') : ('<button class = "btn btn-block btn-outline-info btn-sm" id = "jobDutyStatus-placeholder" onclick="sendJobInformations(7);">Go on duty <i class="fa fa-toggle-on" aria-hidden="true"></i></button>')}'`);  
                return;
            } 
        } 
    } 
  
    //Destroy trucker routes browser
    if(indexJobTD != null) 
    {
        indexJobTD.destroy();
        
        indexJobTD = null;   
    }

    //Destroy [/jobs] browser
    if(jobsBrowser != null)
    {
        jobsBrowser.destroy();
        
        jobsBrowser = null;  
    }  
 
    //Destroy [/work] browser
    if(jobIndexWorks != null && handle == 6 || handle == 8)
    {
        jobIndexWorks.destroy();
        
        jobIndexWorks = null;   
    } 

    if(handle != 7)
    {
        //Hide cursor, show chat
        mp.gui.chat.activate(true);
        mp.gui.cursor.show(false, false);  
        mp.gui.cursor.visible = false;
    } 
});
 
function sendJobInformations(buttonState, jobID) 
{  
    mp.trigger("loadButtonInformations", buttonState, jobID); 
}  

//QUIT AND GET JOB
mp.keys.bind(0x4C, true, function() {
 
	if(isChatActive() == false) mp.events.callRemote("commandQuitJob");	
}); 

mp.keys.bind(0x4B, true, function() {
 
	if(isChatActive() == false) mp.events.callRemote("commandGetJob");	
}); 