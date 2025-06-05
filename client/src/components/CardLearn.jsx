import { Card,CardContent } from "./Card";



const CardLearn = ({titre,description,onClick})=>{
    return (
    <Card className={`LearnCard ${titre}`} onClick={onClick}>
    <CardContent>
            <h4> {titre} </h4>
            <p>{description}</p> 
    </CardContent>

    </Card>
    )

}

export default CardLearn;