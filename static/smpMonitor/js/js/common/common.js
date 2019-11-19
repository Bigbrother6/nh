/**
 * 空串或未定义转换成null
 */
function emptyToNull(value) {
    if (value === "" || value === undefined) {
        return null;
    } else {
        return value;
    }
}

/**
 * 判断是否是空串或null
 */
function isEmpty(value) {
    return value === "" || value == null || value === undefined;
}

/**
 * 自定义弹出框
 */
window.alert = function (message, title) {
    title = isEmpty(title) ? "提示" : title;
    bootbox.alert({
        title: title,
        message: message
    });
};

