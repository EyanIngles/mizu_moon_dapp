const users = [
    { id: 1, name: "john", age: 16 },
    { id: 2, name: "dylan", age: 22 },
    { id: 3, name: "james", age: 23 }
];

function transform(names): string[] {
    const newNames = names.map((user, index) => index = {
        id: user.id,
        name: user.name,
        age: user.age
    });  
    console.log(newNames)
    return newNames;
}

transform(users);