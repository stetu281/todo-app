import * as Tools from './tools.js';
import { GraphQLClient, gql } from 'graphql-request';
import css from '../scss/main.scss';
import arrowUp from '../images/arrow-up.svg';
import arrowDown from '../images/arrow-down.svg';
import del from '../images/icon-cross.svg';
import spinner from '../images/spinner.svg';
import sun from '../images/icon-sun.svg';
import moon from '../images/icon-moon.svg';

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
const graphQLClient = new GraphQLClient('https://graphql-weather-api.herokuapp.com');
const list = document.querySelector('.list-items');
const taskInput = document.querySelector('.create-item__input');
let tasks = [];

//Initial Load
getTasks();
getTemp();
setInterval(getTemp, 120000);

//Funktion Tasks von der Datanbank holen, wenn DB nicht verfügbar, im Localstorage probieren
async function getTasks() {
    const loading = document.querySelector('.loading');
    loading.classList.toggle('loading--hide');

    await Tools.get('http://localhost:3000/todos', (response) => {

        if(!response || response.length === 0) {
            let json = localStorage.getItem('tasks');
            if(json) {
                tasks = JSON.parse(json);
                renderTasks(tasks);
                loading.classList.toggle('loading--hide');
            }
        } else {
            tasks = response;
            renderTasks(tasks);
            loading.classList.toggle('loading--hide');
        }
    }) 
}

//Funktion zum Tasks rendern
function renderTasks(tasks) {
    list.innerHTML = '';
    for(let [index, task] of tasks.entries()) {
        const li = document.createElement('li');
        li.dataset.index = index;
        li.dataset.id = task.id;
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
    countTasks();
};

//Funktion Wenn input leer warning klasse hinzufügen, sonst Objekt erstellen, in DB speichern und ins Tasks Array pushen.
function addItem() {
    if(taskInput.value === '') {
        taskInput.classList.add('create-item__input--warning');
        taskInput.placeholder = 'Please fill in this field...';
    } else {
        taskInput.classList.remove('create-item__input--warning');
        const input = {title: taskInput.value, completed: 0};
        taskInput.value = '';
        tasks.push(input);
        Tools.post('http://localhost:3000/todos', input);
        saveToLocal();
        renderTasks(tasks);
        countTasks();
    };
};

//Funktion um tasks array im Localstorage zu speichern
function saveToLocal() {
    if(tasks.length === 0) {
        localStorage.clear();
    } else {
        let json = JSON.stringify(tasks);
        localStorage.setItem('tasks', json);
    }
}

//Funktion zum verschieben der elemente
function moveIndex(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

//Funktion zum zählen und anzeigen nicht erledigter tasks
function countTasks() {
    let arr = tasks.filter(task => task.completed === 0);
    document.querySelector('.clear__stats').innerHTML = `${arr.length} tasks to do`;    
}

//Funktion zum filtern der tasks
function filter(val) {
    let filtered = tasks.filter(task => task.completed === val);
    renderTasks(filtered);
}

//Funktion zum Temperatur anzeigen
async function getTemp() {
    const query = gql`
    query {
        getCityByName(name: "glarus", config: {units:metric}) {
        weather {
            temperature {
            actual
            }
        }
        }
    }
    `;
    const response = await graphQLClient.request(query);
    let temp = Math.floor(response.getCityByName.weather.temperature.actual);

    document.querySelector('.temp').innerHTML = `Glarus: ${temp}°C`;
}

//Eventlistener zum Tasks erstellen
document.querySelector('.create-item__button').addEventListener('click', addItem)
taskInput.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        addItem();
    };
});

//Eventlistener zum umschalten des erledigt status
list.addEventListener('click', Tools.delegate('.list-items__status', (e) => {
    let id = e.target.parentNode.parentNode.dataset.id;
    let index = e.target.parentNode.parentNode.dataset.index;

    tasks[index].completed === 0 ? tasks[index].completed = 1 : tasks[index].completed = 0;

    Tools.updateDB(`http://localhost:3000/todos/${id}`,tasks[index], (response) => {
        console.log(response);
    })
    saveToLocal();
    countTasks();
}));

list.addEventListener('click', Tools.delegate('.list-items__description', (e) => {
    let id = e.target.parentNode.parentNode.dataset.id;
    let index = e.target.parentNode.parentNode.dataset.index;

    tasks[index].completed === 0 ? tasks[index].completed = 1 : tasks[index].completed = 0;

    Tools.updateDB(`http://localhost:3000/todos/${id}`,tasks[index], (response) => {
        console.log(response);
    })
    saveToLocal();
    countTasks();
}));

//Eventlistener zum löschen eines tasks
list.addEventListener('click', Tools.delegate('img.list-items__img--close', (e) => {
    let id = e.target.parentNode.parentNode.dataset.id;
    Tools.removeElement(e.target.parentNode.parentNode);
    tasks.splice(e.target.parentNode.parentNode.dataset.index, 1);
    Tools.deleteDB(`http://localhost:3000/todos/${id}`);
    saveToLocal();
    renderTasks(tasks);
    countTasks();
}))

//Eventlistener zum löschen aller erledigten tasks
document.querySelector('.clear__button').addEventListener('click', (e) => {
    let arr = tasks.filter(task => task.completed === 1);
    for(let task of arr) {
        Tools.deleteDB(`http://localhost:3000/todos/${task.id}`);
    }

    tasks = tasks.filter(task => task.completed === 0);
    renderTasks(tasks);
    countTasks();
})

//tasks nach oben verschieben
list.addEventListener('click', Tools.delegate('img.list-items__img--up', (e) => {
    let index = parseInt(e.target.parentNode.parentNode.dataset.index);
    if(index !== 0) {
        moveIndex(tasks, index, index - 1);
    }
    renderTasks(tasks);
}))

//tasks nach unten verschieben
list.addEventListener('click', Tools.delegate('img.list-items__img--down', (e) => {
    let index = parseInt(e.target.parentNode.parentNode.dataset.index);
    if(index !== tasks.length - 1) {
        moveIndex(tasks, index, index + 1);
    }
    renderTasks(tasks);
}))

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
        renderTasks(tasks);
        e.target.classList.add('clear__filter--active');
    }
}))