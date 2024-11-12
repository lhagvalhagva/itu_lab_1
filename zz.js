
function gcb(a, b) {
  return b === 0 ? a : gcb(b, a % b);
}
function lcm(a, b) {
  return (a * b) / gcb(a, b);
}

function findLCM(a, b, c, d, e) {
  return lcm(lcm(a, b), lcm(c, lcm(d, e)));
}

function main() {
  console.log(findLCM(12, 18, 28, 36, 48));
}

main();

