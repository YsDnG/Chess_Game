import { handleMove } from "../utils/GameState";
import React from "react";

const MoveRecapComponents = ({move}) =>{
    return (
        < div className="move-recap-component">
             <h4> Historique des coups</h4>
             <div className="display-move-recap">
             <ul>
                {
                    move.map((move,index)=>(
                        <li key ={index}>
                        {index % 2 === 0 ? `${index +1}: White: ${move}` : `${index +1}: Black: ${move}`} 
                        </li>
                    
            ))}
             </ul>
             </div>
        </div>

    )
}

export default MoveRecapComponents;