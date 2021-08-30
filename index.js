var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const { argsToArgsConfig } = require('graphql/type/definition');

var contacts = [
  {
    id: 0,
    name: "peter parker",
    age: 21,
    email: "peter@mit.edu",
    courses: [
      {"number": "1.00","name":"engr comp"},
      {"number": "3.00","name":"intro bio"}
    ]
  },
  {
    id: 1,
    name: "bruce wayne",
    age: 32,
    email: "bruce@mit.edu",
    courses: [
      {"number": "2.00","name":"intro ME"},
      {"number": "3.00","name":"intro MS"}
    ]
  },
  {
    id: 2,
    name: "diana prince",
    age: 25,
    email: "diana@mit.edu",
    courses: [
      {"number": "2.00","name":"intro arch"},
      {"number": "1.00","name":"intro chem"}
    ]
  }
]
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    contact(id:Int): Contact
    contacts: [Contact]
  },
  type Contact {
    id: Int
    name: String,
    age: Int,
    email: String,
    courses: [Course]
  },
  type Course {
    number: String,
    name: String
  },
  input ContactInput {
    name: String
    email: String
    age: Int
  },
  type Mutation {
    setContact(input:ContactInput): Contact
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  contact: (arg)=>contacts[arg.id],
  contacts: () => contacts,
  setContact : ({input})=>{
    contacts.push({name:input.name,email:input.email,age:input.age});
    return input;
  }
  
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, ()=>console.log("Running graphQL on Port: 4000"));