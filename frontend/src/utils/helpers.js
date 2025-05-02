export function isValidArray(array) {
  return array && Array.isArray(array);
}

export function reduceToSet(arrays) {
  if (!isValidArray(arrays)) return;
  const res = [];
  for (const array of arrays) {
    if (isValidArray(array)) {
      res.push(...array);
    }
  }
  return new Set(res);
}

export function getLastItem(array) {
  if (!isValidArray(array)) return;
  return array[array.length-1];
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function getAccessToken(){
  return getCookie("access_token")
}