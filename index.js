function setToLocalStorage(name,text,id){
    if(localStorage.getItem('books')===null){
        localStorage.setItem('books', JSON.stringify([{'title': name, 'text': text, 'id': id}]));
    }
    else{
        let arrayOfBooks = JSON.parse(localStorage.getItem("books"));        
        arrayOfBooks.push({'title': name, 'text': text, 'id': id});
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
    setToLocalStorage(result.title.replace(/\.[^.]+$/, ""), result.text, id);
    return {'title': result.title.replace(/\.[^.]+$/, ""), 'text': result.text, 'id': id}
}
 function addWrittenBookToLocalStorage(){
    let result = getDataFromInput();
    let id = Date.now();
    setToLocalStorage(result.title, result.text, id);
    return {'title': result.title, 'text': result.text, 'id': id}
}

function createBookItem(name, id){
 let div = document.createElement('div');
 div.setAttribute("class", "book-item");
 let p = document.createElement('p');
 p.setAttribute('id', id); 
 p.setAttribute("class", "book-item__text");
 p.innerHTML = name;
 div.appendChild(p);
 document.querySelector('.book-items').appendChild(div);
}

window.onload = ()=>{
    console.log(JSON.parse(localStorage.getItem("books")))
    if(JSON.parse(localStorage.getItem("books"))){
        JSON.parse(localStorage.getItem("books")).forEach(item => {
            createBookItem(item.title, item.id);
        });
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
    createBookItem(result.title, result.text);
});
document.querySelector(".make-book-form__load-book-button").addEventListener("click", async ()=>{
    let result = await addLoadingBookToLocalStorage();
    await createBookItem(result.title, result.text);
});
document.querySelector(".clear-localStorage").addEventListener("click", ()=>{localStorage.clear();});
document.querySelector('.book-items').addEventListener('click', (event)=>{
    if(event.target.tagName==='P'){
        event.target.classList.add('book-item_active');
        document.querySelectorAll('.book-item__text').forEach(item=>{
            if(item.id!==event.target.id){
                item.classList.remove('book-item_active');
            }
        });
        let arrayOfBooks= JSON.parse(localStorage.getItem("books"));
        arrayOfBooks.forEach(item=>{
            if(item.id === +event.target.id){
                document.querySelector('.right-side').innerHTML = item.text;
            }
        })
        
    }
});
