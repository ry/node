// wrapper line
debugger;
debugger;
function a(x) {
  var i = 10;
  while (--i != 0);
  debugger;
  return i;
};
function b() {
  return ['hello', 'world'].join(' ');
};
a();
a(1);
b();
b();
