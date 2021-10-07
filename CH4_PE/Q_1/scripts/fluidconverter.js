function setup()
{
    document.getElementById("gallons").onclick= function() {setUnits("litres");};
    document.getElementById("litres").onclick= function() {setUnits("gallons");};
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