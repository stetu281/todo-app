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
                <span class="list-items__status list-items__status--checked"></span>
                <span class="list-items__description list-items__description--done">${task.task}</span>
            </label>
            <img class="list-items__close" src="images/icon-cross.svg" alt="">
        `;
        list.appendChild(li);
    }
    remainingItemsInfo();
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
function toggleStatus(id) {
    tasks[id].checked === false ? tasks[id].checked = true : tasks[id].checked = false;
    setLocalstorage(tasks);
}

//Funktion zum zählen und anzeigen nicht erledigter tasks
function remainingItemsInfo() {
    let doneTasks = tasks.filter(task => task.checked === false);
    document.querySelector('.clear__stats').innerHTML = `${doneTasks.length} items left`;    
}

//Checked status im objekt ändern
list.addEventListener('click', delegate('.list-items__status', (e) => {
    toggleStatus(e.target.parentNode.parentNode.id);
    remainingItemsInfo();
}))

list.addEventListener('click', delegate('span.list-items__description', (e) => {
    toggleStatus(e.target.parentNode.parentNode.id);
    remainingItemsInfo();
}))


//Task zur Liste hinzufügen
document.querySelector('.create-item__button').addEventListener('click', addItem)
taskInput.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
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

//Erledigte löschen
document.querySelector('.clear__button').addEventListener('click', () => {
    tasks = tasks.filter(task => task.checked === false);
    setLocalstorage(tasks);
    render(tasks);
})

//Liste filtern
document.querySelector('.clear__filters').addEventListener('click', delegate('.clear__filter', (e) => {
    if(e.target.innerHTML === 'Completed') {
        let completed = tasks.filter(task => task.checked === false);
        render(completed);
    } else if(e.target.innerHTML === 'Active') {
        let active = tasks.filter(task => task.checked === true);
        render(active);
    } else {
        render(tasks);
    }
}))


