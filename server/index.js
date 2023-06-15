import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'     //Για λόγους ασφαλείας της εφαρμογής
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { verifyToken } from './middleware/auth.js'
import { createPost } from './controllers/posts.js'
import { register } from './controllers/auth.js'
import User from './models/User.js'
import Post from './models/Post.js'
import { users, posts } from './data/index.js'


const __filename = fileURLToPath(import.meta.url)       //Το απόλυτο path του τρέχοντος αρχείου
const __dirname = path.dirname(__filename)          //Το απόλυτο path του καταλόγου (χώρος αποθήκευσης αρχείων) του τρέχοντος αρχείου
dotenv.config()
const app = express()
const PORT = process.env.PORT || 6001

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))   //Ο server δεν επιτρέπει σε άλλες ιστοσελίδες να αποκτήσουν πρόσβαση στους πόρους του (προστασία από επιθέσεις)
app.use(morgan('common'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))      //Πρόσβαση στις εικόνες


const storage = multer.diskStorage({            //Χρήση multer για την επεξεργασία των αρχείων και χρήση diskStorage για τον τρόπο αποθήκευσης των αρχείων στον δίσκο
    destination: function (req, file, cb) {     //Καθορισμός του καταλόγου προορισμού στον οποίο θα αποθηκευτούν τα αρχεία
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {        //Καθορισμός του ονόματος του αρχείου που θα αποθηκευτεί
        cb(null, file.originalname)
    }
})
const upload = multer({storage})        //Διαχείριση των requests που περιέχουν αρχεία και αποθήκευσή τους στον καθορισμένο κατάλογο


//Routes που σχετίζονται με την επεξργασία των αρχείων
app.post('/auth/register', upload.single('picture'), register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)


app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')))   //Ο server θα χρησιμοποιεί τον φάκελο client/build για την παροχή στατικών αρχείων
    
    //Ορίζεται ότι για οποιδήποτε get request, το οποίο δεν αντιστοιχεί σε κάποιο route, θα επιστρέφεται το index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
    })
}


//------------------Σύνδεση με την mongoDB----------------------------
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {console.log("MongoDB connected")
        /* Προσθήκη δοκιμαστικών δεδομένων (μία φορά) */
        // User.insertMany(users)
        // Post.insertMany(posts)
    })
    .catch((error) => console.log(`${error} did not connect`))
//---------------------------------------------------------------------

app.listen(PORT, () =>
  console.log(`\nServer is running on port ${PORT}`),
)