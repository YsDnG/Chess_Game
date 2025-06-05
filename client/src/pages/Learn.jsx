import '../App.css';
import React, { useState,useEffect } from 'react';

import { WebSocketContext } from '../context/WebSocketContext';
import { useContext } from 'react';
import Header from '../components/Header';
import CardsSection from '../components/CardsSections.jsx';
import CardLearn from '../components/CardLearn.jsx';

// import OpeningInteractiveBoard from '../components/OpeningBoard.jsx';
import OpeningBoard from '../components/OpeningBoard.jsx';

const Learn =()=>{

    const {socket,gameId,playerColor,findOrCreateGame,errorPopup,setErrorPopup,quitGame} = useContext(WebSocketContext)
    const [mediawidth,setmediawidth] = useState(window.innerWidth);
    const [ismobileDevice,setismobileDevice]= useState(false);
    const [openings,setOpenings] = useState([])
   
    const [goalDescription,setGoalDescription]= useState("Choisissez une ouverture pour en apprendre plus ! ")
    const[descriptionTitle,setDescriptionTitle]=useState(null)
    const[movesList,setMoveList]=useState({})
    const [boardSizePx,setboardSizePx]=useState(300)

  //pour OpeningBoard
    const [autoPlay,setAutoPlay]=useState(true);
    const [index,setIndex]= useState(0)
    

      

  const calculateWidth =(width) =>{
    const percent = Math.floor(width*0.3333)
    const clamped = Math.max(350,Math.min(percent,500));
    return clamped;
  }

       /* Maj de la size du board responsiv 50% du screen  */
       useEffect(()=>{
        
        const updateWidth =()=>{
          const widthScreen = window.innerWidth
          setboardSizePx(calculateWidth(widthScreen));
          /**************/
        };
    
        updateWidth(); // initial init
    
        window.addEventListener("resize", updateWidth);
    
        return () => window.removeEventListener("resize", updateWidth);
  },[]);

    useEffect (()=>{
        const openingsFromDb = async()=>{
            try{

              const API_BASE_URL = process.env.NODE_ENV === 'development'? 'http://localhost:8080': 'https://ton-backend.onrender.com';

            const response = await fetch(`${API_BASE_URL}/api/openings`);

 
                const data = await response.json();
                setOpenings(data)
            }
            catch(error){
                console.log("Erreur lors de la recupération des données d'Openings",error)
            }
        }
        openingsFromDb();
    },[]);

    const onClickCard =(openingGoal,name,movesFromBase) =>{
        setGoalDescription(openingGoal);
        setDescriptionTitle(name);
        setMoveList(movesFromBase)
       
    }

 

    return (
        <>
          {errorPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                <p>{errorPopup}</p>
                <button onClick={() => setErrorPopup(null)}>Fermer</button>
              </div>
            </div>
          )}
      
          <div className="App">
          
            <Header />
            <div className={mediawidth < 950 ? "small-media-display" : "desktop-display"}>
            <CardsSection 
            findOrCreateGame={findOrCreateGame}
            quitData={{quitGame,gameId,playerColor}}
            />

            <div className='Learn-section'>    
           
            <div className='Learn-section-card'>
                {openings.map((opening, index) => (
                    <CardLearn 
                    key={opening.id} 
                    titre={opening.name} 
                    description={opening.description}
                    onClick={()=>onClickCard(opening.goal,opening.name,opening.moves)}
                    />
                ))}
                </div>

           
            <div className='Learn-section-Details-openings'>
              <h4>{descriptionTitle}</h4>
                <p> 
                    {goalDescription}
                </p>
            </div>
            <div className='Learn-board-content'>
              <OpeningBoard 
               key={boardSizePx}
                moveList={movesList}
                autoPlayProps={{ autoPlay,setAutoPlay }}
                delay={750}
                boardSizePx={boardSizePx}
                indexProps={{index,setIndex}}
              
              />
              <div className='Learn-board-infos-bars'>

                <button 
                className= {autoPlay ?'Learn-btn-board Active' : 'Learn-btn-board Inactive' }
                onClick={()=>setAutoPlay(!autoPlay)}
                > Auto-Play 
                </button>
               
                <button 
                className='Learn-btn-board'
                onClick={()=> {
                  setAutoPlay(false)
                  
                  setIndex(Math.max(0,index -1)) 
                }}
                > 

                 &lt; Prev
                </button>

                <button 
                className='Learn-btn-board'
                onClick={()=> {
                  setAutoPlay(false)
                  
                  setIndex(Math.min(movesList.length-1,index +1))
                
                }}
                > 

                   Next &gt;
                </button>

              </div>
              <div className='Learn-Opening-Infos-number'>

                <>
                    <label 
                    htmlFor="move-index"
                    className="label-soft"
                    >
                      Position après "X" coups :
                      <input
                          className='input-soft'
                          defaultValue={0}
                            type="number"
                            min="0"
                            max={movesList.length}
                            value={index}
                            onChange={(e) => setIndex(parseInt(e.target.value, 10)) }
                    />
                    </label>
                    

              </>
              <>
                      <label 
                      className='input-soft'
                      type="text"
                      >
                        {`Valeur max : ${movesList.length}`}
                      </label>

              </>

              </div>
             

            </div>
           
                
            </div>
            </div>
        
          </div>
        </>
      );
      
}

export default Learn ;