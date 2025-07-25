//Getting all the elements first
const itemForm=document.querySelector('#item-form')
const itemList=document.querySelector('#item-list')
const itemInput=document.querySelector('#item-input')
const filter=document.querySelector('#filter')
const clearAll=document.querySelector('#clear')
const formBtn=itemForm.querySelector('button')  //Add/update item
//for edit mode
let isEditMode=false

//Getting items from storage:
function getItemsFromLocal(){
    return JSON.parse(localStorage.getItem('items'))||[];  //efficiently using or
}

//✅Functionality: Add Items to the list
//form element: itemForm
function addItemUI(item){
    //Create a new list item
    const li=document.createElement('li')
    //assign it class name for css : NO classes
    //Add everything in: 
    const text=document.createTextNode(item) //Its better to put formData.get('item') in a variable since we are using it again and again
    li.appendChild(text)
    //Button
    const button=document.createElement('button')
    //add classes
    button.setAttribute('class','remove-item btn-link text-red')
    //Cross: i tag
    const cross=document.createElement('i')
    //set classes
    cross.setAttribute('class','fa-solid fa-xmark')
    button.appendChild(cross)
    li.appendChild(button)
    itemList.appendChild(li);
};

function addItemToLocal(item){
    const items=getItemsFromLocal();
    items.push(item)
    localStorage.setItem('items',JSON.stringify(items))
}

function addItem(e){
    //Prevent form from submitting first
    e.preventDefault();
    //use FormData to get submitted value: using name attribute
    const formData=new FormData(itemForm)
    const item=formData.get('item')
    //Validate input
    if(item===""){
        alert("Please enter a valid item")
        return; //very important coz otherwise it will keep on executing outside the if too
    }
    //Check for edit mode: if yes first remove
    if(isEditMode){
        //Now remove old element from DOM(UI) and storage and create an entirely new item with new name
        //get item to be removed: it has one of the class='edit-mode'
        const itemOld=document.querySelector('#item-list .edit-mode ')
        //now remove class
        itemOld.classList.remove('edit-mode')
        removeItem(itemOld);
        isEditMode=false
        //Change button back
        formBtn.innerHTML='<i class="fa-solid fa-plus"></i> Add Item'
        formBtn.style.backgroundColor='#333'
        //now it will just proceed and add new item
    }
    //Checking for duplicate value:
    if(isDuplicate(item)){
        itemInput.value=''
        alert('Item already exists')
        return;
    }
    //Creating UI item, clearing input field, and unhiding filter and clear all
    addItemUI(item);
    itemInput.value=''// very necessary to clear Enter item
    unhide(); //Unhide filter and clearAll
    //Adding to Storage
    addItemToLocal(item);
}


//✅Functionality: Checking for duplicate element
function isDuplicate(item){
    let items=getItemsFromLocal()
    items=items.filter(thing=>thing===item)
    return items.length>0
    //or direct: items.includes(item) //returns boolean value
}



//✅Functionality: Display items from Local Storage at the time of reload
function displayItems(){
    const items=getItemsFromLocal();
    if(items.length===0){
        hide();
    } else {
        items.forEach(item=>{
            addItemUI(item);
        });
        unhide();
    }
    
}


//✅Functionality: Function for clicking anywhere on li.. it updates or deletes depending on where you clicked
function clickOnItem(e){
    //Checking if user clicked on cross
    // if(e.target.parentElement.classList.contains('remove-item'))
    if(e.target.closest('.remove-item')){
        removeItem(e.target);
    } else {
        setItemToEdit(e.target)
        //Here e.target.tagName==='LI' always .. that means we are passing list item to this function
    }
}



//✅Functionality: Remove Item from the list UI
function removeItemUI(item){    
    item.remove();
    //to hide buttons and filters if there are no elements
    if(!document.querySelector('#item-list li'))    hide()   
}
//✅Functionality: Remove Item from local storage
function removeItemFromLocal(item){
    const itemName=item.innerText    
    let items=getItemsFromLocal();
    items=items.filter(thing=>thing!==itemName)
    localStorage.setItem('items',JSON.stringify(items));
}
//✅Functionality: Overall Remove Item function
function removeItem(eleClicked){
    // e.target.parentElement.parentElement.remove();
    const item=eleClicked.closest('li')
    if(item){
        if(isEditMode||confirm(`Are you sure you want to remove '${item.innerText}' from the list`)){
            removeItemUI(item);
            removeItemFromLocal(item);
        }
    }
}



//✅Functionality: Setting edit mode handler
function setItemToEdit(item){
    isEditMode=true;
    //Reset any previously selected element out of edit mode
    document.querySelectorAll('#item-list li').forEach(item=>{
        item.classList.remove('edit-mode')
    })
    //make current item into edit mode
    item.classList.add('edit-mode')
    //Change innerHtml of formBtn
    formBtn.innerHTML='<i class="fa-solid fa-pen"></i> Update Item'
    formBtn.style.backgroundColor='#228B22'
    //Put item name in place of Enter Item
    itemInput.value=item.innerText
}
 


// ✅Functionality: Clear All items: just set innerHTML of ul as empty
function onClear(){
    // itemList.innerHTML=""  //simple
    // using loop
    if(confirm("Are you sure you want to clear the list?"))
    { 
        //Removing UI
        while(itemList.firstChild){
            itemList.removeChild(itemList.firstChild)
        }
        //now hide all buttons
        hide()

        //now clear local storage
        // localStorage.clear(); //don't do this as other key value pairs will also be deleted
        localStorage.removeItem('items') //better and safer
    }
}



//✅Functionality: Filter Items
function filterItems(e){
    const val=e.target.value.toLowerCase()
    const items=document.querySelectorAll('#item-list li')
    items.forEach(item=>{
        //const text=item.firstChild.textContent is better as innerText is slower than textContent
        //if(str.indexOf(val)!==-1)
        if(item.innerText.toLowerCase().includes(val)){
            //item.style.display='flex'
            item.classList.remove('hidden')
        } else {
            //item.style.display='none'
            item.classList.add('hidden')
        }
    });
}



//💅🏻Styling: making sure that filter items and clear all are not visible till there is atleast one item in the list
function hide(){
    filter.classList.add('hidden')
    clearAll.classList.add('hidden')
}

function unhide(){
    filter.classList.remove('hidden')
    clearAll.classList.remove('hidden')
}

function checkUI(){
    //if(document.querySelectorAll('li).length!==0)
    //We can't define it globally.. we have to catch it in time at the state when checkUI is called
    if(document.querySelector('#item-list li')){
        unhide()
    }else{
        hide()
    }
}


//Event Listeners: initialise app function()
function init(){
    //adding item
    itemForm.addEventListener('submit', addItem)
    //On DOM load... call initial display from local storage
    window.addEventListener('DOMContentLoaded',()=>{
        displayItems();
    })
    //Event Delegation: add remove item to parent
    itemList.addEventListener('click',clickOnItem)
    //Clear all
    clearAll.addEventListener('click',onClear)
    //Filtering
    filter.addEventListener('input',filterItems)
}

init();
