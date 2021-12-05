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
        listRecords();
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

/* change button values. value of button is used to determine which operation
 to perform.*/
$("#btnAddRecord").click(function()
{
    $("#btnSubmitRecord").val("Add");
    if($("btnSubmitRecord").hasClass("btn-ui-hidden")) // might need to add #
    {
        $("#btnSubmitRecord").button("refresh");
    }
});

// trigger addition of new record.
$("#frmNewRecordForm").submit(function()
{
    var formOperation = $("#btnSubmitRecord").val();

    if (formOperation == "Add")
    {
        addRecord();
        $.mobile.changePage("#pagePlantRecords");
    }
    else if (formOperation == "Edit")
    {
        editRecord($("#btnSubmitRecord").attr("indexToEdit"));
        $.mobile.changePage("#pagePlantRecords");
        $("#btnSubmitRecord").removeAttr("indexToEdit");
    }

    return false;
});

// add record to array in local storage.
function addRecord()
{
    if (checkRecordForm()) 
    {
        var d = new Date();
        var month = d.getMonth() + 1;
        var date = d.getDate();
        var currentDate = d.getFullYear() + '/' + 
        (('' + month).length < 2 ? '0' : '') + month + '/' +
        (('' + date).length < 2 ? '0' : '') + date;

        var record = 
        {
            "powerConsumed" : $('#powerConsumption').val(),
            "dateEntered"   : currentDate
        };

        try
        {
            var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
            if (tbRecords == null)
            {
                tbRecords = [];
            }
            tbRecords.push(record);
            localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
            alert("Saving Information.");
            clearRecordForm();
            listRecords();
        }
        catch(e)
        {
            if (window.navigator.vendor === "Google Inc")
            {
                if (e == DOMException.QUOTA_EXCEEDED_ERR)
                {
                    alert("Error: Local Storage limit exceeded.");
                }
            }
            else if (e == QUOTA_EXCEEDED_ERR)
            {
                alert("Error: Saving to local storage.");
            }

            console.log(e);
        }
    }
    else
    {
        alert("Please complete the form properly.")
    }

    return true;
}

// verify validity of data entry. 
function checkRecordForm() 
{
    if (($("#powerConsumption").val() != "") && 
        (parseFloat($("#powerConsumption")) > 0))
    {
        return true;
    }
    else 
    {
        return false;
    }
}

// populate table with records.
function listRecords() 
{
    try
    {
        var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
    }
    catch(e)
    {
        if (window.navigator.vendor === "Google Inc")
        {
            if (e == DOMException.QUOTA_EXCEEDED_ERR)
            {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if (e == QUOTA_EXCEEDED_ERR)
        {
            alert("Error: Saving to local storage.");
        }
        console.log(e);
    }

    if (tbRecords != null)
    {
        tbRecords.sort(compareDates); // double check this

        $("#tblPlantRecords").html(
            "<thead>"+
            "   <tr>"+
            "       <th>Date</th>"+
            "       <th><abbr title='Power Consumption'>PC</abbr></th>"+
            "       <th>Edit / Delete</th>"+
            "   </tr>"+
            "</thead>"+
            "<tbody>"+
            "</tbody>"
        );

        for(var i=0; i < tbRecords.length; i++)
        {
            var record = tbRecords[i];

            $("#tblPlantRecords tbody").append(
                "</tr>"+
                "   <td>"+record.dateEntered+"</td>"+
                "   <td>"+record.powerConsumed+"</td>"+
                "   <td><a data-inline='true' data-mini='true' data-role='button' href='#pageNewRecordForm' onclick='callEdit("+i+")' data-icon='edit' data-iconpos='notext'></a>"+
                "   <a data-inline='true' data-mini='true' data-role='button' href='#' onclick='callDelete("+i+")' data-icon='delete' data-iconpos='notext'></a></td>"+
                "</tr>"
            );
        }

        $('#tblPlantRecords [data-role="button"]').button();
    }
    else
    {
        $("#tblPlantRecords").html("");
    }
    
    return true;
}

// compare 2 dates.
function compareDates(a, b)
{
    var x = new Date(a.Date);
    var y = new Date(b.Date);

    if(x>y)
    {
        return 1;
    }
    else
    {
        return -1;
    }
}

// change button attr as needed.
function callEdit(index)
{
    $("#btnSubmitRecord").attr("indexToEdit", index);
    $("#btnSubmitRecord").val("Edit");

    if($("#btnSubmitRecord").hasClass("btn-ui-hidden"))
    {
        $("#btnSubmitRecord").button("refresh");
    }
}

// edit selected record.
function editRecord(index)
{
    if(checkRecordForm())
    {
        try
        {
            var tbRecords=JSON.parse(localStorage.getItem("tbRecords"));
            tbRecords[index] = 
            {
                "powerConsumed" : $('#powerConsumption').val(),
                "dateEntered"   : currentDate
            };
            localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
            alert("saving information");
            clearRecordForm();
            listRecords();
        }
        catch(e)
        {
            if (window.navigator.vendor === "Google Inc")
            {
                if (e == DOMException.QUOTA_EXCEEDED_ERR)
                {
                    alert("Error: Local Storage limit exceeded.");
                }
            }
            else if (e == QUOTA_EXCEEDED_ERR)
            {
                alert("Error: Saving to local storage.");
            }

            console.log(e);
        }
    }
    else
    {
        alert("Please complete the form properly.")
    }
}

// clear record form.
function clearRecordForm()
{
    $('#powerConsumption').val("");
    return true;
}

// display record in form.
function showRecordForm(index)
{
    try
    {
        var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
        var rec = tbRecords[index];
        $('#powerConsumption').val(rec.powerConsumed);
    }
    catch(e)
    {
        if (window.navigator.vendor === "Google Inc")
        {
            if (e == DOMException.QUOTA_EXCEEDED_ERR)
            {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if (e == QUOTA_EXCEEDED_ERR)
        {
            alert("Error: Saving to local storage.");
        }
        console.log(e);
    }
}

// delete selected record.
function deleteRecord(index)
{
    try
    {
        var tbRecords = JSON.parse(localStorage.getItem("tbRecords"));
        tbRecords.splice(index, 1);
        if(tbRecords.length==0)
        {
            localStorage.removeItem("tbRecords");
        }
        else
        {
            localStorage.setItem("tbRecords", JSON.stringify(tbRecords));
        }
    }
    catch(e)
    {
        if (window.navigator.vendor === "Google Inc")
        {
            if (e == DOMException.QUOTA_EXCEEDED_ERR)
            {
                alert("Error: Local Storage limit exceeded.");
            }
        }
        else if (e == QUOTA_EXCEEDED_ERR)
        {
            alert("Error: Saving to local storage.");
        }
        console.log(e);
    }
}

// call delete func and refresh records.
function callDelete(index)
{
    deleteRecord(index);
    listRecords();
}

//remove all record data from local storage.
$("btnClearHistory").click(function() 
{
    localStorage.removeItem("tbRecords");
    listRecords();
    alert("All records have been deleted.");
});

