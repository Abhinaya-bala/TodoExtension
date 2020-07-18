chrome.runtime.sendMessage(
    { action: "GET_COUNT", from: "popup" },
    response => {
        console.log("count", response);
        this.count = response.count;
    }
);