const { handle422 } = require("../helper/errorHandler");

const createGroup = async (req, res)=>{
    try {
        const {name, members, groupImage} = req.body;

        const adminId = req.user._id;

        if(!name || !members || members.length === 0){
            return handle422(res, "")
        }
    } catch (error) {
        
    }
}