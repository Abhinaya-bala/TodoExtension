// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

//example of using a message handler from the inject scripts

var tasks = [
  { name: "taskname", isCompleted: true, remindOn: 0, id: "randomid" },
];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // First, validate the message's structure.

  console.log("am called", request);

  switch (request.action) {
    case "ADD_TASK": {
      console.log("ADD TASK CALLED ", request);
      addTask(request.payload).then(() => {
        sendResponse();
      });
      break;
    }
    case "GET_TASKS": {
      console.log("GET TASKS CALLED ", request);
      getTasks().then((tasks) => {
        sendResponse(tasks);
      });
      break;
    }
    case "TOGGLE_STATUS": {
      toggleStatus(request.payload).then(() => {
        sendResponse();
      });
      break;
    }
    case "REMOVE_TASK": {
      console.log("REMOVE TASK CALLED ", request);
      removeTask(request.payload).then(() => {
        sendResponse();
      });
      break;
    }
  }
  return true;
});

// chrome.extension.onMessage.addListener(
//   function (request, sender, sendResponse) {
//     chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });

function saveInLocalStorage(tasks) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ tasks }, function () {
      resolve();
    });
  });
}

function getFromLocalStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["tasks"], function (result) {
      Object.keys(result).length === 0 ? resolve([]) : resolve(result.tasks);
    });
  });
}

async function addTask(payload) {
  const { taskName } = payload;
  const tasks = await getFromLocalStorage();
  console.log(tasks);
  tasks.push({
    name: taskName,
    isCompleted: false,
    remindOn: 0,
    id: Date.now(),
  });
  await saveInLocalStorage(tasks);
  const todoTasks = tasks.filter(task => task.isCompleted === false)


  createNotification("1 New Task Added", `${todoTasks.length}"pending"`);
  return true;
}

function getTasks() {
  return getFromLocalStorage();
}

async function toggleStatus(payload) {
  const { taskId } = payload;
  const tasks = await getFromLocalStorage();
  const taskIndex = tasks.findIndex((task) => task.id === Number(taskId));
  const task = tasks[taskIndex];
  task.isCompleted = !task.isCompleted;
  await saveInLocalStorage(tasks);
  return true;
}

async function removeTask(payload) {

  const { taskId } = payload;
  const tasks = await getFromLocalStorage();
  const taskIndex = tasks.findIndex((task) => task.id === Number(taskId));
  const task = tasks[taskIndex];
  tasks.splice(taskIndex, 1)

  await saveInLocalStorage(tasks);
  return true;
}

// https://chrome.google.com/webstore/detail/storage-area-explorer/ocfjjjjhkpapocigimmppepjgfdecjkb?hl=en

function createNotification(title, message) {
  chrome.notifications.create(
    "",
    {
      title,
      message,
      type: "basic",
      iconUrl: "icons/icon16.png",
    },
    (notificationId) => {
      console.log("notification id", notificationId);
    }
  );
}
