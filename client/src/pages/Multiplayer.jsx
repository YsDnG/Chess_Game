import Header from "../components/Header";
import CardsSection from "../components/CardsSections";
import { WebSocketContext } from '../context/WebSocketContext';
import { useContext, useState,useEffect } from 'react';
import ChessboardComponent from "../components/ChessboardComponents";



const MultiPlayer =()=>{

     const {socket,gameId,playerColor,findOrCreateGame,errorPopup,setErrorPopup,quitGame} = useContext(WebSocketContext)

     const [mediawidth, setMediawidth] = useState(window.innerWidth);
    const [ismobileDevice,setismobileDevice]= useState(false);
    const [boardSizePx,setboardSizePx]=useState(300)


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
    return(

        <>
            <div className="App Multi">
           
                <Header/>
                <div className={mediawidth < 950 ? "small-media-display" : "desktop-display"}>
                <CardsSection 
                findOrCreateGame={findOrCreateGame}
                quitData={{quitGame,gameId,playerColor}}
            />

            <ChessboardComponent 
            key={gameId || "solo"}
            socket={gameId ? socket : null}
            gameId={gameId}
            playerColor={playerColor}
            boardSizePx={boardSizePx}
            
          />
    </div>

            </div>
        </>
    )
}

export default MultiPlayer ;