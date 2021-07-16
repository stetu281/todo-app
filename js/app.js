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
const exampleTask = [{task: "Example Task", checked: true}, {task: "Example Task2", checked: false}];

getTasks();

function render(tasks) {
    list.innerHTML = '';

    for(let [index, task] of tasks.entries()) {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.classList = 'list-items__item';
        li.innerHTML = `
            <label class="list-items__checkbox-label">
                <input type="checkbox" class="list-items__checkbox" ${task.checked ? 'checked' : ''}>
                <span class="list-items__status list-items__status--checked"></span>
                <span class="list-items__description list-items__description--done">${task.task}</span>
            </label>
            <div class="list-items__control">
                <img class="list-items__img list-items__img--up" src="images/arrow-up.svg" alt="">
                <img class="list-items__img list-items__img--down" src="images/arrow-down.svg" alt="">
                <img class="list-items__img list-items__img--close" src="images/icon-cross.svg" alt="">
            </div>
        `;
        list.appendChild(li);
    }
    remainingItemsInfo();
};

//Funktion Wenn input leer warning klasse hinzufügen sonst Objekt erstellen und ins Tasks Array pushen.
function addItem() {
    if(taskInput.value === '') {
        taskInput.classList.add('create-item__input--warning');
        taskInput.placeholder = 'Please fill in this field...';
    } else {
        taskInput.classList.remove('create-item__input--warning');
        const input = {task: taskInput.value, checked: false};
        taskInput.value = '';
        tasks.push(input);
        saveTasks(tasks);
        render(tasks);
    };
};

//Funktion Tasks vom Server holen
async function getTasks() {
    try {
        const response = await fetch('http://localhost:3002/todos');
        const todos = await response.json();
        render(todos);    
    } catch(error) {
        let storage = localStorage.getItem('tasks');
        if(storage) {
            tasks = JSON.parse(storage);
            render(tasks);
        } else {
            render(exampleTask);
        }
    }

}

//Funktion Tasks auf Server und im localstorage speichern
async function saveTasks(tasks) {

    try {
        const response = await fetch('http://localhost:3002/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tasks),
        })
        tasks = await response.json();
        console.log(tasks)
    } catch(error) {
        console.error('Error:', error);
    }

    let json = JSON.stringify(tasks);
    localStorage.setItem('tasks', json);
}

//Funktion zum Status im Objekt ändern
function toggleStatus(id) {
    tasks[id].checked === false ? tasks[id].checked = true : tasks[id].checked = false;
    saveTasks(tasks);
}

//Funktion zum zählen und anzeigen nicht erledigter tasks
function remainingItemsInfo() {
    let doneTasks = tasks.filter(task => task.checked === false);
    document.querySelector('.clear__stats').innerHTML = `${doneTasks.length} items left`;    
}

//Funktion zum filtern nach true oder false
function filter(bool) {
    let filtered = tasks.filter(task => task.checked === bool);
    render(filtered);
}

//Funktion zum verschieben der elemente
function moveIndex(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

//Checked status im objekt ändern
list.addEventListener('click', delegate('.list-items__status', (e) => {
    toggleStatus(e.target.parentNode.parentNode.dataset.index);
    remainingItemsInfo();
}))

list.addEventListener('click', delegate('span.list-items__description', (e) => {
    toggleStatus(e.target.parentNode.parentNode.dataset.index);
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
list.addEventListener('click', delegate('img.list-items__img--close', (e) => {
    removeElement(e.target.parentNode.parentNode);
    tasks.splice(e.target.parentNode.parentNode.dataset.index, 1);
    saveTasks(tasks);
    render(tasks);
}));

//tasks nach oben verschieben, wenn an erster stelle an letze stelle verschieben
list.addEventListener('click', delegate('img.list-items__img--up', (e) => {
    let index = parseInt(e.target.parentNode.parentNode.dataset.index);
    if(index === 0) {
        moveIndex(tasks, index, tasks.length - 1);
    }
    moveIndex(tasks, index, index - 1);
    saveTasks(tasks);
    render(tasks);
}))

//tasks nach unten verschieben, wenn an letzter stelle an erste stelle verschieben
list.addEventListener('click', delegate('img.list-items__img--down', (e) => {
    let index = parseInt(e.target.parentNode.parentNode.dataset.index);
    if(index === tasks.length - 1) {
        moveIndex(tasks, index, 0);
    }
    moveIndex(tasks, index, index + 1);
    saveTasks(tasks);
    render(tasks);
}))

//Erledigte löschen
document.querySelector('.clear__button').addEventListener('click', () => {
    tasks = tasks.filter(task => task.checked === false);
    saveTasks(tasks);
    render(tasks);
})

//Liste filtern / button active state ändern
document.querySelector('.clear__filters').addEventListener('click', delegate('.clear__filter', (e) => {
    const buttons = document.querySelectorAll('.clear__filter');
    for(let button of buttons) {
        button.classList.remove('clear__filter--active');
    }

    if(e.target.innerHTML === 'Completed') {
        filter(true);
        e.target.classList.add('clear__filter--active');
    } else if(e.target.innerHTML === 'Active') {
        filter(false);
        e.target.classList.add('clear__filter--active');
    } else {
        render(tasks);
        e.target.classList.add('clear__filter--active');
    }
}))