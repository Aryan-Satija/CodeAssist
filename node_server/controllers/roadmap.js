const data = require('../roadmap.json');
exports.Roadmap = async(req, res) => { 
    try{
        const {rating} = req.body;
        const roadmap = [];
        data.forEach((item) => {
            if(rating >= item.min && rating <= item.max){
                roadmap.push(item.topic)
            }
        });
        return res.status(200).json({
            success: true,
            data : roadmap
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        });
    }
}

exports.RoadmapV2 = async(req, res)=>{
    try{
        const {rating} = req.body;
        const roadmap = [];
        data.forEach((item) => {
            if(rating >= item.min && rating <= item.max){
                let obj = {
                    id: item.topic,
                    children: []
                }
                if(item.subtopics === undefined){
                    item.subtopics = []
                }
                item.subtopics.forEach((subitem)=>{
                    if(rating >= subitem.min && rating <= item.max){
                        let newobj = {
                            id: subitem.name,
                            children: []
                        }
                        if(subitem.subtopics === undefined){
                            subitem.subtopics = []
                        }
                        subitem.subtopics.forEach((subsubitem)=>{
                            if(rating >= subsubitem.min && rating <= subsubitem.max){
                                newobj.children.push({id: subsubitem.name})
                            }
                        })
                        obj.children.push(newobj);
                    }
                })
                roadmap.push(obj);
            }
        });
        return res.status(200).json({
            success: true,
            data: roadmap
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}