//
// devops-perusteet-2-backend
//
// https://tieto.nurminen.dev/devops-perusteet-2
//
// REST API backend esimerkki
//


export function isAuthenticated(req, res, next) {
    // HUOM; tämä on vain esimerkki - "dummy" todennus tsekki

    // Oikeasti tässä haluttaisiin validoida esim. evästeestä tuleva JWT

    // Tarkistetaan pääsy X-Todo-Avain headerin perusteella
    const todoAvain = req.headers['x-todo-avain']

    if(!todoAvain) {
        return res.status(401).json({ error: 'Todennusavainta ei löydetty' })
    }

    if(todoAvain !== process.env.TODO_AVAIN) {
        return res.status(401).json({ error: 'Väärä todennusavain' })
    }

    // Salli pääsy eteenpäin routessa
    next()
}
