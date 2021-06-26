//light und darkmode umschalten
document.querySelector('.header__button').addEventListener('click', (e) => {
    document.body.classList.toggle('light-mode');
    if(document.body.classList.contains('light-mode')) {
        e.target.src = "images/icon-moon.svg";
    } else {
        e.target.src = "images/icon-sun.svg";
    }
})

const tasks = [
    {task: "Complete online Javascript course", checked: true},
    {task: "Wash dishes", checked: false},
    {task: "Do homework", checked: false},
    {task: "Make todo list", checked: true},
    {task: "Go shopping", checked: true}
]
const list = document.querySelector('.list-items');

for(let [index, task] of tasks.entries()) {
    const li = document.createElement('li');
    li.id = index;
    li.classList = 'list-items__item';
    li.innerHTML = `
        <label class="list-items__checkbox-label">
            <input type="checkbox" class="list-items__checkbox">
            <div class="list-items__status list-items__status--checked"></div>
            <span class="list-items__description list-items__description--done">${task.task}</span>
        </label>
        <img class="list-items__close" src="images/icon-cross.svg" alt="">
    `;
    list.appendChild(li);
}