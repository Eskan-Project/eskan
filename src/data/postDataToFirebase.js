import { getDatabase, ref, push, set } from "firebase/database";
import db from "../config/firebase";
const db = getDatabase();
const usersRef = ref(db, "users");

// Array of objects
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];

// Save each object with a unique key
users.forEach((user) => {
  const newUserRef = push(usersRef); // Generates a unique key
  set(newUserRef, user);
});
