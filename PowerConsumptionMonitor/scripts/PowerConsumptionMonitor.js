// adds values to password.
function addValueToPassword(button)
{
    var currVal=$("#passcode").val();

    if(button=="bksp")
    {
        $("#passcode").val(currVal.substring(0,currVal.length-1));
    }
    else 
    {
        $("#passcode").val(currVal.concat(button));
    }
}

// get password from storage. returns default if none exist.
function getPassword() 
{
    if (typeof(Storage) == "undefined")
    {
        alert("Your browser does not support HTML5 LocalStorage. Try upgrading.");
    }
    else if (localStorage.getItem("plant")!=null) 
    {
        return JSON.parse(localStorage.getItem("plant")).NewPassword;
    }
    else
    {
        // default password.
        return "2345"
    }
}

// submit entered password to be compared with stored password. 
function submitPassword()
{
    var password=getPassword();
    if(document.getElementById("passcode").value==password)
    {
        if(localStorage.getItem("plant")==null)
        {
            $.mobile.changePage("#pagePlantInfo");
        }
        else
        {
            $.mobile.changePage("#pageMenu");
        }
    }
    else 
    {
        alert("Incorrect password, please try again.");
    }
}

// submit plant infoto local storage.
function submitPlantForm() 
{
    savePlantForm();
    return true;
}

// save plant info to local storage. 
function savePlantForm()
{
    if(checkPlantForm())
    {
        // plant object to be saved. 
        var plant = 
        {
            "PlantID" : $("#txtPlantID").val(),
            "InstallDate" : $("#installDate").val(),
            "NewPassword" : $("#changePassword").val()
        };

        try 
        {
            localStorage.setItem("plant", JSON.stringify(plant));
            alert("Saving Information");
            $.mobile.changePage("#pageMenu");
        }
        catch(e)
        {
            if(window.navigator.vendor === "Google Inc") 
            {
                if(e == DOMException.QUOTA_EXCEEDED_ERR)
                {
                    alert("Error: Local Storage limit exceeded.");
                }
            }
            else if(e == QUOTA_EXCEEDED_ERR)
            {
                alert("Error: Saving to local storage.");
            }

            console.log(e);
        }
    }
    else
    {
        alert("Please complete the form properly.");
    }
}

// check form fields for validity.
function checkPlantForm()
{
    var d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var year = d.getFullYear();
    var currentDate = year + '/' + 
    (('' + month).length < 2 ? '0' : '') + month + '/' +
    (('' + date).length < 2 ? '0' : '') + date;

    if(($("#txtPlantID").val() != "") &&
        ($("#installDate").val() != "") &&
        ($("#installDate").val() <= currentDate))
    {
        return true;
    }
    else 
    {
        return false;
    }
}

// populate stored plant obj data in form.
function showPlantForm()
{
    try
    {
        var plant = JSON.parse(localStorage.getItem("plant"));
    }
    catch(e) 
    {
        if(window.navigator.vendor === "Google Inc") 
        {
            if(e == DOMException.QUOTA_EXCEEDED_ERR)
            {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if(e == QUOTA_EXCEEDED_ERR)
        {
            alert("Error: Saving to local storage.");
        }

        console.log(e);
    }

    if(plant != null)
    {
        $("#txtPlantID").val(plant.PlantID);
        $("#installDate").val(plant.InstallDate);
        $("#changePassword").val(plant.NewPassword);
    }
}

// displays information for each page as they are shown.
$(document).on("pageshow", function()
{
    if($('.ui-page-active').attr('id')=="pagePlantInfo")
    {
        showPlantForm();
    }
    else if($('.ui-page-active').attr('id')=="pagePlantRecords")
    {
        loadPlantInformation();
        //listRecords();
    }
    else if($('.ui-page-active').attr('id')=="pagePlantRecommendations")
    {
        advicePage();
        resizeGraph();
    }
    else if($('.ui-page-active').attr('id')=="pagePlantGraph")
    {
        drawGraph();
        resizeGraph();
    }
});

// display plant info on records page.
function loadPlantInformation()
{
    try
    {
        var plant = JSON.parse(localStorage.getItem("plant"));
    }
    catch(e) 
    {
        if(window.navigator.vendor === "Google Inc") 
        {
            if(e == DOMException.QUOTA_EXCEEDED_ERR)
            {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if(e == QUOTA_EXCEEDED_ERR)
        {
            alert("Error: Saving to local storage.");
        }

        console.log(e);
    }

    if(plant != null)
    {
        $("#divPlantSection").empty();

        $("#divPlantSection").append("Plant ID:" + plant.PlantID + "<br/>" +
                                     "Install Date:" + plant.InstallDate + "<br/>" +
                                     "New Password:" + plant.NewPassword);
                        
        $("#divPlantSection").append("<br/><a href='#pagePlantInfo' data-mini='true' id='btnProfile' data-role='button' data-icon='edit' data-iconpos='left' data-inline='true'>Edit Profile</a>");
        $('#btnProfile').button();
    }


}

// triggers new record page.
$("btnAddRecord").click(function()
{
    $("btnSubmitRecord").val("Add");
    if($("#btnSubmitRecord").hasClass("btn-ui-hidden"))
    {
        $("#btnSubmitRecord").button("refresh");
    }
});

// initiates addition of record.
$("#pageNewRecordForm").on("pageshow", function()
{
    var formOperation = $("#btnSubmitRecord").val();

    if(formOperation == "Add")
    {
        clearRecordForm();
    }
    else if(formOperation == "Edit")
    {
        showRecordForm($("btnSubmitRecord").attr("indexToEdit"));
    }
});

