var items = [];
var recipies = [];

var inventory = [];

var gamedata;

function addItem(name, color="white"){
    items[name] = [name, color, "none"];
}

function decorateItem(name, decoration){
    items[name][2] = decoration;
}

function addRecipe(name, items){
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

//Item Creation
function addToInventory(name){
    var element = document.createElement("div");
    element.id = name;
    element.classList.add("image");
    element.draggable = true;
    element.setAttribute("ondragstart", "drag(event)");
    element.setAttribute("name", "item"); 
    element.innerText = name;
    element.style = "background-color:" + items[name][1] + ";background-image:" + items[name][2] + ";";
    inventoryElement.appendChild(element);
}

//Data Handling
function LoadGame(name) {
    fetch(name)
    .then(response => response.text())
    .then(data => {
        //Parse the File
        var dat = data.split(' ');
        var gamedata = [];
        for(var i = 0; i < dat.length; i++){
            var ind = dat[i].split('\n');
            for(var j = 0; j < ind.length; j++){
                gamedata.push(ind[j]);
            }
        }

        console.log(gamedata);

        //Create the Objects
        var i = 0;
        while(i < gamedata.length){
            var addToI = 1;

            if(gamedata[i] == "ITEM"){
                addItem(gamedata[i + 1], gamedata[i + 2]);
                addToI += 2;
            }else if(gamedata[i] == "RECIPE"){
                addRecipe(gamedata[i + 1], [gamedata[i + 2], gamedata[i + 3]]);
                addToI += 3;
            }else if(gamedata[i] == "DECORATE"){
                decorateItem(gamedata[i + 1], gamedata[i + 2]);
                addToI += 2;
            }

            i += addToI;
        }

        inventory["earth"] = 1;
        inventory["water"] = 1;
        inventory["fire"] = 1;
        inventory["air"] = 1;

        addToInventory("earth");
        addToInventory("water");
        addToInventory("fire");
        addToInventory("air");
    });
}

//Load Game
window.onload = function(){
    LoadGame("https://raw.githubusercontent.com/Will-Eves/Crafting-Game/main/data.gamdat");
    
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
                addToInventory(c);
            }
            
            var len = craftElements.length;
            for(var i = 0; i < len; i++){
                inventoryElement.appendChild(craftElements[i]);
                i++;
            }
        }
    }
}