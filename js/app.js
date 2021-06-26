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

//tasks
const tasks = [
    {task: "Complete online Javascript course", checked: true},
    {task: "Wash dishes", checked: false},
    {task: "Do homework", checked: false},
    {task: "Make todo list", checked: true},
    {task: "Go shopping", checked: true}
]
const list = document.querySelector('.list-items');
const taskInput = document.querySelector('.create-item__input');

render(tasks);


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
};

function addItem() {
    if(taskInput.value === '') {
        alert('Leer');
    } else {
        const input = {task: taskInput.value, checked: false};
        taskInput.value = '';
        tasks.push(input);
        render(tasks);
    };
};


//Task zur Liste hinzufügen
document.querySelector('.create-item__button').addEventListener('click', addItem)
taskInput.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) {
        addItem();
    };
});

