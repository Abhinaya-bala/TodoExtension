//send mgs to background

$("#addTaskBtn").click(() => {
  let taskName = $("#taskNameInput").val();
  console.log("add task clicked", taskName);
  chrome.runtime.sendMessage(
    {
      action: "ADD_TASK",
      payload: {
        taskName: taskName,
      },
    },
    (response) => {
      console.log("count", response);
      refreshTasks();
      $("#taskNameInput").val("");
    }
  );
});

$(document).on("change", ".status_checkbox", function () {
  console.log("status changed", this.id);
  chrome.runtime.sendMessage(
    {
      action: "TOGGLE_STATUS",
      payload: {
        taskId: this.id,
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
    $("#taskList").append(`<li class="list-group-item">
    <input class="status_checkbox" id="${task.id}" type="checkbox" 
    >
    <label for="${task.id}">${task.name}</label>
    </li>`);
  }
  for (const task of completedTasks) {
    $("#completedTaskList").append(`<li class="list-group-item">
    <input class="status_checkbox" id="${task.id}" type="checkbox" 
    checked=true
    >
    <label for="${task.id}">${task.name}</label>
    </li>`);
  }
}

function init() {
  refreshTasks();
}

init();
