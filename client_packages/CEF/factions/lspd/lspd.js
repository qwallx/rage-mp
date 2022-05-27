let lspdBrowser = null; 
let playerTicketBrowser = null;

//Factions


//View member informations and uninvite member (only this)
mp.events.add("openFactionModal", (modalID, memberID, memberName, memberRank, memberFW, memberFP) => {  
    if(lspdBrowser != null)
    { 
        lspdBrowser.execute("clickMember('" + modalID + "', '" + memberID + "', '" + memberName + "', '" + memberRank + "', '" + memberFW + "', '" + memberFP + "');"); 
    }
});

//Show player CEF
mp.events.add('showManagerLSPD', (factionID, wantedsString, ticketsString, membersString, factionName) => {
 
    if(lspdBrowser == null) lspdBrowser = mp.browsers.new("package://CEF/factions/lspd/lspd.html");
    mp.gui.cursor.visible = true; 
  
    lspdBrowser.execute("showTabsFaction('" + factionID + "', '" + wantedsString + "', '" + ticketsString + "', '" + membersString + "', '" + factionName + "');"); 
});
 
mp.events.add("callButtonManagerExecute", (button, playerID, ticketMember, ticketReason, wantedMember, wantedReason, wantedAmount, playerSearch, licenseID, licenseHours, uninviteFP, uninviteReason) => { 
     
    switch(button)
    {   
        case 0: //Call close browser
        { 
            if(lspdBrowser != null)
            {
                lspdBrowser.destroy();
                lspdBrowser = null;
                mp.gui.cursor.visible = false; 
                break;
            }  
        }   
    }    

    mp.events.callRemote("playerManagerExecute", button, playerID, ticketMember, ticketReason, wantedMember, wantedReason, wantedAmount, playerSearch, licenseID, licenseHours, uninviteFP, uninviteReason);   
});


mp.events.add("updaMemberStatistics", (targetID, buttonSelect, count) => { 
      
    mp.events.callRemote("updaMemberStatistics2", targetID, buttonSelect, count);  
});
 
//View search resolutions
mp.events.add("searchResolution", (playerID, playerName, playerDriving, playerWanted, playerCrimes, playerArrests) => {  
    if(lspdBrowser != null)
    {    
        var texted = (playerDriving == 0 ? ('<span class="badge badge-pill badge-danger">Taken <i class="fa fa-times" aria-hidden="true"></i></span>') : ('<span class="badge badge-pill badge-success">Passed <i class="fa fa-check" aria-hidden="true"></i></span>'));
 
        lspdBrowser.execute("searchPlayer('" + playerID + "', '" + playerName + "', '" + playerDriving + "', '" + playerWanted + "', '" + playerCrimes + "', '" + playerArrests + "', '" + texted + "');"); 
    }
});
 

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//


//Tickets LSPD 
mp.events.add('showPlayerTickets', (generalString, welcomeString) => {
 
    if(playerTicketBrowser == null) playerTicketBrowser = mp.browsers.new("package://CEF/factions/lspd/playerTickets.html");
      
    if(playerTicketBrowser != null)
    {
        //General string
        playerTicketBrowser.execute(`document.getElementById('playerTickets-placeholder').innerHTML = '${generalString}'`);

        //Welcome string
        playerTicketBrowser.execute(`document.getElementById('infoTicketsString-placeholder').innerHTML = '${welcomeString}'`);    
    }
      
    mp.gui.cursor.visible = true;
});
 
mp.events.add("playerTicketF2", (button, ticketID, ticketPrice) => { 

    switch(button)
    {   
        case 0: //Call close browser
        { 
            if(playerTicketBrowser != null)
            {
                playerTicketBrowser.destroy();
                playerTicketBrowser = null;
                mp.gui.cursor.visible = false; 
                break;
            }  
        }   
    }   

    mp.events.callRemote("playerPayTicket", button, ticketID, ticketPrice);    
});

function playerTicketF(button, ticketID, ticketPrice)
{     
    mp.trigger("playerTicketF2", button, ticketID, ticketPrice);   
} 