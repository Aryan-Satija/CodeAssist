const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { PythonShell } = require('python-shell');
const {connect} = require('./config/database.js');
const gameRoutes = require('./routes/games.js');
const userRoutes = require('./routes/users.js');
const roadmapRoutes = require('./routes/roadmap.js');
const potdRoutes = require('./routes/potd.js');
const blogsRoutes = require('./routes/blogs.js');
// const {sendEmail} = require('./controllers/sendEmail.js')
const app = express();
dotenv.config();
app.use(express.json());
const PORT = process.env.PORT || 4000;
connect();
app.use(cors())
app.use('/games', gameRoutes);
app.use('/auth', userRoutes);
app.use('/roadmap', roadmapRoutes);
app.use('/potd', potdRoutes);
app.use('/blogs', blogsRoutes);
app.get('/', (req, res)=>{
    return res.json({
        success: true,
        message: `Server is running at ${PORT}`
    })
});
// app.get('/tmp', async(req, res)=>{
//     await sendEmail("aryansatija2003@gmail.com", "aryan");
//     return res.status(200).json({
//         message: "okok"
//     })
// })
app.listen(PORT, ()=>{
    console.log(`Server is running at ${PORT}`)
})
