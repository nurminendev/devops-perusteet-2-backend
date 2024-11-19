//
// devops-perusteet-2-backend
//
// https://tieto.nurminen.dev/devops-perusteet-2
//
// REST API backend esimerkki
//


import mongoose                     from 'mongoose'


const TodoSchema = new mongoose.Schema({
    text: String,
})

const Todo = mongoose.model('Todo', TodoSchema)


export default Todo
