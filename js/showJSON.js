function showJSON(){
    for (var key in userInfo) {
        var label = document.createElement("label");
        label.textContent = key + ": ";
        var span = document.createElement("span");
        span.textContent = userInfo[key];
        var br = document.createElement("br");
    
        userInfoDiv.appendChild(label);
        userInfoDiv.appendChild(span);
        userInfoDiv.appendChild(br);
    
        var input = document.createElement("input");
        input.type = "text";
        input.value = userInfo[key];
        editInfoDiv.appendChild(input);
        editInfoDiv.appendChild(document.createElement("br")); // Add <br> after each input
      }
}