let c = document.getElementById("game_canvas");
let ctx = c.getContext("2d");
let robinsonMap = document.getElementById("map_img");
let chosenPlaceTxt = document.getElementById("chosen_place_txt");
let modeSwitchButton = document.getElementById("mode_switch");
let guesserContainer = document.getElementById("guesser_container");
let nameGuessInput = document.getElementById("name_guess_input");

const chosenMap = window.location.search.substring(6);
console.log(chosenMap);

let chosenKey = "Error Loading";
let inWritingMode = false;

const possibleRegions = {
    "Arctic Ocean": [173, 0, 695, 36],
    "North Atlantic Ocean": [383, 83, 262, 206],
    "South Atlantic Ocean": [433, 358, 308, 223],
    "South America": [327, 367, 211, 202],
    "Central America": [231, 204, 156, 150],
    "North America": [114, 191, 296, 42],
    "Latin America": [322, 364, 159, 154],
    "The Southern Ocean": [40, 361, 740, 420],
    "Antarctica": [116, 411, 658, 446],
    "Indian Ocean": [637, 352, 503, 185],
    "Pacific Ocean": [797, 68, 679, 348],
    "South East Asia": [706, 254, 599, 152],
    "Indian Subcontinent": [589, 202, 552, 153],
    "The Himalayas Mountains": [599, 158, 546, 135],
    "The Caribbean": [199, 141, 291, 197],
    "The Andes Mountains": [267, 279, 217, 200],
    "The Amazon": [314, 271, 255, 202],
    "The Rockies Mountains": [180, 139, 151, 70],
    "Scandinavia": [387, 41, 469, 80],
    "Western Europe": [373, 70, 444, 124],
    "The Mediterranean": [367, 99, 476, 138],
    "The Middle East": [539, 184, 467, 113],
    "East Asia": [687, 162, 623, 28],
    "China": [656, 169, 573, 110],
    "Siberia": [667, 30, 528, 58],
    "Russia": [521, 46, 476, 86],
    "Eastern Europe": [451, 67, 505, 103],
    "Australia": [724, 332, 647, 264],
    "Polynesia": [730, 319, 795, 238],
    "North Africa": [367, 129, 478, 156],
    "Sahara Desert": [362, 154, 485, 182],
    "Sub Saharan Africa": [360, 189, 503, 316],
    "Central Asia": [511, 96, 563, 140],
};

function Shuffle(arr) {
  	for (let i = arr.length - 1; i > 0; i--) {
    	const j = Math.floor(Math.random() * (i + 1));
    	[arr[i], arr[j]] = [arr[j], arr[i]];
  	}
  	return arr;
}

let keysFound = Object.keys(possibleRegions);
let curOverallIdx = Infinity;
let inGuessMode = true;
let currentRegion;
function newRegionGenerate() {
    curOverallIdx++;
    if (curOverallIdx >= keysFound.length) {
        console.log("Shuffler");
        curOverallIdx = -1;
        keysFound = Shuffle(keysFound);
        console.log(keysFound);
        return newRegionGenerate();
    }
    //let idx = Math.floor(Math.random() * keysFound.length);
    chosenKey = keysFound[curOverallIdx];
    if (inWritingMode) {
        chosenPlaceTxt.innerText = "Name this place";
    } else {
        chosenPlaceTxt.innerText = `Where is ${chosenKey} located?`;
    }
    currentRegion = possibleRegions[chosenKey];
}

modeSwitchButton.addEventListener("change", (e) => {
    inWritingMode = e.target.checked;

    inGuessMode = true;
    curOverallIdx = Infinity;
    newRegionGenerate();

    if (inWritingMode) {
        guesserContainer.style = "";
    } else {
        guesserContainer.style = "display: none;"
    }
});

const myRegex = /\s+|the/gi;
nameGuessInput.addEventListener("keyup", (e) => {

    if (!(e.key === "Enter" && inWritingMode)) return;

    if (inGuessMode) {
        inGuessMode = false;
        let curVal = nameGuessInput.value.replace(myRegex, '').toLowerCase()
        let otherVal = chosenKey.replace(myRegex, '').toLowerCase()
        console.log(curVal, otherVal)
        let correctnessString;
        if (curVal == otherVal) {
            correctnessString = "<span style=\"color: green;\">correct</span>";
        } else {
            correctnessString = "<span style=\"color: red;\">incorrect</span>";
        }
        chosenPlaceTxt.innerHTML = `The Correct Answer Was: ${chosenKey}<br/>You were ${correctnessString}<br/>Click on map or press enter to continue`;
        nameGuessInput.value = "";
    } else {
        inGuessMode = true;
        newRegionGenerate();
    }
})

let mousePos = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
    const rect = c.getBoundingClientRect(); // Canvas position & size
    mousePos.x = e.clientX - rect.left; // Relative X
    mousePos.y = e.clientY - rect.top;  // Relative Y
});

//let allClicks = [];
c.addEventListener("mousedown", (e) => {
    /*let x = allClicks.push(mousePos.x, mousePos.y);
    if (x >= 4) {
        console.log(allClicks);
        allClicks = [];
    }*/
    if (inWritingMode) {
        if (!inGuessMode) {
            inGuessMode = true;
            newRegionGenerate();
        }
        return;
    }

    inGuessMode = !inGuessMode;

    if (inGuessMode) {
        newRegionGenerate();
    } else {
        console.log(currentRegion, mousePos.x, mousePos.y);
        let maxX = Math.max(currentRegion[0], currentRegion[2]);
        let maxY = Math.max(currentRegion[1], currentRegion[3]);
        let minX = Math.min(currentRegion[0], currentRegion[2]);
        let minY = Math.min(currentRegion[1], currentRegion[3]);
        if (mousePos.x > minX && mousePos.y > minY && mousePos.x < maxX && mousePos.y < maxY) {
            chosenPlaceTxt.innerText = "Correct";
        } else {
            chosenPlaceTxt.innerText = "Incorrect";
        }
    }
});

function processFrame() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.drawImage(robinsonMap, 0, 0, c.width, c.height);

    if (inGuessMode && !inWritingMode) {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.arc(mousePos.x, mousePos.y, /*10*/30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.fillStyle = "#ff000077"
        ctx.rect(
            currentRegion[0],
            currentRegion[1],
            currentRegion[2] - currentRegion[0],
            currentRegion[3] - currentRegion[1]
        );
        ctx.fill();
        ctx.closePath();
    }

    requestAnimationFrame(processFrame);
}

window.onload = () => {
    newRegionGenerate();
    requestAnimationFrame(processFrame);
};