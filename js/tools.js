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