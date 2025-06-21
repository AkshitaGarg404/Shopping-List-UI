//Getting all the elements first
const itemForm=document.querySelector('#item-form')
const itemList=document.querySelector('#item-list')
const itemInput=document.querySelector('#item-input')
const filter=document.querySelector('#filter')


//✅Functionality: Add Items to the list
//form element: itemForm
//Add an eventListener for submit
itemForm.addEventListener('submit',(e)=>{
    //Prevent form from submitting first
    e.preventDefault();
    //Create a new list item
    const li=document.createElement('li')
    //assign it class name for css : NO classes
    //Add everything in: 

    //Text node: use FormData to get submitted value: using name attribute
    const formData=new FormData(itemForm)
    const text=document.createTextNode(formData.get('item'))
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
});

