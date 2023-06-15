import User from '../models/User.js'


//Ανάκτηση των στοιχείων ενός συγκεκριμένου χρήστη
export const getUser = async (req, res) => {
    try {
        const {id} = req.params

        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}


//Ανάκτηση της λίστας των φίλων ενός συγκεκριμένου χρήστη
export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params

        const user = await User.findById(id)
        const friends = await Promise.all(          //Εκτελούνται ασύγχρονα όλες οι αναζητήσεις των φίλων του χρήστη
            user.friends.map((id) => User.findById(id))     //'Προσπέλαση' κάθε φίλου
        )
        const formattedFriends = friends.map(         //Μορφοποίηση του πίνακα friends προκειμένου κάθε object-φίλος να περιλαμβάνει μόνο συγκεκριμένα πεδία
            ({
                _id, firstName, lastName, occupation, location, picturePath
            }) => {
                return {
                    _id, firstName, lastName, occupation, location, picturePath
                }
            }
        )
        res.status(200).json(formattedFriends)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}


//Προσθήκη ή αφαίρεση ενός φίλου από την λίστα φίλων ενός συγκεκριμένου χρήστη
export const addRemoveFriends = async (req, res) => {
    try {
        const {id, friendId} = req.params

        const user = await User.findById(id)
        const friend = await User.findById(friendId)

        if (user.friends.includes(friendId)) {              //Αν ο φίλος βρίσκεται ήδη στη λίστα φίλων του χρήστη
            user.friends = user.friends.filter((id) => id !== friendId)     //Αφαιρείται από την λίστα φίλων του χρήστη
            friend.friends = friend.friends.filter((id) => id !== id)       //Αφαιρείται από την λίστα φίλων του φίλου
        } else {
            user.friends.push(friendId)         //Προστίθεται στη λίστα φίλων του χρήστη
            friend.friends.push(id)             //Προστίθεται στη λίστα φίλων του φίλου
        }
        await user.save()
        await friend.save()

        //Αναζήτηση των φίλων του χρήστη, με βάση την ενημερωμένη λίστα φίλων του
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        )
        const formattedFriends = friends.map(
            ({
                _id, firstName, lastName, occupation, location, picturePath
            }) => {
                return {
                    _id, firstName, lastName, occupation, location, picturePath
                }
            }
        )
        res.status(200).json(formattedFriends)
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}