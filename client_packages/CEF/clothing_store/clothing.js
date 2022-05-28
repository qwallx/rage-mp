var clothingBrowser = null;
var creatorCamera = null; 
const localPlayer = mp.players.local; 

mp.keys.bind(0x45, true, function() {
 
    if(isChatActive() == false) mp.events.callRemote("startClothing");	 
}); 
  
mp.events.add("showPlayerClothes", (gender) =>
{    
    //OPEN BROWSER
    if(clothingBrowser == null) 
    { 
        clothingBrowser = mp.browsers.new("package://CEF/clothing_store/index.html");   
        mp.gui.cursor.visible = true;  
    }
  
    //FREEZE & ROTATION
    localPlayer.freezePosition(true);  
 
    //CREATE CAMERA 
    creatorCamera = mp.cameras.new('default', new mp.Vector3(0,  0,  0), new mp.Vector3(0,0,0), 40);

    const playerPosition = mp.players.local.position;
    creatorCamera.setActive(true);
    creatorCamera.pointAtPedBone(mp.players.local.handle, 0, 0, 0, 0, true);
    creatorCamera.setCoord(playerPosition.x + 1, playerPosition.y + 1, playerPosition.z);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    creatorCamera.setFov(80);
 
    //Set ANIMATION
    localPlayer.taskPlayAnim("amb@world_human_guard_patrol@male@base", "base", 8.0, 1, -1, 1, 0.0, false, false, false);


    clothingBrowser.execute(`update_gender(${gender});`); 
}); 


mp.events.add("clicked_button", (option, item, money, index, drawable, color) => { 
 
    if(option == 0 && clothingBrowser != null)
    {
        clothingBrowser.destroy();
        clothingBrowser = null;

        mp.gui.cursor.visible = false;  
        localPlayer.freezePosition(false); 

        creatorCamera.destroy();
        creatorCamera = null;

        mp.game.cam.renderScriptCams(false, false, 3000, true, true); 
    }  

    if(option == 4)
    {
        mp.events.call("showNotification", ['Items is now reseted.']);	
    }

    mp.events.callRemote("clicked_clothes_button", option, item, money, index, drawable, color);
});   


mp.events.add("apply_item_character", (index, drawable, color) => { 
  
    mp.events.callRemote("clothing_apply", index, drawable, color);
});   