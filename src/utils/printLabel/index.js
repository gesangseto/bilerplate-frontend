export function printLabel({ data = [], link = null }) {
  // Create a form
  if (!link) {
    return false;
  }
  var mapForm = document.createElement("form");
  mapForm.target = "_blank";
  mapForm.method = "POST";
  mapForm.action = link;
  // Create an input
  var mapInput = document.createElement("input");
  mapInput.type = "text";
  mapInput.name = "items";
  mapInput.value = JSON.stringify(data);
  // Add the input to the form
  mapForm.appendChild(mapInput);
  // Add the form to dom
  document.body.appendChild(mapForm);
  // Just submit
  mapForm.submit();
}
export function printLabelV2({ data = [], link = null }) {
  // Create a form
  if (!link) {
    return false;
  }
  var mapForm = document.createElement("form");
  mapForm.target = "_blank";
  mapForm.method = "POST";
  mapForm.action = link;
  // Create an input
  var mapInput = document.createElement("input");
  mapInput.type = "text";
  mapInput.name = "items";
  mapInput.value = JSON.stringify(data);
  // Add the input to the form
  mapForm.appendChild(mapInput);
  // Add the form to dom
  document.body.appendChild(mapForm);
  // Just submit
  mapForm.submit();
}
export function printLabelV3({ data = [], link = null }) {
  // Create a form
  if (!link) {
    return false;
  }
  var mapForm = document.createElement("form");
  mapForm.target = "_blank";
  mapForm.method = "POST";
  mapForm.action = link;
  // Create an input
  var mapInput = document.createElement("input");
  mapInput.type = "text";
  mapInput.name = "items";
  mapInput.value = JSON.stringify(data);
  // Add the input to the form
  mapForm.appendChild(mapInput);
  // Add the form to dom
  document.body.appendChild(mapForm);
  // Just submit
  mapForm.submit();
}
