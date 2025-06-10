
const Header =() =>{

    return(

      <header className="App-header">
      
      <img 
        src={`${process.env.PUBLIC_URL}/img/logo512.png`} 
        alt="logo" 
        style={{ width: "auto", height: "auto",borderRaduis :"2px"}}  
      />
      <h1>
      Master the Basics, Beat the Best !
      </h1>
      

     
      </header>
    )

}

export default Header;