import jwt from "jsonwebtoken";


//Επαλήθευση ενός JWT και προσθήκη των δεδομένων του χρήστη που αποκτήθηκαν από το JWT, στο request
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) {                       //Αν δεν υπάρχει το token
            return res.status(403).send("Access denied");
        }

        //Αν το token υπάρχει και ξεκινά με την λέξη 'Bearer', τότε η λέξη αυτή αφαιρείται
        if (token.startsWith("Bearer ")) {          
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);     //Επαλήθευση του JWT με χρήση μυστικού κλειδιού
        req.user = verified;
        next();
    } catch (error) {
        res.status(500).json({error: err.message});
    }
};