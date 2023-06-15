import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setFriends } from 'state'
import FlexBetween from './FlexBetween'
import UserImage from './UserImage'


const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {_id} = useSelector((state) => state.user)        //Ανάκτηση της τιμής του _id από το Redux Store
    const token = useSelector((state) => state.token)
    const friends = useSelector((state) => state.user.friends)

    const {palette} = useTheme()            //Ανάκτηση των θεμάτων που έχουν οριστεί μέσω της MUI
    const primaryLight = palette.primary.light
    const primaryDark = palette.primary.dark
    const main = palette.neutral.main
    const medium = palette.neutral.medium

    const isFriend = friends.find((friend) => friend._id === friendId)   //Αναζήτηση ενός φίλου που έχει id ίσο με την τιμή της friendId

    const patchFriend = async () => {
        const response = await fetch(`https://my-social-media-app-server.vercel.app/users/${_id}/${friendId}`,   //Αποστολή ενός PATCH request σε καθορισμένη διεύθυνση
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,       //Εξουσιοδότηση του request
                    'Content-Type': 'application/json'      //Τα δεδομένα αποστέλλονται σε μορφή JSON
                }
            }
        )
        const data = await response.json()
        dispatch(setFriends({ friends: data }))       //Ενημέρωση του state της εφαρμογής με τα νέα δεδομένα των φίλων
    }


    return (
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={userPicturePath} size="55px" />
                <Box onClick={() => {
                        navigate(`/profile/${friendId}`)
                        navigate(0)
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{'&:hover': {color: palette.primary.light, cursor: 'pointer'}
                        }}
                    >{name}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            <IconButton onClick={() => patchFriend()}
                sx={{backgroundColor: primaryLight, p: '0.6rem'}}
            >
                {isFriend ? (<PersonRemoveOutlined sx={{ color: primaryDark }} />
                ) : (<PersonAddOutlined sx={{ color: primaryDark }} />)}
            </IconButton>
        </FlexBetween>
    )
}

export default Friend