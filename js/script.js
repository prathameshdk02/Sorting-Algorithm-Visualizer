//Global Variables
let isDrawn = false;
let arrCount = 25;

let currentSidebarItem = null;
let currentClearState = false;       
let currentExecutionState = true;
let currentRunStatus = false;
let slowDownRate = 0;
let cdOffset = `355px`;

// Constant References
const ac = document.getElementById("arr_container");
const arr = document.getElementsByClassName("arr_element");
const adC = document.getElementById("addon_display");
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
    targ.innerText = `${title} Algorithm`;
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
        val+=Math.floor((Math.random()*80)+1);
    }
    if(val>=0 && val<=5){
        val+=Math.floor((Math.random()*80)+1);
    }
    if(val>=0 && val<=10){
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
    if(currentSidebarItem == null){
        return;
    }
    if(isDrawn){
        clearArray();
    }
    // Generates New Divs and adds them to Array Container...
    for(let i=1;i<=arrCount;i++){
        let newDiv = document.createElement("div");
        let value = randomGen();
        newDiv.className = "arr_element";
        newDiv.innerText = `${String(value)}`;
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
    if(currentSidebarItem == null){
        return;
    }
    stats_elements.innerText = `${arrCount}`;
    await delay(400);
    stats_iterations.innerText = '0';
    stats_swaps.innerText = '0';
    stats_speed.innerText = `${slowDownRate}`;
}

// Selects an specific algorithm when selected from the Sidebar, Also controls the Display of Index for Both Algorithms
function setSelection(algo){
    if(currentRunStatus==true){
        stop_exe();
        currentRunStatus = false;
        return;
    }

    currentRunStatus = true;
    currentSidebarItem = algo;
    clearContainerText();
    randomizeArray();
    addContentCodeDisp(algo);
    
    if(arrCount>40 && currentSidebarItem!=null){
        ac.style.fontSize = '0px';
        console.log(arr);
        Array.from(arr).forEach((element)=>{
            element.style.margin = '0px';
            element.style.boxShadow = '0px 0px 0px 0px';
            element.style.border = '1px solid black';
        })
    }

    if(algo=="select"){
        setTitle(`Selection Sort`);
        if(arrCount<=40){
            slowDownRate = -50;
        }else{
            slowDownRate = -200;
        }
        document.querySelector(".select").style.display = "block";
    }else{
        document.querySelector(".select").style.display = "none";
    }
    
    if(algo=="bubble"){
        setTitle(`Bubble Sort`);
        if(arrCount<=40){
            slowDownRate = 50;
        }else{
            slowDownRate = -200;
        }
        document.querySelector(".bubble").style.display = "block";
    }else{
        document.querySelector(".bubble").style.display = "none";
    }
    
    if(algo=="insert"){
        setTitle(`Insertion Sort`);
        if(arrCount<=40){
            slowDownRate = 30;
        }else{
            slowDownRate = -100;
        }    
    }
    
    if(algo=="merge"){
        setTitle(`Merge Sort`);
        if(arrCount<=40){
            slowDownRate = 20;
        }else{
            slowDownRate = -180;
        }
    }
    stats_handler();
    currentRunStatus = false;
}


// Runs whenever Play Button is Pressed - Executes the algorithm selected from the SideBar...
async function sort_now(){
    if(currentSidebarItem == null){
        return;
    }

    if(currentSidebarItem==`merge` || currentSidebarItem==`insert`){
        adC.style.transform = `translate(-${cdOffset},-20px)`;
    }else{
        adC.style.transform = `translate(-${cdOffset})`
    }
    cd.style.transform = `translate(-${cdOffset})`;

    await delay(1300);

    switch(currentSidebarItem){
        case `select`:
            selection_sort();
            break;

        case `bubble`:
            bubble_sort();
            break;

        case `insert`:
            insertion_sort();
            break;
        
        case `merge`:
            adC.innerText = `Playing Merge-Sort...`;
            await delay(500);
            merge_sort(0,arrCount-1);
            break;    
    }
}

// Pretty Simple but well thought function
/* Simply sets the currentExecutionState to false for 3 sec
   so that all the loops in sorting algos break & return */
async function stop_exe(){
    if(currentSidebarItem == null){
        return;
    }
    if(currentExecutionState){
        currentExecutionState = false;
    }
    await delay(3000);
    currentExecutionState = true;
    stats_handler();
}

// Increments SlowDownRate so that the delay Increases
function slow_down(){
    if(currentSidebarItem == null){
        return;
    }
    slowDownRate+=50;
    stats_speed.innerText = `${slowDownRate}`;
}

// Decrements SlowDownRate so that the delay decreases
function fast_forward(){
    if(currentSidebarItem == null){
        return;
    }
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
    let iter = parseInt(stats_iterations.innerText);
    adC.innerText = "Playing Selection-Sort";
    await delay(500);

    for(let i=0;i<arr.length;i++){
        let minIndex = i;
        let currElement = Number(arr[i].innerText);
        let minElement = currElement;
        ssCL[0].style.backgroundColor= `#B2F9FC`;
        adC.innerText = `Assuming ${currElement} as minimum... `
        await delay(200+slowDownRate);
        ssCL[0].style.backgroundColor= `#ffffff`;             
        ssCL[1].style.backgroundColor= `#B2F9FC`;
        await delay(200+slowDownRate);
        arr[i].style.backgroundColor = `#40db62`;           //ith bar to green 
        ssCL[1].style.backgroundColor= `#ffffff`;             
        
        for(let j=i+1;j<arr.length;j++){
            let jthElement = Number(arr[j].innerText);
            adC.innerText = `Comparing ${jthElement} with ${minElement}...\nSmallest Element So Far: ${minElement}`
            stats_iterations.innerText = `${++iter}`;
            ssCL[2].style.backgroundColor= `#B2F9FC`;
            await delay(100+slowDownRate);
            ssCL[2].style.backgroundColor= `#ffffff`;
            ssCL[3].style.backgroundColor= `#a778ce`;
            await delay(50+slowDownRate);
            arr[j].style.backgroundColor = `#a778ce`;          //jth bar to purple
            if(minIndex!=i){
                arr[minIndex].style.backgroundColor = `#fc9255`;     //min element to orange
            }
            if(compare(minElement,jthElement,desc)==true){
                adC.innerText = `Found ${jthElement} smaller than ${minElement}!\nUpdating ${jthElement} as Smallest...`;
                await delay(300+slowDownRate);
                ssCL[4].style.backgroundColor= `#fc9255`;
                if(minIndex!=i){
                    arr[minIndex].style.backgroundColor = '#B2F9FC';
                }
                await delay(200+slowDownRate);
                minIndex = j;
                minElement = jthElement;
                arr[minIndex].style.backgroundColor = `#fc9255`;
                ssCL[4].style.backgroundColor= `#ffffff`;

            }
            await delay(200+slowDownRate);
            ssCL[3].style.backgroundColor= `#ffffff`;
            arr[j].style.backgroundColor = '#B2F9FC';
            if(!currentExecutionState){
                break;
            }

        }
        adC.innerText = `Placing smallest element ${minElement} at position ${i+1}...`
        ssCL[5].style.backgroundColor = `#40db62`
        await delay(550+slowDownRate);
        let swaps = parseInt(stats_swaps.innerText);
        stats_swaps.innerText = `${++swaps}`;
        let temp = arr[i].innerText;
        arr[i].innerText = minElement;
        arr[minIndex].innerText = temp;
        arr[i].style.height = `${minElement-5}%`;
        arr[minIndex].style.height = `${temp-5}%`;
        ssCL[5].style.backgroundColor = `#ffffff`
        arr[i].style.backgroundColor = '#B2F9FC';
        arr[minIndex].style.backgroundColor = '#B2F9FC';
        if(!currentExecutionState){
            adC.style.transform = `translate(${cdOffset})`;
            cd.style.transform = `translate(${cdOffset})`;
            return;
        }
        stats_iterations.innerText = `${++iter}`;
    }
    await sorted_effect();
    adC.innerText = 'Sorting Completed!';
    await sorted_effect();

    await delay(1500);
    adC.style.transform = `translate(${cdOffset})`;
    cd.style.transform = `translate(${cdOffset})`;
    return;
}

// Function for performing Bubble Sort - too obvious...
async function bubble_sort(){
    adC.innerText = "Playing Bubble-Sort";
    await delay(500);

    let iter = parseInt(stats_iterations.innerText);

    for(let i=0;i<arrCount-1;i++){
        ssCL[0].style.backgroundColor= `#B2F9FC`;
        await delay(200+slowDownRate);
        ssCL[0].style.backgroundColor= `#ffffff`;
        for(let j=0;j<arrCount-i-1;j++){
            stats_iterations.innerText = `${++iter}`;
            let wasSwapped = false;
            let elemI = Number(arr[j].innerText);
            let elemJ = Number(arr[j+1].innerText);
            adC.innerText = `Comparing ${elemI} and ${elemJ}....`;

            arr[j].style.backgroundColor = `#a778ce`;

            ssCL[1].style.backgroundColor= `#B2F9FC`;
            await delay(100+slowDownRate);
            ssCL[1].style.backgroundColor= `#ffffff`;

            ssCL[2].style.backgroundColor= `#B2F9FC`;
            await delay(50+slowDownRate);
            ssCL[2].style.backgroundColor= `#ffffff`;

            ssCL[3].style.backgroundColor= `#B2F9FC`;
            await delay(50+slowDownRate);
            ssCL[3].style.backgroundColor= `#ffffff`;
            
            ssCL[4].style.backgroundColor= `#B2F9FC`;
            await delay(100+slowDownRate);
            ssCL[4].style.backgroundColor= `#ffffff`;

            if(elemI>elemJ){
                adC.innerText = `Largest Element So Far: ${elemI}\nBubbling Out ${elemI} !\nSwapping ${elemI} and ${elemJ}...`;
                ssCL[5].style.backgroundColor= `#40db62`;
                arr[j].style.backgroundColor = `#40db62`;
                await delay(100+slowDownRate);             //jth bar to green....
                arr[j+1].style.backgroundColor = `#fc9255`;           //j+1th bar to orange...
                let swaps = parseInt(stats_swaps.innerText);
                stats_swaps.innerText = `${++swaps}`;
                let temp = arr[j].innerText;
                arr[j].innerText = arr[j+1].innerText;
                arr[j+1].innerText = temp;
                await delay(200+slowDownRate);
                arr[j].style.height = `${Number(arr[j].innerText)-5}%`;
                arr[j+1].style.height = `${Number(arr[j+1].innerText)-5}%`;
                wasSwapped = true;
                ssCL[5].style.backgroundColor= `#ffffff`;
            }
            if(wasSwapped){
                await delay(300+slowDownRate);
            }
            arr[j].style.backgroundColor = '#B2F9FC';
            arr[j+1].style.backgroundColor = '#B2F9FC';
            if(!currentExecutionState){
                break;
            }
        }
        stats_iterations.innerText = `${++iter}`;
        if(!currentExecutionState){
            adC.style.transform = `translate(${cdOffset})`;
            cd.style.transform = `translate(${cdOffset})`;
            return;
        }
    }
    await sorted_effect();
    adC.innerText="Sorting Completed!"
    await sorted_effect();

    await delay(1500);
    adC.style.transform = `translate(${cdOffset})`;
    cd.style.transform = `translate(${cdOffset})`;
    return;
}

async function insertion_sort(){
    adC.innerText = `Playing Insertion-Sort...`;
    await delay(500);

    let key,j;
    let iter = 0;
    let swaps = 0;
    for(let i=1;i<arrCount;i++){
        ssCL[0].style.backgroundColor = `#B2F9FC`;
        await delay(100+slowDownRate)
        ssCL[0].style.backgroundColor = `#ffffff`;
        ssCL[1].style.backgroundColor = `#B2F9FC`;
        key = Number(arr[i].innerText);
        adC.innerText = `Key Element: ${key}\nTrying to insert ${key} into its correct position...\nShifting Elements...`;
        await delay(50+slowDownRate)
        ssCL[1].style.backgroundColor = `#ffffff`;
        ssCL[2].style.backgroundColor = `#B2F9FC`;
        j = i-1;
        await delay(50+slowDownRate)
        ssCL[2].style.backgroundColor = `#ffffff`;
        await delay(50+slowDownRate);
        while(j>=0 && Number(arr[j].innerText)>key){
            stats_iterations.innerText = `${++iter}`;
            stats_swaps.innerText = `${++swaps}`;
            ssCL[3].style.backgroundColor = `#B2F9FC`;
            await delay(50+slowDownRate);
            ssCL[3].style.backgroundColor = `#ffffff`;
            ssCL[4].style.backgroundColor = `#fc9255`;
            await delay(50+slowDownRate);
            arr[j+1].style.backgroundColor = `#fc9255`;
            arr[j+1].innerText = arr[j].innerText;
            arr[j+1].style.height = `${Number(arr[j].innerText)-5}%`;
            ssCL[4].style.backgroundColor = `#ffffff`;
            arr[j].style.backgroundColor = `#a778ce`;
            await delay(150+slowDownRate);
            arr[j+1].style.backgroundColor = '#B2F9FC';
            arr[j].style.backgroundColor = '#B2F9FC';
            ssCL[5].style.backgroundColor = `#a778ce`;
            j--;
            await delay(50+slowDownRate);
            ssCL[5].style.backgroundColor = `#ffffff`;
            if(!currentExecutionState){
                break;
            }
        }
        ssCL[6].style.backgroundColor = `#40db62`;
        stats_swaps.innerText = `${++swaps}`;
        await delay(200+slowDownRate);
        arr[j+1].innerText = key;
        adC.innerText = `Inserted ${key} at its Correct Place....`;
        arr[j+1].style.backgroundColor = `#40db62`;
        arr[j+1].style.height = `${key-5}%`;
        await delay(300+slowDownRate);
        ssCL[6].style.backgroundColor = `#ffffff`;
        arr[j+1].style.backgroundColor = '#B2F9FC';
        stats_iterations.innerText = `${++iter}`;
        if(!currentExecutionState){
            adC.style.transform = `translate(${cdOffset})`;
            cd.style.transform = `translate(${cdOffset})`;
            return;
        }
    }

    await sorted_effect();
    adC.innerText = `Sorting Completed!`;
    await sorted_effect();

    await delay(1500);
    adC.style.transform = `translate(${cdOffset})`;
    cd.style.transform = `translate(${cdOffset})`;
    return;
}

async function merge(s,e,mid){
    adC.innerText = `Merge process started!`;
    let iter = Number(stats_iterations.innerText);
    let i = s;
    let j = mid+1;
    let k = s;
    const temp = new Array(e+2);
    ssCL[6].style.backgroundColor = `#fc9255`;
    while(i<=mid && j<=e){
        stats_iterations.innerText = `${++iter}`;
        arr[i].style.backgroundColor = `#fc9255`;       //Orange color..
        arr[j].style.backgroundColor = `#fc9255`;
        let elemI = Number(arr[i].innerText);
        let elemJ = Number(arr[j].innerText);
        adC.innerText = `Comparing ${elemI} with ${elemJ}....`;
        await delay(50+slowDownRate);
        if(elemI<=elemJ){
            temp[k] = Number(arr[i].innerText);
            adC.innerText = `Comparing ${elemI} with ${elemJ}....\n${elemI} was smaller!\nCopying ${elemI} in temp array...`
            i++;
            k++;
        }else{
            adC.innerText = `Comparing ${elemI} with ${elemJ}....\n${elemJ} was smaller!\nCopying ${elemJ} in temp array...`
            temp[k] = Number(arr[j].innerText);
            j++;
            k++;
        }

        if(elemI<=elemJ){
            await delay(250+slowDownRate);
            arr[i-1].style.backgroundColor = `#B2F9FC`;       //Prev color..
            arr[j].style.backgroundColor = `#B2F9FC`;
        }else{
            await delay(250+slowDownRate);
            arr[i].style.backgroundColor = `#B2F9FC`;       //Prev color..
            arr[j-1].style.backgroundColor = `#B2F9FC`;
        }
        if(!currentExecutionState){
            return;
        }
    }

    adC.innerText = `Storing remaining elements in temp array...`;
    await delay(50);
    while(i<=mid){
        let elemI = Number(arr[i++].innerText);
        adC.innerText = `Copying ${elemI} in temp array...`
        stats_iterations.innerText = `${++iter}`;
        temp[k++] = elemI;
    }

    while(j<=e){
        let elemJ = Number(arr[j++].innerText);
        adC.innerText = `Copying ${elemJ} in temp array...`
        stats_iterations.innerText = `${++iter}`;
        temp[k++] = elemJ;
    }

    ssCL[6].style.backgroundColor = `#ffffff`;

    if(!currentExecutionState){
        return;
    }

    ssCL[6].style.backgroundColor = `#40db62`;
    for(let m=s;m<=e;m++){
        adC.innerText = `Merging Elements With Original Array...\nMerged element ${temp[m]}!`;
        stats_iterations.innerText = `${++iter}`;
        arr[m].style.backgroundColor = `#40db62`;
        await delay(250+slowDownRate);
        arr[m].innerText = `${temp[m]}`;
        arr[m].style.height = `${temp[m]-5}%`;
        arr[m].style.backgroundColor = `#B2F9FC`;
        if(!currentExecutionState){
            break;
        } 
    }
    ssCL[6].style.backgroundColor = `#ffffff`;
    if(!currentExecutionState){
        return;
    }
    adC.innerText = `Sub-Array Merge Completed!`;
}

// After-Sort Effect...
async function sorted_effect(){
    for(let i=0;i<arrCount;i++){
        arr[i].style.backgroundColor = '#40db62';       //Green
        await delay(5);
    }
    await delay(10);
    for(let i=0;i<arrCount;i++){
        arr[i].style.backgroundColor = `#B2F9FC`;
        await delay(5);       
    }
}

async function merge_sort(s,e){
    if(!currentExecutionState){
        if(s==0 && e==arrCount-1){
            adC.style.transform = `translate(${cdOffset},20px)`;
            cd.style.transform = `translate(${cdOffset})`;
        }
        return;
    }
    adC.innerText = "Dividing Larger Array into SubArrays..."
    ssCL[0].style.backgroundColor = `#B2F9FC`;
    await delay(10);
    ssCL[0].style.backgroundColor = `#ffffff`;

    ssCL[1].style.backgroundColor = `#B2F9FC`;
    await delay(10);
    ssCL[1].style.backgroundColor = `#ffffff`;

    if(s>=e){
        ssCL[2].style.backgroundColor = `#fc9255`;
        await delay(300+slowDownRate);
        ssCL[2].style.backgroundColor = `#ffffff`;
        return;
    }

    let mid = parseInt((s+e)/2);
    ssCL[3].style.backgroundColor = `#B2F9FC`;
    await delay(100+slowDownRate);
    ssCL[3].style.backgroundColor = `#ffffff`;

    ssCL[4].style.backgroundColor = `#B2F9FC`;
    await delay(100+slowDownRate);
    ssCL[4].style.backgroundColor = `#ffffff`;
    await merge_sort(s,mid);

    ssCL[5].style.backgroundColor = `#B2F9FC`;
    await delay(100+slowDownRate);
    ssCL[5].style.backgroundColor = `#ffffff`;
    await merge_sort(mid+1,e);
    
    ssCL[6].style.backgroundColor = `#B2F9FC`;
    await delay(400);

    if(!currentExecutionState){
        if(s==0 && e==arrCount-1){
            adC.style.transform = `translate(${cdOffset},20px)`;
            cd.style.transform = `translate(${cdOffset})`;
        }
        return;
    }
    await merge(s,e,mid);
    ssCL[6].style.backgroundColor = `#ffffff`;

    if(s==0 && e==arrCount-1){
        await sorted_effect();
        adC.innerText = `Sorting Completed!`;
        await sorted_effect();

        await delay(1500);
        adC.style.transform = `translate(${cdOffset},20px)`;
        cd.style.transform = `translate(${cdOffset})`;
    }
    return;
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

const insertArr = [
    `   for( i = 1; i < n; i++ )`,
    `       j = i-1`,
    `       key = arr[i]`,
    `       while( j >= 0 and arr[j] > key )`,
    `           arr[j+1] = arr[j]`,
    `           j -= 1`,
    `       arr[j+1] = key`
]

const mergeArr = [
    `   function mergeSort(start,end):`,
    `        if(start >= end):`,
    `            return`,
    `        mid = (int)(start + end)/2`,
    `        mergeSort(start,mid)`,
    `        mergeSort(mid+1,end)`,
    `        compare&Merge(start,end)`]


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
    }else if(algo=='insert'){
        for(let i=0;i<insertArr.length;i++){
            let pree = document.createElement("pre");
            pree.className = `code_disp_line`;
            pree.innerText = insertArr[i];
            cdc.appendChild(pree);
        }
    }else if(algo=='merge'){
        for(let i=0;i<mergeArr.length;i++){
            let pree = document.createElement("pre");
            pree.className = `code_disp_line`;
            pree.innerText = mergeArr[i];
            cdc.appendChild(pree);
        }
    }
}

function learn_more(){
    switch(currentSidebarItem){
        case 'select':
            window.open("https://www.geeksforgeeks.org/selection-sort/","_blank");
            break;

        case 'bubble':
            window.open("https://www.geeksforgeeks.org/bubble-sort/","_blank");
            break;

        case 'insert':
            window.open("https://www.geeksforgeeks.org/insertion-sort/","_blank");
            break;

        case 'merge':
            window.open("https://www.geeksforgeeks.org/merge-sort/","_blank");
            break;
    }
}

/*Adding Onclick listener to sidebar items*/
let sidebarItems = document.querySelectorAll('.sidebar_item');
sidebarItems[0].setAttribute('onclick','setSelection(`select`)');
sidebarItems[1].setAttribute('onclick','setSelection(`bubble`)');
sidebarItems[2].setAttribute('onclick','setSelection(`insert`)');
sidebarItems[3].setAttribute('onclick','setSelection(`merge`)');
// sidebarItems[4].



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

let learn = controls[5];
learn.setAttribute('onclick','learn_more()');

/*Adding Onclick listener to Help Button */
let help = controls[6];
help.setAttribute('onclick','help_me();');

/*Adding Onclick listener to Close Button */
let close = document.querySelector(".close");
close.setAttribute('onclick','on_close();');







