import Post from '../models/Post.js'
import User from '../models/User.js'


//Δημιουργία ενός νέου post (ανάρτησης)
export const createPost = async (req, res) => {
    try {
        const {userId, description, picturePath} = req.body

        const user = await User.findById(userId)        //Αναζήτηση χρήστη με βάση το id
        const newPost = new Post({userId,               //Δημιουργία ενός post κάνοντας χρήση κάποιων από τα στοιχεία του χρήστη, που βρέθηκε παραπάνω
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save()

        const post = await Post.find()         //Ανάκτηση όλων των posts από την βάση
        res.status(201).json(post)
    } catch (err) {
        res.status(409).json({message: err.message})
    }
}


//Ανάκτηση όλων των posts από την βάση δεδομένων
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find()
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}


//Ανάκτηση όλων των posts ενός συγκεκριμένου χρήστη
export const getUserPosts = async (req, res) => {
    try {
        const {userId} = req.params
        const post = await Post.find({userId})       //Ανάκτηση όλων των posts που αντιστοιχούν σε συγκεκριμένο id χρήστη
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}


//Like ή unlike σε post
export const likePost = async (req, res) => {
    try {
        const {id} = req.params
        const {userId} = req.body

        const post = await Post.findById(id)      //Αναζήτηση συγκεκριμένου post 

        const isLiked = post.likes.get(userId)
        if (isLiked) {                      //Αν ο χρήστης έχει ήδη κάνει like στο συγκεκριμένο post
            post.likes.delete(userId)       //To like αφαιρείται
        } else {                            
            post.likes.set(userId, true)    //Το like 'προστίθεται'
        }

        const updatedPost = await Post.findByIdAndUpdate(id,      //Update του post με τα νέα likes
            {likes: post.likes},
            {new: true}
        )
        res.status(200).json(updatedPost)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}