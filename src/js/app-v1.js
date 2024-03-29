import * as Tools from './tools.js';
import css from '../scss/main.scss';
import arrowUp from '../images/arrow-up.svg'
import arrowDown from '../images/arrow-down.svg'
import del from '../images/icon-cross.svg'
import spinner from '../images/spinner.svg'
import sun from '../images/icon-sun.svg'
import moon from '../images/icon-moon.svg'

//light und darkmode umschalten
document.querySelector('.header__button').addEventListener('click', (e) => {
    document.body.classList.toggle('light-mode');
    if(document.body.classList.contains('light-mode')) {
        e.target.src = "./icon-moon.svg";
    } else {
        e.target.src = "./icon-sun.svg";
    }
})


//variablen
const list = document.querySelector('.list-items');
const taskInput = document.querySelector('.create-item__input');
const loading = document.querySelector('.loading');
let tasks = [];
const exampleTask = [{title: "Example Task", completed: 1}];

getTasks();

function render(tasks) {
    console.log(tasks)
    list.innerHTML = '';
    for(let task of tasks) {
        const li = document.createElement('li');
        li.dataset.index = task.id;
        li.classList = 'list-items__item';
        li.innerHTML = `
            <label class="list-items__checkbox-label">
                <input type="checkbox" class="list-items__checkbox" ${task.completed ? 'checked' : ''}>
                <span class="list-items__status list-items__status--checked"></span>
                <span class="list-items__description list-items__description--done">${task.title}</span>
            </label>
            <div class="list-items__control">
                <img class="list-items__img list-items__img--up" src="${arrowUp}" alt="">
                <img class="list-items__img list-items__img--down" src="${arrowDown}" alt="">
                <img class="list-items__img list-items__img--close" src="${del}" alt="">
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
        const input = {title: taskInput.value, completed: 0};
        taskInput.value = '';
        tasks.push(input);
    };
};

//Funktion Tasks vom Server, localhost oder exampleTasks variable holen
async function getTasks() {
    loading.classList.toggle('loading--hide');
    
    await Tools.get('http://localhost:3000/todos', function(response) {
        if(!response || response.length === 0) {
            let json = localStorage.getItem('tasks');
            if(json) {
                tasks = JSON.parse(json);
                render(tasks);
                loading.classList.toggle('loading--hide');
            } else {
                tasks = exampleTask;
                render(tasks);
                loading.classList.toggle('loading--hide');
            }
        } else {
            tasks = response;
            render(tasks);
            loading.classList.toggle('loading--hide');
        }       
    });
}

//Funktion Tasks auf Server und im localstorage speichern
async function saveTasks(tasks) {

    await Tools.post('http://localhost:3000/todos', tasks, function(response) {
        console.log(response)
    })

/*     if(tasks.length === 0) {
        localStorage.clear();
    } else {
        let json = JSON.stringify(tasks);
        localStorage.setItem('tasks', json);
    } */
}

//Funktion zum Status im Objekt ändern
function toggleStatus(id) {
    tasks[id].completed === 0 ? tasks[id].completed = 1 : tasks[id].completed = 0;
    Tools.updateDB(`http://localhost:3000/todos/${id}`, tasks[id], (response) => {
        console.log(response);
    })
}

//Funktion zum zählen und anzeigen nicht erledigter tasks
function remainingItemsInfo() {
    let doneTasks = tasks.filter(task => task.completed === 0);
    document.querySelector('.clear__stats').innerHTML = `${doneTasks.length} items left`;    
}

//Funktion zum filtern nach true oder false
function filter(bool) {
    let filtered = tasks.filter(task => task.completed === 0);
    render(filtered);
}

//Funktion zum verschieben der elemente
function moveIndex(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

//Checked status im objekt ändern
list.addEventListener('click', Tools.delegate('.list-items__status', (e) => {
    toggleStatus(e.target.parentNode.parentNode.dataset.index);
    remainingItemsInfo();
}))

list.addEventListener('click', Tools.delegate('span.list-items__description', (e) => {
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
list.addEventListener('click', Tools.delegate('img.list-items__img--close', (e) => {
    Tools.removeElement(e.target.parentNode.parentNode);
    let arr = tasks.splice(e.target.parentNode.parentNode.dataset.index, 1);
    saveTasks(tasks);
    render(tasks);
}));

//tasks nach oben verschieben, wenn an erster stelle an letze stelle verschieben
list.addEventListener('click', Tools.delegate('img.list-items__img--up', (e) => {
    let index = parseInt(e.target.parentNode.parentNode.dataset.index);
    if(index !== 0) {
        moveIndex(tasks, index, index - 1);
    }
}))

//tasks nach unten verschieben, wenn an letzter stelle an erste stelle verschieben
list.addEventListener('click', Tools.delegate('img.list-items__img--down', (e) => {
    let index = parseInt(e.target.parentNode.parentNode.dataset.index);
    if(index !== tasks.length - 1) {
        moveIndex(tasks, index, index + 1);
    }
}))

//Erledigte löschen
document.querySelector('.clear__button').addEventListener('click', () => {
    tasks = tasks.filter(task => task.completed === 0);
    saveTasks(tasks);
    render(tasks);
})

//Liste filtern / button active state ändern
document.querySelector('.clear__filters').addEventListener('click', Tools.delegate('.clear__filter', (e) => {
    const buttons = document.querySelectorAll('.clear__filter');
    for(let button of buttons) {
        button.classList.remove('clear__filter--active');
    }

    if(e.target.innerHTML === 'Completed') {
        filter(1);
        e.target.classList.add('clear__filter--active');
    } else if(e.target.innerHTML === 'Active') {
        filter(0);
        e.target.classList.add('clear__filter--active');
    } else {
        render(tasks);
        e.target.classList.add('clear__filter--active');
    }
}))