class snake{

PlayerId = null;
body = [];
Direction = 0;
color = null;
size = 10;

constructor(PlayerId, color){
    this.PlayerId = PlayerId;
    this.color = color;
}

move(Direction){
    this.Direction = Direction;

}

grow(Amount){

}

SetDirection(Direction){
    this.Direction = Direction; 
    if(Direction != 180){

    }
    
}

}