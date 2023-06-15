import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'


//Εγγραφή ενός νέου χρήστη
export const register = async (req, res) => {
    try {
        const {firstName, lastName, email, password, picturePath, friends, location, occupation} = req.body    //Τα στοιχεία που εισάγει ο χρήστης

        //Κρυπτογράφηση του password με βάση το salt
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        //Δημιουργία του νέου χρήστη και αποθήκευση στη βάση δεδομένων
        const newUser = new User({firstName, lastName, email, password: passwordHash, picturePath, friends, location, occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const savedUser = await newUser.save()

        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


//Σύνδεση ενός χρήστη
export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        
        const user = await User.findOne({email: email})      //Αναζήτηση του χρήστη με βάση το εισαχθέν email
        if (!user){                                          //Αν ο χρήστης δεν υπάρχει στη βάση
            return res.status(400).json({ msg: 'User does not exist.' })
        }

        //Αν ο χρήστης υπάρχει στη βάση, τότε ελέγχουμε αν το εισαχθέν password ταιριάζει με το αποθηκευμένο κρυπτογραφημένο password του χρήστη
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){                                          //Αν το password δεν ταιριάζει
            return res.status(400).json({ msg: 'Invalid credentials.' })
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET)    //Αν το password ταιριάζει, δημιουργείται ένα JWT για τον χρήστη
        delete user.password                //Αφαίρεση του κρυπτογραφημένου password για λόγους ασφαλείας

        res.status(200).json({token, user})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}