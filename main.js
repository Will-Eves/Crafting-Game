var items = [];
var recipies = [];

var inventory = [];

var gamedata;

function addItem(name){
    items[name] = [name];
}

function addRecipie(name, items){
    recipies.push([name, items]);
}

function craft(items){
    var length = recipies.length;
    var name = "None";
    for(var i = 0; i < length; i++){
        if(recipies[i][1].length == items.length){
            var len = recipies[i][1].length;
            var craft = false;
            for(var j = 0; j < len; j++){
                craft = true;
                for(var a = 0; a < len; a++){
                    if(recipies[i][1][a] == items[j]){
                        craft = false;
                    }
                }
            }
            craft = (recipies[i][1].sort().join(',') === items.sort().join(','));
            if(craft){
                name = recipies[i][0];
                if(inventory[name] == null){
                    inventory[name] = 0;
                }
                inventory[name]++;
                break;
            }
        }
    }
    return name;
}

var inventoryElement;
var craftElement;

//Data Handling
function readTextFile(name) {
    var rawFile = new XMLHttpRequest();
    var out;
    rawFile.open("GET", name, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            var allText = rawFile.responseText;
            out = allText;
        }
    }
    rawFile.send();
    return out;
}

//Load Game
window.onload = function(){
    var text = readTextFile("data.gamdat");
    console.log(text);

    addItem("air");
    addItem("water");
    addItem("fire");
    addItem("earth");

    inventory["air"] = 1;
    inventory["water"] = 1;
    inventory["fire"] = 1;
    inventory["earth"] = 1;
    
    addRecipie("mud", ["water", "earth"]);
    addRecipie("dust", ["fire", "earth"]);
    addRecipie("sand", ["air", "earth"]);
    addRecipie("hill", ["earth", "earth"]);

    addRecipie("energy", ["water", "fire"]);
    addRecipie("plasma", ["air", "fire"]);
    addRecipie("inferno", ["fire", "fire"]);

    addRecipie("cloud", ["water", "air"]);
    addRecipie("wind", ["air", "air"]);

    addRecipie("pond", ["water", "water"]);
    
    inventoryElement = document.getElementById("inventory");
    craftElement = document.getElementById("craft");
}

//Drag Handling
function allowDrop(e){
    e.preventDefault();
}

var data;

function drag(e){
    data = e.target;
}

function drop(e){
    e.preventDefault();
    var target = e.target;
    if(e.target.getAttribute("name") == "item"){
        target = e.target.parentElement;
    }
    target.appendChild(data);
    if(target.id == "craft"){
        var craftElements = [];
        for(var i = 0; i < target.childNodes.length; i++){
            craftElements.push(target.childNodes[i]);
        }
        var names = [];
        for(var i = 0; i < craftElements.length; i++){
            names.push(craftElements[i].id);
        }
        var c = craft(names);
        if(c != "None"){
            if(inventory[c] == 1){
                var element = document.createElement("div");
                element.id = c;
                element.classList.add("image");
                element.draggable = true;
                element.setAttribute("ondragstart", "drag(event)");
                element.setAttribute("name", "item"); 
                element.innerText = c;
                inventoryElement.appendChild(element);
            }
            
            var len = craftElements.length;
            for(var i = 0; i < len; i++){
                inventoryElement.appendChild(craftElements[i]);
                i++;
            }
        }
    }
}