const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const task = []

app.post('/api/v1/task', (req, res, next) => {

    const newtask = {
        name: req.body.name,
        task_id: task.length || 0,
        task_description: req.body.description,
        assign_to: req.body.assign_to,
        isCompleted: req.body.isCompleted,
        assignBy: "req.user.userid",
        lastUpdatedDate: Date.now()
    }

    if (nameDescriptionChecker(req.body) || !booleanChecker(newtask.isCompleted)) {
        return next(400)
    }



    task.push(newtask)
    res.status(200).send({
        message: "sucess",
        newTask: newtask
    })
})

app.get('/api/v1/task', (req, res, next) => {
    if (!task.length) {
        next(404)
    }
    if (req.query.length) {

        const limit = req.query.limit
        // if(limit>task.length){

        // }
        task.length = limit
    }
    res.status(200).send({
        response: { ...task }
    })
})

app.get('/api/v1/task/:id', (req, res, next) => {
    const searchedTasked = task.filter((ele) => ele.task_id == req.params.id)

    if (!searchedTasked.length) {
        return next(404)
    }
    res.status(200).send({
        message: "success",
        response: searchedTasked
    })
})

app.put('/api/v1/task/:id', (req, res, next) => {
    const findTaskById = task.findIndex((ele) => ele.task_id == req.params.id)

    if (!findTaskById) {
        next(404)
    }

    if (nameDescriptionChecker(req.body)) {
        return next(400)
    }



    task[findTaskById] = req.body
    res.status(200).send({
        message: "Task Replaced",
    })

})


app.patch('/api/v1/task/:id', (req, res, next) => {
    const findTaskById = task.findIndex((ele) => ele.task_id == req.params.id)

    if (!findTaskById) {
        return next(404)
    }

    const nameAndDescriptionValidation = nameDescriptionChecker(req.body)
    const booleanValidation = booleanChecker(req.body.isCompleted)

    if (nameAndDescriptionValidation || !booleanValidation) {
        return next(400)
    }

    task[findTaskById] = {
        name: req.body.name,
        task_id: task.length || req.params.id,
        task_description: req.body.description,
        assign_to: req.body.assign_to,
        assignBy: "req.user.userid",
        lastUpdatedDate: Date.now()
    }
    res.status(200).send({
        message: "Task updated",
    })
})

app.delete('/api/v1/task/:id', (req, res, next) => {
    const findTaskById = task.findIndex((ele) => ele.task_id == req.params.id)
    if (!findTaskById) {
        next(404)
    }
    task.pop(findTaskById)
    res.status(400).send({
        message: "Task Deleted",
    })
})

function nameDescriptionChecker(data) {
    if (!data.name || !data.description) {
        return true
    }
    return false
}

function booleanChecker(data) {
    if (typeof data === 'boolean') {
        return true;
    }

    return false;
}

app.use((err, req, res, next) => {
    if (err == 404) {
        res.status(404).send({
            status: "Error",
            message: "no task found "
        })
    }

    if (err == 400) {
        res.status(400).send({
            status: "Error",
            message: "Invalid Inputs"
        })
    }

    res.status(500).send({
        status: "Error",
        message: err
    })
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;