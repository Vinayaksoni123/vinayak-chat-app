import jwt from "jsonwebtoken"

const getToken = async(userid) => {
    try {
        const token = await jwt.sign({ userid }, process.env.JWT_SECRET, {
            expiresIn:"2d"
        })
        return token;
    } catch (error) {
        console.log('jwt token error..')
    }
}
export default getToken;