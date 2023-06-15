import { createSlice } from '@reduxjs/toolkit'


//Αρχικό state του slice
const initialState = {
    mode: 'light',
    user: null,
    token: null,
    posts: []
}

//Δημιουργία ενός slice στο Redux store
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {             //Ενέργειες οι οποίες μπορούν να εκτελεστούν στο slice
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light'
        },
        setLogin: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setLogout: (state) => {
            state.user = null
            state.token = null
        },
        setFriends: (state, action) => {
            if (state.user) {
                state.user.friends = action.payload.friends
            } else {
                console.error('user friends dont exist :(')
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id)
                    return action.payload.post
                return post
            })
            state.posts = updatedPosts
        }
    }
})

//Εξαγωγή των actions και του reducer του slice
export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } = authSlice.actions
export default authSlice.reducer