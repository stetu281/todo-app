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

export const get = async (url, callback) => {
    try {
        const response = await fetch(url);
        const obj = await response.json();
        callback(obj);
    } catch(error) {
        console.error('Error:', error);
    }
}

export const post = async (url, object, callback) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object),
        })
        console.log(response)
        let antw = response.json();
        callback(antw)
    } catch(error) {
        console.error('Error:', error);
    }
}