import { Link } from "react-router-dom";
import { BookOpen, Home, Users } from "lucide-react";
import { Card, CardContent } from "./Card";

const CardsSection = ({ findOrCreateGame,quitData}) => {

  const { quitGame, gameId, playerColor } = quitData;


  return (
    <div className='cards-section'>


         {/* Section S'entraîner */}
         <Link to="/">
      <Card className="Card Train"
       onClick={()=>quitGame(gameId,playerColor)}
      >
        <CardContent>
          <Home size={34} />
          <h2 className="text-xl font-semibold">S'entraîner</h2>
          <p className="text-[#D4D4D4] mt-2">Pratiquez contre l'ordinateur et améliorez votre niveau.</p>
        </CardContent>
      </Card>
      </Link>

      {/* Section Apprendre */}
      <Link to="/learn">
        <Card className="Card Learn"
        onClick={()=>quitGame(gameId,playerColor)}
        >
          <CardContent>
            <BookOpen className="icon" size={34} />
            <h2>Apprendre</h2>
            <p>Découvrez les bases des échecs et améliorez votre stratégie.</p> 
          </CardContent>
        </Card>
      </Link>

      {/* Section Affronter */}
      <Link to ="/multiPlayer">
        <Card className="Card Versus" 
        onClick={findOrCreateGame}
        >
          <CardContent>
            <Users size={34} />
            <h2 className="text-xl font-semibold">Affronter</h2>
            <p className="text-[#D4D4D4] mt-2">Jouez en ligne contre d'autres débutants et mettez vos compétences à l'épreuve.</p> 
          </CardContent>
        </Card>
      </Link>

    </div>
  );
};

export default CardsSection;
