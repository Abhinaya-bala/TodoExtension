//send mgs to background

$("#addTaskBtn").click(() => {
  let taskName = $("#taskNameInput").val();
  let reminderTime = $("#reminderTime").val();
  let recurringCheckbox = $("#recurringCheckbox").is(":checked");

  console.log("add task clicked", taskName);
  console.log("reminder time", reminderTime);
  console.log("recurring checkbox", recurringCheckbox);
  let reminderTimeInMilliSeconds = reminderTime
    ? new Date(reminderTime).getTime()
    : null;

  chrome.runtime.sendMessage(
    {
      action: "ADD_TASK",
      payload: {
        taskName: taskName,
        reminderTimeInMilliSeconds: reminderTimeInMilliSeconds,
        recurringReminder: recurringCheckbox, // true/ false
      },
    },
    (response) => {
      console.log("count", response);
      refreshTasks();
      $("#taskNameInput").val("");
      $("#reminderTime").val("");
    }
  );
});
$("#clearallTodo").click(() => {
  chrome.runtime.sendMessage(
    {
      action: "CLEAR_TODO",
    },
    (response) => {
      console.log("count", response);
      refreshTasks();
    }
  );
});
$("#clearallDone").click(() => {
  chrome.runtime.sendMessage(
    {
      action: "CLEAR_DONE",
    },
    (response) => {
      console.log("count", response);
      refreshTasks();
    }
  );
});

$(document).on("click", ".delBtn", function () {
  console.log("remove task", this.parentElement.id);
  chrome.runtime.sendMessage(
    {
      action: "REMOVE_TASK",
      payload: {
        taskId: this.parentElement.id,
      },
    },
    (tasks) => {
      console.log("response", tasks);
      refreshTasks();
    }
  );
});

$(document).on("change", ".status_checkbox", function () {
  console.log("status changed", this.parentElement.id);
  chrome.runtime.sendMessage(
    {
      action: "TOGGLE_STATUS",
      payload: {
        taskId: this.parentElement.id,
      },
    },
    (tasks) => {
      console.log("response", tasks);
      refreshTasks();
    }
  );
});

function refreshTasks() {
  chrome.runtime.sendMessage(
    {
      action: "GET_TASKS",
    },
    (tasks) => {
      console.log("response", tasks);
      updateToTaskList(tasks);
    }
  );
}

function updateToTaskList(tasks) {
  $("#taskList").html("");
  $("#completedTaskList").html("");

  const todoTasks = tasks.filter((task) => task.isCompleted === false);
  const completedTasks = tasks.filter((task) => task.isCompleted === true);

  for (const task of todoTasks) {
    $("#taskList").append(`<li id="${task.id}" class="list-group-item clearfix">
            <input class="status_checkbox" id="chk_${task.id}" type="checkbox">
            <label class="text-muted todo-item" for="chk_${task.id}">${task.name}</label>
            <button class="delBtn px-2 btn btn-link float-right"><i class="far fa-trash-alt"></i></button>
        </li>`);
  }

  if (todoTasks.length === 0) {
    $("#taskList").append(
      "<b class='empty-state'>No tasks to do. You're all done</b>"
    );
  }

  for (const task of completedTasks) {
    $("#completedTaskList")
      .append(`<li id="${task.id}" class="list-group-item clearfix">
            <input class="status_checkbox" id="chk_${task.id}" type="checkbox" checked=true >
            <label class="text-muted todo-item" for="chk_${task.id}"><del>${task.name}</del></label>
            <button class="delBtn px-2 btn-link float-right"><i class="far fa-trash-alt"></i></button>
    </li>`);
  }

  if (completedTasks.length === 0) {
    $("#completedTaskList").append(
      "<b class='empty-state'>Yet to complete a task</b>"
    );
  }
}

function init() {
  refreshTasks();
}

init();
