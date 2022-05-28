let drugsBrowser = null;

//Create CEF
mp.events.add("accesingMenuDrugs", () =>
{  
    if(drugsBrowser == null) drugsBrowser = mp.browsers.new("package://CEF/jobs//drugsDealer/index.html");   
  
    mp.gui.cursor.visible = true; 
}); 

//Destroy CEF
mp.events.add("destroyMenuDrugs", () =>
{  
    if(drugsBrowser != null) 
    {
        drugsBrowser.destroy();
        drugsBrowser = null;
        mp.gui.cursor.visible = false; 
    }
}); 
 
//Preload to function click buttons
mp.events.add("clickDrugsBrowser", (button) => { 

    //Send info in server-side
    mp.events.callRemote("executeDrugsClick", button);
});

//Load click buttons
function clickDrugsBrowser(button)
{
    mp.trigger("clickDrugsBrowser", button); 
}