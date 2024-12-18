const fruits = ["apple", "banana", "cherry"];

fruits.forEach((value, index, array) => {
  console.log(value + "a");
});

// fruits.forEach((fruit) => console.log(fruit));

const isBerry = fruits.map((value) => console.log(value));

const numbers = [1, 2, 3, 4, 5];

const new2 = numbers.forEach((value) => value * 2);
const new1 = numbers.map((value) => value * 2);

console.log(new1); //returns array
console.log(new2); //returns undefined

const new3 = numbers.filter((val, index, array) => val > 3);
console.log(new3);

const redarray = numbers.reduce((prev, val) => prev + val);

const d = new Date(2013, 9, 5);
console.log(d.toDateString());

const months = ["January", "February", "March", "April", "May", "June"];
const m = new Date();
m.setHours(15);
console.log(m);

const today = new Date();
const someDay = new Date();

someDay.setFullYear(2025, 4, 5);

if (someDay > today) {
  text = `that day is ${someDay}`;
} else {
  text = `that day is in the past`;
}
console.log(text);

//finsh calculator app
console.log(today.getDate());
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const allDays = document.getElementById("days");
allDays.innerHTML = days;
const isWed = days.filter((d) => d === "Wednesday");
console.log(isWed.toString());

days.map((da) => {
  if (da === isWed.toString()) {
    console.log(da);
    const newDay = (allDays.innerHTML = da);
    console.log(newDay);
  }
});

const PI = Math.PI;
const E = Math.E;
// console.log(PI);

// console.log(Math.round(PI));
// console.log(Math.ceil(3.9));
// console.log(Math.floor(PI));
// console.log(Math.trunc(PI));
// console.log(Math.pow(E, 3));
// console.log(Math.sqrt(3));
// const neg = Math.abs(-9.9);
// console.log(Math.ceil(neg));
// console.log(Math.sin((90 * Math.PI) / 180));
// console.log(Math.max(numbers[0], numbers[1], numbers[2]));
// console.log(Math.min(numbers[0], numbers[1], numbers[2]));
console.log(Math.floor(Math.random() * 10) + 1); //returns a random number between 0 and n-1

function getRandomInt(min,max){
  return Math.random() 
}


