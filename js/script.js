//Global Variables
let isDrawn = false;
let arrCount = 16;
let currentSidebarItem = null;
let currentClearState = false;       //This too seems useless, could have used isDrawn for the same
let currentExecutionState = true;
let slowDownRate = 0;
let cdOffset = `335px`;

// Constant References
const ac = document.getElementById("arr_container");
const arr = document.getElementsByClassName("arr_element");
const cd = document.querySelector(".code_disp_outer");
const cdc = document.querySelector(".code_disp_container");
const ssCL = document.getElementsByClassName("code_disp_line");

// Stat References
const stats_elements = document.getElementById("stats_elements");
const stats_iterations = document.getElementById("stats_iterations");
const stats_swaps = document.getElementById("stats_swaps");
const stats_speed = document.getElementById("stats_speed");


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
    if(ms<0){
        ms = 0;
    }
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

async function stats_handler(){
    stats_elements.innerText = `${arrCount}`;
    await delay(400);
    stats_iterations.innerText = '0';
    stats_swaps.innerText = '0';
    stats_speed.innerText = `${slowDownRate}`;
}
// Selects an specific algorithm when selected from the Sidebar, Also controls the Display of Index for Both Algorithms
function setSelection(algo){
    currentSidebarItem = algo;
    stats_handler();
    clearContainerText();
    randomizeArray();
    addContentCodeDisp(algo);
    slowDownRate = 0;

    if(algo=="select"){
        setTitle(`Selection Sort`);
        document.querySelector(".select").style.display = "block";
    }else{
        document.querySelector(".select").style.display = "none";
    }

    if(algo=="bubble"){
        setTitle(`Bubble Sort`);
        document.querySelector(".bubble").style.display = "block";
    }else{
        document.querySelector(".bubble").style.display = "none";
    }

    if(algo=="insert"){
        setTitle(`Insertion Sort`);
        // document.querySelector(".bubble").style.display = "block";
    }else{
        // document.querySelector(".bubble").style.display = "none";
    }
}


// Runs whenever Play Button is Pressed - Executes the algorithm selected from the SideBar...
async function sort_now(){
    switch(currentSidebarItem){
        case `select`:
            cd.style.transform = `translate(-${cdOffset})`;
            await delay(2000);
            selection_sort();
            break;

        case `bubble`:
            cd.style.transform = `translate(-${cdOffset})`;
            await delay(2000);
            bubble_sort();
            break;

        case `insert`:
            cd.style.transform = `translate(-${cdOffset})`;
            await delay(2000);
            insertion_sort();
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
    stats_handler();
}

// Increments SlowDownRate so that the delay Increases
function slow_down(){
    slowDownRate+=50;
    stats_speed.innerText = `${slowDownRate}`;
}

// Decrements SlowDownRate so that the delay decreases
function fast_forward(){
    slowDownRate-=50;
    stats_speed.innerText = `${slowDownRate}`;
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
    let iter = parseInt(stats_iterations.innerText);
    for(let i=0;i<arr.length;i++){
        ssCL[0].style.backgroundColor= `#B2F9FC`;
        await delay(200);
        ssCL[0].style.backgroundColor= `#ffffff`;             
        ssCL[1].style.backgroundColor= `#B2F9FC`;
        let minIndex = i;
        let currElement = Number(arr[i].innerHTML);
        let minElement = currElement;
        await delay(200);
        arr[i].style.backgroundColor = `#40db62`;           //ith bar to green 
        ssCL[1].style.backgroundColor= `#ffffff`;             
        
        for(let j=i+1;j<arr.length;j++){
            stats_iterations.innerText = `${++iter}`;
            ssCL[2].style.backgroundColor= `#B2F9FC`;
            await delay(100+slowDownRate);
            ssCL[2].style.backgroundColor= `#ffffff`;
            ssCL[3].style.backgroundColor= `#a778ce`;
            await delay(50);
            let jthElement = Number(arr[j].innerHTML);
            arr[j].style.backgroundColor = `#a778ce`;          //jth bar to purple
            if(minIndex!=i){
                arr[minIndex].style.backgroundColor = `#fc9255`;     //min element to orange
            }
            if(compare(minElement,jthElement,desc)==true){
                ssCL[4].style.backgroundColor= `#fc9255`;
                if(minIndex!=i){
                    arr[minIndex].style.backgroundColor = prevColor;
                }
                await delay(200+slowDownRate);
                minIndex = j;
                minElement = jthElement;
                arr[minIndex].style.backgroundColor = `#fc9255`;
                ssCL[4].style.backgroundColor= `#ffffff`;

            }
            await delay(200+slowDownRate);
            ssCL[3].style.backgroundColor= `#ffffff`;
            arr[j].style.backgroundColor = prevColor;
            if(!currentExecutionState){
                break;
            }

        }
        ssCL[5].style.backgroundColor = `#40db62`
        let swaps = parseInt(stats_swaps.innerText);
        stats_swaps.innerText = `${++swaps}`;
        let temp = arr[i].innerHTML;
        arr[i].innerHTML = minElement;
        arr[minIndex].innerHTML = temp;
        arr[i].style.height = `${minElement-5}%`;
        arr[minIndex].style.height = `${temp-5}%`;
        await delay(500);
        ssCL[5].style.backgroundColor = `#ffffff`
        arr[i].style.backgroundColor = prevColor;
        arr[minIndex].style.backgroundColor = prevColor;
        if(!currentExecutionState){
            cd.style.transform = `translate(${cdOffset})`;
            return;
        }
        stats_iterations.innerText = `${++iter}`;
    }
    cd.style.transform = `translate(${cdOffset})`;
    return;
}

// Function for performing Bubble Sort - too obvious...
async function bubble_sort(){
    let prevColor = arr[0].style.backgroundColor;
    let iter = parseInt(stats_iterations.innerText);

    for(let i=0;i<arrCount-1;i++){
        ssCL[0].style.backgroundColor= `#B2F9FC`;
        await delay(200+slowDownRate);
        ssCL[0].style.backgroundColor= `#ffffff`;
        for(let j=0;j<arrCount-i-1;j++){
            stats_iterations.innerText = `${++iter}`;
            let wasSwapped = false;
            arr[j].style.backgroundColor = `#a778ce`;

            ssCL[1].style.backgroundColor= `#B2F9FC`;
            await delay(200+slowDownRate);
            ssCL[1].style.backgroundColor= `#ffffff`;

            ssCL[2].style.backgroundColor= `#B2F9FC`;
            await delay(50);
            ssCL[2].style.backgroundColor= `#ffffff`;

            ssCL[3].style.backgroundColor= `#B2F9FC`;
            await delay(100+slowDownRate);
            ssCL[3].style.backgroundColor= `#ffffff`;
            
            ssCL[4].style.backgroundColor= `#B2F9FC`;
            await delay(200+slowDownRate);
            ssCL[4].style.backgroundColor= `#ffffff`;
            if(Number(arr[j].innerHTML)>arr[j+1].innerHTML){
                ssCL[5].style.backgroundColor= `#40db62`;
                arr[j].style.backgroundColor = `#40db62`;             //jth bar to green....
                arr[j+1].style.backgroundColor = `#fc9255`;           //j+1th bar to orange...
                let swaps = parseInt(stats_swaps.innerText);
                stats_swaps.innerText = `${++swaps}`;
                let temp = arr[j].innerHTML;
                arr[j].innerHTML = arr[j+1].innerHTML;
                arr[j+1].innerHTML = temp;
                await delay(500+slowDownRate);
                arr[j].style.height = `${Number(arr[j].innerHTML)-5}%`;
                arr[j+1].style.height = `${Number(arr[j+1].innerHTML)-5}%`;
                wasSwapped = true;
                ssCL[5].style.backgroundColor= `#ffffff`;
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
        stats_iterations.innerText = `${++iter}`;
        if(!currentExecutionState){
            cd.style.transform = `translate(${cdOffset})`;
            return;
        }
    }
    cd.style.transform = `translate(${cdOffset})`;
    return;
}

async function insertion_sort(){
    let key,j;
    let prevColor = arr[0].style.backgroundColor;
    for(let i=1;i<arrCount;i++){
        key = Number(arr[i].innerText);
        j = i-1;
        await delay(50+slowDownRate);
        while(j>=0 && Number(arr[j].innerText)>key){
            arr[j].style.backgroundColor = `#a778ce`;
            arr[j+1].innerText = arr[j].innerText;
            arr[j+1].style.height = `${Number(arr[j].innerText)-5}%`;
            await delay(150+slowDownRate);
            arr[j].style.backgroundColor = prevColor;
            j--;
        }
        arr[j+1].innerText = key;
        arr[j+1].style.backgroundColor = `#40db62`;
        arr[j+1].style.height = `${key-5}%`;
        await delay(300+slowDownRate);
        arr[j+1].style.backgroundColor = prevColor;
    }
}

const selectArr = [
    `    for( i = 0; i < n-1; i++ )`,
    `        min = i`,
    `        for( j = i+1; j < n; j++ )`,
    `            if( arr[j] < arr[min] )`,
    `                min = j `,
    `        swap( arr[min], arr[i] )`]

const bubbleArr = [
    `    for( i = 0; i < n-1; i++ )`,
    `        for( j = 0; j < n-i; j++ )`,
    `            current = arr[j]`,
    `            next = arr[j+1]`,
    `            if( current > next )`,
    `                swap( arr[j], arr[j+1] )`]



function addContentCodeDisp(algo){
    while(cdc.firstChild){
        cdc.removeChild(cdc.lastChild);
    }
    if(algo=='select'){   
        for(let i=0;i<selectArr.length;i++){
            let pree = document.createElement("pre");
            pree.className = `code_disp_line`;
            pree.innerText = selectArr[i];
            cdc.appendChild(pree);
        }
    }else if(algo=='bubble'){
        for(let i=0;i<bubbleArr.length;i++){
            let pree = document.createElement("pre");
            pree.className = `code_disp_line`;
            pree.innerText = bubbleArr[i];
            cdc.appendChild(pree);
        }
    }
}

/*Adding Onclick listener to sidebar items*/
let sidebarItems = document.querySelectorAll('.sidebar_item');
sidebarItems[0].setAttribute('onclick','setSelection(`select`)');
sidebarItems[1].setAttribute('onclick','setSelection(`bubble`)');
sidebarItems[2].setAttribute('onclick','setSelection(`insert`)');

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
reset.setAttribute('onclick','clearContainerText(); randomizeArray(); stop_exe(); stats_handler();');

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







