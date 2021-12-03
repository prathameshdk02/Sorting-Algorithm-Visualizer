//Global Variables
let isDrawn = false;
let arrCount = 20;
let currentSidebarItem = null;
let currentClearState = false;       //This too seems useless, could have used isDrawn for the same
let currentExecutionState = true;
let slowDownRate = 0;

// Constant References
const ac = document.getElementById("arr_container");
const arr = document.getElementsByClassName("arr_element");

if(!currentClearState){
    let head = document.createElement("h3");
    head.innerText = "Choose an Algorithm to Start...";
    ac.appendChild(head);
}

// Sets Name of the Algorithm...
function setTitle(title){
    let targ = document.getElementById("algo_name");
    targ.innerHTML = `${title} Algorithm`;
}

// Generates delay for specified millisecs
function delay(ms){
    return new Promise((resolve) =>{
        setTimeout(()=>{
            resolve();
        },ms);
    });
}

// Comparator function currently used but not effective
const compare = (n1,n2,desc) => {
    if(desc){
        return n1<n2;
    }else{
        return n1>n2;
    }
}

//Generates Random Values 
function randomGen(){
    let val = Math.floor((Math.random()*90)+1);
    //Increments lower values by 10
    if(val>5 && val<=10){
        val+=5;
    }
    if(val>=0 && val<=5){
        val+=10;
    }
    return val;
}

// Adds height to the elements whenever new Array is generated
function addHeight(){
    let arr = document.getElementsByClassName("arr_element");
    let i=0;
    while(i<arrCount){
        arr[i].style.height = `${Number(arr[i].innerText)-5}%`;
        i++;
    }
}

//Clears ArrayContainer...
function clearArray(){
    while(ac.firstChild){
        ac.removeChild(ac.lastChild);
    }
}

// Clears the Old Array & Generates a new one
function randomizeArray(){
    if(isDrawn){
        clearArray();
    }
    // Generates New Divs and adds them to Array Container...
    for(let i=1;i<=arrCount;i++){
        let newDiv = document.createElement("div");
        let value = randomGen();
        newDiv.className = "arr_element";
        newDiv.innerText = String(value);
        ac.appendChild(newDiv);
    }
    //Sets the drawn state to true
    isDrawn=true;

    //Sets the height for array elements
    addHeight();
}

// Removes the First Child (Used for clearing "Choose an Algorithm to Start") - Better Approach was possible, practically Useless
function clearContainerText(){
    if(!currentClearState){
        ac.removeChild(ac.firstChild);
        currentClearState = true;
    }
}

// Selects an specific algorithm when selected from the Sidebar, Also controls the Display of Index for Both Algorithms
function setSelection(algo){
    currentSidebarItem = algo;
    clearContainerText();
    randomizeArray();
    slowDownRate = 0;
    if(algo=="select"){
        document.querySelector(".select").style.display = "block";
    }else{
        document.querySelector(".select").style.display = "none";
    }

    if(algo=="bubble"){
        document.querySelector(".bubble").style.display = "block";
    }else{
        document.querySelector(".bubble").style.display = "none";
    }
}


// Runs whenever Play Button is Pressed - Executes the algorithm selected from the SideBar...
function sort_now(){
    switch(currentSidebarItem){
        case `select`:
            selection_sort();
            break;

        case `bubble`:
            bubble_sort();
            break;
    }
}

// Pretty Simple but well thought function
/* Simply sets the currentExecutionState to false for 1 sec
   so that all the loops in sorting algos break & return */
async function stop_exe(){
    if(currentExecutionState){
        currentExecutionState = false;
    }
    await delay(1000);
    currentExecutionState = true;
}

// Increments SlowDownRate so that the delay Increases
function slow_down(){
    slowDownRate+=50;
}

// Decrements SlowDownRate so that the delay decreases
function fast_forward(){
    slowDownRate-=50;
}

const blur = document.querySelector(".init_bac");
function on_close(){
    blur.style.display='none';
}

function help_me(){
    blur.style.display='block';
}



// Function for performing Selecion Sort - pretty obvious...
async function selection_sort(desc){
    let prevColor = arr[0].style.backgroundColor;

    for(let i=0;i<arr.length;i++){
        let minIndex = i;
        let currElement = Number(arr[i].innerHTML);
        let minElement = currElement;
        arr[i].style.backgroundColor = `#40db62`;             //ith bar to green
        for(let j=i+1;j<arr.length;j++){
            let jthElement = Number(arr[j].innerHTML);
            arr[j].style.backgroundColor = `#a778ce`;          //jth bar to purple
            if(minIndex!=i){
                arr[minIndex].style.backgroundColor = `#fc9255`;     //min element to orange
            }
            if(compare(minElement,jthElement,desc)==true){
                if(minIndex!=i){
                    arr[minIndex].style.backgroundColor = prevColor;
                }
                minIndex = j;
                minElement = jthElement;
                arr[minIndex].style.backgroundColor = `#fc9255`;
            }
            await delay(200+slowDownRate);
            arr[j].style.backgroundColor = prevColor;
            if(!currentExecutionState){
                break;
            }
        }

        let temp = arr[i].innerHTML;
        arr[i].innerHTML = minElement;
        arr[minIndex].innerHTML = temp;
        arr[i].style.height = `${minElement-5}%`;
        arr[minIndex].style.height = `${temp-5}%`;
        await delay(500);
        arr[i].style.backgroundColor = prevColor;
        arr[minIndex].style.backgroundColor = prevColor;
        if(!currentExecutionState){
            return;
        }
    }
}

// Function for performing Bubble Sort - too obvious...
async function bubble_sort(){
    let prevColor = arr[0].style.backgroundColor;

    for(let i=0;i<arrCount-1;i++){
        for(let j=0;j<arrCount-i-1;j++){
            let wasSwapped = false;
            arr[j].style.backgroundColor = `#a778ce`;
            await delay(200+slowDownRate);
            if(Number(arr[j].innerHTML)>arr[j+1].innerHTML){
                arr[j].style.backgroundColor = `#40db62`;             //jth bar to green....
                arr[j+1].style.backgroundColor = `#fc9255`;           //j+1th bar to orange...
                let temp = arr[j].innerHTML;
                arr[j].innerHTML = arr[j+1].innerHTML;
                arr[j+1].innerHTML = temp;
                await delay(400+slowDownRate);
                arr[j].style.height = `${Number(arr[j].innerHTML)-5}%`;
                arr[j+1].style.height = `${Number(arr[j+1].innerHTML)-5}%`;
                wasSwapped = true;
            }
            if(wasSwapped){
                await delay(400+slowDownRate);
            }
            arr[j].style.backgroundColor = prevColor;
            arr[j+1].style.backgroundColor = prevColor;
            if(!currentExecutionState){
                break;
            }
        }
        if(!currentExecutionState){
            return;
        }
    }
}

/*Adding Onclick listener to sidebar items*/
let sidebarItems = document.querySelectorAll('.sidebar_item');
sidebarItems[0].setAttribute('onclick','setTitle(`Selection Sort`); setSelection(`select`)');
sidebarItems[1].setAttribute('onclick','setTitle(`Bubble Sort`); setSelection(`bubble`)');

/*Adding Onclick listener to each Button in Controls menu*/
const controls = document.querySelectorAll('.arr_controls_item');

/*Adding Onclick listener to Play Button*/
let play = controls[0];
play.setAttribute(`onclick`,`sort_now()`);

/*Adding Onclick listener to Stop Button*/
let stop = controls[1];
stop.setAttribute('onclick','stop_exe()');

/*Adding Onclick listener to Reset Button */
let reset = controls[2];
reset.setAttribute('onclick','clearContainerText(); randomizeArray(); stop_exe();');

/*Adding Onclick listener to Slow Down Button */
let slow = controls[3];
slow.setAttribute('onclick','slow_down();');

/*Adding Onclick listener to Fast Forward Button */
let fast = controls[4];
fast.setAttribute('onclick','fast_forward();');

/*Adding Onclick listener to Help Button */
let help = controls[5];
help.setAttribute('onclick','help_me();');

/*Adding Onclick listener to Close Button */
let close = document.querySelector(".close");
close.setAttribute('onclick','on_close();');







