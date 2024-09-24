export function getPossibleMoveStyles(moves) {
  const styles = {};
  moves.forEach(move => {
      styles[move.to] = {
        backgroundColor: 'rgba(0, 255, 0, 0.3)', // Indicateur visuel léger pour les mouvements
        border: '2px solid green',
        borderRadius: '50%',  // Forme circulaire pour l'indicateur
        boxSizing: 'border-box',
        margin: 'auto'
      };
  });
  return styles;
}
