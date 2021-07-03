import { removeElement, delegate } from './tools.js';

//light und darkmode umschalten
document.querySelector('.header__button').addEventListener('click', (e) => {
    document.body.classList.toggle('light-mode');
    if(document.body.classList.contains('light-mode')) {
        e.target.src = "images/icon-moon.svg";
    } else {
        e.target.src = "images/icon-sun.svg";
    }
})


//variablen
const list = document.querySelector('.list-items');
const taskInput = document.querySelector('.create-item__input');
let tasks = [];

//Wenns tasks im localstorage vorhanden sind diese holen und rendern
let storage = localStorage.getItem('tasks');
if(storage) {
    tasks = JSON.parse(storage);
    render(tasks);
}

function render(tasks) {
    list.innerHTML = '';

    for(let [index, task] of tasks.entries()) {
        const li = document.createElement('li');
        li.id = index;
        li.classList = 'list-items__item';
        li.innerHTML = `
            <label class="list-items__checkbox-label">
                <input type="checkbox" class="list-items__checkbox" ${task.checked ? 'checked' : ''}>
                <div class="list-items__status list-items__status--checked"></div>
                <span class="list-items__description list-items__description--done">${task.task}</span>
            </label>
            <img class="list-items__close" src="images/icon-cross.svg" alt="">
        `;
        list.appendChild(li);
    }

    //Anzahl nicht erledigter Tasks anzeigen
    let doneTasks = tasks.filter(task => task.checked === false);
    document.querySelector('.clear__stats').innerHTML = `${doneTasks.length} items left`;
    
};

//Funktion Wenn input leer alert ausgeben sonst Objekt erstellen und ins Tasks Array pushen.
function addItem() {
    if(taskInput.value === '') {
        alert('Leer');
    } else {
        const input = {task: taskInput.value, checked: false};
        taskInput.value = '';
        tasks.push(input);
        setLocalstorage(tasks);
        render(tasks);
    };
};


//Funktion Tasks im localstorage speichern
function setLocalstorage(tasks) {
    let json = JSON.stringify(tasks);
    localStorage.setItem('tasks', json);
}

//Funktion zum Status im Objekt ändern
function changeStatus(id) {
    tasks[id].checked === false ? tasks[id].checked = true : tasks[id].checked = false;
    setLocalstorage(tasks);
}

//Checked status im objekt ändern
list.addEventListener('click', delegate('.list-items__status', (e) => {
    changeStatus(e.target.parentNode.parentNode.id);
    render(tasks);
}))

list.addEventListener('click', delegate('span.list-items__description', (e) => {
    changeStatus(e.target.parentNode.parentNode.id);
    render(tasks);
}))


//Task zur Liste hinzufügen
document.querySelector('.create-item__button').addEventListener('click', addItem)
taskInput.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        addItem();
    };
});

//tasks löschen
list.addEventListener('click', delegate('img.list-items__close', (e) => {
    removeElement(e.target.parentNode);
    tasks.splice(e.target.parentNode.id, 1);
    setLocalstorage(tasks);
    render(tasks);
}));

