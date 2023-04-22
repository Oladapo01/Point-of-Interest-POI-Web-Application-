import userDAO from '../dao/userDAO.mjs'
export default {
    login(req, res){
        const {username, password} = req.body;
        if(!username || !password){
            res.status(400).json({error: 'Missing username or password'});
            return;
        }
        const user = userDAO.getUserByUsernameAndPassword(username, password);
        if(user){
            // Store the user in the session
            req.session.user = {
                id: user.id,
                username: user.username
            };
            res.json({message: 'Login successful'});
        } else {
            res.status(401).json({error: 'Invalid username or password'});
        }
    },
    logout(req, res){
        req.session.destroy(()=>{
            res.json({message: 'Logout successful'});
        });
    },
    getUser(req, res){
        if(req.session.user){
            res.json(req.session.user);
        }else{
            res.status(401).json({error: 'Not logged in'});
        }
    }
}