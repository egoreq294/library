function setToLocalStorage(name,text,id,read){
    if(localStorage.getItem('books')===null){
        localStorage.setItem('books', JSON.stringify([{'title': name, 'text': text, 'id': id, 'read': read}]));
    }
    else{
        let arrayOfBooks = JSON.parse(localStorage.getItem("books"));        
        arrayOfBooks.push({'title': name, 'text': text, 'id': id, 'read': read});
        localStorage.setItem('books', JSON.stringify(arrayOfBooks));
    }
}

function getDataFromInput(){    
    let name = document.querySelector(".make-book-form__written-book-name").value;
    let text = document.querySelector(".make-book-form__written-book-text").value;
    document.querySelector(".make-book-form__written-book-name").value="";
    document.querySelector(".make-book-form__written-book-text").value="";
    return {title: name, text: text}
}

async function getDataFromFile(){
    const formData = new FormData();
    const inputFile = document.querySelector('input[type="file"]');    
    if(inputFile.files[0]){
        formData.append('login', "egoreq");
        formData.append('file', inputFile.files[0]);
        try{
        const  response = await fetch('https://apiinterns.osora.ru/', {
            method: 'POST',
            body: formData
          });
        const result = await response.json();
        return result;
        }
        catch(error){
            alert('Извините произошла ошибка: ', error)
            return false;
        }
    }
    else{
        alert("Добавьте файл для загрузки")
        return false;
    }

}
async function addLoadingBookToLocalStorage(){
    let result = await getDataFromFile();    
    let id = Date.now();
    setToLocalStorage(result.title.replace(/\.[^.]+$/, ""), result.text, id, false);
    return {'title': result.title.replace(/\.[^.]+$/, ""), 'text': result.text, 'id': id, 'read': false}
}
 function addWrittenBookToLocalStorage(){
    let result = getDataFromInput();
    let id = Date.now();
    setToLocalStorage(result.title, result.text, id, false);
    return {'title': result.title, 'text': result.text, 'id': id, 'read': false}
}

function createBookItem(name, id, read){
 let div = document.createElement('div');
 div.setAttribute("class", "book-item");
 if(read){
     div.setAttribute('class','book-item_read')
 }
 let p = document.createElement('p');
 p.setAttribute('id', id); 
 p.setAttribute("class", "book-item__text");
 p.innerHTML = name;

 let readBookButton = document.createElement('button');
 readBookButton.setAttribute('onclick', 'readBook(this)');
 readBookButton.innerHTML = "Читать";
 
 let deleteBookButton = document.createElement('button');
 deleteBookButton.setAttribute('onclick', 'deleteBook(this)');
 deleteBookButton.innerHTML = "Удалить";

 let changeBookStatusButton = document.createElement('button');
 changeBookStatusButton.setAttribute('onclick', 'changeStatus(this)');
 changeBookStatusButton.innerHTML = "Изменить статус";

 let rewriteBookButton = document.createElement('button'); 
 rewriteBookButton.setAttribute('onclick', 'rewriteBook(this)');
 rewriteBookButton.innerHTML = "Изменить содержание";

 div.appendChild(p);
 div.appendChild(readBookButton);
 div.appendChild(deleteBookButton);
 div.appendChild(changeBookStatusButton);
 div.appendChild(rewriteBookButton);
 document.querySelector('.book-items').appendChild(div);

}

function readBook(e){
    e.parentNode.firstChild.classList.add('book-item_active');
    document.querySelectorAll('.book-item__text').forEach(item=>{
        if(item.id!==e.parentNode.firstChild.id){
            item.classList.remove('book-item_active');
        }
    });
    let arrayOfBooks= JSON.parse(localStorage.getItem("books"));
    arrayOfBooks.forEach(item=>{
        if(item.id === +e.parentNode.firstChild.id){
            document.querySelector('.right-side').innerHTML = item.text;
        }
    })    
}
function deleteBook(e){
    e.parentNode.remove();
    let arrayOfBooks= JSON.parse(localStorage.getItem("books"));
    for(let i = 0; i<arrayOfBooks.length; i++){
        if(arrayOfBooks[i].id === +e.parentNode.firstChild.id){
            arrayOfBooks.splice(i,1);
        }
    }
    localStorage.setItem('books', JSON.stringify(arrayOfBooks));
    createSortedBookList();
}
function changeStatus(e){    
    let arrayOfBooks= JSON.parse(localStorage.getItem("books"));
    for(let i = 0; i<arrayOfBooks.length; i++){
        if(arrayOfBooks[i].id === +e.parentNode.firstChild.id){
            if(arrayOfBooks[i].read){ 
                arrayOfBooks[i].read=false;
                e.parentNode.classList.add('book-item_read');
            }
            else{
                arrayOfBooks[i].read=true;
                e.parentNode.classList.remove('book-item_read');
            }
        }
    }
    e.parentNode.classList.toggle('book-item_read');
    localStorage.setItem('books', JSON.stringify(arrayOfBooks));
    createSortedBookList();
}
function rewriteBook(e){
    let item = {};
    let arrayOfBooks= JSON.parse(localStorage.getItem("books"));
    for(let i = 0; i<arrayOfBooks.length; i++){
        if(arrayOfBooks[i].id === +e.parentNode.firstChild.id){
            item = arrayOfBooks[i];
        }
    }
    let div = document.createElement('div');
    div.setAttribute('class', 'modal');
    
    let form = document.createElement('form');
    form.setAttribute('class', 'modal__form');

    let input = document.createElement('input');
    input.setAttribute('class', 'modal__input');
    input.setAttribute('type', 'text');
    input.value = item.title;

    let textarea = document.createElement('textarea');
    textarea.setAttribute('class', 'modal__textarea');
    textarea.setAttribute('cols', '30');
    textarea.setAttribute('rows', '10');
    textarea.value = item.text;

    let saveButton = document.createElement('input');
    saveButton.setAttribute('class', 'modal__button');
    saveButton.setAttribute('type', 'button');
    saveButton.setAttribute('value', 'Сохранить');
    saveButton.setAttribute('onclick', `saveChanges(${e.parentNode.firstChild.id})`);

    let closeButton = document.createElement('input');    
    closeButton.setAttribute('class', 'modal__button');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('value', 'Закрыть');
    closeButton.setAttribute('onclick', 'closeModal()');

    form.appendChild(input);
    form.appendChild(textarea);
    form.appendChild(saveButton);
    form.appendChild(closeButton);
    div.appendChild(form);
    document.querySelector('body').appendChild(div);
}
function saveChanges(id){
    let title = document.querySelector('.modal__input').value;
    let text = document.querySelector('.modal__textarea').value;
    let arrayOfBooks= JSON.parse(localStorage.getItem("books"));
    for(let i = 0; i<arrayOfBooks.length; i++){
        if(arrayOfBooks[i].id === +id){
            arrayOfBooks[i] = {'title': title, "text": text, 'id': id};
        }
    }
    localStorage.setItem('books', JSON.stringify(arrayOfBooks));
    document.querySelector('.book-items').innerHTML='';
    JSON.parse(localStorage.getItem("books")).forEach(item => {
        createBookItem(item.title, item.id);
    });

    document.querySelector('.modal').remove();
    document.querySelector('.right-side').innerHTML='';
    createSortedBookList();
}
function closeModal(){
    document.querySelector('.modal').remove();
}
function sortBooks(){
    let arrayOfBooks= JSON.parse(localStorage.getItem("books"));
    let readArray=[];
    let nonReadArray=[];
    let renderArray=[];
    if(arrayOfBooks){
        arrayOfBooks.sort(function(a, b) {
            return a.id - b.id;
          });
        arrayOfBooks.forEach(item=>{
            
            if(item.read){
                readArray.push(item);
            }
            else{
                nonReadArray.push(item);
            }
        })
        renderArray=[...readArray, ...nonReadArray];
        localStorage.setItem('books', JSON.stringify(renderArray));
    }
}
function createSortedBookList(){
    sortBooks();
    document.querySelector('.book-items').innerHTML='';
    let renderArray = JSON.parse(localStorage.getItem("books"));
        renderArray.forEach(item => {
            createBookItem(item.title, item.id, item.read);
        });
}

window.onload = ()=>{
    if(JSON.parse(localStorage.getItem("books"))){
        createSortedBookList();
    }

};
document.querySelector('.make-book-form').addEventListener('change', ()=>{
    let radios = document.querySelectorAll('.make-book-form__input');
    for(let i = 0; i<radios.length; i++){
        if(radios[i].checked){
            document.querySelector(".make-book-form__load-book").classList.toggle("display_none");
            document.querySelector(".make-book-form__wright-book").classList.toggle("display_none");
        }
    }
});
document.querySelector(".make-book-form__written-book-button").addEventListener("click", ()=>{
    let result = addWrittenBookToLocalStorage();
    createBookItem(result.title, result.id);
    createSortedBookList();
});
document.querySelector(".make-book-form__load-book-button").addEventListener("click", async ()=>{
    let result = await addLoadingBookToLocalStorage();
    await createBookItem(result.title, result.id);
    await createSortedBookList();
});
document.querySelector(".clear-localStorage").addEventListener("click", ()=>{
    localStorage.clear();
    document.querySelector('.book-items').innerHTML=''
});
