import { Children } from "react";
import { WebSocketContext } from "./WebSocketContext";
import { useState,useEffect } from "react";
import { data } from "react-router-dom";



const WebSocketProvider =({children})=>{

     const [socket, setSocket] = useState(null);
    const [gameId, setGameId] = useState('');
    const [playerColor, setPlayerColor] = useState('w'); // Couleur du joueur (blanc/noir)
    const [errorPopup, setErrorPopup] = useState(null);
    

      useEffect(() => {
        const isLocal = window.location.hostname === "localhost";
        const protocol = isLocal ? "ws" : "wss";
        let ws;
    
     
        const setupWebSocket = (host) => {
    
            ws = new WebSocket(`${protocol}://${host}`);
            setSocket(ws);
    
          ws.onopen = () => {
            console.log("✅ Connecté au serveur WebSocket.");
          };
         
      
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            
      
            if (data.type === "gameCreated" ){
              console.log("🎲 Partie active avec ID :", data.gameId);
              setGameId(data.gameId);
              localStorage.setItem("gameId", data.gameId);
              setPlayerColor(data.color);
            }

            if (data.type === "gameJoined" ){
              console.log("🎲 Partie active avec ID :", data.gameId," Le joueur qui rejoins à la couleur:",data.color);
              setGameId(data.gameId);
              localStorage.setItem("gameId", data.gameId);
              setPlayerColor(data.color);
              
            }
            if (data.type === "gameStart") {
              console.log("🚀 La partie commence !");
            }
      
            if (data.type === "gameOver") {
              console.log("📩 Réception de gameOver :", data);
            }
          };
    
          ws.onclose = () => {
            console.warn("🔌 Connexion WebSocket fermée.");
            
            // 🔁 Reconnexion automatique après délai
            setTimeout(() => {
              console.log("🔁 Tentative de reconnexion WebSocket...");
              setupWebSocket(host);
            }, 3000); // retry après 3s
          };
        };
    
      
        if (isLocal) {
          const host = "localhost:8080";
            setupWebSocket(host);
        } else {
          fetch("https://backend-public-ngrok.onrender.com/api/ngrok")
            .then((res) => res.json())
            .then((data) => {
              if (data.url) {
                const url = new URL(data.url);
                const host = url.host;
                setupWebSocket(host);
              } else {
                console.warn("Pas d'URL ngrok disponible !");
              }
            })
            .catch((err) => {
              console.error("Erreur lors de la récupération de l'URL ngrok :", err);
              return null;
            });
        }
    
      
     
      
        return () => {
            if (ws) ws.close();
          };
        
      }, []);


      const findOrCreateGame = () => {
        console.log("📤 Recherche ou création d'une partie...");
      
        if (!socket || socket.readyState !== WebSocket.OPEN) {
          console.warn("🚫 WebSocket non prêt. Serveur déconnecté ?");
          setErrorPopup("❌ Impossible de se connecter au serveur. Veuillez réessayer plus tard.");
          return;
        }
      
        try {
          quitGame(gameId,playerColor)
          socket.send(JSON.stringify({ type: "findOrCreateGame" }));
          console.log("✅ Requête findOrCreateGame envoyée au serveur.");
        } catch (err) {
          setErrorPopup("❌ Le serveur semble hors ligne.");
          console.error(err);
        }
      };

      const quitGame = (gameId,playerColor)=>{
        if(!socket)
            return;
          console.log("Le joueur à quitté la partie");

          socket.send(JSON.stringify({ 
            type: "abandon", 
            gameId, 
            playerColor 
          }));
          
            
      }


    return(
        <WebSocketContext.Provider value={{socket,gameId,playerColor,findOrCreateGame,errorPopup,setErrorPopup,quitGame}}>
            {children}
        </WebSocketContext.Provider>
    )

}

export default WebSocketProvider;