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
        callback(false);
    }
}

export const put = async (url, object, callback) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(object),
        })
        let antw = await response.json();
        console.log(antw)
    } catch(error) {
        console.error('Error:', error);
    }
}