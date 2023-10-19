const express = require('express')
const DB = require('./config/db')
const cors = require('cors')
const UserModel = require('./schema/user')
const BlogModel = require('./schema/blog')
const jwt = require('jsonwebtoken')


DB.connect()
const app = express()
app.use(express.json())
app.use(cors())

function authorize(req, res, next){
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, 'secret')
    if(decoded){
        req.user = decoded
        next()
    }else{
        res.json({status: false, message: "Unauthorized"})
    }
}


app.post('/signup',async(req, res)=>{
    try{
        const user = new UserModel({
            username: req.body.name,
            password: req.body.password,
            role: 'user'
        })

        const response = await user.save()
        res.json({ status: true })
    }
    catch(err){
        res.json({status: false, message: "Something went wrong"})
    }
})

app.post('/login',async(req, res)=>{
    const {name, password } = req.body;
    const user = await UserModel.findOne({username: name})
    if(user){
        if(user.password === password){
            const payLoad = {name: user.username, role: user.role}
            const token = jwt.sign(payLoad, 'secret',{expiresIn: "2hr"})

            res.json({status: true, role: user.role, token})
        }else{
            res.json({status: false, message: "Wrong password"})
        }
    }else{
        res.json({status: false, message: "There is no user with this username"})
    }
})

app.post('/createBlog', async(req, res) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, 'secret')
        console.log(decoded)
        if (decoded.role === 'admin') {
            const blog = new BlogModel({
                title: req.body.title,
                content: req.body.content,
                author: decoded.name,
                approved: true
            })
            const response = await blog.save()
            res.json({ status: true, message: "Blog Created successfully" })

        } else {
            const blog = new BlogModel({
                title: req.body.title,
                content: req.body.content,
                author: decoded.name,
                approved: false
            })
            const response = await blog.save()
            res.json({ status: true, message: "Blog is created , you can see the blog after get approve from admin" })
        }
    }catch(error){
        console.log(error)
        res.json({status: false, message: "Something went wrong"})
    }
})


app.post('/editBlog', authorize,async(req, res) => {
    try{
        const { title, content, id } = req.body
        await BlogModel.updateOne({ _id: id }, {
            $set: {
                title,
                content
            }
        })
        res.json({ status: true, message: "Blog is updated" })
    }catch(error){
        res.json({status: false})
    }
})


app.get('/deleteBlog/:id', authorize, async(req, res) => {
    try{
        console.log(req.params.id)
        await BlogModel.deleteOne({ _id: req.params.id })
        res.json({ status: true, message: "Blog is deleted" })
    }catch(error){
        console.log(error)
    }
})

app.get('/blogs', authorize, async(req, res) => {
    try{
        const response = await BlogModel.find({approved: true})
        res.json({status: true, blogs: response})
    }catch(error){
        res.json({ status: false, message:'Something went wrong' })
    }
})

app.get('/all-blogs', authorize, async(req, res) => {
    try{
        const response = await BlogModel.find({})
        res.json({status: true, blogs: response})
    }catch(error){
        res.json({ status: false, message:'Something went wrong' })
    }
})

app.get('/approveBlog/:id', authorize, async (req, res) => {
    try {
        const blog = await BlogModel.findById(req.params.id)
        if(blog){
            await BlogModel.updateOne({_id: req.params.id},{approved: !blog.approved})
            res.json({ status: true , message: 'Approved'}) 
        }else{
            res.json({ status: false, message: 'Something went wrong' })
        }
    } catch (error) {
        res.json({ status: false, message: 'Something went wrong' })
    }
})

app.listen(4000, ()=>{
    console.log("server listening on the port 4000")
})