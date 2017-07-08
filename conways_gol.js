
go_right = function(board, cell) {
	if (cell === null) {
		return null;
	}
	return ((cell+1) % board.X === 0) ? null : cell + 1;
};
go_left = function(board, cell) {
	if (cell === null) {
		return null;
	}
	return (cell % board.X === 0) ? null : cell - 1;
};
go_up = function(board, cell) {
	if (cell === null) {
		return null;
	}
	return (cell + board.X >= board.SIZE) ? null : cell + board.X;
};
go_down = function(board, cell) {
	if (cell === null) {
		return null;
	}
	return (cell - board.X < 0) ? null : cell - board.X;
};
is_alive = function(board, cell) {
	return cell === null ? false : board.grid[cell].alive;
};


start = function(board, cell) {
	if (cell === null) {
		return;
	}
	board.grid[cell].alive_n = true;
	board.grid[cell].alive = true;
};

new_board = function(X, Y) {
	grid = [];
	for (i = 0; i < X; i++) {
		for (j = 0; j < Y; j++) {
			grid.push({	
				x: i,
				y: j,
				alive: false,
				alive_n: false,
			});
		}
	}

	return {
		grid: grid,
		X: X,
		Y: Y,
		SIZE: X * Y
	};
};

copy_board = function(board) {
    nb = new_board(board.X, board.Y);

    for(i = 0; i < board.SIZE; i++) {
        nb.grid[i].alive = board.grid[i].alive;
        nb.grid[i].alive_n = board.grid[i].alive_n;
    }

    return nb;
};

num_alive_neighboors = function(board, cell) {
	num = is_alive(board, go_right(board, cell)) ? 1 : 0;
	num += is_alive(board, go_right(board, go_down(board, cell))) ? 1 : 0;
	num += is_alive(board, go_down(board, cell)) ? 1 : 0;
	num += is_alive(board, go_down(board, go_left(board, cell))) ? 1 : 0;
	num += is_alive(board, go_left(board, cell)) ? 1 : 0;
	num += is_alive(board, go_left(board, go_up(board, cell))) ? 1 : 0;
	num += is_alive(board, go_up(board, cell)) ? 1 : 0;
	num += is_alive(board, go_up(board, go_right(board, cell))) ? 1 : 0;
	return num;
};

renderCell = function(board, cell) {
	g = board.grid[cell];

	if (g.alive) {
		ctx.fillStyle = 'rgb(0,0,0)';
	} else {
		ctx.fillStyle = 'rgb(255,255,255)';
	}
	ctx.fillRect(g.x * 7, g.y * 7, 50, 50);
};

render = function(board) {
    for(i = 0; i < board.SIZE; i++) {
        renderCell(board, i);
    }
};

step = function(board) {
	// calc next state
	for (i = 0; i < board.SIZE; i++) {
		g = board.grid[i];

		num = num_alive_neighboors(board, i);
		if (num < 2 || num > 3) {
			g.alive_n = false;
		} else if (num === 3) {
			g.alive_n = true;
		}
	}

	// assign new state and renderCell
	for (i = 0; i < board.SIZE; i++) {
		g = board.grid[i];

		g.alive = g.alive_n;
	}
};

loop = function(board) {
    inf = function() {
        step(board, true);
        render(board);
        setTimeout(inf, 100);
    };
    render(board);
    setTimeout(inf, 3000);
};

create = {
	basic_spaceship: function(board, cell) {
		t = go_right(board, go_up(board, cell));
		start(board, go_down(board, t));
		start(board, go_right(board, t));
		start(board, go_up(board, go_left(board, t)));
		start(board, go_up(board, t));
		start(board, go_up(board, go_right(board, t)));
	},
	random: function(board) {
		for (i = 0; i < board.SIZE; i++) {
			if (Math.random() < 0.5) {
				start(board, i);
			}
		}
	}
};

gol = {
	new_board: new_board,
	go_right: go_right,
	go_left: go_left,
	go_down: go_down,
	go_up: go_up,
	start: start,
	create: create,
	step: step,
	loop: loop
};

// b = new_board(100, 100);
// create.basic_spaceship(b, 110);
// // create.random(b);
// new_b = copy_board(b);
// loop(new_b);

num_alive = function(board) {
    total = 0;
    for (i = 0; i < board.SIZE; i++) {
        total += board.grid[i].alive ? 1 : 0;
    }
    return total;
};

target_ratio = 0;
set_target = function() {
    target_ratio = parseFloat(document.getElementById('target').value);
    console.log('target ratio is ', target_ratio);
    update_output();
};

highest_r = 0;
update_output = function() {
    document.getElementById('output').innerHTML = "Target: " + target_ratio.toString() + "   Current best: " + highest_r.toString();
};


NUM_BOARDS = 50;
set_target();

find_target = function() {
    console.log('WHAT THE ACTUAL SHIT JS');
    id = -1;
    boards = [];
    loopId = -1;

    console.log(highest_r, target_ratio);
    while (highest_r < target_ratio) {
        loopId += 1;
        console.log(loopId, highest_r);

        // init board
        b = new_board(100, 100);
        for (j = 45; j < 55; j++) {
            for (k = 40; k < 50; k++) {
                if (Math.random() < 0.08) {
                    start(b, j * 100 + k);
                    start(b, j * 100 + 50 + (50 - k));
                }
            }
        }
        init_b = copy_board(b);
        start_alive = num_alive(b);

        // simulate 100 rounds
        for (j = 0; j < 100; j++) {
            step(b);
        }

        // compare
        end_alive = num_alive(b);
        ratio = start_alive > 0 ? end_alive / start_alive : 0;
        if (ratio > highest_r) {
            highest_r = ratio;
            id = loopId;

            update_output();
        }
        boards.push({
            og: init_b,
            board: b,
            ratio: ratio
        });
    }

    // render(boards[id].board);
    console.log(boards[id].ratio);
    board = boards[id].og;
    loop(board);
};

// form submit
f_target_submit = function(evt) {
    set_target();
    find_target();

    return false;
};

