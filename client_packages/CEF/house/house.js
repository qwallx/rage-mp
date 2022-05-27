let houseMBrowser = null;
let houseIntteractBrowser = null;
  
//House manage
mp.events.add('showPlayerHouseMenu', (houseStatus, houseOwner, houseRent, houseBalance, houseDescription, totalRenters, rentersString, requestString, offersString) => {
  
    if(houseMBrowser == null) houseMBrowser = mp.browsers.new("package://CEF/house/house.html");  
    mp.gui.cursor.visible = true; 
 
    houseMBrowser.execute(`document.getElementById('hstatus-placeholder').innerHTML = '${houseStatus == 1 ? ('<button class = "btn btn-outline-danger btn-block btn-sm" onclick = "closePlayerHMenu(1);"><i class = "fa fa-lock"></i> Lock</button>') : ('<button class = "btn btn-outline-success btn-block btn-sm" onclick = "closePlayerHMenu(1);"><i class = "fa fa-unlock"></i> Unlock</button>')}'`); 
    houseMBrowser.execute(`document.getElementById('houseOwners-placeholder').innerHTML = '${houseOwner}'`);   
    houseMBrowser.execute(`document.getElementById('houseRent-placeholder').innerHTML = '${houseRent == 0 ? ('<span class="badge badge-pill badge-danger">rent blocked <i class = "fa fa-close"></i></span>') : ('<span class="badge badge-pill badge-success">rent allowed <i class = "fa fa-check"></i></span>')} ${houseRent}$'`); 
    houseMBrowser.execute(`document.getElementById('houseBalance-placeholder').innerHTML = '${houseBalance}$'`);    
    houseMBrowser.execute(`document.getElementById('houseDescriptionPlayer-placeholder').innerHTML = '${houseDescription}'`);     
    houseMBrowser.execute(`document.getElementById('totalRenters-placeholder').innerHTML = '${totalRenters}'`);  
    houseMBrowser.execute(`document.getElementById('checkTotalRenters-placeholder').innerHTML = '${rentersString}'`);   

    //Request
    houseMBrowser.execute(`document.getElementById('requestString-placeholder').innerHTML = '${requestString}'`);   
   
    //Offers string
    houseMBrowser.execute(`document.getElementById('offers-placeholder').innerHTML = '${offersString}'`); 
});
 
mp.events.add("closePlayerHouseMenu", (handle, descrierePusa, rentPus, playerID) => { 

    switch(handle)
    { 
        case 0: 
        {
            if(houseMBrowser != null) { 
                houseMBrowser.destroy(); 
                mp.gui.chat.activate(true);
                mp.gui.cursor.show(false, false);  
                houseMBrowser = null;  
            }
        }  
 
        default: mp.events.callRemote("playerPressHouseButton", handle, descrierePusa, rentPus, playerID);
    }  
    return;
});

function closePlayerHMenu(state, playerID) {

    $('hstatus-placeholder').hide();
    
    let houseDescriptions = document.getElementById("houseDescriptionEnter");  
    let houseRentPrice = document.getElementById("houseRentPriceEnter");   
 
    mp.trigger("closePlayerHouseMenu", state, houseDescriptions.value, houseRentPrice.value, playerID);  
    return;
}      

//House interract
mp.events.add('playerIntteractHouse', (houseID, houseOwner, housePrice, rentPrice, houseDescription) => {
  
    if(houseIntteractBrowser == null) houseIntteractBrowser = mp.browsers.new("package://CEF/house/houseInterract.html");  
    mp.gui.cursor.visible = true; 
  
    //House ID
    houseIntteractBrowser.execute(`document.getElementById('houseID-placeholder').innerHTML = '${houseID}'`);    

    //House price
    houseIntteractBrowser.execute(`document.getElementById('housePrice-placeholder').innerHTML = '${(housePrice == 0) ? ('<span class="badge badge-danger">this house is not for sale <i class = "fa fa-close"></i></span>') : (`${housePrice}$`)}'`);    
  
    //House rent
    houseIntteractBrowser.execute(`document.getElementById('rentPrice-placeholder').innerHTML = '${rentPrice}$ ${rentPrice == 0 ? ('<span class="badge badge-pill badge-danger">rent blocked <i class = "fa fa-close"></i></span>') : ('<span class="badge badge-pill badge-success">rent allowed <i class = "fa fa-check"></i></span>')}'`);    

    //House owner
    houseIntteractBrowser.execute(`document.getElementById('houseOwner-placeholder').innerHTML = '${houseOwner}'`);    

    //House description
    houseIntteractBrowser.execute(`document.getElementById('houseDescription-placeholder').innerHTML = '${houseDescription}'`);    
});
 
mp.events.add('houseInterractsExe', (handle, offerPriced, ids) => { 
  
    switch(handle)
    { 
        case 0: 
        {
            if(houseIntteractBrowser != null) { 
                houseIntteractBrowser.destroy();  
                houseIntteractBrowser = null;  
 
                mp.gui.chat.activate(true);
                mp.gui.cursor.show(false, false);  
            }  
            break;
        }  
        default: mp.events.callRemote("houseInterractsSend", handle, offerPriced, ids);   
    }    
}); 

function houseInterracts(state, ids) {

    let offerPrice = document.getElementById("houseOffer");  
  
    mp.trigger("houseInterractsExe", state, (state == 2) ? (offerPrice.value) : (0), ids);    
}