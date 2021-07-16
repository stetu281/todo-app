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

load()

//variablen
const list = document.querySelector('.list-items');
const taskInput = document.querySelector('.create-item__input');
let tasks = [];
const exampleTasks = [{task: "Example Task 1", checked: true}, {task: "Example Task 2", checked: false}];


//Funktion zum holen der tasks. Wenn auf server, diese laden, sonst localstorage laden. Wenn beides nicht vorhanden exampleTasks laden.
function load() {
    fetch('http://localhost:3002/todos')
    .then((response) => {
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.json();
    })
    .then(todos => {
        tasks = todos;
        render(tasks);
    })
    .catch(error => {
        let storage = localStorage.getItem('tasks');
        if(storage) {
            tasks = JSON.parse(storage);
            render(tasks);
        } else {
            render(exampleTasks);
        }
    })
}

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
        save(tasks);
        render(tasks);
    };
};

//Funktion Tasks speichern
function save(tasks) {
    let json = JSON.stringify(tasks);
    localStorage.setItem('tasks', json);
    fetch('http://localhost:3002/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
    })
}

//Funktion zum Status im Objekt ändern
function toggleStatus(id) {
    tasks[id].checked === false ? tasks[id].checked = true : tasks[id].checked = false;
    save(tasks);
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
    save(tasks);
    render(tasks);
}));

//tasks nach oben verschieben, wenn an erster stelle an letze stelle verschieben
list.addEventListener('click', delegate('img.list-items__img--up', (e) => {
    let index = parseInt(e.target.parentNode.parentNode.dataset.index);
    if(index === 0) {
        moveIndex(tasks, index, tasks.length - 1);
    }
    moveIndex(tasks, index, index);
    save(tasks);
    render(tasks);
}))

//tasks nach unten verschieben, wenn an letzter stelle an erste stelle verschieben
list.addEventListener('click', delegate('img.list-items__img--down', (e) => {
    let index = parseInt(e.target.parentNode.parentNode.dataset.index);
    if(index === tasks.length - 1) {
        moveIndex(tasks, index, 0);
    }
    moveIndex(tasks, index, index + 1);
    save(tasks);
    render(tasks);
}))

//Erledigte löschen
document.querySelector('.clear__button').addEventListener('click', () => {
    tasks = tasks.filter(task => task.checked === false);
    save(tasks);
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