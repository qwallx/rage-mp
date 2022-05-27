var tunningBrowser = null;
var camera = null; 

mp.keys.bind(0x45, true, function() {
 
    if(isChatActive() == false) mp.events.callRemote("start_tunning");	 
}); 


mp.events.add("start_tunning_cef", () => { 

    //START CAMERA 
    camera = mp.cameras.new("camera", new mp.Vector3(-332.80712890625, -141.66856384277344, 39.83681106567383), new mp.Vector3(0, 0, 30), 50);
    camera.pointAtCoord(-326.63397216796875, -147.62355041503906, 39.069000244140625);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    //START CEF
    if(tunningBrowser == null) 
    { 
        tunningBrowser = mp.browsers.new("package://CEF/tunning/index.html");   
        mp.gui.cursor.visible = true;  
    }  
});


mp.events.add("destroy_tunning_camera", () => { 

    camera.destroy();
    mp.game.cam.renderScriptCams(false, false, 3000, true, true); 
});
 
mp.events.add("loadTunningInfo", (option, method, moneyTotal) => { 

    if(option == 4)
    {
        tunningBrowser.destroy();
        tunningBrowser = null;

        mp.gui.cursor.visible = false; 
    }
   
    mp.events.callRemote("apply_tunning", option, method, moneyTotal); 
});


//ADD VEHICLE COMPONENTS
mp.events.add("add_tunning_components", (name, price, index, type) => { 
 
    mp.events.callRemote("add_components", name, price, index, type); 
});

//CHECKOUT
mp.events.add("tunning_checkout", (items, totalPrice) => { 
 
    tunningBrowser.execute("showCheckout('" + items + "', '" + totalPrice + "');");  
});
 

//MOVE VEHICLE
mp.events.add("move_tunning_vehicle", () => { 
 
    mp.events.callRemote("on_vehicle_tunning_move", mp.gui.cursor.position[0]);  
}); 