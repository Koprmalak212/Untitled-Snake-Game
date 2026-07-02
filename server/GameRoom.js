class GameRoom {
    Players = [];
    food = [];
    GridWidth = 0;
    GridHeight = 0
    tickrate = 0;



    addPlayer = (player) => {
        this.Players.push(player);
    }

    RemovePlayer = (player) => {
        this.Players = this.Players.filter(p => p.PlayerId !== player.PlayerId);
    }

    StartGameLoop = () => {
        setInterval(() => {
            this.UpdateGame();
        }, 1000 / this.tickrate);

    }


    UpdateGame = () => {
        this.Players.forEach(player => {
            player.move(player.Direction);
        });


    }

    CheckCollisions = () => {



    }


    SpawmFood = () => {
        let food = new Food();
        food.id = this.food.length + 1;
        food.x = Math.floor(Math.random() * this.GridWidth);
        food.y = Math.floor(Math.random() * this.GridHeight);
        this.food.push(food);
    }

    BroadcastGameState = () => {
        let gameState = {
            players: this.Players.map(player => ({
                PlayerId: player.PlayerId,
                body: player.body,
                Direction: player.Direction,
                color: player.color,
                size: player.size
            })),
            food: this.food
        };
    }

    getGameState = () => {
        let gameState = {
            players: this.Players.map(player => ({

            })),
            food: this.food
        };
        return gameState;
    }   



}