import React from 'react'
import { Avatar } from '@mui/material'
import { stringAvatar } from "../functions/stringAvatar";

function ProfilePicture(props) {
    const { user } = props
    return (
        <>
            {user.profile_picture_type === "gravatar" && <Avatar {...props} src={"https://www.gravatar.com/avatar/" + email_md5} />}
            {user.profile_picture_type === "local" && <Avatar {...props} src={user.profile_picture} />}
            {!user.profile_picture_type && <Avatar {...props} {...stringAvatar(user.name)} />}
        </>
    )
}

export default ProfilePicture