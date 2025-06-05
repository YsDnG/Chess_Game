#!/usr/bin/bash
cleanup() {
    echo "🧹 Nettoyage..."
    rm -f "$IPFILE"


    tmux kill-server
   

  echo "✅ Tout fermé, prêt pour un nouveau run."
}


SESSION=server-echec

SERVERPATH="/home/ysdng/chess_game/server"

IPFILE="$SERVERPATH/adressIp.txt"


cd "$SERVERPATH" || exit 1

rm adressIp.txt

tmux new-session -d -s $SESSION -c "$SERVERPATH" -n ws

tmux send-keys -t $SESSION 'node wss-server.js' C-m

tmux split-window -v

tmux send-keys -t $SESSION 'ngrok http https://localhost:8080 ; tmux wait-for -S ngrok-done' C-m

# Attente de l'URL ngrok

echo "⏳ Attente de l'URL publique de ngrok..."

while true ; do
URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[a-zA-Z0-9]\{4\}-[^"]*')


    if [ -n "$URL" ]; then 
        echo "$URL" > "$IPFILE"
        echo " ✅ ngrok URL READY : ->  $URL"
        break
    fi
sleep 1
done 

curl -X POST https://backend-public-ngrok.onrender.com/api/ngrok \
  -H "Content-Type: application/json" \
  -d '{"url":"'"$URL"'"}'



read -p "Appuie sur "o" pour attacher à tmux(CRTL C --> ngrok puis CTRL B + D pour lancer clean up quand terminé ), ou n'importe qu'elle autre touche pour fermer et clean up ici : " action

if [ "o" = "$action" ]; then
  # Activer la souris
    tmux set-option -t $SESSION mouse on
    # Attache-toi à tmux maintenant
    tmux attach -t $SESSION 
else
    tmux kill-server
fi




tmux wait-for ngrok-done
cleanup









