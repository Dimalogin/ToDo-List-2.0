export const todoTemplate = `<div class="wrapper">
<div class="todo">
  <div class="todo__container container">
    <div class="todo__form form">
      <form class="form-data data" name="addTodoItem">
        <div class="data-field field">
          <label class="field__title" for="taskDescription">
            Task Description:</label
          >
          <div class="field__row">
            <input
              class="field__text"
              id="taskDescription"
              type="text"
              name="taskDescription"
              required
            />
            <button class="field__btn" type="submit">Add Task</button>
          </div>
        </div>
        <div class="data-date date">
          <label class="date__title" for="taskDate">Date:</label>
          <input
            class="date__field"
            type="date"
            id="taskDate"
            name="taskDate"
            required
          />
        </div>
      </form>
      <div class="form-state state">
        <h3 class="state-title">Task Filter:</h3>
        <select class="state-filter filter">
          <option class="filter-all" value="all-tasks">All Tasks</option>
          <option class="filter-completed" value="completed-tasks">
            Completed Tasks
          </option>
          <option class="filter-uncompleted" value="uncompleted-tasks">
            Uncompleted Tasks
          </option>
        </select>
      </div>
    </div>
    <div class="todo__tasks list">
      <ul class="list-tasks"></ul>
    </div>
    <div class="todo__buttons">
      <button class="todo__button button-del-all">
        Delete All Tasks
      </button>
      <button class="todo__button button-del-completed">
        Delete Completed Tasks
      </button>
    </div>
  </div>
</div>
</div>`;
