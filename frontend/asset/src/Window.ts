var WindowElement = document.createElement('window');
document.body.appendChild(WindowElement);

const WindowElement_ResizeEvent : string = "window:resize";

window.onresize = () => {WindowElement.dispatchEvent(new Event(WindowElement_ResizeEvent))}

export {WindowElement, WindowElement_ResizeEvent}