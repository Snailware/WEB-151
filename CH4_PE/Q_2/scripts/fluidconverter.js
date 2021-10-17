function setup()
{
    document.getElementById("gallons").onclick= function() {setUnits("litres");};
    document.getElementById("litres").onclick= function() {setUnits("gallons");};

    var volumeInput=document.getElementById("volume");
    volumeInput.addEventListener("blur", validateVolume);
}

function setUnits(unit) 
{
    var label=document.getElementById("label");
    label.innerHTML=unit
}

function convert() 
{
    var litresButton=document.getElementById("litres");
    var volume=document.getElementById("volume");

    if(litresButton.checked)
    {
        convertToLitres(volume.value)
    }
    else
    {
        convertToGallons(volume.value)
    }
}

function convertToLitres(volumeInGallons)
{
    var litreVolume=volumeInGallons*3.78541
    document.getElementById("answer").innerHTML= volumeInGallons + " gallons converts to " + litreVolume.toFixed(1) + " litres."
}

function convertToGallons(volumeInLitres)
{
    var gallonVolume=volumeInLitres/3.78541
    document.getElementById("answer").innerHTML= volumeInLitres + " litres converts to " + gallonVolume.toFixed(1) + " gallons."
}

function validateVolume()
{
    var volumeInput=document.getElementById("volume");
    if (volumeInput.value > 1000 && document.getElementById("label").innerHTML == "gallons")
    {
        alert("gallons input must be below 1000.")
        volumeInput.value = "";
    } else if (volumeInput.value > 4000 && document.getElementById("label").innerHTML == "litres")
    {
        alert("litres input must be below 4000.")
        volumeInput.value = "";
    }
}