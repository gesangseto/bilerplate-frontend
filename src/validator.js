export function notEmail(value = "") {
  let email = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/gm);
  return email.test(value)
}

export function isEmailAvailable(value) {
  if (value === "") return true;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value.length > 10);
    }, 500);
  });
}

export function notPhone(value = "") {
  // let regex = new RegExp(/(\+62 ((\d{3}([ -]\d{3,})([- ]\d{4,})?)|(\d+)))|(\(\d+\) \d+)|\d{3}( \d+)+|(\d+[ -]\d+)|\d+/);
  // let regex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
  if (!value || value === '') return true;
  let phone = new RegExp(/^(\+)(\d{10,13})$/);
    // let phone = new RegExp(/(\+62 ((\d{3}([ -]\d{3,})([- ]\d{4,})?)|(\d+)))|(\(\d+\) \d+)|\d{3}( \d+)+|(\d+[ -]\d+)|\d+/);

  return phone.test(value)
}
