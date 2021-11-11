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

$( "#btnEnter" ).click(function()
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
});