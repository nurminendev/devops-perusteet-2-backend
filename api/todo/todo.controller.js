//
// devops-perusteet-2-backend
//
// https://tieto.nurminen.dev/devops-perusteet-2
//
// REST API backend esimerkki
//


import logger       from '../../logger.js'

import Todo         from '../../models/todo.model.js'


/*
 * GET /api/todo 
 *
 * Palauttaa listan tietokannassa olevista Todo-riveistä
 */
export async function index(req, res) {
    logger.logRequest(req, 'todo/index')

    try {
        const select = 'text'

        const todos = await Todo.find({}, select).lean().exec()

        return res.status(200).json(todos)
    } catch(error) {
        logger.error(error)
        return res.status(500).send(error)
    }
}


/*
 * POST /api/todo 
 *
 * Luo uuden Todo-rivin tietokantaan
 */
export async function create(req, res) {
    logger.logRequest(req, 'todo/create')

    // Yksinkertainen validaatio selaimesta tullelle datalle
    if(!req.body?.text) {
        return res.status(400).json({ error: `"text" kenttä vaaditaan` })
    }

    try {
        const uusiTodo = await Todo.create(req.body)

        return res.status(200).json(uusiTodo)
    } catch(error) {
        logger.debug(error)

        return res.status(500).json({ error: error.message })
    }

}


/*
 * PATCH /api/todo/:id
 *
 * Päivittää olemassaolevan Todo-rivin tekstin tietokannassa
 */
export async function patch(req, res) {
    logger.logRequest(req, 'todo/patch')

    // Yksinkertainen validaatio selaimesta tullelle datalle
    if(req.body?.text === undefined) {
        return res.status(400).json({ error: `"text" kenttä vaaditaan` })
    }

    // Päivitetty TODO rivin teksti jonka frontend lähetti
    const paivitettyTodoTeksti = req.body.text

    // Todo rivin mongo ID löytyy req.params:sta, kentän nimi on määritelty api/todo/index.js
    // tiedostossa
    const todoId = req.params.id

    // MongoDB päivityksen sisältö, päivitämme rivin "text" kentän uuteen
    const todoUpdate = { text: paivitettyTodoTeksti }

    // Haluamme että kutsu palauttaa rivin päivityksen jälkeen (vaikka emme päivitetyllä rivillä
    // tässä esimerkissä mitään teekkään)
    const options = { returnDocument: 'after' }

    try {
        // Aja MongoDB rivin päivitys käyttäen findByIdAndUpdate() mongoose funktiota
        const updatedTodoItem = await Todo.findByIdAndUpdate(todoId, todoUpdate, options)
            .select('text').lean().exec()

        // Jos kutsu ei palauta päivitettyä riviä, tarkoittaa se että ID oli väärää syystä tai toisesta
        if(!updatedTodoItem) {
            logger.debug(`todo/patch: Todo-riviä ID:llä "${todoId}" ei löydy`)
            return res.status(404).json({ error: `Todo-riviä ID:llä "${todoId}" ei löytynyt` })
        }

        // Palautetaan HTTP 200 ja päivitetty TODO rivi
        return res.status(200).json(updatedTodoItem)
    } catch(error) {
        logger.debug(error)

        return res.status(500).json({ error: error.message })
    }
}


/*
 * DELETE /api/todo/:id
 *
 * Poistaa Todo-rivin tietokannasta
 */
export async function destroy(req, res) {
    logger.logRequest(req, 'todo/destroy')

    const todoId = req.params.id

    try {
        const todoItem = await Todo.findById(req.params.id, '_id').exec()

        if(!todoItem) {
            logger.debug(`todo/destroy: Todo-riviä ID:llä "${todoId}" ei löydy`)
            return res.status(404).json({ error: `Todo-riviä ID:llä "${todoId}" ei löytynyt` })
        }

        // Poista TODO-rivi
        await todoItem.deleteOne()

        return res.status(200).end()

    } catch(error) {
        logger.error(error)
        return res.status(500).send(error)
    }
}
