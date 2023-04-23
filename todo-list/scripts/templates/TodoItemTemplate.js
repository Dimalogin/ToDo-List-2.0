export const todoItemTemplate = `
<li class="list-task task-item">
<h3 class="task-item__date"></h3>
<div class="task-item__row">
  <div class="task-item__description"></div>
  <div class="task-item__buttons">
    <input class="task-item__toggle" type="checkbox" />
    <button class="task-item__delete" type="button">
      <img src="./images/delete.png" alt="delete" />
    </button>
  </div>
</div>
</li>
`;
