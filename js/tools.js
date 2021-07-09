export const removeElement= (element) => {
    element.parentNode.removeChild(element);
};

export const delegate = (target, callback) => {
    return function (e) {
        if (e.target.matches(target)) {
            callback(e);
        }
    };
};

export const get = (url, callback) => {

    let request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if(request.status >= 200 && request.status < 400) {
        let response = JSON.parse(request.responseText);
        callback(response);
      } else {
        console.log('Error')
      }
    }

    request.onerror = function() {
      console.log('cant reach server');
    };

    request.send();
};

export const post = (url, todos, callback) => {
      let request = new XMLHttpRequest();
      request.open('POST', url, true);
      request.setRequestHeader("Content-Type", "application/json");
      let dataToServer = JSON.stringify(todos);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          let response = JSON.parse(request.responseText);
          callback(response);
        } else {
          console.log("Error");
        }
      }

      request.onerror = function() {
        console.log("Error Server")
      }

      request.send(dataToServer);    
}