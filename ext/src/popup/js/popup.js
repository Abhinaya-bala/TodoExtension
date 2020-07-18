//send mgs to background

$("#addTaskBtn").click(() => {
    let taskName = $("#taskNameInput").val();
    let reminderTime = $("#reminderTime").val();
    console.log("add task clicked", taskName);
    console.log("reminder time", reminderTime);
    let reminderTimeInMilliSeconds = reminderTime
        ? new Date(reminderTime).getTime()
        : null;

    chrome.runtime.sendMessage(
        {
            action: "ADD_TASK",
            payload: {
                taskName: taskName,
                reminderTimeInMilliSeconds: reminderTimeInMilliSeconds,
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
            <label class="text-danger" for="chk_${task.id}">${task.name}</label>
            <button class="delBtn px-5 btn bg-danger float-right"><i class="fa fa-trash" style="font-size:22px;color:white;"></i></button>
        </li>`);
    }
    for (const task of completedTasks) {
        $("#completedTaskList").append(`<li id="${task.id}" class="list-group-item clearfix">
            <input class="status_checkbox" id="chk_${task.id}" type="checkbox" checked=true >
            <label class="text-success" for="chk_${task.id}"><del>${task.name}</del></label>
            <button class="delBtn px-5 btn bg-danger float-right"><i class="fa fa-trash" style="font-size:22px;color:white;"></i></button>
    </li>`);
    }
}

function init() {
    refreshTasks();
}

init();
